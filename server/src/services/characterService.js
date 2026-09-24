const prisma = require('../database');

async function createCharacter({ userId, name, gender, sprite }) {
  if (!name || !name.trim()) {
    throw new Error('O nome do personagem é obrigatório.');
  }

  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 16) {
    throw new Error('O nome deve ter entre 2 e 16 caracteres.');
  }

  const existingChar = await prisma.character.findUnique({
    where: { name: trimmedName }
  });

  if (existingChar) {
    throw new Error('Já existe um personagem com este nome.');
  }

  const validGenders = ['male', 'female'];
  const charGender = validGenders.includes(gender) ? gender : 'male';

  const validSprites = ['boy_run', 'girl_run'];
  const charSprite = validSprites.includes(sprite) ? sprite : (charGender === 'female' ? 'girl_run' : 'boy_run');

  // Spawn position in Pallet Town
  const character = await prisma.character.create({
    data: {
      userId,
      name: trimmedName,
      gender: charGender,
      sprite: charSprite,
      roomId: 'pallet_town',
      x: 560,
      y: 272,
      direction: 'down',
      money: 3000
    }
  });

  // Give initial starter inventory
  const pokeBallItem = await prisma.item.findUnique({ where: { name: 'Poké Ball' } });
  const potionItem = await prisma.item.findUnique({ where: { name: 'Potion' } });
  const mapItem = await prisma.item.findUnique({ where: { name: 'Town Map' } });

  const initialItems = [
    { item: pokeBallItem, qty: 5, slot: 0 },
    { item: potionItem, qty: 3, slot: 1 },
    { item: mapItem, qty: 1, slot: 2 }
  ];

  for (const entry of initialItems) {
    if (entry.item) {
      await prisma.inventorySlot.create({
        data: {
          characterId: character.id,
          itemId: entry.item.id,
          quantity: entry.qty,
          slotIndex: entry.slot
        }
      });
    }
  }

  // Starter Pokédex entry (Pikachu #25 seen)
  await prisma.pokedexEntry.create({
    data: {
      characterId: character.id,
      pokemonNumber: 25,
      pokemonName: 'Pikachu',
      status: 'seen'
    }
  });

  // Starter Pokemon in party (Pikachu Lv.5)
  const pokemonService = require('./pokemonService');
  await pokemonService.createPokemon({
    characterId: character.id,
    speciesIdOrName: 25,
    level: 5,
    forceBuddy: true
  });

  return getCharacterDetails(character.id);
}

async function getUserCharacters(userId) {
  return prisma.character.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      gender: true,
      sprite: true,
      roomId: true,
      x: true,
      y: true,
      direction: true,
      money: true,
      bagCapacity: true,
      equipment: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function getCharacterDetails(characterId) {
  return prisma.character.findUnique({
    where: { id: characterId },
    include: {
      inventory: {
        include: { item: true },
        orderBy: { slotIndex: 'asc' }
      },
      pokedex: {
        orderBy: { pokemonNumber: 'asc' }
      },
      pokemon: {
        include: { species: true },
        orderBy: { partySlot: 'asc' }
      }
    }
  });
}

async function updateCharacterLocation(characterId, { roomId, x, y, direction }) {
  const data = {};
  if (roomId) data.roomId = roomId;
  if (typeof x === 'number') data.x = x;
  if (typeof y === 'number') data.y = y;
  if (direction) data.direction = direction;

  return prisma.character.update({
    where: { id: characterId },
    data
  });
}

async function updateCharacterEquipment(characterId, equipmentData) {
  const equipmentStr = typeof equipmentData === 'string' ? equipmentData : JSON.stringify(equipmentData);
  return prisma.character.update({
    where: { id: characterId },
    data: { equipment: equipmentStr }
  });
}

module.exports = {
  createCharacter,
  getUserCharacters,
  getCharacterDetails,
  updateCharacterLocation,
  updateCharacterEquipment
};
