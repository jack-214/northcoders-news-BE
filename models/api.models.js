const endpoints = require("../endpoints.json");
const db = require("../db/connection");

exports.fetchEndpoints = () => {
  return Promise.resolve(endpoints);
};

exports.fetchTopics = () => {
  return db
    .query(`SELECT slug, description FROM topics;`)
    .then(({ rows }) => rows);
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
    .then(({ rows }) => rows);
};

exports.fetchUsers = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users;`)
    .then(({ rows }) => rows);
};
