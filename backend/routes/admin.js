const express = require("express")
const authMiddleware = require("../middlewares/Auth");
const { authLimiter, generalLimiter, adminLimiter } = require("../middlewares/rateLimiter");
const { showAllContacts, deleteContactById } = require("../controllers/Contact");
const { showSubs, deleteSubs } = require("../controllers/Subscribes");
const System = require("../models/System");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Subscribes = require("../models/Subscribes");
const Contact = require("../models/Contact");
const Post = require("../models/Post");
const Note = require("../models/Note");
const Visit = require("../models/Visit");

const router = express.Router()

const getSystemStatus = async (req, res) => {
    try {
        let status = await System.findOne();
        if (!status) status = await System.create({ systemMode: true });
        res.json(status);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleSystemMode = async (req, res) => {
    try {
        let status = await System.findOne();
        if (!status) {
            status = await System.create({ systemMode: false });
        } else {
            status.systemMode = !status.systemMode;
            await status.save();
        }
        res.json({ success: true, systemMode: status.systemMode });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const makeAdminByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email Is Necessary" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.userRole = "Admin";
    await user.save();

    res.json({
      success: true,
      message: "Yeah bro It's admin.",
      user: {
        email: user.email,
        userRole: user.userRole
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

router.post("/admin/all-users", authMiddleware, async (req, res) => {
    try {
        const allUsers = await User.find()
        res.status(201).json(allUsers)
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})

router.get("/statistics", generalLimiter, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const contactCount = await Contact.countDocuments();
        const subsCount = await Subscribes.countDocuments();
        const postCount = await Post.countDocuments();
        const noteCount = await Note.countDocuments();
        const visitCount = await Visit.countDocuments();
        const commentsCount = await Comment.countDocuments();
        res.status(201).json({
            userCount,
            contactCount,
            subsCount,
            postCount,
            noteCount,
            visitCount,
            commentsCount
        })
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})

router.post("/login", authLimiter, authMiddleware, (req, res) => {
  res.json({ success: true, message: "Logged in successfully" });
});

router.post("/admin/all-contacts", adminLimiter, authMiddleware, showAllContacts)
router.post("/admin/all-subs", adminLimiter, authMiddleware, showSubs)
router.delete("/admin/delete-subs", adminLimiter, authMiddleware, deleteSubs)
router.delete("/admin/delete-contact", adminLimiter, authMiddleware, deleteContactById)
router.post("/admin/make-admin", adminLimiter, authMiddleware, makeAdminByEmail);
router.get("/admin/system-status", adminLimiter, getSystemStatus);
router.post("/admin/toggle-system", adminLimiter, authMiddleware, toggleSystemMode);

module.exports = router