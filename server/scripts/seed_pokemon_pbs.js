const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedPBS() {
  const pokemonTxtPath = 'E:/Pokemon Essentials v17.2 - Kanto by DefaKS/PBS/pokemon.txt';
  const movesTxtPath = 'E:/Pokemon Essentials v17.2 - Kanto by DefaKS/PBS/moves.txt';

  console.log('[SeedPBS] Iniciando importacao da base PBS...');

  // 1. Parse moves.txt
  if (fs.existsSync(movesTxtPath)) {
    const movesContent = fs.readFileSync(movesTxtPath, 'utf-8');
    const lines = movesContent.split(/\r?\n/);

    const movesToInsert = [];

    for (const line of lines) {
      if (!line || line.startsWith('#')) continue;

      // CSV line format: id,INTERNALNAME,Name,Code,Power,Type,Category,Accuracy,PP,Chance,Target,Priority,Flags,Description
      const parts = line.split(',');
      if (parts.length < 13) continue;

      const id = parseInt(parts[0].trim());
      const internalName = parts[1].trim();
      const name = parts[2].trim();
      const power = parseInt(parts[4].trim()) || 0;
      const type = parts[5].trim().toUpperCase();
      const category = parts[6].trim() || 'Physical';
      const accuracy = parseInt(parts[7].trim()) || 100;
      const pp = parseInt(parts[8].trim()) || 35;

      // Description is the rest after flags
      const descPart = parts.slice(13).join(',').replace(/^"|"$/g, '').trim();

      movesToInsert.push({
        id,
        internalName,
        name,
        type,
        category,
        power,
        accuracy,
        pp,
        description: descPart || ''
      });
    }

    console.log(`[SeedPBS] Processando ${movesToInsert.length} golpes...`);

    for (const move of movesToInsert) {
      await prisma.moveData.upsert({
        where: { internalName: move.internalName },
        update: move,
        create: move
      });
    }
    console.log('[SeedPBS] Golpes importados com sucesso!');
  } else {
    console.warn(`[SeedPBS Warning] Arquivo nao encontrado: ${movesTxtPath}`);
  }

  // 2. Parse pokemon.txt (Gen 1: #1 to #151)
  if (fs.existsSync(pokemonTxtPath)) {
    const pokemonContent = fs.readFileSync(pokemonTxtPath, 'utf-8');
    const blocks = pokemonContent.split(/^#-+$/m);

    let count = 0;

    for (const block of blocks) {
      const idMatch = block.match(/\[(\d+)\]/);
      if (!idMatch) continue;

      const id = parseInt(idMatch[1]);
      if (id < 1 || id > 151) continue; // Only Gen 1

      const nameMatch = block.match(/Name=(.+)/);
      const internalNameMatch = block.match(/InternalName=(.+)/);
      const type1Match = block.match(/Type1=(.+)/);
      const type2Match = block.match(/Type2=(.+)/);
      const statsMatch = block.match(/BaseStats=(.+)/);
      const genderMatch = block.match(/GenderRate=(.+)/);
      const growthMatch = block.match(/GrowthRate=(.+)/);
      const expMatch = block.match(/BaseEXP=(.+)/);
      const evolMatch = block.match(/Evolutions=(.+)/);
      const movesMatch = block.match(/Moves=(.+)/);

      if (!nameMatch || !statsMatch) continue;

      const name = nameMatch[1].trim();
      const internalName = internalNameMatch ? internalNameMatch[1].trim() : name.toUpperCase();
      const type1 = type1Match ? type1Match[1].trim().toUpperCase() : 'NORMAL';
      const type2 = type2Match ? type2Match[1].trim().toUpperCase() : null;

      const statsArr = statsMatch[1].split(',').map(s => parseInt(s.trim()));
      const baseHp = statsArr[0] || 45;
      const baseAttack = statsArr[1] || 49;
      const baseDefense = statsArr[2] || 49;
      const baseSpeed = statsArr[3] || 45;
      const baseSpAtk = statsArr[4] || 65;
      const baseSpDef = statsArr[5] || 65;

      const genderRate = genderMatch ? genderMatch[1].trim() : 'FemaleOneEighth';
      const growthRate = growthMatch ? growthMatch[1].trim() : 'MediumFast';
      const baseExp = expMatch ? parseInt(expMatch[1].trim()) : 64;

      // Parse evolutions: e.g. IVYSAUR,Level,16 or CHARMELEON,Level,16
      const evolutions = [];
      if (evolMatch && evolMatch[1].trim()) {
        const evParts = evolMatch[1].split(',').map(s => s.trim());
        for (let i = 0; i < evParts.length; i += 3) {
          if (evParts[i]) {
            evolutions.push({
              targetInternalName: evParts[i],
              method: evParts[i + 1] || 'Level',
              parameter: evParts[i + 2] || '16'
            });
          }
        }
      }

      // Parse moves learnset: e.g. 1,TACKLE,3,GROWL,7,LEECHSEED...
      const learnset = [];
      if (movesMatch && movesMatch[1].trim()) {
        const moveParts = movesMatch[1].split(',').map(s => s.trim());
        for (let i = 0; i < moveParts.length; i += 2) {
          if (moveParts[i] && moveParts[i + 1]) {
            learnset.push({
              level: parseInt(moveParts[i]) || 1,
              moveInternalName: moveParts[i + 1].toUpperCase()
            });
          }
        }
      }

      await prisma.pokemonSpecies.upsert({
        where: { id },
        update: {
          name,
          internalName,
          type1,
          type2: type2 === 'NONE' ? null : type2,
          baseHp,
          baseAttack,
          baseDefense,
          baseSpAtk,
          baseSpDef,
          baseSpeed,
          genderRate,
          growthRate,
          baseExp,
          evolutions: JSON.stringify(evolutions),
          moves: JSON.stringify(learnset)
        },
        create: {
          id,
          name,
          internalName,
          type1,
          type2: type2 === 'NONE' ? null : type2,
          baseHp,
          baseAttack,
          baseDefense,
          baseSpAtk,
          baseSpDef,
          baseSpeed,
          genderRate,
          growthRate,
          baseExp,
          evolutions: JSON.stringify(evolutions),
          moves: JSON.stringify(learnset)
        }
      });

      count++;
    }

    console.log(`[SeedPBS] ${count} Especies de Pokemon da Gen 1 importadas com sucesso!`);
  } else {
    console.warn(`[SeedPBS Warning] Arquivo nao encontrado: ${pokemonTxtPath}`);
  }

  console.log('===========================================');
  console.log('[SeedPBS] Concluido!');
  console.log('===========================================');
}

seedPBS()
  .catch(err => {
    console.error('[SeedPBS Error]:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
