const express = require("express");
const {
  getEndpoints,
  getTopics,
  getArticles,
} = require("./controllers/api.controller");

const app = express();

app.use(express.json());

app.get("/api/", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

module.exports = app;
