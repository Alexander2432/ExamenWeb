const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const {
  createAdminSchedule,
  getAdminBookings,
} = require("../controllers/adminController");

const router = Router();

router.post("/schedules", authenticateToken, createAdminSchedule);
router.get("/bookings", authenticateToken, getAdminBookings);

module.exports = router;
