function getElementLeft(element) {
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;
	while (current !== null) {
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	return actualLeft;
}
function getElementTop(element) {
	var actualTop = element.offsetTop;
	var current = element.offsetParent;
	while (current !== null) {
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}
	return actualTop;
}
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
		case ListeningArea.State.OUTSIDE:
			if (inside === true) {
				action = Action.ENTER;
			} else {
				action = Action.NOTHING;
			}
		case ListeningArea.State.DRAGGING:
			if (keyPressed === true) {
				action = Action.DRAG;
			} else {
				action = Action.DROP;
			}
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
			if (this.area.inArea(x, y)) {
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
	this.areaList = [];
	this.relativePosition = { dx: 0, dy: 0 };
	this.lastEvent = null;
};
SetQuad.prototype.init = function() {
	var quad = new Array(4);
	this.quad[0] = { x: this.canvas.width * 0.25, y: this.canvas.height * 0.25 };
	this.quad[1] = { x: this.canvas.width * 0.75, y: this.canvas.height * 0.25 };
	this.quad[2] = { x: this.canvas.width * 0.75, y: this.canvas.height * 0.75 };
	this.quad[3] = { x: this.canvas.width * 0.25, y: this.canvas.height * 0.75 };
	this.areaList.push(new ListeningArea(new CircleArea(this.quad[0].x, this.quad[0].y, 10)));
	this.areaList.push(new ListeningArea(new CircleArea(this.quad[1].x, this.quad[1].y, 10)));
	this.areaList.push(new ListeningArea(new CircleArea(this.quad[2].x, this.quad[2].y, 10)));
	this.areaList.push(new ListeningArea(new CircleArea(this.quad[3].x, this.quad[3].y, 10)));
	var that = this;
	this.canvas.addEventListener("mousemove", function(event) {
		that.eventHandler(event);
	}, false);
	this.canvas.addEventListener("mousedown", function(event) {
		that.eventHandler(event);
	}, false);
	this.canvas.addEventListener("mouseup", function(event) {
		that.eventHandler(event);
	}, false);
};
SetQuad.prototype.eventHandler = function(event) {
	var x = event.pageX - getElementLeft(this.canvas);
	var y = event.pageY - getElementTop(this.canvas);
	var keyPressed = (event.button === 1);
	var action;
	var i;
	var len = this.areaList.length;
	for (i = 0; i <=len; i++) {
		area = this.areaList[i];
		action = area.detectActionAndUpdateState(x, y, keyPressed);
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
	for (area in this.areaList) {
		this.drawArea(area);
	}
};
SetQuad.prototype.clearAll = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
	this.context.moveTo(area.area.centerX, area.area.centerY);
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
			this.context.fillStyle = "blue";
			this.context.fill();
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
	var inLimit;
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
	
}
SetQuad.prototype.leftTopInLimit = function(x, y) {
	if ()
}
SetQuad.prototype.
SetQuad.prototype.
SetQuad.prototype.
SetQuad.prototype = {
	start: function() {
		quad[0] = { x: this.canvas.width * 0.25, y: this.canvas.height * 0.25 };
		quad[1] = { x: this.canvas.width * 0.75, y: this.canvas.height * 0.25 };
		quad[2] = { x: this.canvas.width * 0.75, y: this.canvas.height * 0.75 };
		quad[3] = { x: this.canvas.width * 0.25, y: this.canvas.height * 0.75 };
		var leftTop = new CircleArea(quad[0].x, quad[0].y, 10);
		var rightTop = new CircleArea(quad[1].x, quad[1].y, 10);
		var rightBottom = new CircleArea(quad[2].x, quad[2].y, 10);
		var leftBottom = new CircleArea(quad[3].x, quad[3].y, 10);
		this.responseAreas = {
			"leftTop": new ResponseCircle(this, leftTop),
			"rightTop": new ResponseCircle(this, rightTop),
			"rightBottom": new ResponseCircle(this, rightBottom),
			"leftBottom": new ResponseCircle(this, leftBottom)
		};
		this.mouseActionsGenerator.init();
		this.refresh();
	},
	mouseActionTriggered: function(action) {
		if (action.type === "mousedrag") {
			this.onResponseAreaDragged(action);
		} else {
			this.responseAreas[action.target].mouseActionTriggered(action);
		}
	},
	onResponseAreaDragged: function(action) {
		if (this.inLimit(action)) {
			this.updateQuad(action);
			this.updateResponseAreas();
			this.refresh();
		}
	},
	inLimit: function(action) {
		var inLimit = null;
		switch (action.target) {
			case "leftTop":
				inLimit = this.leftTopInLimit(action.dx, action.dy); break;
			case "rightTop":
				inLimit = this.rightTopInLimit(action.dx, action.dy); break;
			case "rightBottom":
				inLimit = this.rightBottomInLimit(action.dx, action.dy); break;
			case "leftBottom":
				inLimit = this.leftBottomInLimit(action.dx, action.dy); break;
			default:
		}
		return inLimit;
	},
	leftTopInLimit: function(dx, dy) {
		var area = this.responseAreas["leftTop"].area;
		var E = {
			x: dx + area.centerX,
			y: dy + area.centerY
		};
		var ER = {
			x: dx + area.centerX + area.radius,
			y: dy + area.centerY + area.radius
		};
		var A = { x: 0, y: this.quad[3].y };
		var B = { x: this.quad[3].x, y: this.quad[3].y };
		var C = { x: this.quad[1].x, y: this.quad[1].y };
		var D = { x: this.quad[1].x, y:0 };
		if (E.x >= 0 && E.y >= 0 && onLineLeft(A, B, ER) && onLineLeft(B, C, ER) && onLineLeft(C, D, ER)) {
			return true;
		} else {
			return false;
		}
	},
	rightTopInLimit: function(dx, dy) {
		var area = this.responseAreas["rightTop"].area;
		var E = {
			x: dx + area.centerX,
			y: dy + area.centerY
		};
		var ER = {
			x: dx + area.centerX - area.radius,
			y: dy + area.centerY + area.radius
		};
		var A = { x: this.quad[0].x, y: 0 };
		var B = { x: this.quad[0].x, y: this.quad[0].y };
		var C = { x: this.quad[2].x, y: this.quad[2].y };
		var D = { x: this.canvas.width, y: this.quad[2].y };
		if (E.x <= this.canvas.width && E.y >= 0 && onLineLeft(A, B, ER) && onLineLeft(B, C, ER) && onLineLeft(C, D, ER)) {
			return true;
		} else {
			return false;
		}
	},
	rightBottomInLimit: function(dx, dy) {
		var area = this.responseAreas["rightBottom"].area;
		var E = {
			x: dx + area.centerX,
			y: dy + area.centerY
		};
		var ER = {
			x: dx + area.centerX - area.radius,
			y: dy + area.centerY - area.radius
		};
		var A = { x: this.canvas.width, y: this.quad[1].y };
		var B = { x: this.quad[1].x, y: this.quad[1].y };
		var C = { x: this.quad[3].x, y: this.quad[3].y };
		var D = { x: this.quad[3].x, y: this.canvas.height };
		if (E.x <= this.canvas.width && E.y <= this.canvas.height && onLineLeft(A, B, ER) && onLineLeft(B, C, ER) && onLineLeft(C, D, ER)) {
			return true;
		} else {
			return false;
		}
	},
	leftBottomInLimit: function(dx, dy) {
		var area = this.responseAreas["leftBottom"].area;
		var E = {
			x: dx + area.centerX,
			y: dy + area.centerY
		};
		var ER = {
			x: dx + area.centerX + area.radius,
			y: dy + area.centerY - area.radius
		};
		var A = { x: this.quad[2].x, y: this.canvas.height };
		var B = { x: this.quad[2].x, y: this.quad[2].y };
		var C = { x: this.quad[0].x, y: this.quad[0].y };
		var D = { x: 0, y: this.quad[0].y };
		if (E.x >= 0 && E.y <= this.canvas.height && onLineLeft(A, B, ER) && onLineLeft(B, C, ER) && onLineLeft(C, D, ER)) {
			return true;
		} else {
			return false;
		}
	},
	updateQuad: function(action) {
		switch (action.target) {
			case "leftTop":
				this.quad[0].x += action.dx; this.quad[0].y += action.dy; break;
			case "rightTop":
				this.quad[1].x += action.dx; this.quad[1].y += action.dy; break;
			case "rightBottom":
				this.quad[2].x += action.dx; this.quad[2].y += action.dy; break;
			case "leftBottom":
				this.quad[3].x += action.dx; this.quad[3].y += action.dy; break;
			default:
		}
	},
	updateResponseAreas: function() {
		this.responseAreas["leftTop"].moveTo(this.quad[0].x, this.quad[0].y);
		this.responseAreas["rightTop"].moveTo(this.quad[1].x, this.quad[1].y);
		this.responseAreas["rightBottom"].moveTo(this.quad[2].x, this.quad[2].y);
		this.responseAreas["leftBottom"].moveTo(this.quad[3].x, this.quad[3].y);
	},
	refresh: function() {
		this.drawQuad();
		for (var areaId in this.responseAreas) {
			this.responseAreas[areaId].refresh();
		}
	},
	drawQuad: function() {
		var ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.beginPath();
		ctx.moveTo(this.quad[0].x, this.quad[0].y);
		ctx.lineTo(this.quad[1].x, this.quad[1].y);
		ctx.lineTo(this.quad[2].x, this.quad[2].y);
		ctx.lineTo(this.quad[3].x, this.quad[3].y);
		ctx.lineTo(this.quad[0].x, this.quad[0].y);
		ctx.lineWidth = 2.0;
		ctx.strokeStyle = "#0066cc";
		ctx.stroke();
	},
	getQuad: function() {
		return this.quad;
	},
	setImage: function(image) {
		this.canvas.width = image.width;
		this.canvas.height = image.height;
		var url = "url(" + image.src + ")";
		this.canvas.style.backgroundImage = url;
	}
};

