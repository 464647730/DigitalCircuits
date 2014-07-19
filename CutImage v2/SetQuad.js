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
function getElementPosition(element) {
	return {
		x: getElementLeft(element),
		y: getElementTop(element)
	};
}
function getDistance(x1, y1, x2, y2) {
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}
var CircleArea = function(centerX, centerY, radius) {
	this.centerX = centerX;
	this.centerY = centerY;
	this.radius = radius;
};
CircleArea.prototype = {
	inArea: function(x, y) {
		if (getDistance(this.centerX, this.centerY, x, y) <= this.radius) {
			return true;
		} else {
			return false;
		}
	}
};

var MouseState = function(x, y, pressed) {
	this.x = x;
	this.y = y;
	this.pressed = pressed;
};
MouseState.prototype.setValue = function(other) {
	this.x = other.x;
	this.y = other.y;
	this.pressed = other.pressed;
};
var MouseAction = function(target, type) {
	this.target = target;
	this.type = type;
	this.dx = null;
	this.dy = null;
};
var MouseActionsGenerator = function(elem, responser) {
	this.elem = elem;
	this.responser = responser;
	this.elemPosition = getElementPosition(elem);
	this.previousMouseState = new MouseState(this.elemPosition.x, this.elemPosition.y, false);
	this.currentMouseState = new MouseState(this.elemPosition.x, this.elemPosition.y, false);
	this.action = new MouseAction();
};
MouseActionsGenerator.prototype = {
	init: function() {
		var mouseActionsGenerator = this;
		this.elem.addEventListener("mousemove", function(event) {
			mouseActionsGenerator.previousMouseState.setValue(mouseActionsGenerator.currentMouseState);
			mouseActionsGenerator.currentMouseState.x = event.pageX - mouseActionsGenerator.elemPosition.x;
			mouseActionsGenerator.currentMouseState.y = event.pageY - mouseActionsGenerator.elemPosition.y;
			mouseActionsGenerator.dataUpdated();
		}, false);
		this.elem.addEventListener("mousedown", function(event) {
			mouseActionsGenerator.previousMouseState.setValue(mouseActionsGenerator.currentMouseState);
			mouseActionsGenerator.currentMouseState.pressed = true;
			mouseActionsGenerator.dataUpdated();
		}, false);
		this.elem.addEventListener("mouseup", function(event) {
			mouseActionsGenerator.previousMouseState.setValue(mouseActionsGenerator.currentMouseState);
			mouseActionsGenerator.currentMouseState.pressed = false;
			mouseActionsGenerator.dataUpdated();
		}, false);
	},
	dataUpdated: function() {
		this.elemPosition = getElementPosition(this.elem);
		this.detectAction();
		if (this.action.target !== null) {
			this.responser.mouseActionTriggered(this.action);
		}
	},
	detectAction: function() {
		var area;
		var previous = { inArea: null, pressed: this.previousMouseState.pressed }, current = { inArea: null, pressed: this.currentMouseState.pressed };
		for (var id in this.responser.responseAreas) {
			area = this.responser.responseAreas[id].area;
			previous.inArea = area.inArea(this.previousMouseState.x, this.previousMouseState.y);
			current.inArea = area.inArea(this.currentMouseState.x, this.currentMouseState.y);
			if (previous.inArea === false) {
				if (current.inArea === true) {
					this.action.target = id;
					this.action.type = "mouseenter";
					return;
				}
			} else {
				if (current.inArea === false) {
					this.action.target = id;
					this.action.type = "mouseleave";
					return;
				} else {
					if (previous.pressed === false && current.pressed === true) {
						this.action.target = id;
						this.action.type = "mousepress";
						return;
					}
					if (previous.pressed === true && current.pressed === false) {
						this.action.target = id;
						this.action.type = "mouserelease";
						return;
					}
					if (previous.pressed === true && current.pressed === true) {
						this.action.target = id;
						this.action.type = "mousedrag";
						this.action.dx = this.currentMouseState.x - this.previousMouseState.x;
						this.action.dy = this.currentMouseState.y - this.previousMouseState.y;
						return;
					}
				}
			}
		}
		this.action.target = null;
	}
};

