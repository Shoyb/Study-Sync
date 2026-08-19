const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.user.count();
    console.log('Database connection successful. User count:', count);
  } catch (e) {
    console.error('Database connection failed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
