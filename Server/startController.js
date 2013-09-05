var FormData = require('form-data');
var fs = require('fs');
var http = require('http');
var express = require('express');
//var querystring = require('querystring');
//As of now, assumes to be on similar folder
var db = require('./dbUtility.js');
var scanID = 0;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4040);
  app.use(express.bodyParser());
});

app.post('/gettoolinfo/', function(req, res){
  var toolData = req.body;
  var clientID = toolData.clientID;
  var toolID = toolData.toolID;
  console.log(toolData);
  db.getClientData(clientID, function(clientData){
    var options = {
      host: clientData.clientIP,
      port: clientData.clientPort,
      path: "/tool/getinfo/"+toolID,
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
        console.log(str);
        res.send(str);
      });
    }
    http.request(options, callback).end();  
  });
});

app.post('/runtool/:clientID/:toolID', function(req, res){
  var clientID = req.params.clientID;
  var toolID = req.params.toolID;
  var runInfo = req.body;
  scanID = scanID + 1;
  db.getClientData(clientID, function(clientData){
    var options = {
      host: clientData.clientIP,
      port: clientData.clientPort,
      path: '/tool/runtool/'+toolID+'/'+scanID,
      method: 'POST',
      headers: {
        'content-type':'application/json'
      }
    };
    var req = http.request(options, function(runRes) {
      runRes.setEncoding('utf8');
      runRes.on('data', function (runStatus) {
        if(runStatus == "ok"){
          res.send({"scanID":scanID});
        } else {
          res.status(404).send("error in action"); 
        }        
      });
    });
    req.write(JSON.stringify(runInfo));
    req.end();
  });
});

app.post('/reportsubmit/', function(req, res){
  var reportData = req.body;
  console.log(reportData);
  db.storeJSONReportInDB(reportData, function(status){
    if(status == "ok"){
      console.log("Db entered: " + reportData);
      res.send("ok");
    } else { 
      console.log("error inserting in db");
      res.status(404).send("error in action");     
    }
  });
});

app.post('/addtool/', function(req, res){
  var nodeData = req.body;
  var clientID = nodeData.clientID;
  console.log(nodeData);
  //console.log(nodeData.toolID);
  db.getToolData(nodeData.toolID, function(data){
    db.getClientData(clientID, function(clientData){
      //console.log(clientData.clientIP + clientData.clientPort + data.toolName + data.toolNPM);
      var addToolpath = '/toolconfig/addtool/'+ nodeData.toolID + '/'+ data.toolName +'/'+ data.toolNPM;
      console.log(addToolpath);
      var form = new FormData();
      form.append('my_field', 'my value');
      form.append('my_buffer', new Buffer(10));
      form.append('module', fs.createReadStream('./tools/'+ data.toolNPM +'.zip'));
      var request = http.request({
        method: 'POST',
        host: clientData.clientIP,
        port: clientData.clientPort,
        path: addToolpath,
        headers: form.getHeaders()
      });
    
      form.pipe(request);

      request.on('response', function(resEngine) {
        console.log(resEngine.statusCode);
        if(resEngine.statusCode == "200"){
          res.status(200).send({"status":"OK"});
        } else {
          res.status(404).send("error in action");
        }
      });
    });
  });
});


app.get("/register/:clientPort/:clientID", function(req, res){
 //Registration request
 //No paramaters expected
  var clientPort = req.params.clientPort;
  var clientID = req.params.clientID;
  var clientIP = req.connection.remoteAddress;
  var id;
  if(clientID == "0"){
    id = Math.floor((Math.random()*1000)+1);
  } else {
    id = clientID;
  }
  
  console.log(id);
  //console.log(req.connection.remoteAddress);
  //console.log(clientPort);
  db.insertClientIDIntoDB(id, clientIP, clientPort, function(){
    res.json({"clientID":id});
 
  });
});

app.post("/heartbeat/:clientID",function(req,res){
 //heartbeat request
 //POST request with Client id in GET and tools list in POST body as
 // {"toolList":["tool1","tool2"]}
	var clientID = req.params.clientID;
	var toolList = req.body.toolList;
  var status = "Active";
  console.log(toolList);
  db.getclientStatusData(clientID, function(clientStatus){
    console.log(clientStatus);
    if(clientStatus == true){
      db.updateHeartBeatStatus(clientID, status, toolList, function(){
        res.send("Success");
      });
    } else {
      //console.log(clientStatus + clientID + status + toolList);
      db.performHeartBeat(clientID, status, toolList, function(){
        res.send("Success");
      });
    }
  });
	
});

app.post('/authenticate/', function(req, res){
  authData = req.body;
  userName = authData.userName;
  password = authData.password;
  db.isValidCredential(userName, password, function(status){
    if(status == true){
      res.send({"status":"Success"});
    } else {
      res.send({"status":"Invalid"});
    }
  });
});

app.get('/getclients/:username', function(req, res){
  userName = req.params.username;
  db.getUserClientMapping(userName, function(status){
    if(status == false){
      res.send("No clients");
    } else {
      res.send(status);
    }
  });
});

var changeClientStatus = function(){
  //setTimeout(changeClientStatus, 20000)
}

http.createServer(app).listen(app.get('port'), function(){
  console.log("listening");
});