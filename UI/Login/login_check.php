<?php

	 //before login
	$loginStatus = false;

	if(get_magic_quotes_gpc())
	{
		$userName = stripslashes($_POST['username']);
		$password = stripslashes($_POST['password']);
	}

	else{

		 $userName = $_POST['username'];
		 $passWord = $_POST['password'];
		
	} 
  
  /* Call REST service for authentication */
  $data_keys = array("userName");
  $data_values = array($userName);
  
  array_push($data_keys,"password");
  array_push($data_values, $passWord);
  
	$data = array_combine($data_keys,$data_values);
  
 	$data_string = json_encode($data);
 
	$ch = curl_init();
				
	$rest_api = "http://localhost:4040/authenticate/";
	
	//echo "<br> REST request data \"" . $data_string . "\"";
 
	$ch = curl_init($rest_api);
	
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
			'Content-Type: application/json',                                                                                
			'Content-Length: ' . strlen($data_string))                                                                       
	);         
	
	$curl_response = curl_exec($ch);
	
	curl_close($ch);
	
	/***** REST request complete ****/
	
	$curl_response_decoded =  json_decode($curl_response,true);
	
	$loginStatus = $curl_response_decoded['status'];
	
	if($loginStatus == "Success")
	{
		session_start();
		
		$_SESSION["started"] = true;
		$_SESSION["AddUser"] =  true;
		
		$currentCookieParams = session_get_cookie_params();  
		$sidvalue = session_id();  
		echo $sidvalue;
		 
		setcookie(  
				'PHPSESSID',//name  
				$sidvalue,//value  
				0,//expires at end of session  
				'/',
				'rudra.com',
				//$currentCookieParams['path'],//path  
				//$currentCookieParams['domain'],//domain  
				true //secure  
		);  
		
		echo "<br> Session started";

		$_SESSION['username'] = $userName;
		
		$location = "Location: ../home.php?username=" .  $userName;
		header($location);
		
	}
	else{
			
			header("Location: ../login.html?error_code=0");
	}
	
		
?>