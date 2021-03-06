process.env.NODE_ENV = "test";
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-sorted"));
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const endpoints = require("../endpoints");

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/api", () => {
    it("GET status:200 returns endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).to.eql(endpoints);
        });
    });
    describe("/topics", () => {
      it("GET status 200 returns all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const { topics } = body;
            expect(topics).to.be.an("array");
            expect(topics[0]).to.contain.keys("description", "slug");
          });
      });
    });
    describe("/users", () => {
      describe("/", () => {
        it("GET status 200 returns all users", () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
              const { users } = body;
              expect(users).to.be.an("array");
            });
        });
      });
      describe("/:username", () => {
        it("GET status 200 returns user", () => {
          return request(app)
            .get("/api/users/icellusedkars")
            .expect(200)
            .then(({ body }) => {
              const { user } = body;
              expect(user).to.be.an("object");
              expect(user).to.contain.keys("username", "avatar_url", "name");
              expect(user.username).to.equal("icellusedkars");
            });
        });
        it("GET for an unfound username - status:404 and error message", () => {
          return request(app)
            .get("/api/users/notAnID")
            .expect(404)
            .then(response => {
              const { body, statusCode } = response;
              expect(body.msg).to.equal(`No user found for username: notAnID`);
              expect(statusCode).to.equal(404);
            });
        });
      });
    });
    describe("/articles", () => {
      it("GET status 200", () => {
        return request(app)
          .get("/api/articles")
          .expect(200);
      });
      it("GET returns all articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).to.be.an("array");
            expect(articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("GET sorts and orders by default to created_at and desc", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(res => {
            const { articles } = res.body;
            expect(articles).to.be.descendingBy("created_at");
          });
      });
      it("GET sorts and orders by querys provided", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(res => {
            const { articles } = res.body;
            expect(articles).to.be.ascendingBy("votes");
          });
      });
      it("GET filters by author", () => {
        return request(app)
          .get("/api/articles?author=rogersop")
          .expect(200)
          .then(res => {
            const { articles } = res.body;
            articles.forEach(article => {
              expect(article.author).to.equal("rogersop");
            });
          });
      });
      it("GET filters by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(res => {
            const { articles } = res.body;
            articles.forEach(article => {
              expect(article.topic).to.equal("mitch");
            });
          });
      });
      it("GET invalid sort_by query sent returns 400", () => {
        return request(app)
          .get("/api/articles?sort_by=NONSENSE")
          .expect(400)
          .then(res => {
            const { msg } = res.body;
            expect(msg).to.equal(`column "NONSENSE" does not exist`);
          });
      });
      it("GET invalid order query sent returns 400", () => {
        return request(app)
          .get("/api/articles?order=NotAnOrder")
          .expect(400)
          .then(res => {
            const { msg } = res.body;
            expect(msg).to.equal(`Bad Request`);
          });
      });
      it("GET none existent author query sent returns 404", () => {
        return request(app)
          .get("/api/articles?author=NOTANAUTHOR")
          .expect(404)
          .then(res => {
            const { msg } = res.body;
            expect(msg).to.equal(`Author NOTANAUTHOR does not exist`);
          });
      });
      it("GET none existent topic query sent returns 404", () => {
        return request(app)
          .get("/api/articles?topic=NOTATOPIC")
          .expect(404)
          .then(res => {
            const { msg } = res.body;
            expect(msg).to.equal(`NOTATOPIC does not exist as a topic`);
          });
      });
      it("POST status 201 responds with article data", () => {
        return request(app)
          .post("/api/articles/")
          .send({
            title: "icellusedkars",
            body: "example body",
            topic: "mitch",
            author: "icellusedkars"
          })
          .expect(201)
          .then(response => {
            const { article } = response.body;
            expect(article).to.contain.keys(
              "author",
              "article_id",
              "votes",
              "title",
              "body",
              "created_at",
              "topic"
            );
          });
      });
      it("POST with invalid body data returns 400 Bad Request", () => {
        return request(app)
          .post("/api/articles/")
          .send({
            title: "icellusedkars",
            body: "example body",
            author: "icellusedkars",
            topic: "notatopic"
          })
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal(
              `insert or update on table "articles" violates foreign key constraint "articles_topic_foreign"`
            );
          });
      });
      it("POST with missing body data returns 400 Bad Request", () => {
        return request(app)
          .post("/api/articles/")
          .send({})
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal(
              `null value in column "title" violates not-null constraint`
            );
          });
      });
    });
    describe("/:article_id", () => {
      it("GET status 200 returns article", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article).to.be.an("object");
            expect(article).to.contain.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(article).to.eql({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              body: "I find this existence challenging",
              topic: "mitch",
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100,
              comment_count: "13"
            });
          });
      });
      it("GET a valid article_id that is not taken e.g 99999999 returns 404 and error msg", () => {
        return request(app)
          .get("/api/articles/9999")
          .expect(404)
          .then(response => {
            const { body, statusCode } = response;
            expect(body.msg).to.equal(`No article found for article_id: 9999`);
            expect(statusCode).to.equal(404);
          });
      });
      it("GET an invalid article_id returns 400 and error msg", () => {
        return request(app)
          .get("/api/articles/invalidID")
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal(
              `invalid input syntax for integer: "invalidID"`
            );
          });
      });
      it("PATCH status 200 responds with updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 22 })
          .expect(200)
          .then(response => {
            const { article } = response.body;
            expect(article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 122,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z"
            });
          });
      });
      it("PATCH a valid article_id that is not taken e.g 99999999 returns 404 and error msg", () => {
        return request(app)
          .patch("/api/articles/9999")
          .send({ inc_votes: 22 })
          .expect(404)
          .then(response => {
            const { body, statusCode } = response;
            expect(body.msg).to.equal(`No article found for article_id: 9999`);
            expect(statusCode).to.equal(404);
          });
      });
      it("PATCH an invalid article_id returns 400 and error msg", () => {
        return request(app)
          .patch("/api/articles/invalidID")
          .send({ inc_votes: 22 })
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal(
              `invalid input syntax for integer: "invalidID"`
            );
          });
      });
      it("PATCH with empty body data returns 200 and does not increment", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(response => {
            const { article } = response.body;
            expect(article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100
            });
          });
      });
      it("PATCH with empty body data returns 200", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(response => {
            const { article } = response.body;
            expect(article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z"
            });
          });
      });
      it("PATCH with empty body data returns 400 Bad Request", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "NOTVALID" })
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal(`Bad Request`);
          });
      });
      describe("/comments", () => {
        it("POST status 201 responds with comment data", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ username: "icellusedkars", body: "BARF!!!!!!" })
            .expect(201)
            .then(response => {
              const { comment } = response.body;
              expect(comment).to.contain.keys(
                "author",
                "article_id",
                "votes",
                "comment_id",
                "body",
                "created_at"
              );
            });
        });
        it("POST with invalid body data returns 400 Bad Request", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({ body: "BARF!!!!!!" })
            .expect(400)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal(
                `null value in column "author" violates not-null constraint`
              );
            });
        });
        it("POST with missing body data returns 400 Bad Request", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send({})
            .expect(400)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal(
                `null value in column "author" violates not-null constraint`
              );
            });
        });
        it("POST an invalid article_id returns 400 and error msg", () => {
          return request(app)
            .post("/api/articles/NOTaVALIDid/comments")
            .send({ inc_votes: 22 })
            .expect(400)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal(
                `invalid input syntax for integer: "NOTaVALIDid"`
              );
            });
        });
        it("POST a valid article_id that is not it use returns 404 and error msg", () => {
          return request(app)
            .post("/api/articles/100000/comments")
            .send({ inc_votes: 22 })
            .expect(404)
            .then(response => {
              const { msg } = response.body;
              expect(msg).to.equal(`No article found for article_id: 100000`);
            });
        });
        it("GET status 200 responds with comment data", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(response => {
              const { comments } = response.body;
              expect(comments[0]).to.contain.keys(
                "author",
                "article_id",
                "votes",
                "comment_id",
                "body",
                "created_at"
              );
            });
        });
        it("comments are sorted in descending created_at order by default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(res => {
              const { comments } = res.body;
              expect(comments).to.be.descendingBy("created_at");
            });
        });
        it("comments can be sorted by other columns when passed a valid column as a url sort_by query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(res => {
              const { comments } = res.body;
              expect(comments).to.be.descendingBy("votes");
            });
        });
        it("comments can be ordered differently when passed an order query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes&order=asc")
            .expect(200)
            .then(res => {
              const { comments } = res.body;
              expect(comments).to.be.ascendingBy("votes");
            });
        });
        it("400 Bad Request when passed an invalid order", () => {
          return request(app)
            .get("/api/articles/1/comments?order=NOTANORDER")
            .expect(400)
            .then(res => {
              const { msg } = res.body;
              expect(msg).to.equal(`Bad Request`);
            });
        });
        it("invalid sort_by query sent returns 400", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=NONSENSE")
            .expect(400)
            .then(res => {
              const { msg } = res.body;
              expect(msg).to.equal(`column "NONSENSE" does not exist`);
            });
        });
      });
    });
    describe("/comments/:comment_id", () => {
      it("PATCH status 200 responds with updated comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 100 })
          .expect(200)
          .then(response => {
            const { comment } = response.body;
            expect(comment).to.eql({
              comment_id: 1,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              author: "butter_bridge",
              votes: 116,
              article_id: 9,
              created_at: "2017-11-22T12:36:03.389Z" //1970-01-01T00:00:00Z
            });
          });
      });
      it("PATCH a valid comment_id that is not taken e.g 9999 returns 404 and error msg", () => {
        return request(app)
          .patch("/api/comments/9999")
          .send({ inc_votes: 100 })
          .expect(404)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal(`No comment found for comment_id: 9999`);
          });
      });
      it("PATCH an invalid comment_id returns 400 and error msg", () => {
        return request(app)
          .patch("/api/comments/invalidID")
          .send({ inc_votes: 100 })
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal(
              `invalid input syntax for integer: "invalidID"`
            );
          });
      });
      it("PATCH with invalid body data returns 400 Bad Request", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "NotAValidNumber" })
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal("Bad Request");
          });
      });
      it("PATCH with empty body data returns 200 ", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({})
          .expect(200)
          .then(response => {
            const { comment } = response.body;
            expect(comment).to.eql({
              comment_id: 1,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              author: "butter_bridge",
              votes: 16,
              article_id: 9,
              created_at: "2017-11-22T12:36:03.389Z" //1970-01-01T00:00:00Z
            });
          });
      });
      it("PATCH with invalid body data returns 400 Bad Request", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "NOTVALID" })
          .expect(400)
          .then(response => {
            const { msg } = response.body;
            expect(msg).to.equal(`Bad Request`);
          });
      });
      it("DELETE returns 204 with no content", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
      it("DELETE with comment_id not taken returns 404", () => {
        return request(app)
          .delete("/api/comments/1000")
          .expect(404);
      });
      it("DELETE with invalid comment_id returns 400", () => {
        return request(app)
          .delete("/api/comments/NotAnId")
          .expect(400);
      });
    });
  });
});
