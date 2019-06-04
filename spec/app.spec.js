process.env.NODE_ENV = "test";

const { expect } = require("chai");
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
          expect(body.ok).to.equal(true); //<<expect here is from chain
        });
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
    describe("/users", () => {
      describe("/:username", () => {
        it("GET status 200 returns user", () => {
          return request(app)
            .get("/api/users/icellusedkars")
            .expect(200)
            .then(({ body }) => {
              expect(body.user).to.be.an("array");
              expect(body.user[0]).to.contain.keys(
                "username",
                "avatar_url",
                "name"
              );
              expect(body.user[0].username).to.equal("icellusedkars");
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
  });
});
