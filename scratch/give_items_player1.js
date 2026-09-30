const prisma = require('../server/src/database');

async function main() {
  const targetCharId = 1;
  const character = await prisma.character.findUnique({
    where: { id: targetCharId },
    include: {
      inventory: {
        include: { item: true }
      }
    }
  });

  if (!character) {
    console.error(`Personagem ID ${targetCharId} não encontrado!`);
    return;
  }

  console.log(`Personagem encontrado: ${character.name} (ID: ${character.id})`);
  console.log(`Slots ocupados atualmente: ${character.inventory.length}`);

  // Itens para adicionar: [itemId, quantity, name]
  const itemsToAdd = [
    { itemId: 1, quantity: 30, name: 'Poké Ball' },
    { itemId: 2, quantity: 15, name: 'Great Ball' },
    { itemId: 3, quantity: 10, name: 'Ultra Ball' },
    { itemId: 328, quantity: 2, name: 'Master Ball' },
    { itemId: 4, quantity: 25, name: 'Potion' },
    { itemId: 5, quantity: 15, name: 'Super Potion' },
    { itemId: 257, quantity: 10, name: 'Hyper Potion' },
    { itemId: 333, quantity: 5, name: 'Max Potion' },
    { itemId: 190, quantity: 10, name: 'Full Heal' },
    { itemId: 480, quantity: 10, name: 'Revive' },
    { itemId: 7, quantity: 10, name: 'Rare Candy' },
    { itemId: 586, quantity: 3, name: 'Thunder Stone' },
    { itemId: 806, quantity: 3, name: 'Water Stone' },
    { itemId: 175, quantity: 3, name: 'Fire Stone' },
    { itemId: 292, quantity: 3, name: 'Leaf Stone' },
    { itemId: 358, quantity: 3, name: 'Moon Stone' },
  ];

  // Identificar slots já usados
  const existingSlots = new Map();
  character.inventory.forEach(inv => {
    existingSlots.set(inv.slotIndex, inv);
  });

  // Identificar quais itens já estão na mochila
  const existingItemMap = new Map();
  character.inventory.forEach(inv => {
    existingItemMap.set(inv.itemId, inv);
  });

  let nextSlot = 0;
  function getNextFreeSlot() {
    while (existingSlots.has(nextSlot)) {
      nextSlot++;
    }
    const slot = nextSlot;
    nextSlot++;
    return slot;
  }

  for (const it of itemsToAdd) {
    if (existingItemMap.has(it.itemId)) {
      // Atualizar quantidade
      const existing = existingItemMap.get(it.itemId);
      await prisma.inventorySlot.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + it.quantity }
      });
      console.log(`[ATUALIZADO] ${it.name} (Slot ${existing.slotIndex}): nova quantidade = ${existing.quantity + it.quantity}`);
    } else {
      // Criar em slot livre
      const freeSlotIndex = getNextFreeSlot();
      const created = await prisma.inventorySlot.create({
        data: {
          characterId: targetCharId,
          itemId: it.itemId,
          quantity: it.quantity,
          slotIndex: freeSlotIndex
        },
        include: { item: true }
      });
      existingSlots.set(freeSlotIndex, created);
      console.log(`[CRIADO] ${it.name} x${it.quantity} no Slot ${freeSlotIndex}`);
    }
  }

  // Verificar resultado final
  const updatedInv = await prisma.inventorySlot.findMany({
    where: { characterId: targetCharId },
    include: { item: true },
    orderBy: { slotIndex: 'asc' }
  });

  console.log(`\n=== INVENTÁRIO DO PERSONAGEM ${character.name} (ID: ${targetCharId}) ATUALIZADO ===`);
  console.log(`Total de slots ocupados: ${updatedInv.length}`);
  updatedInv.forEach(s => {
    console.log(`  Slot [${s.slotIndex}]: ${s.item.name} x${s.quantity} (ID: ${s.itemId}, Categoria: ${s.item.category})`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
