const express = require("express");
const router = express.Router();

const {
  createComment,
  getPostComments,
  deleteComment
} = require("../controllers/Comment");

router.post("/:postId/comment", createComment);
router.get("/:postId/comments", getPostComments);
router.delete("/comment/:commentId", deleteComment);

module.exports = router;