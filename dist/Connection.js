'use strict';

var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'db4free.net',
	database: 'ise_capstone',
	user: 'datdt123',
	password: '123456789'
});

connection.connect(function (err) {
	if (err) throw err;
});

module.exports = connection;