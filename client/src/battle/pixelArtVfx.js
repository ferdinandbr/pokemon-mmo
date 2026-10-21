// Cinematic VFX & Procedural Attack Animation Engine for Pokemon Arena 2D
// Smooth, luminous, anti-aliased combat visuals with radial gradients & additive lighting
// Zero redundant state pushes: single save/restore per effect for locked 60 FPS

export const PIXEL_COLOR_PALETTES = {
  fire: {
    1: '#FFFFFF',
    2: '#FFF176',
    3: '#FF9100',
    4: '#E64A19',
    5: '#BF360C',
  },
  water: {
    1: '#FFFFFF',
    2: '#80D8FF',
    3: '#00B0FF',
    4: '#0288D1',
    5: '#01579B',
  },
  electric: {
    1: '#FFFFFF',
    2: '#FFFF00',
    3: '#FFD600',
    4: '#FF9100',
  },
  grass: {
    1: '#CCFF90',
    2: '#76FF03',
    3: '#43A047',
    4: '#1B5E20',
  },
  ghost: {
    1: '#E1BEE7',
    2: '#BA68C8',
    3: '#7B1FA2',
    4: '#4A148C',
    5: '#1A002C',
  },
  psychic: {
    1: '#FFFFFF',
    2: '#FF80AB',
    3: '#F50057',
    4: '#880E4F',
  },
  dark: {
    1: '#F3E5F5',
    2: '#BA68C8',
    3: '#4A148C',
    4: '#26004D',
    5: '#0D001A',
  },
  dragon: {
    1: '#E0F7FA',
    2: '#00E5FF',
    3: '#0091EA',
    4: '#311B92',
  },
  normal: {
    1: '#FFFFFF',
    2: '#EEEEEE',
    3: '#BDBDBD',
    4: '#616161',
  },
  poison: {
    1: '#F3E5F5',
    2: '#BA68C8',
    3: '#8E24AA',
    4: '#4A148C',
  },
  ground: {
    1: '#FFF8E1',
    2: '#D7CCC8',
    3: '#A1887F',
    4: '#6D4C41',
    5: '#3E2723',
  },
  steel: {
    1: '#FFFFFF',
    2: '#CFD8DC',
    3: '#90A4AE',
    4: '#455A64',
  },
  fighting: {
    1: '#FFCCBC',
    2: '#FF8A65',
    3: '#D84315',
    4: '#4E342E',
  },
  flying: {
    1: '#E1F5FE',
    2: '#81D4FA',
    3: '#0288D1',
    4: '#01579B',
  },
  bug: {
    1: '#F1F8E9',
    2: '#C5E1A5',
    3: '#7CB342',
    4: '#33691E',
  },
  fairy: {
    1: '#FFFFFF',
    2: '#F8BBD0',
    3: '#EC407A',
    4: '#880E4F',
  },
  rock: {
    1: '#CFD8DC',
    2: '#90A4AE',
    3: '#546E7A',
    4: '#263238',
    5: '#102027',
  },
  ice: {
    1: '#FFFFFF',
    2: '#E0F7FA',
    3: '#80DEEA',
    4: '#00ACC1',
    5: '#006064',
  },
};

