const prisma = require('../server/src/database');

async function checkCharacters() {
  const characters = await prisma.character.findMany({
    include: {
      pokemon: {
        where: { location: 'party' },
        include: { species: true }
      }
    }
  });

  for (const c of characters) {
    console.log(`Character ${c.name} (id: ${c.id}, user: ${c.userId}):`);
    console.log(`  Party count: ${c.pokemon.length}`);
    c.pokemon.forEach(p => {
      console.log(`    - ${p.nickname || p.species.name} Lv.${p.level}: HP ${p.currentHp}/${p.maxHp}`);
    });
  }
}

checkCharacters().then(() => prisma.$disconnect());