var ResponseCircle = function(container, area) {
	this.container = container;
	this.area = area;
	this.mouseState = "mouseout";
};
ResponseCircle.prototype = {
	mouseActionTriggered: function(action) {
		switch (action.type) {
			case "mouseenter": this.onMouseEnter(); break;
			case "mouseleave": this.onMouseLeave(); break;
			case "mousepress": this.onMousePress(); break;
			case "mouserelease": this.onMouseRelease(); break;
			default:
		}
	},
	moveTo: function(x, y) {
		this.area.centerX = x;
		this.area.centerY = y;
	},
	refresh: function() {
		switch (this.mouseState) {
			case "mousein":
				this.drawOnCircle(); break;
			case "mouseout":
				this.drawOffCircle(); break;
			case "mousepress":
				this.drawDragCircle(); break;
			default:
		}
	},
	drawOnCircle: function() {
		var ctx = this.container.canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(this.area.centerX, this.area.centerY, this.area.radius, 0, Math.PI * 2, true);
		ctx.lineWidth = 2.0;
		ctx.strokeStyle = "#0099cc";
		ctx.stroke();
	},
	drawOffCircle: function() {
		var ctx = this.container.canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(this.area.centerX, this.area.centerY, this.area.radius, 0, Math.PI * 2, true);
		ctx.lineWidth = 2.0;
		ctx.strokeStyle = "#ffffff";
		ctx.stroke();
	},
	drawDragCircle: function() {
		var ctx = this.container.canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(this.area.centerX, this.area.centerY, this.area.radius, 0, Math.PI * 2, true);
		ctx.lineWidth = 2.0;
		ctx.strokeStyle = "#ffff00";
		ctx.stroke();
	},
	onMouseEnter: function() {
		this.mouseState = "mousein";
		this.drawOnCircle();
	},
	onMouseLeave: function() {
		this.mouseState = "mouseout";
		this.drawOffCircle();
	},
	onMousePress: function() {
		this.mouseState = "mousepress";
		this.drawDragCircle();
	},
	onMouseRelease: function() {
		this.mouseState = "mousein";
		this.drawOnCircle();
	}
};
var SetQuad = function(canvas) {
	this.canvas = canvas;
	this.mouseActionsGenerator = new MouseActionsGenerator(canvas, this);
	this.quad = new Array(4);
	this.responseAreas = {};
};
SetQuad.prototype = {
	start: function() {
		this.quad[0] = { x: this.canvas.width * 0.25, y: this.canvas.height * 0.25 };
		this.quad[1] = { x: this.canvas.width * 0.75, y: this.canvas.height * 0.25 };
		this.quad[2] = { x: this.canvas.width * 0.75, y: this.canvas.height * 0.75 };
		this.quad[3] = { x: this.canvas.width * 0.25, y: this.canvas.height * 0.75 };
		var leftTop = new CircleArea(this.quad[0].x, this.quad[0].y, 10);
		var rightTop = new CircleArea(this.quad[1].x, this.quad[1].y, 10);
		var rightBottom = new CircleArea(this.quad[2].x, this.quad[2].y, 10);
		var leftBottom = new CircleArea(this.quad[3].x, this.quad[3].y, 10);
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
	getQuadData: function() {
		return this.quad;
	},
	setImage: function(image) {
		this.canvas.width = image.width;
		this.canvas.height = image.height;
		var url = "url(" + image.src + ")";
		this.canvas.style.backgroundImage = url;
	}
};
var onLineLeft = function(A, B, C) {
	var result = (B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y);
	if (result < 0) {
		return true;
	} else {
		return false;
	}
};
