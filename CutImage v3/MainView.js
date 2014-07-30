/*
应用主页面，由当前图像和一系列按钮组成。
当前图像显示的是当前待编辑的图像。应用开始是并不存在，必须由用户打开。
每个按钮对应一种操作
*/

var MainView = new View();

MainView.init = function() {
    this.view = document.getElementById("MainView"); // 获取页面
    this.canvas =  document.getElementById("display_canvas"); // 显示当前图像的容器

    // MainView是第一个启动的页面，因此可以再这里初始化一些全局变量
    globaldata.mailer = new Mailer(); // 用于发送邮件
    globaldata.history = new History(); // 用于记录操作历史

    var that = this;
    // 为按钮添加点击事件
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
            case "send_email":
                if (!globaldata.history.isEmpty()) {
                    that.send_email();
                }
                break;
            default:
        }
    }, false);
};

/*
加载图片回调函数
这是读取本地文件时的回调函数，将图片读进全局变量中
*/
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
            that.canvas.style.marginTop = (document.body.clientHeight * 0.9 - that.canvas.height) / 2 + "px";
        };
        image.src = this.result;
    };
    fileReader.readAsDataURL(target.files[0]);
};
/*
打开本地图片
采取模拟点击input元素的方式
*/
MainView.load_image = function() {
    var fileinput = document.createElement("input");
    fileinput.setAttribute("type", "file");
    var that = this;
    fileinput.addEventListener("change", function(event) {
        that.load_image_handler(this);
    }, false);
    var click = document.createEvent("MouseEvent");
    click.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    fileinput.dispatchEvent(click);
};

/*
将当前图片变成灰度图
*/
MainView.gray_image = function() {
    var grayimage = GrayFilter.filter(globaldata.history.curr());
    if (grayimage !== null) {
        globaldata.history.add(grayimage);
        globaldata.history.curr().show(this.canvas);
    }
};

/*
每次从其他页面处理完成返回主页面时，重新加载最新的图片用于展示。
*/
MainView.beforeDisplay = function() {
    if (!globaldata.history.isEmpty()) {
        globaldata.history.curr().show(this.canvas);
    }
    this.canvas.style.marginTop = (document.body.clientHeight * 0.9 - this.canvas.height) / 2 + "px";
};

/*
下载图片
*/
MainView.download = function() {
    var a = document.createElement("a");
    a.href = globaldata.history.curr().toDataURL();
    var filename = "数字图像_" + new Date().toLocaleString() + ".png"; // 下载图片文件名
    a.setAttribute("download", filename);
    var click = document.createEvent("MouseEvent");
    click.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(click);
};

/*
撤销本次操作
*/
MainView.back = function() {
    globaldata.history.back();
    globaldata.history.curr().show(this.canvas);
};

/*
重做本次操作
*/
MainView.forward = function() {
    globaldata.history.forward();
    globaldata.history.curr().show(this.canvas);
};

/*
发送邮件到用户指定的邮箱，将目标图片作为附件。
*/
MainView.send_email = function() {
    this.email.setData(globaldata.history.curr().toDataURL());
    this.email.send();
};
