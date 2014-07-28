var CutImageView = new View();

CutImageView.init = function() {
	this.view = document.getElementById("CutImageView");

	this.setQuad = new SetQuad(document.getElementById("set_quad_canvas"));

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
};

