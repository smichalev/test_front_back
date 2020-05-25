const path = require('path');
const {User} = require(path.join(__dirname, '..', 'models'));
const ErrorList = require(path.join(__dirname, '..', 'errors', 'error.list'));
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const config = require(path.join(__dirname, '..', 'config'));

module.exports = (app) => {
	app.get('/', (req, res, next) => {
		res.render('index');
	});
	app.get('/login', (req, res, next) => {
		res.render('index');
	});
	app.get('/registration', (req, res, next) => {
		res.render('index');
	});
	app.get('/forgot__password', (req, res, next) => {
		res.render('index');
	});
	
	app.get('/api/profile', async (req, res, next) => {
		let profile = {
			login: false,
			info: null,
		};
		
		if (!req.session.user) {
			return res.json({profile});
		}
		
		if (req.session.user) {
			profile.login = true;
			profile.info = await jwt.decode(req.session.user, config.jwtsecret);
			
			delete profile.info.profile.password;
			
			return res.json({profile: profile.info.profile});
		}
	});
	
	app.post('/api/registration', async (req, res, next) => {
		try {
			if (!req.body.login || !req.body.password || !req.body.repeat_password || !req.body.name || !req.body.surname) {
				throw new ErrorList(ErrorList.CODES.REQUIRED_FIELD);
			}
			
			let {login, password, name, surname, repeat_password} = req.body;
			
			if (repeat_password !== password) {
				throw new ErrorList(ErrorList.CODES.PASSWORD_MISMATCH);
			}
			
			if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				login)) {
				throw new ErrorList(ErrorList.CODES.NOT_VALID_EMAIL);
			}
			
			if(!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(password)) {
				throw new ErrorList(ErrorList.CODES.NOT_VALID_PASSWORD);
			}
			
			let user = await User.findOne({login});
			
			if (user) {
				throw new ErrorList(ErrorList.CODES.USER_IS_ALREADY_THERE);
			}
			
			const profile = new User({active: false, login, password: md5(password), name, surname});
			
			await profile.save();
			
			let objectUser = {
				_id: profile._id,
				active: profile.active,
				login: profile.login,
				name: profile.name,
				surname: profile.surname,
				__v: profile.__v,
			};
			
			let hash = await jwt.sign({profile}, config.jwtsecret);
			
			req.session.user = hash;
			req.session.save();
			
			res.json({profile: objectUser});
			
		}
		catch (err) {
			next(err);
		}
	});
	
	app.post('/api/login', async (req, res, next) => {
		try {
			if (!req.body.login || !req.body.password) {
				throw new ErrorList(ErrorList.CODES.NOT_CORRECT_QUERY);
			}
			
			if(!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(req.body.password)) {
				throw new ErrorList(ErrorList.CODES.NOT_VALID_PASSWORD);
			}
			
			let profile = await User.findOne({login: req.body.login, password: md5(req.body.password)});
			
			if (!profile) {
				throw new ErrorList(ErrorList.CODES.BAD_PASSWORD_OR_LOGIN);
			}
			
			let objectUser = {
				_id: profile._id,
				active: profile.active,
				login: profile.login,
				name: profile.name,
				surname: profile.surname,
				__v: profile.__v,
			};
			
			let hash = await jwt.sign({profile: objectUser}, config.jwtsecret);
			
			req.session.user = hash;
			req.session.save();
			
			res.json({profile: objectUser});
		}
		catch (err) {
			next(err);
		}
	});
	
	app.post('/api/logout', (req, res, next) => {
		try {
			req.session.user = null;
			req.session.save();
			
			return res.send('ok');
		}
		catch (err) {
			next(err);
		}
	});
	
	app.use((err, req, res, next) => {
		if (!err) {
			return next();
		}
		
		let response = {};
		
		if (err.code !== null && err.code !== 'undefined') {
			response.code = err.code;
		}
		
		let message = err.message || 'Неизвестная ошибка';
		
		response.message = message;
		
		return res.status(err.status).json({error: response});
	});
	
	app.use((err, req, res, next) => {
		let error = new ErrorList(ErrorList.CODES.NOT_FOUND);
		
		return res.status(404).json({error});
	});
};