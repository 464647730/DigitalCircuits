var ScrollBar = function() {
	this.position = 0;
	this.dragging = false;
	this.onScrollChange = function() {};

	this.init();
};

ScrollBar.prototype.init = function() {
	this.container = document.createElement("div");
	this.container.style.width = "108px";
	this.container.style.height = "20px";
	this.container.style.backgroundColor = "#F0F0F0";
	this.bar = document.createElement("div");
	this.bar.style.width = "6px";
	this.bar.style.height = "18px";
	this.bar.style.border = "1px solid #A0A0A0";
	this.bar.style.backgroundColor = "#D0D0D0";
	this.bar.style.marginLeft = this.position + "px";
	this.container.appendChild(this.bar);

	var that = this;
	this.container.addEventListener("mousedown", function(event) {
		var x = event.pageX - getElementLeft(that.container);
		that.position = x - 4;
		if (that.position < 0) {
			that.position = 0;
		} else if (that.position > 99) {
			that.position = 99;
		}
		that.bar.style.marginLeft = that.position + "px";
		that.dragging = true;
	}, false);
	this.container.addEventListener("mousemove", function(event) {
		if (that.dragging) {
			var x = event.pageX - getElementLeft(that.container);
			that.position = x - 4;
			if (that.position < 0) {
				that.position = 0;
			} else if (that.position > 99) {
				that.position = 99;
			}
			that.bar.style.marginLeft = that.position + "px";
		}
	}, false);
	this.container.addEventListener("mouseup", function(event) {
		that.dragging = false;
		that.onScrollChange();
	}, false);
};

ScrollBar.prototype.getElement = function() {
	return this.container;
};

ScrollBar.prototype.setOnScrollChange = function(handler) {
	this.onScrollChange = handler;
};
