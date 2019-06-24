const {
  fetchArticleByArticleId,
  updateArticle,
  postComment,
  fetchCommentsByArticleId,
  fetchArticles,
  checkExists
} = require("../models/articles");

exports.sendArticle = (req, res, next) => {
  fetchArticleByArticleId(req.params)
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${req.params.article_id}`
        });
      } else return res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.sendUpdatedArticle = (req, res, next) => {
  updateArticle(req.params, req.body)
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${req.params.article_id}`
        });
      } else return res.status(200).send({ article });
    })
    .catch(next);
};

exports.sendPostedComment = (req, res, next) => {
  fetchArticleByArticleId(req.params)
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${req.params.article_id}`
        });
      } else return postComment(req.params, req.body);
    })
    .then(([comment]) => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};

exports.sendComments = (req, res, next) => {
  fetchArticleByArticleId(req.params)
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${req.params.article_id}`
        });
      } else return fetchCommentsByArticleId(req.params, req.query);
    })
    .then(comments => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.sendArticles = (req, res, next) => {
  return Promise.all([fetchArticles(req.query), checkExists(req.query)])
    .then(([articles, exists]) => {
      if (exists === true) {
        res.status(200).send({ articles });
      } else {
        next({ status: 404, msg: exists.msg });
      }
    })
    .catch(next);
};
