const connection = require("../db/connection");

exports.fetchArticleByArticleId = ({ article_id }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .having("articles.article_id", "=", article_id);
};
