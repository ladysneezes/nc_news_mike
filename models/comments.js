const connection = require("../db/connection");

exports.updateComment = ({ comment_id }, { inc_votes }) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request`
    });
  } else
    return connection("comments")
      .where("comment_id", "=", comment_id)
      .increment("votes", inc_votes)
      .returning("*")
      .then(([comment]) => comment);
};

exports.delComment = ({ comment_id }) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del();
};
