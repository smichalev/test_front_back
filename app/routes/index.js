const path = require('path');
const {User, Request} = require(path.join(__dirname, '..', 'models'));
const ErrorList = require(path.join(__dirname, '..', 'errors', 'error.list'));
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const config = require(path.join(__dirname, '..', 'config'));
const nodemailer = require('nodemailer');
const randomValue = require(path.join(__dirname, '..', 'lib', 'randomValue'));

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
	app.get('/forgot', (req, res, next) => {
		res.render('index');
	});
	app.get('/reset', (req, res, next) => {
		res.render('index');
	});
	app.get('/active', (req, res, next) => {
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
			
			if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(password)) {
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
			
			let random = randomValue();
			
			let smtpTransport = nodemailer.createTransport({
				host: "smtp.yandex.ru",
				port: 465,
				secure: true,
				auth: {
					user: "testaccount123459",
					pass: "Qq123456789",
				},
			});
			
			let mailOptions = {
				from: 'test <testaccount123459@yandex.ru>',
				to: req.body.email,
				subject: 'Активация аккаунта',
				text: 'Активация аккаунта',
				html: `Ссылка для активации аккаунта: http://${config.host}:${config.port}/active?hash=${random}`,
			};
			
			const request = new Request({user: profile._id, code: random, type: 'active'});
			
			await request.save();
			
			await smtpTransport.sendMail(mailOptions);
		
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
			
			if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(req.body.password)) {
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
	
	app.post('/api/forgot', async (req, res, next) => {
		try {
			if (!req.body.email) {
				throw new ErrorList(ErrorList.CODES.REQUIRED_FIELD);
			}
			
			if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				req.body.email)) {
				throw new ErrorList(ErrorList.CODES.NOT_VALID_EMAIL);
			}
			
			let profile = await User.findOne({login: req.body.email});
			
			if (!profile) {
				throw new ErrorList(ErrorList.CODES.NOT_FOUND_USER);
			}
			
			let random = randomValue();
			
			let smtpTransport = nodemailer.createTransport({
				host: "smtp.yandex.ru",
				port: 465,
				secure: true,
				auth: {
					user: "testaccount123459",
					pass: "Qq123456789",
				},
			});
			
			let mailOptions = {
				from: 'test <testaccount123459@yandex.ru>',
				to: req.body.email,
				subject: 'Сброс пароля',
				text: 'Сброс пароля',
				html: `Ссылка для сброса пароля: http://${config.host}:${config.port}/reset?hash=${random}`,
			};
			
			const request = new Request({user: profile._id, code: random, type: 'reset'});
			
			let result = await request.save();
			
			await smtpTransport.sendMail(mailOptions);
			
			return res.send('ok');
		}
		catch (err) {
			return next(err);
		}
		
	});
	
	app.get('/api/reset', async (req, res, next) => {
		if (!req.query.hash) {
			throw new ErrorList(ErrorList.CODES.NOT_FOUND);
		}
		
		let hash = await Request.findOne({code: req.query.hash, type: 'reset'});
		
		if (!hash) {
			return next(new ErrorList(ErrorList.CODES.NOT_FOUND_HASH));
		}
		
		return res.json({result: hash});
	});
	
	app.post('/api/reset', async (req, res, next) => {
		if (!req.body.hash || !req.body.oldpassword || !req.body.newpassword || !req.body.repeat_newpassword || !req.body.userid) {
			return next(new ErrorList(ErrorList.CODES.REQUIRED_FIELD));
		}
		
		if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(req.body.oldpassword)) {
			return next(new ErrorList(ErrorList.CODES.NOT_VALID_PASSWORD));
		}
		
		if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(req.body.newpassword)) {
			return next(new ErrorList(ErrorList.CODES.NOT_VALID_PASSWORD));
		}
		
		if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]){8,}/g.test(req.body.repeat_newpassword)) {
			return next(new ErrorList(ErrorList.CODES.NOT_VALID_PASSWORD));
		}
		
		if (req.body.newpassword !== req.body.repeat_newpassword) {
			return next(new ErrorList(ErrorList.CODES.PASSWORD_MISMATCH));
		}
		
		let hash = await Request.findOne({user: req.body.userid, code: req.body.hash, type: 'reset'});
		
		if (!hash) {
			return next(new ErrorList(ErrorList.CODES.NOT_FOUND_HASH));
		}
		
		await hash.remove();
		
		let user = await User.findOne({_id: req.body.userid});
		
		if (!user) {
			throw new ErrorList(ErrorList.CODES.NOT_FOUND_USER);
		}
		
		if (user.password !== md5(req.body.oldpassword)) {
			throw new ErrorList(ErrorList.CODES.PREVIOUS_PASSWORD_WAS_DIFFERENT);
		}
		
		user.password = md5(req.body.repeat_newpassword);
		
		await user.save();
		
		let objectUser = {
			_id: user._id,
			active: user.active,
			login: user.login,
			name: user.name,
			surname: user.surname,
			__v: user.__v,
		};
		
		req.session.user = await jwt.sign({profile: objectUser}, config.jwtsecret);
		req.session.save();
		
		return res.json({profile: objectUser});
	});
	
	app.get('/api/active', async (req, res, next) => {
		if (!req.query.hash) {
			throw new ErrorList(ErrorList.CODES.NOT_FOUND);
		}
		
		let request = await Request.findOne({code: req.query.hash, type: 'active'});
		
		if (!request) {
			return next(new ErrorList(ErrorList.CODES.NOT_FOUND_HASH_ACTIVE));
		}
		
		return res.json({result: request});
	});
	
	app.post('/api/active', async (req, res, next) => {
		if (!req.body.hash) {
			throw new ErrorList(ErrorList.CODES.NOT_FOUND);
		}
		
		let request = await Request.findOne({code: req.body.hash, type: 'active'});
		
		if (!request) {
			return next(new ErrorList(ErrorList.CODES.NOT_FOUND_HASH_ACTIVE));
		}
		
		let user = await User.findOne({_id: request.user, active: false});
		
		if (!user) {
			return next(new ErrorList(ErrorList.CODES.NOT_FOUND_USER));
		}
		
		user.active = true;
		
		await user.save();
		
		let objectUser = {
			_id: user._id,
			active: true,
			login: user.login,
			name: user.name,
			surname: user.surname,
			__v: user.__v,
		};
		
		await request.remove();
		
		req.session.user = await jwt.sign({profile: objectUser}, config.jwtsecret);
		req.session.save();
		
		return res.json({result: objectUser});
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