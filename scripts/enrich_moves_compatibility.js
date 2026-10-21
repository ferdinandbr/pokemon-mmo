import fs from 'fs';
import { MOVES_BY_ID } from '../client/src/battle/movesDatabase.js';

export const INCOMPATIBLE_ACTIVE_COMBAT_MOVES = new Set([
  // 1. Manipuladores de Turnos e Ordem de Fila
  'TRICKROOM', 'QUASH', 'AFTERYOU', 'MEFIRST', 'BATONPASS', 'PURSUIT', 'ROUND', 'ECHOEDVOICE',
  'BIDE', 'ENCORE', 'DISABLE', 'TORMENT', 'IMPRISON', 'SPITE', 'GRUDGE', 'PERISHSONG', 'YAWN', 'SNATCH',

  // 2. Suporte Exclusivo para Batalhas em Duplas
  'FOLLOWME', 'RAGEPOWDER', 'ALLYSWITCH', 'HELPINGHAND', 'WIDEGUARD', 'QUICKGUARD', 'HEALPULSE', 'CRAFTYSHIELD',

  // 3. Dependentes de Itens Segurados (sem utilidade sem itens no combate ativo)
  'FLING', 'NATURALGIFT', 'SWITCHEROO', 'TRICK', 'BESTOW', 'EMBARGO',

  // 4. Manipuladores de Habilidades Passivas (Abilities)
  'SKILLSWAP', 'WORRYSEED', 'GASTROACID', 'SIMPLEBEAM', 'ENTRAINMENT', 'ROLEPLAY',

  // 5. Gimmicks Inúteis, Cópia Caótica ou Meta-específicos
  'SPLASH', 'CELEBRATE', 'HOLDHANDS', 'HAPPYHOUR', 'SYNCHRONOISE', 'METRONOME', 'ASSIST', 'COPYCAT', 'MIRRORMOVE', 'SLEEPTALK', 'SNORE', 'SKETCH', 'MIMIC',
  'CONVERSION', 'CONVERSION2', 'REFLECTTYPE', 'SOAK', 'CAMOUFLAGE', 'NATUREPOWER', 'SECRETPOWER',
  'PAINSPLIT', 'POWERSPLIT', 'GUARDSPLIT', 'HEARTSWAP', 'POWERSWAP', 'GUARDSWAP', 'PSYCHUP', 'TOPSYTURVY', 'WONDERROOM', 'MAGICROOM',
  'BEATUP', 'STOCKPILE', 'SPITUP', 'SWALLOW', 'FORESIGHT', 'ODORSLEUTH', 'MIRACLEEYE', 'LOCKON', 'MINDREADER', 'TELEKINESIS', 'GRAVITY',
  'ATTRACT', 'CAPTIVATE', 'RETURN', 'FRUSTRATION', 'ENDURE', 'DESTINYBOND', 'HAZE', 'CLEARSMOG',
  'MUDSPORT', 'WATERSPORT', 'AROMATICMIST', 'MAGNETICFLUX', 'ROTOTILLER', 'FLOWERSHIELD',
  'ELECTRIFY', 'IONDELUGE', 'TELEPORT',

  // 6. Debuffs Puros Numéricos (-1 / -2 Stat Stages invisíveis sem presença física)
  'LEER', 'TAILWHIP', 'GROWL', 'SCREECH', 'CHARM', 'COTTONSPORE', 'FLASH', 'KINESIS', 'SANDATTACK', 'SMOKESCREEN',
  'BABYDOLLEYES', 'CONFIDE', 'EERIEIMPULSE', 'FAKETEARS', 'FEATHERDANCE', 'METALSOUND', 'NOBLEROAR', 'PLAYNICE', 'SCARYFACE', 'SWEETSCENT', 'TICKLE'
]);

const updatedMovesById = {};
let deactCount = 0;
let activeCount = 0;

for (const id in MOVES_BY_ID) {
  const move = { ...MOVES_BY_ID[id] };
  const isIncomp = INCOMPATIBLE_ACTIVE_COMBAT_MOVES.has(move.internalName.toUpperCase());
  move.activeCombatCompatible = !isIncomp;
  if (isIncomp) {
    deactCount++;
  } else {
    activeCount++;
  }
  updatedMovesById[id] = move;
}

console.log(`[MovesCompatibility] Processados ${Object.keys(updatedMovesById).length} golpes:`);
console.log(`  -> Compatíveis Ativos: ${activeCount}`);
console.log(`  -> Desativados (Incompatíveis): ${deactCount}`);

const fileHeader = `// Auto-generated Comprehensive Moves Database from PokeMMO (621 Moves)
// Enriched with VFX Families, Combat Behavior, Exact Move Spec & Active Combat Compatibility Flags

export const INCOMPATIBLE_ACTIVE_COMBAT_MOVES = new Set(${JSON.stringify(Array.from(INCOMPATIBLE_ACTIVE_COMBAT_MOVES))});

export const MOVES_BY_ID = ${JSON.stringify(updatedMovesById, null, 2)};

export const MOVES_BY_NAME = {};
export const MOVES_BY_INTERNAL = {};

for (const id in MOVES_BY_ID) {
  const move = MOVES_BY_ID[id];
  if (move.name) MOVES_BY_NAME[move.name.toLowerCase()] = move;
  if (move.internalName) MOVES_BY_INTERNAL[move.internalName.toUpperCase()] = move;
}

export function isActiveCombatMove(identifier) {
  const move = getMoveData(identifier);
  return Boolean(move && move.activeCombatCompatible !== false);
}

export function getMoveData(identifier) {
  if (!identifier) return null;
  if (typeof identifier === 'number') return MOVES_BY_ID[identifier] || null;
  if (typeof identifier === 'object') {
    const id = identifier.moveId || identifier.id;
    if (id && MOVES_BY_ID[id]) return MOVES_BY_ID[id];
    const name = identifier.name || identifier.internalName;
    if (name) return getMoveData(name);
    return null;
  }
  const str = String(identifier).trim();
  const num = parseInt(str, 10);
  if (!isNaN(num) && MOVES_BY_ID[num]) return MOVES_BY_ID[num];
  const byName = MOVES_BY_NAME[str.toLowerCase()];
  if (byName) return byName;
  const byInternal = MOVES_BY_INTERNAL[str.toUpperCase()];
  if (byInternal) return byInternal;
  return null;
}
`;

fs.writeFileSync('client/src/battle/movesDatabase.js', fileHeader, 'utf8');
console.log('[MovesCompatibility] client/src/battle/movesDatabase.js atualizado com sucesso!');
