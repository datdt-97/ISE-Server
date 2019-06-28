import Express from 'express';
import BodyParser from 'body-parser';
import JWT from 'jsonwebtoken';
import ProtectedRoutes from './ProtectedRoutes';
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
			if (result === undefined || result.length == 0) {
				res.json({
					code: '404',
					token: ''
				});
			} else {
				const payload = {
					email: result[0].email,
					password: result[0].encrypted_password
				};
				const token = JWT.sign(payload, app.get('Secret'));

				res.json({
					code: '200',
					token: token,
					user: result[0]
				});
			}
		}
	);
});

app.use('/api', ProtectedRoutes);
