var ImageTransformer = {
	convertImageToMyImageData: function(image) {
		return this.convertCanvasImageDataToMyImageData(this.convertImageToCanvasImageData(image));
	},
	convertImageToCanvasImageData: function(image) {
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0);
		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	},
	convertCanvasImageDataToMyImageData: function(canvasImageData) {
		var myImageData = new MyImageData();
		myImageData.setSize(canvasImageData.width, canvasImageData.height);
		myImageData.data = new Uint8ClampedArray(canvasImageData.data);
		return myImageData;
	},
	convertMyImageDataToImage: function(myImageData) {
		var canvas = document.createElement("canvas");
		canvas.width = myImageData.getWidth();
		canvas.height = myImageData.getHeight();
		var ctx = canvas.getContext("2d");
		var canvasImageData = ctx.createImageData(myImageData.getWidth(), myImageData.getHeight());
		var length = myImageData.data.length;
		for (var i = 0; i < length; i++) {
			canvasImageData.data[i] = myImageData.data[i];
		}
		ctx.putImageData(canvasImageData, 0, 0);
		var image = new Image();
		image.src = canvas.toDataURL("image/png");
		return image;
	}
};

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

var MyImageData = function(width, height) {
	this.__width = 0;
	this.__height = 0;
	this.data = [];
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
	var arrayPosition = (position.x * this.__width + position.y) * 4;
	if (arrayPosition < 0 || arrayPosition >= (this.__width * this.__height * 4)) {
		return new Color(0, 0, 0, 255);
	}
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
	var arrayPosition = (p.x * this.__width + p.y) * 4;
	this.data[arrayPosition] = color.red;
	this.data[arrayPosition+1] = color.green;
	this.data[arrayPosition+2] = color.blue;
	this.data[arrayPosition+3] = color.alpha;
};
