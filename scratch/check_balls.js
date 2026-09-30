const prisma = require('../server/src/database');

async function check() {
  const items = await prisma.item.findMany({
    where: { name: { contains: 'Ball', mode: 'insensitive' } }
  });
  console.log('Ball items:', items);
}

check().then(() => prisma.$disconnect());
