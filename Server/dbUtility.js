/*
	//Database utility function
	//Design choice:
	1. Always wrap actual function to callback function

*/

var mongo = require("mongodb");
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("secToolController", new mongo.Server(host, port, {}));


//Utility function to insert client into DB
var insertClientIDIntoDB = function(id, clientIP, clientPort, callback){
	db.open(function(error){
    closureinsertClientIDIntoDB(id, clientIP, clientPort, callback, db);
  });
}

var closureinsertClientIDIntoDB = function(id, clientIP, clientPort, callback, db){  
		db.collection("idCollection", function(error, collection) {
		  collection.findAndModify({"clientID":id},
                               [['_id','asc']],
                               {$set: {"clientIP":clientIP,"clientPort":clientPort}},
                               {upsert:true}, 
                               function(err,inserted){
			  if(err){
          db.close();
				  console.log("Some error occured in client db insertion");
			  }
			  else{
				  console.log("client entered successfully");
          db.close();
          callback();
			  }
		  });
	  });	
}


//Utility function to fetch all clients
var getClientIds = function(clientID, callback){
	db.open(function(error){
    closuregetClientIds(clientID, callback, db);
  });
}

var closuregetClientIds = function(clientID, callback, db){  
		db.collection("toolsCollection", function(error, collection) {
		  collection.find({"clientID":clientID}, function(error, cursor){
        cursor.toArray(function(errorarray, data){
          db.close();
          callback(data[0].toolList);
        });
      });
	  });	
}

//Utility function for heartbeat operation

var performHeartBeat = function(id, status, toolsArray, callback) {
	db.open(function(error){
    closureperformHeartBeat(id, status, toolsArray, callback, db);
  });
}

var closureperformHeartBeat = function(id, status, toolsArray, callback, db){  
		var createStatusForClient = {
		  "clientID":id,
		  "status":status,
		  "toolList":toolsArray
		};
	  db.collection("toolsCollection", function(error, collection) {
		  collection.insert(createStatusForClient,function(err,inserted){
			  if(err){
          db.close();
				  console.log("Some error occured in 1st heartbeat");
			  }
			  else{
          db.close();
          callback();
				  console.log("Client heart beat Inserted successfully");
			  }			  
		  });
	  });   
}


 // GetClient status data function 
 
var getclientStatusData = function(id, callback) {
  db.open(function(error){
    closuregetclientStatusData(id, callback, db);
  });  
}

var closuregetclientStatusData = function(id, callback, db){		
	  db.collection("toolsCollection", function(error, collection) {
		  collection.find({"clientID":id}, function(error, cursor){
        cursor.toArray(function(errorarray, data){
          if(data[0] == undefined){
            db.close(); 
            callback(false);
          } else {
            db.close(); 
            callback(true);
          }
        });
      });
	  });
}

// utility to update toolList after heartbeats
var updateHeartBeatStatus = function(id, status, toolsArray, callback) {
  db.open(function(error){
    closureupdateHeartBeatStatus(id, status, toolsArray, callback, db);
  });	
}

var closureupdateHeartBeatStatus = function(id, status, toolsArray, callback, db){
	  db.collection("toolsCollection", function(error, collection) {
		  collection.update({"clientID":id},{$set:{"status":status,"toolList":toolsArray}}, function(err,inserted){
			  if(err){
          db.close();
				  console.log("Some error occured");
			  }
			  else{
          db.close();
          callback();
			  }
		  });
	  });
}

//Utility to get toolData
var getToolData = function(id, callback){
  db.open(function(error){
    closergetToolData(id, callback, db);
  });
}

var closergetToolData = function(id, callback, db){
  db.collection("toolData", function(error, collection){
    collection.find({"toolID":id}, function(error, cursor){
      cursor.toArray(function(errorarray, data){
        db.close();
        callback(data[0]);
      });
    });
  });
}


//utility to get clientData using client ID
var getClientData = function(id, callback){
  db.open(function(error){
    closergetClientData(id, callback, db);
  });
}

var closergetClientData = function(id, callback, db){
  db.collection("idCollection", function(error, collection){
    collection.find({"clientID":id}, function(error, cursor){
      cursor.toArray(function(errorarray, data){
        db.close();
        callback(data[0]);
      });
    });
  });
}

//Reporting utility function
var storeJSONReportInDB = function(reportObj, callback){
	db.open(function(error){
	    closurestoreJSONReportInDB(reportObj, callback, db);
	  });
}

var closurestoreJSONReportInDB = function(reportObj,callback,db){	
	  db.collection("toolReporting", function(error, collection) {
		  collection.insert(reportObj,function(err,inserted){
			  if(err){
          db.close();
				  console.log("Some error occured in db report entry");
			  }
			  else{
          db.close();
          console.log("db report Inserted successfully");
          callback("ok");
			  }			  
		  });
	  });
}

//Reporting fetch utility function
var fetchJSONReportInDB = function(id, callback) {
  db.open(function(error){
    closurefetchJSONReportInDB(id, callback, db);
  });  
}

var closurefetchJSONReportInDB = function(id, callback, db){		
	  db.collection("toolReporting", function(error, collection) {
		  collection.find({"scanid":id}, function(error, cursor){
        cursor.toArray(function(errorarray, data){
          if(data[0] == undefined){
            db.close(); 
            callback(false);
          } else {
            db.close(); 
            callback(data[0]);
          }
        });
      });
	  });
}

var isValidCredential = function(username,password,callback){
	db.open(function(error){
	    closureisValidCredential(username, password,callback, db);
	  });
}


