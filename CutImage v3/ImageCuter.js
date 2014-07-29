/*
切图对象
参数：
	1. 图像
	2. 切割区域
	3. 目标图像大小
返回值：切割后得到的图像
*/
var ImageCuter = {
	// 切割
	cut: function(myImageData, p1, p2, p3, p4, newSize) {
		var resultImageData = new MyImageData(newSize);
		var color, originPosition;
		var c = 0;
		for (var i = 0; i < newSize.width; i++) {
			for (var j = 0; j < newSize.height; j++) {
				originPosition = this.getCorrespondingOriginPosition(p1, p2, p3, p4, newSize, i, j);
				color = myImageData.getColor(originPosition);
				resultImageData.setColor(new Point(i, j), color);
			}
		}
		return resultImageData;
	},
	// 根据目标图片中的一个点获取它对应的原图上的点
	getCorrespondingOriginPosition: function(p1, p2, p3, p4, newSize, x, y) {
		var A = x / (newSize.width - 1), B = y / (newSize.height - 1);
		var originPosition = new Point();
		originPosition.x = (1-A)*(1-B)*p1.x + A*(1-B)*p2.x + A*B*p3.x + (1-A)*B*p4.x;
		originPosition.y= (1-A)*(1-B)*p1.y + A*(1-B)*p2.y + A*B*p3.y + (1-A)*B*p4.y;
		return originPosition;
	}
};