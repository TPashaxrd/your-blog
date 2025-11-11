const express = require("express")
const { beSubs, showSubs } = require("../controllers/Subscribes")
const checkIPMiddleware = require("../middlewares/IPCheck")
const { subscribeLimiter } = require("../middlewares/rateLimiter")

const router = express.Router()

router.post("/", subscribeLimiter, beSubs)
router.get("/", subscribeLimiter, checkIPMiddleware, showSubs)

module.exports = router