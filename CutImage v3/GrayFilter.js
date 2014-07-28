var GrayFilter = {};
GrayFilter.filter = function(myImageData) {
	if (myImageData.isGray) {
		return null;
	}
	var result = new MyImageData(new Size(myImageData.getWidth(), myImageData.getHeight()));
	var data = myImageData.imagedata.data;
	var resultdata = result.imagedata.data;
	var len = myImageData.imagedata.data.length;
	var i, gray;
	for (i = 0; i < len; i += 4) {
		gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
		resultdata[i] = gray;
		resultdata[i + 1] = gray;
		resultdata[i + 2] = gray;
		resultdata[i + 3] = data[i + 3];
	}
	result.isGray = true;
	return result;
};
