const {
  fetchEndpoints,
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleVotes,
} = require("../models/api.models");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const commentData = req.body;
  insertCommentByArticleId(article_id, commentData)
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch(next);
};

exports.patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const voteData = req.body;
  updateArticleVotes(article_id, voteData)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};
