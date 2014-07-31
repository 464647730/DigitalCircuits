var QRCodeDrawer = {
	options: {
		sideLength: 8,
		typeNumber: -1,
		correctLevel: QRErrorCorrectLevel.L,
		background: "#ffffff",
		foreground: "#000000",
	},
	drawContent: function(canvas, content) {
		var qrcode = new QRCode(this.options.typeNumber, this.options.correctLevel);
		this.generateUrl();
		qrcode.addData(drawContent);
		qrcode.make();
		
		var num = qrcode.getModuleCount();
		var side = this.options.sideLength;
		canvas.width = side * num;
		canvas.height = canvas.width;
		var context = canvas.getContext("2d");
		
		var row, col;
		for (row = 0; row < num; row++) {
			for (col = 0; col < num; col++) {
				context.fillStyle = qrcode.isDark(row, col) ? this.options.foreground : this.options.background;
				context.fillRect(col * side, row * side, side, side);
			}
		}
	}
};
