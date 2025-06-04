const express = require("express");
const {
  getEndpoints,
  getTopics,
  getArticles,
  getUsers,
  getArticleById,
} = require("./controllers/api.controller");

const app = express();

app.use(express.json());

app.get("/api/", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);

module.exports = app;
