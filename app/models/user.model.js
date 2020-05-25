const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userScheme = new Schema({
	active: Boolean,
	login: String,
	password: String,
	name: String,
	surname: String,
});

const User = mongoose.model("User", userScheme);

module.exports = User;