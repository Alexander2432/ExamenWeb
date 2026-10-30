const { getUserBookings } = require("../services/userService");

const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await getUserBookings(req.requestedUserId);
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getBookingsByUser };
