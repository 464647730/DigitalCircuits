<?php
header("Content-type: image/png");
$im = imagecreate((int)$_GET["w"], (int)$_GET["h"]);
$bg = imagecolorallocate($im, 255, 255, 255);
$black = imagecolorallocate($im, 0, 0, 0);

$l = (int)$_GET["l"];
$bottom = 15;
for ($i = 0; $i < $l; $i++) {
    $label = $_GET["l" . $i];
    $value = $_GET["v" . $i];

    $box = imagettfbbox(12, 0, "./georgia.ttf", $label);
    $bottom += 24;
    $top = $bottom - 19;
    $w = $box[2] - $box[0];
    $x = 60 - $w; $y = $bottom - $box[1];
    imagettftext($im, 12, 0, $x, $y, $black, "./georgia.ttf", $label);

    $x1 = 70;
    $selfIsHigh = true;
    if ($value[0] == "h") {
        $y1 = $top;
    } else {
        $y1 = $bottom;
        $selfIsHigh = false;
    }
    $x2 = $x1 + 8; $y2 = $y1;
    imageline($im, $x1, $y1, $x2, $y2, $black);
    $len = strlen($value);
    for ($j = 1; $j < $len; $j++) {
        if ($value[$j] == "c") {
            $selfIsHigh = !$selfIsHigh;
            $x1 = $x2;
            if ($selfIsHigh) {
                $y1--;
                $y2 = $top;
            } else {
                $y1++;
                $y2 = $bottom;
            }
            imageline($im, $x1, $y1, $x2, $y2, $black);
        }
        $x1 = $x2 + 1;
        if ($j == $len - 1) {
            $x2 += 8;
        } else {
            $x2 += 20;
        }
        $y1 = $y2;
        imageline($im, $x1, $y1, $x2, $y2, $black);
    }
}
imagepng($im);
imagedestroy($im);
?>