const express = require("express")
const { CreatePrivate, getAllPrivates, deletePrivate, getPrivateWithId } = require("../controllers/Private")
const authMiddleware = require("../middlewares/Auth")

const router = express.Router()

router.post("/create", authMiddleware, CreatePrivate)
router.post("/get-all", authMiddleware, getAllPrivates)
router.post("/delete", authMiddleware, deletePrivate)
router.post("/get-private-by-id", authMiddleware, getPrivateWithId)

module.exports = router