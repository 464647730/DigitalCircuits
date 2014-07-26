function getDistance(x1, y1, x2, y2) {
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}
var CircleArea = function(centerX, centerY, radius) {
	this.centerX = centerX;
	this.centerY = centerY;
	this.radius = radius;
};
CircleArea.prototype.inArea = function(x, y) {
	if (getDistance(this.centerX, this.centerY, x, y) <= this.radius) {
		return true;
	} else {
		return false;
	}
};

/*
 * 如果Action是NOTHING，则界面不需要刷新
 * 如果Action是DRAG，则有可能刷新
 * 如果是其他，则界面需要刷新
 */
var Action = {
	NOTHING: 0, // 没有状态变化
	ENTER: 1, // 鼠标进入区域
	LEAVE: 2, // 鼠标在非DRAGGING状态下离开区域
	PICK: 3, // 鼠标在区域内，且按下按键
	DRAG: 4, // 发生在PICK之后，鼠标按键按下
	DROP: 5 // 发生在DRAG之后，鼠标按键释放
};

var ListeningArea = function(area) {
	this.area = area; // 监听区域
	this.lastState = ListeningArea.State.START; // 初始状态
};
ListeningArea.State = {
	START: 0, // 初始状态，仅仅在初始化时赋值。它的本质意义是，我们不知道此时的真实状态。
	INSIDE: 1, // 鼠标位于区域内部，并且鼠标按键没有按下
	OUTSIDE: 2, // 鼠标位于区域外，但是鼠标按键无法判断
	DRAGGING: 3 // 鼠标按键已经按下，但是是否在区域内无法判断
};
ListeningArea.prototype.detectActionAndUpdateState = function(x, y, keyPressed) {
	var inside = this.area.inArea(x, y);
	var action;
	switch (this.lastState) {
		case ListeningArea.State.START:
			if (inside === true) {
				if (keyPressed === true) {
					action = Action.PICK;
				} else {
					action = Action.ENTER;
				}
			} else {
				action = Action.NOTHING;
			}
			break;
		case ListeningArea.State.INSIDE:
			if (inside === true) {
				if (keyPressed === true) {
					action = Action.PICK;
				} else {
					action = Action.NOTHING;
				}
			} else {
				action = Action.LEAVE;
			}
			break;
		case ListeningArea.State.OUTSIDE:
			if (inside === true) {
				action = Action.ENTER;
			} else {
				action = Action.NOTHING;
			}
			break;
		case ListeningArea.State.DRAGGING:
			if (keyPressed === true) {
				action = Action.DRAG;
			} else {
				action = Action.DROP;
			}
			break;
		default:
	}
	this.updateState(inside, action);
	return action;
};
ListeningArea.prototype.updateState = function(isInside, action) {
	switch (action) {
		case Action.NOTHING:
			break;
		case Action.ENTER:
			this.lastState = ListeningArea.State.INSIDE;
			break;
		case Action.LEAVE:
			this.lastState = ListeningArea.State.OUTSIDE;
			break;
		case Action.PICK:
			this.lastState = ListeningArea.State.DRAGGING;
			break;
		case Action.DROP:
			if (isInside) {
				this.lastState = ListeningArea.State.INSIDE;
			} else {
				this.lastState = ListeningArea.State.OUTSIDE;
			}
			break;
		default:
	}
};
ListeningArea.prototype.updatePosition = function(x, y) {
	this.area.centerX = x;
	this.area.centerY = y;
};

