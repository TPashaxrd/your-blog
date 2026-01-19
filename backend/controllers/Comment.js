const Comment = require("../models/Comment");
const User = require("../models/User");

const createComment = async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Giriş yapmadan yorum yok" });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Yorum boş olamaz" });
    }

    const comment = await Comment.create({
      postId: req.params.postId,
      userId: req.session.userId,
      content
    });

    res.status(201).json({
      message: "Yorum eklendi",
      comment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Yorumlar alınamadı" });
  }
};

const deleteComment = async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Yetkin yok" });
    }

    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User yok" });
    }

    const isOwner = comment.userId.toString() === user._id.toString();
    const isAdmin = user.userRole === "Admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can't delete this comment." });
    }


    await comment.deleteOne();

    res.json({ message: "Yorum silindi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server patladı" });
  }
};

module.exports = {
  createComment,
  getPostComments,
  deleteComment
};
