process.env.NODE_ENV = "test";
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-sorted"));
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe.only("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/api", () => {
    it("GET status:200", () => {
      return request(app) //<<request here is the supertest object
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true); //<<expect here is from chai
        });
    });

    describe("/topics", () => {
      it("GET status 200 returns all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.contain.keys("description", "slug");
          });
      });
    });
    describe("/users", () => {
      describe("/:username", () => {
        it("GET status 200 returns user", () => {
          return request(app)
            .get("/api/users/icellusedkars")
            .expect(200)
            .then(({ body }) => {
              expect(body.user).to.be.an("object");
              expect(body.user).to.contain.keys(
                "username",
                "avatar_url",
                "name"
              );
              expect(body.user.username).to.equal("icellusedkars");
            });
        });
        it("GET for an unfound username - status:404 and error message", () => {
          return request(app)
            .get("/api/users/notAnID")
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal(
                `No user found for username: notAnID`
              );
              expect(response.statusCode).to.equal(404);
            });
        });
      });
    });
    describe("/articles", () => {
      describe("/:article_id", () => {
        it("GET status 200 returns article", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.be.an("object");
              expect(body.article).to.contain.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
              expect(body.article).to.eql({
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
              expect(response.body.msg).to.equal(
                `No article found for article_id: 9999`
              );
              expect(response.statusCode).to.equal(404);
            });
        });
        it("GET an invalid article_id returns 400 and error msg", () => {
          return request(app)
            .get("/api/articles/invalidID")
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request");
            });
        });
        it("PATCH status 201 responds with updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 22 })
            .expect(201)
            .then(response => {
              expect(response.body.article).to.eql({
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
              expect(response.body.msg).to.equal(
                `No article found for article_id: 9999`
              );
              expect(response.statusCode).to.equal(404);
            });
        });
        it("PATCH an invalid article_id returns 400 and error msg", () => {
          return request(app)
            .patch("/api/articles/invalidID")
            .send({ inc_votes: 22 })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request");
            });
        });
        it("PATCH with invalid body data returns 400 Bad Request", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request");
            });
        });
        it("PATCH with invalid body data returns 400 Bad Request", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "NOTVALID" })
            .expect(400)
            .then(response => {
              expect(response.body.msg).to.equal("Bad Request");
            });
        });
        describe("/comments", () => {
          it("POST status 201 responds with comment data", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ username: "icellusedkars", body: "BARF!!!!!!" })
              .expect(201)
              .then(response =>
                expect(response.body.comment).to.contain.keys(
                  "author",
                  "article_id",
                  "votes",
                  "comment_id",
                  "body",
                  "created_at"
                )
              );
          });
          it("GET status 200 responds with comment data", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(response =>
                expect(response.body.comments[0]).to.contain.keys(
                  "author",
                  "article_id",
                  "votes",
                  "comment_id",
                  "body",
                  "created_at"
                )
              );
          });
          it("comments are sorted in descending created_at order by default", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(res => {
                expect(res.body.comments).to.be.descendingBy("created_at");
              });
          });
          it("comments can be sorted by other columns when passed a valid column as a url sort_by query", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes")
              .expect(200)
              .then(res => {
                expect(res.body.comments).to.be.descendingBy("votes");
              });
          });
          it("comments can be ordered differently when passed an order query", () => {
            return request(app)
              .get("/api/articles/1/comments?order=asc")
              .expect(200)
              .then(res => {
                expect(res.body.comments).to.be.ascendingBy("created_by");
              });
          });
        });
      });
    });
  });
});
