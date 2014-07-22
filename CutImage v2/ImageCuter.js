// 工具类，不保存数据
// 直接声明为对象，不必设计成类
var ImageCuter = {
	cut: function(myImageData, p1, p2, p3, p4, newSize) {
		var resultImageData = new MyImageData(newSize);
		var color, originPosition;
		for (var i = 0; i < newSize.width; i++) {
			for (var j = 0; j < newSize.height; j++) {
				originPosition = this.getCorrespondingOriginPosition(p1, p2, p3, p4, newSize, i, j);
				color = myImageData.getColor(originPosition);
				resultImageData.setColor(new Point(i, j), color);
			}
		}
		return resultImageData;
	},
	getCorrespondingOriginPosition: function(p1, p2, p3, p4, newSize, x, y) {
		var A = x / newSize.width, B = y / newSize.height;
		var originPosition = new Point();
		originPosition.x = (1-A)*(1-B)*p1.x + A*(1-B)*p2.x + A*B*p3.x + (1-A)*B*p4.x;
		originPosition.y= (1-A)*(1-B)*p1.y + A*(1-B)*p2.y + A*B*p3.y + (1-A)*B*p4.y;
		return originPosition;
	}
};