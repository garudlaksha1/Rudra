var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , AdmZip = require('adm-zip')
  , fstream = require('fstream')
  , mongoDB = require('./mongoDB.js')
  , querystring = require('querystring')
  , path = require('path');

var app = express();
//var scanID = 0;
var clientID;
var sessionID;
var server = process.argv[2];
var serverPort = process.argv[3];
var clientPort = process.argv[4];
var Clientdata;

app.configure(function(){
  app.set('port', process.env.PORT || clientPort);
  app.use(express.bodyParser());
});

app.get("/tool/:action/:toolID/:sessionID", function(req, res){
  var toolID = req.params.toolID;
  var action = req.params.action;
  var session = req.params.sessionID;
  console.log(toolID);
  if (session == sessionID){
    if (action == "getinfo"){
      mongoDB.getToolMapping(toolID, function(data){
        console.log(JSON.stringify(data));
        if (data != "nil"){
          var toolToCall = require(data.toolNPM);
          toolToCall.getToolInfo(function(toolInfo){
            res.contentType('application/json');
            res.status(200).send(JSON.stringify(toolInfo));
          });
        } else {
          res.status(404).send("invalid tool id");
        } 
      });
    } else {
      res.status(404).send("invalid action");
    }
  } else {
    res.status(404).send("invalid session");
  }
});

app.post("/tool/:action/:toolID/:scanID/:sessionID", function(req, res){
  var toolID = req.params.toolID;
  var action = req.params.action;
  var scanID = req.params.scanID;
  var session = req.params.sessionID;
  var toolRunInfo = req.body;
  if(session == sessionID){
    if (action == "runtool"){
      mongoDB.getToolMapping(toolID, function(data){
        console.log(JSON.stringify(data));
        if (data != "nil"){
          var toolToCall = require(data.toolNPM);
          //scanID = scanID + 1;
          toolToCall.runTool(scanID, toolRunInfo, function(reportData){
            //res.contentType('application/json');
            mongoDB.storeJSONReportInDB(reportData, function(status){
              if(status == "ok"){
                //call reporting on server
                var options = {
                  host: server,
                  port: serverPort,
                  path: '/reportsubmit/',
                  method: 'POST',
                  headers: {
                    'content-type':'application/json'
                  }
                };
                var req = http.request(options, function(res) {
                  res.setEncoding('utf8');
                  res.on('data', function (chunk) {
                    console.log("server report added: " + chunk);
                  });
                });
                req.write(JSON.stringify(reportData));
                req.end();
              } else { 
                console.log("error inserting in db");
                res.status(404).send("error in action");     
              }
            });
          });
          res.status(200).send("ok");
        } else {
          res.status(404).send("invalid tool id");
        }    
      });
    } else {
      res.status(404).send("invalid action");
    }
  } else {
    res.status(404).send("invalid session");
  }
});

app.post('/toolconfig/addtool/:toolID/:toolName/:toolNPM/:sessionID', function(req, res) {
  //console.log(req.files);
  var toolID = req.params.toolID;
  var toolName = req.params.toolName;
  var toolNPM = req.params.toolNPM;
  var session = req.params.sessionID;
  
  if(session == sessionID){ 
    var toolData = {"toolID":toolID, "toolName":toolName, "toolNPM":toolNPM};
    console.log(JSON.stringify(toolData));

      fs.readFile(req.files.module.path, function (err, data) {
        var newPath = __dirname + "/"+req.files.module.name;
        fs.writeFile(newPath, data, function (err) {
          if (err) throw err;
          var zip = new AdmZip(newPath);
          zip.extractAllTo(/*target path*/"./node_modules/", /*overwrite*/true);
          mongoDB.addToolinfo(toolData, function(status){
            if (status == "ok"){
              res.status(200).send("done");
            } else { 
              console.log("error inserting in db");
              res.status(404).send("error in action");     
            }
          });     //mongo close
        });
      });
  } else {
    res.status(404).send("invalid session ID");
  }  
});

app.post('/engineconfig/', function(req, res) {
// Configure engine here.
});

function register(){
  var configPath = path.join(path.dirname(fs.realpathSync(__filename)), '/');
  fs.readFile(configPath + 'clientID.txt', 'utf8', function(err, Clientdata){
    if (err) throw err;
    clientPort = clientPort.replace(/(\r\n|\n|\r)/gm,"");
    Clientdata = Clientdata.replace(/(\r\n|\n|\r)/gm,"");
    clientID = Clientdata;
    var options = {
      host: server,
      port: serverPort,
      path: "/register/"+clientPort+"/"+clientID,
      method: 'GET'
    };
    callback = function(response) {
      var str = '';
      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        console.log(clientID)
        if(clientID == "0"){
          console.log(str);
          var data = JSON.parse(str);
          console.log(data.clientID);
          
          fs.writeFile(configPath + "clientID.txt", data.clientID, function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("New ID updated");
              clientID = data.clientID; 
              heartBeat();
            }
          }); 
        } else {
          heartBeat();
        }   
      });
    }
    http.request(options, callback).end();  
  });
}

function heartBeat(){
  //var request = require('request');
  var resData = {
    "toolList":[]
  };
  mongoDB.getAllToolID(function(data){
    for(var i=0; i<data.length; i++){
      resData.toolList.push(data[i].toolID);
    }
    
    var pathStr = "/heartbeat/"+clientID;
    console.log(resData);
    var data = querystring.stringify(resData);

    var options = {
      host: server,
      port: serverPort,
      path: pathStr,
      method: 'POST',
      headers: {
        'content-type':'application/json'
      }
    };

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      var str = '';
      res.on('data', function (chunk) {
        str += chunk;
      });
      res.on('end', function(){
        sessionID = JSON.parse(str).sessionID;
        console.log(sessionID);
      });
    });
    req.write(JSON.stringify(resData));
    req.end();

    setTimeout(heartBeat, 10000);
  });  
}

register();

http.createServer(app).listen(app.get('port'), function(){
  console.log("listening");
});
