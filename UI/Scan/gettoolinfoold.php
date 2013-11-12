<?php

  echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Select Tool </div> ";
	
	echo "<br>";
	
	$scanID = $_GET['scanID'];
	
	
	if($scanID == -1)
	{

	$ch = curl_init();
	
	$clientID = $_GET['clientID'];
	
	//echo "<br>" . $clientID;
	
	
	$toolID = $_GET['toolID'];
	
	//echo "<br>" . $toolID;
	
	
		$rest_api = "http://localhost:4040/gettoolinfo/" . $clientID ."/" .$toolID;
	
		//$rest_api = "http://localhost:4040/gettoolinfo/21/nmap" ;
	
	
		curl_setopt($ch, CURLOPT_URL,$rest_api);
	
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	
		$curl_response = curl_exec($ch);
	
		$curl_response =  json_decode($curl_response,true);
	
		//$server_output = curl_exec($curl);
		
		$_SESSION['toolsData'] = $curl_response;
	
		echo "<div style=\"margin-left:10%\" align=\"left\" >";

		foreach ( $curl_response AS $key => $val ) {
		
			$id = $key;
		
			$values= json_decode($val,true);
		
			$label = $val['description'];
			$type = $val['type'];
		
		//	echo "<form id=\"configToolForm\" action=\"./runtool.php\"  method=\"POST\">";
			echo "<form id=\"configToolForm\">";
		
			echo  "<label id=\"lblDescription\">";
		
			echo $label . "&nbsp;";
		
			echo "</label>";
		
			if($type == "string")
			{
				echo "<input type=\"text\" name=\"" . $id . "\">";
			}
		
			foreach($val AS $key1 => $val1)
			{
				//echo $key1 . " " . $val1 ."<br>";
			}
	
			echo "<input type=\"hidden\" name=\"field1\" value=\"" . $id . "\">";
			echo "<input  id=\"button-submit\"  type=\"submit\" value=\"Submit\">";
			echo "</form>";
			echo "<div id=\"resultContainer\"></div>";
		}
     }
	 else
	 {
		
			$scanID =  $_GET['scanID'];
			echo $scanID;
	 
	 }
	   
	
?>