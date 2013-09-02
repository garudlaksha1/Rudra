var fs = require('fs');
var path = require('path');
var file = 'sqlmap_config.json';		//configuration file placed in the same directory
var cp = require("child_process");

var configPath = path.join(path.dirname(fs.realpathSync(__filename)), '/');

var getToolInfo = function (callback) {
  fs.readFile(configPath + file, 'utf8', function (err, Data)	{	//function for reading config file content 
		if (err){
		  console.log('Error: ' + err);
			callback(err);
		}
		JSONData = JSON.parse(Data);		//parsing json data from config file
		delete JSONData.URL.commandOption;
		callback(JSONData);	
	});
}

var runTool = function (scanID, userJSONData, callback){
  fs.readFile(configPath + file, 'utf8', function (err, configJSONData){		//function for reading config file content 
	  if (err){
			console.log('Error: ' + err);
			callback(err);
		}
	 
		configJSONData = JSON.parse(configJSONData);		//parsing json data from config file

		var str=";";
		if(userJSONData.URL.value.indexOf(str) > -1)		//Checking for malicious data such as ';'
			callback("User input is Malicious");	
		else{		
      var sqlMapPath = configPath + "sqlmap/sqlmap.py";
      var JSONinput ="", JSONoutput="", message = "";
      var data = [];
      cp.exec("c:/Python27/python.exe " + sqlMapPath + " " + configJSONData.URL.commandOption +" "+userJSONData.URL.value+"--wizard --batch --threads=10", function (err, stdout, stderr) {
        console.log(stdout);
        var arr = stdout.split('\n');				//split data into lines
        for(var i=0;i<arr.length;i++) {
          if(arr[i].match("Place")){
            JSONinput = "";
            JSONinput += arr[i] + " ";  
          }
          if(arr[i].match("Parameter")){
            JSONinput += arr[i] + " ";
          } 
          if (arr[i].match("Type")){
            message = arr[i];
          }
   
          if(arr[i].match("Title")){
            JSONoutput = arr[i] + " ";
          } else if(arr[i].match("Payload")){
            JSONoutput += arr[i];
            var JSONData = {"input":JSONinput, "output":JSONoutput, "message":message};
            data.push(JSONData);
            JSONoutput = "";
            message = "";
          }
        }
        var datasend = {"data":data}
        callback(datasend);
        console.log(datasend);  
      });	
		}
	});
}

exports.getToolInfo = getToolInfo;				//Exports the getToolInfo function 
exports.runTool = runTool;					//Exports the runTool function 