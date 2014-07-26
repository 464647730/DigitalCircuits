var MainView = new View();

MainView.init = function() {
    this.view = document.getElementById("MainView");
    this.canvas = this.view.getElementsByTagName("canvas")[0];

    var that = this;
    document.getElementById("main_view_buttons").addEventListener("click", function(event) {
        switch (event.target.getAttribute("cmd")) {
            case "load_image":
                that.load_image();
                break;
            case "cut_image":
                that.gotoView(CutImageView);
                break;
            case "gray_image":
                that.gray_image();
                break;
            case "sharp_image":
                that.gotoView(SharpImageView);
                break;
            case "view_image":
                // that.gotoView(ViewImageView);
                break;
            case "download":
                // that.download();
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
            globaldata.imagedata = new MyImageData();
            globaldata.imagedata.setValueByImage(this);
            globaldata.imagedata.show(that.canvas);
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
    if ("imagedata" in globaldata) {
        GrayFilter.filter(globaldata.imagedata);
        globaldata.imagedata.show(this.canvas);
    }
};
MainView.beforeDisplay = function() {
    if ("imagedata" in globaldata) {
        console.log(globaldata.imagedata.id);
        globaldata.imagedata.show(this.canvas);
    }
};
