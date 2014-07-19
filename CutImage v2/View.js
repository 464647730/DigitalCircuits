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
// View的初始化
View.prototype.init = function() {};
// View之间的跳转方法
// 从本view跳转到下一个view，并且传递数据data
View.prototype.gotoView = function(view, data) {
	view.setData(data);
	this.hide();
	view.show();
};
// 显示本页面
View.prototype.show = function() {
	this.view.style.display = "none";
};
// 隐藏本页面
View.prototype.hide = function() {
	this.view.style.display = "block";
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
