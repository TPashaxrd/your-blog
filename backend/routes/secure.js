const express = require("express")
const authMiddleware = require("../middleware/Auth")

const router = express.Router()

router.post("/login", authMiddleware, (req, res) => {
  res.json({ success: true, message: "Logged in successfully" });
});

module.exports = router