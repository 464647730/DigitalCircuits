/*
 * 自定义图像数据
 * 封装canvas的imagedata类，并提供更多的参数内核方法
 */

var MyImageData = function(size) {
	this.isGray = false; // 是否是灰度图
	this.imagedata = null; // 图像数据，包含了图像像素数据和尺寸
	if (size !== undefined) { // 如果有size参数，则创建size尺寸的imagedata
		this.createImageData(size);
	}
};
// 获取图像宽度
MyImageData.prototype.getWidth = function() {
	return this.imagedata.width;
};
// 获取图像高度
MyImageData.prototype.getHeight = function() {
	return this.imagedata.height;
};
// 由imagedata设置图像数据
MyImageData.prototype.setValueByImageData = function(newImageData) {
	this.imagedata = newImageData;
};
// 由Image对象设置图像数据
MyImageData.prototype.setValueByImage = function(image) {
	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	var context = canvas.getContext("2d");
	context.drawImage(image, 0, 0);
	this.imagedata = context.getImageData(0, 0, canvas.width, canvas.height);;
};
// 由dataurl设置图像数据
MyImageData.prototype.setValueByDataURL = function(dataurl) {
	var image = new Image();
	var that = this;
	image.onload = function() {
		that.setValueByImage(image);
	};
	image.src = dataurl;
};
// 转化为Image对象
MyImageData.prototype.toImage = function() {
	var image = new Image();
	image.src = this.toDataURL();
	return image;
};
// 转化为dataurl
MyImageData.prototype.toDataURL = function() {
	var canvas = document.createElement("canvas");
	canvas.width = this.imagedata.width;
	canvas.height = this.imagedata.height;
	var context = canvas.getContext("2d");
	context.putImageData(this.imagedata, 0, 0);
	return canvas.toDataURL("image/png");
};
// 新建imagedata
MyImageData.prototype.createImageData = function(size) {
	var canvas = document.createElement("canvas");
	canvas.width = size.width;
	canvas.height = size.height;
	this.imagedata = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
};
// 获取imagedata
MyImageData.prototype.getImageData = function() {
	return this.imagedata;
};
// 在canvas中显示
MyImageData.prototype.show = function(canvas) {
	canvas.width = this.getWidth();
	canvas.height = this.getHeight();
	canvas.getContext("2d").putImageData(this.imagedata, 0, 0);
};
// 判断一点是否超出图像边界
MyImageData.prototype.outOfBorder = function(position) {
	if (position.x < 0 || position.x >= this.getWidth() || position.y < 0 || position.y >= this.getHeight()) {
		return true;
	} else {
		return false;
	}
};
// 获取图像某一整数点的像素值
MyImageData.prototype.getColorAtWholeCoordinate = function(position) {
	if (this.outOfBorder(position)) {
		return new Color(0, 0, 0, 255);
	}
	var arrayPosition = (position.y * this.getWidth() + position.x) * 4;
	var color = new Color();
	color.red = this.imagedata.data[arrayPosition];
	color.green = this.imagedata.data[arrayPosition+1];
	color.blue = this.imagedata.data[arrayPosition+2];
	color.alpha = this.imagedata.data[arrayPosition+3];
	return color;
};
// 获取任意点的像素值
// 如果坐标不是整点，则使用双线性插值法获取该坐标处的像素值
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
// 设置某一点处的像素值
MyImageData.prototype.setColor = function(p, color) {
	var arrayPosition = (p.y * this.getWidth() + p.x) * 4;
	/*
	 * 这里color中的数据是一个实数，可能超出0~255的范围，我们应该进行转化
	 * 但实际上，imagedada.data是Uint8ClampedArray格式数组，可以自动转化
	 * 这里就不必预先转化
	 */
	this.imagedata.data[arrayPosition] = color.red;
	this.imagedata.data[arrayPosition+1] = color.green;
	this.imagedata.data[arrayPosition+2] = color.blue;
	this.imagedata.data[arrayPosition+3] = color.alpha;
};
