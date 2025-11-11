const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.get("/total", statsController.getTotalVisits);
router.get("/unique", statsController.getUniqueVisitors);
router.get("/by-ip", statsController.getVisitsByIP);
router.get("/daily", statsController.getDailyVisits);
router.get("/monthly", statsController.getMonthlyVisits);
router.get("/all", statsController.getAllStats)

module.exports = router;