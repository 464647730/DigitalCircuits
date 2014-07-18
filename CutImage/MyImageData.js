var MyImageData = function(width, height) {
	this.__width = 0;
	this.__height = 0;
	this.data = null;
	if (width != undefined && height != undefined) {
		this.setSize(width, height);
	}
};
MyImageData.prototype.getWidth = function() {
	return this.__width;
};
MyImageData.prototype.getHeight = function() {
	return this.__height;
};
MyImageData.prototype.setSize = function(newWidth, newHeight) {
	this.__width = newWidth;
	this.__height = newHeight;
	this.data = new Uint8ClampedArray(this.__width * this.__height * 4);
};
MyImageData.prototype.__getFullColor = function(position) {
	if (position.x < 0 || position.x >= this.__width || position.y < 0 || position.y >= this.__height) {
		return new Color(0, 0, 0, 255);
	}
	var arrayPosition = (position.y * this.__width + position.x) * 4;
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
	var color1 = this.__getFullColor(p1),
		color2 = this.__getFullColor(p2),
		color3 = this.__getFullColor(p3),
		color4 = this.__getFullColor(p4);
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