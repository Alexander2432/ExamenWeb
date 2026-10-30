const { createSchedule, getAllBookings } = require("../services/adminService");

const isAdmin = (req, res) => {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ error: "Forbidden: ADMIN role required" });
    return false;
  }
  return true;
};

const createAdminSchedule = async (req, res) => {
  if (!isAdmin(req, res)) return;

  const { court, startTime, endTime } = req.body || {};
  if (typeof court !== "string" || !court.trim() || !startTime || !endTime) {
    return res.status(400).json({
      error: "court, startTime y endTime son obligatorios",
    });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return res.status(400).json({ error: "Las fechas del horario no son válidas" });
  }

  try {
    const schedule = await createSchedule({
      court: court.trim(),
      startTime: start,
      endTime: end,
    });
    return res.status(201).json(schedule);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAdminBookings = async (req, res) => {
  if (!isAdmin(req, res)) return;

  try {
    const bookings = await getAllBookings();
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createAdminSchedule, getAdminBookings };
