const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleVotes,
  removeCommentByCommentId,
} = require("../models/api.models");
const path = require("path");

exports.getEndpoints = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchArticles(sort_by, order, topic)
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

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentId(comment_id)
    .then((comment) => {
      res.status(204).send();
    })
    .catch(next);
};
