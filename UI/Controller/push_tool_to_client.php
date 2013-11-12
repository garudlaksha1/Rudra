<?php

	require("../Login/check.php");

	echo "<div align='center' style='color:#ff1014'><a href=\"../home.php\">back</a> </div>";
	
	echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Push Tool </div> ";
	
	/** REST call to push tools from Controller server to specified client**/
	
	$ch = curl_init();
	
	$data_keys = array("clientID");
	$data_values = array($_POST['txtClient']);
  
	array_push($data_keys,"toolID");
	array_push($data_values, $_POST['toolID']);
  
  $data = array_combine($data_keys,$data_values);
  
 	echo "<br> data:" . $data;
 
	$data_string = json_encode($data); 
 
	echo $data_string;
 
	$rest_api = "http://localhost:4040/admin/pushtoolclient/" ;
	
	
	curl_setopt($ch, CURLOPT_URL,$rest_api);
	
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
		'Content-Type: application/json',                                                                                
    'Content-Length: ' . strlen($data_string))                                                                       
);         
	
	$curl_response = curl_exec($ch);
	
	curl_close($ch);
	
	$curl_response =  json_decode($curl_response);
	
	if ($curl_response['status'] == "Success")
	{
		echo "<br> Tool installed successfully on client";
	}
	else
	{
		echo "<br> Tool installation failed";
	}

		
?>