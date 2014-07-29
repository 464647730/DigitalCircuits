/*
三个数据结构，分别是Point，Color和Size，被其他js文件使用。
*/
var Point = function(x, y) {
	this.x = x; this.y = y;
};

var Color = function(red, green, blue, alpha) {
	this.red = red; this.green = green; this.blue = blue; this.alpha = alpha;
};

var Size = function(width, height) {
	this.width = width; this.height = height;
};

