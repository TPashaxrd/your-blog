const express = require("express")
const { createNote, readNote } = require("../controllers/note")
const router = express.Router()

router.post("/create", createNote)
router.post("/:id", readNote)

module.exports = router