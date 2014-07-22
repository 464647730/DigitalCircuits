var SetQuadView = new View();

SetQuadView.init = function() {
	this.view = document.getElementById("setQuadView");
	this.OKButton = document.getElementById("quadSeted");
	this.ReturnButton = document.getElementById("fromSetQuadToSelectImage");

	this.setQuad = new SetQuad(document.getElementById("setQuadCanvas"));
	this.setQuad.init();
	this.image = null;
	this.quad = null;

	var that = this;
	this.OKButton.addEventListener("click", function() {
		var quad = that.setQuad.getQuad();
		var myImageData = new MyImageData();
		myImageData.setValueByImage(that.image);
		var resultImageData = SmartImageCuter.cut(myImageData, quad[0], quad[1], quad[2], quad[3]);
		that.gotoView(ResultImageView, { "resultImageData": resultImageData });
	}, false);
	this.ReturnButton.addEventListener("click", function() {
		that.gotoView(SelectImageView, {});
	}, false);
};

SetQuadView.beforeDisplay = function() {
	this.image = this.receivedData["selectedImage"];
	this.setQuad.setImage(this.image);
};

