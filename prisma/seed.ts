const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  try {
    const encryptedPassword = await bcrypt.hash("admin", 10);
    await prisma.user.create({
      data: {
        email: "admin@admin.com",
        password: encryptedPassword,
      },
    });

    console.log("Seed completed successfully");
  } catch (e: any) {
    console.error("error seeding database: ", e);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
