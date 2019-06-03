const { users, comments, articles, topics } = require("../data/index");
const formatArticles = require(".../utils");

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex
        .insert(topics)
        .into("topics")
        .returning("*");
    })
    .then(() => {
      return knex
        .insert(users)
        .into("users")
        .returning("*");
    })
    .then(() => {
      return knex
        .insert(formatArticles(articles))
        .into("articles")
        .returning("*");
    })
    .then(console.log);
};
