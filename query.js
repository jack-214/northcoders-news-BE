const db = require("./db/connection");

const runQueries = async () => {
  const users = await db.query(`SELECT * FROM users;`);
  //console.log("Users:", users.rows);

  const codingArticles = await db.query(
    `SELECT * FROM articles WHERE topic = 'coding';`
  );
  //console.log("Aritcles about coding", codingArticles.rows);

  const negativeVotes = await db.query(
    `SELECT * FROM comments WHERE votes < 0;`
  );
  //console.log("Negative comments:", negativeVotes.rows);

  const topics = await db.query(`SELECT * FROM topics;`);
  // console.log("Topics:", topics.rows);

  const grumpyArticles = await db.query(
    `SELECT * FROM articles WHERE author = 'grumpy19';`
  );
  // console.log("grumpy19 articles:", grumpyArticles.rows);

  const goodComments = await db.query(
    `SELECt * FROM comments WHERE votes > 10;`
  );
  // console.log("Comments with > 10 votes:", goodComments.rows);
};

runQueries();
