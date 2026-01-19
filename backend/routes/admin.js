const express = require("express")
const authMiddleware = require("../middlewares/Auth");
const { authLimiter } = require("../middlewares/rateLimiter");
const { showAllContacts, deleteContactById } = require("../controllers/Contact");
const { showSubs, deleteSubs } = require("../controllers/Subscribes");
const System = require("../models/System");
const User = require("../models/User");

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


router.post("/login", authLimiter, authMiddleware, (req, res) => {
  res.json({ success: true, message: "Logged in successfully" });
});

router.post("/admin/all-contacts", authMiddleware, showAllContacts)
router.post("/admin/all-subs", authMiddleware, showSubs)
router.delete("/admin/delete-subs", authMiddleware, deleteSubs)
router.delete("/admin/delete-contact", authMiddleware, deleteContactById)
router.post("/admin/make-admin", authMiddleware, makeAdminByEmail);
router.get("/admin/system-status", getSystemStatus);
router.post("/admin/toggle-system", authMiddleware, toggleSystemMode);

module.exports = router