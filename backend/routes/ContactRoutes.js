const express = require("express")
const { createContact, showAllContacts } = require("../controllers/Contact")

const router = express.Router()

router.post("/", createContact)
router.get("/", showAllContacts)

module.exports = router