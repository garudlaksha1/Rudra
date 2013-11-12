<?php

require("./Login/check.php");

?>

<html>	
	<head>
	<title> Rudra Home </title>	
	
	<script src = "jquery-ui/js/jquery-1.9.1.js"></script>
	<script src="jquery-ui/js/jquery-ui-1.10.3.custom.js"></script>
	<link rel="stylesheet"  type="text/css" href="jquery-ui/css/overcast/jquery-ui-1.10.3.custom.css">
	
	
	<style>
	
		div.container{
			
				border-style:solid;
				border-width:1.5px;
				border-color: #1A3972;
				margin: auto;
				background-color: #B6CDEF;
				width:50%
		}
			
	
	</style>
	
	<script>
	
				 window.history.forward();
			function noBack() { window.history.forward(); }
		
			$(document).ready(	function() {			
				
									$( "#button" ).button();
									$( "#radioset" ).buttonset();		
                  
									$( "#tabs" ).tabs({

																	load: function(event, ui) {
																	$(ui.panel).delegate('a', 'click', function(event) {
																	$(ui.panel).load(this.href);
																	event.preventDefault();
												});
										}				
				
									});	
				
									$("#tabs").bind('tabsselect', function(event, ui) {
									window.location.href=ui.tab;
								});
			   
			});	

			</script>	
	</head>

	<body onload="noBack();"    onpageshow="if (event.persisted) noBack();" onunload="">

	<div id="header" >

	<div style="width: 90%; margin-left: 0%" align="left">
			<img src="./img/Rudra.jpg" alt="Rudra" height="100" width="112">
			 
	</div>
	<div style="width: 10%; margin-left: 90%" align="right">
		Welcome <?php echo $_SESSION['username']  ?>
		&nbsp;&nbsp;<a href="./Login/logout.php">Logout </a>
	</div>
	
</div>


<div id="tabs" style="width: 90%; margin-left: 10%" align="right">
		<ul>
		<li><a href="./Scan/get_clients.php?username=<?php echo $_GET['username']?>" id="tablink"><span>Scan</span></a></li>
		<li><a href="./Controller/controller_tools.php" id="tablink"><span>Controller Configuration</span></a></li>
		<li><a href="./report.php" id="tablink"><span>Report</span></a></li>
		<li><a href="./Users.php" id="tablink">Users</li>

	</ul>
	
</div>
 
 </body>
 	 
 </html>