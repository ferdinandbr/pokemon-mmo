const prisma = require('./server/src/database');

async function chk() {
  const all = await prisma.pokemon.findMany({
    include: { species: true, character: true }
  });
  console.log(`Total pokemon no banco: ${all.length}`);
  for (const p of all) {
    console.log(
      `ID: ${p.id} | Char: ${p.character?.name} (${p.characterId}) | Species: ${p.species?.name} (#${p.speciesId}) | Location: ${p.location} | PartySlot: ${p.partySlot} | Box: ${p.boxNumber} | BoxSlot: ${p.boxSlot} | isBuddy: ${p.isBuddy}`
    );
  }
}

chk()
  .catch(console.error)
  .finally(() => process.exit(0));
