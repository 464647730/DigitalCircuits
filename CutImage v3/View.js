// View管理一个页面
//
// view属性，这是View所管理的页面，对应一个html元素，是本页面的最顶级元素
var View = function() {
	this.view = null;
};
// View的初始化，将由对象实现，一般用于为页面元素添加事件监听。
// 因此这个方法必须再页面元素加载完成之后才能执行。
// 而获取页面元素操作必须放到这个方法里去。
View.prototype.init = function() {};
// 抽象方法，在show方法运行时自动调用，用于修改页面。
View.prototype.beforeDisplay = function() {};
// View之间的跳转方法
// 从本view跳转到下一个view，并且传递数据data
View.prototype.gotoView = function(otherView) {
	this.hide();
	otherView.show();
};
// 显示本页面
View.prototype.show = function() {
	this.beforeDisplay();
	this.view.style.display = "block";
};
// 隐藏本页面
View.prototype.hide = function() {
	this.view.style.display = "none";
};

