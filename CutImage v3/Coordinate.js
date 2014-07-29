/*
 * 坐标绘制类
 * 接受canvas，在该canvas中绘制坐标轴和方格
 * 添加事件监听，使用户你可以拖动坐标系
 * content：坐标系展示的内容
 */

var Coordinate = function(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
	this.content = null;
	this.borderWidth = 60;
	this.width = 0;
	this.height = 0;
	this.gridWidth = 40;
	this.gridHeight = 40;
	this.gridOn = true;
	this.origin = { x: 0, y: 0 }
	this.dragging = false;
	this.relative = { dx: 0, dy: 0 };

	this.init();
};

// 初始化，添加事件监听
Coordinate.prototype.init = function() {
	var that = this;
	this.canvas.addEventListener("mousedown", function(event) {
		that.dragging = true;
		var x = event.pageX - getElementLeft(that.canvas);
		var y = event.pageY - getElementTop(that.canvas);
		that.relative.dx = that.origin.x - x;
		that.relative.dy = that.origin.y - y;
	}, false);
	this.canvas.addEventListener("mousemove", function() {
		if (that.dragging) {
			var x = event.pageX - getElementLeft(that.canvas);
			var y = event.pageY - getElementTop(that.canvas);
			that.origin.x = that.relative.dx + x;
			that.origin.y = that.relative.dy + y;
			that.refresh();
		}
	}, false);
	this.canvas.addEventListener("mouseup", function() {
		that.dragging = false;
	}, false);
};

// 设置展示内容
Coordinate.prototype.setContent = function(content) {
	// content是一个ImageData实例，是需要展示的内容
	this.content = content;
	this.width = this.content.width + 2 * this.borderWidth;
	this.height = this.content.height + 2 * this.borderWidth;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.origin.x = this.borderWidth;
	this.origin.y = this.height - this.borderWidth;

	this.refresh();
};

// 刷新canvas
Coordinate.prototype.refresh = function() {
	this.clear();
	this.drawContent();
	this.drawgGrids();
	this.drawAxis();
};

// 清空canvas
Coordinate.prototype.clear = function() {
	this.context.clearRect(0, 0, this.width, this.height);
};

// 绘制展示内容
Coordinate.prototype.drawContent = function() {
	this.context.putImageData(this.content, this.borderWidth, this.borderWidth);
}

// 绘制横纵坐标轴
Coordinate.prototype.drawAxis = function() {
	this.context.beginPath();
	// draw x axis
	this.context.moveTo(0, this.origin.y);
	this.context.lineTo(this.width, this.origin.y);
	this.context.lineTo(this.width - 20, this.origin.y - 20);
	this.context.moveTo(this.width, this.origin.y);
	this.context.lineTo(this.width - 20, this.origin.y + 20);
	// draw y axis
	this.context.moveTo(this.origin.x, this.height);
	this.context.lineTo(this.origin.x, 0);
	this.context.lineTo(this.origin.x - 20, 20);
	this.context.moveTo(this.origin.x, 0);
	this.context.lineTo(this.origin.x + 20, 20);
	// 显示图形
	this.context.lineWidth = 2.0;
	this.context.strokeStyle = "blue";
	this.context.stroke();
};

// 绘制方格
Coordinate.prototype.drawgGrids = function() {
	this.context.beginPath();
	var i, num;
	// 画横线
	num = Math.floor(this.origin.y / this.gridHeight) - 1;
	var y = this.origin.y;
	for (i = 0; i < num; i++) {
		y -= this.gridHeight;
		this.context.moveTo(0, y);
		this.context.lineTo(this.width, y);
	}
	num = Math.floor((this.height - this.origin.y) / this.gridHeight) - 1;
	y = this.origin.y;
	for (i = 0; i < num; i++) {
		y += this.gridHeight;
		this.context.moveTo(0, y);
		this.context.lineTo(this.width, y);
	}
	// 画竖线
	num = Math.floor(this.origin.x / this.gridWidth) - 1;
	var x = this.origin.x;
	for (i = 0; i < num; i++) {
		x -= this.gridHeight;
		this.context.moveTo(x, this.height);
		this.context.lineTo(x, 0);
	}
	num = Math.floor((this.width - this.origin.x) / this.gridWidth) - 1;
	x = this.origin.x;
	for (i = 0; i < num; i++) {
		x += this.gridHeight;
		this.context.moveTo(x, this.height);
		this.context.lineTo(x, 0);
	}

	this.context.lineWidth = 1.0;
	this.context.strokeStyle = "red";
	this.context.stroke();
};


