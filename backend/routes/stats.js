const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const authMiddleware = require("../middlewares/Auth");

router.post("/total", authMiddleware, statsController.getTotalVisits);
router.post("/unique", authMiddleware, statsController.getUniqueVisitors);
router.post("/by-ip", authMiddleware, statsController.getVisitsByIP);
router.post("/daily", authMiddleware, statsController.getDailyVisits);
router.post("/monthly", authMiddleware, statsController.getMonthlyVisits);
router.post("/all", authMiddleware, statsController.getAllStats)

module.exports = router;