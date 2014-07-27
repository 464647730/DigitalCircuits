var SelectBar = function() {
	this.container = null;
	this.itemBars = null;
	this.curr = 0;
	this.barWidth = 60;
	this.barHeight = 30;
	this.onSelectChange = null;
};

SelectBar.prototype.setItems = function(items) {
	this.setElements(items);
	this.setStyle();
};

SelectBar.prototype.setElements = function(items) {
	this.container = document.createElement("div");
	this.itemBars = [];
	var i, len = items.length, bar;
	for (i = 0; i < len; i++) {
		bar = document.createElement("div");
		bar.setAttribute("no", i);
		bar.innerHTML = items[i];
		this.itemBars.push(bar);
		this.container.appendChild(bar);
	}
};

SelectBar.prototype.setStyle = function() {
	var i, len = this.itemBars.length, bar;
	for (i = 0; i < len; i++) {
		bar = this.itemBars[i];
		bar.style.width = this.barWidth + "px";
		bar.style.height = this.barHeight + "px";
		bar.style.float = "left";
		bar.style.textAlign = "center";
		bar.style.lineHeight = this.barHeight + "px";
	}
	this.curr = 0;
	this.itemBars[this.curr].style.backgroundColor = "blue";
	this.container.style.width = len * this.barWidth + "px";
	this.container.style.height = this.barHeight + "px";
};

SelectBar.prototype.setAction = function(handler) {
	this.onSelectChange = handler;
	var that = this;
	this.container.addEventListener("click", function(event) {
		var no = event.target.getAttribute("no");
		if (no !== null) {
			that.itemBars[that.curr].style.backgroundColor = "";
			that.curr = no;
			that.itemBars[that.curr].style.backgroundColor = "blue";
			that.onSelectChange(Number.parseInt(no));
		}
	}, false);
};

SelectBar.prototype.insertInto = function(elem) {
	elem.appendChild(this.container);
};

SelectBar.prototype.reset = function(i) {
	this.itemBars[this.curr].style.backgroundColor = "";
	this.curr = i;
	this.itemBars[this.curr].style.backgroundColor = "blue";
	this.onSelectChange(i);
};




