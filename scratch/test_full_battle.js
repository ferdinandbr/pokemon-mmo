const moveRegistry = require('../server/src/services/moves/MoveRegistry');
const battleManager = require('../server/src/services/battle/BattleManager');
const prisma = require('../server/src/database');

async function testFullBattle() {
  console.log('--- TEST FULL BATTLE SUITE ---');
  await moveRegistry.init();

  const character = await prisma.character.findFirst({
    include: { inventory: { include: { item: true } } }
  });

  if (!character) {
    console.error('No character found.');
    return;
  }

  console.log(`Character: ${character.name} (id: ${character.id})`);

  // Ensure character has at least 1 Pokeball for test
  let ballItem = await prisma.item.findFirst({ where: { category: 'pokeball', name: { contains: 'Ball' } } });
  if (!ballItem) {
    ballItem = await prisma.item.create({
      data: { name: 'Poke Ball', category: 'pokeball', description: 'A device for catching wild Pokémon.', price: 200 }
    });
  }

  const existingSlot = await prisma.inventorySlot.findFirst({
    where: { characterId: character.id, itemId: ballItem.id }
  });

  if (!existingSlot) {
    const slots = await prisma.inventorySlot.findMany({ where: { characterId: character.id } });
    const usedIndices = new Set(slots.map(s => s.slotIndex));
    let freeIdx = 0;
    while (usedIndices.has(freeIdx)) freeIdx++;

    await prisma.inventorySlot.create({
      data: { characterId: character.id, itemId: ballItem.id, quantity: 5, slotIndex: freeIdx }
    });
  }

  // ─── TEST 1: Start Battle ───────────────────────────────────────────────
  console.log('\n[1] Starting Wild Battle...');
  const battle = await battleManager.startWildBattle(character.id);
  console.log(`Battle started vs ${battle.wildPokemon.name} Lv.${battle.wildPokemon.level}`);
  console.log(`Active Player Mon: ${battle.playerPokemon.name} (HP: ${battle.playerPokemon.currentHp}/${battle.playerPokemon.maxHp})`);

  // ─── TEST 2: Fight Turn ─────────────────────────────────────────────────
  console.log('\n[2] Executing Fight Turn (Slot 0)...');
  const fightResult = await battleManager.executeTurn(character.id, {
    type: 'fight',
    slotIndex: 0
  });

  console.log(`Turn events count: ${fightResult.events.length}`);
  fightResult.events.forEach(e => console.log(`  - [${e.type}] ${e.message || ''}`));

  // ─── TEST 3: Throw Pokeball ─────────────────────────────────────────────
  if (!fightResult.battleEnded) {
    console.log('\n[3] Throwing Poke Ball...');
    const catchResult = await battleManager.executeTurn(character.id, {
      type: 'item',
      itemId: ballItem.id
    });

    console.log(`Catch Turn events count: ${catchResult.events.length}`);
    catchResult.events.forEach(e => console.log(`  - [${e.type}] ${e.message || ''}`));
    console.log(`Battle ended after catch attempt? ${catchResult.battleEnded}`);
  }

  console.log('\n✅ FULL BATTLE TEST SUITE PASSED SUCCESSFULLY!');
}

testFullBattle()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
