function extend(subclass superclass) {
	var F = function() {};
	F.prototype = superclass.prototype;
	subclass.prototype = new F();
	subclass.prototype.constructor = subclass;

};
