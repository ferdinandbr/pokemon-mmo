require('dotenv').config();
const prisma = require('../src/database');

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Uso: node set_admin.js <email> [admin|user]');
    console.log('Exemplo: node set_admin.js ash@pallet.com admin');
    process.exit(1);
  }

  const email = args[0].trim().toLowerCase();
  const role = (args[1] || 'admin').toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error(`❌ Usuário com o email "${email}" não foi encontrado.`);
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
