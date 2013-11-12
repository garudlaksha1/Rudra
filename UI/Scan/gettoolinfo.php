<?php

	require("../Login/check.php");
	
		$clientID = $_SESSION['clientID'];
	
		if(!isset($_POST['button-submit']))
		{
			$toolID = $_GET['toolID'];
			
			$_SESSION['toolID'] = $toolID;
		}
	
		else{
		
			$toolID = $_SESSION['toolID'];
		}
		//echo "<br>" . $toolID;

		echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Configure Tool </div> ";
	
		echo "<br>";


		echo "<div align='center' style='color:#ff1014'><a href=\"./Scan/get_all_client_tools.php?clientID=$clientID\">back</a> </div>";
	
		/* if the form is not submitted, do REST call to get tool information of specified toolID for given client*/
		if(!isset($_POST['button-submit']))
		{
			$ch = curl_init();
	
			
			$rest_api = "http://localhost:4040/gettoolinfo/" . $clientID ."/" .$toolID;
	
			curl_setopt($ch, CURLOPT_URL,$rest_api);
	
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
			$curl_response = curl_exec($ch);
	
			$curl_response =  json_decode($curl_response,true);
	
			//$server_output = curl_exec($curl);
	
			echo "<div style=\"margin-left:10%\" align=\"left\" >";

			echo "<br>";

			$_SESSION['jsonResponse'] = $curl_response;

			foreach ( $curl_response AS $key => $val )
			{
		
				echo "<div align=\"left\">";
				$id = $key;
		
				$values= json_decode($val,true);
		
				$label = $val['description'];
				$type = $val['type'];

				//echo "<form id=\"configToolForm\" action=\"./runtool.php\"  method=\"POST\">";
			
				echo "<form id=\"configToolForm\" action=\"./Scan/gettoolinfo.php\"  method=\"POST\">";
		
				echo  "<label id=\"lblDescription\">";
		
				echo $label . "&nbsp;&nbsp;";
		
				echo "</label>";
		
				if($type == "string")
				{
					echo "<input type=\"text\" name=\"" . $id . "\">";
				}

				if($type == "option")
				{

					$default_value =  $val['default value'];
				
					foreach(array_combine($val['options'],$val['optionValue']) as $option => $optionValue)
					{
			
						if($default_value == $optionValue)
						{

							echo "<input type=\"radio\" name=\"" .$id . "\" value=\"" .$optionValue ."\" checked> $option";
						}
						else
						{
								echo "<input type=\"radio\" name=\"" .$id . "\" value=\"" .$optionValue ."\"> $option";

						}

					}
				}
					
				echo "</div>";
				echo "<br>";
		
		}

			echo "<input type=\"hidden\" name=\"field1\" value=\"" . $id . "\">";

			echo "<input type=\"hidden\" name=\"clientId\" value=\"" . $_GET['clientID'] . "\">";

			echo "<input type=\"hidden\" name=\"toolId\" value=\"" . $_GET['toolID'] . "\">";

			echo "<br> <div align=\"left\"> <input  name=\"button-submit\"  type=\"submit\" value=\"Submit\"> </div>";
			echo "</form>";
		echo "<br>";
		echo "<br>";
		echo "<br>";
		
     }
	 /* Else form is submitted and so process the form fields to do REST call for running tools */
	 else
	 {
			$clientID = $_SESSION['clientID'];
			$toolID =  $_SESSION['toolID']; 

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
			array_push($data_keys, $key);
			array_push($data_values,$value);
		}
		else //create array for first key-value pair
		{
			$data_keys = array($key);
			$data_values = array($value);
			
		}
	}

	$data = array_combine($data_keys,$data_values);
	
	$data_string = json_encode($data);
 
	//echo "<br> REST request data \"" . $data_string . "\"";
 
	
	$rest_api = "http://localhost:4040/runtool/$clientID/$toolID";
	
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
	
	//$curl_response_decoded =  json_decode($curl_response);
	
	echo  "<br>  " . $curl_response;
	// . " ". $curl_response['scanID'];// . " " . $curl_response_decoded['scanID'];

	 }
	   
	
?>