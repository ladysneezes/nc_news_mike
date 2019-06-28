const usersRouter = require("express").Router();
const { methodNotAllowed } = require("../errors");
const { sendUser, sendUsers } = require("../controllers/users");

usersRouter
  .route("/:username")
  .get(sendUser)
  .all(methodNotAllowed);

usersRouter
  .route("/")
  .get(sendUsers)
  .all(methodNotAllowed);

module.exports = usersRouter;
