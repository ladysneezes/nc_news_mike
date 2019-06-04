const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection.select("slug", "description").from("topics");
};
