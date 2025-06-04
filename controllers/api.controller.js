const {
  fetchEndpoints,
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticleById,
  fetchCommentsByArticleId,
} = require("../models/api.models");

exports.getEndpoints = (req, res) => {
  fetchEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticles = (req, res) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getArticleById = (req, res) => {
  const { article_id } = req.params;
  fetchArticleById(article_id).then((article) => {
    res.status(200).send({ article });
  });
};

exports.getCommentsByArticleId = (req, res) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id).then((comments) => {
    res.status(200).send({ comments });
  });
};
