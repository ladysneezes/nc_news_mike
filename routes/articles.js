const articlesRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { sendArticle } = require("../controllers/articles");

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .all(methodNotAllowed);

module.exports = articlesRouter;
