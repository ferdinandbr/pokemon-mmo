const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial items...');

  const items = [
    { name: 'Poké Ball', category: 'pokeball', description: 'A device for catching wild Pokémon.', price: 200 },
    { name: 'Great Ball', category: 'pokeball', description: 'A good Ball with a higher catch rate than a Poké Ball.', price: 600 },
    { name: 'Ultra Ball', category: 'pokeball', description: 'An ultra-high-performance Ball providing a higher catch rate.', price: 1200 },
    { name: 'Potion', category: 'medicine', description: 'Restores the HP of a Pokémon by 20 points.', price: 300 },
    { name: 'Super Potion', category: 'medicine', description: 'Restores the HP of a Pokémon by 50 points.', price: 700 },
    { name: 'Antidote', category: 'medicine', description: 'Cures a Pokémon that has been poisoned.', price: 100 },
    { name: 'Rare Candy', category: 'medicine', description: 'A candy that is packed with energy. It raises the level of a Pokémon by one.', price: 4800 },
    { name: 'Town Map', category: 'key_item', description: 'A convenient map showing current location in Kanto.', price: 0 },
    { name: 'Running Shoes', category: 'key_item', description: 'Enables high-speed sprinting anywhere outside.', price: 0 }
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { name: item.name },
      update: {},
      create: item
    });
  }

  await prisma.pokemonSpecies.upsert({
    where: { id: 25 },
    update: {},
    create: {
      id: 25,
      name: 'Pikachu',
      internalName: 'PIKACHU',
      type1: 'ELECTRIC',
      baseHp: 35,
      baseAttack: 55,
      baseDefense: 40,
      baseSpAtk: 50,
      baseSpDef: 50,
      baseSpeed: 90,
      genderRate: 'Female50Percent',
      growthRate: 'MediumFast',
      baseExp: 112,
      moves: JSON.stringify([
        { level: 1, moveInternalName: 'THUNDERSHOCK' },
        { level: 1, moveInternalName: 'GROWL' }
      ])
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
