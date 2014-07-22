var ResultImageView = new View();
ResultImageView.init = function() {
	this.view = document.getElementById("resultImageView");
	this.imageNode = document.getElementById("resultImageNode");
	this.saveButton = document.getElementById("saveImage");
	this.reSelectButton = document.getElementById("fromresultImageToSelectImage");

	this.resultImage = null;

	var that = this;
	this.reSelectButton.addEventListener("click", function() {
		that.gotoView(SelectImageView, {});
	}, false);
};

ResultImageView.beforeDisplay = function() {
	this.resultImage = this.receivedData["resultImageData"].toImage();
	this.imageNode.appendChild(this.resultImage);
};
