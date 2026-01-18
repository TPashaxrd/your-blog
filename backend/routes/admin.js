const express = require("express")
const authMiddleware = require("../middlewares/Auth");
const { authLimiter } = require("../middlewares/rateLimiter");
const { showAllContacts, deleteContactById } = require("../controllers/Contact");
const { showSubs, deleteSubs } = require("../controllers/Subscribes");
const System = require("../models/System");

const router = express.Router()

const getSystemStatus = async (req, res) => {
    try {
        let status = await System.findOne();
        if (!status) status = await System.create({ systemMode: true });
        res.json(status);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleSystemMode = async (req, res) => {
    try {
        let status = await System.findOne();
        if (!status) {
            status = await System.create({ systemMode: false });
        } else {
            status.systemMode = !status.systemMode;
            await status.save();
        }
        res.json({ success: true, systemMode: status.systemMode });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

router.post("/login", authLimiter, authMiddleware, (req, res) => {
  res.json({ success: true, message: "Logged in successfully" });
});

router.post("/admin/all-contacts", authMiddleware, showAllContacts)
router.post("/admin/all-subs", authMiddleware, showSubs)
router.delete("/admin/delete-subs", authMiddleware, deleteSubs)
router.delete("/admin/delete-contact", authMiddleware, deleteContactById)

router.get("/admin/system-status", getSystemStatus);
router.post("/admin/toggle-system", authMiddleware, toggleSystemMode);

module.exports = router