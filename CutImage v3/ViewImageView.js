var ViewImageView = new View();

ViewImageView.init = function() {
	this.view = document.getElementById("ViewImageView");
	this.coordinate = new Coordinate(document.getElementById("view_image_canvas"));

	var that = this;
	document.getElementById("view_image_back").addEventListener("click", function() {
		that.gotoView(MainView);
	}, false);
};

ViewImageView.beforeDisplay = function() {
	this.coordinate.setContent(globaldata.history.curr().imagedata);
};


