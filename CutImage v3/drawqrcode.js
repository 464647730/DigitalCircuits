options = {
	sideLength: 8,
	typeNumber: -1,
	correctLevel: QRErrorCorrectLevel.L,
	background: "#ffffff",
	foreground: "#000000",
	text: "http://jiyu1234.duapp.com"
};

var drawqrcode = function(canvas, options) {
	var qrcode = new QRCode(options.typeNumber, options.correctLevel);
	qrcode.addData(options.text);
	qrcode.make();
	
	var num = qrcode.getModuleCount();
	var side = options.sideLength;
	canvas.width = side * num;
	canvas.height = canvas.width;
	var context = canvas.getContext("2d");
	
	var row, col;
	for (row = 0; row < num; row++) {
		for (col = 0; col < num; col++) {
			context.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
			context.fillRect(col * side, row * side, side, side);
		}
	}
};


