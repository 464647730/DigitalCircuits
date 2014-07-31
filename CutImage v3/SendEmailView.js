/*
发送邮件页面
用户输入自己的邮箱地址，应用将发送一封邮件到用户的邮箱。
如果用户在其他电脑上编辑图片，发送邮件到自己的邮箱提供了一种保存图片的便捷方式。
*/

var SendEmailView = new View();

SendEmailView.init = function() {
	this.view = document.getElementById("SendEmailView");
	this.canvas = document.getElementById("send_email_canvas");
	this.input = document.getElementById("email_address");

	var that = this;
	document.getElementById("set_email_address").addEventListener("click", function() {
		var address = that.input.value;
		console.log(address);
		globaldata.mailer.setAddress(address);
	}, false);
	document.getElementById("send_email").addEventListener("click", function() {
		var address = that.input.value;
		globaldata.mailer.sendImage();
	}, false);
	document.getElementById("send_email_back").addEventListener("click", function() {
		that.gotoView(MainView);
	}, false);
};

SendEmailView.beforeDisplay = function() {
	globaldata.history.curr().show(this.canvas);
	if (!("mailer" in globaldata)) {
		globaldata.mailer = new Mailer(); // 用于发送邮件
	}
	globaldata.mailer.setImage(globaldata.history.curr().toDataURL());
};
