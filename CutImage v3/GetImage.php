<?php
$filecode = $_GET["filecode"];
$max_get = 3;
for ($i = 1; $i <= $max_get; $i++) {
	$filename = "imgs/" . $filecode . "_" . $i . ".png";
	if (file_exists($filename)) {
		break;
	}
}
if ($i > $max_get) {
	echo "Error";
	exit;
}
header("Content-Type: image/png");
$img = imagecreatefrompng($filename);
imagepng($img);
imagedestroy($image);
if ($i == $max_get) {
	unlink($filename);
} else {
	$i++;
	$newfilename = "imgs/" . $filecode . "_" . $i . ".png";
	rename($filename, $newfilename);
}
?>
