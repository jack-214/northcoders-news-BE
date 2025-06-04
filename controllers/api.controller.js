const {
  fetchEndpoints,
  fetchTopics,
  fetchArticles,
  fetchUsers,
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
