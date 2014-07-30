/*
切图页面
用户用鼠标指定将要切割出来的区域
切割图片，返回主页面
*/
var CutImageView = new View();

CutImageView.init = function() {
	this.view = document.getElementById("CutImageView"); // 获取页面
	this.canvas = document.getElementById("set_quad_canvas");

	/*
	 * SetQuad实例
	 * 修饰一个canvas元素，使之可以与用户交互
	 * 以此可选定一个区域
	 */
	this.setQuad = new SetQuad(this.canvas);

	var that = this;
	document.getElementById("set_quad").addEventListener("click", function() {
		var quad = that.setQuad.getQuad();
		var resultImageData = SmartImageCuter.cut(globaldata.history.curr(), quad[0], quad[1], quad[2], quad[3]);
		globaldata.history.add(resultImageData);
		that.gotoView(MainView);
	}, false);
	document.getElementById("cut_image_quit").addEventListener("click", function() {
		that.gotoView(MainView);
	}, false);
};

CutImageView.beforeDisplay = function() {
	this.setQuad.setBackground(globaldata.history.curr());
    this.canvas.style.marginTop = (document.body.clientHeight * 0.9 - this.canvas.height) / 2 + "px";
};

