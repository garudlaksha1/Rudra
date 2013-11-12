<?php

	require("./Login/check.php");

	//  Check if the AddUser flag is true
	if($_GET['AddUser'] ==  1)
	{
	
		//Error handling
		if($_GET["error"] == 0)
		{			
			echo "<br> <div style='color:#ff0000'>All the fields are mandatory.</div>";		
		}
		if($_GET["error"] == 1)
		{
			echo "<br> <div style='color:#ff0000'>passwords do not match. Please enter same passwords. </div>";
		}
		if($_GET["error"] == 2)
		{
			echo "<br> <div style='color:#ff0000'>Password is too short. Please enter alphanumeric password with at least 8 characters. </div>";
		}
		if($_GET["error"] == 3)
		{
			echo "<br> <div style='color:#ff0000'>Invalid email address. </div>";
		}
			
	
	echo "<form method=\"POST\" action=\"./add_user.php?AddUser=-1\">";
	
	echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Add User</div> ";
	echo "<div align='right' style='color:#ff1014'><a href=\"./home.php\">back</a> </div>";
	
	echo "<br>";
	
	echo "<div align='center'>";
	
	echo "Username: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"text\" name=\"txtUsername\">";	
	
	echo "</div>";
	
	echo "<div align='center'>";
	
	echo "Email: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"text\" name=\"txtEmail\">";	
	
	echo "</div>";
	
	echo "<div align='center'>";
	
	echo "Password: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type=\"password\" name=\"txtPassword\">";	
	
	echo "</div>";
	
	
	echo "<div align='center'>";
	
	echo "Confirm Password:<input type=\"password\" name=\"txtConfirmPassword\">";	
	
	echo "</div>";
	
	echo "<br>";
	
	echo "<div align='center'><input type=\"submit\" name=\"btSubmit\" value=\"Add\">";
	
	
	echo "</form>";
		
	}
	//If AddUser is not true then form is submitted, process the form contents
	else if($_GET["AddUser"] != 1)
	{
	
			echo "<div  align='left' style='background:#AAAAAA;color:#ffffff'>Add User</div> ";			
			
			/***  Server side validations; if invalid render form again ***/
			
				//Check if the fields are empty
			if(!$_POST['txtEmail'] || !$_POST['txtPassword'] || !$_POST['txtConfirmPassword'] || !$_POST['txtUsername'] )
			{
					$_SESSION["AddUser"] = true;
				
						$location = "Location: ./add_user.php?error=0&AddUser=1";
						header($location);
						exit;
			}
			
			else if($_POST['txtPassword'] != $_POST['txtConfirmPassword'])
			{
						$_SESSION["AddUser"] = true;
				
						$location = "Location: ./add_user.php?error=1&AddUser=1";
						header($location);
						exit;
			
			}
			
			else if(strlen($_POST['txtPassword']) < 8 && strlen($_POST['txtPassword']) > 0)
			{
						$_SESSION["AddUser"] = true;
				
						$location = "Location: ./add_user.php?error=2&AddUser=1";
						header($location);
						exit;
			}
			//validate email id
			else if(!filter_var($_POST['txtEmail'], FILTER_VALIDATE_EMAIL))
			{	
						$_SESSION["AddUser"] = true;
				
						$location = "Location: ./add_user.php?error=3&AddUser=1";
						header($location);
					exit;
			}
				
			/****** REST call for registering or adding users to database  ******/
			$ch = curl_init();			
				
			$data_keys = array("username");
			$data_values = array($_POST['txtUsername']);
  
			array_push($data_keys,"password");
			array_push($data_values, $_POST['txtPassword']);

			array_push($data_keys,"email");
			array_push($data_values, $_POST['txtEmail']);

			
			$data = array_combine($data_keys,$data_values);
  
			echo "<br> data:" . $data;
 
			$data_string = json_encode($data); 
 
			echo $data_string;
 
			$rest_api = "http://localhost:4040/admin/adduser/" ;
	
	
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
			
			$curl_response_decoded =  json_decode($curl_response, true);
	
				
			if($curl_response_decoded['status'] == "Success")
			{
					echo "<br> User added successfully";
			}
			else
			{	
					echo "<br> User addition failed";
			}
			$_SESSION["AddUser"] =  true;
	}
	

?>