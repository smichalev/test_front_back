const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require(path.join(__dirname, 'config'));

(async () => {
	await mongoose.connect(config.database, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	
	app.listen(config.port, () => {
		console.log('Go to http://127.0.0.1:' + config.port);
	});
})();


const app = express();

app.use(cors({
	origin: ['http://127.0.0.1:' + config.port, 'http://localhost:' + config.port],
	credentials: true,
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static('assets'));

app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'secret',
	cookie: {maxAge: 24 * 60 * 60 * 1000},
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require('./routes')(app);