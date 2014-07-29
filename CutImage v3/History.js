/*
 * 历史记录类
 * 记录用户得到的每一幅图片
 * 可以返回前面的记录，也也可追溯最新记录
 */

var History = function() {
	this.datas = [];
	this.currPos = -1;
};
// 添加新记录
History.prototype.add = function(item) {
	this.currPos++;
	if (this.currPos < this.datas.length) { // 在中间点添加新记录将导致原先该点之后的记录被删除
		this.datas.splice(this.currPos);
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

// 获取当前记录的引用
History.prototype.curr = function() {
	return this.datas[this.currPos];
};

// 判断是否记录为空
History.prototype.isEmpty = function() {
	return this.currPos < 0;
};
