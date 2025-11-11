const express = require("express")
const authMiddleware = require("../middlewares/Auth");
const { authLimiter } = require("../middlewares/rateLimiter");
const { showAllContacts, deleteContactById } = require("../controllers/Contact");
const { showSubs, deleteSubs } = require("../controllers/Subscribes");

const router = express.Router()

router.post("/login", authLimiter, authMiddleware, (req, res) => {
  res.json({ success: true, message: "Logged in successfully" });
});

router.post("/admin/all-contacts", authMiddleware, showAllContacts)
router.post("/admin/all-subs", authMiddleware, showSubs)
router.delete("/admin/delete-subs", authMiddleware, deleteSubs)
router.delete("/admin/delete-contact", authMiddleware, deleteContactById)

module.exports = router