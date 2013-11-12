<?php

	require("../Login/check.php");
	
	echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Select Clients </div> ";
	
	echo "<br>";
	
	/** REST call to get all clients that can be managed by the logged in username**/
	
	$ch = curl_init();
	
	$username = $_SESSION['username'];
		
	$rest_api = "http://localhost:4040/getclients/" . $username;
	
	curl_setopt($ch, CURLOPT_URL, $rest_api);
	
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
	$curl_response = curl_exec($ch);
	
	$curl_response =  json_decode($curl_response);
	
	foreach($curl_response->clientID as $cid)
	{
	
				echo "<div style=\"margin-left:10%\" align=\"left\" >";				
				
				echo "<a href=\"./Scan/get_all_client_tools.php?clientID={$cid}\" style=\"color:\#1A3972\"  id=\"tablink\"> Client Id:  {$cid}  </a>";
			   echo "</div>";		
	
	}
	
?>
	


