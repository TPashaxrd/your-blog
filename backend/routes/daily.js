const express = require("express");
const { generalLimiter } = require("../middlewares/rateLimiter");
const router = express.Router();

const quotes = [
  "Discipline beats motivation.",
  "Consistency is the real superpower.",
  "You grow when you show up every day.",
  "Small progress is still progress.",
  "Work in silence, let results talk."
];

const tips = [
  "Focus on one task at a time.",
  "Write code even if it's messy.",
  "Ship something today.",
  "Learn by building, not watching.",
  "Done is better than perfect."
];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

router.get("/", generalLimiter, (req, res) => {
  res.json({
    quote: random(quotes),
    tip: random(tips),
  });
});

module.exports = router;