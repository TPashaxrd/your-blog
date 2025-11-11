const express = require("express")
const { createContact, showAllContacts } = require("../controllers/Contact")
const { contactLimiter } = require("../middlewares/rateLimiter")

const router = express.Router()

router.post("/", contactLimiter, createContact)
router.get("/", contactLimiter, showAllContacts)

module.exports = router