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
require_once("RandStr.php");
$randstr = randstr(16);
$session_id = session_id();
$filecode = $session_id . $randstr . $last_index;
$filename = "imgs/" . $filecode . "_1.png";
$img = base64_decode($base64);
file_put_contents($filename, $img);

$host = $_SERVER["HTTP_HOST"];
$path = "/GetImage.php";
$request = $host . $path . "?filecode=" . $filecode;
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
$mail->isHTML(true);
$mail->Subject = "图像处理结果";
$mail->Body = "这是您在图像处理网站加工得到的图片。图片在附件中。<br/><a href='{$request}'>{$request}</a><br/>该链接只可使用三次";
$mail->addAttachment($filename, "处理后图片_" . $last_index . ".png");
if ($mail->send()) {
	echo "emailsendok";
} else {
	echo "emailsendfail";
	// file_put_contents("imgs/log.txt", $mail->ErrorInfo);
}
?>
