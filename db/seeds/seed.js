const { users, comments, articles, topics } = require("../data/index");
const {
  timestampToDate,
  renameKeys,
  createLookupObj,
  linkKeys
} = require("../../utils");

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
        .insert(timestampToDate(articles))
        .into("articles")
        .returning("*");
    })
    .then(articleData => {
      const lookupObj = createLookupObj(articleData, "title", "article_id");
      const commentsWithArtId = linkKeys(
        comments,
        lookupObj,
        "belongs_to",
        "article_id"
      );
      const commentsWithAuthor = renameKeys(
        commentsWithArtId,
        "created_by",
        "author"
      );
      return knex
        .insert(timestampToDate(commentsWithAuthor))
        .into("comments")
        .returning("*");
    });
};
