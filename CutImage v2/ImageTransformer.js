var ImageTransformer = {
	convertImageToMyImageData: function(image) {
		return this.convertCanvasImageDataToMyImageData(this.convertImageToCanvasImageData(image));
	},
	convertImageToCanvasImageData: function(image) {
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0);
		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	},
	convertCanvasImageDataToMyImageData: function(canvasImageData) {
		var myImageData = new MyImageData();
		myImageData.setSize(canvasImageData.width, canvasImageData.height);
		myImageData.data = new Uint8ClampedArray(canvasImageData.data);
		return myImageData;
	},
	convertMyImageDataToImage: function(myImageData) {
		var canvas = document.createElement("canvas");
		canvas.width = myImageData.getWidth();
		canvas.height = myImageData.getHeight();
		var ctx = canvas.getContext("2d");
		var canvasImageData = ctx.createImageData(myImageData.getWidth(), myImageData.getHeight());
		var length = myImageData.data.length;
		for (var i = 0; i < length; i++) {
			canvasImageData.data[i] = myImageData.data[i];
		}
		ctx.putImageData(canvasImageData, 0, 0);
		var image = new Image();
		image.src = canvas.toDataURL("image/png");
		return image;
	}
};
