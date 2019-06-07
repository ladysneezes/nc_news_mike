const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const {
  sendArticle,
  sendUpdatedArticle,
  sendPostedComment,
  sendComments,
  sendArticles
} = require("../controllers/articles");

articlesRouter
  .route("/")
  .get(sendArticles)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(sendUpdatedArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .post(sendPostedComment)
  .get(sendComments)
  .all(methodNotAllowed);

module.exports = articlesRouter;
