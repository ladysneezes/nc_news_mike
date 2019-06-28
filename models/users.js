const connection = require("../db/connection");

exports.fetchUserByUsername = ({ username }) => {
  return connection
    .select("username", "avatar_url", "name")
    .from("users")
    .where({ username })
    .then(([user]) => {
      return user;
    });
};

exports.fetchAllUsers = () => {
  return connection.select("*").from("users");
};
