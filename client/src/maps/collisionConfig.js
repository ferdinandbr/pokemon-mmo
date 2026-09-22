export const COLLISION_TYPES = Object.freeze({
  NONE: 0,
  SOLID: 1,
  LEDGE_DOWN: 2,
  LEDGE_LEFT: 3,
  LEDGE_RIGHT: 4,
  LEDGE_UP: 5,
  WALKABLE_OVERRIDE: 6,
});

export const COLLISION_META = Object.freeze({
  [COLLISION_TYPES.SOLID]: {
    id: COLLISION_TYPES.SOLID,
    name: 'Sólido (Bloqueio Total)',
    shortName: 'Sólido',
    icon: '🟥',
    color: 0xff1744,
    colorHex: '#ff1744',
    fillAlpha: 0.38,
    strokeAlpha: 0.85,
    direction: null
  },
  [COLLISION_TYPES.LEDGE_DOWN]: {
    id: COLLISION_TYPES.LEDGE_DOWN,
    name: 'Barranco (Descer ⬇️)',
    shortName: 'Descer ⬇️',
    icon: '⬇️',
    color: 0xff9100,
    colorHex: '#ff9100',
    fillAlpha: 0.45,
    strokeAlpha: 0.95,
    direction: 'down'
  },
  [COLLISION_TYPES.LEDGE_LEFT]: {
    id: COLLISION_TYPES.LEDGE_LEFT,
    name: 'Barranco (Esquerda ⬅️)',
    shortName: 'Esquerda ⬅️',
    icon: '⬅️',
    color: 0xff9100,
    colorHex: '#ff9100',
    fillAlpha: 0.45,
    strokeAlpha: 0.95,
    direction: 'left'
  },
  [COLLISION_TYPES.LEDGE_RIGHT]: {
    id: COLLISION_TYPES.LEDGE_RIGHT,
    name: 'Barranco (Direita ➡️)',
    shortName: 'Direita ➡️',
    icon: '➡️',
    color: 0xff9100,
    colorHex: '#ff9100',
    fillAlpha: 0.45,
    strokeAlpha: 0.95,
    direction: 'right'
  },
  [COLLISION_TYPES.LEDGE_UP]: {
    id: COLLISION_TYPES.LEDGE_UP,
    name: 'Barranco (Subir ⬆️)',
    shortName: 'Subir ⬆️',
    icon: '⬆️',
    color: 0xff9100,
    colorHex: '#ff9100',
    fillAlpha: 0.45,
    strokeAlpha: 0.95,
    direction: 'up'
  },
  [COLLISION_TYPES.WALKABLE_OVERRIDE]: {
    id: COLLISION_TYPES.WALKABLE_OVERRIDE,
    name: 'Livre / Passável (Apagar Colisão de Camada)',
    shortName: 'Passável',
    icon: '🟩',
    color: 0x00e676,
    colorHex: '#00e676',
    fillAlpha: 0.28,
    strokeAlpha: 0.85,
    direction: null
  }
});
