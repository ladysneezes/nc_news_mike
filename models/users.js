const connection = require("../db/connection");

exports.fetchUserByUsername = ({ username }) => {
  console.log("in users model", username);
  return connection
    .select("username", "avatar_url", "name")
    .from("users")
    .where({ username })
    .then(([user]) => {
      return user;
    });
};
