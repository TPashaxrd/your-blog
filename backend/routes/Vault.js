const express = require("express")
const authMiddleware = require("../middlewares/Auth");
const { CreateVault, getVault, getVaultBySearch, deleteVaultById } = require("../controllers/Vault");


const router = express.Router()

router.post("/", authMiddleware, CreateVault)
router.post("/get", authMiddleware, getVault)
router.post("/search", authMiddleware, getVaultBySearch)
router.post("/delete", authMiddleware, deleteVaultById)

module.exports = router