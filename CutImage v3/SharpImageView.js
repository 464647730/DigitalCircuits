var SharpImageView = new View();

SharpImageView.init = function() {
	this.view = document.getElementById("SharpImageView");
	this.canvas = document.getElementById("sharp_image_canvas");
	this.selectBar = new SelectBar();
	this.paramsList = ["未锐化", "锐化 1", "锐化 2", "锐化 3"];
	this.sharps = new Array(this.paramsList.length);
	this.curr = 0;

	var that = this;
	// 初始化选择栏
	this.selectBar.setItems(this.paramsList);
	this.selectBar.setAction(function(i) {
		that.handleImage(i);
	});
	this.selectBar.insertInto(document.getElementById("select_bar"));

	document.getElementById("do_sharp").addEventListener("click", function() {
		globaldata.history.add(that.sharps[that.curr]);
		that.gotoView(MainView);
	}, false);
	document.getElementById("sharp_image_quit").addEventListener("click", function() {
		that.gotoView(MainView);
	}, false);
};

SharpImageView.beforeDisplay = function() {
	// 清空this.sharps中的缓存数据
	this.sharps = new Array(this.paramsList.length);
	this.sharps[0] = globaldata.history.curr();
	this.curr = 0;
	// 重置选择栏
	this.selectBar.reset(this.curr);
	// 显示图像
	this.sharps[this.curr].show(this.canvas);
};

SharpImageView.handleImage = function(i) {
	// 如果已处理过，不必再次处理。
	if (this.sharps[i] !== undefined) {
		if (this.curr !== i) {
			this.curr = i;
			this.sharps[this.curr].show(this.canvas);
		}
		return;
	}
	var mask;
	switch (i) {
		case 1:
			mask = SharpFilter.Laplacian1;
			break;
		case 2:
			mask = SharpFilter.Laplacian2;
			break;
		case 3:
			mask = SharpFilter.Laplacian3;
			break;
		default:
			return;
	}
	this.sharps[i] = SharpFilter.filter(this.sharps[0], mask);
	this.curr = i;
	this.sharps[this.curr].show(this.canvas);
};




