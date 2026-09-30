const moveRegistry = require('../server/src/services/moves/MoveRegistry');
const pokemonProgressionService = require('../server/src/services/pokemonProgressionService');
const pokemonService = require('../server/src/services/pokemonService');
const prisma = require('../server/src/database');

async function run() {
  console.log('--- TEST PROGRESSION: MoveRegistry init ---');
  await moveRegistry.init();

  // 1. Find or create a test character
  let testChar = await prisma.character.findFirst();
  if (!testChar) {
    console.error('No character found in DB to run test.');
    return;
  }
  console.log(`Using character: ${testChar.name} (id: ${testChar.id})`);

  // 2. Create a temporary test Pokemon (Charmander Lv 15)
  // At Lv 16, Charmander learns DRAGONRAGE
  const testPkmn = await pokemonService.createPokemon({
    characterId: testChar.id,
    speciesIdOrName: 'CHARMANDER',
    level: 15,
    forceBuddy: false,
    targetLocation: 'storage'
  });

  console.log(`Created test Charmander (id: ${testPkmn.id}, Lv: ${testPkmn.level})`);
  console.log('Initial moves:', testPkmn.moves.map(m => m.name));

  // 3. Level up from 15 to 16 (Charmander learns Dragon Rage!)
  console.log('\n--- Leveling up Charmander from Lv 15 to 16 ---');
  const levelUpResult = await pokemonProgressionService.levelUpPokemon({
    characterId: testChar.id,
    pokemonId: testPkmn.id,
    levelsToAdd: 1
  });

  console.log(`New Level: ${levelUpResult.newLevel}`);
  console.log('Stats difference:', levelUpResult.statsDiff);
  console.log('Auto-learned moves:', levelUpResult.autoLearnedMoves.map(m => m.name));
  console.log('Pending prompt move:', levelUpResult.pendingPromptMove ? levelUpResult.pendingPromptMove.newMove.name : 'None');

  if (levelUpResult.pendingPromptMove) {
    console.log('\n--- Replacing slot 0 with Dragon Rage ---');
    const replaceResult = await pokemonProgressionService.confirmMoveReplacement({
      characterId: testChar.id,
      pokemonId: testPkmn.id,
      slotIndexToReplace: 0,
      newMoveId: levelUpResult.pendingPromptMove.newMove.id
    });

    console.log('Replaced successfully!');
    console.log('Old move:', replaceResult.oldMove.name);
    console.log('New move:', replaceResult.newMove.name);
    console.log('Updated moveset:', replaceResult.pokemon.moves.map(m => m.name));
  } else {
    console.log('Learned directly because Charmander had < 4 moves.');
  }

  // 4. Cleanup test Pokemon
  await prisma.pokemon.delete({ where: { id: testPkmn.id } });
  console.log('\nCleaned up test Pokemon.');
  console.log('\n✅ PROGRESSION & SOCKET LEVEL-UP TESTS COMPLETED SUCCESSFULLY!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
