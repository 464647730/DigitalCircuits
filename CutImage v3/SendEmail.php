<?php
session_start();
$base64 = file_get_contents("php://input");
if (isset($_SESSION["email"])) {
	$to = $_SESSION["email"];
} else {
	echo "noemail";
	exit;
}

if (isset($_SESSION["last_index"])) {
	$_SESSION["last_index"]++;
} else {
	$_SESSION["last_index"] = 1;
}
$last_index = $_SESSION["last_index"];
$session_id = session_id();
$filename = "imgs/" . $session_id . $last_index . ".png";
$img = base64_decode($base64);
file_put_contents($filename, $img);

require_once("PHPMailer/PHPMailerAutoload.php");
$me = "pic_handler@163.com";
$mail = new PHPMailer();
$mail->isSMTP();
$mail->Host = "smtp.163.com";
$mail->SMTPAuth = true;
$mail->Username = $me;
$mail->Password = "pichandler";
$mail->From = $me;
$mail->FromName = "处理后图片";
$mail->addAddress($to);
$mail->CharSet = "UTF-8";
$mail->Subject = "图像处理结果";
$mail->Body = "这是您在图像处理网站加工得到的图片。图片在附件中。";
$mail->addAttachment($filename, "处理后图片_" . $last_index . ".png");
if ($mail->send()) {
	echo "emailsendok";
} else {
	echo "emailsendfail";
	// file_put_contents("imgs/log.txt", $mail->ErrorInfo);
}
if (file_exists($filename)) {
	unlink($filename);
}
?>
