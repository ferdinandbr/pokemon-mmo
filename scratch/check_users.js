const prisma = require('../server/src/database');

async function testUser() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true }
  });
  console.log('Registered Users:', users);
}

testUser().then(() => prisma.$disconnect());
