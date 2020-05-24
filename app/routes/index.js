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
};