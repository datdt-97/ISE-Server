module.exports = {
	select_user:
		'SELECT * FROM `users` WHERE email = ? AND encrypted_password = ?',
	select_events: 'SELECT * FROM `events`',
	select_event_by_id: 'SELECT * FROM `events` where id = ?',
	search_event: 'SELECT * FROM `events` where `events`.name LIKE ?',
	select_parter_by_id: 'SELECT * FROM `partners` where id = ?',
	select_major_by_id: 'SELECT * FROM `majors` where id = ?',
	select_user_by_id: 'SELECT * FROM `users` where id = ?'
};
