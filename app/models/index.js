const path = require('path');

module.exports = {
	User: require(path.join(__dirname, 'user.model')),
	Request: require(path.join(__dirname, 'request.model')),
};