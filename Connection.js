import MySql from 'mysql';
import Database from './configurations/Database';

const connection = MySql.createConnection({
	host: Database.host,
	database: Database.databaseName,
	user: Database.user,
	password: Database.password
});

connection.connect(err => {
	if (err) throw err;
});

export default connection;
