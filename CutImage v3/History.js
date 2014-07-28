var History = function() {
	this.datas = [];
	this.currPos = -1;
};

History.prototype.add = function(item) {
	this.currPos++;
	if (this.currPos < this.datas.length) {
		this.splice(this.currPos);
	}
	this.datas.push(item);
};

History.prototype.back = function() {
	if (this.currPos > 0) {
		this.currPos--;
	}
};

History.prototype.forward = function() {
	if (this.currPos < this.datas.length - 1) {
		this.currPos++;
	}
};

History.prototype.curr = function() {
	return this.datas[this.currPos];
};

History.prototype.isEmpty = function() {
	return this.currPos < 0;
};
