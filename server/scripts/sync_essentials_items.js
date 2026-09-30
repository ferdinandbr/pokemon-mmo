const fs = require('fs');
const path = require('path');
const prisma = require('../src/database');

const PBS_ITEMS_PATH = 'E:/Pokemon Essentials v17.2 - Kanto by DefaKS/PBS/items.txt';
const ICONS_DIR = 'E:/Pokemon Essentials v17.2 - Kanto by DefaKS/Graphics/Icons';
const DEST_DIR = path.resolve(__dirname, '../../client/public/assets/items');

function mapPocketToCategory(pocket, internalName = '') {
  const name = internalName.toUpperCase();
  if (name.includes('BALL')) return 'pokeball';
  if (name.includes('STONE')) return 'evolution_stone';
  if (name.includes('POTION') || name.includes('HEAL') || name.includes('REVIVE') || name.includes('ANTIDOTE') || name.includes('CANDY')) return 'medicine';
  if (name.includes('BERRY')) return 'berry';
  if (name.includes('TM') || name.includes('HM')) return 'machine';
  if (pocket === 1) return 'general';
  if (pocket === 2) return 'medicine';
  if (pocket === 3) return 'pokeball';
  if (pocket === 4) return 'machine';
  if (pocket === 5) return 'berry';
  if (pocket === 6) return 'battle';
  if (pocket === 7) return 'key_item';
  if (pocket === 8) return 'general';
  return 'general';
}

async function syncItems() {
  console.log('--- Sincronizando Itens do Pokemon Essentials ---');
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  if (!fs.existsSync(PBS_ITEMS_PATH)) {
    console.error('Arquivo PBS/items.txt não encontrado em:', PBS_ITEMS_PATH);
    return;
  }

  const content = fs.readFileSync(PBS_ITEMS_PATH, 'utf-8');
  const lines = content.split(/\r?\n/);

  let imported = 0;
  let copiedIcons = 0;

  for (const line of lines) {
    if (!line || line.startsWith('#')) continue;
    // Format: ID,INTERNALNAME,Name,PluralName,Pocket,Price,Description,UseOut,UseIn,Special...
    const parts = line.split(',');
    if (parts.length < 7) continue;

    const id = parseInt(parts[0].trim());
    if (isNaN(id)) continue;

    const internalName = parts[1].trim();
    const name = parts[2].trim();
    const pocket = parseInt(parts[4].trim()) || 1;
    const price = parseInt(parts[5].trim()) || 100;
    // Description is enclosed in quotes or comes after price
    let description = parts.slice(6).join(',').trim();
    if (description.startsWith('"') && description.endsWith('"')) {
      description = description.slice(1, -1);
    }
    // Clean description if it has extra trailing csv parameters
    const descQuoteMatch = line.match(/"([^"]+)"/);
    if (descQuoteMatch) {
      description = descQuoteMatch[1];
    }

    const padId = String(id).padStart(3, '0');
    const iconSrcName = `item${padId}.png`;
    const iconSrcPath = path.join(ICONS_DIR, iconSrcName);
    const iconDestName = `item${padId}.png`;
    const iconDestPath = path.join(DEST_DIR, iconDestName);

    let spritePath = `/assets/items/${iconDestName}`;

    // Copiar o sprite original do Essentials se existir
    if (fs.existsSync(iconSrcPath)) {
      if (!fs.existsSync(iconDestPath)) {
        fs.copyFileSync(iconSrcPath, iconDestPath);
        copiedIcons++;
      }
    } else {
      // Se não houver itemXXX.png, verificar se já temos um com slug do nome
      const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.png';
      const slugPath = path.join(DEST_DIR, slugName);
      if (fs.existsSync(slugPath)) {
        spritePath = `/assets/items/${slugName}`;
      }
    }

    const category = mapPocketToCategory(pocket, internalName);

    // Upsert no banco de dados
    await prisma.item.upsert({
      where: { name },
      update: {
        category,
        description,
        price,
        sprite: spritePath
      },
      create: {
        name,
        category,
        description,
        price,
        sprite: spritePath
      }
    });

    imported++;
  }

  console.log(`✅ Sincronização concluída com sucesso!`);
  console.log(`- ${imported} itens atualizados/inseridos no banco de dados.`);
  console.log(`- ${copiedIcons} novos ícones copiados de Essentials Graphics/Icons para client.`);
}

syncItems()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
