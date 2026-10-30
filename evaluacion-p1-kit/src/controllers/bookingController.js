const {
  findBookingByDateAndSchedule,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../services/bookingService");

const parseBookingInput = (body) => {
  const date = new Date(body?.date);
  const scheduleId = Number(body?.scheduleId);
  if (
    !body?.date ||
    Number.isNaN(date.getTime()) ||
    !Number.isInteger(scheduleId) ||
    scheduleId < 1
  ) {
    return null;
  }
  return { date, scheduleId };
};

const create = async (req, res) => {
  const input = parseBookingInput(req.body);
  if (!input) {
    return res.status(400).json({ error: "date y scheduleId válidos son obligatorios" });
  }

  try {
    const occupied = await findBookingByDateAndSchedule(
      input.date,
      input.scheduleId,
    );
    if (occupied) {
      return res.status(400).json({ error: "El horario ya está ocupado" });
    }

    const booking = await createBooking({
      ...input,
      userId: req.user.id,
    });
    return res.status(201).json(booking);
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(400).json({ error: "scheduleId no existe" });
    }
    return res.status(500).json({ error: error.message });
  }
};

const getById = (req, res) => {
  return res.status(200).json(req.booking);
};

const update = async (req, res) => {
  const input = parseBookingInput(req.body);
  if (!input) {
    return res.status(400).json({ error: "date y scheduleId válidos son obligatorios" });
  }

  try {
    const occupied = await findBookingByDateAndSchedule(
      input.date,
      input.scheduleId,
      req.booking.id,
    );
    if (occupied) {
      return res.status(400).json({ error: "El horario ya está ocupado" });
    }

    const booking = await updateBooking(req.booking.id, input);
    return res.status(200).json(booking);
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(400).json({ error: "scheduleId no existe" });
    }
    return res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await deleteBooking(req.booking.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { create, getById, update, remove };
