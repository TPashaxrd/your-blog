const express = require("express")
const authMiddleware = require("../middlewares/Auth");
const { authLimiter } = require("../middlewares/rateLimiter");

const router = express.Router()

router.post("/login", authLimiter, authMiddleware, (req, res) => {
  res.json({ success: true, message: "Logged in successfully" });
});

module.exports = router