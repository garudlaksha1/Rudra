<?php

	require("../Login/check.php");
	
	echo "<div align='center' style='color:#ff1014'><a href=\"../home.php\">back</a> </div>";
	
	echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Upload Tool To Server </div> ";
	
	
	if ($_FILES["file"]["error"] > 0)
	{
		echo "Error: " . $_FILES["file"]["error"] . "<br>";
	}
	else
	{
		echo "File to be Uploaded: " . $_FILES["file"]["name"] . "<br>";
		echo "Type: " . $_FILES["file"]["type"] . "<br>";
		echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
		$path  = $_FILES["file"]["tmp_name"];
		
		/******rename temp file back to original file name before sending via REST call *****/
		//echo "Stored in: " . $path;
		$path_parts = pathinfo($_FILES["file"]["tmp_name"]);
		$new_file_name  = $path_parts['dirname']. DIRECTORY_SEPARATOR . $_FILES["file"]["name"];
		//echo "<br>new file name" . $new_file_name;
		rename($_FILES["file"]["tmp_name"], $new_file_name);
		$path  = $new_file_name;
		//echo "<br> Stored in: " . $path;
	    }
  
	
	$ch = curl_init();	
	
	$rest_api = "http://localhost:4040/admin/uploadtoolserver/" . $_POST['txtToolID'] . "/" . $_POST['txtToolName'] . "/" . $_POST['txtToolNPM'] ;
	
	$data = array('filename'=>'@'.$path);
	
	curl_setopt($ch, CURLOPT_URL,$rest_api);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);   
	$curl_response = curl_exec($ch);
	
	curl_close($ch);
	
	$curl_response =  json_decode($curl_response,true);
	
	if ($curl_response['status'] == "Success")
	{
		echo "<br> Tool uploaded successfully to server";
	}
	else
	{
		echo "<br> Server upload failed";
	}

	
?>