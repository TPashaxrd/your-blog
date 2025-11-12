const express = require("express")
const { createNote, readNote } = require("../controllers/note")
const { noteLimiter } = require("../middlewares/rateLimiter")
const router = express.Router()

router.post("/create", noteLimiter, createNote)
router.post("/:id", noteLimiter, readNote)

module.exports = router