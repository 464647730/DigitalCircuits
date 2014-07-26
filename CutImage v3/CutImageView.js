var CutImageView = new View();

CutImageView.init = function() {
	this.view = document.getElementById("CutImageView");

	this.setQuad = new SetQuad(document.getElementById("set_quad_canvas"));
	this.setQuad.init();

	var that = this;
	document.getElementById("set_quad").addEventListener("click", function() {
		var quad = that.setQuad.getQuad();
		console.log(globaldata.imagedata.id);
		var resultImageData = SmartImageCuter.cut(globaldata.imagedata, quad[0], quad[1], quad[2], quad[3]);
		console.log(resultImageData.id);
		globaldata.imagedata = resultImageData;
		console.log(globaldata.imagedata.id);
		that.gotoView(MainView);
	}, false);
	document.getElementById("cut_image_quit").addEventListener("click", function() {
		that.gotoView(MainView);
	}, false);
};

CutImageView.beforeDisplay = function() {
	this.setQuad.setBackground(globaldata.imagedata);
};

