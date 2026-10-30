require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Borrar en orden para respetar las claves foráneas.
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("jardel123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Paulo Galarza",
      email: "paulo.galarza@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Jardel Maza",
      email: "jamaza6@espe.edu.ec",
      password: userPassword,
      role: "USER",
    },
  });

  const futbol = await prisma.schedule.create({
    data: {
      court: "Fútbol 4",
      startTime: new Date("2026-11-20T08:00:00.000Z"),
      endTime: new Date("2026-11-20T10:00:00.000Z"),
    },
  });

  const basquet = await prisma.schedule.create({
    data: {
      court: "Básquet 4",
      startTime: new Date("2026-11-20T10:00:00.000Z"),
      endTime: new Date("2026-11-20T12:00:00.000Z"),
    },
  });

  await prisma.booking.create({
    data: {
      date: new Date("2026-11-20T08:00:00.000Z"),
      user: { connect: { id: user.id } },
      schedule: { connect: { id: futbol.id } },
    },
  });

  await prisma.booking.create({
    data: {
      date: new Date("2026-11-20T10:00:00.000Z"),
      user: { connect: { id: admin.id } },
      schedule: { connect: { id: basquet.id } },
    },
  });

  console.log("Seed completado: usuarios, horarios y reservas creados.");
}

main()
  .catch((error) => {
    console.error("Error al ejecutar el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
