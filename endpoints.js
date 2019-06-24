const endpoints = {
  "GET /api": {
    description:
      "serves up a json representation of all the available endpoints of the api"
  },
  "GET /api/topics": {
    description: "serves an array of all topics",
    queries: [],
    exampleResponse: {
      topics: [
        {
          slug: "coding",
          description: "Code is love, code is life"
        },
        {
          slug: "football",
          description: "FOOTIE!"
        },
        {
          slug: "cooking",
          description: "Hey good looking, what you got cooking?"
        }
      ]
    }
  },
  "GET /api/articles": {
    description: "serves an array of all topics",
    queries: ["author", "topic", "sort_by", "order"],
    exampleResponse: {
      articles: [
        {
          article_id: 1,
          title: "Example title",
          body: "Example body",
          votes: 100,
          topic: "Example topic",
          author: "Example author",
          created_at: "YYYY-MM-DD'T'HH: MM: SS.SSS'Z'",
          comment_count: "13"
        },
        {
          article_id: 3,
          title: "Example title",
          body: "Example body",
          votes: 0,
          topic: "Example topic",
          author: "Example author",
          created_at: "YYYY-MM-DD'T'HH: MM: SS.SSS'Z'",
          comment_count: "0"
        }
      ]
    }
  },
  "GET /api/users/:username": {
    description: "serves an object of specific user information",
    queries: [],
    exampleResponse: {
      user: {
        username: "tickle122",
        avatar_url:
          "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
        name: "Tom Tickle"
      }
    }
  },
  "GET /api/articles/:article_id": {
    description: "serves an object of specific article information",
    queries: [],
    exampleResponse: {
      article: {
        article_id: 1,
        title: "Running a Node App",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        votes: 0,
        topic: "coding",
        author: "jessjelly",
        created_at: "2016-08-18T13:07:52.389Z",
        comment_count: "8"
      }
    }
  },
  "PATCH /api/articles/:article_id": {
    description: "serves an object of the updated article",
    queries: [],
    exampleResponse: {
      article: {
        article_id: 1,
        title: "Running a Node App",
        body: "article body",
        votes: 2,
        topic: "coding",
        author: "jessjelly",
        created_at: "2016-08-18T13:07:52.389Z",
        comment_count: "8"
      }
    }
  },
  "POST /api/articles/:article_id/comments": {
    description: "serves an object of the newly created comment",
    queries: [],
    exampleResponse: {
      comment: {
        comment_id: 301,
        author: "jessjelly",
        article_id: 1,
        votes: 0,
        created_at: "2019-06-21T13:13:18.974Z",
        body: "body from request"
      }
    }
  },
  "GET /api/articles/:article_id/comments": {
    description: "serves an an array of comments related to the article id",
    queries: ["sort_by", "order"],
    exampleResponse: {
      comments: [
        {
          comment_id: 301,
          author: "author-1",
          article_id: 1,
          votes: 0,
          created_at: "2019-06-21T13:13:18.974Z",
          body: "comment_body_1"
        },
        {
          comment_id: 44,
          author: "author_2",
          article_id: 1,
          votes: 4,
          created_at: "2017-11-20T08:58:48.322Z",
          body: "comment_body_2"
        }
      ]
    }
  },
  "PATCH /api/articles/comments/:comment_id": {
    description: "serves an object of the comment with given id",
    queries: [],
    exampleResponse: {
      comment: {
        comment_id: 1,
        author: "author_name",
        article_id: 18,
        votes: 10,
        created_at: "2016-07-09T18:07:18.932Z",
        body: "comment body text"
      }
    }
  },
  "DELETE /api/articles/comments/:comment_id": {
    description: "serves an empty response and status 204",
    queries: [],
    exampleResponse: {}
  }
};

module.exports = endpoints;
