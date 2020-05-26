const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestScheme = new Schema({
	user: String,
	code: String,
	type: String
});

const Request = mongoose.model("Request", requestScheme);

module.exports = Request;