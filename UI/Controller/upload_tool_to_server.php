<?php

	require("../Login/check.php");

	echo "<div align='center' style='color:#ff1014'><a href=\"../home.php\">back</a> </div>";
	
	echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Upload Tool To Server </div> ";
	
	$ch = curl_init();	
	
	$rest_api = "http://localhost:4040/admin/uploadtoolserver/" . $_POST['txtToolID'] . "/" . $_POST['txtToolName'] . "/" . $_POST['txtToolNPM'] ;
	
	
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
		echo "<br> Tool uploaded successfully to server";
	}
	else
	{
		echo "<br> Server upload failed";
	}

	
?>