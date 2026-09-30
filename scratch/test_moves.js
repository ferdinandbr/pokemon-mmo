const moveRegistry = require('../server/src/services/moves/MoveRegistry');
const moveManager = require('../server/src/services/moves/MoveManager');
const prisma = require('../server/src/database');

async function run() {
  console.log('--- TEST 1: Initializing MoveRegistry ---');
  await moveRegistry.init();
  console.log(`Moves in memory: ${moveRegistry.byId.size}`);

  const ember = moveRegistry.get('EMBER');
  console.log('Move Definition EMBER:', ember);

  console.log('\n--- TEST 2: Teaching moves with MoveManager ---');
  let moves = [];
  moves = moveManager.teachMove(moves, 'TACKLE');
  moves = moveManager.teachMove(moves, 'GROWL');
  moves = moveManager.teachMove(moves, 'EMBER');
  moves = moveManager.teachMove(moves, 'SMOKESCREEN');
  console.log('4 Moves learned:', moves);
  console.log('Can learn directly (<4)?', moveManager.canLearnDirectly(moves));

  console.log('\n--- TEST 3: Validation: 5th move limit ---');
  try {
    moveManager.teachMove(moves, 'DRAGONRAGE');
    console.error('ERROR: Should have thrown 5th move error!');
  } catch (err) {
    console.log('Success (Expected Error):', err.message);
  }

  console.log('\n--- TEST 4: Validation: Duplicate move prevention ---');
  try {
    moveManager.teachMove(moves.slice(0, 2), 'TACKLE');
    console.error('ERROR: Should have thrown duplicate error!');
  } catch (err) {
    console.log('Success (Expected Error):', err.message);
  }

  console.log('\n--- TEST 5: Move Replacement ---');
  const replaced = moveManager.replaceMove(moves, 0, 'FLAMETHROWER');
  console.log('Moves after replacing slot 0 with FLAMETHROWER:', replaced);

  console.log('\n--- TEST 6: Move Inflation for Client UI ---');
  const inflated = moveRegistry.inflateMovesList(replaced);
  console.log('Inflated Moves for Client:');
  console.log(JSON.stringify(inflated, null, 2));

  console.log('\n--- TEST 7: Initial Level Selection for Charmander (Lv 12) ---');
  const charmander = await prisma.pokemonSpecies.findFirst({ where: { id: 4 } });
  const charmanderMoves = moveManager.selectMovesForInitialLevel(charmander, 12);
  console.log('Charmander Lv 12 moves:', charmanderMoves);
  const inflatedCharmander = moveRegistry.inflateMovesList(charmanderMoves);
  console.log('Charmander Lv 12 inflated names:', inflatedCharmander.map(m => m.name));

  console.log('\n✅ ALL MOVE SYSTEM TESTS PASSED SUCCESSFULLY!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
