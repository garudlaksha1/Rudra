var fs = require('fs');
var path = require('path');
var cp = require("child_process");
var file = 'rudra_config.json';		//configuration file placed in the same directory
    
var configPath = path.join(path.dirname(fs.realpathSync(__filename)), '/');

var getToolInfo = function (callback) {
  fs.readFile(configPath + file, 'utf8', function (err, Data)	{	//function for reading config file content 
		if (err){
		  console.log('Error: ' + err);
			callback(err);
		}
		JSONData = JSON.parse(Data);		//parsing json data from config file
		//delete JSONData.IP.commandOption;
		callback(JSONData);	
	});
}

var runTool = function (scanID, userJSONData, callback)
{
	
	fs.readFile(configPath + file, 'utf8', function (err, configJSONData)		//function for reading config file content 
	{
		if (err)
		{
			console.log('Error: ' + err);
			callback(err);
		}
	 
		configJSONData = JSON.parse(configJSONData);		//parsing json data from config file

		var str=";";
		if(userJSONData.Attack.value.indexOf(str) > -1)		//We want input.json file as list of params
			callback("User input is Malicious");		
	
		else { 
      //console.log(userJSONData.JSON.value);
			fs.writeFile( configPath + "RudraAttack/input.json", JSON.stringify(userJSONData.JSON.value), function(err) {
        if(err) {
            console.log(err);
        } else {          
			     // Executing REST Scanner
			     //console.log("node " + configPath +"GarudRudra/main.js "+userJSONData.attack.value + " > test.txt");
           var JSONinput ="", JSONoutput="", message = "";
           var data = [];
           //console.log("node " + configPath +"RudraAttack/main.js "+userJSONData.Attack.value + " "+configPath +"RudraAttack/input.json");
			     cp.exec("node " + configPath +"RudraAttack/main.js "+userJSONData.Attack.value + " input.json", function(err, stdout, stderr){
             console.log(stdout);
             var arr = stdout.split('\n');				//split data into lines
             for(var i=0;i<arr.length;i++) {
               if(arr[i].match("Input:")){
                 var inputArr = arr[i].split('Input:');
                 JSONinput = inputArr[inputArr.length-1];  
               }
               if(arr[i].match("Output:")){
                 var outputArr = arr[i].split('Output:');
                 JSONoutput = outputArr[outputArr.length-1];  
               }
               if(arr[i].match("Message:")){
                 var messageArr = arr[i].split('Message:');
                 message = messageArr[messageArr.length-1];
                 var JSONData = {"input":JSONinput, "output":JSONoutput, "message":message};
                 data.push(JSONData);
                 JSONinput = "";
                 JSONoutput = "";
                 message = "";  
               }
             }
             var datasend = {"scanID":scanID,"data":data}
             callback(datasend);
           });	
        }   
      }); 
		}
	});
}


exports.getToolInfo = getToolInfo;				//Exports the getToolInfo function 
exports.runTool = runTool;					//Exports the runTool function 
