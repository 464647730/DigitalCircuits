var SmartImageCuter = function() {
	this.__imageCuter = new ImageCuter();
};
SmartImageCuter.prototype.cut = function(myImageData, p1, p2, p3, p4) {
	var newSize = this.__getNewImageSize(p1, p2, p3, p4);
	return this.__imageCuter.cut(myImageData, p1, p2, p3, p4, newSize[0], newSize[1]);
};
SmartImageCuter.prototype.__getNewImageSize = function(p1, p2, p3, p4) {
	var newWidth = Math.floor((p2.x - p1.x + p3.x - p4.x) / 2);
	var newHeight = Math.floor((p4.y - p1.y + p3.y - p2.y) / 2);
	return [newWidth, newHeight];
};

var Point = function(x, y) {
	this.x = x; this.y = y;
};

var Color = function(red, green, blue, alpha) {
	this.red = red; this.green = green; this.blue = blue; this.alpha = alpha;
};