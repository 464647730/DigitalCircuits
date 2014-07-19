// SmartImageCuter也是工具类，没有必要设计为类，直接声明为对象
var SmartImageCuter = {
	cut: function(myImageData, p1, p2, p3, p4) {
		var newSize = this.getDefaultNewImageSize(p1, p2, p3, p4);
		return ImageCuter.cut(myImageData, p1, p2, p3, p4, newSize);
	},
	getDefaultNewImageSize: function(p1, p2, p3, p4) {
		var newWidth = Math.floor((p2.x - p1.x + p3.x - p4.x) / 2);
		var newHeight = Math.floor((p4.y - p1.y + p3.y - p2.y) / 2);
		return new Size(newWidth, newHeight);
	}
};
