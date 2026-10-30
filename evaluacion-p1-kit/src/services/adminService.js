const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const createSchedule = async ({ court, startTime, endTime }) => {
  return prisma.schedule.create({
    data: {
      court,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });
};

const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      schedule: true,
    },
    orderBy: { date: "asc" },
  });
};

module.exports = { createSchedule, getAllBookings };
