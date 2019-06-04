const { fetchArticleByArticleId } = require("../models/articles");

exports.sendArticle = (req, res, next) => {
  fetchArticleByArticleId(req.params)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${req.params.article_id}`
        });
      }
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};
