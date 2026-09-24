const path = require('path');
const fs = require('fs');

const serverNodeModules = path.resolve(__dirname, '../server/node_modules');
if (fs.existsSync(serverNodeModules)) {
  module.paths.push(serverNodeModules);
}

// Load environment variables
const envPaths = [
  path.resolve(__dirname, '../server/.env'),
  path.resolve(__dirname, '../.env')
];

let loadedEnv = false;
try {
  const dotenv = require(path.join(serverNodeModules, 'dotenv'));
  envPaths.forEach(p => { if (fs.existsSync(p)) dotenv.config({ path: p }); });
  dotenv.config();
  loadedEnv = true;
} catch (e) {}

if (!loadedEnv) {
  envPaths.forEach(p => {
    if (fs.existsSync(p)) {
      const lines = fs.readFileSync(p, 'utf-8').split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = (match[2] || '').trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  });
}

const prisma = require('../server/src/database');

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Uso: node scripts/set_admin.js <email> [admin|user]');
    console.log('Exemplo: node scripts/set_admin.js admin@gmail.com admin');
    process.exit(1);
  }

  const email = args[0].trim().toLowerCase();
  const role = (args[1] || 'admin').toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error(`❌ Usuário com o email "${email}" não foi encontrado no banco de dados.`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role }
  });

  console.log(`✅ Sucesso! O usuário "${updated.name}" (${updated.email}) agora possui o cargo: ${updated.role.toUpperCase()}`);
}

main()
  .catch((err) => {
    console.error('Erro:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
