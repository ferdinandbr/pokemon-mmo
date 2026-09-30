const prisma = require('../server/src/database');

async function main() {
  const count = await prisma.item.count();
  console.log('Total items in DB:', count);
  const items = await prisma.item.findMany({
    take: 15,
    select: { id: true, name: true, category: true, sprite: true, price: true }
  });
  console.log('Sample items:', items);
}

main().finally(() => prisma.$disconnect());
