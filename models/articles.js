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

exports.updateArticle = ({ article_id }, { inc_votes = 0 }) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`
    });
  } else
    return connection("articles")
      .where("article_id", "=", article_id)
      .increment("votes", inc_votes || 0)
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
  if (order !== "desc" && order !== "asc") {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`
    });
  } else
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

exports.checkExists = ({ topic, author }, res, next) => {
  if (topic) {
    return connection("topics")
      .select("*")
      .where({ slug: topic })
      .then(response => {
        if (response.length === 0) {
          return { msg: `${topic} does not exist as a topic` };
        }
        return true;
      });
  }
  if (author) {
    return connection("users")
      .select("*")
      .where({ username: author })
      .then(response => {
        if (response.length === 0) {
          return { msg: `Author ${author} does not exist` };
        }
        return true;
      });
  }
  return true;
};
