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
	// 设置回调函数
	this.xmlhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			switch (this.responseText) {
				case "emailsendok":
					alert("邮件已发送");
					break;
				case "emailsendfail":
					alert("邮件发送失败");
					break;
				case "noemail":
					alert("邮件发送失败，原因是邮箱设置失败");
					break;
				case "emailsetok":
					alert("邮箱设置成功");
					break;
				case "emailsetfail":
					alert("邮箱设置失败");
					break;
			}
		}
	};
};
// 上传邮箱地址
Mailer.prototype.setAddress = function(address) {
	this.address = address;
	this.xmlhttp.open("POST", "SetAddress.php", true);
	this.xmlhttp.send(this.address);
};
// 设置图像数据
Mailer.prototype.setImage = function(dataurl) {
	this.base64 = dataurl.replace(/^.*,[ ]*/, "");
};
// 上传图像数据
Mailer.prototype.sendImage = function(dataurl) {
	if (this.base64 === null) {
		return;
	}
	this.xmlhttp.open("POST", "SendEmail.php", true);
	this.xmlhttp.send(this.base64);
};
