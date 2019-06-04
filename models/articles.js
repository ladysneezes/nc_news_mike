const connection = require("../db/connection");

exports.fetchArticleByArticleId = ({ article_id }) => {
  return connection
    .select(
      "author",
      "title",
      "article_id",
      "body",
      "topic",
      "created_at",
      "votes"
    )
    .from("articles")
    .where({ article_id });
};
