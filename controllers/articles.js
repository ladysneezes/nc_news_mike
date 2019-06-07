const {
  fetchArticleByArticleId,
  updateArticle,
  postComment,
  fetchCommentsByArticleId,
  fetchArticles
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
  postComment(req.params, req.body)
    .then(([comment]) => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};

exports.sendComments = (req, res, next) => {
  fetchCommentsByArticleId(req.params, req.query)
    .then(comments => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.sendArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then(articles => {
      return res.status(200).send({ articles });
    })
    .catch(next);
};
