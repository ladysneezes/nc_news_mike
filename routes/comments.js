const commentsRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");

const {
  sendUpdatedComment,
  deleteComment
} = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .patch(sendUpdatedComment)
  .delete(deleteComment)
  .all(methodNotAllowed);

module.exports = commentsRouter;
