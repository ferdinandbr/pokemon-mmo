const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const GIST_RAW_URL = 'https://gist.githubusercontent.com/chillbrodev/de160bccfa43300d1fb4c1cccde7198c/raw';
const ITEMS_DIR = path.resolve(__dirname, '../../client/public/assets/items');

// Map gist category to standard game category
function mapCategory(rawCat = '') {
  const lower = rawCat.toLowerCase().trim();
  if (lower.includes('pokeball')) return 'pokeball';
  if (lower.includes('medicine')) return 'medicine';
  if (lower.includes('battle')) return 'battle';
  if (lower.includes('berries') || lower.includes('berry')) return 'berry';
  if (lower.includes('machine')) return 'machine';
  if (lower.includes('hold')) return 'hold_item';
  return 'general';
}

// Calculate realistic default price
function calculatePrice(name = '', category = '') {
  const lower = name.toLowerCase();
  if (lower.includes('master ball')) return 100000;
  if (lower.includes('ultra ball')) return 1200;
  if (lower.includes('great ball')) return 600;
  if (lower.includes('poke ball') || lower.includes('poké ball')) return 200;
  if (lower.includes('max revive')) return 4000;
  if (lower.includes('revive')) return 1500;
  if (lower.includes('full restore')) return 3000;
  if (lower.includes('max potion')) return 2500;
  if (lower.includes('hyper potion')) return 1200;
  if (lower.includes('super potion')) return 700;
  if (lower.includes('potion')) return 300;
  if (lower.includes('rare candy')) return 4800;
  if (lower.includes('candy')) return 1000;
  if (lower.includes('antidote') || lower.includes('heal') || lower.includes('cure')) return 100;

  switch (category) {
    case 'pokeball': return 500;
    case 'medicine': return 400;
    case 'battle': return 500;
    case 'berry': return 50;
    case 'machine': return 3000;
    case 'hold_item': return 2000;
    default: return 200;
  }
}

async function downloadImage(url, destPath) {
  if (fs.existsSync(destPath)) {
    return true; // Already downloaded
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Failed to download ${url}: status ${res.status}`);
      return false;
    }
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    return true;
  } catch (err) {
    console.warn(`Error downloading ${url}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando download e importação de itens da PokeAPI/Gist...');

  if (!fs.existsSync(ITEMS_DIR)) {
    fs.mkdirSync(ITEMS_DIR, { recursive: true });
    console.log(`Diretório criado: ${ITEMS_DIR}`);
  }

  console.log(`Baixando dados do Gist: ${GIST_RAW_URL}`);
  const response = await fetch(GIST_RAW_URL);
  if (!response.ok) {
    throw new Error(`Falha ao obter Gist: HTTP ${response.status}`);
  }

  const itemsData = await response.json();
  console.log(`Encontrados ${itemsData.length} itens no dataset.`);

  // 1. Download de imagens com controle de concorrência
  console.log('🖼️ Baixando imagens de sprites para client/public/assets/items/...');
  const CONCURRENCY = 20;
  let downloadedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < itemsData.length; i += CONCURRENCY) {
    const batch = itemsData.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (item) => {
      if (!item.imageurl) return;
      const filename = path.basename(new URL(item.imageurl).pathname);
      const destPath = path.join(ITEMS_DIR, filename);

      const exists = fs.existsSync(destPath);
      const ok = await downloadImage(item.imageurl, destPath);
      if (ok) {
        if (exists) skippedCount++;
        else downloadedCount++;
      }
    }));

    if ((i + CONCURRENCY) % 100 === 0 || i + CONCURRENCY >= itemsData.length) {
      console.log(`Progresso do download: ${Math.min(i + CONCURRENCY, itemsData.length)} / ${itemsData.length}`);
    }
  }

  console.log(`✅ Download concluído: ${downloadedCount} novas imagens salvas, ${skippedCount} já existiam.`);

  // 2. Inserir / Atualizar itens no Banco de Dados SQLite via Prisma
  console.log('💾 Inserindo itens no banco de dados...');
  let upsertCount = 0;

  for (const item of itemsData) {
    const category = mapCategory(item.category);
    const filename = item.imageurl ? path.basename(new URL(item.imageurl).pathname) : null;
    const spritePath = filename ? `/assets/items/${filename}` : null;
    const price = calculatePrice(item.name, category);
    const description = item.effect || 'Nenhum efeito registrado.';

    await prisma.item.upsert({
      where: { name: item.name },
      update: {
        category,
        description,
        price,
        sprite: spritePath
      },
      create: {
        name: item.name,
        category,
        description,
        price,
        sprite: spritePath
      }
    });

    // Se o item for "Poke Ball", garantir também o alias "Poké Ball" com acento
    if (item.name === 'Poke Ball') {
      await prisma.item.upsert({
        where: { name: 'Poké Ball' },
        update: {
          category,
          description,
          price,
          sprite: spritePath
        },
        create: {
          name: 'Poké Ball',
          category,
          description,
          price,
          sprite: spritePath
        }
      });
    }

    upsertCount++;
  }

  // Garantir itens essenciais específicos de Kanto Fire Red
  const specialItems = [
    {
      name: 'Town Map',
      category: 'key_item',
      description: 'A convenient map that can be viewed at any time. It even shows your present location in Kanto.',
      price: 0,
      sprite: '/assets/items/town-map.png'
    }
  ];

  for (const spec of specialItems) {
    await prisma.item.upsert({
      where: { name: spec.name },
      update: {
        category: spec.category,
        description: spec.description,
        price: spec.price,
        sprite: spec.sprite
      },
      create: spec
    });
  }

  const totalInDb = await prisma.item.count();
  console.log(`🎉 Sucesso! Total de itens cadastrados no banco de dados: ${totalInDb}`);
}

main()
  .catch((err) => {
    console.error('Erro na importação de itens:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
