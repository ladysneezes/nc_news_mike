process.env.NODE_ENV = "test";
const { expect } = require("chai");
const {
  timestampToDate,
  renameKeys,
  linkKeys,
  createLookupObj
} = require("../utils/index");

describe("/utils", () => {
  describe("timestampToDate", () => {
    it("should return a new empty array when given an empty array", () => {
      const actual = timestampToDate([]);
      const expected = [];
      expect(actual).to.not.equal(expected);
      expect(actual).to.eql(expected);
    });
    it("should format 1 date correctly", () => {
      const actual = timestampToDate([
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
      const actual = timestampToDate([
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
  describe("renameKeys", () => {
    it("returns a new empty array, when passed an empty array", () => {
      const comments = [];
      const keyToChange = "";
      const newKey = "";
      const actual = renameKeys(comments, keyToChange, newKey);
      const expected = [];
      expect(actual).to.eql(expected);
      expect(actual).to.not.equal(comments);
    });
    it("returns an updated array when given a key to change, with a single object in the array", () => {
      const comments = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to: "They're not exactly dogs, are they?",
          created_by: "butter_bridge",
          votes: 16,
          created_at: 1511354163389
        }
      ];
      const keyToChange = "created_by";
      const newKey = "author";
      const actual = renameKeys(comments, keyToChange, newKey);
      const expected = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to: "They're not exactly dogs, are they?",
          author: "butter_bridge",
          votes: 16,
          created_at: 1511354163389
        }
      ];
      expect(actual).to.eql(expected);
    });
    it("returns an updated array when given a key to change with multiple options in the array", () => {
      const comments = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to: "They're not exactly dogs, are they?",
          created_by: "butter_bridge",
          votes: 16,
          created_at: 1511354163389
        },
        {
          body:
            "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          belongs_to: "Living in the shadow of a great man",
          created_by: "butter_bridge",
          votes: 14,
          created_at: 1479818163389
        },
        {
          body:
            "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
          belongs_to: "Living in the shadow of a great man",
          created_by: "icellusedkars",
          votes: 100,
          created_at: 1448282163389
        },
        {
          body: " I carry a log — yes. Is it funny to you? It is not to me.",
          belongs_to: "Living in the shadow of a great man",
          created_by: "icellusedkars",
          votes: -100,
          created_at: 1416746163389
        },
        {
          body: "I hate streaming noses",
          belongs_to: "Living in the shadow of a great man",
          created_by: "icellusedkars",
          votes: 0,
          created_at: 1385210163389
        }
      ];
      const keyToChange = "created_by";
      const newKey = "author";
      const actual = renameKeys(comments, keyToChange, newKey);
      const expected = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to: "They're not exactly dogs, are they?",
          author: "butter_bridge",
          votes: 16,
          created_at: 1511354163389
        },
        {
          body:
            "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          belongs_to: "Living in the shadow of a great man",
          author: "butter_bridge",
          votes: 14,
          created_at: 1479818163389
        },
        {
          body:
            "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
          belongs_to: "Living in the shadow of a great man",
          author: "icellusedkars",
          votes: 100,
          created_at: 1448282163389
        },
        {
          body: " I carry a log — yes. Is it funny to you? It is not to me.",
          belongs_to: "Living in the shadow of a great man",
          author: "icellusedkars",
          votes: -100,
          created_at: 1416746163389
        },
        {
          body: "I hate streaming noses",
          belongs_to: "Living in the shadow of a great man",
          author: "icellusedkars",
          votes: 0,
          created_at: 1385210163389
        }
      ];
      expect(actual).to.eql(expected);
    });
  });
  describe("createLookupObj", () => {
    it("creates a lookupObject when given the two keys to lookup with 1 object", () => {
      const inputArr = [
        {
          article_id: 36,
          title: "The vegan carnivore?",
          body:
            "The chef Richard McGeown has faced bigger culinary challenges.",
          votes: 0,
          topic: "cooking",
          author: "tickle122",
          created_at: "2017 - 04 - 14T09: 56: 23.248Z"
        }
      ];
      const keyName = "title";
      const valueName = "article_id";
      const expectedOutput = { "The vegan carnivore?": 36 };
      const actualOutput = createLookupObj(inputArr, keyName, valueName);
      expect(actualOutput).to.eql(expectedOutput);
    });
    it("creates a lookupObject when given the two keys to lookup with multiple objects", () => {
      const inputArr = [
        {
          article_id: 36,
          title: "The vegan carnivore?",
          body:
            "The chef Richard McGeown has faced bigger culinary challenges.",
          votes: 0,
          topic: "cooking",
          author: "tickle122",
          created_at: "2017 - 04 - 14T09: 56: 23.248Z"
        },
        {
          article_id: 34,
          title: "The Notorious MSG’s Unlikely Formula For Success",
          body: "The 'umami' craze.",
          votes: 0,
          topic: "cooking",
          author: "grumpy19",
          created_at: "2017 - 08 - 16T22: 08: 30.430Z"
        }
      ];
      const keyName = "title";
      const valueName = "article_id";
      const expectedOutput = {
        "The vegan carnivore?": 36,
        "The Notorious MSG’s Unlikely Formula For Success": 34
      };
      const actualOutput = createLookupObj(inputArr, keyName, valueName);
      expect(actualOutput).to.eql(expectedOutput);
    });
  });
  describe("linkKeys", () => {
    it("returns a new empty array, when passed an empty array", () => {
      const comments = [];
      const keyLookup = {};
      const actual = linkKeys(comments, keyLookup);
      const expected = [];
      expect(actual).to.eql(expected);
      expect(actual).to.not.equal(comments);
    });
    it("replaces one key with id when given one lookup value", () => {
      const comments = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to: "They're not exactly dogs, are they?",
          created_by: "butter_bridge",
          votes: 16,
          created_at: 1511354163389
        }
      ];
      const lookup = { "They're not exactly dogs, are they?": 69 };
      const oldKeyName = "belongs_to";
      const newKeyName = "article_id";
      const actual = linkKeys(comments, lookup, oldKeyName, newKeyName);
      const expected = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 69,
          created_by: "butter_bridge",
          votes: 16,
          created_at: 1511354163389
        }
      ];
      expect(actual).to.eql(expected);
    });
    it("replaces multiple artist names with ids when given multiple lookup values", () => {
      const comments = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to: "They're not exactly dogs, are they?",
          created_by: "butter_bridge",
          votes: 16,
          created_at: 1511354163389
        },
        {
          body: "The beautiful thing about treasure is that it exists.",
          belongs_to: "Living in the shadow of a great man",
          created_by: "butter_bridge",
          votes: 14,
          created_at: 1479818163389
        }
      ];
      const lookup = {
        "They're not exactly dogs, are they?": 69,
        "Living in the shadow of a great man": 42
      };
      const oldKeyName = "belongs_to";
      const newKeyName = "article_id";
      const actual = linkKeys(comments, lookup, oldKeyName, newKeyName);
      const expected = [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 69,
          created_by: "butter_bridge",
          votes: 16,
          created_at: 1511354163389
        },
        {
          body: "The beautiful thing about treasure is that it exists.",
          article_id: 42,
          created_by: "butter_bridge",
          votes: 14,
          created_at: 1479818163389
        }
      ];
      expect(actual).to.eql(expected);
    });
  });
});
