var GetPhoneImageView = new View();

GetPhoneImageView.init = function() {
	this.view = document.getElementById("GetPhoneImageView");
	this.canvas = document.getElementById("get_phone_image_canvas");
	this.getPhoneImage = new GetPhoneImage(this.canvas);
	
	var that = this;
	this.getPhoneImage.setOnImageLoaded(function(image) {
		that.onImageLoaded(image);
	});
	document.getElementById("get_phone_image_ok").addEventListener("click", function() {
		that.gotoView(MainView);
	}, false);
	document.getElementById("get_phone_image_quit").addEventListener("click", function() {
		that.gotoView(MainView);
	}, false);
};

GetPhoneImageView.beforeDisplay = function() {
	this.getPhoneImage.reset();
};

GetPhoneImageView.onImageLoaded = function(image) {
	var imagedata = new MyImageData();
	imagedata.setValueByImage(image);
	globaldata.history.add(imagedata);
	this.gotoView(MainView);
};

