/*
 * 图像卷积
 * 输入一副图像和一个算子
 * 将图像与算子进行卷积运算
 * 返回结果图像
 */
var ImageDataFilter = {};

// 3x3卷积运算模板。由于只用到了3x3卷积，这里就不考取其他尺寸的卷积了。
ImageDataFilter.template3 = function(myimagedata, mask) {
	var isGray = myimagedata.isGray;
	var width = myimagedata.getWidth();
	var height = myimagedata.getHeight();
	var data = myimagedata.imagedata.data;
	// 卷积运算必须新建图像，不能在原图像中操作
	var result = new MyImageData(new Size(width, height));
	result.isGray = myimagedata.isGray; // 如果原图是灰度图，结果图像也是灰度图
	var resultdata = result.imagedata.data;
	var i, j, box, center, pixel;
	// 每个位置距离中心的偏移。这里预先计算，以减轻循环中的计算量
	var offset = [-4 * width - 4, -4 * width, -4 * width + 4, -4, 0, 4, 4 * width - 4, 4 * width, 4 * width + 4];
	for (i = 0; i < width; i++) {
		for (j = 0; j < height; j++) {
			center = (j * width + i) * 4;
			// 边缘的像素点不必处理，这里采取直接复制的策略
			if (i === 0 || i === width - 1 || j === 0 || j === height - 1) {
				resultdata[center] = data[center];
				resultdata[center + 1] = data[center + 1];
				resultdata[center + 2] = data[center + 2];
				resultdata[center + 3] = data[center + 3];
			}
			/*
			 * myimagedata的像素数据放在一维数组中，每一个表示1像素，分别为red，green，blue，alpha分量
			 * 因此获取像素变得麻烦
			 * 对于灰度图，只需要计算一次，对于彩色图计算三次
			 */
			box = [data[center + offset[0]], data[center + offset[1]], data[center + offset[2]],
				   data[center + offset[3]], data[center + offset[4]], data[center + offset[5]],
				   data[center + offset[6]], data[center + offset[7]], data[center + offset[8]]]
			pixel = this.convolution(box, mask, 9);
			/*
			 * 这里得到的pixel是一个浮点数
			 * pixel必须为0~255之间的整数
			 * 但是由于imagedata.data采取Uint8ClampedArray格式数组，可以自动转化为0~255的整数，我们就可以直接赋值。
			 *
			 */
			resultdata[center] = pixel;
			if (isGray) {
				// 如果是灰度图，则三个通道的值是一样的
				resultdata[center + 1] = pixel;
				resultdata[center + 2] = pixel;
				// 设置与原图相同的alpha
				resultdata[center + 3] = data[center + 3];
			} else {
				// 计算green层
				center++;
				box = [data[center + offset[0]], data[center + offset[1]], data[center + offset[2]],
					   data[center + offset[3]], data[center + offset[4]], data[center + offset[5]],
					   data[center + offset[6]], data[center + offset[7]], data[center + offset[8]]]
				pixel = this.convolution(box, mask, 9);
				resultdata[center] = pixel;
				// 计算blue层
				center++;
				box = [data[center + offset[0]], data[center + offset[1]], data[center + offset[2]],
					   data[center + offset[3]], data[center + offset[4]], data[center + offset[5]],
					   data[center + offset[6]], data[center + offset[7]], data[center + offset[8]]]
				pixel = this.convolution(box, mask, 9);
				resultdata[center] = pixel;
				// alpha不必计算
				center++;
				resultdata[center] = data[center];
			}
		}
	}
	return result;
};

// 卷积运算
ImageDataFilter.convolution = function(box, mask, len) {
	var i, result = 0;
	for (i = 0; i < len; i++) {
		result += box[i] * mask[len - i - 1];
	}
	return result;
};

