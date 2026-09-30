const moveRegistry = require('../server/src/services/moves/MoveRegistry');
const battleManager = require('../server/src/services/battle/BattleManager');
const prisma = require('../server/src/database');

async function test() {
  await moveRegistry.init();
  const state = await battleManager.startWildBattle(4);
  console.log('Battle State Public:');
  console.log(JSON.stringify(state, null, 2));
}

test().catch(console.error).finally(() => prisma.$disconnect());
