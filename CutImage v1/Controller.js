var Controller = function() {
	this.selectImageView = null;
	this.image = null;
	this.setQuadView = null;
	this.quad = null;
	this.resultImageView = null;
	this.resultImage = null;
	this.smartImageCuter = null;
};
Controller.prototype.init = function() {
	this.selectImageView = new SelectImageView();
	this.selectImageView.init();
	this.selectImageView.setController(this);
	this.setQuadView = new SetQuadView();
	this.setQuadView.init();
	this.setQuadView.setController(this);
	this.resultImageView = new ResultImageView();
	this.resultImageView.init();
	this.resultImageView.setController(this);
	this.smartImageCuter = new SmartImageCuter();
};
Controller.prototype.start = function() {
	this.startSelectImageView();
};
Controller.prototype.startSelectImageView = function() {
	this.selectImageView.start();
	this.setQuadView.hide();
	this.resultImageView.hide();
};
Controller.prototype.imageSelected = function() {
	this.image = this.selectImageView.getImage();
	this.startSetQuadView();
};
Controller.prototype.startSetQuadView = function() {
	this.setQuadView.start();
	this.selectImageView.hide();
};
Controller.prototype.reSelect = function() {
	this.selectImageView.start();
	this.setQuadView.hide();
	this.resultImageView.hide();
};
Controller.prototype.quadSeted = function() {
	this.quad = this.setQuadView.getQuad();
	this.cutImage();
	this.startResultImageView();
};
Controller.prototype.startResultImageView = function() {
	this.resultImageView.start();
	this.setQuadView.hide();
};
Controller.prototype.cutImage = function() {
	var myImageData = ImageTransformer.convertImageToMyImageData(this.image);
	var resultMyImageData = this.smartImageCuter.cut(myImageData, this.quad[0], this.quad[1], this.quad[2], this.quad[3]);
	this.resultImage = ImageTransformer.convertMyImageDataToImage(resultMyImageData);
	this.dispResult();
};
Controller.prototype.dispResult = function() {
	this.resultImageView.start();
	this.setQuadView.hide();
};
Controller.prototype.saveResult = function() {
	this.resultImageView.saveImage();
};
