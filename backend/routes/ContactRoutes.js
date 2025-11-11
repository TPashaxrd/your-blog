const express = require("express")
const { createContact } = require("../controllers/Contact")
const { contactLimiter } = require("../middlewares/rateLimiter")

const router = express.Router()

router.post("/", contactLimiter, createContact)

module.exports = router