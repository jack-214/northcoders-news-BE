const endpoints = require("../endpoints.json");
const db = require("../db/connection");

exports.fetchEndpoints = () => {
  return Promise.resolve(endpoints);
};

exports.fetchTopics = () => {
  return db.query(`SELECT slug, description FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrders = ["asc", "desc"];

  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort column" });
  }
  if (!validOrders.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryStr = `
    SELECT
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
  `;

  const queryValues = [];

  if (topic) {
    queryStr += ` WHERE a.topic = $1 `;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY a.article_id ORDER BY a.${sort_by} ${order.toUpperCase()}`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length > 0) return rows;

    if (topic) {
      return db
        .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
        .then(({ rows: topicRows }) => {
          if (topicRows.length === 0) {
            return Promise.reject({ status: 404, msg: "Topic not found" });
          } else {
            return [];
          }
        });
    }

    return [];
  });
};

exports.fetchUsers = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users;`)
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article ID" });
  }
  return db
    .query(
      `SELECT a.author,
        a.title,
        a.article_id,
        a.body,
        a.topic,
        a.created_at,
        a.votes,
        a.article_img_url,
        COUNT(c.comment_id)::INT AS comment_count
        FROM articles a
        LEFT JOIN comments c ON a.article_id = c.article_id
        WHERE a.article_id = $1
        GROUP BY a.article_id;`,
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
          return rows;
        });
    });
};

exports.insertCommentByArticleId = (article_id, commentData) => {
  const { username, body } = commentData;
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article ID" });
  }
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Missing required fields" });
  }

  return db
    .query(
      `INSERT INTO comments (author, body, article_id)
        VALUES ($1, $2, $3)
        RETURNING comment_id, author, body, article_id, votes, created_at;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleVotes = (article_id, voteData) => {
  const { inc_votes } = voteData;
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid article ID" });
  }
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid vote increment" });
  }
  if (inc_votes === undefined) {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ statis: 404, msg: "Article not found" });
        }
        return rows[0];
      });
  }
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

exports.removeCommentByCommentId = (comment_id) => {
  if (isNaN(comment_id)) {
    return Promise.reject({ status: 400, msg: "Invalid comment ID" });
  }
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows[0];
    });
};
