import Express from 'express';
import JWT from 'jsonwebtoken';
import Config from './configurations/Config';
import connection from './Connection';
import Query from './Query';
import Validation from './Validation';

const ProtectedRoutes = Express.Router();

ProtectedRoutes.use((req, res, next) => {
	var token = req.headers['access-token'];
	if (token) {
		// verifies secret and checks if the token is expired
		JWT.verify(token, Config.secret, (err, decoded) => {
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

ProtectedRoutes.get('/events', (req, res) => {
	if (req.query.q === undefined) {
		connection.query(Query.select_events, (err, result) => {
			res.json(Validation.checkArrayResult(err, result));
		});
	} else {
		const sql = connection.format(Query.search_event, [`%${req.query.q}%`]);
		connection.query(sql, (err, result) => {
			res.json(Validation.checkArrayResult(err, result));
		});
	}
});

ProtectedRoutes.get('/event/:eventId', (req, res) => {
	const sql = connection.format(Query.select_event_by_id, [
		req.params.eventId
	]);
	connection.query(sql, (err, result) => {
		res.json(Validation.checkSingleResult(err, result));
	});
});

ProtectedRoutes.get('/partner/:partnerId', (req, res) => {
	const sql = connection.format(Query.select_parter_by_id, [
		req.params.partnerId
	]);
	connection.query(sql, (err, result) => {
		res.json(Validation.checkSingleResult(err, result));
	});
});

ProtectedRoutes.get('/user/:userId', (req, res) => {
	const sql = connection.format(Query.select_user_by_id, [req.params.userId]);
	connection.query(sql, (err, result) => {
		res.json(Validation.checkSingleResult(err, result));
	});
});

ProtectedRoutes.get('/major/:majorId', (req, res) => {
	const sql = connection.format(Query.select_major_by_id, [
		req.params.majorId
	]);
	connection.query(sql, (err, result) => {
		res.json(Validation.checkSingleResult(err, result));
	});
});

export default ProtectedRoutes;
