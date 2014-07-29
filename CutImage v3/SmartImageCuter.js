/*
切图对象
参数：图片，四个顶点
该函数将自动设置结果图像的尺寸
*/
var SmartImageCuter = {
	// 切图
	cut: function(myImageData, p1, p2, p3, p4) {
		var newSize = this.getDefaultNewImageSize(p1, p2, p3, p4);
		return ImageCuter.cut(myImageData, p1, p2, p3, p4, newSize);
	},
	// 获取目标图像尺寸
	getDefaultNewImageSize: function(p1, p2, p3, p4) {
		var newWidth = Math.floor((p2.x - p1.x + p3.x - p4.x) / 2);
		var newHeight = Math.floor((p4.y - p1.y + p3.y - p2.y) / 2);
		return new Size(newWidth, newHeight);
	}
};
