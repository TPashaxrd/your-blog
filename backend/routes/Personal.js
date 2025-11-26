const express = require("express")
const { CreatePersonal, getAllPersonals, deletePersonalById, getPersonalById } = require("../controllers/Personal")
const { authMiddleware } = require("../middlewares/adminAuth")

const router = express.Router()

router.post("/create", authMiddleware, CreatePersonal)
router.post("/get-all-personals", authMiddleware, getAllPersonals)
router.post("/get-personal-by-id", authMiddleware, getPersonalById)
router.post("/delete-personal-by-id", authMiddleware, deletePersonalById)

module.exports = router