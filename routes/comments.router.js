const commentsRouter = require("express").Router();

const { deleteCommentByCommentId } = require("../controllers/api.controller");

commentsRouter.delete("/:comment_id", deleteCommentByCommentId);

module.exports = commentsRouter;
