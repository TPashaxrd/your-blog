const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Comments", CommentSchema);