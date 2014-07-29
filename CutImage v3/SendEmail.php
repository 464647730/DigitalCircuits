<?php
$base64 = file_get_contents("php://input");
require_once("PHPMailer/PHPMailerAutoload.php");

$me = "bfbrmt@126.com";

$mail = new PHPMailer();
$mail->isSMTP();
$mail->Host = "smtp.126.com";
$mail->SMTPAuth = true;
$mail->Username = $me;
$mail->Password = "hdd2011bfbrmt";
$mail->From = $me;
$mail->FromName = "处理后图片";
$mail->addAddress = $
echo "ok";
?>
