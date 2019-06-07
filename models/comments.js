const connection = require("../db/connection");

exports.updateComment = ({ comment_id }, { inc_votes = 0 }) => {
  if (typeof inc_votes !== "number") {
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

exports.checkComment = ({ comment_id }) => {
  return connection("comments")
    .select("comment_id")
    .where("comment_id", "=", comment_id);
};
