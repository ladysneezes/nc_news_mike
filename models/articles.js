const connection = require("../db/connection");
const { fetchUserByUsername } = require("./users");

exports.fetchArticleByArticleId = ({ article_id }) => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .having("articles.article_id", "=", article_id)
    .then(([article]) => {
      return article;
    });
};

exports.updateArticle = ({ article_id }, { inc_votes }) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`
    });
  } else
    return connection("articles")
      .where("article_id", "=", article_id)
      .increment("votes", inc_votes)
      .returning("*")
      .then(([article]) => article);
};

exports.postComment = ({ article_id }, { body, username }) => {
  return connection("comments")
    .insert({ author: username, body, article_id })
    .returning("*");
};

exports.fetchCommentsByArticleId = (
  { article_id },
  { sort_by = "created_at", order = "desc" }
) => {
  if (order !== "desc" && order !== "asc") {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`
    });
  } else
    return connection
      .select("*")
      .from("comments")
      .where("article_id", "=", article_id)
      .orderBy(sort_by, order);
};

exports.fetchArticles = ({
  sort_by = "created_at",
  order = "desc",
  author = null,
  topic = null
}) => {
  console.log(author, "author in original model");
  if (author) {
    return fetchUserByUsername({ username: author });
  } else if (order !== "desc" && order !== "asc") {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`
    });
  } else;
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .leftJoin("users", "users.username", "articles.author")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify(query => {
      if (author) query.where("articles.author", "=", author);
      if (topic) query.where("articles.topic", "=", topic);
    });
};
