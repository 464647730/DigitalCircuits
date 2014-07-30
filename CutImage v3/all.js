/*
 * 定义全局量globaldata
 * 定义一些多处使用的函数
 * 定义所有页面公用的事件监听
 */
var globaldata = {};

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
function clearElemChildren(element) {
	var nodes = element.childNodes;
	for (node in nodes) {
		element.removeChild(node);
	}
}
