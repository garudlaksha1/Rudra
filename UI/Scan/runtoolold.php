<?php

//ob_start();
	//echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Run Tool </div> ";
	
//	echo "<br>";

	$ch = curl_init();
	
 
 //echo $_POST['field1'];
  
 //echo "<br>";
 $key = $_POST['field1'];
 
 //echo $key;
 //echo $_POST[$key];
 
 //echo "<br>"
 
 $val = $_POST[$key];
 
 $value =  array("value"=>$val);
 
 $data = array($key=>$value);
 
 $data_string = json_encode($data);
 
  echo $data_string;
 
	$rest_api = "http://localhost:4040/runtool/21/nmap" ;
	
	
	curl_setopt($ch, CURLOPT_URL,$rest_api);
	
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
		'Content-Type: application/json',                                                                                
    'Content-Length: ' . strlen($data_string))                                                                       
);         
	
	echo "hello";
	
	$curl_response = curl_exec($ch);
	
	//$curl_response =  json_decode($curl_response);
	
	echo  "<br> hello " . $curl_response;

	$location = "Location: gettoolinfo.php?scanID=" .  $curl_response;

		echo $location;
		
		//ob_get_contents();
		//ob_end_clean();
		
		//sleep(100);
		//header($location);



?>