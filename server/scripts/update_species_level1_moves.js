const prisma = require('../src/database');

async function updateSpeciesLevel1() {
  console.log('[UpdateSpeciesLevel1] Atualizando golpes iniciais para especies orfas...');

  const updates = [
    { name: 'Poliwag', move: 'WATERGUN' },
    { name: 'Abra', move: 'CONFUSION' },
    { name: 'Bellsprout', move: 'WRAP' },
    { name: 'Cubone', move: 'BONECLUB' },
    { name: 'Magikarp', move: 'TACKLE' },
    { name: 'Ditto', move: 'TACKLE' }
  ];

  for (const item of updates) {
    const species = await prisma.pokemonSpecies.findFirst({ where: { name: item.name } });
    if (!species) {
      console.warn(`[UpdateSpeciesLevel1] Especie ${item.name} nao encontrada.`);
      continue;
    }

    let learnset = [];
    try {
      learnset = typeof species.moves === 'string' ? JSON.parse(species.moves) : species.moves;
    } catch (e) {
      learnset = [];
    }

    // Check if move already exists at level 1
    const alreadyHas = learnset.some(m => m.level === 1 && m.moveInternalName.toUpperCase() === item.move);
    if (!alreadyHas) {
      // Prepend or add the move at level 1
      learnset.unshift({ level: 1, moveInternalName: item.move });
      await prisma.pokemonSpecies.update({
        where: { id: species.id },
        data: { moves: JSON.stringify(learnset) }
      });
      console.log(`[UpdateSpeciesLevel1] ${item.name}: adicionado golpe ativo "${item.move}" no Nivel 1!`);
    } else {
      console.log(`[UpdateSpeciesLevel1] ${item.name}: ja possui "${item.move}" no Nivel 1.`);
    }
  }

  console.log('[UpdateSpeciesLevel1] Concluido com sucesso!');
  process.exit(0);
}

updateSpeciesLevel1().catch(err => {
  console.error('[UpdateSpeciesLevel1] Erro:', err);
  process.exit(1);
});
