const moveRegistry = require('../server/src/services/moves/MoveRegistry');
const battleManager = require('../server/src/services/battle/BattleManager');
const prisma = require('../server/src/database');

async function testHealItem() {
  console.log('--- TEST HEAL ITEM IN BATTLE ---');
  await moveRegistry.init();

  const character = await prisma.character.findFirst();
  if (!character) return console.error('No character found.');

  // Find or create Potion
  let potion = await prisma.item.findFirst({ where: { name: { contains: 'Potion', mode: 'insensitive' } } });
  if (!potion) {
    potion = await prisma.item.create({
      data: { name: 'Potion', category: 'medicine', description: 'Restores 20 HP.', price: 300 }
    });
  }

  // Ensure slot
  let slot = await prisma.inventorySlot.findFirst({ where: { characterId: character.id, itemId: potion.id } });
  if (!slot) {
    const slots = await prisma.inventorySlot.findMany({ where: { characterId: character.id } });
    const usedIndices = new Set(slots.map(s => s.slotIndex));
    let freeIdx = 0;
    while (usedIndices.has(freeIdx)) freeIdx++;
    slot = await prisma.inventorySlot.create({
      data: { characterId: character.id, itemId: potion.id, quantity: 3, slotIndex: freeIdx }
    });
  }

  const battle = await battleManager.startWildBattle(character.id);
  console.log(`Battle started vs ${battle.wildPokemon.name}`);

  // Use Potion
  const healResult = await battleManager.executeTurn(character.id, {
    type: 'item',
    itemId: potion.id
  });

  console.log('Heal turn events:');
  healResult.events.forEach(e => console.log(`  - [${e.type}] ${e.message || ''}`));

  console.log('✅ HEAL TEST COMPLETED!');
}

testHealItem()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
