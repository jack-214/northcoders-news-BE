const db = require("../connection");
const format = require("pg-format");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("./utils");

const seed = async ({
  topicData,
  userData,
  articleData,
  commentData,
  emojiData,
  emojiArticleUserData,
  userTopicsData,
  userArticleVotesData,
}) => {
  await db.query(`DROP TABLE IF EXISTS user_article_votes;`);
  await db.query(`DROP TABLE IF EXISTS user_topic;`);
  await db.query(`DROP TABLE IF EXISTS emoji_article_user;`);
  await db.query(`DROP TABLE IF EXISTS emojis;`);
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
  await db.query(`
    CREATE TABLE "emojis" (
    "emoji_id" SERIAL PRIMARY KEY,
    "emoji" VARCHAR(10) UNIQUE NOT NULL
    );
  `);
  await db.query(`
    CREATE TABLE "emoji_article_user" (
    "emoji_article_user_id" SERIAL PRIMARY KEY,
    "emoji_id" INT REFERENCES emojis(emoji_id) NOT NULL,
    "username" VARCHAR(60) REFERENCES users(username) NOT NULL,
    "article_id" INT REFERENCES articles(article_id) NOT NULL
    );
  `);
  await db.query(`
    CREATE TABLE "user_topic" (
    "user_topic_id" SERIAL PRIMARY KEY,
    "username" VARCHAR(60) REFERENCES users(username) NOT NULL,
    "topic" VARCHAR(60) REFERENCES topics(slug) NOT NULL
    );
  `);
  await db.query(`
    CREATE TABLE "user_article_votes" (
    "user_article_votes_id" SERIAL PRIMARY KEY,
    "username" VARCHAR(60) REFERENCES users(username) NOT NULL,
    "article_id" INT REFERENCES articles(article_id) NOT NULL,
    "vote_count" INT NOT NULL
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
  const articleTitleRef = createRef(insertedArticles, "title", "article_id");
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

  const emojiInsertQueryStr = format(
    `INSERT INTO emojis (emoji) VALUES %L RETURNING *;`,
    emojiData.map(({ emoji }) => [emoji])
  );
  await db.query(emojiInsertQueryStr);

  const emojiArticleUserQueryStr = format(
    `INSERT INTO emoji_article_user (emoji_id, username, article_id) VALUES %L RETURNING *;`,
    emojiArticleUserData.map(({ emoji_id, username, article_id }) => [
      emoji_id,
      username,
      article_id,
    ])
  );
  await db.query(emojiArticleUserQueryStr);

  const userTopicQueryStr = format(
    `INSERT INTO user_topic (username, topic) VALUES %L RETURNING *;`,
    userTopicsData.map(({ username, topic }) => [username, topic])
  );
  await db.query(userTopicQueryStr);

  const userArticleVotesQueryStr = format(
    `INSERT INTO user_article_votes (username, article_id, vote_count) VALUES %L RETURNING *;`,
    userArticleVotesData.map(({ username, article_id, vote_count }) => [
      username,
      article_id,
      vote_count,
    ])
  );
  await db.query(userArticleVotesQueryStr);
};

module.exports = seed;
