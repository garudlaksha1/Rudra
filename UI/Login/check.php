<?php

//check for valid session page

//Start the session if it hasn't been started yet
if(!defined("SESSIONSTARTED")){
 session_start();
}
//Check if the user has been logged in
if(!isset($_SESSION["started"]) || $_SESSION["started"] == false){
 //If he hasn't, send him back to the homepage
 echo "<meta http-equiv='refresh' content='3;URL=login.html'/> ";
 die;
}
//Tell your program the session has been started. This will prevent some useless error messages
define("SESSIONSTARTED", 1);

//echo "Valid session <br>";


?>