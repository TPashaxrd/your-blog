const express = require("express")
const { beSubs, showSubs } = require("../controllers/Subscribes")
const checkIPMiddleware = require("../middleware/IPCheck")

const router = express.Router()

router.post("/", beSubs)
router.get("/", checkIPMiddleware, showSubs)

module.exports = router