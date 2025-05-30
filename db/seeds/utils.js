const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arrayOfObjects, key, value) => {
  return Object.fromEntries(
    arrayOfObjects.map((object) => [object[key], object[value]])
  );
};

exports.formatComments = (comments, articleRef) => {
  return comments.map((comment) => {
    const { article_title, ...rest } = comment;
    return { ...rest, article_id: articleRef[article_title] };
  });
};
