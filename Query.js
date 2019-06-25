module.exports = {
	select_user:
		'SELECT * FROM `users` WHERE email = ? AND encrypted_password = ?',
	select_events: 'SELECT * FROM `events`',
	search_event: 'SELECT * FROM `events` where `events`.name LIKE ?',
	select_parter_by_id: 'SELECT * FROM `partners` where id = ?'
};
