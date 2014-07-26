var SharpImageView = new View();

SharpImageView.init = function() {
	this.view = document.getElementById("SharpImageView");
	this.scrollbar = new SelectBar();

	var paramsList = [1, 2, 3, 4, 5, 6, 7];
	var that = this;
	this.scrollbar.setItems(paramsList);
	this.scrollbar.setAction(function(i) {
		that.handleImage(i);
	});
	this.scrollbar.insertInto(document.getElementById("select_bar"));
};

SharpImageView.beforeDisplay = function() {
};

SharpImageView.handleImage = function(i) {
	;
}




