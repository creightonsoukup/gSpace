
exports.up = function(knex, Promise) {
  return knex.schema.createTable('projects', function(table) {
		table.increments('id');
    table.integer('users_id').references('id').inTable('users');
		table.string('title');
		table.text('body');
		table.string('repository_url');
		table.integer('likes');
		table.dateTime('created_on');
		table.dateTime('updated_on');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('projects');
};
