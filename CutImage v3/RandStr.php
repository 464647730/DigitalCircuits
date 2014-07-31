<?php
function randstr($n) {
	$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	$str = "";
	$max = strlen($chars) - 1;
	for ($i = 0; $i < $n; $i++) {
		$str .= $chars[mt_rand(0, $max)];
	}
	return $str;
}
?>
