const express = require("express")
const { CreateAuth, me, Logout, Login } = require("../controllers/Users")

const router = express.Router()

router.post("/register", CreateAuth)
router.get("/me", me)
router.post("/login", Login)
router.get("/logout", Logout)

module.exports = router