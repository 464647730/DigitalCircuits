var SelectImageView = function() {
	this.selectImageDiv = document.getElementById("selectImageView");
	this.fileInput = document.getElementById("selectImage");
	this.dispSelectedImage = document.getElementById("dispSelectedImage");
	this.OKButton = document.getElementById("imageSelected");
	this.controller = null;
	this.image = null;
};
SelectImageView.prototype.init = function() {
	this.dispSelectedImage.style.display = "none";
	var image = this.dispSelectedImage;
	image.src = "";
	var selectImageView = this;
	this.fileInput.addEventListener("change", function() {
		if (this.files.length <= 0) {
			image.style.display = "none";
			image.src = "";
			selectImageView.image = null;
			return;
		}
		var fileReader = new FileReader();
		fileReader.onload = function() {
			image.src = this.result;
			image.style.display = "block";
			selectImageView.image = new Image();
			selectImageView.image.src = this.result;
		};
		fileReader.readAsDataURL(this.files[0]);
	}, false);
	var selectImageView = this;
	this.OKButton.addEventListener("click", function() {
		if (selectImageView.image !== null) {
			selectImageView.controller.imageSelected();
		}
	}, false);
};
SelectImageView.prototype.start = function() {
	this.show();
};
SelectImageView.prototype.setController = function(controller) {
	this.controller = controller;
};
SelectImageView.prototype.show = function() {
	this.selectImageDiv.style.display = "block";
};
SelectImageView.prototype.hide = function() {
	this.selectImageDiv.style.display = "none";
};
SelectImageView.prototype.getImage = function() {
	return this.image;
};
