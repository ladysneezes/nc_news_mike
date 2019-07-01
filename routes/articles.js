const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const {
  sendArticle,
  sendUpdatedArticle,
  sendPostedComment,
  sendComments,
  sendArticles,
  sendPostedArticle
} = require("../controllers/articles");

articlesRouter
  .route("/")
  .get(sendArticles)
  .post(sendPostedArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(sendUpdatedArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .post(sendPostedComment)
  .get(sendComments) //need to add this route into the readme
  .all(methodNotAllowed);

module.exports = articlesRouter;
