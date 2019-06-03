process.env.NODE_ENV = "test";
const { expect } = require("chai");
const formatArticles = require("../utils/index");

describe("/utils", () => {
  describe("formatArticles", () => {
    it("should return a new empty array when given an empty array", () => {
      const actual = formatArticles([]);
      const expected = [];
      expect(actual).to.not.equal(expected);
      expect(actual).to.eql(expected);
    });
    it("should format 1 date correctly", () => {
      const actual = formatArticles([
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        }
      ]);
      const expected = [
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "Thu Nov 15 2018 12:21:54 GMT+0000 (Greenwich Mean Time)",
          votes: 100
        }
      ];
      expect(actual[0]).to.not.equal(expected[0]);
      expect(actual).to.eql(expected);
    });
    it("should format multiple dates correctly", () => {
      const actual = formatArticles([
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        },
        {
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell.",
          created_at: 1416140514171
        }
      ]);
      const expected = [
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "Thu Nov 15 2018 12:21:54 GMT+0000 (Greenwich Mean Time)",
          votes: 100
        },
        {
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell.",
          created_at: "Sun Nov 16 2014 12:21:54 GMT+0000 (Greenwich Mean Time)"
        }
      ];
      expect(actual[0]).to.not.equal(expected[0]);
      expect(actual).to.eql(expected);
    });
  });
});
