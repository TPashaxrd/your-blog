const express = require("express")
const path = require("path")
const fs = require("fs")
const multer = require("multer")
const { createPost, showPosts, showPostBySlug, incrementViews, deletePosts } = require("../controllers/Post")
const checkIPMiddleware = require("../middlewares/IPCheck")
const Post = require("../models/Post")
const router = express.Router()

const uploadDir = path.join(__dirname, "../uploads")
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, Date.now() + ext);
        },
      });
      const upload = multer({ storage });

router.post('/', upload.single("cover"), checkIPMiddleware, createPost)
router.delete("/", checkIPMiddleware, deletePosts)
router.get("/", showPosts)
router.get("/related", async (req, res) => {
  const { category, exclude } = req.query;
  try {
    const posts = await Post.find({
      category,
      _id: { $ne: exclude }
    }).limit(4);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch related posts" });
  }
});

router.get("/:slug", showPostBySlug)
router.patch("/:slug/view", incrementViews)

module.exports = router