/*
 * 发送邮件类
 * 填写目标邮件地址，添加附件图片
 * 上传数据，调用后台发送邮件
 */

var Mailer = function() {
	this.base64 = null; // 图片数据，字符串形式
	this.address = null; // 目标邮箱地址
	this.xmlhttp = new XMLHttpRequest(); // XMLHttpRequest对象，用于上产数据和下达出发送邮件的指令

	this.init();
};

Mailer.prototype.init = function() {
	this.xmlhttp.open("POST", "SendEmail.php", true);
	// 设置回调函数
	this.xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			if (this.responseText === "ok") { // 如果邮件发送成功，返回ok
				alert("邮件已发送");
			} else {
				alert("邮件发送失败");
			}
		}
	};
};
// 设置目的地址
Mailer.prototype.setAddress = function(address) {
	this.address = address;
};
// 设置图像数据
Mailer.prototype.setData = function(dataurl) {
	this.base64 = dataurl.replace(/^.*,[ ]*/, "");
};
// 上传数据，下达发送邮件命令
Mailer.prototype.send = function() {
	this.xmlhttp.send(this.base64);
};

