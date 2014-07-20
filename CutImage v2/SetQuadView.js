var SetQuadView = new View();

SetQuadView.init = function() {
	this.view = document.getElementById("setQuadView");
	this.OKButton = document.getElementById("quadSeted");
	this.ReturnButton = document.getElementById("fromSetQuadToSelectImage");

	this.setQuad = new SetQuad(document.getElementById("setQuadCanvas"));
	this.image = null;
	this.quad = null;

	var that = this;
	this.OKButton.addEventListener("click", function() {
		var quad = that.setQuad.getQuad();
		var myImageData = new MyImageData();
		console.log(that.image);
		myImageData.setValueByImage(that.image);
		console.log(quad);
		var resultImageData = SmartImageCuter.cut(myImageData, quad[0], quad[1], quad[2], quad[3]);
		that.gotoView(ResultImageView, { "resultImageData": resultImageData });
	}, false);
	this.ReturnButton.addEventListener("click", function() {
		console.log("1");
		that.gotoView(SelectImageView, {});
		console.log("2");
	}, false);
};

SetQuadView.beforeDisplay = function() {
	this.image = this.receivedData["selectedImage"];
	this.setQuad.setImage(this.image);
	this.setQuad.start();
};

