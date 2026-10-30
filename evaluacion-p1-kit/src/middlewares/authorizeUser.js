function authorizeUser(req, res, next) {
  const requestedId = Number(req.params.id);
  if (!Number.isInteger(requestedId) || requestedId < 1) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  if (req.user?.role !== "ADMIN" && requestedId !== req.user?.id) {
    return res.status(403).json({ error: "Forbidden: not your bookings" });
  }

  req.requestedUserId = requestedId;
  return next();
}

module.exports = authorizeUser;
