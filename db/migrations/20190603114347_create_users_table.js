exports.up = function(knex, Promise) {
  console.log("creating users table...");
  return knex.schema.createTable("users", usersTable => {
    usersTable
      .string("username")
      .primary()
      .unique();
    usersTable.string("name").notNullable();
    usersTable.string("avatar_url");
  });
};

exports.down = function(knex, Promise) {
  console.log("removing users tables...");
  return knex.schema.dropTable("users");
};