var closureisValidCredential = function(username,password,callback,db){
	  db.collection("credentials", function(error, collection) {
		  collection.find({"username":username,"password":password}, function(error, cursor){
        cursor.toArray(function(errorarray, data){
          if(data[0] == undefined){
            db.close(); 
            callback(false);
          } else {
            db.close(); 
            callback(true);
          }
        });
      });
	  });
}

var getUserClientMapping = function(username, callback){
	db.open(function(error){
	    closuregetUserClientMapping(username, callback, db);
	  });
}


var closuregetUserClientMapping = function(username, callback, db){
	  db.collection("userClientMapping", function(error, collection) {
<<<<<<< HEAD
		  collection.find({"userName":username}, function(error, cursor){
=======
		  collection.find({"username":username}, function(error, cursor){
>>>>>>> gaurav
        cursor.toArray(function(errorarray, data){
          if(data[0] == undefined){
            db.close(); 
            callback(false);
          } else {
            db.close(); 
            callback({"clientID":data[0].clientID});
          }
        });
      });
	  });
}

<<<<<<< HEAD
=======
//Admin addtool funtion
var addToolInfo = function(toolData, callback){
	db.open(function(error){
	    closureaddToolInfo(toolData, callback, db);
	  });
}

var closureaddToolInfo = function(toolData,callback,db){	
	  db.collection("toolData", function(error, collection) {
		  collection.insert(toolData,function(err,inserted){
			  if(err){
          db.close();
				  console.log("Some error occured in db report entry");
			  }
			  else{
          db.close();
          callback("ok");
				  console.log("db tool Inserted successfully");
			  }
			  
		  });
	  });
}


//Utility function to update client user mapping
var addClientUserMapping = function(userName, clientID, callback){
	db.open(function(error){
    closureaddClientUserMapping(userName, clientID, callback, db);
  });
}

var closureaddClientUserMapping = function(userName, clientID, callback, db){
    console.log(userName);
    console.log(clientID);
		db.collection("userClientMapping", function(error, collection) {
		  collection.findAndModify({"username":userName},
                               [['_id','asc']],
                               {$set: {"clientID":clientID}},
                               {upsert:true}, 
                               function(err,inserted){
			  if(err){
				  console.log("Some error occured in client db insertion");
          db.close();
          callback("error");
			  }
			  else{
				  console.log("mapping entered successfully");
          db.close();
          callback("ok");
			  }
		  });
	  });	
}

//Add user admin util
var addUserInDB = function(userData, callback){
	db.open(function(error){
	  closureaddUserInDB(userData, callback, db);
	});
}

var closureaddUserInDB = function(userData,callback,db){	
	  db.collection("credentials", function(error, collection) {
		  collection.insert(userData,function(err,inserted){
			  if(err){
          db.close();
          callback("error");
				  console.log("Some error occured in db report entry");
			  }
			  else{
          db.close();
          callback("ok");
				  console.log("db report Inserted successfully");
			  }		  
		  });
	  });
}

// get user email address
var getEmail = function(username, callback){
	db.open(function(error){
	    closuregetEmail(username, callback, db);
	  });
}

var closuregetEmail = function(username, callback, db){
	  db.collection("credentials", function(error, collection) {
		  collection.find({"username":username}, function(error, cursor){
        cursor.toArray(function(errorarray, data){
          if(data[0] == undefined){
            db.close(); 
            callback(false);
          } else {
            db.close(); 
            callback(data[0].email);
          }
        });
      });
	  });
}


// get all tool data on server
var getAllTools = function(callback){
	db.open(function(error){
	    closuregetAllTools(callback, db);
	  });
}

var closuregetAllTools = function(callback, db){
	  db.collection("toolData", function(error, collection) {
		  collection.find(function(error, cursor){
        cursor.toArray(function(errorarray, data){
          var toolData = [];
          for(var i=0; i<data.length; i++){
            toolData.push({"toolID":data[i].toolID, "toolName":data[i].toolName, "toolNPM":data[i].toolNPM});
          }
          if(error){
            db.close(); 
            callback("error");
          } else {
            db.close(); 
            callback(toolData);
          }
        });
      });
	  });
}

// get all active clients
var getAllActiveClients = function(callback){
	db.open(function(error){
	    closuregetAllActiveClients(callback, db);
	  });
}

var closuregetAllActiveClients = function(callback, db){
	  db.collection("toolsCollection", function(error, collection) {
		  collection.find({"status":"Active"} ,function(error, cursor){
        cursor.toArray(function(errorarray, data){
          var clientData = [];
          for(var i=0; i<data.length; i++){
            clientData.push(data[i].clientID);
          }
          if(error){
            db.close(); 
            callback("error");
          } else {
            db.close(); 
            callback(clientData);
          }
        });
      });
	  });
}

>>>>>>> gaurav
exports.performHeartBeat = performHeartBeat;
exports.insertClientIDIntoDB = insertClientIDIntoDB;
exports.getclientStatusData = getclientStatusData;
exports.updateHeartBeatStatus = updateHeartBeatStatus;
exports.getToolData = getToolData;
exports.getClientData = getClientData;
exports.fetchJSONReportInDB = fetchJSONReportInDB;
exports.storeJSONReportInDB = storeJSONReportInDB;
exports.isValidCredential = isValidCredential;
<<<<<<< HEAD
exports.getUserClientMapping = getUserClientMapping;
=======
exports.getUserClientMapping = getUserClientMapping;
exports.addToolInfo = addToolInfo;
exports.addClientUserMapping = addClientUserMapping;
exports.addUserInDB = addUserInDB;
exports.getClientIds = getClientIds;
exports.getEmail = getEmail;
exports.getAllTools = getAllTools;
exports.getAllActiveClients = getAllActiveClients;
>>>>>>> gaurav
