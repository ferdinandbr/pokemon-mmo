const prisma = require('../server/src/database');

async function main() {
  const items = await prisma.item.findMany();
  console.log(`TOTAL ITEMS NO BANCO: ${items.length}`);
  items.forEach(it => {
    console.log(`- ID: ${it.id} | Nome: "${it.name}" | Categoria: ${it.category} | Preço: ${it.price}`);
  });

  const chars = await prisma.character.findMany({
    include: {
      inventory: {
        include: { item: true }
      }
    }
  });

  console.log(`\nTOTAL PERSONAGENS: ${chars.length}`);
  chars.forEach(c => {
    console.log(`\nPersonagem ID: ${c.id} | Nome: "${c.name}" | Level: ${c.level} | Dinheiro: ${c.money}`);
    console.log(`Inventário (${c.inventory.length} slots):`);
    c.inventory.forEach(inv => {
      console.log(`  Slot [${inv.slotIndex}]: Item "${inv.item.name}" (ID ${inv.itemId}) x${inv.quantity}`);
    });
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
