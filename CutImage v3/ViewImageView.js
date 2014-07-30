/*
 * 展示页面
 * 在坐标系中绘制结果图片
 */
var ViewImageView = new View();

ViewImageView.init = function() {
	this.view = document.getElementById("ViewImageView");
	this.canvas = document.getElementById("view_image_canvas");
	// 坐标系绘制实例
	this.coordinate = new Coordinate(this.canvas);

	var that = this;
	document.getElementById("view_image_back").addEventListener("click", function() {
		that.gotoView(MainView);
	}, false);
};

ViewImageView.beforeDisplay = function() {
	this.coordinate.setContent(globaldata.history.curr().imagedata);
    this.canvas.style.marginTop = (document.body.clientHeight * 0.9 - this.canvas.height) / 2 + "px";
};


