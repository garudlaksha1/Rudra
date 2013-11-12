<?php

	require("../Login/check.php");
	
	echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Configure controller</div> ";
	
	echo "<br>";
	
	$ch = curl_init();
	
	$username = $_SESSION['username'];
	
	if($username == "admin")
	{
	
		echo "<br>";
		
		/**   REST call to get all the tools on the Controller Server **/

		$ch = curl_init();
	
		$clientID = $_GET['clientID'];
		$_SESSION['clientID'] =  $clientID;
	
		$rest_api = "http://localhost:4040/admin/getallservertoolinfo/";
	
		curl_setopt($ch, CURLOPT_URL,$rest_api);
	
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
		$curl_response = curl_exec($ch);
		
		curl_close($ch);
	
	//	echo $curl_response;
	
		$curl_response =  json_decode($curl_response,true);
		
		echo "<form id=\"controllerConfigForm\" method=\"POST\" action=\"./Controller/controller_configuration.php\">";
		
		foreach($curl_response['toolList'] as $tool)
		{
	 
		foreach ($tool AS $key => $value)
		{
			if($key == "toolID"){
				echo "<div style=\"margin-left:10%\" align=\"left\">";
				echo "<input type=\"radio\" name=\"tool\" value=\"{$value}\">";
				echo "$value";
			   echo "</div>";
			   }
		}
	}
	
		echo "<input type=\"submit\" name=\"btSubmit\" value=\"Upload Tool\">";
		echo "<input type=\"submit\" name=\"btSubmit\" value=\"Delete\">";
		echo "<input type=\"submit\" name=\"btSubmit\" value=\"Push To Client\">";
	}
	
	else
	{
		echo "<br> <div  align=\"center\" style=\"color: #ff0000\"> You are not authorized to view this page </div>";
	}



?>