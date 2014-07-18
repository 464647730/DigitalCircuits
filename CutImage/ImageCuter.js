var ImageCuter = function() {
};
ImageCuter.prototype.cut = function(imageData, p1, p2, p3, p4, newWidth, newHeight) {
	var resultImageData = new MyImageData(newWidth, newHeight);
	var color, originPosition;
	for (var i = 0; i < newWidth; i++) {
		for (var j = 0; j < newHeight; j++) {
			originPosition = this.__getOriginPosition(p1, p2, p3, p4, newWidth, newHeight, i, j);
			color = imageData.getColor(originPosition);
			resultImageData.setColor(new Point(i, j), color);
		}
	}
	return resultImageData;
};
ImageCuter.prototype.__getOriginPosition = function(p1, p2, p3, p4, newWidth, newHeight, x, y) {
	var A = x / newWidth,
		B = y / newHeight;
	var originPosition = new Point();
	originPosition.x = (1-A)*(1-B)*p1.x + A*(1-B)*p2.x + A*B*p3.x + (1-A)*B*p4.x;
	originPosition.y= (1-A)*(1-B)*p1.y + A*(1-B)*p2.y + A*B*p3.y + (1-A)*B*p4.y;
	return originPosition;
};