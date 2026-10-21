const prisma = require('../src/database');
const moveRegistry = require('../src/services/moves/MoveRegistry');
const moveManager = require('../src/services/moves/MoveManager');
const { isActiveCombatMove, INCOMPATIBLE_ACTIVE_COMBAT_MOVES } = require('../src/services/moves/MoveConstants');

async function migratePokemonMoves() {
  console.log('[MigrateMoves] Iniciando migracao dos Pokemons no banco de dados...');
  await moveRegistry.ensureLoaded();

  const pokemons = await prisma.pokemon.findMany({
    include: { species: true }
  });

  console.log(`[MigrateMoves] Encontrados ${pokemons.length} Pokemons para analisar.`);

  let updatedCount = 0;
  let movesReplacedTotal = 0;

  for (const pokemon of pokemons) {
    let currentMoves = moveManager.parseMoves(pokemon.moves);
    if (!currentMoves || currentMoves.length === 0) {
      currentMoves = moveManager.selectMovesForInitialLevel(pokemon.species, pokemon.level);
      await prisma.pokemon.update({
        where: { id: pokemon.id },
        data: { moves: JSON.stringify(currentMoves) }
      });
      updatedCount++;
      continue;
    }

    let hasIncompatible = false;
    const cleanMoves = [];
    const removedNames = [];

    // 1. Keep valid moves and identify incompatible ones
    for (const m of currentMoves) {
      const name = m.internalName || (moveRegistry.get(m.moveId || m.id) || {}).internalName;
      if (name && isActiveCombatMove(name)) {
        cleanMoves.push(m);
      } else {
        hasIncompatible = true;
        removedNames.push(name || m.name || 'UNKNOWN');
      }
    }

    if (!hasIncompatible) {
      continue;
    }

    // 2. We need to fill empty slots up to the number of moves (or up to 4) using species learnset
    const targetCount = Math.max(currentMoves.length, Math.min(4, cleanMoves.length + removedNames.length));
    const eligibleMoves = moveManager.selectMovesForInitialLevel(pokemon.species, pokemon.level);

    for (const cand of eligibleMoves) {
      if (cleanMoves.length >= targetCount) break;
      if (!cleanMoves.some(cm => (cm.internalName && cm.internalName.toUpperCase() === cand.internalName.toUpperCase()) || cm.moveId === cand.moveId)) {
        cleanMoves.push(cand);
      }
    }

    // If still empty (e.g. cleanMoves is 0), add fallback Tackle
    if (cleanMoves.length === 0) {
      cleanMoves.push(moveManager.createInstance(moveRegistry.getFallbackMove('TACKLE')));
    }

    movesReplacedTotal += removedNames.length;
    updatedCount++;

    await prisma.pokemon.update({
      where: { id: pokemon.id },
      data: { moves: JSON.stringify(cleanMoves) }
    });

    console.log(`[MigrateMoves] Pokemon #${pokemon.id} (${pokemon.species.name} Lvl ${pokemon.level}):`);
    console.log(`  -> Removidos: [${removedNames.join(', ')}]`);
    console.log(`  -> Novos golpes ativos: [${cleanMoves.map(m => m.internalName).join(', ')}]`);
  }

  console.log(`\n======================================================`);
  console.log(`[MigrateMoves] Migracao concluida com sucesso!`);
  console.log(`  Pokemons atualizados: ${updatedCount} de ${pokemons.length}`);
  console.log(`  Golpes incompativeis substituidos: ${movesReplacedTotal}`);
  console.log(`======================================================\n`);

  process.exit(0);
}

migratePokemonMoves().catch(err => {
  console.error('[MigrateMoves] Erro fatal na migracao:', err);
  process.exit(1);
});
