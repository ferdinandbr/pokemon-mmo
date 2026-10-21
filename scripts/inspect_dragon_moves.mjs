import { MOVES_BY_ID } from '../client/src/battle/movesDatabase.js';

const targetNames = ['Roar of Time', 'Draco Meteor', 'Outrage', 'Dual Chop', 'Twister', 'Dragon Rage', 'Dragon Dance', 'Dragon Ascent'];

Object.values(MOVES_BY_ID).forEach(m => {
  if (targetNames.some(t => m.name.toLowerCase() === t.toLowerCase() || m.internalName.toLowerCase() === t.replace(/\s+/g, '').toLowerCase())) {
    console.log(`[#${m.id}] ${m.name} (${m.internalName}) - Cat: ${m.category}, Exec: ${m.executionType}, Family: ${m.vfxFamily}`);
    console.log('   visual:', JSON.stringify(m.visual));
    console.log('   combatBehavior:', JSON.stringify(m.combatBehavior));
  }
});
