var SelectImageView = new View();

SelectImageView.init = function() {
	this.view = document.getElementById("selectImageView");
	this.fileInput = document.getElementById("selectImage");
	this.dispSelectedImageNode = document.getElementById("dispSelectedImageNode");
	this.OKButton = document.getElementById("imageSelected");

	this.image = null;

	var that = this;
	this.fileInput.addEventListener("change", function() {
		if (this.files.length <= 0) {
			var nodes = that.dispSelectedImageNode.childNodes;
			for (node in nodes) {
				that.dispSelectedImageNode.removeChild(node);
			}
			that.image = null;
			return;
		}
		var fileReader = new FileReader();
		fileReader.onload = function() {
			that.image = new Image();
			that.image.src = this.result;
			that.dispSelectedImageNode.appendChild(that.image);
		};
		fileReader.readAsDataURL(this.files[0]);
	}, false);
	this.OKButton.addEventListener("click", function() {
		if (that.image !== null) {
			that.gotoView(SetQuadView, { "selectedImage": that.image });
		}
	}, false);
};
