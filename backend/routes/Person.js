const express = require("express")

const router = express.Router()

const { CreatePerson, getAllPersons, getPersonById, deletePersonById } = require("../controllers/Person")
const { authMiddleware } = require("../middlewares/adminAuth")

router.post("/create", authMiddleware, CreatePerson)
router.post("/get-all-persons", authMiddleware, getAllPersons)
router.post("/get-person-by-id", authMiddleware, getPersonById)
router.post("/delete-person-by-id", authMiddleware, deletePersonById)

module.exports = router