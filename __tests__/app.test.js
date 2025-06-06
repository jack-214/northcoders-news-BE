const endpointsJson = require("../endpoints.json");
const { toBeSortedBy } = require("jest-sorted");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api", () => {
  test("200: responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topic objects with the slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
        expect(body.topics.length).not.toBe(0);
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of article objects with author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  test("200: sorts by votes ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", { ascending: true });
      });
  });
  test("200: responds with articles with topic specified", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("400: invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort column");
      });
  });
  test("400: invalid order", () => {
    return request(app)
      .get("/api/articles?order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of user objects with username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object with author, title, body, topic, created_at, votes and article_img_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article.author).toBe("string");
        expect(typeof body.article.title).toBe("string");
        expect(typeof body.article.body).toBe("string");
        expect(typeof body.article.topic).toBe("string");
        expect(typeof body.article.created_at).toBe("string");
        expect(typeof body.article.votes).toBe("number");
        expect(typeof body.article.article_img_url).toBe("string");
      });
  });
  test("404: resopnds with not found when article does not exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400: responds with 'Invalid article id' when given a non-numeric ID", () => {
    return request(app)
      .get("/api/articles/notanum")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comment objects with comment _id, votes, created_at, author, body and article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("200: responds with an empty array when article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("400: responds with 'Invalid article id' when given a non-numeric ID", () => {
    return request(app)
      .get("/api/articles/notanum/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
      });
  });

  test("404: responds with 'Article not found' if article_id does not exits", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toMatch(/not found/i);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "Test comment" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          author: "butter_bridge",
          body: "Test comment",
          article_id: 1,
          votes: 0,
        });
      });
  });
  test("400: responds with 'Missing required fields' when body is missing", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
  test("400: responds with 'Missing required fields' when username is missing", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ body: "Test comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
  test("400: responds with 'Invalid article ID' if article_id is invalid", () => {
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send({ username: "butter_bridge", body: "Test comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
      });
  });
  test("404: responds with 'Comment could not be created' if article_id is not found", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "butter_bridge", body: "Test comment" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: increments votes and responds with updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(101);
      });
  });
  test("200: decrements votes and responds with updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(50);
      });
  });
  test("400: responds with 'Invalid vote increment' when vote is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "one" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid vote increment");
      });
  });
  test("400: responds with 'Invalid article ID' if article_id is invalid", () => {
    return request(app)
      .patch("/api/articles/invalid_id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
      });
  });
  test("404: responds with 'Article not found' if article does not exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes comment and responds with 'Comment deleted'", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("400: responds with 'Invalid comment ID' when given non-numeric value", () => {
    return request(app)
      .delete("/api/comments/notnum")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid comment ID");
      });
  });
  test("404: responds with 'Comment not found' when comment does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});
