var ResultImageView = new View();
ResultImageView.init = function() {
	this.view = document.getElementById("resultImageView");
	this.imageNode = document.getElementById("resultImageNode");
	this.saveButton = document.getElementById("saveImage");
	this.reSelectButton = document.getElementById("toSselectImage");
	this.grayFilterButton = document.getElementById("grayFilterView");

	this.resultImageData = null;
	this.resultImage = null;

	var that = this;
	this.reSelectButton.addEventListener("click", function() {
		that.gotoView(SelectImageView, {});
	}, false);
	this.grayFilterButton.addEventListener("click", function() {
		if (that.resultImageData !== null) {
			GrayFilter.filter(that.resultImageData);
			if (that.resultImage !== null) {
				that.imageNode.removeChild(that.resultImage);
			}
			that.resultImage = that.resultImageData.toImage();
			that.imageNode.appendChild(that.resultImage);
		}
	});
};

ResultImageView.beforeDisplay = function() {
	if (this.resultImage !== null) {
		this.imageNode.removeChild(this.resultImage);
	}
	this.resultImageData = this.receivedData["resultImageData"];
	this.resultImage = this.resultImageData.toImage();
	this.imageNode.appendChild(this.resultImage);
};
