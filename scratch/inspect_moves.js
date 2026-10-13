const path = require('path');
const fs = require('fs');

async function main() {
  const prisma = require('../server/src/database');
  const count = await prisma.moveData.count();
  console.log('Total moves in Prisma:', count);

  const sample = await prisma.moveData.findMany({ take: 5 });
  console.log('Sample moves:', sample);

  const pbsPath = 'E:/Pokemon Essentials v17.2 - Kanto by DefaKS/PBS/moves.txt';
  if (fs.existsSync(pbsPath)) {
    console.log('PBS moves.txt exists!');
  } else {
    console.log('PBS moves.txt NOT found at path.');
  }

  await prisma.$disconnect();
}

main().catch(console.error);
