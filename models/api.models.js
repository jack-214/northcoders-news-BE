const endpoints = require("../endpoints.json");
const db = require("../db/connection");

exports.fetchEndpoints = () => {
  return Promise.resolve(endpoints);
};

exports.fetchTopics = () => {
  return db.query(`SELECT slug, description FROM topics;`).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Topics not found" });
    }
    return rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT
        a.author,
        a.title,
        a.article_id,
        a.topic,
        a.created_at,
        a.votes,
        a.article_img_url,
        COUNT(c.comment_id)::INT AS comment_count 
    FROM articles a
    LEFT JOIN comments c ON c.article_id = a.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;`
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Articles not found" });
      }
      return rows;
    });
};

exports.fetchUsers = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users;`)
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Users not found" });
      }
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article ID" });
  }
  return db
    .query(
      `SELECT author,
        title,
        article_id,
        body, topic,
        created_at,
        votes,
        article_img_url
        FROM articles WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article ID" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return db
        .query(
          `SELECT comment_id,
        votes,
        created_at,
        author,
        body,
        article_id
        FROM comments WHERE article_id = $1;`,
          [article_id]
        )
        .then(({ rows }) => {
          if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Comments not found" });
          }
          return rows;
        });
    });
};
