<?php

	require("../Login/check.php");

	echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Select Tool </div> ";

	$userName = $_SESSION['username'];

	echo "<br>";

	echo "<div align='center' style='color:#ff1014'><a href=\"./Scan/get_clients.php?username=$userName\">back</a> </div>";
	
	echo "<br>";
	
	/** REST call to get all the tools installed at specified client ID**/

	$ch = curl_init();
	
	$clientID = $_GET['clientID'];
	$_SESSION['clientID'] =  $clientID;
	
	$rest_api = "http://localhost:4040/getallclienttools/" . $clientID;
	
	curl_setopt($ch, CURLOPT_URL,$rest_api);
	
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
	$curl_response = curl_exec($ch);
	
	$curl_response =  json_decode($curl_response,true);
	
	   
	foreach($curl_response['toolList'] as $tool)
	{
	 
			
				echo "<div style=\"margin-left:10%\" align=\"left\">";
				
				echo "<a href=\"./Scan/gettoolinfo.php?clientID={$clientID}&toolID={$tool}&scanID=-1\" style=\"color:\#1A3972\">  {$tool}  </a>";
			   echo "</div>";
		
	}
	
  
	
?>