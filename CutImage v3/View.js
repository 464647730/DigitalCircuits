/*
View类的工作：进行页面的获取、显示、隐藏、跳转，为页面元素添加事件监听。
*/

var View = function() {
	this.view = null; // view属性，这是View所管理的页面，对应一个html元素，是本页面的最顶级元素
};

/*
页面初始化，动作包括：
	1. 获取页面
	2. 声明本页面使用的一些变量
	3. 为页面元素添加事件监听
该方法必须有View实例改写，以适应各页面不同的需要。
*/
View.prototype.init = function() {};

/*
页面显示前处理
在每次跳转到本页面时执行
*/
View.prototype.beforeDisplay = function() {};

/*
View跳转方法，共本View跳转至另一个View。
*/
View.prototype.gotoView = function(otherView) {
	this.hide();
	otherView.show();
};

/*
显示View
*/
View.prototype.show = function() {
	this.beforeDisplay();
	this.view.style.display = "block";
};

/*
影藏View
*/
View.prototype.hide = function() {
	this.view.style.display = "none";
};

