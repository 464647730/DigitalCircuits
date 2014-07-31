var GetPhoneImage = function(canvas) {
	this.canvas = canvas;
	this.getSessionIdUrl = "http://localhost/GetSessionId.php";
	this.session_id = null;
	this.randCode = null;
	this.uploadUrl = "http://localhost/UploadImage.php";
	this.uploadRequest = null;
	this.downloadUrl = "http://localhost/GetImage.php";
	this.downloadRequest = null;
	this.filecode = null;
	this.onImageLoaded = function() {};
	this.image = null;
	
	this.init();
};

GetPhoneImage.prototype.init = function() {
	this.getSessionId();
};

GetPhoneImage.prototype.reset = function() {
	this.getRandCode();
	this.makeUploadRequest();
	this.drawUploadRequest();
};

GetPhoneImage.prototype.getSessionId = function() {
	var that = this;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			that.session_id = this.responseText;
		}
	}
	xmlhttp.open("GET", this.getSessionIdUrl, true);
	xmlhttp.send();
};

GetPhoneImage.prototype.getRandCode = function() {
	this.randCode = randstr(16);
};

GetPhoneImage.prototype.makeUploadRequest = function() {
	this.uploadRequest = this.uploadUrl + "?session_id=" + this.session_id + "&randCode=" + this.randCode;
};

GetPhoneImage.prototype.drawUploadRequest = function() {
	QRCodeDrawer.drawContent(this.canvas, this.uploadRequest);
};

GetPhoneImage.prototype.setOnImageLoaded = function(onImageLoaded) {
	this.onImageLoaded = onImageLoaded;
};

GetPhoneImage.prototype.downloadImage = function() {
	this.fillcode = this.session_id + this.randCode;
	this.downloadRequest = this.downloadUrl + "?filecode=" + this.fillcode;
	this.image =  new Image();
	var that = this;
	this.image.onload = function() {
		that.onImageLoaded(this);
	};
	this.image.src = this.downloadRequest;
};


