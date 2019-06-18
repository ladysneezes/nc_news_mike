const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection.select("slug", "description").from("topics");
};

exports.fetchTopicBySlug = ({ slug }) => {
  return connection
    .select("slug", "description")
    .from("topics")
    .where({ slug })
    .then(([topic]) => {
      return topic;
    });
};
