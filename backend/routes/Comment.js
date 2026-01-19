const express = require("express");
const router = express.Router();

const {
  createComment,
  getPostComments,
  deleteComment
} = require("../controllers/Comment");
const { commentLimiter } = require("../middlewares/rateLimiter");

router.post("/:postId/comment", commentLimiter, createComment);
router.get("/:postId/comments", commentLimiter, getPostComments);
router.delete("/comment/:commentId", commentLimiter, deleteComment);

module.exports = router;