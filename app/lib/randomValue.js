module.exports = (value = 10) => {
	let pass = "";
	let dic = "abcdefghijklmnopqrstuvwxyz1234567890";
	
	for (var i = 0; i < value; i++) {
		pass += dic.charAt(Math.floor(Math.random() * dic.length));
	}
	
	return pass;
};