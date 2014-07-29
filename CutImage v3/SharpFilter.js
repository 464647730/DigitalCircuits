/*
 * 锐化图像
 * 提供三种锐化算子供用户选择
 */
var SharpFilter = {};
SharpFilter.filter = function(myImageData, mask) {
	return ImageDataFilter.template3(myImageData, mask);
};

// 预定义mask，三种拉普拉斯算子
SharpFilter.Laplacian1 = [1, -2, 1, -2, 5, -2, 1, -2, 1];
SharpFilter.Laplacian2 = [0, -1, 0, -1, 5, -1, 0, -1, 0];
SharpFilter.Laplacian3 = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
