const db = require("../connection");
const format = require("pg-format");
const {
  convertTimestampToDate,
  createArticleRefByTitle,
  formatComments,
} = require("./utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  await db.query(`CREATE TABLE topics (
    slug VARCHAR(60) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    img_url VARCHAR(1000) NOT NULL
    );
  `);
  await db.query(`
    CREATE TABLE users (
    username VARCHAR(60) PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    avatar_url VARCHAR(1000) NOT NULL
    );
  `);
  await db.query(`
    CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(60) REFERENCES topics(slug) NOT NULL,
    author VARCHAR(60) REFERENCES users(username) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000) NOT NULL
    );
  `);
  await db.query(`
    CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id) NOT NULL,
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR(60) REFERENCES users(username) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const topicInsertQueryStr = format(
    `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
    topicData.map(({ slug, description, img_url }) => [
      slug,
      description,
      img_url,
    ])
  );
  await db.query(topicInsertQueryStr);

  const userInsertQueryStr = format(
    `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
    userData.map(({ username, name, avatar_url }) => [
      username,
      name,
      avatar_url,
    ])
  );
  await db.query(userInsertQueryStr);

  const formattedArticles = articleData.map(convertTimestampToDate);
  const articleInsertQueryStr = format(
    `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
    formattedArticles.map(
      ({ title, topic, author, body, created_at, votes, article_img_url }) => [
        title,
        topic,
        author,
        body,
        created_at,
        votes,
        article_img_url,
      ]
    )
  );
  const { rows: insertedArticles } = await db.query(articleInsertQueryStr);

  const dateformattedComments = commentData.map(convertTimestampToDate);
  const articleTitleRef = createArticleRefByTitle(
    insertedArticles,
    "title",
    "article_id"
  );
  const formattedComments = formatComments(
    dateformattedComments,
    articleTitleRef
  );
  const commentInsertQueryStr = format(
    `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`,
    formattedComments.map(({ article_id, body, votes, author, created_at }) => [
      article_id,
      body,
      votes,
      author,
      created_at,
    ])
  );
  await db.query(commentInsertQueryStr);
};

module.exports = seed;
