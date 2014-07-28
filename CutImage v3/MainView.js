var MainView = new View();

MainView.init = function() {
    this.view = document.getElementById("MainView");
    this.canvas =  document.getElementById("display_canvas");

    globaldata.history = new History();

    var that = this;
    document.getElementById("main_view_buttons").addEventListener("click", function(event) {
        switch (event.target.getAttribute("cmd")) {
            case "load_image":
                that.load_image();
                break;
            case "cut_image":
                if (!globaldata.history.isEmpty()) {
                    that.gotoView(CutImageView);
                }
                break;
            case "gray_image":
                if (!globaldata.history.isEmpty()) {
                    that.gray_image();
                }
                break;
            case "sharp_image":
                if (!globaldata.history.isEmpty()) {
                    that.gotoView(SharpImageView);
                }
                break;
            case "view_image":
                if (!globaldata.history.isEmpty()) {
                    that.gotoView(ViewImageView);
                }
                break;
            case "back":
                if (!globaldata.history.isEmpty()) {
                    that.back();
                }
                break;
            case "forward":
                if (!globaldata.history.isEmpty()) {
                    that.forward();
                }
                break;
            case "download":
                if (!globaldata.history.isEmpty()) {
                    that.download();
                }
                break;
            default:
        }
    }, false);
};
MainView.load_image_handler = function(target) {
    if (target.files.length <= 0) {
           return;
    }
    var fileReader = new FileReader();
    var that = this;
    fileReader.onload = function() {
        var image = new Image();
        image.onload = function () {
            var imagedata = new MyImageData();
            imagedata.setValueByImage(this);
            globaldata.history.add(imagedata);
            globaldata.history.curr().show(that.canvas);
        };
        image.src = this.result;
    };
    fileReader.readAsDataURL(target.files[0]);
};
MainView.load_image = function() {
    var fileinput = document.createElement("input");
    fileinput.setAttribute("type", "file");
    var that = this;
    fileinput.addEventListener("change", function(event) {
        that.load_image_handler(this);
    }, false);
    var click = document.createEvent("MouseEvent");
    click.initMouseEvent("click");
    fileinput.dispatchEvent(click);
};
MainView.gray_image = function() {
    var grayimage = GrayFilter.filter(globaldata.history.curr());
    if (grayimage !== null) {
        globaldata.history.add(grayimage);
        globaldata.history.curr().show(this.canvas);
    }
};
MainView.beforeDisplay = function() {
    if (!globaldata.history.isEmpty()) {
        globaldata.history.curr().show(this.canvas);
    }
};
MainView.download = function() {
    var a = document.createElement("a");
    a.href = globaldata.history.curr().toDataURL();
    var filename = "数字图像_" + new Date().toLocaleString() + ".png";
    a.setAttribute("download", filename);
    var click = document.createEvent("MouseEvent");
    click.initMouseEvent("click");
    a.dispatchEvent(click);
};
MainView.back = function() {
    globaldata.history.back();
    globaldata.history.curr().show(this.canvas);
};
MainView.forward = function() {
    globaldata.history.forward();
    globaldata.history.curr().show(this.canvas);
};
