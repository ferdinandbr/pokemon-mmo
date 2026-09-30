const prisma = require('../server/src/database');

async function main() {
  const itemNames = [
    'Poké Ball', 'Great Ball', 'Ultra Ball', 'Master Ball',
    'Potion', 'Super Potion', 'Hyper Potion', 'Max Potion', 'Revive', 'Full Heal',
    'Rare Candy', 'Thunder Stone', 'Water Stone', 'Fire Stone', 'Leaf Stone', 'Moon Stone', 'Sun Stone'
  ];

  const found = await prisma.item.findMany({
    where: {
      name: {
        in: itemNames
      }
    }
  });

  console.log('Itens encontrados:');
  found.forEach(i => console.log(`ID: ${i.id} | Nome: "${i.name}" | Categoria: ${i.category}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