// Frame matrices preserved for backwards compatibility with projectile system
export const EMBER_FRAMES = [
  [
    [0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 5, 4, 5, 0, 0, 0],
    [0, 5, 4, 3, 4, 5, 0, 0],
    [0, 5, 4, 2, 3, 4, 5, 0],
    [5, 4, 3, 1, 2, 3, 4, 5],
    [5, 4, 3, 1, 1, 2, 4, 5],
    [0, 5, 4, 3, 2, 4, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
  ],
  [
    [0, 0, 5, 4, 0, 0, 0, 0],
    [0, 0, 5, 3, 5, 0, 5, 0],
    [0, 5, 4, 2, 4, 5, 4, 5],
    [5, 4, 3, 1, 2, 3, 4, 5],
    [5, 4, 2, 1, 1, 2, 4, 5],
    [5, 4, 3, 2, 1, 3, 4, 5],
    [0, 5, 4, 3, 2, 4, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
  ],
  [
    [0, 0, 0, 0, 5, 4, 0, 0],
    [0, 5, 0, 5, 3, 4, 5, 0],
    [5, 4, 5, 4, 2, 3, 4, 5],
    [5, 4, 3, 1, 1, 2, 4, 5],
    [0, 5, 4, 1, 1, 3, 4, 0],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [0, 5, 4, 3, 3, 4, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
  ],
];

export const WATER_DROPLET_FRAMES = [
  [
    [0, 0, 0, 5, 5, 0, 0, 0],
    [0, 0, 5, 3, 3, 5, 0, 0],
    [0, 5, 3, 2, 1, 3, 5, 0],
    [5, 4, 3, 1, 1, 3, 4, 5],
    [5, 4, 3, 3, 3, 4, 4, 5],
    [5, 5, 4, 4, 4, 5, 5, 5],
    [0, 5, 5, 5, 5, 5, 5, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
];

export const ELECTRIC_SPARK_FRAMES = [
  [
    [0, 0, 0, 4, 0, 0, 0, 0],
    [0, 0, 4, 3, 0, 0, 0, 0],
    [0, 4, 2, 1, 4, 0, 0, 0],
    [0, 0, 4, 1, 2, 4, 0, 0],
    [0, 0, 0, 4, 1, 3, 4, 0],
    [0, 0, 0, 0, 4, 1, 4, 0],
    [0, 0, 0, 0, 0, 4, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
];

export const SHADOW_BALL_FRAMES = [
  [
    [0, 0, 5, 5, 5, 5, 0, 0],
    [0, 5, 4, 3, 3, 4, 5, 0],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [5, 3, 2, 1, 1, 2, 3, 5],
    [5, 3, 2, 1, 1, 2, 3, 5],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [0, 5, 4, 3, 3, 4, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
  ],
];

export const DARK_WAVE_FRAMES = [
  [
    [0, 0, 0, 5, 5, 0, 0, 0],
    [0, 0, 5, 4, 4, 5, 0, 0],
    [0, 5, 4, 3, 3, 4, 5, 0],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [5, 3, 2, 1, 1, 2, 3, 5],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [0, 5, 4, 3, 3, 4, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
  ],
];

export const DARK_PULSE_FRAMES = [
  [
    [0, 0, 5, 5, 5, 5, 0, 0],
    [0, 5, 4, 3, 3, 4, 5, 0],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [5, 3, 2, 1, 1, 2, 3, 5],
    [5, 3, 2, 1, 1, 2, 3, 5],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [0, 5, 4, 3, 3, 4, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
  ],
];

export const NIGHT_DAZE_FRAMES = [
  [
    [0, 0, 5, 5, 5, 5, 0, 0],
    [0, 5, 4, 3, 3, 4, 5, 0],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [5, 3, 2, 1, 1, 2, 3, 5],
    [5, 3, 2, 1, 1, 2, 3, 5],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [0, 5, 4, 3, 3, 4, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
  ],
];

export const RAZOR_LEAF_FRAMES = [
  [
    [0, 0, 0, 4, 0, 0, 0, 0],
    [0, 0, 4, 3, 4, 0, 0, 0],
    [0, 4, 3, 2, 3, 4, 0, 0],
    [4, 3, 2, 1, 2, 3, 4, 0],
    [0, 4, 3, 1, 2, 3, 4, 0],
    [0, 0, 4, 2, 3, 4, 0, 0],
    [0, 0, 0, 4, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
];

export const FOCUS_BLAST_FRAMES = [
  [
    [0, 0, 4, 4, 4, 4, 0, 0],
    [0, 4, 3, 2, 2, 3, 4, 0],
    [4, 3, 2, 1, 1, 2, 3, 4],
    [4, 2, 1, 1, 1, 1, 2, 4],
    [4, 2, 1, 1, 1, 1, 2, 4],
    [4, 3, 2, 1, 1, 2, 3, 4],
    [0, 4, 3, 2, 2, 3, 4, 0],
    [0, 0, 4, 4, 4, 4, 0, 0],
  ],
];

export const POISON_SLUDGE_FRAMES = [
  [
    [0, 0, 0, 4, 4, 0, 0, 0],
    [0, 0, 4, 3, 3, 4, 0, 0],
    [0, 4, 3, 2, 1, 3, 4, 0],
    [4, 3, 2, 1, 1, 2, 3, 4],
    [4, 3, 3, 2, 2, 3, 3, 4],
    [4, 4, 3, 3, 3, 3, 4, 4],
    [0, 4, 4, 4, 4, 4, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
];

export const ROCK_SHARD_FRAMES = [
  [
    [0, 0, 0, 5, 5, 0, 0, 0],
    [0, 0, 5, 3, 2, 5, 0, 0],
    [0, 5, 3, 2, 1, 2, 5, 0],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [5, 4, 4, 3, 3, 4, 4, 5],
    [0, 5, 5, 4, 4, 5, 5, 0],
    [0, 0, 0, 5, 5, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
];

export const HORN_DRILL_FRAMES = [
  [
    [0, 0, 0, 4, 4, 0, 0, 0],
    [0, 0, 4, 2, 1, 4, 0, 0],
    [0, 4, 3, 2, 1, 2, 4, 0],
    [4, 3, 3, 2, 2, 3, 3, 4],
    [4, 4, 3, 3, 3, 3, 4, 4],
    [0, 4, 4, 4, 4, 4, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
];

export const SPIDER_WEB_FRAMES = [
  [
    [4, 0, 0, 4, 0, 0, 0, 4],
    [0, 3, 0, 3, 0, 3, 0, 0],
    [0, 0, 2, 2, 2, 0, 0, 0],
    [4, 3, 2, 1, 2, 3, 4, 0],
    [0, 0, 2, 2, 2, 0, 0, 0],
    [0, 3, 0, 3, 0, 3, 0, 0],
    [4, 0, 0, 4, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
];

export const FIRE_BLAST_KANJI = [
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 3, 3, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 2, 2, 3, 3, 2, 2, 1, 1, 1, 1],
  [1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1],
  [0, 1, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 1, 0],
  [0, 0, 0, 0, 1, 2, 3, 3, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 3, 2, 2, 3, 2, 1, 0, 0, 0],
  [0, 0, 1, 2, 3, 2, 0, 0, 2, 3, 2, 1, 0, 0],
  [0, 1, 2, 3, 2, 0, 0, 0, 0, 2, 3, 2, 1, 0],
  [1, 2, 3, 2, 1, 0, 0, 0, 0, 1, 2, 3, 2, 1],
  [1, 3, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1],
  [1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1],
];

export const BITE_FANGS_TOP = [
  [5, 4, 4, 5, 0, 0, 5, 4, 4, 5],
  [5, 3, 2, 5, 0, 0, 5, 2, 3, 5],
  [5, 2, 1, 5, 0, 0, 5, 1, 2, 5],
  [0, 5, 1, 5, 0, 0, 5, 1, 5, 0],
  [0, 0, 5, 0, 0, 0, 0, 5, 0, 0],
];

export const BITE_FANGS_BOTTOM = [
  [0, 0, 5, 0, 0, 0, 0, 5, 0, 0],
  [0, 5, 1, 5, 0, 0, 5, 1, 5, 0],
  [5, 2, 1, 5, 0, 0, 5, 1, 2, 5],
  [5, 3, 2, 5, 0, 0, 5, 2, 3, 5],
  [5, 4, 4, 5, 0, 0, 5, 4, 4, 5],
];

export function renderPixelMatrix(ctx, cx, cy, matrix, colorMap, pixelSize = 3, rotation = 0, alpha = 1.0) {
  if (!matrix || matrix.length === 0 || !colorMap) return;
  const rows = matrix.length;
  const cols = matrix[0].length;
  const totalW = cols * pixelSize;
  const totalH = rows * pixelSize;

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.translate(cx, cy);

  if (rotation !== 0) {
    ctx.rotate(rotation);
  }

  const ox = -totalW / 2;
  const oy = -totalH / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = matrix[r][c];
      if (val !== 0 && colorMap[val]) {
        ctx.fillStyle = colorMap[val];
        ctx.fillRect(ox + c * pixelSize, oy + r * pixelSize, pixelSize, pixelSize);
      }
    }
  }

  ctx.restore();
}

/**
 * Render Cinematic Curved Energy Claw Slash (Fast batched stroke)
 */
export function renderPixelSlash(ctx, cx, cy, progress, color = '#00E5FF') {
  ctx.save();
  const alpha = Math.sin(progress * Math.PI);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }

  ctx.globalCompositeOperation = 'lighter';
  const len = 40 + progress * 24;

  for (let s = -1; s <= 1; s++) {
    const offsetX = s * 13;
    const offsetY = s * 9;
    const startX = cx + offsetX - len * 0.7;
    const startY = cy + offsetY - len * 0.5;
    const ctrlX = cx + offsetX + 4;
    const ctrlY = cy + offsetY - 2;
    const endX = cx + offsetX + len * 0.75;
    const endY = cy + offsetY + len * 0.55;

    // Outer blade
    ctx.globalAlpha = alpha * 0.55;
    ctx.lineWidth = 6.0;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    ctx.stroke();

    // Inner blade
    ctx.globalAlpha = alpha * 0.95;
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    ctx.stroke();

    // Sparks
    for (let sp = 0; sp < 2; sp++) {
      const spProgress = (progress * 1.5 + sp * 0.4) % 1.0;
      const spX = startX + (endX - startX) * spProgress;
      const spY = startY + (endY - startY) * spProgress;
      ctx.globalAlpha = alpha * (1 - spProgress);
      ctx.fillStyle = sp === 0 ? '#FFFFFF' : color;
      ctx.beginPath();
      ctx.arc(spX, spY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Render Cinematic Crossed Energy Slash
 */
export function renderPixelCrossSlash(ctx, cx, cy, progress, color = '#76FF03') {
  ctx.save();
  const alpha = Math.sin(progress * Math.PI);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }

  ctx.globalCompositeOperation = 'lighter';
  const len = 42 + progress * 26;

  // Slash 1
  ctx.lineCap = 'round';
  ctx.globalAlpha = alpha * 0.6;
  ctx.lineWidth = 6.5;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx - len, cy - len * 0.7);
  ctx.quadraticCurveTo(cx, cy, cx + len, cy + len * 0.7);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.95;
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(cx - len, cy - len * 0.7);
  ctx.quadraticCurveTo(cx, cy, cx + len, cy + len * 0.7);
  ctx.stroke();

  // Slash 2
  ctx.globalAlpha = alpha * 0.6;
  ctx.lineWidth = 6.5;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx + len, cy - len * 0.7);
  ctx.quadraticCurveTo(cx, cy, cx - len, cy + len * 0.7);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.95;
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(cx + len, cy - len * 0.7);
  ctx.quadraticCurveTo(cx, cy, cx - len, cy + len * 0.7);
  ctx.stroke();

  // Center intersection flash
  const flashR = (1 - progress) * 16;
  ctx.globalAlpha = alpha * 0.5;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, flashR, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = alpha * 0.9;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, flashR * 0.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Render Cinematic Crunch / Bite Jaws
 */
export function renderPixelBite(ctx, cx, cy, progress) {
  ctx.save();
  const clampDist = Math.max(0, (1 - Math.min(1, progress * 2.4)) * 32);
  const alpha = progress < 0.65 ? 1.0 : (1 - (progress - 0.65) / 0.35);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }

  ctx.globalCompositeOperation = 'lighter';
  const jawWidth = 26;

  // Top Jaws
  for (let f = -1; f <= 1; f += 2) {
    const fx = cx + f * (jawWidth * 0.45);
    const fy = cy - clampDist;
    ctx.fillStyle = '#BA68C8';
    ctx.beginPath();
    ctx.moveTo(fx - 5, fy - 8);
    ctx.lineTo(fx + 5, fy - 8);
    ctx.lineTo(fx, fy + 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(fx - 2, fy - 7);
    ctx.lineTo(fx + 2, fy - 7);
    ctx.lineTo(fx, fy + 7);
    ctx.closePath();
    ctx.fill();
  }

  // Bottom Jaws
  for (let f = -1; f <= 1; f += 2) {
    const fx = cx + f * (jawWidth * 0.45);
    const fy = cy + clampDist;
    ctx.fillStyle = '#BA68C8';
    ctx.beginPath();
    ctx.moveTo(fx - 5, fy + 8);
    ctx.lineTo(fx + 5, fy + 8);
    ctx.lineTo(fx, fy - 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(fx - 2, fy + 7);
    ctx.lineTo(fx + 2, fy + 7);
    ctx.lineTo(fx, fy - 7);
    ctx.closePath();
    ctx.fill();
  }

  // Impact snap
  if (progress > 0.4) {
    const snapT = (progress - 0.4) / 0.6;
    const snapAlpha = (1 - snapT) * alpha;

    ctx.globalAlpha = snapAlpha * 0.9;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx, cy, 14 * (1 - snapT), 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#BA68C8';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.ellipse(cx, cy, snapT * 38, snapT * 22, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Render Expanding Cinematic Fire Blast
 */
export function renderPixelFireBlast(ctx, cx, cy, progress) {
  ctx.save();
  const alpha = progress < 0.6 ? 1.0 : (1 - (progress - 0.6) / 0.4);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }

  ctx.globalCompositeOperation = 'lighter';
  const scale = 1.0 + progress * 2.2;

  // 1. Central Detonation Heat Flare
  const heatR = (18 + progress * 45) * scale * 0.5;
  ctx.globalAlpha = alpha * 0.45;
  ctx.fillStyle = '#FF9100';
  ctx.beginPath();
  ctx.arc(cx, cy, heatR, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = alpha * 0.75;
  ctx.fillStyle = '#FFF176';
  ctx.beginPath();
  ctx.arc(cx, cy, heatR * 0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = alpha * 0.95;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, heatR * 0.25, 0, Math.PI * 2);
  ctx.fill();

  // 2. Fluid strokes of Kanji '大'
  const strokes = [
    { x1: -22 * scale, y1: -4 * scale, x2: 22 * scale, y2: -4 * scale },
    { x1: 0, y1: -24 * scale, x2: -18 * scale, y2: 24 * scale, cx: -4 * scale, cy: 0 },
    { x1: 0, y1: -4 * scale, x2: 18 * scale, y2: 24 * scale, cx: 8 * scale, cy: 10 * scale },
  ];

  ctx.lineCap = 'round';
  for (let i = 0; i < strokes.length; i++) {
    const str = strokes[i];

    ctx.globalAlpha = alpha * 0.6;
    ctx.lineWidth = 5.5;
    ctx.strokeStyle = '#FF5722';
    ctx.beginPath();
    ctx.moveTo(cx + str.x1, cy + str.y1);
    if (str.cx !== undefined) ctx.quadraticCurveTo(cx + str.cx, cy + str.cy, cx + str.x2, cy + str.y2);
    else ctx.lineTo(cx + str.x2, cy + str.y2);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.95;
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = '#FFF176';
    ctx.beginPath();
    ctx.moveTo(cx + str.x1, cy + str.y1);
    if (str.cx !== undefined) ctx.quadraticCurveTo(cx + str.cx, cy + str.cy, cx + str.x2, cy + str.y2);
    else ctx.lineTo(cx + str.x2, cy + str.y2);
    ctx.stroke();
  }

  // 3. Expanding fiery shockwave ring
  const ringR = progress * 88;
  ctx.globalAlpha = (1 - progress) * alpha * 0.85;
  ctx.strokeStyle = '#FF9100';
  ctx.lineWidth = Math.max(1, (1 - progress) * 3.5);
  ctx.beginPath();
  ctx.ellipse(cx, cy, ringR, ringR * 0.6, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Render Energized Concussive Impact / Punch
 */
export function renderPixelPunch(ctx, cx, cy, progress, color = '#FF9100') {
  ctx.save();
  const alpha = 1.0 - progress;
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }

  ctx.globalCompositeOperation = 'lighter';
  const dist = 14 + progress * 32;

  // 1. Central Impact Flash Disc
  const flashR = (1 - progress) * 20;
  ctx.globalAlpha = alpha * 0.55;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, flashR, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = alpha * 0.95;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, flashR * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // 2. 8 Radial Energy Impact Spikes
  ctx.globalAlpha = alpha * 0.85;
  ctx.fillStyle = color;
  for (let a = 0; a < 8; a++) {
    const ang = (a / 8) * Math.PI * 2;
    const perpAng = ang + Math.PI / 2;
    const tipX = cx + Math.cos(ang) * dist;
    const tipY = cy + Math.sin(ang) * dist * 0.72;
    const baseDist = dist * 0.35;
    const baseW = 4.0 * (1 - progress);
    const b1x = cx + Math.cos(ang) * baseDist + Math.cos(perpAng) * baseW;
    const b1y = cy + Math.sin(ang) * baseDist * 0.72 + Math.sin(perpAng) * baseW;
    const b2x = cx + Math.cos(ang) * baseDist - Math.cos(perpAng) * baseW;
    const b2y = cy + Math.sin(ang) * baseDist * 0.72 - Math.sin(perpAng) * baseW;

    ctx.beginPath();
    ctx.moveTo(b1x, b1y);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(b2x, b2y);
    ctx.closePath();
    ctx.fill();
  }

  // 3. Shockwave Ring
  ctx.globalAlpha = alpha * 0.65;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = Math.max(1, (1 - progress) * 2.8);
  ctx.beginPath();
  ctx.ellipse(cx, cy, dist * 0.85, dist * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Render Ultra-Cinematic Thunder Strike
 */
export function renderPixelLightningBolt(ctx, targetX, targetY, progress) {
  ctx.save();
  const alpha = progress < 0.6 ? 1.0 : (1 - (progress - 0.6) / 0.4);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }

  ctx.globalCompositeOperation = 'lighter';
  const startY = targetY - 280;
  const segments = 12;
  const points = [{ x: targetX, y: startY }];
  const stepY = (targetY - startY) / segments;

  let curX = targetX;
  let curY = startY;

  for (let i = 1; i <= segments; i++) {
    curY += stepY;
    if (i === segments) {
      curX = targetX;
    } else {
      const jitter = Math.sin(i * 3.7 + progress * 14) * 26 + Math.sin(i * 8.9) * 12;
      curX = targetX + jitter;
    }
    points.push({ x: curX, y: curY });
  }

  // Pass 1: Electric corona
  ctx.lineCap = 'round';
  ctx.lineJoin = 'miter';
  ctx.globalAlpha = alpha * 0.42;
  ctx.strokeStyle = '#FF9100';
  ctx.lineWidth = 8.0;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.stroke();

  // Pass 2: Yellow plasma
  ctx.globalAlpha = alpha * 0.85;
  ctx.strokeStyle = '#FFFF00';
  ctx.lineWidth = 3.8;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.stroke();

  // Pass 3: White razor core
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.stroke();

  // Ground Impact
  const impactR = progress * 48;
  ctx.globalAlpha = alpha * 0.9;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(targetX, targetY, 18 * (1 - progress), 9 * (1 - progress), 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FFFF00';
  ctx.lineWidth = Math.max(1, (1 - progress) * 2.8);
  ctx.beginPath();
  ctx.ellipse(targetX, targetY, impactR, impactR * 0.52, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Render Cinematic Tectonic Upheaval (Stone Edge)
 */
export function renderPixelStoneEdge(ctx, targetX, targetY, progress) {
  ctx.save();
  const t = Math.max(0, Math.min(1, progress));
  const heightMult = t < 0.35 
    ? Math.sin((t / 0.35) * Math.PI * 0.5) 
    : (t < 0.75 ? 1.0 : 1.0 - Math.pow((t - 0.75) / 0.25, 2));

  const alpha = t < 0.82 ? 1.0 : (1.0 - (t - 0.82) / 0.18);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  // 1. Fissure Network
  const fissureAlpha = Math.sin(Math.min(1.0, t * 1.5) * Math.PI) * alpha;
  if (fissureAlpha > 0.05) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = fissureAlpha * 0.75;
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = '#FFAB00';
    const crackArms = 5;
    for (let c = 0; c < crackArms; c++) {
      const crackAng = (c / crackArms) * Math.PI * 2 + (c * 0.3);
      const maxDist = (18 + (c % 3) * 10) * Math.min(1.0, t * 2.2);

      ctx.beginPath();
      ctx.moveTo(targetX, targetY);
      for (let s = 1; s <= 3; s++) {
        const segDist = (maxDist / 3) * s;
        const jitter = Math.sin(s * 7.1 + c) * 3.5;
        const nx = targetX + Math.cos(crackAng) * segDist - Math.sin(crackAng) * jitter;
        const ny = targetY + (Math.sin(crackAng) * segDist + Math.cos(crackAng) * jitter) * 0.45;
        ctx.lineTo(nx, ny);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = alpha;
  }

  // 2. Rock Spires
  const spires = [
    { dx: -24, dy: -4, h: 42, w: 14 },
    { dx: -10, dy: 6, h: 56, w: 18 },
    { dx: 4, dy: -8, h: 62, w: 20 },
    { dx: 18, dy: 4, h: 48, w: 16 },
    { dx: 30, dy: -2, h: 36, w: 12 },
  ];

  for (let i = 0; i < spires.length; i++) {
    const sp = spires[i];
    const curH = sp.h * heightMult;
    const bx = targetX + sp.dx;
    const by = targetY + sp.dy;

    // Shadow facet
    ctx.fillStyle = '#4E342E';
    ctx.beginPath();
    ctx.moveTo(bx - sp.w / 2, by);
    ctx.lineTo(bx, by - curH);
    ctx.lineTo(bx + sp.w * 0.1, by);
    ctx.closePath();
    ctx.fill();

    // Lit facet
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath();
    ctx.moveTo(bx, by - curH);
    ctx.lineTo(bx + sp.w / 2, by);
    ctx.lineTo(bx + sp.w * 0.1, by);
    ctx.closePath();
    ctx.fill();

    // Specular ridge
    ctx.strokeStyle = '#D7CCC8';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(bx, by - curH);
    ctx.lineTo(bx + sp.w * 0.1, by);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Render Translucent Crystalline Ice Block
 */
export function renderPixelIceBlock(ctx, cx, cy, size = 44, time = 0) {
  ctx.save();
  const w = size * 1.15;
  const h = size * 1.35;
  const ox = cx - w / 2;
  const oy = cy - h / 2 - 8;

  // Outer Cryogenic Glow
  ctx.fillStyle = 'rgba(128, 222, 234, 0.28)';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 8, w * 0.82, h * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ice Body
  ctx.fillStyle = 'rgba(0, 151, 167, 0.65)';
  ctx.beginPath();
  ctx.roundRect(ox, oy, w, h, 6);
  ctx.fill();

  // Refraction cuts
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = '#FFFFFF';
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(ox + 4, oy + h - 6);
  ctx.lineTo(ox + 4, oy + 4);
  ctx.lineTo(ox + w - 4, oy + 4);
  ctx.stroke();

  ctx.strokeStyle = '#E0F7FA';
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(ox + 4, oy + 12);
  ctx.lineTo(ox + w * 0.65, oy + h - 6);
  ctx.stroke();

  ctx.restore();
}

/**
 * Render Lightning Discharge Arcs (Paralysis Status)
 */
export function renderPixelParalysisArcs(ctx, cx, cy, time = 0) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // Electric Aura
  const zapPulse = Math.sin(time * 24.0) * 0.16 + 0.38;
  ctx.globalAlpha = zapPulse;
  ctx.fillStyle = 'rgba(255, 238, 88, 0.32)';
  ctx.beginPath();
  ctx.arc(cx, cy - 8, 30, 0, Math.PI * 2);
  ctx.fill();

  // 4 active arcs
  for (let a = 0; a < 4; a++) {
    const baseAng = (a / 4) * Math.PI * 2 + (time * 8);
    const r1 = 10 + Math.sin(time * 30 + a) * 4;
    const r2 = 26 + Math.cos(time * 20 + a) * 6;

    const x1 = cx + Math.cos(baseAng) * r1;
    const y1 = cy - 8 + Math.sin(baseAng) * r1 * 0.7;
    const x2 = cx + Math.cos(baseAng + 0.7) * r2;
    const y2 = cy - 8 + Math.sin(baseAng + 0.7) * r2 * 0.7;

    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.moveTo(x1, y1);

    const jx = (Math.sin(time * 45 + a * 5) - 0.5) * 12;
    const jy = (Math.cos(time * 45 + a * 5) - 0.5) * 12;
    ctx.lineTo((x1 + x2) * 0.5 + jx, (y1 + y2) * 0.5 + jy);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Render Infernal Burn Aura (Burn Status)
 */
export function renderPixelBurnFlames(ctx, cx, cy, time = 0) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // Heat Haze Glow
  const glowPulse = Math.sin(time * 8.0) * 0.12 + 0.42;
  ctx.fillStyle = 'rgba(255, 112, 67, 0.38)';
  ctx.globalAlpha = glowPulse;
  ctx.beginPath();
  ctx.arc(cx, cy - 6, 34, 0, Math.PI * 2);
  ctx.fill();

  // 3 Flame Columns
  const flameCols = [-14, 0, 14];
  for (let c = 0; c < 3; c++) {
    const fx = cx + flameCols[c];
    const fy = cy + 10;
    const phase = time * 11 + c * 2.1;
    const flameH = 32 + Math.sin(phase) * 8;
    const sway = Math.sin(phase * 1.2) * 5;

    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.moveTo(fx - 7, fy);
    ctx.quadraticCurveTo(fx - 4 + sway, fy - flameH * 0.5, fx + sway, fy - flameH);
    ctx.quadraticCurveTo(fx + 4 + sway, fy - flameH * 0.5, fx + 7, fy);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFF176';
    ctx.beginPath();
    ctx.moveTo(fx - 3.5, fy);
    ctx.quadraticCurveTo(fx - 2 + sway * 0.7, fy - flameH * 0.35, fx + sway * 0.7, fy - flameH * 0.65);
    ctx.quadraticCurveTo(fx + 2 + sway * 0.7, fy - flameH * 0.35, fx + 3.5, fy);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Render Poison Miasma (Poison Status)
 */
export function renderPixelPoisonBubbles(ctx, cx, cy, time = 0) {
  ctx.save();

  // Toxic Acid Puddle
  const puddlePulse = Math.sin(time * 6.0) * 0.12 + 0.52;
  ctx.globalAlpha = puddlePulse;
  ctx.fillStyle = '#4A148C';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 18, 24, 8.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Glow Aura
  ctx.globalAlpha = Math.sin(time * 5.0) * 0.12 + 0.38;
  ctx.fillStyle = 'rgba(142, 36, 170, 0.35)';
  ctx.beginPath();
  ctx.arc(cx, cy - 6, 30, 0, Math.PI * 2);
  ctx.fill();

  // Bubbles
  for (let b = 0; b < 4; b++) {
    const bt = (time * 0.85 + b * 0.25) % 1.0;
    const bx = cx + Math.sin(time * 3 + b * 2) * 18;
    const by = cy + 14 - bt * 42;
    const bRad = 2.5 + Math.sin(bt * Math.PI) * 2.5;

    ctx.globalAlpha = (1 - bt * 0.3) * 0.8;
    ctx.fillStyle = '#8E24AA';
    ctx.beginPath();
    ctx.arc(bx, by, bRad, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(bx - bRad * 0.35, by - bRad * 0.35, bRad * 0.32, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Render Pressurized Acid Geyser Burst
 */
export function renderPixelPoisonBurst(ctx, x, y, progress, color = '#8E24AA') {
  ctx.save();
  const t = Math.max(0, Math.min(1, progress));
  const alpha = Math.sin(t * Math.PI);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  // Expanding Toxic Shockwave
  const ringR = 10 + t * 44;
  ctx.strokeStyle = '#BA68C8';
  ctx.lineWidth = Math.max(1, (1 - t) * 3.5);
  ctx.beginPath();
  ctx.ellipse(x, y, ringR, ringR * 0.62, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Acid Droplets
  for (let d = 0; d < 8; d++) {
    const dCycle = (t * 1.4 + d * 0.12) % 1.0;
    const dAng = (d / 8) * Math.PI * 2;
    const dDist = dCycle * (34 + (d % 3) * 16);
    const dArc = Math.sin(dCycle * Math.PI) * (18 + (d % 2) * 12);
    const dx = x + Math.cos(dAng) * dDist;
    const dy = y + Math.sin(dAng) * dDist * 0.6 - dArc;

    ctx.fillStyle = d % 2 === 0 ? '#76FF03' : color;
    ctx.beginPath();
    ctx.arc(dx, dy, 3.0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Render Cinematic Continuous Plasma Beam (Início, Meio e Fim)
 * - Início (0.0 - 0.18): Focal charge orb & inflowing sparks at muzzle, spearhead extension to target.
 * - Meio (0.18 - 0.78): Sustained full-power plasma blast with longitudinal energy pulse, white core,
 *                       helical distortion rings, and explosive target impact detonation.
 * - Fim (0.78 - 1.0): Muzzle cutoff, tail detachment advancing to target, core extinguish & dissipation.
 */
export function renderPixelContinuousBeam(ctx, startX, startY, targetX, targetY, progress, type = 'water', width = 45) {
  ctx.save();
  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);

  const tLower = (type || 'water').toLowerCase();
  let pal = {
    glow: 'rgba(0, 160, 255, 0.48)',
    mid: '#00B0FF',
    inner: '#80D8FF',
    core: '#FFFFFF',
    particle: '#E1F5FE',
  };

  if (tLower === 'fire') {
    pal = {
      glow: 'rgba(255, 87, 34, 0.52)',
      mid: '#FF6D00',
      inner: '#FFD54F',
      core: '#FFFFFF',
      particle: '#FFF8E1',
    };
  } else if (tLower === 'electric') {
    pal = {
      glow: 'rgba(255, 234, 0, 0.52)',
      mid: '#FFD600',
      inner: '#FFFF8D',
      core: '#FFFFFF',
      particle: '#FFFDE7',
    };
  } else if (tLower === 'grass' || tLower === 'bug') {
    pal = {
      glow: 'rgba(118, 255, 3, 0.50)',
      mid: '#64DD17',
      inner: '#CCFF90',
      core: '#FFFFFF',
      particle: '#F1F8E9',
    };
  } else if (tLower === 'ice') {
    pal = {
      glow: 'rgba(0, 229, 255, 0.50)',
      mid: '#00E5FF',
      inner: '#80DEEA',
      core: '#FFFFFF',
      particle: '#E0F7FA',
    };
  } else if (tLower === 'ghost' || tLower === 'dark') {
    pal = {
      glow: 'rgba(123, 31, 162, 0.65)',
      mid: '#7B1FA2',
      inner: '#BA68C8',
      core: '#EDE7F6',
      particle: '#E1BEE7',
    };
  } else if (tLower === 'psychic') {
    pal = {
      glow: 'rgba(224, 64, 251, 0.50)',
      mid: '#E040FB',
      inner: '#F48FB1',
      core: '#FFFFFF',
      particle: '#FCE4EC',
    };
  } else if (tLower === 'dragon') {
    pal = {
      glow: 'rgba(124, 77, 255, 0.52)',
      mid: '#7C4DFF',
      inner: '#B388FF',
      core: '#FFFFFF',
      particle: '#EDE7F6',
    };
  } else if (tLower === 'normal') {
    pal = {
      glow: 'rgba(255, 215, 64, 0.48)',
      mid: '#FFD54F',
      inner: '#FFF59D',
      core: '#FFFFFF',
      particle: '#FFFDE7',
    };
  }

  // Cinematic 3-Act Time Progression
  const isCharging = progress < 0.18;
  const isVenting = progress > 0.78;
  const pPhase1 = Math.min(1.0, progress / 0.18);
  const pPhase3 = isVenting ? (progress - 0.78) / 0.22 : 0;

  // Master Alpha Curve: Rapid fade in at start, sustains at 1.0, smooth decay during venting
  const masterAlpha = isVenting
    ? Math.max(0, 1.0 - Math.pow(pPhase3, 1.35))
    : Math.min(1.0, progress / 0.06);

  if (masterAlpha <= 0.01) {
    ctx.restore();
    return;
  }

  // Reach progression (Início: spearhead moves forward, Fim: tail detaches and moves forward)
  const reachFrac = isCharging ? Math.sin(pPhase1 * (Math.PI / 2)) : 1.0;
  const headX = dist * reachFrac;
  const tailX = isVenting ? Math.pow(pPhase3, 1.25) * dist : 0;

  // Width scaling (thin at ignition, full during sustained blast, necking during venting)
  const halfW = Math.max(14, width / 2);
  const pulseW = Math.sin(progress * 42) * (halfW * 0.12);
  const beamScale = isVenting
    ? Math.max(0.08, 1.0 - pPhase3 * 0.88)
    : (isCharging ? 0.45 + 0.55 * pPhase1 : 1.0);
  const curW = Math.max(3, (halfW + pulseW) * beamScale);

  ctx.translate(startX, startY);
  ctx.rotate(angle);
  ctx.globalCompositeOperation = 'lighter';

  // ==========================================
  // ACT 1: INÍCIO — Focal Charge & Inflowing Sparks at Origin
  // ==========================================
  if (isCharging) {
    const chargeR = halfW * (0.6 + 0.9 * pPhase1);
    const chargeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, chargeR);
    chargeGrad.addColorStop(0.0, '#FFFFFF');
    chargeGrad.addColorStop(0.35, pal.inner);
    chargeGrad.addColorStop(0.75, pal.mid);
    chargeGrad.addColorStop(1.0, 'rgba(0,0,0,0)');

    ctx.globalAlpha = masterAlpha * (0.5 + 0.5 * pPhase1);
    ctx.fillStyle = chargeGrad;
    ctx.beginPath();
    ctx.arc(0, 0, chargeR, 0, Math.PI * 2);
    ctx.fill();

    // Infalling luminous charge sparks converging into (0, 0)
    const sparkCount = 6;
    for (let s = 0; s < sparkCount; s++) {
      const sT = (pPhase1 * 3 + s / sparkCount) % 1.0;
      const sAngle = (s / sparkCount) * Math.PI * 2 + progress * 8;
      const sDist = chargeR * (2.2 - sT * 1.6);
      const sx = Math.cos(sAngle) * sDist;
      const sy = Math.sin(sAngle) * sDist;

      ctx.fillStyle = s % 2 === 0 ? '#FFFFFF' : pal.inner;
      ctx.globalAlpha = Math.sin(sT * Math.PI) * masterAlpha * 0.8;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(1, 2.4 * (1 - sT)), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ==========================================
  // ACT 2: MEIO — Sustained Fluid Plasma Stream
  // ==========================================
  if (headX > tailX + 4) {
    // 1. Outer Volumetric Bloom / Glow
    const outerW = curW * 1.55;
    const outerGrad = ctx.createLinearGradient(0, -outerW, 0, outerW);
    outerGrad.addColorStop(0.0, 'rgba(0,0,0,0)');
    outerGrad.addColorStop(0.3, pal.glow);
    outerGrad.addColorStop(0.5, pal.mid);
    outerGrad.addColorStop(0.7, pal.glow);
    outerGrad.addColorStop(1.0, 'rgba(0,0,0,0)');

    const tailOuterW = tailX === 0 ? outerW * 0.55 : outerW * 0.85;
    const headOuterW = headX >= dist ? outerW * 1.1 : outerW * 0.35;

    ctx.globalAlpha = masterAlpha * 0.75;
    ctx.fillStyle = outerGrad;
    ctx.beginPath();
    ctx.moveTo(tailX, -tailOuterW);
    ctx.lineTo(headX, -headOuterW);
    ctx.lineTo(headX, headOuterW);
    ctx.lineTo(tailX, tailOuterW);
    ctx.closePath();
    ctx.fill();

    // 2. Dense Luminous Plasma Core Stream
    const bodyW = curW * 0.85;
    const bodyGrad = ctx.createLinearGradient(0, -bodyW, 0, bodyW);
    bodyGrad.addColorStop(0.0, 'rgba(0,0,0,0)');
    bodyGrad.addColorStop(0.25, pal.mid);
    bodyGrad.addColorStop(0.45, pal.inner);
    bodyGrad.addColorStop(0.50, '#FFFFFF');
    bodyGrad.addColorStop(0.55, pal.inner);
    bodyGrad.addColorStop(0.75, pal.mid);
    bodyGrad.addColorStop(1.0, 'rgba(0,0,0,0)');

    const tailBodyW = tailX === 0 ? bodyW * 0.5 : bodyW * 0.8;
    const headBodyW = headX >= dist ? bodyW * 1.05 : bodyW * 0.25;

    ctx.globalAlpha = masterAlpha * 0.95;
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(tailX, -tailBodyW);
    ctx.lineTo(headX, -headBodyW);
    ctx.lineTo(headX, headBodyW);
    ctx.lineTo(tailX, tailBodyW);
    ctx.closePath();
    ctx.fill();

    // 3. Superheated Laser Spine (Extinguishes early during Fim)
    if (pPhase3 < 0.55) {
      const coreAlpha = (1.0 - pPhase3 / 0.55) * masterAlpha;
      const coreW = Math.max(1.8, curW * 0.24);
      ctx.globalAlpha = coreAlpha;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(tailX, -coreW * 0.5);
      ctx.lineTo(headX, -coreW * (headX >= dist ? 1.0 : 0.3));
      ctx.lineTo(headX, coreW * (headX >= dist ? 1.0 : 0.3));
      ctx.lineTo(tailX, coreW * 0.5);
      ctx.closePath();
      ctx.fill();
    }

    // 4. Helical Energy Shockwave Rings traveling along the beam
    if (progress > 0.12 && pPhase3 < 0.75) {
      const ringCount = 3;
      for (let i = 0; i < ringCount; i++) {
        const ringT = (progress * 3.2 + i / ringCount) % 1.0;
        const rx = tailX + (headX - tailX) * ringT;
        if (rx < tailX + 16 || rx > headX - 16) continue;

        const ringH = curW * (1.25 + Math.sin(ringT * Math.PI) * 0.45);
        ctx.strokeStyle = pal.inner;
        ctx.lineWidth = Math.max(1.2, 2.4 * (1 - pPhase3));
        ctx.globalAlpha = Math.sin(ringT * Math.PI) * masterAlpha * 0.8;
        ctx.beginPath();
        ctx.ellipse(rx, 0, curW * 0.35, ringH, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // ==========================================
  // Continuous Muzzle Flare at Caster (Início & Meio)
  // ==========================================
  if (pPhase3 < 0.25) {
    const muzzleScale = isCharging ? (0.5 + 0.5 * pPhase1) : (1.0 - pPhase3 * 4.0);
    const mR = halfW * (1.1 + 0.35 * Math.sin(progress * 36)) * Math.max(0, muzzleScale);

    if (mR > 2) {
      const mGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, mR);
      mGrad.addColorStop(0.0, '#FFFFFF');
      mGrad.addColorStop(0.35, pal.inner);
      mGrad.addColorStop(0.75, pal.mid);
      mGrad.addColorStop(1.0, 'rgba(0,0,0,0)');

      ctx.globalAlpha = masterAlpha;
      ctx.fillStyle = mGrad;
      ctx.beginPath();
      ctx.arc(0, 0, mR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ==========================================
  // ACT 2/3: Target Impact Detonation & Dissipation Shockwaves
  // ==========================================
  if (headX >= dist * 0.94) {
    const impactIntensity = isCharging
      ? (progress - 0.12) / 0.06
      : (isVenting ? Math.max(0, 1.0 - pPhase3 * 1.3) : 1.0);

    if (impactIntensity > 0.01) {
      const impR = halfW * (1.55 + 0.45 * Math.sin(progress * 38)) * impactIntensity;

      // Radial Impact Blast Flare
      const impGrad = ctx.createRadialGradient(dist, 0, 0, dist, 0, impR);
      impGrad.addColorStop(0.0, '#FFFFFF');
      impGrad.addColorStop(0.28, pal.inner);
      impGrad.addColorStop(0.68, pal.mid);
      impGrad.addColorStop(1.0, 'rgba(0,0,0,0)');

      ctx.globalAlpha = Math.min(1.0, impactIntensity * masterAlpha * 1.1);
      ctx.fillStyle = impGrad;
      ctx.beginPath();
      ctx.arc(dist, 0, impR, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing Shockwave Rings expanding from impact point
      const shockProg = (progress * 4.2) % 1.0;
      const shockR = impR * (0.8 + shockProg * 1.7);
      ctx.strokeStyle = pal.inner;
      ctx.lineWidth = Math.max(1, (1 - shockProg) * 2.8);
      ctx.globalAlpha = (1 - shockProg) * impactIntensity * 0.75;
      ctx.beginPath();
      ctx.arc(dist, 0, shockR, 0, Math.PI * 2);
      ctx.stroke();

      // Backward Conical Plasma Deflection Spray (splashes off target surface)
      const sprayCount = 5;
      for (let s = 0; s < sprayCount; s++) {
        const sProg = (progress * 5.5 + s * 0.22) % 1.0;
        const sAngle = Math.PI - 0.95 + (s / (sprayCount - 1)) * 1.9; // cone angled back toward caster
        const sDist = impR * (0.35 + sProg * 1.85);
        const spx = dist + Math.cos(sAngle) * sDist;
        const spy = Math.sin(sAngle) * sDist;
        const spSize = Math.max(0.8, (1 - sProg) * 3.6);

        ctx.fillStyle = s % 2 === 0 ? '#FFFFFF' : pal.inner;
        ctx.globalAlpha = (1 - sProg) * impactIntensity * masterAlpha;
        ctx.beginPath();
        ctx.arc(spx, spy, spSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ==========================================
  // ACT 3: FIM — Dissipation Ring & Residual Embers
  // ==========================================
  if (isVenting) {
    const dissR = halfW * (1.2 + pPhase3 * 2.2);
    ctx.strokeStyle = pal.mid;
    ctx.lineWidth = Math.max(1, (1 - pPhase3) * 2.2);
    ctx.globalAlpha = Math.max(0, (1 - pPhase3) * 0.6);
    ctx.beginPath();
    ctx.arc(dist, 0, dissR, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

export const TYPE_COLORS = {
  NORMAL: '#94a3b8', FIRE: '#f97316', WATER: '#38bdf8', ELECTRIC: '#eab308',
  GRASS: '#22c55e', ICE: '#06b6d4', FIGHTING: '#ef4444', POISON: '#a855f7',
  GROUND: '#d97706', FLYING: '#818cf8', PSYCHIC: '#ec4899', BUG: '#84cc16',
  ROCK: '#78716c', GHOST: '#6366f1', DRAGON: '#4f46e5', STEEL: '#64748b',
  DARK: '#334155', FAIRY: '#f43f5e'
};

export function getTypeColor(type) {
  return TYPE_COLORS[(type || '').toUpperCase()] || '#64748b';
}

export function getTypePalette(type, customColor = null) {
  const c = customColor || getTypeColor(type);
  return {
    primary: c,
    glow: c + '88',
    inner: '#ffffff'
  };
}

/**
 * Continuous Elemental & Volumetric Laser Beams
 * Matches Move Catalog format (Ice Beam, Solar Beam, Hyper Beam, Bug Buzz, Flamethrower, etc.)
 */
export function renderCombatBeam(ctx, startX, startY, targetX, targetY, progress, type, width = 34, spritesheetImg = null, spriteVisual = null, customColor = null, getImageFn = null, skillName = null) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = getTypePalette(type, customColor);

  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  let curDist = dist;
  let alpha = 1.0;
  let beamScale = 1.0;

  if (p < 0.22) {
    const t = p / 0.22;
    curDist = dist * Math.sin(t * Math.PI * 0.5);
    beamScale = 0.5 + 0.5 * t;
    alpha = t;
  } else if (p < 0.72) {
    curDist = dist;
    beamScale = 1.0 + Math.sin((p - 0.22) * 20) * 0.08;
    alpha = 1.0;
  } else {
    const t = (p - 0.72) / 0.28;
    curDist = dist;
    beamScale = Math.max(0, 1.0 - t * 1.1);
    alpha = Math.max(0, 1.0 - t);
  }

  if (alpha <= 0.01 || beamScale <= 0.01) {
    ctx.restore();
    return;
  }

  ctx.translate(startX, startY);
  ctx.rotate(angle);

  // Luminous Muzzle Charge Orb at emission origin in front of the caster's mouth/head
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = Math.min(1.0, alpha * 0.95);
  const muzzleR = Math.max(4, (width * 0.22) * beamScale + Math.sin(p * 35) * 1.5);
  ctx.fillStyle = pal.primary;
  ctx.beginPath();
  ctx.arc(0, 0, muzzleR * 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, muzzleR * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const vFile = (spriteVisual && spriteVisual.file) ? spriteVisual.file : '';
  const sName = (skillName || spriteVisual?.name || '').toLowerCase();
  const isFireThrower = spriteVisual?.isFireThrower || vFile.includes('fire_thrower') || vFile.includes('fire_stream') || sName.includes('thrower') || sName.includes('chamas');
  const isDragonBreath = spriteVisual?.isDragonBreath || vFile.includes('dragon_breath') || sName.includes('dragon breath') || sName.includes('sopro do dragão');
  const isWaterStream = spriteVisual?.isWaterStream || vFile.includes('water_jet_stream') || sName.includes('hydro pump') || sName.includes('hidro bomba');
  const isBugBuzz = vFile.includes('bug_buzz') || spriteVisual?.isBugBuzz || sName.includes('bug buzz') || sName.includes('zumbido');
  const isSilverWind = spriteVisual?.isVolumetricSilverWind || vFile.includes('silver_wind') || sName.includes('silver wind') || sName.includes('vento de prata');
  const isCustomLaser = vFile.includes('signal_beam') || vFile.includes('beams/beam_');

  const getImage = (file) => {
    if (spritesheetImg && (vFile === file || !file)) return spritesheetImg;
    if (typeof getImageFn === 'function') return getImageFn(file);
    return null;
  };

  // 1. DRAGON BREATH STREAM OVERLAY
  if (isDragonBreath && curDist > 15) {
    const dbImg = getImage(vFile || 'vfx/fire/dragon_breath_stream.png');
    if (dbImg && dbImg.complete && dbImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      const totalFrames = 61;
      const cols = 8;
      const rows = 8;
      const fw = dbImg.naturalWidth / cols;
      const fh = dbImg.naturalHeight / rows;

      const flameCount = 5;
      ctx.globalAlpha = alpha * 0.95;

      for (let f = 0; f < flameCount; f++) {
        const fT = (p * 2.5 + f / flameCount) % 1.0;
        const fx = curDist * fT;
        const currentFrame = Math.floor((p * 45 + f * 12) % totalFrames);
        const col = currentFrame % cols;
        const row = Math.floor(currentFrame / cols);
        const sx = col * fw;
        const sy = row * fh;

        const fScale = (0.65 + fT * 0.75) * 1.05;
        const dw = fw * fScale;
        const dh = fh * fScale;

        ctx.drawImage(dbImg, sx, sy, fw, fh, fx - dw * 0.4, -dh / 2, dw, dh);
      }
      ctx.restore();
    }
  }
  // 2. FIRE THROWER / FIRE STREAM OVERLAY
  else if (isFireThrower && curDist > 15) {
    const ftImg = getImage(vFile || 'vfx/fire/fire_thrower_02.png');
    if (ftImg && ftImg.complete && ftImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      const totalFrames = 61;
      const cols = 8;
      const rows = 8;
      const fw = ftImg.naturalWidth / cols;
      const fh = ftImg.naturalHeight / rows;

      const flameCount = 5;
      ctx.globalAlpha = alpha * 0.95;

      for (let f = 0; f < flameCount; f++) {
        const fT = (p * 2.5 + f / flameCount) % 1.0;
        const fx = curDist * fT;
        const currentFrame = Math.floor((p * 45 + f * 12) % totalFrames);
        const col = currentFrame % cols;
        const row = Math.floor(currentFrame / cols);
        const sx = col * fw;
        const sy = row * fh;

        const fScale = (0.65 + fT * 0.75) * 1.05;
        const dw = fw * fScale;
        const dh = fh * fScale;

        ctx.drawImage(ftImg, sx, sy, fw, fh, fx - dw * 0.4, -dh / 2, dw, dh);
      }
      ctx.restore();
    }
  }
  // 3. WATER JET STREAM (VOLUMETRIC HYDRO PUMP / SLUGS)
  else if (isWaterStream && curDist > 15) {
    const wImg = getImage(vFile || 'vfx/water/water_jet_stream.png');
    if (wImg && wImg.complete && wImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      const totalFrames = 9;
      const cols = 3;
      const rows = 3;
      const fw = wImg.naturalWidth / cols;
      const fh = wImg.naturalHeight / rows;

      const slugCount = 6;
      ctx.globalAlpha = alpha * 0.95;

      for (let s = 0; s < slugCount; s++) {
        const sT = (p * 2.8 + s / slugCount) % 1.0;
        const sxDist = curDist * sT;
        const currentFrame = Math.floor((p * 36 + s * 3) % totalFrames);
        const col = currentFrame % cols;
        const row = Math.floor(currentFrame / cols);
        const sx = col * fw;
        const sy = row * fh;

        const fScale = (0.45 + sT * 0.35) * (width > 40 ? 1.2 : 0.75);
        const dw = fw * fScale;
        const dh = fh * fScale;

        ctx.drawImage(wImg, sx, sy, fw, fh, sxDist - dw * 0.4, -dh / 2, dw, dh);
      }
      ctx.restore();
    }
  }
  // 4. BUG BUZZ (SINUSOIDAL ACOUSTIC SOUND WAVE)
  else if (isBugBuzz && curDist > 15) {
    const bbImg = getImage(vFile || 'vfx/custom/bug_buzz.png');
    if (bbImg && bbImg.complete && bbImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      const totalFrames = 16;
      const cols = 4;
      const rows = 4;
      const fw = bbImg.naturalWidth / cols;
      const fh = bbImg.naturalHeight / rows;

      const currentFrame = Math.floor((p * 28) % totalFrames);
      const col = currentFrame % cols;
      const row = Math.floor(currentFrame / cols);
      const sx = col * fw;
      const sy = row * fh;

      ctx.globalAlpha = alpha * 0.95;
      const beamH = fh * (width > 40 ? 0.46 : 0.34);
      ctx.drawImage(bbImg, sx, sy, fw, fh, 0, -beamH / 2, curDist, beamH);
      ctx.restore();
    }
  }
  // 5. VOLUMETRIC SILVER WIND STREAM (DENSE WIND & DIAMOND SCALES)
  else if (isSilverWind && curDist > 15) {
    const swImg = getImage(vFile || 'vfx/wind/silver_wind_volumetric.png');
    if (swImg && swImg.complete && swImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      const totalFrames = 16;
      const cols = 4;
      const rows = 4;
      const fw = swImg.naturalWidth / cols;
      const fh = swImg.naturalHeight / rows;

      const gustCount = 4;
      ctx.globalAlpha = alpha * 0.95;

      for (let g = 0; g < gustCount; g++) {
        const gT = (p * 2.2 + g / gustCount) % 1.0;
        const gx = curDist * gT;
        const currentFrame = Math.floor((p * 36 + g * 4) % totalFrames);
        const col = currentFrame % cols;
        const row = Math.floor(currentFrame / cols);
        const sx = col * fw;
        const sy = row * fh;

        const gustAlpha = Math.sin(gT * Math.PI) * alpha * 0.95;
        ctx.globalAlpha = gustAlpha;

        const gScale = (0.60 + gT * 0.35) * (width > 40 ? 1.3 : 0.9);
        const dw = fw * gScale;
        const dh = fh * gScale;

        ctx.drawImage(swImg, sx, sy, fw, fh, gx - dw * 0.4, -dh / 2, dw, dh);
      }
      ctx.restore();
    }
  }
  // 6. ELEMENTAL LASER BEAMS (ICE, SOLAR, HYPER, SIGNAL, PSYBEAM, ETC.)
  else if (isCustomLaser || curDist > 15) {
    const KNOWN_BEAMS = ['dark', 'dragon', 'electric', 'fire', 'grass', 'ice', 'normal', 'psychic', 'steel', 'water'];
    const isAuthenticBeamFile = vFile && (vFile.includes('beams/beam_') || vFile.includes('signal_beam.png'));
    let beamImgPath = isAuthenticBeamFile ? vFile : '';
    if (!beamImgPath) {
      const tLower = (type || 'normal').toLowerCase();
      const mappedType = KNOWN_BEAMS.includes(tLower) ? tLower : (
        tLower === 'ghost' ? 'dark' :
        tLower === 'fairy' ? 'psychic' :
        tLower === 'poison' ? 'dark' :
        'normal'
      );
      beamImgPath = 'vfx/magic/beams/beam_' + mappedType + '.png';
    }
    const bImg = getImage(beamImgPath) || getImage('vfx/magic/signal_beam.png') || getImage('vfx/magic/beams/beam_normal.png');
    if (bImg && bImg.complete && bImg.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      const totalFrames = 16;
      const cols = 4;
      const rows = 4;
      const fw = bImg.naturalWidth / cols;
      const fh = bImg.naturalHeight / rows;

      const currentFrame = Math.floor((p * 30) % totalFrames);
      const col = currentFrame % cols;
      const row = Math.floor(currentFrame / cols);
      const sx = col * fw;
      const sy = row * fh;

      ctx.globalAlpha = alpha * 0.98;
      const beamH = fh * (width > 40 ? 0.38 : 0.28);
      ctx.drawImage(bImg, sx, sy, fw, fh, 0, -beamH / 2, curDist, beamH);
      ctx.restore();
    } else {
      ctx.globalCompositeOperation = 'lighter';
      const beamW = width * beamScale;
      ctx.globalAlpha = alpha * 0.85;
      ctx.fillStyle = pal.primary;
      ctx.fillRect(0, -beamW * 0.3, curDist, beamW * 0.6);
      ctx.globalAlpha = alpha * 0.98;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, -beamW * 0.1, curDist, beamW * 0.2);
    }
  }

  ctx.restore();

  // Impact Splash Flash at target
  if (p >= 0.18) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const impAlpha = p < 0.78 ? 0.95 : Math.max(0, (1 - (p - 0.78) / 0.22));
    ctx.globalAlpha = impAlpha;

    ctx.fillStyle = pal.primary;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 18 + Math.sin(p * 28) * 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 9 + Math.sin(p * 35) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Render Translucent Defensive Barrier
 */
export function renderDefensiveBarrier(ctx, x, y, shieldType = 'psychic_barrier', radius = 34, time = 0, alpha = 0.55) {
  ctx.save();
  ctx.globalAlpha = Math.max(0.12, Math.min(0.65, alpha * 0.7));

  if (shieldType === 'water_shell') {
    const pulseR = radius + Math.sin(time * 8) * 2;
    ctx.strokeStyle = 'rgba(0, 176, 255, 0.7)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(x, y, pulseR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(128, 216, 255, 0.18)';
    ctx.fill();
  } else if (shieldType === 'fire_spin') {
    const pulseR = radius + Math.sin(time * 10) * 2.5;
    ctx.strokeStyle = 'rgba(255, 145, 0, 0.75)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(x, y, pulseR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 87, 34, 0.16)';
    ctx.fill();
  } else if (shieldType === 'electric_cage') {
    const pulseR = radius + Math.sin(time * 12) * 2;
    const nodes = 8;
    ctx.strokeStyle = '#FFEE58';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    for (let i = 0; i <= nodes; i++) {
      const a = (i / nodes) * Math.PI * 2 + time * 3;
      const j = (Math.sin(time * 20 + i * 3) > 0 ? 3 : -2);
      const px = x + Math.cos(a) * (pulseR + j);
      const py = y + Math.sin(a) * ((pulseR + j) * 0.8);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  } else if (shieldType === 'bug_chitin' || shieldType === 'grass_safeguard') {
    const pulseR = radius + Math.sin(time * 6) * 2;
    ctx.strokeStyle = 'rgba(118, 255, 3, 0.75)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let s = 0; s <= 6; s++) {
      const a = (s / 6) * Math.PI * 2 + time * 1.5;
      const hx = x + Math.cos(a) * pulseR;
      const hy = y + Math.sin(a) * (pulseR * 0.85);
      if (s === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.stroke();
    ctx.fillStyle = 'rgba(51, 105, 30, 0.18)';
    ctx.fill();
  } else {
    const pulseR = radius + Math.sin(time * 6) * 1.5;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.75)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let s = 0; s <= 6; s++) {
      const a = (s / 6) * Math.PI * 2 + time * 1.2;
      const hx = x + Math.cos(a) * pulseR;
      const hy = y + Math.sin(a) * (pulseR * 0.85);
      if (s === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.stroke();
    ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Render Anime-Style Directional Speed Hatching Lines
 */
export function renderSpeedHatching(ctx, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
  let cx, cy, dirX, dirY, progress, color;
  if (typeof arg7 === 'number') {
    const startX = arg1, startY = arg2, endX = arg3, endY = arg4;
    dirX = arg5; dirY = arg6; progress = arg7; color = arg8 || '#FFFFFF';
    cx = startX + (endX - startX) * 0.5;
    cy = startY + (endY - startY) * 0.5;
  } else {
    cx = arg1; cy = arg2; dirX = arg3; dirY = arg4; progress = arg5; color = arg6 || '#FFFFFF';
  }

  ctx.save();
  const alpha = (1 - progress * progress) * 0.9;
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;

  const perpX = -dirY;
  const perpY = dirX;
  const spreadWidth = 26;
  const lineLength = 24 + (1 - progress) * 14;

  ctx.beginPath();
  for (let i = -2; i <= 2; i++) {
    const offset = (i / 2) * (spreadWidth * 0.5);
    const stagger = ((Math.abs(i) * 7) % 9) - 4;
    const midX = cx + perpX * offset + dirX * stagger;
    const midY = cy + perpY * offset + dirY * stagger;

    const x1 = midX - dirX * (lineLength * 0.5);
    const y1 = midY - dirY * (lineLength * 0.5);
    const x2 = midX + dirX * (lineLength * 0.5);
    const y2 = midY + dirY * (lineLength * 0.5);

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();

  ctx.restore();
}

/**
 * Render Swirling Razor Leaf & Foliage Storm Burst
 */
export function renderPixelFoliageBurst(ctx, x, y, progress, color = '#43A047') {
  ctx.save();
  const leafCount = 8;
  const maxRadius = 44;
  const curRadius = progress * maxRadius;
  const alpha = Math.sin(progress * Math.PI);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }
  ctx.globalAlpha = alpha;

  for (let i = 0; i < leafCount; i++) {
    const angle = (i / leafCount) * Math.PI * 2 + progress * 4.0;
    const lx = x + Math.cos(angle) * curRadius;
    const ly = y + Math.sin(angle) * curRadius;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(lx, ly, 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#CCFF90';
    ctx.beginPath();
    ctx.arc(lx, ly, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Render Glacial Shatter Nova
 */
export function renderPixelIceCrystals(ctx, x, y, progress, color = '#80DEEA') {
  ctx.save();
  const t = Math.max(0, Math.min(1, progress));
  const alpha = Math.sin(t * Math.PI);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  // Shockwave Ring
  const shockR = 10 + t * 46;
  ctx.strokeStyle = '#E0F7FA';
  ctx.lineWidth = Math.max(1, (1 - t) * 3.2);
  ctx.beginPath();
  ctx.arc(x, y, shockR, 0, Math.PI * 2);
  ctx.stroke();

  // 6 Icicle Shards
  const shardCount = 6;
  const dist = t * 50;
  ctx.fillStyle = color;
  for (let i = 0; i < shardCount; i++) {
    const ang = (i / shardCount) * Math.PI * 2;
    const sx = x + Math.cos(ang) * dist;
    const sy = y + Math.sin(ang) * dist;

    ctx.beginPath();
    ctx.arc(sx, sy, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Render Dark Shadow Pulse
 */
export function renderPixelShadowPulse(ctx, x, y, progress, color = '#7B1FA2') {
  ctx.save();
  const alpha = Math.sin(progress * Math.PI);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }

  const radius = 12 + progress * 40;

  // Concentric Diamond Shockwaves
  for (let layer = 0; layer < 2; layer++) {
    const lProg = Math.max(0, Math.min(1, progress * 1.3 - layer * 0.25));
    if (lProg <= 0 || lProg >= 1) continue;
    const lRad = 8 + lProg * 36;

    ctx.globalAlpha = (1 - lProg) * alpha;
    ctx.strokeStyle = layer === 0 ? '#120024' : color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x, y - lRad * 1.1);
    ctx.lineTo(x + lRad * 1.25, y);
    ctx.lineTo(x, y + lRad * 1.1);
    ctx.lineTo(x - lRad * 1.25, y);
    ctx.closePath();
    ctx.stroke();
  }

  // Central Core
  ctx.globalAlpha = Math.min(1, alpha * 1.1);
  const coreR = Math.max(4, 14 * (1 - progress * 0.7));
  ctx.fillStyle = '#05000A';
  ctx.beginPath();
  ctx.arc(x, y, coreR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.restore();
}

/**
 * Render Concentric Psychic Distortion Rings
 */
export function renderPixelPsychicRings(ctx, x, y, progress, color = '#F50057') {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  for (let ring = 1; ring <= 2; ring++) {
    const ringProg = Math.max(0, Math.min(1, progress * 1.5 - (ring - 1) * 0.3));
    if (ringProg <= 0 || ringProg >= 1) continue;

    const r = 8 + ringProg * 38;
    const alpha = 1 - ringProg;

    ctx.globalAlpha = alpha * 0.85;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, (1 - ringProg) * 2.8);
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.2, r * 0.75, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Render Luminous Stat Surge Chevrons
 */
export function renderPixelStatArrows(ctx, x, y, progress, isBuff = true, color = '#00E676', statType = '') {
  ctx.save();
  const t = Math.max(0, Math.min(1, progress));
  const alpha = Math.sin(t * Math.PI);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  const floorY = y + 2;
  const auraH = 34;

  if (isBuff) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.0;
    for (let c = 0; c < 3; c++) {
      const cT = (t * 1.4 + c * 0.33) % 1.0;
      const cx = x + (c - 1) * 8;
      const cy = floorY - 4 - cT * auraH;

      ctx.beginPath();
      ctx.moveTo(cx - 4, cy + 3);
      ctx.lineTo(cx, cy - 3);
      ctx.lineTo(cx + 4, cy + 3);
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = color || '#FF5252';
    ctx.lineWidth = 2.0;
    for (let c = 0; c < 3; c++) {
      const cT = (t * 1.4 + c * 0.33) % 1.0;
      const cx = x + (c - 1) * 8;
      const cy = floorY - auraH + cT * auraH;

      ctx.beginPath();
      ctx.moveTo(cx - 4, cy - 3);
      ctx.lineTo(cx, cy + 3);
      ctx.lineTo(cx + 4, cy - 3);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Render Double-Helix Ascending Elemental Buff Spiral (Batched loop)
 */
export function renderPixelElementalBuffSpiral(ctx, cx, cy, progress, elemType = 'fire', customColor = null) {
  ctx.save();
  const t = Math.max(0, Math.min(1, progress));
  const alpha = Math.sin(t * Math.PI);
  if (alpha <= 0.01) {
    ctx.restore();
    return;
  }

  const palette = PIXEL_COLOR_PALETTES[elemType] || PIXEL_COLOR_PALETTES.normal || { 3: '#FFA000', 1: '#FFFFFF' };
  const primaryColor = customColor || palette[3] || '#FFA000';
  const coreColor = palette[1] || '#FFFFFF';

  ctx.globalCompositeOperation = 'lighter';

  const helixArms = 2;
  const particlesPerArm = 6;
  const spiralHeight = 32;
  const baseRadius = 18;
  const floorY = cy + 2;

  ctx.fillStyle = primaryColor;
  for (let arm = 0; arm < helixArms; arm++) {
    const armPhase = arm * Math.PI;
    for (let p = 0; p < particlesPerArm; p++) {
      const pRatio = p / particlesPerArm;
      const flowT = (t * 1.5 + pRatio) % 1.0;
      const rad = baseRadius * (1.1 - flowT * 0.25);
      const angle = armPhase + (flowT * Math.PI * 3.0) + (t * 4.2);

      const px = cx + Math.cos(angle) * rad;
      const py = floorY - flowT * spiralHeight + Math.sin(angle) * 4;
      const partAlpha = Math.sin(flowT * Math.PI) * alpha;
      if (partAlpha <= 0.05) continue;

      ctx.globalAlpha = partAlpha * 0.85;
      ctx.beginPath();
      ctx.arc(px, py, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Render Smooth Orbiting Golden Stars (Dizzy Status)
 */
export function renderDizzyStars(ctx, x, y, time) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const starCount = 4;
  const orbitRadiusX = 24;
  const orbitRadiusY = 9;
  const centerX = x;
  const centerY = y - 62;

  ctx.fillStyle = '#FFD700';
  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2 + time * 6.5;
    const px = centerX + Math.cos(angle) * orbitRadiusX;
    const py = centerY + Math.sin(angle) * orbitRadiusY;

    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Render Sleek Tactical Circle beneath Player-Controlled Pokémon
 */
export function renderPlayerPixelUnderRing(ctx, x, y, radius = 22, time = 0) {
  ctx.save();
  const ry = radius * 0.46;
  const rx = radius;

  // Floor Shadow
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#051824';
  ctx.beginPath();
  ctx.ellipse(x, y + 2, rx + 2, ry + 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Luminous Dashed Ring
  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = '#00E5FF';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([8, 4]);
  ctx.lineDashOffset = -time * 18;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();

  // 4 Cardinal Notches
  ctx.setLineDash([]);
  const rot = time * 0.75;
  const notchAngles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];
  ctx.fillStyle = '#00E5FF';
  for (let i = 0; i < notchAngles.length; i++) {
    const notchAng = notchAngles[i] + rot;
    const nx = x + Math.cos(notchAng) * (rx + 2);
    const ny = y + Math.sin(notchAng) * (ry + 1);

    ctx.beginPath();
    ctx.arc(nx, ny, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draco Meteor: Hail-style continuous raining fire meteors with expanded impact area and enlarged meteor sizes
 */
export function renderDracoMeteorCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual) {
  // 1. Delimiting Pixel-Art Ground Targeting Ring (Expanded Area: rx 64, ry 28)
  const circAlpha = Math.sin(p * Math.PI) * 0.75;
  if (circAlpha > 0.02) {
    ctx.save();
    ctx.fillStyle = '#CBD5E1';
    ctx.globalAlpha = circAlpha;

    const rx = 64;
    const ry = 28;
    const pSize = 2;
    const groundY = targetY + 6;

    // Stepped pixel-art ellipse ring
    const seen = new Set();
    const steps = 72;
    for (let i = 0; i < steps; i++) {
      const ang = (i / steps) * Math.PI * 2;
      const qx = Math.round((targetX + Math.cos(ang) * rx) / pSize) * pSize;
      const qy = Math.round((groundY + Math.sin(ang) * ry) / pSize) * pSize;
      const key = qx + ',' + qy;
      if (!seen.has(key)) {
        seen.add(key);
        ctx.fillRect(qx, qy, pSize, pSize);
      }
    }

    // 4 cardinal pixel notches
    ctx.fillRect(targetX - 1, groundY - ry - 4, 2, 4);
    ctx.fillRect(targetX - 1, groundY + ry + 1, 2, 4);
    ctx.fillRect(targetX - rx - 4, groundY - 1, 4, 2);
    ctx.fillRect(targetX + rx + 1, groundY - 1, 4, 2);

    // Center crosshair pixel
    ctx.fillRect(targetX - 1, groundY - 1, 2, 2);
    ctx.restore();
  }

  // 2. Hail-Style Continuous Raining Meteors with significantly increased size and wider spread
  const meteorShards = [
    { dx: 0, dy: -6, startY: -135, dropDist: 142, pOffset: 0.0, sc: 1.65 },
    { dx: -36, dy: 10, startY: -155, dropDist: 164, pOffset: 0.16, sc: 1.50 },
    { dx: 34, dy: -8, startY: -160, dropDist: 168, pOffset: 0.32, sc: 1.55 },
    { dx: -18, dy: 14, startY: -145, dropDist: 158, pOffset: 0.48, sc: 1.45 },
    { dx: 40, dy: 8, startY: -165, dropDist: 172, pOffset: 0.64, sc: 1.60 },
    { dx: -44, dy: -4, startY: -140, dropDist: 146, pOffset: 0.80, sc: 1.50 }
  ];

  for (let i = 0; i < meteorShards.length; i++) {
    const m = meteorShards[i];
    const mProg = (p * 1.5 + m.pOffset) % 1.0;
    const landY = targetY + 6 + m.dy;
    const curY = landY - (1 - mProg) * m.dropDist;
    const curX = (targetX + m.dx) - (1 - mProg) * 32;

    if (mProg < 0.80) {
      // Falling fiery meteor with enlarged flame trail & volumetric fire sprite head
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const trailLen = 7;
      for (let t = 0; t < trailLen; t++) {
        const tFrac = t / trailLen;
        const tx = curX - t * 5;
        const ty = curY - t * 10;
        ctx.fillStyle = t % 2 === 0 ? '#FF4500' : '#FFD700';
        ctx.globalAlpha = (1 - tFrac) * circAlpha * 0.90;
        ctx.beginPath();
        ctx.arc(tx, ty, Math.max(1, 7.5 * m.sc * (1 - tFrac)), 0, Math.PI * 2);
        ctx.fill();
      }

      // Volumetric Fire Sprite on falling meteor ball (enlarged)
      if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
        const cols = spriteVisual?.cols || 8;
        const rows = spriteVisual?.rows || 8;
        const fw = spritesheetImg.naturalWidth / cols;
        const fh = spritesheetImg.naturalHeight / rows;
        const flightFrame = Math.floor(mProg * 32 + i * 9) % 61;
        const fsx = (flightFrame % cols) * fw;
        const fsy = Math.floor(flightFrame / cols) * fh;
        const fdw = 46 * m.sc;
        const fdh = 46 * m.sc;
        ctx.globalAlpha = circAlpha * 0.98;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(spritesheetImg, fsx, fsy, fw, fh, curX - fdw / 2, curY - fdh / 2, fdw, fdh);
      }

      // Glowing white-hot meteor core
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = circAlpha * 0.95;
      ctx.beginPath();
      ctx.arc(curX, curY, 5.5 * m.sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Ground Impact & Massive Volumetric Flame Plume
      const impP = (mProg - 0.80) / 0.20;
      const impAlpha = (1 - impP) * circAlpha;

      if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
        const cols = spriteVisual?.cols || 8;
        const rows = spriteVisual?.rows || 8;
        const fw = spritesheetImg.naturalWidth / cols;
        const fh = spritesheetImg.naturalHeight / rows;
        const totalFrames = (spriteVisual?.endFrame - spriteVisual?.startFrame + 1) || 61;
        const frameRel = Math.min(totalFrames - 1, Math.floor(impP * totalFrames));
        const frame = (spriteVisual?.startFrame || 0) + frameRel;
        const sx = (frame % cols) * fw;
        const sy = Math.floor(frame / cols) * fh;

        const dw = fw * 1.25 * m.sc;
        const dh = fh * 1.25 * m.sc;

        ctx.save();
        ctx.globalAlpha = impAlpha * 0.98;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(spritesheetImg, sx, sy, fw, fh, targetX + m.dx - dw / 2, landY - dh + 10, dw, dh);
        ctx.restore();
      }

      // Expanded ground shock spark
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = '#FF9100';
      ctx.globalAlpha = (1 - impP) * 0.90;
      ctx.beginPath();
      ctx.ellipse(targetX + m.dx, landY, (1 - impP) * 28 * m.sc, (1 - impP) * 14 * m.sc, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

/**
 * Burning Aura: Enveloping Spiral of Draconic Flame Sprites & Orbiting Embers
 * Used by: Roar of Time (Purple), Dragon Rage (Purple), Outrage (Purple), Dragon Dance (Red with group_4_5), Dragon Ascent (Green)
 */
export function renderBurningAuraCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual = null, color = '#A855F7', filter = null) {
  const alpha = Math.sin(p * Math.PI);
  if (alpha <= 0.01) return;

  ctx.save();

  // 1. Radiant Glowing Ground Ellipse Ring
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.0;
  ctx.globalAlpha = alpha * 0.75;
  ctx.beginPath();
  ctx.ellipse(targetX, targetY + 6, 26, 12, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Soft inner ground glow
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha * 0.28;
  ctx.beginPath();
  ctx.ellipse(targetX, targetY + 6, 22, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Rising Draconic Embers & Sparks
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const numSparks = 7;
  for (let sp = 0; sp < numSparks; sp++) {
    const sProg = (p * 2.2 + sp / numSparks) % 1.0;
    const sy = targetY + 6 - sProg * 48;
    const sx = targetX + Math.sin(p * 14 + sp * 2.1) * (18 + (1 - sProg) * 8);
    ctx.fillStyle = sp % 2 === 0 ? color : '#FFFFFF';
    ctx.globalAlpha = Math.sin(sProg * Math.PI) * alpha * 0.85;
    ctx.fillRect(Math.round(sx), Math.round(sy), 2, 2);
  }
  ctx.restore();

  // 3. Orbiting Burning Flame Sprites Enveloping the Entity
  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const cols = spriteVisual?.cols || 8;
    const rows = spriteVisual?.rows || (spriteVisual?.file?.includes('pixel_fire') ? 1 : 8);
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;
    const totalFrames = (spriteVisual?.endFrame - spriteVisual?.startFrame + 1) || (cols * rows);

    const isRedFire = spriteVisual?.file?.includes('pixel_fire') || spriteVisual?.isDragonDance || color === '#FF5722' || color === '#EF4444' || color === '#F08030';
    const isGreen = color === '#22C55E' || spriteVisual?.isDragonAscent;
    const resolvedFilter = filter || (isRedFire ? null : (isGreen ? 'hue-rotate(290deg) saturate(2.0) brightness(1.15)' : 'hue-rotate(90deg) saturate(1.8) brightness(1.2)'));

    const numFlames = 5;
    const rx = 24;
    const ry = 11;
    const scaleBase = (spriteVisual?.scale || 1.1) * (isRedFire ? 0.95 : 0.85);

    for (let f = 0; f < numFlames; f++) {
      const ang = p * 8.5 + f * (Math.PI * 2 / numFlames);
      const sinA = Math.sin(ang);
      const cosA = Math.cos(ang);

      const fx = targetX + cosA * rx;
      const riseY = ((p * 2.0 + f * 0.2) % 1.0) * 16;
      const fy = targetY + 4 + sinA * ry - riseY;

      // Depth perception: flames passing behind entity appear slightly smaller
      const depthScale = sinA < 0 ? 0.82 : 1.0;
      const depthAlpha = sinA < 0 ? 0.65 : 0.95;

      const frameRel = Math.floor(p * 45 + f * 11) % totalFrames;
      const frame = (spriteVisual?.startFrame || 0) + frameRel;
      const sx = (frame % cols) * fw;
      const sy = Math.floor(frame / cols) * fh;

      const dw = fw * scaleBase * depthScale;
      const dh = fh * scaleBase * depthScale;

      ctx.save();
      ctx.globalAlpha = alpha * depthAlpha;
      ctx.imageSmoothingEnabled = false;
      if (resolvedFilter) ctx.filter = resolvedFilter;
      if (isRedFire) {
        // Dragon Dance: Keep exact current rendering (natural vertical flames)
        ctx.drawImage(spritesheetImg, sx, sy, fw, fh, fx - dw / 2, fy - dh + 8, dw, dh);
      } else {
        // Draconic Vertical Flame Column: Rotated -90° so breath stream burns vertically UPWARD
        ctx.translate(fx, fy - 6);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(spritesheetImg, sx, sy, fw, fh, -dw * 0.45, -dh / 2, dw, dh);
      }
      ctx.restore();
    }
  }

  // 4. Subtle Outer Shockwave pulse
  if (p < 0.40) {
    const pulseP = p / 0.40;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, (1 - pulseP) * 2.5);
    ctx.globalAlpha = (1 - pulseP) * 0.75;
    ctx.beginPath();
    ctx.arc(targetX, targetY - 4, pulseP * 32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Dragon Rage: Purple / Lilac Draconic Flame Projectile with Burning Aura on Impact
 */
export function renderDragonRageCombat(ctx, startX, startY, targetX, targetY, p, spritesheetImg, spriteVisual) {
  const hitThreshold = 0.68;

  if (p < hitThreshold) {
    // Flight Phase: The Animated Sprite Itself in Flight rotated along trajectory with Purple Filter!
    const flightP = p / hitThreshold;
    const curX = startX + (targetX - startX) * flightP;
    const curY = startY + (targetY - startY) * flightP;
    const angle = Math.atan2(targetY - startY, targetX - startX);

    // 1. Subtle Draconic Embers trailing behind
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let t = 1; t <= 5; t++) {
      const ex = curX - Math.cos(angle) * (t * 9) + (Math.sin(p * 25 + t * 2.3) * 3);
      const ey = curY - Math.sin(angle) * (t * 9) + (Math.cos(p * 25 + t * 2.3) * 3);
      ctx.fillStyle = t % 2 === 0 ? '#9333EA' : '#C084FC';
      ctx.globalAlpha = (1 - t / 6) * 0.75;
      ctx.beginPath();
      ctx.arc(ex, ey, Math.max(1, 3.5 * (1 - t / 6)), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. The Animated Sprite Itself in Flight (Tinted Purple)
    if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
      const cols = spriteVisual?.cols || 8;
      const rows = spriteVisual?.rows || 8;
      const fw = spritesheetImg.naturalWidth / cols;
      const fh = spritesheetImg.naturalHeight / rows;
      const totalFrames = (spriteVisual?.endFrame - spriteVisual?.startFrame + 1) || 61;
      const frame = (spriteVisual?.startFrame || 0) + Math.floor(flightP * 30 * 2) % totalFrames;
      const sx = (frame % cols) * fw;
      const sy = Math.floor(frame / cols) * fh;

      const scale = (spriteVisual?.scale || 1.15) * 0.95;
      const dw = fw * scale;
      const dh = fh * scale;

      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.filter = 'hue-rotate(90deg) saturate(1.8) brightness(1.2)';
      ctx.translate(curX, curY);
      ctx.rotate(angle);
      ctx.drawImage(spritesheetImg, sx, sy, fw, fh, -dw * 0.45, -dh / 2, dw, dh);
      ctx.restore();
    }
  } else {
    // Impact Phase: Burning Effect Enveloping Enemy
    const impP = (p - hitThreshold) / (1.0 - hitThreshold);
    renderBurningAuraCombat(ctx, targetX, targetY, impP, spritesheetImg, spriteVisual, '#A855F7', 'hue-rotate(90deg) saturate(1.8) brightness(1.2)');
  }
}

/**
 * Roar of Time: Purple Temporal Distortion Dragon Breath Projectile with Burning Aura on Impact
 */
export function renderRoarOfTimeCombat(ctx, startX, startY, targetX, targetY, p, spritesheetImg, spriteVisual) {
  const hitThreshold = 0.65;

  if (p < hitThreshold) {
    // Flight Phase: Purple Dragon Breath Stream Projectile + Time Distortion Ripples
    const flightP = p / hitThreshold;
    const curX = startX + (targetX - startX) * flightP;
    const curY = startY + (targetY - startY) * flightP;
    const angle = Math.atan2(targetY - startY, targetX - startX);

    // 1. Time distortion ripple rings along flight path
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let r = 1; r <= 4; r++) {
      const rx = curX - Math.cos(angle) * (r * 12);
      const ry = curY - Math.sin(angle) * (r * 12);
      ctx.strokeStyle = r % 2 === 0 ? '#C084FC' : '#9333EA';
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = (1 - r / 5) * 0.75;
      ctx.beginPath();
      ctx.ellipse(rx, ry, 10 + r * 3, 5 + r * 2, angle, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Trailing draconic purple embers
    for (let t = 1; t <= 6; t++) {
      const ex = curX - Math.cos(angle) * (t * 10) + Math.sin(p * 25 + t) * 4;
      const ey = curY - Math.sin(angle) * (t * 10) + Math.cos(p * 25 + t) * 4;
      ctx.fillStyle = t % 2 === 0 ? '#C084FC' : '#E9D5FF';
      ctx.globalAlpha = (1 - t / 7) * 0.85;
      ctx.beginPath();
      ctx.arc(ex, ey, Math.max(1, 3.5 * (1 - t / 7)), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. Animated Purple Dragon Breath Projectile
    if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
      const cols = spriteVisual?.cols || 8;
      const rows = spriteVisual?.rows || 8;
      const fw = spritesheetImg.naturalWidth / cols;
      const fh = spritesheetImg.naturalHeight / rows;
      const totalFrames = (spriteVisual?.endFrame - spriteVisual?.startFrame + 1) || 61;
      const frame = (spriteVisual?.startFrame || 0) + Math.floor(flightP * 35 * 2) % totalFrames;
      const sx = (frame % cols) * fw;
      const sy = Math.floor(frame / cols) * fh;

      const scale = (spriteVisual?.scale || 1.25) * 1.05;
      const dw = fw * scale;
      const dh = fh * scale;

      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.filter = 'hue-rotate(90deg) saturate(1.8) brightness(1.2)'; // Radiant Purple Flame
      ctx.translate(curX, curY);
      ctx.rotate(angle);
      ctx.drawImage(spritesheetImg, sx, sy, fw, fh, -dw * 0.45, -dh / 2, dw, dh);
      ctx.restore();
    }
  } else {
    // Impact Phase: Burning Effect Enveloping Enemy
    const impP = (p - hitThreshold) / (1.0 - hitThreshold);
    renderBurningAuraCombat(ctx, targetX, targetY, impP, spritesheetImg, spriteVisual, '#A855F7', 'hue-rotate(90deg) saturate(1.8) brightness(1.2)');
  }
}

/**
 * Twister: 3 Traveling Cyclonic Tornados (whirlwind.png)
 */
export function renderTwisterCombat(ctx, startX, startY, targetX, targetY, p, spritesheetImg, spriteVisual, type) {
  const twisters = [
    { pOffset: 0.00, dy: 0, spreadY: 0, sc: 1.05 },
    { pOffset: 0.14, dy: -14, spreadY: -18, sc: 0.90 },
    { pOffset: 0.28, dy: 14, spreadY: 18, sc: 0.95 }
  ];

  for (let i = 0; i < twisters.length; i++) {
    const tw = twisters[i];
    const twProg = (p * 1.35 - tw.pOffset);
    if (twProg < 0) continue;

    if (twProg < 1.0) {
      // In flight: Traveling spinning cyclone
      const curX = startX + (targetX - startX) * twProg;
      const curY = startY + (targetY - startY) * twProg + Math.sin(twProg * Math.PI) * tw.spreadY;
      const alpha = Math.min(1.0, twProg * 3.5) * (1.0 - Math.max(0, (twProg - 0.85) / 0.15));

      if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
        const cols = spriteVisual?.cols || 5;
        const rows = spriteVisual?.rows || 4;
        const fw = spritesheetImg.naturalWidth / cols;
        const fh = spritesheetImg.naturalHeight / rows;
        const totalFrames = (spriteVisual?.endFrame - spriteVisual?.startFrame + 1) || 19;
        const frameIndex = Math.floor(twProg * 30 + i * 5) % totalFrames;
        const sx = (frameIndex % cols) * fw;
        const sy = Math.floor(frameIndex / cols) * fh;

        const sScale = (spriteVisual?.scale || 1.15) * tw.sc * 0.95;
        const dw = fw * sScale;
        const dh = fh * sScale;

        ctx.save();
        ctx.globalAlpha = alpha * 0.95;
        ctx.imageSmoothingEnabled = false;
        ctx.filter = 'hue-rotate(60deg) brightness(1.2)'; // Jade/Cyan Draconic Twister
        ctx.drawImage(spritesheetImg, sx, sy, fw, fh, curX - dw / 2, curY - dh + 10, dw, dh);
        ctx.restore();
      }

      // Spiral draconic wind particles trailing behind
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let w = 0; w < 3; w++) {
        const wAngle = p * 20 + w * 2.0;
        const wx = curX + Math.cos(wAngle) * 12;
        const wy = curY + Math.sin(wAngle) * 8 - 4;
        ctx.fillStyle = '#38BDF8';
        ctx.globalAlpha = alpha * 0.7;
        ctx.fillRect(Math.round(wx), Math.round(wy), 2, 2);
      }
      ctx.restore();
    } else {
      // Impact on target: Ascending cyclonic updraft lifting the enemy
      const impP = Math.min(1.0, (twProg - 1.0) / 0.40);
      if (impP < 1.0) {
        const impAlpha = 1.0 - impP;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Ascending cyclonic wind rings around the lifted target
        const liftY = impP * 45;
        const ringY = targetY - liftY + (i - 1) * 8;
        const ringRadX = (12 + impP * 20) * tw.sc;
        const ringRadY = (5 + impP * 8) * tw.sc;

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = Math.max(1, (1 - impP) * 2.5);
        ctx.globalAlpha = impAlpha * 0.85;
        ctx.beginPath();
        ctx.ellipse(targetX + (i - 1) * 6, ringY, ringRadX, ringRadY, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner luminous white-cyan spiral ring
        ctx.strokeStyle = '#E0F2FE';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = impAlpha * 0.9;
        ctx.beginPath();
        ctx.ellipse(targetX + (i - 1) * 6, ringY, ringRadX * 0.65, ringRadY * 0.65, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Whirling wind particles swirling up with the victim
        for (let pIdx = 0; pIdx < 3; pIdx++) {
          const wAngle = impP * 18 + pIdx * 2.1 + i * 1.5;
          const px = targetX + Math.cos(wAngle) * ringRadX * 1.1;
          const py = ringY + Math.sin(wAngle) * ringRadY * 1.1;
          ctx.fillStyle = pIdx % 2 === 0 ? '#38BDF8' : '#7DD3FC';
          ctx.globalAlpha = impAlpha * 0.8;
          ctx.fillRect(Math.round(px), Math.round(py), 2.5, 2.5);
        }

        ctx.restore();
      }
    }
  }
}

/**
 * Dragon Ascent: Dash -> Soar Sky (Untargetable) -> Green Breath Dive -> Impact with Emerald Burning Effect
 */
export function renderDragonAscentCombat(ctx, startX, startY, targetX, targetY, p, spritesheetImg, spriteVisual) {
  // Phase 1 (0.00 <= p < 0.32): High-Speed Forward Dash
  if (p < 0.32) {
    const rushProg = p / 0.32;
    const curX = startX + (targetX - startX) * rushProg;
    const curY = startY + (targetY - startY) * rushProg;

    // Emerald speed trail
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 2.5;
    for (let s = 0; s < 4; s++) {
      const sy = curY - 12 + s * 8;
      const sLen = 25 + Math.random() * 15;
      ctx.globalAlpha = 0.6 + Math.random() * 0.4;
      ctx.beginPath();
      ctx.moveTo(curX - sLen, sy);
      ctx.lineTo(curX, sy);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  // Phase 2 (0.32 <= p < 0.58): Soaring High into the Sky (Untargetable)
  if (p < 0.58) {
    const ascProg = (p - 0.32) / 0.26;
    const skyY = (startY + targetY) / 2 - Math.sin(ascProg * Math.PI * 0.5) * 110;
    const skyX = (startX + targetX) / 2;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // Ascending emerald aura column
    ctx.fillStyle = '#22C55E';
    ctx.globalAlpha = (1 - ascProg) * 0.55;
    ctx.fillRect(skyX - 4, skyY, 8, 80);

    // Radiance ring
    ctx.strokeStyle = '#4ADE80';
    ctx.lineWidth = 2;
    ctx.globalAlpha = Math.sin(ascProg * Math.PI) * 0.8;
    ctx.beginPath();
    ctx.arc(skyX, skyY, 16 + ascProg * 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }

  // Phase 3 (0.58 <= p < 0.78): High Altitude Green Dragon Breath Dive onto Target
  if (p < 0.78) {
    const diveProg = (p - 0.58) / 0.20;
    const fromX = targetX - 60 * (1 - diveProg);
    const fromY = targetY - 110 * (1 - diveProg);
    const diveAngle = Math.atan2(targetY - fromY, targetX - fromX);

    // Green dragon breath beam / stream dive
    if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
      const cols = spriteVisual?.cols || 8;
      const rows = spriteVisual?.rows || 8;
      const fw = spritesheetImg.naturalWidth / cols;
      const fh = spritesheetImg.naturalHeight / rows;
      const frame = Math.floor(diveProg * 40) % 61;
      const sx = (frame % cols) * fw;
      const sy = Math.floor(frame / cols) * fh;

      const scale = (spriteVisual?.scale || 1.35) * 1.1;
      const dw = fw * scale;
      const dh = fh * scale;

      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.filter = 'hue-rotate(290deg) saturate(2.0) brightness(1.15)'; // Emerald Green Flame!
      ctx.translate(fromX, fromY);
      ctx.rotate(diveAngle);
      ctx.drawImage(spritesheetImg, sx, sy, fw, fh, -dw * 0.45, -dh / 2, dw, dh);
      ctx.restore();
    }

    // Emerald trailing sparks
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = '#22C55E';
    for (let sp = 0; sp < 4; sp++) {
      const ex = fromX - Math.cos(diveAngle) * (sp * 14);
      const ey = fromY - Math.sin(diveAngle) * (sp * 14);
      ctx.fillRect(Math.round(ex), Math.round(ey), 2.5, 2.5);
    }
    ctx.restore();
    return;
  }

  // Impact Phase: Burning Effect Enveloping Enemy
  const impP = (p - 0.78) / 0.22;
  renderBurningAuraCombat(ctx, targetX, targetY, impP, spritesheetImg, spriteVisual, '#22C55E', 'hue-rotate(290deg) saturate(2.0) brightness(1.15)');
}

/**
 * Air Cutter: Volumetric Multi-Blade Slicing Razor Winds
 */
export function renderAirCutterCombat(ctx, startX, startY, targetX, targetY, p, spritesheetImg, spriteVisual) {
  const alpha = Math.sin(p * Math.PI);
  if (alpha <= 0.01) return;

  const travelProg = Math.min(1.0, p / 0.72);
  const curX = startX + (targetX - startX) * travelProg;
  const curY = startY + (targetY - startY) * travelProg;

  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const cols = spriteVisual?.cols || 4;
    const rows = spriteVisual?.rows || 4;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;
    const totalFrames = (spriteVisual?.endFrame - spriteVisual?.startFrame + 1) || 16;
    const frame = (spriteVisual?.startFrame || 0) + Math.floor(p * totalFrames * 1.5) % totalFrames;
    const sx = (frame % cols) * fw;
    const sy = Math.floor(frame / cols) * fh;

    const sScale = (spriteVisual?.scale || 1.25) * 1.15;
    const dw = fw * sScale;
    const dh = fh * sScale;

    ctx.save();
    ctx.globalAlpha = alpha * 0.98;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, sy, fw, fh, curX - dw / 2, curY - dh / 2 - 4, dw, dh);
    ctx.restore();
  }

  // Slicing wind crescents
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(curX, curY, 22 * alpha, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();
  ctx.restore();

  // Cross slice on impact
  if (p >= 0.70) {
    const impP = (p - 0.70) / 0.30;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = '#BAE6FD';
    ctx.lineWidth = 3.0 * (1 - impP);
    ctx.globalAlpha = (1 - impP) * alpha;
    ctx.beginPath();
    ctx.moveTo(targetX - 25 * (1 - impP), targetY - 25 * (1 - impP));
    ctx.lineTo(targetX + 25 * (1 - impP), targetY + 25 * (1 - impP));
    ctx.moveTo(targetX + 25 * (1 - impP), targetY - 25 * (1 - impP));
    ctx.lineTo(targetX - 25 * (1 - impP), targetY + 25 * (1 - impP));
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Whirlwind / Twister: Rising Cyclonic Tornado Vortex on Target
 */
export function renderWhirlwindCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual, type) {
  const alpha = Math.sin(p * Math.PI);
  if (alpha <= 0.01) return;

  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const totalFrames = (spriteVisual?.endFrame - spriteVisual?.startFrame + 1) || 19;
    const cols = spriteVisual?.cols || 5;
    const rows = spriteVisual?.rows || 4;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;

    const frameIndex = Math.min(totalFrames - 1, Math.floor(p * totalFrames * 1.5) % totalFrames);
    const sx = (frameIndex % cols) * fw;
    const sy = Math.floor(frameIndex / cols) * fh;

    const sScale = (spriteVisual?.scale || 1.25) * 1.15;
    const dw = fw * sScale;
    const dh = fh * sScale;

    ctx.save();
    ctx.globalAlpha = alpha * 0.95;
    ctx.imageSmoothingEnabled = false;
    if (type === 'Dragon' || type === 'DRAGON') {
      ctx.filter = 'hue-rotate(60deg) brightness(1.2)'; // Draconic Jade/Cyan Cyclone
    }
    ctx.drawImage(spritesheetImg, sx, sy, fw, fh, targetX - dw / 2, targetY - dh + 12, dw, dh);
    ctx.restore();
  }

  // Rising spiral wind particles
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let c = 0; c < 6; c++) {
    const cProg = (p * 2.5 + c / 6) % 1.0;
    const cy = targetY + 6 - cProg * 45;
    const rad = 12 + cProg * 16;
    const ang = p * 18 + c * 1.2;
    const cx = targetX + Math.cos(ang) * rad;
    ctx.fillStyle = type === 'Dragon' ? '#38BDF8' : '#F1F5F9';
    ctx.globalAlpha = Math.sin(cProg * Math.PI) * alpha * 0.75;
    ctx.fillRect(cx, cy, 2, 2);
  }
  ctx.restore();
}

/**
 * Night Daze: Expanding Dark & Crimson Illusionary Dome Blast
 */
export function renderNightDazeCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual) {
  const alpha = Math.sin(p * Math.PI);
  if (alpha <= 0.01) return;

  const isCondensed = spriteVisual?.burstVariation === 'condensed';
  const rippleRadius = isCondensed ? 30 : 42;
  const rippleHeight = isCondensed ? 14 : 20;

  // Dark Crimson Ground Ripples
  ctx.save();
  ctx.lineWidth = isCondensed ? 2.0 : 2.5;
  ctx.strokeStyle = isCondensed ? '#be123c' : '#E11D48';
  ctx.shadowColor = '#BE123C';
  ctx.shadowBlur = isCondensed ? 6 : 8;
  ctx.globalAlpha = (1 - p) * 0.85;
  ctx.beginPath();
  ctx.ellipse(targetX, targetY + 6, p * rippleRadius, p * rippleHeight, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Illusionary Dark Dome Sprite
  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const totalFrames = (spriteVisual?.endFrame - spriteVisual?.startFrame + 1) || 16;
    const cols = spriteVisual?.cols || 4;
    const rows = spriteVisual?.rows || 4;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;

    const frameIndex = Math.min(totalFrames - 1, Math.floor(p * totalFrames));
    const sx = (frameIndex % cols) * fw;
    const sy = Math.floor(frameIndex / cols) * fh;

    const baseScale = isCondensed ? 1.15 : (spriteVisual?.scale || 1.35);
    const sScale = baseScale * 1.15;
    const dw = fw * sScale;
    const dh = fh * sScale;

    ctx.save();
    ctx.globalAlpha = alpha * 0.98;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, sy, fw, fh, targetX - dw / 2, targetY - dh / 2 - 4, dw, dh);
    ctx.restore();
  }
}

/**
 * Snarl: Expanding Concentric Circular Dark Acoustic Wave Shockwave
 */
export function renderSnarlCombat(ctx, startX, startY, targetX, targetY, p, spritesheetImg, spriteVisual) {
  const alpha = Math.sin(p * Math.PI);
  if (alpha <= 0.01) return;

  const hitThreshold = 0.70;
  const travelProg = Math.min(1.0, p / hitThreshold);
  const curX = startX + (targetX - startX) * travelProg;
  const curY = startY + (targetY - startY) * travelProg;

  // 1. IN FLIGHT: Expanding circular acoustic shockwave
  if (p < hitThreshold) {
    // Sonic soundwave concentric ripples
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let w = 0; w < 3; w++) {
      const wFrac = (travelProg * 1.5 + w * 0.3) % 1.0;
      const wRadius = 12 + wFrac * 22;
      ctx.strokeStyle = w % 2 === 0 ? '#a855f7' : '#7c3aed';
      ctx.lineWidth = 1.5 * (1 - wFrac);
      ctx.globalAlpha = (1 - wFrac) * alpha * 0.7;
      ctx.beginPath();
      ctx.ellipse(curX - (1 - travelProg) * 8, curY, wRadius, wRadius * 0.85, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Animated soundwave spritesheet
    if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
      const cols = spriteVisual?.cols || 6;
      const rows = spriteVisual?.rows || 1;
      const fw = spritesheetImg.naturalWidth / cols;
      const fh = spritesheetImg.naturalHeight / rows;
      const totalFrames = (spriteVisual?.endFrame - spriteVisual?.startFrame + 1) || 6;
      const frame = spriteVisual.startFrame + Math.floor(travelProg * totalFrames) % totalFrames;
      const sx = (frame % cols) * fw;
      const sy = Math.floor(frame / cols) * fh;
      const scale = (spriteVisual?.scale || 1.35) * (0.85 + travelProg * 0.45);
      const dw = fw * scale;
      const dh = fh * scale;

      ctx.save();
      ctx.globalAlpha = alpha * 0.95;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(spritesheetImg, sx, sy, fw, fh, curX - dw / 2, curY - dh / 2, dw, dh);
      ctx.restore();
    }
  } else {
    // 2. ON TARGET IMPACT: Sonic reverberation explosion
    const impactProg = (p - hitThreshold) / (1.0 - hitThreshold);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2.5 * (1 - impactProg);
    ctx.globalAlpha = (1 - impactProg) * 0.9;
    ctx.beginPath();
    ctx.arc(targetX, targetY, impactProg * 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#581c87';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(targetX, targetY, impactProg * 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Spacial Rend: Cosmic Subspace Tear Slashing across Reality
 */
export function renderSpacialRendCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual) {
  const alpha = Math.sin(p * Math.PI);
  if (alpha <= 0.01) return;

  // Diagonal Reality Distortion Slice
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = '#EC4899';
  ctx.lineWidth = 1.8;
  ctx.globalAlpha = alpha * 0.8;
  ctx.beginPath();
  ctx.moveTo(targetX - 45, targetY - 30);
  ctx.lineTo(targetX + 45, targetY + 30);
  ctx.stroke();
  ctx.restore();

  // Cosmic Subspace Rift Sprite
  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
    const totalFrames = (spriteVisual?.endFrame - spriteVisual?.startFrame + 1) || 16;
    const cols = spriteVisual?.cols || 4;
    const rows = spriteVisual?.rows || 4;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;

    const frameIndex = Math.min(totalFrames - 1, Math.floor(p * totalFrames));
    const sx = (frameIndex % cols) * fw;
    const sy = Math.floor(frameIndex / cols) * fh;

    const sScale = (spriteVisual?.scale || 1.35) * 1.15;
    const dw = fw * sScale;
    const dh = fh * sScale;

    ctx.save();
    ctx.globalAlpha = alpha * 0.98;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, sy, fw, fh, targetX - dw / 2, targetY - dh / 2 - 4, dw, dh);
    ctx.restore();
  }
}

/**
 * Render Thunder / Thunderbolt Overhead Lightning Strike (Move Catalog authentic)
 */
export function renderCombatLightning(ctx, targetX, targetY, progress, spritesheetImg, spriteVisual, onlySprite = false) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  const alpha = progress < 0.65 ? 1.0 : (1 - (progress - 0.65) / 0.35);
  if (alpha <= 0.01) { ctx.restore(); return; }

  // 1. Procedural Lightning Bolt (only if not onlySprite / noExtraVfx)
  const skipProcedural = onlySprite || (spriteVisual && (spriteVisual.onlySprite || spriteVisual.noExtraVfx));
  if (!skipProcedural) {
    const startY = 6;
    const segments = 8;
    const stepY = (targetY - startY) / segments;
    const points = [{ x: targetX, y: startY }];

    for (let i = 1; i <= segments; i++) {
      const curY = startY + stepY * i;
      const jitter = i === segments ? 0 : Math.sin(i * 3.7 + progress * 15) * 14 + Math.sin(i * 7.2) * 7;
      points.push({ x: targetX + jitter, y: curY });
    }

    // Outer Corona
    ctx.globalAlpha = alpha * 0.45;
    ctx.strokeStyle = '#FF9100';
    ctx.lineWidth = 5.0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();

    // Yellow Plasma
    ctx.globalAlpha = alpha * 0.85;
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();

    // White Razor Core
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
  }

  // 2. Thunder Spritesheet (core/thunder_01.png or vfx/custom/lightning_strike.png)
  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0 && spriteVisual) {
    const cols = spriteVisual.cols || 5;
    const rows = spriteVisual.rows || 1;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;
    const totalFrames = (spriteVisual.endFrame - spriteVisual.startFrame + 1);
    const frame = spriteVisual.startFrame + Math.floor(progress * totalFrames * 2) % totalFrames;
    const sx = (frame % cols) * fw;
    const sy = Math.floor(frame / cols) * fh;

    const sScale = spriteVisual.scale || 0.55;
    const dw = fw * sScale * 1.35;
    const dh = fh * sScale * 1.35;
    const offY = spriteVisual.offsetY || 0;

    ctx.globalAlpha = alpha * 0.95;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, sy, fw, fh, targetX - dw / 2, targetY - dh / 2 + offY, dw, dh);
  }

  // Ground Flash
  if (!skipProcedural) {
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = alpha * 0.7;
    ctx.beginPath();
    ctx.ellipse(targetX, targetY + 6, 14 * (1 - progress), 7 * (1 - progress), 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Render Physical Dash Attacks (Volt Tackle, Bolt Strike, Blaze Kick, Tackle, etc.)
 */
export function renderCombatDash(ctx, startX, startY, targetX, targetY, progress, move, spritesheetImg, spriteVisual) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const hitThreshold = 0.65;
  const pal = getTypePalette(move?.type || 'normal');

  // 1. DASHING FORWARD (p < 0.65)
  if (p < hitThreshold) {
    const rushProg = p / hitThreshold;
    let curX, curY;

    // Dedicated Feint Attack Trajectory: Deceptive Juke Arc followed by Direct Surprise Strike
    if (spriteVisual?.isFeint || move?.internalName === 'FEINTATTACK') {
      if (rushProg < 0.40) {
        const fakeProg = rushProg / 0.40;
        const jukeApexY = -28 * Math.sin(fakeProg * Math.PI);
        const jukeX = startX + (targetX - startX) * 0.28 * fakeProg;
        curX = jukeX;
        curY = startY + jukeApexY;

        // Ghostly purple shadow silhouette afterimage at apex
        ctx.save();
        ctx.globalAlpha = 0.55 * Math.sin(fakeProg * Math.PI);
        ctx.fillStyle = '#6b21a8';
        ctx.beginPath();
        ctx.arc(curX - 6, curY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        const snapProg = (rushProg - 0.40) / 0.60;
        const snapEase = Math.pow(snapProg, 2.0);
        const feintStartX = startX + (targetX - startX) * 0.28;
        curX = feintStartX + (targetX - feintStartX) * snapEase;
        curY = startY + (targetY - startY) * snapEase;
      }
    } else {
      // Standard ease in-out charge
      const easeRush = rushProg < 0.3 ? (rushProg / 0.3) * 0.15 : 0.15 + ((rushProg - 0.3) / 0.7) * 0.85;
      curX = startX + (targetX - startX) * easeRush;
      curY = startY + (targetY - startY) * easeRush;
    }

    // Motion Speed Lines
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = (spriteVisual?.isFeint || move?.type === 'Dark') ? '#c084fc' : pal.primary;
    ctx.lineWidth = 2.0;
    for (let s = 0; s < 4; s++) {
      const sy = curY - 14 + s * 9;
      const sLen = 22 + Math.random() * 16;
      ctx.globalAlpha = 0.5 + Math.random() * 0.4;
      ctx.beginPath();
      ctx.moveTo(curX - sLen, sy);
      ctx.lineTo(curX, sy);
      ctx.stroke();
    }

    // Electric / Fire / Megahorn Aura during rush
    const mName = (move?.name || '').toLowerCase();
    if (mName.includes('megahorn') || move?.internalName === 'MEGAHORN') {
      // Chitin green & white speed sparks
      ctx.fillStyle = '#8be316';
      for (let sp = 0; sp < 4; sp++) {
        const rx = curX - Math.random() * 20;
        const ry = curY + (Math.random() - 0.5) * 16;
        ctx.fillRect(rx, ry, 2, 2);
      }
    } else if (mName.includes('volt tackle') || mName.includes('bolt strike') || move?.vfxFamily === 'electric') {
      ctx.fillStyle = '#FFFF00';
      for (let sp = 0; sp < 5; sp++) {
        const rx = curX + (Math.random() - 0.5) * 28;
        const ry = curY + (Math.random() - 0.5) * 24;
        ctx.fillRect(rx, ry, 2.5, 2.5);
      }
    } else if (mName.includes('blaze kick') || (move?.type || '').toUpperCase() === 'FIRE') {
      ctx.fillStyle = '#FF4500';
      for (let sp = 0; sp < 5; sp++) {
        const rx = curX - Math.random() * 22;
        const ry = curY + (Math.random() - 0.5) * 20;
        ctx.fillRect(rx, ry, 3, 3);
      }
    }
  }

  // 2. IMPACT ON TARGET (p >= 0.65)
  if (p >= hitThreshold) {
    const impactProg = (p - hitThreshold) / (1.0 - hitThreshold);
    const impAlpha = 1.0 - impactProg * 0.7;

    // Draw Associated Hit / Thunder / Fire / Scissor Spritesheet
    if (spriteVisual?.isXScissor) {
      const crossColor = (move?.type === 'Dark' || spriteVisual?.isNightSlash) ? '#c084fc' : pal.primary;
      renderXScissorCombat(ctx, targetX, targetY, impactProg, spritesheetImg, spriteVisual, crossColor);
    } else if (spriteVisual?.isHyperspaceFury || move?.internalName === 'HYPERSPACEFURY') {
      // Dedicated 3-Hit Rapid Dimensional Slash Flurry with thief_swipe_dark.png
      const slashes = [
        { startP: 0.00, endP: 0.48, ang: -0.52, dx: -10, dy: -6 },
        { startP: 0.26, endP: 0.74, ang: 0.52, dx: 10, dy: 4 },
        { startP: 0.52, endP: 1.00, ang: 0.00, dx: 0, dy: -4 }
      ];
      if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0) {
        const cols = spriteVisual.cols || 5;
        const rows = spriteVisual.rows || 1;
        const fw = spritesheetImg.naturalWidth / cols;
        const fh = spritesheetImg.naturalHeight / rows;
        const totalFrames = (spriteVisual.endFrame - spriteVisual.startFrame + 1);

        for (let h = 0; h < slashes.length; h++) {
          const sl = slashes[h];
          if (impactProg >= sl.startP && impactProg <= sl.endP) {
            const hProg = (impactProg - sl.startP) / (sl.endP - sl.startP);
            const hAlpha = Math.sin(hProg * Math.PI);
            const fRel = Math.min(totalFrames - 1, Math.floor(hProg * totalFrames));
            const frame = spriteVisual.startFrame + fRel;
            const sx = (frame % cols) * fw;
            const sy = Math.floor(frame / cols) * fh;
            const sScale = (spriteVisual.scale || 1.45) * 1.25;
            const dw = fw * sScale;
            const dh = fh * sScale;

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = hAlpha * 0.95;
            ctx.imageSmoothingEnabled = false;
            ctx.translate(targetX + sl.dx, targetY + sl.dy);
            ctx.rotate(sl.ang);
            ctx.drawImage(spritesheetImg, sx, sy, fw, fh, -dw / 2, -dh / 2, dw, dh);
            ctx.restore();

            // Violet dimensional rift spark motes
            ctx.fillStyle = h % 2 === 0 ? '#c084fc' : '#a855f7';
            ctx.fillRect(targetX + sl.dx + (Math.random() - 0.5) * 20, targetY + sl.dy + (Math.random() - 0.5) * 16, 2, 2);
          }
        }
      }
    } else if (spriteVisual?.isNightDazeBurst || (spriteVisual?.file && spriteVisual.file.includes('night_daze_burst'))) {
      // Foul Play, Assurance & Payback: Dome blast explosion on dash impact!
      renderNightDazeCombat(ctx, targetX, targetY, impactProg, spritesheetImg, spriteVisual);
    } else if (move?.vfxFamily === 'bite') {
      renderCombatBite(ctx, targetX, targetY, impactProg, spritesheetImg, spriteVisual);
    } else if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0 && spriteVisual) {
      const cols = spriteVisual.cols || 5;
      const rows = spriteVisual.rows || 1;
      const fw = spritesheetImg.naturalWidth / cols;
      const fh = spritesheetImg.naturalHeight / rows;
      const totalFrames = (spriteVisual.endFrame - spriteVisual.startFrame + 1);

      let frameRel = Math.floor(impactProg * totalFrames);
      frameRel = Math.min(totalFrames - 1, frameRel);
      const frame = spriteVisual.startFrame + frameRel;
      const sx = (frame % cols) * fw;
      const sy = Math.floor(frame / cols) * fh;

      const sScale = spriteVisual.scale || 1.0;
      const dw = fw * sScale * 1.35;
      const dh = fh * sScale * 1.35;
      const offY = spriteVisual.offsetY || 0;

      ctx.save();
      ctx.globalAlpha = impAlpha;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(spritesheetImg, sx, sy, fw, fh, targetX - dw / 2, targetY - dh / 2 + offY, dw, dh);
      ctx.restore();
    }

    // Heavy Slam Blast Shockwave
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = (1 - impactProg) * 0.9;
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = Math.max(1, (1 - impactProg) * 4);
    ctx.beginPath();
    ctx.ellipse(targetX, targetY, impactProg * 36, impactProg * 20, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Render Dual Crossing X-Scissor Cuts with Scissor Clamp Impact & Glowing X Flash
 */
export function renderXScissorCombat(ctx, targetX, targetY, progress, spritesheetImg = null, spriteVisual = null, baseColor = '#8be316') {
  ctx.save();
  const alpha = Math.sin(progress * Math.PI);
  if (alpha <= 0.01) { ctx.restore(); return; }

  ctx.globalCompositeOperation = 'lighter';
  ctx.imageSmoothingEnabled = false;

  // Dual Crossing Scythe Blades (smear_v_01.png) closing in like a pair of scissors
  const clampOffset = Math.max(0, (1.0 - Math.min(1.0, progress / 0.42))) * 22;
  const sScale = spriteVisual?.scale || 1.35;
  const offY = spriteVisual?.offsetY || 0;

  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0 && spriteVisual) {
    const cols = spriteVisual.cols || 6;
    const rows = spriteVisual.rows || 1;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;
    const totalFrames = (spriteVisual.endFrame - spriteVisual.startFrame + 1);
    const frame = spriteVisual.startFrame + Math.min(totalFrames - 1, Math.floor(progress * totalFrames));
    const sx = (frame % cols) * fw;
    const sy = Math.floor(frame / cols) * fh;
    const dw = fw * sScale;
    const dh = fh * sScale;

    ctx.globalAlpha = alpha * 0.95;

    // Blade 1: Top-Left to Bottom-Right (Rotated ~ -45°)
    ctx.save();
    ctx.translate(targetX - clampOffset * 0.7, targetY - clampOffset * 0.7 + offY);
    ctx.rotate(-0.785); // -45 deg
    ctx.drawImage(spritesheetImg, sx, sy, fw, fh, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();

    // Blade 2: Top-Right to Bottom-Left (Flipped horizontally & Rotated ~ +45°)
    ctx.save();
    ctx.translate(targetX + clampOffset * 0.7, targetY - clampOffset * 0.7 + offY);
    ctx.rotate(0.785); // +45 deg
    ctx.scale(-1, 1);
    ctx.drawImage(spritesheetImg, sx, sy, fw, fh, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  // Authentic pixel-art cross flash and spark bursts when blades intersect
  if (progress > 0.32 && progress < 0.70) {
    const flashAlpha = Math.sin((progress - 0.32) / 0.38 * Math.PI);
    const cx = Math.round(targetX);
    const cy = Math.round(targetY + offY);

    // Pixelated crossing X spark
    const arm = Math.round(flashAlpha * 7);
    ctx.globalAlpha = flashAlpha * 0.95;
    ctx.fillStyle = '#FFFFFF';
    for (let d = -arm; d <= arm; d++) {
      ctx.fillRect(cx + d * 2, cy + d * 2, 2, 2);
      ctx.fillRect(cx + d * 2, cy - d * 2, 2, 2);
    }

    // Pixel core accent
    const isDarkSlash = spriteVisual?.isNightSlash || spriteVisual?.isHoneClaws || (baseColor && (baseColor.includes('c084fc') || baseColor.includes('a855f7') || baseColor.includes('purple')));
    ctx.fillStyle = isDarkSlash ? '#c084fc' : '#a3e635';
    ctx.fillRect(cx - 3, cy - 3, 6, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 1, cy - 1, 2, 2);

    // Scattered 16-bit cutting debris pixels
    ctx.fillStyle = isDarkSlash ? '#e9d5ff' : '#d9f99d';
    const spr = Math.round(flashAlpha * 14);
    ctx.fillRect(cx - spr, cy, 2, 2);
    ctx.fillRect(cx + spr, cy, 2, 2);
    ctx.fillRect(cx, cy - spr, 2, 2);
    ctx.fillRect(cx, cy + spr, 2, 2);
  }

  ctx.restore();
}

/**
 * Render Slash / Claws across Target with Associated Sprite (Smear 01 / Shadow Claw / X-Scissor)
 */
export function renderCombatSlash(ctx, targetX, targetY, progress, color = '#38bdf8', spritesheetImg = null, spriteVisual = null) {
  ctx.save();
  const alpha = Math.sin(progress * Math.PI);
  if (alpha <= 0.01) { ctx.restore(); return; }

  if (spriteVisual?.isSpacialRend) {
    renderSpacialRendCombat(ctx, targetX, targetY, progress, spritesheetImg, spriteVisual);
    ctx.restore();
    return;
  }
  if (spriteVisual?.isAirCutter) {
    renderAirCutterCombat(ctx, targetX - 90, targetY, targetX, targetY, progress, spritesheetImg, spriteVisual);
    ctx.restore();
    return;
  }
  if (spriteVisual?.isXScissor) {
    renderXScissorCombat(ctx, targetX, targetY, progress, spritesheetImg, spriteVisual, color);
    ctx.restore();
    return;
  }

  ctx.globalCompositeOperation = 'lighter';

  // Draw Smear Spritesheet if available
  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0 && spriteVisual) {
    const cols = spriteVisual.cols || 5;
    const rows = spriteVisual.rows || 1;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;
    const totalFrames = (spriteVisual.endFrame - spriteVisual.startFrame + 1);
    const frame = spriteVisual.startFrame + Math.floor(progress * totalFrames * 2) % totalFrames;
    const sx = (frame % cols) * fw;
    const sy = Math.floor(frame / cols) * fh;

    const sScale = spriteVisual.scale || 1.35;
    const dw = fw * sScale;
    const dh = fh * sScale;
    const offY = spriteVisual.offsetY || 0;

    ctx.globalAlpha = alpha * 0.95;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, sy, fw, fh, targetX - dw / 2, targetY - dh / 2 + offY, dw, dh);
  } else {
    const len = 30 + progress * 18;
    for (let s = -1; s <= 1; s += 2) {
      const offX = s * 7;
      ctx.globalAlpha = alpha * 0.6;
      ctx.lineWidth = 4.0;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(targetX + offX - len * 0.6, targetY - len * 0.6);
      ctx.quadraticCurveTo(targetX + offX, targetY, targetX + offX + len * 0.6, targetY + len * 0.6);
      ctx.stroke();

      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(targetX + offX - len * 0.6, targetY - len * 0.6);
      ctx.quadraticCurveTo(targetX + offX, targetY, targetX + offX + len * 0.6, targetY + len * 0.6);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Render Bite on Target with Teeth Sprite
 */
export function renderCombatBite(ctx, targetX, targetY, progress, spritesheetImg = null, spriteVisual = null) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const clampDist = Math.max(0, (1 - Math.min(1, progress * 2.5)) * 24);
  const alpha = progress < 0.7 ? 1.0 : (1 - (progress - 0.7) / 0.3);
  if (alpha <= 0.01) { ctx.restore(); return; }

  // Draw teeth sprite if available
  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0 && spriteVisual) {
    const cols = spriteVisual.cols || 5;
    const rows = spriteVisual.rows || 1;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;
    const totalFrames = (spriteVisual.endFrame - spriteVisual.startFrame + 1);
    const frame = spriteVisual.startFrame + Math.floor(progress * totalFrames * 2) % totalFrames;
    const sx = (frame % cols) * fw;
    const sy = Math.floor(frame / cols) * fh;

    const sScale = spriteVisual.scale || 0.5;
    const dw = fw * sScale * 1.35;
    const dh = fh * sScale * 1.35;
    const offY = spriteVisual.offsetY || 0;

    ctx.globalAlpha = alpha * 0.95;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, sy, fw, fh, targetX - dw / 2, targetY - dh / 2 + offY, dw, dh);
  } else {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#FFFFFF';

    // Top Fangs
    for (let f = -1; f <= 1; f += 2) {
      const fx = targetX + f * 9;
      const fy = targetY - clampDist;
      ctx.beginPath();
      ctx.moveTo(fx - 3.5, fy - 5);
      ctx.lineTo(fx + 3.5, fy - 5);
      ctx.lineTo(fx, fy + 7);
      ctx.closePath();
      ctx.fill();
    }

    // Bottom Fangs
    for (let f = -1; f <= 1; f += 2) {
      const fx = targetX + f * 9;
      const fy = targetY + clampDist;
      ctx.beginPath();
      ctx.moveTo(fx - 3.5, fy + 5);
      ctx.lineTo(fx + 3.5, fy + 5);
      ctx.lineTo(fx, fy - 7);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Render Ground / Earth Damage with Earth Effect 01 (freezes on last frame!)
 */
export function renderCombatEarth(ctx, targetX, targetY, progress, spritesheetImg = null, spriteVisual = null) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));

  // Ground Tremor / Shake during initial impact
  const rumble = (p > 0.15 && p < 0.65) ? Math.sin(p * 45) * 2.5 : 0;
  const groundY = targetY + 12 + (spriteVisual ? (spriteVisual.offsetY || 0) : 0);

  ctx.save();
  ctx.translate(targetX + rumble, groundY);

  // Authentic Ground Crater Spiked Pixel Art Sprite (animates and freezes on last frame)
  let groundImg = null;
  if (typeof Image !== 'undefined') {
    if (!renderCombatEarth._groundCraterImg) {
      renderCombatEarth._groundCraterImg = new Image();
      renderCombatEarth._groundCraterImg.src = '/assets/battle/animations/vfx/earth/ground_crater_spiked.png';
    }
    groundImg = renderCombatEarth._groundCraterImg;
  }

  if (groundImg && groundImg.complete && groundImg.naturalWidth > 0) {
    const totalCraterFrames = 6;
    const cfw = 192;
    const cfh = 160;
    const cAnimProg = Math.min(1.0, Math.max(0, (p - 0.10) / 0.40));
    let cFrame = Math.floor(cAnimProg * totalCraterFrames);
    if (cFrame >= totalCraterFrames) cFrame = totalCraterFrames - 1; // Freezes on last frame!
    const csx = cFrame * cfw;
    const cdw = 84;
    const cdh = 70;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(groundImg, csx, 0, cfw, cfh, -cdw / 2, -cdh / 2 + 6, cdw, cdh);
  }

  // Earth Effect 01 Spritesheet (Impact or Irregular rock)
  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0 && spriteVisual) {
    const cols = spriteVisual.cols || 7;
    const rows = spriteVisual.rows || 1;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;
    const totalFrames = (spriteVisual.endFrame - spriteVisual.startFrame + 1);

    // Advance frames from p = 0.15 to 0.60, then FREEZE ON LAST FRAME!
    const animProg = Math.min(1.0, Math.max(0, (p - 0.15) / 0.45));
    let frameRel = Math.floor(animProg * totalFrames);
    if (frameRel >= totalFrames) frameRel = totalFrames - 1; // FREEZES ON LAST FRAME!

    const frame = spriteVisual.startFrame + frameRel;
    const sx = (frame % cols) * fw;
    const sy = Math.floor(frame / cols) * fh;

    const sScale = spriteVisual.scale || 1.15;
    const dw = fw * sScale * 1.05;
    const dh = fh * sScale * 1.05;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, sy, fw, fh, -dw / 2, -dh + 6, dw, dh);
  }

  ctx.restore();

  // Flying Soil & Dust Particles
  if (p > 0.20 && p < 0.85) {
    const dProg = (p - 0.20) / 0.65;
    ctx.fillStyle = '#A1887F';
    for (let i = 0; i < 7; i++) {
      const ang = (i / 7) * Math.PI * 2;
      const dist = 18 + dProg * 26;
      const px = targetX + Math.cos(ang) * dist;
      const py = groundY - Math.sin(dProg * Math.PI) * 20 + Math.sin(ang) * (dist * 0.4);
      ctx.fillRect(px, py, 2.5, 2.5);
    }
  }

  ctx.restore();
}

/**
 * Render Concussive Punch / Physical Impact with Hit Effect
 */
export function renderCombatPunch(ctx, targetX, targetY, progress, color = '#FF9100', spritesheetImg = null, spriteVisual = null) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const alpha = 1.0 - progress;
  if (alpha <= 0.01) { ctx.restore(); return; }

  // Draw Hit Effect Sprite if available
  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0 && spriteVisual) {
    const cols = spriteVisual.cols || 7;
    const rows = spriteVisual.rows || 1;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;
    const totalFrames = (spriteVisual.endFrame - spriteVisual.startFrame + 1);
    const frame = spriteVisual.startFrame + Math.floor(progress * totalFrames * 2) % totalFrames;
    const sx = (frame % cols) * fw;
    const sy = Math.floor(frame / cols) * fh;

    const sScale = spriteVisual.scale || 1.1;
    const dw = fw * sScale * 1.35;
    const dh = fh * sScale * 1.35;
    const offY = spriteVisual.offsetY || 0;

    ctx.globalAlpha = alpha * 0.95;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spritesheetImg, sx, sy, fw, fh, targetX - dw / 2, targetY - dh / 2 + offY, dw, dh);
  } else {
    const dist = 9 + progress * 24;
    ctx.globalAlpha = alpha * 0.85;
    ctx.fillStyle = color;
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2;
      const tx = targetX + Math.cos(ang) * dist;
      const ty = targetY + Math.sin(ang) * dist * 0.75;
      ctx.beginPath();
      ctx.arc(tx, ty, Math.max(1, 3.2 * (1 - progress)), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(targetX, targetY, Math.max(1, 12 * (1 - progress)), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Render Ascending Stat Buff Spiral & Chevrons with Sprite
 */
export function renderCombatBuff(ctx, startX, startY, progress, type, spritesheetImg = null, spriteVisual = null, getImageFn = null) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const pal = getTypePalette(type);
  const alpha = Math.sin(progress * Math.PI);
  if (alpha <= 0.01) { ctx.restore(); return; }

  // 1. Hone Claws: Dual crossing sharpening claws on self
  if (spriteVisual?.isHoneClaws || (spriteVisual?.isXScissor && spriteVisual?.target === 'self')) {
    renderXScissorCombat(ctx, startX, startY, progress, spritesheetImg, spriteVisual, '#c084fc');
    ctx.restore();
    return;
  }

  // 2. Dark Void & Parting Shot: Illusionary Dark Dome Burst directly on target
  if (spriteVisual?.isNightDaze || (spriteVisual?.file && spriteVisual.file.includes('night_daze_burst'))) {
    renderNightDazeCombat(ctx, startX, startY, progress, spritesheetImg, spriteVisual);
    ctx.restore();
    return;
  }

  // 3. Dragon Dance: Burning effect enveloping self with red fire sprites
  if (spriteVisual?.isDragonDance || (spriteVisual?.file && spriteVisual.file.includes('group_4_5'))) {
    renderBurningAuraCombat(ctx, startX, startY, progress, spritesheetImg, spriteVisual, '#EF4444', null);
    ctx.restore();
    return;
  }

  // Ascending Double-Helix Particles (skipped if noExtraVfx is active or question marks)
  const skipParticles = spriteVisual?.noExtraVfx === true || spriteVisual?.isQuestionMarks;
  if (!skipParticles) {
    for (let arm = 0; arm < 2; arm++) {
      const armOffset = arm * Math.PI;
      for (let p = 0; p < 5; p++) {
        const pFrac = (progress * 1.5 + p / 5) % 1.0;
        const rad = 17 * (1.1 - pFrac * 0.2);
        const ang = armOffset + pFrac * Math.PI * 3;
        const px = startX + Math.cos(ang) * rad;
        const py = startY + 11 - pFrac * 34;

        ctx.fillStyle = p % 2 === 0 ? pal.glow : pal.inner;
        ctx.globalAlpha = Math.sin(pFrac * Math.PI) * alpha * 0.85;
        ctx.beginPath();
        ctx.arc(px, py, 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Draw Aura / Grass Sprite if available
  if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0 && spriteVisual) {
    const cols = spriteVisual.cols || 5;
    const rows = spriteVisual.rows || 1;
    const fw = spritesheetImg.naturalWidth / cols;
    const fh = spritesheetImg.naturalHeight / rows;
    const totalFrames = (spriteVisual.endFrame - spriteVisual.startFrame + 1);
    const frame = spriteVisual.startFrame + Math.floor(progress * totalFrames) % totalFrames;
    const sx = (frame % cols) * fw;
    const sy = Math.floor(frame / cols) * fh;

    const isCustomVfx = spriteVisual.file && (spriteVisual.file.includes('shield_bubble') || spriteVisual.file.includes('pillar') || spriteVisual.file.includes('lightning_strike') || spriteVisual.file.includes('vfx/custom/'));
    const sScale = spriteVisual.scale || 0.55;
    const scaleMultiplier = isCustomVfx ? 1.0 : 1.35;
    const dw = fw * sScale * scaleMultiplier;
    const dh = fh * sScale * scaleMultiplier;
    const offY = spriteVisual.offsetY || 0;

    const baseOpacity = typeof spriteVisual.opacity === 'number' ? spriteVisual.opacity : 0.85;
    ctx.globalAlpha = alpha * baseOpacity;
    ctx.imageSmoothingEnabled = false;
    if (spriteVisual.filter) {
      ctx.filter = spriteVisual.filter;
    }
    if (spriteVisual.file && spriteVisual.file.includes('shield_bubble')) {
      ctx.save();
      const shieldFrontX = startX + 22;
      const shieldFrontY = startY - 8 + offY;
      ctx.translate(shieldFrontX, shieldFrontY);
      ctx.rotate(Math.PI); // Rotate 180 degrees so convex barrier faces right towards the opponent
      ctx.drawImage(spritesheetImg, sx, sy, fw, fh, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
    } else if (spriteVisual.isHail) {
      // Hail: Multiple ice shards falling vertically from above directly onto the opponent down to the ground
      const shards = [
        { dx: 0, startY: -75, dropY: 82, pOffset: 0.0, sc: 0.95 },
        { dx: -18, startY: -85, dropY: 90, pOffset: 0.18, sc: 0.8 },
        { dx: 16, startY: -95, dropY: 96, pOffset: 0.36, sc: 0.85 },
        { dx: -8, startY: -70, dropY: 78, pOffset: 0.54, sc: 0.75 },
        { dx: 12, startY: -80, dropY: 88, pOffset: 0.72, sc: 0.8 }
      ];
      for (const sh of shards) {
        const shProg = (progress + sh.pOffset) % 1.0;
        const shFrame = spriteVisual.startFrame + Math.floor(shProg * totalFrames) % totalFrames;
        const shsx = (shFrame % cols) * fw;
        const shsy = Math.floor(shFrame / cols) * fh;
        const shdw = dw * sh.sc;
        const shdh = dh * sh.sc;
        const currentDropY = sh.startY + shProg * sh.dropY;
        ctx.drawImage(spritesheetImg, shsx, shsy, fw, fh, startX + sh.dx - shdw / 2, startY + currentDropY - shdh / 2 + offY, shdw, shdh);
      }
    } else {
      ctx.drawImage(spritesheetImg, sx, sy, fw, fh, startX - dw / 2, startY - dh / 2 + offY, dw, dh);
    }

    // Charm / Attract / Captivate / Lovely Kiss: Render heart particles
    if (spriteVisual.hearts && typeof getImageFn === 'function') {
      const heartImg = getImageFn('vfx/custom/heart_burst.png');
      if (heartImg && heartImg.complete && heartImg.naturalWidth > 0) {
        const hCols = 8;
        const hRows = 1;
        const hfw = heartImg.naturalWidth / hCols;
        const hfh = heartImg.naturalHeight / hRows;
        const hFrame = Math.floor(progress * 8) % 8;
        const hsx = hFrame * hfw;
        const hsy = 0;
        const hdw = hfw * 0.95;
        const hdh = hfh * 0.95;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(heartImg, hsx, hsy, hfw, hfh, startX - hdw / 2, startY - 12 - hdh / 2 + offY, hdw, hdh);
        ctx.restore();
      }
    }

    // Question Marks: Subtle scheming/confused purple aura halo
    if (spriteVisual.isQuestionMarks || (spriteVisual.file && spriteVisual.file.includes('question_marks'))) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha * 0.35;
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.ellipse(startX, startY - 26, 20, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Taunt: Enraged red spark bursts
    if (spriteVisual.file && spriteVisual.file.includes('attack_physical_01')) {
      ctx.save();
      ctx.fillStyle = '#ef4444';
      ctx.globalAlpha = alpha * 0.9;
      for (let sp = 0; sp < 6; sp++) {
        const rx = startX + (Math.random() - 0.5) * 48;
        const ry = startY + (Math.random() - 0.5) * 32;
        ctx.fillRect(rx, ry, 2.5, 2.5);
      }
      ctx.restore();
    }

    if (spriteVisual.filter) {
      ctx.filter = 'none';
    }
  }

  ctx.restore();
}

/**
 * Snarl / Bug Buzz Acoustic Shockwave
 */
export function renderCombatSoundWave(ctx, startX, startY, targetX, targetY, progress, isDark = true) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  const ringCount = 5;
  for (let i = 0; i < ringCount; i++) {
    const ringProg = (progress * 1.6 + i * 0.2) % 1.0;
    const curX = startX + (targetX - startX) * ringProg;
    const curY = startY + (targetY - startY) * ringProg;

    const radX = 8 + ringProg * 38;
    const radY = 14 + ringProg * 65;
    const ringAlpha = Math.sin(ringProg * Math.PI) * 0.9;

    ctx.globalAlpha = ringAlpha;
    ctx.lineWidth = 3.0 * (1 - ringProg * 0.4);
    ctx.strokeStyle = isDark ? '#A855F7' : '#38BDF8';
    ctx.beginPath();
    ctx.ellipse(curX, curY, radX, radY, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = ringAlpha * 0.8;
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(curX, curY, radX * 0.7, radY * 0.7, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Render Projectile in Flight with Particle Trail and Spritesheet Explosion upon impact
 */
export function renderCombatProjectile(ctx, startX, startY, targetX, targetY, progress, type, spritesheetImg, spriteVisual) {
  ctx.save();
  const p = Math.max(0, Math.min(1, progress));
  const pal = getTypePalette(type);

  // Dedicated Authentic Renderers
  if (spriteVisual?.isRoarOfTime) {
    renderRoarOfTimeCombat(ctx, startX, startY, targetX, targetY, p, spritesheetImg, spriteVisual);
    ctx.restore();
    return;
  }
  if (spriteVisual?.isDracoMeteor) {
    renderDracoMeteorCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual);
    ctx.restore();
    return;
  }
  if (spriteVisual?.isDragonRage) {
    renderDragonRageCombat(ctx, startX, startY, targetX, targetY, p, spritesheetImg, spriteVisual);
    ctx.restore();
    return;
  }
  if (spriteVisual?.isAirCutter) {
    renderAirCutterCombat(ctx, startX, startY, targetX, targetY, p, spritesheetImg, spriteVisual);
    ctx.restore();
    return;
  }
  if (spriteVisual?.isTwister) {
    renderTwisterCombat(ctx, startX, startY, targetX, targetY, p, spritesheetImg, spriteVisual, type);
    ctx.restore();
    return;
  }
  if (spriteVisual?.isWhirlwind) {
    renderWhirlwindCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual, type);
    ctx.restore();
    return;
  }
  if (spriteVisual?.isNightDaze) {
    renderNightDazeCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual);
    ctx.restore();
    return;
  }
  if (spriteVisual?.isSnarl || (spriteVisual?.file && spriteVisual.file.includes('snarl_soundwave'))) {
    renderSnarlCombat(ctx, startX, startY, targetX, targetY, p, spritesheetImg, spriteVisual);
    ctx.restore();
    return;
  }
  if (spriteVisual?.isSpacialRend) {
    renderSpacialRendCombat(ctx, targetX, targetY, p, spritesheetImg, spriteVisual);
    ctx.restore();
    return;
  }

  const hitThreshold = 0.70;
  const travelProg = Math.min(1.0, p / hitThreshold);
  const curX = startX + (targetX - startX) * travelProg;
  const curY = startY + (targetY - startY) * travelProg;

  // 1. IN FLIGHT: Radiant Projectile Orb + Multi-Particle Comet Tail (NO SPRITE OVERLAY)
  if (p < hitThreshold) {
    ctx.globalCompositeOperation = 'lighter';

    // Trailing luminous particles
    const trailCount = 6;
    for (let t = 0; t < trailCount; t++) {
      const tFrac = t / trailCount;
      const trailX = curX - (targetX - startX) * (0.06 * tFrac);
      const trailY = curY - (targetY - startY) * (0.06 * tFrac);
      const trailR = Math.max(1, (1 - tFrac) * 7.5);

      ctx.fillStyle = t % 2 === 0 ? pal.glow : pal.inner;
      ctx.globalAlpha = (1 - tFrac) * 0.75;
      ctx.beginPath();
      ctx.arc(trailX, trailY, trailR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing Core Orb
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = pal.primary;
    ctx.beginPath();
    ctx.arc(curX, curY, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.95;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(curX, curY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. UPON HITTING TARGET (p >= 0.70): Apply Spritesheet Explosion ON TARGET
  if (p >= hitThreshold) {
    const impactProg = (p - hitThreshold) / (1.0 - hitThreshold);
    const impAlpha = 1.0 - impactProg * 0.8;

    // A. Draw Spritesheet Impact Animation if available
    if (spritesheetImg && spritesheetImg.complete && spritesheetImg.naturalWidth > 0 && spriteVisual) {
      const cols = spriteVisual.cols || 5;
      const rows = spriteVisual.rows || 1;
      const fw = spritesheetImg.naturalWidth / cols;
      const fh = spritesheetImg.naturalHeight / rows;
      const totalFrames = (spriteVisual.endFrame - spriteVisual.startFrame + 1);

      let frameRel = Math.floor(impactProg * totalFrames);
      if (spriteVisual.freezeOnLastFrame && frameRel >= totalFrames) {
        frameRel = totalFrames - 1;
      } else {
        frameRel = Math.min(totalFrames - 1, frameRel);
      }
      const frame = spriteVisual.startFrame + frameRel;
      const sx = (frame % cols) * fw;
      const sy = Math.floor(frame / cols) * fh;

      const sScale = spriteVisual.scale || 1.0;
      const dw = fw * sScale * 1.35;
      const dh = fh * sScale * 1.35;
      const offY = spriteVisual.offsetY || 0;

      ctx.save();
      ctx.globalAlpha = impAlpha;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(spritesheetImg, sx, sy, fw, fh, targetX - dw / 2, targetY - dh / 2 + offY, dw, dh);
      ctx.restore();
    }

    // B. Dynamic Elemental Shockwave Burst
    ctx.globalCompositeOperation = 'lighter';
    const impR = impactProg * 32;
    ctx.globalAlpha = (1 - impactProg) * 0.85;
    ctx.strokeStyle = pal.glow;
    ctx.lineWidth = Math.max(1, (1 - impactProg) * 3);
    ctx.beginPath();
    ctx.arc(targetX, targetY, impR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = (1 - impactProg) * 0.9;
    ctx.beginPath();
    ctx.arc(targetX, targetY, Math.max(1, 10 * (1 - impactProg)), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

