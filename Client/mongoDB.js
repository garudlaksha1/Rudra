var mongo = require("mongodb");
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("secEngineController", new mongo.Server(host, port, {}));

//to install tool use this to make db entry
var addToolinfo = function(toolData, callback){
  db.open(function(error){
    closeraddToolinfo(toolData, callback, db);
  });
}

var closeraddToolinfo = function(toolData, callback, db){
  db.collection("toolMapping", function(error, collection){   
      collection.insert(toolData, function(err, inserted){
        if (err){ 
          console.log("error"); 
        } else {
          db.close(); 
          callback("ok");
        }
      }); 
    });
}

//get toolmapping information
var getToolMapping = function (toolID, callback) {
  db.open(function(error){
    closergetToolMapping(toolID, callback, db);
  });
}

var closergetToolMapping = function (toolID, callback, db){
  db.collection("toolMapping", function(error, collection){
      collection.find({"toolID" : toolID},function(error, cursor){
        cursor.toArray(function(errorarray, toolNPM){
          if(toolNPM.length == 0){
            callback("nil");
          } else {
            db.close(); 
            callback(toolNPM[0]);
          }
          
        });
      });
    });
}

//get all tools information
var getAllToolID = function(callback) {
  db.open(function(error){
    closergetAllToolID(callback, db);
  });
}

var closergetAllToolID = function(callback, db){
  db.collection("toolMapping", function(error, collection){
      collection.find(function(error, cursor){
        cursor.toArray(function(errorarray, data){
          db.close();
          callback(data);
          
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

exports.addToolinfo = addToolinfo;
exports.getToolMapping = getToolMapping;
exports.getAllToolID = getAllToolID;
exports.fetchJSONReportInDB = fetchJSONReportInDB;
exports.storeJSONReportInDB = storeJSONReportInDB;