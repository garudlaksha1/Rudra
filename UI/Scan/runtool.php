<?php

require("check.php");

	$key = $_POST['field1'];
 
	$clientID = $_POST['clientId'];
	$toolID =  $_POST['toolId']; 


	echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Run Tool </div> ";
	
	echo "<br>";

echo "<div align='center' style='color:#ff1014'><a href=\"./gettoolinfo.php?clientID=$clientID&toolID=$toolID&scanID=-1\">back</a> </div>";


	// echo "<br>";


	echo "<br>";
	
	$json_response = $_SESSION['jsonResponse'];

	//echo "<br> json response" . $json_response;
	
	//form json POST body
	foreach($json_response as $key=>$value)
	{
		$val = $_POST[$key];
		
		//echo  "<br>$key"  . $val;
 
		$value =  array("value"=>$val);

		if(isset($data_keys))
		{
 		//	echo "<br> next time" . $data_keys . " " . $data_values;
			array_push($data_keys, $key);
			array_push($data_values,$value);
		//	print_r($data_keys);
		}
		else
		{
			$data_keys = array($key);
			$data_values = array($value);
		//	echo "<br> first time";
		}
	}

	$data = array_combine($data_keys,$data_values);
	
	//echo "<br> data:" . $data;
 
	$data_string = json_encode($data);
 
	//echo "<br> REST request data \"" . $data_string . "\"";
 
	
	$rest_api = "http://localhost:4040/runtool/$clientID/$toolID";
	
	//echo "<br> calling \"" . $rest_api . "\"";
	
	$ch = curl_init($rest_api);
	
	//curl_setopt($ch, CURLOPT_URL,$rest_api);	
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
			'Content-Type: application/json',                                                                                
			'Content-Length: ' . strlen($data_string))                                                                       
	);         
	
	//echo "<br> hello";
	
	$curl_response = curl_exec($ch);
	
	curl_close($ch);
	
	//$curl_response_decoded =  json_decode($curl_response);
	
	echo  "<br>  " . $curl_response;// . " ". $curl_response['scanID'];// . " " . $curl_response_decoded['scanID'];

	//$location = "Location: gettoolinfo.php?scanID=" .  //$curl_response;

	//	echo $location;
		

?>