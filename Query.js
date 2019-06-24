module.exports = {
	select_user:
		'SELECT * FROM `users` WHERE email = ? AND encrypted_password = ?',
	select_events: 'SELECT * FROM `events`'
};
