const prisma = require('../server/src/database');

async function main() {
  console.log('--- Applying Schema Updates to PostgreSQL ---');
  
  // 1. Character level and exp
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "level" INTEGER NOT NULL DEFAULT 1;`);
    console.log('✅ Added Character.level');
  } catch (err) {
    console.error('Error adding Character.level:', err.message);
  }

  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "exp" INTEGER NOT NULL DEFAULT 0;`);
    console.log('✅ Added Character.exp');
  } catch (err) {
    console.error('Error adding Character.exp:', err.message);
  }

  // 2. Pokemon friendship
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Pokemon" ADD COLUMN IF NOT EXISTS "friendship" INTEGER NOT NULL DEFAULT 70;`);
    console.log('✅ Added Pokemon.friendship');
  } catch (err) {
    console.error('Error adding Pokemon.friendship:', err.message);
  }

  console.log('Checking sample Character...');
  const char = await prisma.character.findFirst();
  console.log('Character:', char ? { id: char.id, name: char.name, level: char.level, exp: char.exp } : 'None');

  console.log('Checking sample Pokemon...');
  const mon = await prisma.pokemon.findFirst();
  console.log('Pokemon:', mon ? { id: mon.id, speciesId: mon.speciesId, friendship: mon.friendship } : 'None');

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
