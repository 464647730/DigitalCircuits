var ResultImageView = function() {
	this.resultImageDiv = document.getElementById("resultImageView");
	this.imageNode = document.getElementById("resultImageNode");
	this.saveButton = document.getElementById("saveImage");
	this.reSelectButton = document.getElementById("fromresultImageToSelectImage");
	this.controller = null;
};
ResultImageView.prototype.init = function() {
	var resultImage = this;
	this.reSelectButton.addEventListener("click", function() {
		resultImage.controller.reSelect();
	}, false);
};
ResultImageView.prototype.start = function() {
	this.setImage();
	this.saveButton.setAttribute("href", this.imageNode.src);
	this.saveButton.setAttribute("download", "result.png");
	this.show();
};
ResultImageView.prototype.setController = function(controller) {
	this.controller = controller;
};
ResultImageView.prototype.setImage = function() {
	this.imageNode.src = this.controller.resultImage.src;
};
ResultImageView.prototype.show = function() {
	this.resultImageDiv.style.display = "block";
};
ResultImageView.prototype.hide = function() {
	this.resultImageDiv.style.display = "none";
};