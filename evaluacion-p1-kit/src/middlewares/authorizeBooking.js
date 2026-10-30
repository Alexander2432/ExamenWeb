const { findBookingById } = require("../services/bookingService");

async function authorizeBooking(req, res, next) {
  const idText = req.params.id;
  if (!/^\d+$/.test(idText)) {
    return res.status(404).json({ error: "Booking not found" });
  }

  try {
    const booking = await findBookingById(Number(idText));
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (req.user?.role !== "ADMIN" && booking.userId !== req.user?.id) {
      return res.status(403).json({ error: "Forbidden: not your booking" });
    }

    req.booking = booking;
    return next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = authorizeBooking;
