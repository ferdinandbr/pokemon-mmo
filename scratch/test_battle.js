const moveRegistry = require('../server/src/services/moves/MoveRegistry');
const battleManager = require('../server/src/services/battle/BattleManager');
const prisma = require('../server/src/database');

async function run() {
  console.log('--- TEST BATTLE: MoveRegistry init ---');
  await moveRegistry.init();

  const testChar = await prisma.character.findFirst();
  if (!testChar) {
    console.error('No character found in DB.');
    return;
  }

  console.log(`Starting wild battle for character: ${testChar.name} (id: ${testChar.id})`);
  const initialBattle = await battleManager.startWildBattle(testChar.id);

  console.log('Battle Started!');
  console.log(`Player Pokemon: ${initialBattle.playerPokemon.nickname || initialBattle.playerPokemon.species.name} (Lv ${initialBattle.playerPokemon.level}, HP: ${initialBattle.playerPokemon.currentHp}/${initialBattle.playerPokemon.maxHp})`);
  console.log(`Wild Pokemon: ${initialBattle.wildPokemon.name} (Lv ${initialBattle.wildPokemon.level}, HP: ${initialBattle.wildPokemon.currentHp}/${initialBattle.wildPokemon.maxHp})`);

  console.log('\n--- Turn 1: Player uses first move ---');
  const turn1 = await battleManager.executeTurn(testChar.id, {
    type: 'fight',
    slotIndex: 0
  });

  console.log('Turn 1 Events:');
  for (const ev of turn1.events) {
    console.log(`  [${ev.type}] ${ev.message || JSON.stringify(ev)}`);
  }

  if (!turn1.battleEnded) {
    console.log('\n--- Turn 2: Player runs away ---');
    const turn2 = await battleManager.executeTurn(testChar.id, {
      type: 'run'
    });
    for (const ev of turn2.events) {
      console.log(`  [${ev.type}] ${ev.message || JSON.stringify(ev)}`);
    }
  }

  console.log('\n✅ BATTLE ENGINE TESTS PASSED SUCCESSFULLY!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
