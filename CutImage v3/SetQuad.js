/*
 * SetQuad类及其相关类
 */

/*
 * 计算两点距离
 */
function getDistance(x1, y1, x2, y2) {
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

/*
 * 圆形区域类
 * 指定一个圆形区域，判断一个点是否在该区域内
 */
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
 * Action枚举
 * 定义了6种自定义的用户动作
 * 动作将导致区域状态的变化
 * 一旦变化发生，就需要重画canvas，以产生动画效果
 */
var Action = {
	NOTHING: 0, // 没有有意义的动作发生
	ENTER: 1, // 鼠标进入区域
	LEAVE: 2, // 鼠标离开区域
	PICK: 3, // 鼠标在区域内按下按键
	DRAG: 4, // 鼠标拖动一个区域
	DROP: 5 // 鼠标按键释放，放下一个区域
};

var ListeningArea = function(area) {
	this.area = area; // 监听的区域
	this.lastState = ListeningArea.State.START; // 初始状态
};
/*
 * 定义区域的四种状态
 * 发生动作会改变状态
 * 状态改变后需要刷新canvas
 */
ListeningArea.State = {
	START: 0, // 初始状态，仅仅在初始化时赋值，之后再不可能进入此状态。
	INSIDE: 1, // 鼠标位于区域内部
	OUTSIDE: 2, // 鼠标位于区域外
	DRAGGING: 3 // 鼠标正在拖动该区域
};
/*
 * 输入当前鼠标的位置和按键状态
 * 与之前的状态对比，判断何种动作发生
 * 返回动作
 */
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
/*
 * 输入发生的动作，以及鼠标是否在区域内的判断
 * 更新区域状态
 */
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
/*
 * 更新区域位置
 */
ListeningArea.prototype.updatePosition = function(x, y) {
	this.area.centerX = x;
	this.area.centerY = y;
};

/*
 * SetQuad类
 * 输入一个canvas元素
 * 为该元素添加事件监听，根据浏览器事件信息判断是否自定义动作，并根据动作重画canvas，产生动画效果
 *
 * 重要组成部分：
 *     1. quad：四个顶点，确定了切割区域
 *     2. areaList：四个圆形区域，这是四个顶点的表示。用户可以拖动这四个圆来移动四个顶点
 *     3. background：背景，用于提供参考
 *
 * 在canvas中绘制出背景，然后绘制出四个圆，表示四个顶点，和一个由四个顶点确定的四边形，表示切割区域
 * 圆是可交互的，用户可以用鼠标拖动，以修改顶点的位置
 */
var SetQuad = function(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
	this.quad = new Array(4);
	this.areaList = new Array(4);
	this.relativePosition = { dx: 0, dy: 0 };
	this.lastEvent = null;
	this.keyPressed = false;
	this.background = null;

	this.init();
};
/*
 * 鼠标事件枚举
 */
SetQuad.MouseEventType = {
	KEYDOWN: 0,
	KEYUP: 1,
	MOVE: 2
};
SetQuad.prototype.init = function() {
	var that = this;
	// 监听鼠标事件
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

/*
 * 设置初始切割区域
 */
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

/*
 * 鼠标事件处理函数
 * 输入鼠标事件
 * 判定自定义动作
 * 根据动作更新数据和canvas
 */
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
/*
 * 更新切割区域
 */
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

/*
 * 刷新canvas
 */
SetQuad.prototype.refresh = function() {
	this.clearAll();
	this.drawQuad();
	var i;
	var len = this.areaList.length;
	for (i = 0; i < len; i++) {
		this.drawArea(this.areaList[i]);
	}
};

/*
 * 清空canvas，并绘制背景图
 */
SetQuad.prototype.clearAll = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.putImageData(this.background.imagedata, 0, 0);
};

/*
 * 绘制四边形
 */
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
/*
 * 绘制四个圆形区域
 */
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
/*
 * 输入三个点
 * 判断第三个点是否位于前两个点构成的线的左边
 */
SetQuad.onLineLeft = function(A, B, C) {
	var result = (B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y);
	if (result < 0) {
		return true;
	} else {
		return false;
	}
};
/*
 * 输入点的左边和左右上下边界
 * 判断该点是否在边界内部
 */
SetQuad.inside = function(x, y, left, right, top, bottom) {
	return x >= left && x < right && y >= top && y < bottom;
};
/*
 * 切割区域只能是凸四边形，而且区域顶点不能位于图像外。因此，每个顶点的位置不能随意拖动，而必须在一个限制区域内部
 * 输入顶点标号和顶点被拖动到的位置，判断这个位置是否是合理的
 */
SetQuad.prototype.inLimit = function(which, x, y) {
	var inLimit = this.farEnough(which, x, y);
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
/*
 * 两个圆形区域不能交叉，因此需要判断下一个位置是否离其他区域足够远
 */
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
/*
 * 分别判断四个顶点是否越界
 */
SetQuad.prototype.leftTopInLimit = function(x, y) {
	var p = new Point(x, y);
	if (SetQuad.inside(x, y, 0, this.quad[1].x, 0, this.quad[3].y) === false) {
		return false;
	}
	return (SetQuad.onLineLeft(this.quad[3], this.quad[2], p)
		&& SetQuad.onLineLeft(this.quad[2], this.quad[1], p)
		&& SetQuad.onLineLeft(this.quad[3], this.quad[1], p));
};
SetQuad.prototype.rightTopInLimit = function(x, y) {
	var p = new Point(x, y);
	if (SetQuad.inside(x, y, this.quad[0].x, this.canvas.width, 0, this.quad[2].y) === false) {
		return false;
	}
	return (SetQuad.onLineLeft(this.quad[0], this.quad[3], p)
		&& SetQuad.onLineLeft(this.quad[3], this.quad[2], p)
		&& SetQuad.onLineLeft(this.quad[0], this.quad[2], p));
};
SetQuad.prototype.rightBottomInLimit = function(x, y) {
	var p = new Point(x, y);
	if (SetQuad.inside(x, y, this.quad[3].x, this.canvas.width, this.quad[1].y, this.canvas.height) === false) {
		return false;
	}
	return (SetQuad.onLineLeft(this.quad[1], this.quad[0], p)
		&& SetQuad.onLineLeft(this.quad[0], this.quad[3], p)
		&& SetQuad.onLineLeft(this.quad[1], this.quad[3], p));
};
SetQuad.prototype.leftBottomInLimit = function(x, y) {
	var p = new Point(x, y);
	if (SetQuad.inside(x, y, 0, this.quad[2].x, this.quad[1].y, this.canvas.height) === false) {
		return false;
	}
	return (SetQuad.onLineLeft(this.quad[2], this.quad[1], p)
		&& SetQuad.onLineLeft(this.quad[1], this.quad[0], p)
		&& SetQuad.onLineLeft(this.quad[2], this.quad[0], p));
};
/*
 * 获取最终确定的切割区域
 */
SetQuad.prototype.getQuad = function() {
	return this.quad;
};
/*
 * 设置背景内容
 */
SetQuad.prototype.setBackground = function(myimagedata) {
	this.canvas.width = myimagedata.getWidth();
	this.canvas.height = myimagedata.getHeight();
	this.background = myimagedata;
	this.setData();
	this.refresh();
};

