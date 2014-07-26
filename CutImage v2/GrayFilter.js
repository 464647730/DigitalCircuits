var GrayFilter = {};
GrayFilter.filter = function(myImageData) {
	var data = myImageData.imagedata.data;
	var len = myImageData.imagedata.data.length;
	var i, gray;
	for (i = 0; i < len; i += 4) {
		gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
		gray = Math.round(gray);
		if (gray < 0) {
			gray = 0;
		} else if (gray > 255) {
			gray = 255;
		}
		data[i] = gray;
		data[i + 1] = gray;
		data[i + 2] = gray;
	}
};
