// canvas提供的imagedata作为图像的数据部分。
// 这里封装imagedata，以提供一些操作。
var MyImageData = function(size) {
	this.imagedata = null;
	if (size !== undefined) {
		this.createImageData(size);
	}
};
MyImageData.prototype.getWidth = function() {
	return this.imagedata.width;
};
MyImageData.prototype.getHeight = function() {
	return this.imagedata.height;
};
MyImageData.prototype.setImageData = function(newImageData) {
	this.imagedata = newImageData;
};
MyImageData.prototype.createImageData = function(size) {
	var canvas = document.createElement("canvas");
	canvas.width = size.width;
	canvas.height = size.height;
	this.imagedata = getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
};
MyImageData.prototype.readImage = function(image) {
	var canvas = document.createElement("canvas");
}
MyImageData.prototype.getImageData = function() {
	return this.imagedata;
};
MyImageData.prototype.outOfBorder = function(position) {
	if (position.x < 0 || position.x >= this.getWidth() || position.y < 0 || position.y >= this.getHeight()) {
		return true;
	} else {
		return false;
	}
};
MyImageData.prototype.getColorAtWholeCoordinate = function(position) {
	if (this.outOfBorder(position)) {
		return new Color(0, 0, 0, 255);
	}
	var arrayPosition = (position.y * this.getWidth() + position.x) * 4;
	var color = new Color();
	color.red = this.data[arrayPosition];
	color.green = this.data[arrayPosition+1];
	color.blue = this.data[arrayPosition+2];
	color.alpha = this.data[arrayPosition+3];
	return color;
};
MyImageData.prototype.getColor = function(position) {
	var color = new Color();
	var p1 = new Point(Math.floor(position.x), Math.floor(position.y)),
		p2 = new Point(Math.ceil(position.x), Math.floor(position.y)),
		p3 = new Point(Math.ceil(position.x), Math.ceil(position.y)),
		p4 = new Point(Math.floor(position.x), Math.ceil(position.y));
	var color1 = this.getColorAtWholeCoordinate(p1),
		color2 = this.getColorAtWholeCoordinate(p2),
		color3 = this.getColorAtWholeCoordinate(p3),
		color4 = this.getColorAtWholeCoordinate(p4);
	var A = (position.x - p1.x),
		B = (position.y - p1.y);
	var k1, k2, k3, k4;
	if (p1.y === p4.y && p1.x === p2.x) {
		color = color1;
	} else if (p1.y === p4.y) {
		k1 = (1-A);
		k2 = A;
		color.red = k1*color1.red + k2*color2.red;
		color.green = k1*color1.red + k2*color2.red;
		color.blue = k1*color1.red + k2*color2.red;
		color.alpha = k1*color1.red + k2*color2.red;
	} else if (p1.x === p2.x) {
		k1 = (1-B);
		k2 = B;
		color.red = k1*color1.red + k2*color4.red;
		color.green = k1*color1.red + k2*color4.red;
		color.blue = k1*color1.red + k2*color4.red;
		color.alpha = k1*color1.red + k2*color4.red;
	} else {
		k1 = (1-A)*(1-B);
		k2 = A*(1-B);
		k3 = A*B;
		k4 = (1-A)*B;
		color.red = k1*color1.red + k2*color2.red + k3*color3.red + k4*color4.red;
		color.green = k1*color1.green + k2*color2.green + k3*color3.green + k4*color4.green;
		color.blue = k1*color1.blue + k2*color2.blue + k3*color3.blue + k4*color4.blue;
		color.alpha = k1*color1.alpha + k2*color2.alpha + k3*color3.alpha + k4*color4.alpha;
	}
	return color;
};
MyImageData.prototype.setColor = function(p, color) {
	var arrayPosition = (p.y * this.__width + p.x) * 4;
	this.data[arrayPosition] = Math.round(color.red);
	this.data[arrayPosition+1] = Math.round(color.green);
	this.data[arrayPosition+2] = Math.round(color.blue);
	this.data[arrayPosition+3] = Math.round(color.alpha);
};
