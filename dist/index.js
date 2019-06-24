'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _Config = require('./configurations/Config');

var _Config2 = _interopRequireDefault(_Config);

var _Connection = require('./Connection');

var _Connection2 = _interopRequireDefault(_Connection);

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || 3000;
var app = (0, _express2.default)();

app.set('Secret', _Config2.default.secret);
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
app.listen(port, function () {
	return console.log('Server is running on port ' + port);
});
app.get('/', function (req, res) {
	return res.send('Server app is running on http://localhost:3000');
});

app.post('/authenticate', function (req, res) {
	_Connection2.default.query(_Query2.default.select_user, [req.headers.email, req.headers.password], function (err, result) {
		if (err) {
			res.json({
				code: '500',
				token: ''
			});
			throw err;
		}
		console.table(result);
		if (result === undefined || result.length == 0) {
			res.json({
				code: '404',
				token: ''
			});
		} else {
			console.log('Email: ' + result[0].email);
			console.log('Password: ' + result[0].encrypted_password);
			var payload = {
				email: result[0].email,
				password: result[0].encrypted_password
			};
			var token = _jsonwebtoken2.default.sign(payload, app.get('Secret'), {
				expiresIn: 1440
			});

			res.json({
				message: '200',
				token: token
			});
		}
	});
});

var ProtectedRoutes = _express2.default.Router();
app.use('/api', ProtectedRoutes);
ProtectedRoutes.use(function (req, res, next) {
	var token = req.headers['access-token'];
	if (token) {
		// verifies secret and checks if the token is expired
		_jsonwebtoken2.default.verify(token, app.get('Secret'), function (err, decoded) {
			if (err) {
				return res.json({ message: 'invalid token' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token

		res.send({
			message: 'No token provided.'
		});
	}
});

ProtectedRoutes.get('/events', function (req, res) {
	// let events = [
	// 	{
	// 		id: 1,
	// 		name: 'cheese'
	// 	},
	// 	{
	// 		id: 2,
	// 		name: 'carottes'
	// 	}
	// ];
	// res.json(events);
	_Connection2.default.query(_Query2.default.select_events, function (err, result) {
		if (err) {
			res.json({
				code: '500',
				token: ''
			});
			throw err;
		}
		console.table(result);
		if (result === undefined || result.length === 0) {
			res.json({
				code: '404',
				token: ''
			});
		} else {
			res.json({
				message: '200',
				result: result
			});
		}
	});
});