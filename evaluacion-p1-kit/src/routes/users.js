const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const authorizeUser = require("../middlewares/authorizeUser");
const { getBookingsByUser } = require("../controllers/userController");

const router = Router();

router.get("/:id/bookings", authenticateToken, authorizeUser, getBookingsByUser);

module.exports = router;
