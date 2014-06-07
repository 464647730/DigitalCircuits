var SetQuadView = function() {
	this.setQuadDiv = document.getElementById("setQuadView");
	this.setQuad = new SetQuad(document.getElementById("setQuadCanvas"));
	this.OKButton = document.getElementById("quadSeted");
	this.ReturnButton = document.getElementById("fromSetQuadToSelectImage");
	this.controller = null;
	this.image = null;
	this.quad = null;
};
SetQuadView.prototype.init = function() {
	var setQuadView = this;
	this.OKButton.addEventListener("click", function() {
		setQuadView.controller.quadSeted();
	}, false);
	this.ReturnButton.addEventListener("click", function() {
		setQuadView.controller.reSelect();
	}, false);
};
SetQuadView.prototype.start = function() {
	this.setQuad.setImage(this.controller.image);
	this.show();
	this.setQuad.start();
};
SetQuadView.prototype.setController = function(controller) {
	this.controller = controller;
};
SetQuadView.prototype.show = function() {
	this.setQuadDiv.style.display = "block";
};
SetQuadView.prototype.hide = function() {
	this.setQuadDiv.style.display = "none";
};
SetQuadView.prototype.getQuad = function() {
	return this.setQuad.getQuadData();
};
