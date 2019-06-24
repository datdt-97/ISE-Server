import Express from 'express';
import BodyParser from 'body-parser';
import JWT from 'jsonwebtoken';
import Config from './configurations/Config';
import connection from './Connection';
import Query from './Query';

const port = process.env.PORT || 3000;
const app = Express();

app.set('Secret', Config.secret);
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.listen(port, () => console.log(`Server is running on port ${port}`));
app.get('/', (req, res) =>
	res.send('Server app is running on http://localhost:3000')
);

app.post('/authenticate', (req, res) => {
	connection.query(
		Query.select_user,
		[req.headers.email, req.headers.password],
		(err, result) => {
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
				console.log(`Email: ${result[0].email}`);
				console.log(`Password: ${result[0].encrypted_password}`);
				const payload = {
					email: result[0].email,
					password: result[0].encrypted_password
				};
				const token = JWT.sign(payload, app.get('Secret'), {
					expiresIn: 1440
				});

				res.json({
					code: '200',
					token: token
				});
			}
		}
	);
});

const ProtectedRoutes = Express.Router();
app.use('/api', ProtectedRoutes);
ProtectedRoutes.use((req, res, next) => {
	var token = req.headers['access-token'];
	if (token) {
		// verifies secret and checks if the token is expired
		JWT.verify(token, app.get('Secret'), (err, decoded) => {
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
	connection.query(Query.select_events, (err, result) => {
		if (err) {
			res.json({
				code: '500',
				result: ''
			});
			throw err;
		}
		console.table(result);
		if (result === undefined || result.length === 0) {
			res.json({
				code: '404',
				result: ''
			});
		} else {
			res.json({
				code: '200',
				result: result
			});
		}
	});
});