var SetQuad = function(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
	this.quad = new Array(4);
	this.areaList = new Array(4);
	this.relativePosition = { dx: 0, dy: 0 };
	this.lastEvent = null;
	this.keyPressed = false;
	this.background = null;
};
SetQuad.MouseEventType = {
	KEYDOWN: 0,
	KEYUP: 1,
	MOVE: 2
};
SetQuad.prototype.init = function() {
	var that = this;
	this.canvas.addEventListener("mousemove", function(event) {
		that.eventHandler(event, SetQuad.MouseEventType.MOVE);
	}, false);
	this.canvas.addEventListener("mousedown", function(event) {
		that.eventHandler(event, SetQuad.MouseEventType.KEYDOWN);
	}, false);
	this.canvas.addEventListener("mouseup", function(event) {
		that.eventHandler(event, SetQuad.MouseEventType.KEYUP);
	}, false);
};
SetQuad.prototype.setData = function() {
	this.quad[0] = new Point(this.canvas.width * 0.25, this.canvas.height * 0.25);
	this.quad[1] = new Point(this.canvas.width * 0.75, this.canvas.height * 0.25);
	this.quad[2] = new Point(this.canvas.width * 0.75, this.canvas.height * 0.75);
	this.quad[3] = new Point(this.canvas.width * 0.25, this.canvas.height * 0.75);
	this.areaList[0] = new ListeningArea(new CircleArea(this.quad[0].x, this.quad[0].y, 10));
	this.areaList[1] = new ListeningArea(new CircleArea(this.quad[1].x, this.quad[1].y, 10));
	this.areaList[2] = new ListeningArea(new CircleArea(this.quad[2].x, this.quad[2].y, 10));
	this.areaList[3] = new ListeningArea(new CircleArea(this.quad[3].x, this.quad[3].y, 10));
};
SetQuad.prototype.eventHandler = function(event, mouseeventtype) {
	var x = event.pageX - getElementLeft(this.canvas);
	var y = event.pageY - getElementTop(this.canvas);
	if (mouseeventtype === SetQuad.MouseEventType.KEYDOWN) {
		this.keyPressed = true;
	} else if (mouseeventtype === SetQuad.MouseEventType.KEYUP) {
		this.keyPressed = false;
	}
	var action;
	var i;
	var len = this.areaList.length;
	for (i = 0; i < len; i++) {
		action = this.areaList[i].detectActionAndUpdateState(x, y, this.keyPressed);
		this.updateQuad(i, x, y, action);
	}
};
SetQuad.prototype.updateQuad = function(which, x, y, action) {
	if (action === Action.NOTHING) {
		return;
	} else if (action === Action.PICK) {
		this.relativePosition.dx = this.quad[which].x - x;
		this.relativePosition.dy = this.quad[which].y - y;
	} else if (action === Action.DRAG) {
		var nextX = this.relativePosition.dx + x;
		var nextY = this.relativePosition.dy + y;
		if (this.inLimit(which, nextX, nextY)) {
			this.quad[which].x = nextX;
			this.quad[which].y = nextY;
			this.areaList[which].updatePosition(this.quad[which].x, this.quad[which].y);
		} else {
			return;
		}
	}
	this.refresh();
};
SetQuad.prototype.refresh = function() {
	this.clearAll();
	this.drawQuad();
	var i;
	var len = this.areaList.length;
	for (i = 0; i < len; i++) {
		this.drawArea(this.areaList[i]);
	}
};
SetQuad.prototype.clearAll = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.putImageData(this.background.imagedata, 0, 0);
};
SetQuad.prototype.drawQuad = function() {
	this.context.beginPath();
	this.context.moveTo(this.quad[0].x, this.quad[0].y);
	this.context.lineTo(this.quad[1].x, this.quad[1].y);
	this.context.lineTo(this.quad[2].x, this.quad[2].y);
	this.context.lineTo(this.quad[3].x, this.quad[3].y);
	this.context.lineTo(this.quad[0].x, this.quad[0].y);
	this.context.lineWidth = 2.0;
	this.context.strokeStyle = "#0066cc";
	this.context.stroke();
};
SetQuad.prototype.drawArea = function(area) {
	this.context.beginPath();
	this.context.arc(area.area.centerX, area.area.centerY, area.area.radius, 0, Math.PI * 2, true);
	switch (area.lastState) {
		case ListeningArea.State.START:
		case ListeningArea.State.OUTSIDE:
			this.context.lineWidth = 1.0;
			this.context.strokeStyle = "green";
			this.context.stroke();
			break;
		case ListeningArea.State.INSIDE:
			this.context.lineWidth = 2.0;
			this.context.strokeStyle = "blue";
			this.context.stroke();
			break;
		case ListeningArea.State.DRAGGING:
			this.context.lineWidth = 4.0;
			this.context.strokeStyle = "blue";
			this.context.stroke();
			break;
		default:
	}
};
SetQuad.onLineLeft = function(A, B, C) {
	var result = (B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y);
	if (result < 0) {
		return true;
	} else {
		return false;
	}
};
SetQuad.prototype.inLimit = function(which, x, y) {
	var inLimit = this.inside(x, y) && this.farEnough(which, x, y);
	if (inLimit === false) {
		return false;
	}
	switch (which) {
		case 0:
			inLimit = this.leftTopInLimit(x, y);
			break;
		case 1:
			inLimit = this.rightTopInLimit(x, y);
			break;
		case 2:
			inLimit = this.rightBottomInLimit(x, y);
			break;
		case 3:
			inLimit = this.leftBottomInLimit(x, y);
			break;
		default:
	}
	return inLimit;
};
SetQuad.prototype.inside = function(x, y) {
	return (x >= 0 && x < this.canvas.width && y >= 0 && y < this.canvas.height);
};
SetQuad.prototype.farEnough = function(which, x, y) {
	var i, len = this.quad.length, radiusX2 = this.areaList[0].area.radius * 2;
	for (i = 0; i < len; i++) {
		if (i !== which) {
			if (getDistance(this.quad[i].x, this.quad[i].y, x, y) <= radiusX2) {
				return false;
			}
		}
	}
	return true;
};
SetQuad.prototype.leftTopInLimit = function(x, y) {
	var p = new Point(x, y);
	return (SetQuad.onLineLeft(this.quad[3], this.quad[2], p)
		&& SetQuad.onLineLeft(this.quad[2], this.quad[1], p)
		&& SetQuad.onLineLeft(this.quad[3], this.quad[1], p));
};
SetQuad.prototype.rightTopInLimit = function(x, y) {
	var p = new Point(x, y);
	return (SetQuad.onLineLeft(this.quad[0], this.quad[3], p)
		&& SetQuad.onLineLeft(this.quad[3], this.quad[2], p)
		&& SetQuad.onLineLeft(this.quad[0], this.quad[2], p));
};
SetQuad.prototype.rightBottomInLimit = function(x, y) {
	var p = new Point(x, y);
	return (SetQuad.onLineLeft(this.quad[1], this.quad[0], p)
		&& SetQuad.onLineLeft(this.quad[0], this.quad[3], p)
		&& SetQuad.onLineLeft(this.quad[1], this.quad[3], p));
};
SetQuad.prototype.leftBottomInLimit = function(x, y) {
	var p = new Point(x, y);
	return (SetQuad.onLineLeft(this.quad[2], this.quad[1], p)
		&& SetQuad.onLineLeft(this.quad[1], this.quad[0], p)
		&& SetQuad.onLineLeft(this.quad[2], this.quad[0], p));
};
SetQuad.prototype.getQuad = function() {
	return this.quad;
};
SetQuad.prototype.setBackground = function(myimagedata) {
	this.canvas.width = myimagedata.getWidth();
	this.canvas.height = myimagedata.getHeight();
	this.background = myimagedata;
	this.setData();
	this.refresh();
};

