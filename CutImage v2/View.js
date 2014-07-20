// View管理一个页面
//
// view属性，这是View所管理的页面，对应一个html元素，是本页面的最顶级元素
//
// receivedDatas属性，从上个页面传递过来的数据。
// 可能有多个数据，采用key-value对的形式。
var View = function() {
	this.view = null;
	this.receivedData = null;
};
// View的初始化，将由对象实现，一般用于为页面元素添加事件监听。
// 因此这个方法必须再页面元素加载完成之后才能执行。
// 而获取页面元素操作必须放到这个方法里去。
View.prototype.init = function() {};
// 抽象方法，在show方法运行时自动调用，用于修改页面。
View.prototype.beforeDisplay = function() {};
// View之间的跳转方法
// 从本view跳转到下一个view，并且传递数据data
View.prototype.gotoView = function(otherView, data) {
	otherView.setData(data);
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
// 设置传递给下一个页面的数据
//
// 一个页面接受到数据之后，如果这个数据有用，就会使用它更新自己的属性。
// 这一操作必须在进入下一个页面之前完成。
// 一旦进入下一个页面，接受的数据就认为已经使用过了并且没有必要在保存。
// 因此这里直接覆盖之前的data。
View.prototype.setData = function(data) {
	this.receivedData = data;
};
