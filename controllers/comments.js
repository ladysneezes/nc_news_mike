const { updateComment, delComment } = require("../models/comments");

exports.sendUpdatedComment = (req, res, next) => {
  updateComment(req.params, req.body)
    .then(comment => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${req.params.comment_id}`
        });
      } else return res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  delComment(req.params)
    .then(deleted => {
      return res.sendStatus(204);
    })
    .catch(next);
};
