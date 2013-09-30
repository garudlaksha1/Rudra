var FormData = require('form-data');
var fs = require('fs');
var http = require('http');
var express = require('express');
//var querystring = require('querystring');
//As of now, assumes to be on similar folder
var db = require('./dbUtility.js');
var path = require('path');
var scanID = 0;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4040);
  app.use(express.bodyParser());
});

app.get('/gettoolinfo/:clientID/:toolID/', function(req, res){
  var clientID = req.params.clientID;
  var toolID = req.params.toolID;
  //console.log(toolData);
  db.getClientSessionID(clientID, function(sessionID){
    db.getClientData(clientID, function(clientData){
      var options = {
        host: clientData.clientIP,
        port: clientData.clientPort,
        path: "/tool/getinfo/"+toolID+"/"+sessionID,
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
});

app.post('/runtool/:clientID/:toolID', function(req, res){
  var clientID = req.params.clientID;
  var toolID = req.params.toolID;
  var runInfo = req.body;
  scanID = scanID + 1;
  db.getClientSessionID(clientID, function(sessionID){
    db.getClientData(clientID, function(clientData){
      var options = {
        host: clientData.clientIP,
        port: clientData.clientPort,
        path: '/tool/runtool/'+toolID+'/'+scanID+'/'+sessionID,
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

app.post('/admin/pushtoolclient/', function(req, res){
  var nodeData = req.body;
  var clientID = nodeData.clientID;
  console.log(nodeData);
  db.getClientSessionID(clientID, function(sessionID){
    db.getToolData(nodeData.toolID, function(data){
      db.getClientData(clientID, function(clientData){
        var addToolpath = '/toolconfig/addtool/'+ nodeData.toolID + '/'+ data.toolName +'/'+ data.toolNPM+'/'+sessionID;
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
            res.status(200).send({"status":"Success"});
          } else {
            res.status(404).send({"status":"Fail"});
          }
        });
      });
    });
  });
});


app.get("/register/:clientPort/:clientID", function(req, res){
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
  db.insertClientIDIntoDB(id, clientIP, clientPort, function(){
    res.json({"clientID":id});
  });
});

app.post("/heartbeat/:clientID",function(req,res){
	var clientID = req.params.clientID;
	var toolList = req.body.toolList;
  var sessionID = Math.floor((Math.random()*10000)+1);
  var status = "Active";
  console.log(toolList);
  console.log(clientID);
  var currentTime = new Date().getTime();
  var callback = function(status){
    if(status == true){
      res.send({"status":"Success","sessionID":sessionID});
    } else {
      res.send({"status":"Invalid"});
    }
  }
  db.getclientStatusData(clientID, function(clientStatus){
    console.log(clientStatus);
    if(clientStatus == true){
      db.updateHeartBeatStatus(clientID, status, currentTime, toolList, sessionID, callback);
    } else {
      db.performHeartBeat(clientID, status, currentTime, toolList, sessionID, callback);
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

app.post('/admin/uploadtoolserver/:toolID/:toolName/:toolNPM', function(req, res){
  var toolID = req.params.toolID;
  var toolName = req.params.toolName;
  var toolNPM = req.params.toolNPM;
  var toolData = {"toolID":toolID, "toolName":toolName, "toolNPM":toolNPM};
  console.log(JSON.stringify(toolData));
  console.log(req.files);
  if(req.files.filename.name == ''){
    console.log("No ZIP to upload");
    db.addToolInfo(toolData, function(status){
      if (status == "ok"){
        res.status(200).send({"status":"Success"});
      } else { 
        console.log("error inserting in db");
        res.status(404).send({"status":"Fail"});     
      }
    });
  }
  else {
      fs.readFile(req.files.filename.path, function (err, data) {
      var newPath = __dirname + "/tools/"+req.files.filename.name;
      fs.writeFile(newPath, data, function (err) {
        if (err) throw err;
        db.addToolInfo(toolData, function(status){
          if (status == "ok"){
            res.status(200).send({"status":"Success"});
          } else { 
            console.log("error inserting in db");
            res.status(404).send({"status":"Fail"});     
          }
        });
      });
    });
  }
});

app.post('/admin/userclientmap/', function(req, res){
  userName = req.body.username;
  clientID = req.body.clientID;
  db.addClientUserMapping(userName, clientID, function(status){
    if(status == "ok"){
      console.log("Db entered");
      res.send({"status":"Success"});
    } else { 
      console.log("error inserting in db");
      res.status(404).send({"status":"Fail"});     
    }
  });
});

app.post('/admin/adduser/', function(req, res){
  userData = req.body
  db.addUserInDB(userData, function(status){
    if(status == "ok"){
      console.log("User entered");
      res.send({"status":"Success"});
    } else { 
      console.log("error inserting in db");
      res.status(404).send({"status":"Fail"});     
    }
  });
});

app.get('/getallclienttools/:clientID', function(req, res){
  clientID = req.params.clientID;
  db.getClientIds(clientID, function(toolList){
    if(toolList == "error"){
      res.status(404).send("error in action");
    } else {
      res.send({"toolList":toolList});
    }
  });
});

app.get('/getemail/:username', function(req, res){
  username = req.params.username;
  db.getEmail(username, function(email){
    if(email == "error"){
      res.status(404).send("error in action");
    } else {
      res.send({"email":email});
    }
  });
});

app.get('/admin/getallservertoolinfo/', function(req, res){
  db.getAllTools(function(toolData){
    if(toolData == "error"){
      res.status(404).send("error in action");
    } else {
      res.send({"toolList":toolData});
    }
  });
});

app.get('/admin/getallclients/', function(req, res){
  db.getAllActiveClients(function(clients){
    if(clients == "error"){
      res.status(404).send("error in action");
    } else {
      res.send({"clientID":clients});
    }
  });
});

app.get('/admin/deleteservertool/:toolID', function(req, res){
  toolID = req.params.toolID;
  db.getToolData(toolID, function(toolData){
    var newPath = __dirname + "/tools/"+toolData.toolNPM+".zip";
    fs.unlink(newPath, function(err){
      if (err) console.log("error deleting zip file");
      db.removeToolData(toolID, function(status){
        if(status == "ok"){
          res.send({"status":"Success"});
        } else {
          res.status(404).send({"status":"Fail"});
        }
      });
    });
  });
});

function changeClientStatus(){
  var currentTime = new Date().getTime();
  db.getAllActiveClientTime(function(clients){
    for(var i=0; i<clients.length; i++){
      if((currentTime - clients[i].timestamp) > 20*1000){
        console.log("deactivate"+clients[i].clientID);
        db.updateClientStatus(clients[i].clientID, "Inactive", function(status){
          if(status == "ok"){
            console.log("deactivated..");
          } else {
            console.log("error in DB entry");
          }
        });
      } 
    }
    setTimeout(changeClientStatus, 30000);
  });
}

http.createServer(app).listen(app.get('port'), function(){
  console.log("listening");
});

changeClientStatus();