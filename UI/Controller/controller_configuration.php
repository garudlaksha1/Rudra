<?php

	require("../Login/check.php");
	
/** This php script is used to process different actions of the same form submission that is delete tools, push to clients,  upload tools **/

	//Delete server tools

	if($_POST['btSubmit'] == "Delete")
	{
		$ch = curl_init();
	
		$toolID = $_POST['tool'];
		
		$_SESSION['clientID'] =  $clientID;
	
		$rest_api = "http://localhost:4040/admin/deleteservertool/" . $toolID;
	
		//echo "toolID " . $rest_api;
		
		curl_setopt($ch, CURLOPT_URL,$rest_api);
	
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
		$curl_response = curl_exec($ch);
	
		curl_close($ch);
	
		$curl_response =  json_decode($curl_response,true);
		
		if($curl_response['status'] == "Success")
		{
			echo "<div align='right' style='color:#ff1014'><a href=\"../home.php\">back</a> </div><br>";
			echo "<br> {$toolID} is removed from server";
		}
		else
		{
			echo "<div align='right' style='color:#ff1014'><a href=\"../home.php\">back</a> </div><br>";
			echo "<br> {$toolID} removal is unsuccessful";
		}
	}
	//Upload toos to Controller server
	else if($_POST['btSubmit'] == "Upload Tool")
	{
		echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Upload Tool </div> <br> ";
		echo "<div align='right' style='color:#ff1014'><a href=\"../home.php\">back</a> </div><br>";
		echo "<form id=\"uploadToolForm\" method=\"POST\" action=\"./upload_tool_to_server.php\" enctype=\"multipart/form-data\">";
		echo "<div align= 'center'> Enter tool ID:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		echo "<input type=\"text\" name=\"txtToolID\"></div>";
		echo "<div align= 'center'> Enter tool Name:&nbsp;&nbsp;&nbsp;";
		echo "<input type=\"text\" name=\"txtToolName\"></div>";
		echo "<div align= 'center'> Enter tool NPM:&nbsp;&nbsp;&nbsp;";
		echo "<input type=\"text\" name=\"txtToolNPM\"></div><br>";
		echo "<div align= 'center'> <label for=\"file\">Filename: &nbsp;&nbsp;</label>";
		echo "<input type=\"file\" name=\"file\" id=\"file\"><br> </div> <br>";
		echo "<input type=\"hidden\" name=\"toolID\" value=\"" . $_POST['tool'] . "\">";
		echo "<div align= 'center'> <input type=\"submit\" name=\"btSubmit\" value=\"Upload\"></div>";
		
		
	}
	else if($_POST['btSubmit'] == "Push To Client")
	{
		echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'><b>Push To Client</b> </div> <br> ";
		echo "<div align='right' style='color:#ff1014'><a href=\"../home.php\">back</a> </div><br>";
		echo "<form id=\"pushToolForm\" method=\"POST\" action=\"./push_tool_to_client.php\">";
		echo "<div align= 'center'> Enter Client ID:";
		echo "<input type=\"text\" name=\"txtClient\">";
		echo "<input type=\"hidden\" name=\"toolID\" value=\"" . $_POST['tool'] . "\"> </div><br>";
		echo "<div align= 'center'><input type=\"submit\" name=\"btSubmit\" value=\"Push Tool\"></div>";
		
	}
	else
	{
		echo "<br> Submit is nothing";
	}
		

?>