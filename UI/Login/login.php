

<html>

	<head>
	<title> Rudra </title>
	<script src = "jquery-ui/js/jquery-1.9.1.js"></script>
	<script src="jquery-ui/js/jquery-ui-1.10.3.custom.js"></script>
	<link rel="stylesheet"  type="text/css" href="jquery-ui/css/overcast/jquery-ui-1.10.3.custom.css">
	
	<script>
	
		
			$(function() {			
				
				$( "#button" ).button();
				$( "#radioset" ).buttonset();		
				$( "#tabs" ).tabs();
				
		
			
			});
			
			</script>
	
	</head>

<body>
	
	 
<frameset  rows="25%,*">

	<frame src="/img/Rudra.jpg">
	<frame>
<!--  echo '<form action="login.php" method="post"><input type="hidden" name="ac" value="log"> ';  -->
    <p> Username: <input type="text" name="username" /> 
    <p> Password: <input type="password" name="password" />
    <p><input type="button" id="button" value="Login" /> 
    <!-- echo '</form>'; -->
	</frame>
</frameset>	

 </body>
	 
 </html>