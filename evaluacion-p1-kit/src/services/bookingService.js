const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const findBookingByDateAndSchedule = async (date, scheduleId, excludeId) => {
  return prisma.booking.findFirst({
    where: {
      date,
      scheduleId,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
};

const findBookingById = async (id) => {
  return prisma.booking.findUnique({ where: { id } });
};

const createBooking = async (data) => {
  return prisma.booking.create({ data });
};

const updateBooking = async (id, data) => {
  return prisma.booking.update({ where: { id }, data });
};

const deleteBooking = async (id) => {
  return prisma.booking.delete({ where: { id } });
};

module.exports = {
  findBookingByDateAndSchedule,
  findBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
