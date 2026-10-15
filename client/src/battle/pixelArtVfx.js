// Pixel Art VFX & Procedural Attack Animation Engine
// Recreates authentic 16-bit GBA / Pokémon Mystery Dungeon visual aesthetics
// Zero external image dependencies - fully procedural, resolution-independent & scalable for PokeMMO

export const PIXEL_COLOR_PALETTES = {
  fire: {
    1: '#FFFFFF', // Intense white core
    2: '#FFF176', // Bright yellow
    3: '#FF9100', // Vibrant orange
    4: '#E64A19', // Deep flame
    5: '#BF360C', // Dark burnt perimeter
  },
  water: {
    1: '#FFFFFF', // Specular glint
    2: '#80D8FF', // Light cyan highlight
    3: '#00B0FF', // Clear blue body
    4: '#0288D1', // Deep ocean blue
    5: '#01579B', // Shaded outline
  },
  electric: {
    1: '#FFFFFF', // Core zap
    2: '#FFFF00', // High-voltage yellow
    3: '#FFD600', // Amber spark
    4: '#FF9100', // Outer glow
  },
  grass: {
    1: '#CCFF90', // Sunlight leaf highlight
    2: '#76FF03', // Vivid green blade
    3: '#43A047', // Foliage body
    4: '#1B5E20', // Stem shadow outline
  },
  ghost: {
    1: '#E1BEE7', // Ethereal wisp
    2: '#BA68C8', // Spectral purple
    3: '#7B1FA2', // Shadow body
    4: '#4A148C', // Deep abyss
    5: '#1A002C', // Void outline
  },
  psychic: {
    1: '#FFFFFF', // Telekinetic glint
    2: '#FF80AB', // Bright pink aura
    3: '#F50057', // Psychic magenta
    4: '#880E4F', // Dark mind contour
  },
  dark: {
    1: '#ECEFF1', // Bone / fang specular
    2: '#CFD8DC', // Fang body
    3: '#78909C', // Shaded tooth
    4: '#263238', // Dark jaw contour
  },
  dragon: {
    1: '#E0F7FA', // Cold draconic gleam
    2: '#00E5FF', // Cyan energy
    3: '#0091EA', // Draconic blue
    4: '#311B92', // Ancient purple outline
  },
  normal: {
    1: '#FFFFFF',
    2: '#EEEEEE',
    3: '#BDBDBD',
    4: '#616161',
  },
  poison: {
    1: '#F3E5F5', // Toxic sheen
    2: '#BA68C8', // Sludge violet
    3: '#8E24AA', // Toxic purple
    4: '#4A148C', // Acid dark rim
  },
  ground: {
    1: '#FFF8E1', // Sand specular highlight
    2: '#D7CCC8', // Light clay/mud
    3: '#A1887F', // Earth body
    4: '#6D4C41', // Dark soil contour
    5: '#3E2723', // Deep ground shadow
  },
  steel: {
    1: '#FFFFFF', // Metallic gleam
    2: '#CFD8DC', // Polished metal
    3: '#90A4AE', // Steel plate
    4: '#455A64', // Metal contour
  },
  fighting: {
    1: '#FFCCBC', // Strike gleam
    2: '#FF8A65', // Fighting energy
    3: '#D84315', // Martial red
    4: '#4E342E', // Heavy contour
  },
  flying: {
    1: '#E1F5FE', // Wind shimmer
    2: '#81D4FA', // Gale blue
    3: '#0288D1', // Air stream
    4: '#01579B', // Sky contour
  },
  bug: {
    1: '#F1F8E9', // Chitin highlight
    2: '#C5E1A5', // Insect green
    3: '#7CB342', // Chitin body
    4: '#33691E', // Exoskeleton contour
  },
  fairy: {
    1: '#FFFFFF', // Pixie dust sparkle
    2: '#F8BBD0', // Fairy pink
    3: '#EC407A', // Radiant magenta
    4: '#880E4F', // Mystic shadow
  },
  rock: {
    1: '#CFD8DC', // Pebble glint
    2: '#90A4AE', // Solid rock gray
    3: '#546E7A', // Shaded stone
    4: '#263238', // Dark rock outline
    5: '#102027', // Abyss contour
  },
  ice: {
    1: '#FFFFFF', // Glacial sheen
    2: '#E0F7FA', // Cold frost
    3: '#80DEEA', // Ice crystal cyan
    4: '#00ACC1', // Deep glacier
    5: '#006064', // Frost outline
  },
};

// 8x8 Pixel Flame Frames for Ember / Fire attacks
export const EMBER_FRAMES = [
  // Frame 0: Small rising ember flame
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
  // Frame 1: Flickering & expanding flame
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
  // Frame 2: Dancing peak flame
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

// 8x8 Water Droplet Frames
export const WATER_DROPLET_FRAMES = [
  [
    [0, 0, 0, 5, 5, 0, 0, 0],
    [0, 0, 5, 1, 2, 5, 0, 0],
    [0, 5, 1, 1, 2, 3, 5, 0],
    [5, 1, 1, 2, 3, 3, 4, 5],
    [5, 2, 2, 3, 3, 4, 4, 5],
    [5, 2, 3, 3, 4, 4, 4, 5],
    [0, 5, 3, 4, 4, 4, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
  ],
  [
    [0, 0, 0, 5, 5, 0, 0, 0],
    [0, 0, 5, 1, 2, 5, 0, 0],
    [0, 5, 1, 2, 2, 3, 5, 0],
    [5, 1, 2, 2, 3, 3, 4, 5],
    [5, 2, 2, 3, 3, 3, 4, 5],
    [5, 3, 3, 3, 4, 4, 4, 5],
    [0, 5, 4, 4, 4, 4, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
  ],
];

// 8x8 Electric Spark Star
export const ELECTRIC_SPARK_FRAMES = [
  [
    [0, 0, 0, 4, 4, 0, 0, 0],
    [0, 0, 4, 2, 1, 4, 0, 0],
    [0, 4, 2, 1, 1, 3, 4, 0],
    [4, 3, 1, 1, 1, 2, 3, 4],
    [4, 2, 1, 1, 1, 1, 2, 4],
    [0, 4, 3, 1, 1, 2, 4, 0],
    [0, 0, 4, 2, 1, 4, 0, 0],
    [0, 0, 0, 4, 4, 0, 0, 0],
  ],
  [
    [0, 0, 4, 0, 0, 4, 0, 0],
    [0, 4, 2, 4, 4, 2, 4, 0],
    [4, 2, 1, 1, 1, 1, 2, 4],
    [0, 4, 1, 1, 1, 1, 4, 0],
    [0, 4, 1, 1, 1, 1, 4, 0],
    [4, 2, 1, 1, 1, 1, 2, 4],
    [0, 4, 2, 4, 4, 2, 4, 0],
    [0, 0, 4, 0, 0, 4, 0, 0],
  ],
];

// 8x8 Shadow Ball Core
export const SHADOW_BALL_FRAMES = [
  [
    [0, 0, 5, 5, 5, 5, 0, 0],
    [0, 5, 4, 3, 2, 3, 5, 0],
    [5, 4, 3, 1, 2, 3, 4, 5],
    [5, 3, 2, 1, 1, 2, 3, 5],
    [5, 3, 2, 1, 1, 2, 3, 5],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [0, 5, 4, 3, 3, 4, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
  ],
  [
    [0, 0, 5, 5, 5, 5, 0, 0],
    [0, 5, 3, 2, 3, 4, 5, 0],
    [5, 3, 2, 1, 1, 2, 3, 5],
    [5, 2, 1, 1, 1, 2, 3, 5],
    [5, 3, 2, 1, 1, 1, 2, 5],
    [5, 4, 3, 2, 2, 3, 4, 5],
    [0, 5, 4, 4, 3, 4, 5, 0],
    [0, 0, 5, 5, 5, 5, 0, 0],
  ],
];

// 8x8 Razor Leaf
export const RAZOR_LEAF_FRAMES = [
  [
    [0, 0, 0, 0, 4, 4, 0, 0],
    [0, 0, 0, 4, 1, 2, 4, 0],
    [0, 0, 4, 1, 1, 2, 3, 4],
    [0, 4, 2, 1, 2, 3, 3, 4],
    [4, 2, 2, 1, 3, 3, 4, 0],
    [4, 3, 3, 2, 3, 4, 0, 0],
    [0, 4, 3, 3, 4, 0, 0, 0],
    [0, 0, 4, 4, 0, 0, 0, 0],
  ],
  [
    [0, 0, 4, 4, 0, 0, 0, 0],
    [0, 4, 1, 2, 4, 0, 0, 0],
    [4, 1, 1, 2, 3, 4, 0, 0],
    [4, 2, 1, 2, 3, 3, 4, 0],
    [0, 4, 2, 1, 3, 3, 2, 4],
    [0, 0, 4, 3, 2, 3, 3, 4],
    [0, 0, 0, 4, 3, 3, 4, 0],
    [0, 0, 0, 0, 4, 4, 0, 0],
  ],
];

// 10x10 Glowing Energy Sphere (Focus Blast / Aura Sphere)
export const FOCUS_BLAST_FRAMES = [
  [
    [0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
    [0, 0, 4, 3, 2, 2, 3, 4, 0, 0],
    [0, 4, 3, 2, 1, 1, 2, 3, 4, 0],
    [4, 3, 2, 1, 1, 1, 1, 2, 3, 4],
    [4, 2, 1, 1, 1, 1, 1, 1, 2, 4],
    [4, 2, 1, 1, 1, 1, 1, 1, 2, 4],
    [4, 3, 2, 1, 1, 1, 1, 2, 3, 4],
    [0, 4, 3, 2, 1, 1, 2, 3, 4, 0],
    [0, 0, 4, 3, 2, 2, 3, 4, 0, 0],
    [0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
  ],
  [
    [0, 0, 4, 4, 0, 0, 4, 4, 0, 0],
    [0, 4, 3, 2, 4, 4, 2, 3, 4, 0],
    [4, 3, 2, 1, 1, 1, 1, 2, 3, 4],
    [4, 2, 1, 1, 1, 1, 1, 1, 2, 4],
    [0, 4, 1, 1, 1, 1, 1, 1, 4, 0],
    [0, 4, 1, 1, 1, 1, 1, 1, 4, 0],
    [4, 2, 1, 1, 1, 1, 1, 1, 2, 4],
    [4, 3, 2, 1, 1, 1, 1, 2, 3, 4],
    [0, 4, 3, 2, 4, 4, 2, 3, 4, 0],
    [0, 0, 4, 4, 0, 0, 4, 4, 0, 0],
  ],
];

// 8x8 Poison Sludge Drop
export const POISON_SLUDGE_FRAMES = [
  [
    [0, 0, 0, 4, 4, 0, 0, 0],
    [0, 0, 4, 1, 2, 4, 0, 0],
    [0, 4, 1, 2, 3, 4, 0, 0],
    [0, 4, 2, 3, 3, 2, 4, 0],
    [4, 2, 3, 3, 3, 3, 2, 4],
    [4, 3, 3, 1, 3, 3, 3, 4],
    [0, 4, 3, 3, 3, 3, 4, 0],
    [0, 0, 4, 4, 4, 4, 0, 0],
  ],
  [
    [0, 0, 0, 4, 4, 0, 0, 0],
    [0, 0, 4, 2, 1, 4, 0, 0],
    [0, 4, 2, 3, 1, 2, 4, 0],
    [4, 2, 3, 3, 3, 3, 2, 4],
    [4, 3, 3, 3, 3, 3, 3, 4],
    [4, 3, 1, 3, 3, 1, 3, 4],
    [0, 4, 3, 3, 3, 3, 4, 0],
    [0, 0, 4, 4, 4, 4, 0, 0],
  ],
];

// 8x8 Rock Shard (Rock Slide / Mud Bomb / Stone Edge)
export const ROCK_SHARD_FRAMES = [
  [
    [0, 0, 4, 4, 4, 0, 0, 0],
    [0, 4, 1, 1, 2, 4, 0, 0],
    [4, 1, 1, 2, 2, 3, 4, 0],
    [4, 1, 2, 2, 3, 3, 3, 4],
    [4, 2, 2, 3, 3, 4, 4, 4],
    [0, 4, 3, 3, 4, 4, 0, 0],
    [0, 0, 4, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 4, 4, 0, 0, 0],
    [0, 0, 4, 1, 1, 4, 0, 0],
    [0, 4, 1, 1, 2, 2, 4, 0],
    [4, 1, 2, 2, 3, 3, 3, 4],
    [4, 2, 2, 3, 3, 3, 4, 0],
    [0, 4, 3, 3, 4, 4, 0, 0],
    [0, 0, 4, 4, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
];

// 14x14 Legendary Fire Blast Kanji Symbol '大' (Dai)
export const FIRE_BLAST_KANJI = [
  [0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 5, 3, 2, 5, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 5, 2, 1, 5, 0, 0, 0, 0, 0],
  [5, 5, 5, 5, 5, 5, 1, 1, 5, 5, 5, 5, 5, 5],
  [5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5],
  [5, 5, 5, 5, 5, 5, 1, 1, 5, 5, 5, 5, 5, 5],
  [0, 0, 0, 0, 5, 3, 2, 2, 3, 5, 0, 0, 0, 0],
  [0, 0, 0, 5, 3, 1, 5, 5, 1, 3, 5, 0, 0, 0],
  [0, 0, 5, 3, 1, 5, 0, 0, 5, 1, 3, 5, 0, 0],
  [0, 5, 3, 1, 5, 0, 0, 0, 0, 5, 1, 3, 5, 0],
  [5, 4, 2, 5, 0, 0, 0, 0, 0, 0, 5, 2, 4, 5],
  [5, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 5],
  [0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0],
];

// 10x10 Clamping Fangs for Bite / Crunch
export const BITE_FANGS_TOP = [
  [4, 4, 0, 0, 0, 0, 0, 0, 4, 4],
  [4, 2, 4, 0, 0, 0, 0, 4, 2, 4],
  [4, 1, 2, 4, 0, 0, 4, 2, 1, 4],
  [4, 1, 1, 2, 4, 4, 2, 1, 1, 4],
  [0, 4, 1, 2, 3, 3, 2, 1, 4, 0],
  [0, 0, 4, 2, 3, 3, 2, 4, 0, 0],
];

export const BITE_FANGS_BOTTOM = [
  [0, 0, 4, 2, 3, 3, 2, 4, 0, 0],
  [0, 4, 1, 2, 3, 3, 2, 1, 4, 0],
  [4, 1, 1, 2, 4, 4, 2, 1, 1, 4],
  [4, 1, 2, 4, 0, 0, 4, 2, 1, 4],
  [4, 2, 4, 0, 0, 0, 0, 4, 2, 4],
  [4, 4, 0, 0, 0, 0, 0, 0, 4, 4],
];

/**
 * Render a pixel art matrix centered at (x, y) with sharp non-anti-aliased pixel blocks
 */
export function renderPixelMatrix(ctx, cx, cy, matrix, colorMap, pixelSize = 3, rotation = 0, alpha = 1.0) {
  if (!matrix || matrix.length === 0 || !colorMap) return;
  const rows = matrix.length;
  const cols = matrix[0].length;
  const totalW = cols * pixelSize;
  const totalH = rows * pixelSize;

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.translate(Math.round(cx), Math.round(cy));

  if (rotation !== 0) {
    ctx.rotate(rotation);
  }

  const ox = -Math.round(totalW / 2);
  const oy = -Math.round(totalH / 2);

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
 * Render multi-layer pixel claw slash across target
 */
export function renderPixelSlash(ctx, cx, cy, progress, color = '#00E5FF') {
  ctx.save();
  const alpha = Math.sin(progress * Math.PI);
  ctx.globalAlpha = alpha;
  const len = 35 + progress * 25;
  const pSize = 3;

  // 3 parallel slashes
  for (let s = -1; s <= 1; s++) {
    const offsetX = s * 12;
    const offsetY = s * 8;
    for (let i = -len; i <= len; i += pSize) {
      const px = Math.round(cx + offsetX + i);
      const py = Math.round(cy + offsetY + (i * 0.7));

      // Core white pixel
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(px, py, pSize, pSize);

      // Color glow perimeter pixels
      ctx.fillStyle = color;
      ctx.fillRect(px - pSize, py, pSize, pSize);
      ctx.fillRect(px + pSize, py, pSize, pSize);
    }
  }
  ctx.restore();
}

/**
 * Render pixel bite / crunch jaws snapping shut
 */
export function renderPixelBite(ctx, cx, cy, progress) {
  const clampDist = Math.max(0, (1 - progress * 2.2) * 28);
  const alpha = progress < 0.7 ? 1.0 : (1 - (progress - 0.7) / 0.3);

  // Top jaw clamping down
  renderPixelMatrix(ctx, cx, cy - clampDist, BITE_FANGS_TOP, PIXEL_COLOR_PALETTES.dark, 3, 0, alpha);
  // Bottom jaw clamping up
  renderPixelMatrix(ctx, cx, cy + clampDist, BITE_FANGS_BOTTOM, PIXEL_COLOR_PALETTES.dark, 3, 0, alpha);
}

/**
 * Render expanding Fire Blast Kanji '大' with roaring pixel flames
 */
export function renderPixelFireBlast(ctx, cx, cy, progress) {
  ctx.save();
  const scale = 2.0 + progress * 3.5;
  const alpha = progress < 0.6 ? 1.0 : (1 - (progress - 0.6) / 0.4);
  const pixelSize = Math.max(2, Math.round(3.5 * (1 + progress * 0.5)));

  renderPixelMatrix(ctx, cx, cy, FIRE_BLAST_KANJI, PIXEL_COLOR_PALETTES.fire, pixelSize, 0, alpha);

  // Outer expanding pixel ring
  const ringRadius = progress * 95;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const ang = (i / count) * Math.PI * 2 + progress * 2;
    const px = Math.round(cx + Math.cos(ang) * ringRadius);
    const py = Math.round(cy + Math.sin(ang) * ringRadius);
    const c = i % 2 === 0 ? '#FFEB3B' : '#FF5722';
    ctx.fillStyle = c;
    ctx.fillRect(px - 3, py - 3, 6, 6);
  }

  ctx.restore();
}

/**
 * Render crossed pixel slash (X-Scissor / Dual Claws)
 */
export function renderPixelCrossSlash(ctx, cx, cy, progress, color = '#76FF03') {
  ctx.save();
  const alpha = Math.sin(progress * Math.PI);
  ctx.globalAlpha = alpha;
  const len = 32 + progress * 24;
  const pSize = 3;

  // Slash 1: Top-Left to Bottom-Right
  for (let i = -len; i <= len; i += pSize) {
    const px = Math.round(cx + i);
    const py = Math.round(cy + i * 0.8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(px, py, pSize, pSize);
    ctx.fillStyle = color;
    ctx.fillRect(px - pSize, py, pSize, pSize);
    ctx.fillRect(px + pSize, py, pSize, pSize);
  }

  // Slash 2: Top-Right to Bottom-Left
  for (let i = -len; i <= len; i += pSize) {
    const px = Math.round(cx + i);
    const py = Math.round(cy - i * 0.8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(px, py, pSize, pSize);
    ctx.fillStyle = color;
    ctx.fillRect(px - pSize, py, pSize, pSize);
    ctx.fillRect(px + pSize, py, pSize, pSize);
  }
  ctx.restore();
}

/**
 * Render energized physical impact / punch (Drain Punch, Poison Jab, Skull Bash)
 */
export function renderPixelPunch(ctx, cx, cy, progress, color = '#FF9100') {
  ctx.save();
  const alpha = 1.0 - progress;
  ctx.globalAlpha = Math.max(0, alpha);
  const pSize = 3;
  const dist = 12 + progress * 28;

  // 8 radiating impact rays
  for (let a = 0; a < 8; a++) {
    const ang = (a / 8) * Math.PI * 2;
    const px = Math.round(cx + Math.cos(ang) * dist);
    const py = Math.round(cy + Math.sin(ang) * dist * 0.7);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(px, py, pSize * 2, pSize * 2);
    ctx.fillStyle = color;
    ctx.fillRect(px - pSize, py, pSize, pSize);
  }
  ctx.restore();
}

/**
 * Render vertical GBA/PMD segmented pixel lightning bolt (Thunder)
 */
export function renderPixelLightningBolt(ctx, targetX, targetY, progress) {
  ctx.save();
  const alpha = progress < 0.6 ? 1.0 : (1 - (progress - 0.6) / 0.4);
  ctx.globalAlpha = Math.max(0, alpha);
  const pSize = 3;

  const startY = targetY - 260;
  const segments = 10;
  let curX = targetX;
  let curY = startY;
  const stepY = (targetY - startY) / segments;

  // Lightning path with seeded deterministic zigzags
  for (let i = 0; i < segments; i++) {
    const nextY = curY + stepY;
    const nextX = i === segments - 1 ? targetX : targetX + (Math.sin(i * 3.7 + progress * 5) * 22);

    // Draw stepped pixel line
    const steps = 8;
    for (let s = 0; s < steps; s++) {
      const px = Math.round((curX + (nextX - curX) * (s / steps)) / pSize) * pSize;
      const py = Math.round((curY + (nextY - curY) * (s / steps)) / pSize) * pSize;

      // Yellow outer border
      ctx.fillStyle = '#FF9100';
      ctx.fillRect(px - pSize * 2, py - pSize, pSize * 5, pSize * 3);

      // Bright yellow mid
      ctx.fillStyle = '#FFFF00';
      ctx.fillRect(px - pSize, py, pSize * 3, pSize * 2);

      // Pure white intense core
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(px, py, pSize, pSize);
    }

    curX = nextX;
    curY = nextY;
  }

  // Ground impact starburst
  const impactR = progress * 45;
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const ix = Math.round(targetX + Math.cos(ang) * impactR);
    const iy = Math.round(targetY + Math.sin(ang) * impactR * 0.65);
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(ix, iy, pSize * 2, pSize * 2);
  }

  ctx.restore();
}

/**
 * Render rising stone spires thrusting from ground (Stone Edge, Rock Slide)
 */
export function renderPixelStoneEdge(ctx, targetX, targetY, progress) {
  ctx.save();
  const heightMult = progress < 0.4 ? progress / 0.4 : (1.0 - (progress - 0.4) / 0.6 * 0.3);
  const alpha = progress < 0.8 ? 1.0 : (1.0 - (progress - 0.8) / 0.2);
  ctx.globalAlpha = Math.max(0, alpha);
  const pSize = 3;

  // 3 sharp rising spires
  const spires = [
    { ox: 0, oy: 0, maxHeight: 48, w: 16 },
    { ox: -22, oy: 8, maxHeight: 36, w: 12 },
    { ox: 20, oy: -6, maxHeight: 40, w: 14 },
  ];

  for (const s of spires) {
    const h = s.maxHeight * heightMult;
    const baseW = s.w;
    const cx = targetX + s.ox;
    const cy = targetY + s.oy;

    // Stepped conical pyramid in pixel art
    for (let y = 0; y < h; y += pSize) {
      const tierWidth = Math.round((baseW * (1 - y / h)) / pSize) * pSize;
      const py = Math.round(cy - y);
      const px = Math.round(cx - tierWidth / 2);

      // Shaded left face (light gray)
      ctx.fillStyle = '#B0BEC5';
      ctx.fillRect(px, py, tierWidth * 0.5, pSize);
      // Shaded right face (dark stone)
      ctx.fillStyle = '#37474F';
      ctx.fillRect(px + tierWidth * 0.5, py, tierWidth * 0.5, pSize);
      // Highlight edge
      ctx.fillStyle = '#ECEFF1';
      ctx.fillRect(px + tierWidth * 0.4, py, pSize, pSize);
    }
  }

  ctx.restore();
}

/**
 * Render crystalline pixel ice block encasing Pokémon (Freeze Status)
 */
export function renderPixelIceBlock(ctx, cx, cy, size = 44) {
  ctx.save();
  const pSize = 3;
  const w = size;
  const h = size * 1.2;
  const ox = Math.round(cx - w / 2);
  const oy = Math.round(cy - h / 2 - 8);

  ctx.globalAlpha = 0.75;
  // Translucent ice body
  ctx.fillStyle = 'rgba(128, 222, 234, 0.45)';
  ctx.fillRect(ox, oy, w, h);

  // Pixel ice facet lines and highlights
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(ox + pSize, oy + pSize, w - pSize * 2, pSize);
  ctx.fillRect(ox + pSize, oy + pSize, pSize, h - pSize * 2);

  // Diagonal crystalline cuts
  for (let i = 0; i < w; i += pSize * 3) {
    ctx.fillStyle = '#E0F7FA';
    ctx.fillRect(ox + i, oy + i * 0.6, pSize, pSize);
    ctx.fillStyle = '#00838F';
    ctx.fillRect(ox + w - i, oy + i * 0.8, pSize, pSize);
  }

  // Dark ice rim
  ctx.fillStyle = '#006064';
  ctx.fillRect(ox, oy, w, pSize);
  ctx.fillRect(ox, oy + h - pSize, w, pSize);
  ctx.fillRect(ox, oy, pSize, h);
  ctx.fillRect(ox + w - pSize, oy, pSize, h);

  ctx.restore();
}

/**
 * Render crackling electric arcs on Pokémon (Paralysis Status)
 */
export function renderPixelParalysisArcs(ctx, cx, cy, time) {
  ctx.save();
  const pSize = 2;
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI / 2) + Math.sin(time * 15 + i) * 0.8;
    const r = 24 + Math.sin(time * 20 + i * 2) * 8;
    const px = Math.round(cx + Math.cos(ang) * r);
    const py = Math.round(cy + Math.sin(ang) * r * 0.7);

    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(px, py, pSize * 2, pSize * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(px + pSize, py + pSize, pSize, pSize);
  }
  ctx.restore();
}

/**
 * Render flickering flames on Pokémon (Burn Status)
 */
export function renderPixelBurnFlames(ctx, cx, cy, time) {
  const frameIdx = Math.floor(time * 10) % EMBER_FRAMES.length;
  renderPixelMatrix(ctx, cx - 14, cy - 10, EMBER_FRAMES[frameIdx], PIXEL_COLOR_PALETTES.fire, 2);
  renderPixelMatrix(ctx, cx + 12, cy - 14, EMBER_FRAMES[(frameIdx + 1) % EMBER_FRAMES.length], PIXEL_COLOR_PALETTES.fire, 2);
}

/**
 * Render toxic sludge bubbles rising on Pokémon (Poison Status)
 */
export function renderPixelPoisonBubbles(ctx, cx, cy, time) {
  ctx.save();
  const pSize = 3;
  for (let i = 0; i < 3; i++) {
    const t = (time * 1.5 + i * 0.33) % 1.0;
    const bx = Math.round(cx + (i - 1) * 16 + Math.sin(t * 8) * 4);
    const by = Math.round(cy - 10 - t * 35);
    const alpha = 1.0 - t;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#AB47BC';
    ctx.fillRect(bx, by, pSize * 2, pSize * 2);
    ctx.fillStyle = '#E1BEE7';
    ctx.fillRect(bx, by, pSize, pSize);
  }
  ctx.restore();
}

/**
 * Render continuous high-energy beam (Hydro Pump, Solar Beam, Flamethrower, etc.)
 * Dynamically tapered: starts slender at caster nozzle/mouth, swells to full width in midsection,
 * and tapers to a sharp focused impact point at the end.
 */
export function renderPixelContinuousBeam(ctx, startX, startY, targetX, targetY, progress, type = 'water', width = 45) {
  ctx.save();
  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);

  const alpha = Math.sin(progress * Math.PI);
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  ctx.translate(startX, startY);
  ctx.rotate(angle);

  const pSize = 3;
  const halfW = Math.round(width / 2);

  let colCore = '#FFFFFF';
  let colMid = '#00B0FF';
  let colEdge = '#01579B';
  let colParticle = '#80D8FF';

  if (type === 'grass') {
    colMid = '#76FF03';
    colEdge = '#1B5E20';
    colParticle = '#CCFF90';
  } else if (type === 'ice') {
    colMid = '#80DEEA';
    colEdge = '#006064';
    colParticle = '#E0F7FA';
  } else if (type === 'fire') {
    colMid = '#FF9100';
    colEdge = '#BF360C';
    colParticle = '#FFD54F';
  } else if (type === 'electric') {
    colMid = '#FFEA00';
    colEdge = '#F57F17';
    colParticle = '#FFF9C4';
  } else if (type === 'psychic') {
    colMid = '#E040FB';
    colEdge = '#4A148C';
    colParticle = '#F8BBD0';
  } else if (type === 'dragon') {
    colMid = '#7C4DFF';
    colEdge = '#311B92';
    colParticle = '#B388FF';
  }

  // 1. Muzzle Charge Flare at Origin (starts slender, expanding outward)
  const muzzleRadius = Math.round(halfW * 0.45 * (0.8 + 0.3 * Math.sin(progress * 40)));
  ctx.fillStyle = colMid;
  ctx.fillRect(-muzzleRadius, -muzzleRadius, muzzleRadius * 2, muzzleRadius * 2);
  ctx.fillStyle = colCore;
  ctx.fillRect(-Math.round(muzzleRadius * 0.5), -Math.round(muzzleRadius * 0.5), muzzleRadius, muzzleRadius);

  // 2. Tapered Segmented Beam Body
  const step = pSize * 2;
  for (let x = 0; x < dist; x += step) {
    const u = x / dist; // normalized distance [0, 1]

    // Start Taper: Slender at mouth (0.28 of max width) ramping smoothly to 1.0 at u = 0.24
    let startFactor = 1.0;
    if (u < 0.24) {
      const t = u / 0.24;
      startFactor = 0.28 + 0.72 * (t * t * (3 - 2 * t));
    }

    // End Taper: Full width smoothly tapering down to 0.22 at the tip (u = 1.0)
    let endFactor = 1.0;
    if (u > 0.70) {
      const t = (1 - u) / 0.30;
      endFactor = 0.22 + 0.78 * (t * t * (3 - 2 * t));
    }

    const taperFactor = Math.min(startFactor, endFactor);

    // Rapid energy oscillation wave
    const pulseOffset = Math.sin((x * 0.09) - (progress * 30)) * (halfW * 0.2);
    const curW = Math.max(3, Math.round((halfW + pulseOffset) * taperFactor));

    // Outer edge
    ctx.fillStyle = colEdge;
    ctx.fillRect(x, -curW, step, curW * 2);

    // Mid color
    ctx.fillStyle = colMid;
    ctx.fillRect(x, -Math.round(curW * 0.65), step, Math.round(curW * 1.3));

    // Core white beam (high energy interior)
    ctx.fillStyle = colCore;
    ctx.fillRect(x, -Math.round(curW * 0.3), step, Math.round(curW * 0.6));
  }

  // 3. Impact Tip Flare & Splash at target
  const tipRadius = Math.round(halfW * 0.55 * (0.9 + 0.4 * Math.cos(progress * 35)));
  ctx.fillStyle = colEdge;
  ctx.fillRect(dist - tipRadius, -tipRadius, tipRadius * 2, tipRadius * 2);
  ctx.fillStyle = colMid;
  ctx.fillRect(dist - Math.round(tipRadius * 0.7), -Math.round(tipRadius * 0.7), Math.round(tipRadius * 1.4), Math.round(tipRadius * 1.4));
  ctx.fillStyle = colCore;
  ctx.fillRect(dist - Math.round(tipRadius * 0.35), -Math.round(tipRadius * 0.35), Math.round(tipRadius * 0.7), Math.round(tipRadius * 0.7));

  // 4. Dynamic spray particles around the beam
  for (let i = 0; i < 4; i++) {
    const pX = (dist * 0.2) + ((i * 0.23 + progress * 2) % 0.7) * dist;
    const pU = pX / dist;
    const pW = halfW * Math.min(pU < 0.24 ? pU / 0.24 : 1, pU > 0.7 ? (1 - pU) / 0.3 : 1);
    const side = (i % 2 === 0 ? 1 : -1);
    const pY = side * (pW + 4 + Math.sin(progress * 20 + i) * 8);

    ctx.fillStyle = colParticle;
    ctx.fillRect(Math.round(pX), Math.round(pY), pSize, pSize);
  }

  ctx.restore();
}

/**
 * Render Authentic Procedural Pixel-Art Defensive Barriers
 * Supports: water_shell (Withdraw), fire_spin (Flame Shield), electric_cage (Light Screen),
 * grass_safeguard (Floral Shield), shadow_vortex (Spite Barrier), psychic_barrier (Barrier).
 */
export function renderDefensiveBarrier(ctx, x, y, shieldType = 'psychic_barrier', radius = 34, time = 0, alpha = 0.55) {
  ctx.save();
  // Subtle, elegant translucency - non-obtrusive to Pokemon sprites
  ctx.globalAlpha = Math.max(0.12, Math.min(0.65, alpha * 0.7));
  ctx.imageSmoothingEnabled = false;

  if (shieldType === 'water_shell') {
    // Blastoise: Withdraw / Couraça Aquática
    const pulseR = radius + Math.sin(time * 8) * 2;
    const segments = 12;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2 + time * 4;
      const px = x + Math.cos(angle) * pulseR;
      const py = y + Math.sin(angle) * (pulseR * 0.75);
      const isDroplet = i % 2 === 0;

      ctx.fillStyle = isDroplet ? 'rgba(224, 247, 250, 0.6)' : 'rgba(0, 176, 255, 0.5)';
      ctx.fillRect(Math.round(px) - 1, Math.round(py) - 1, 3, 3);
    }
    ctx.strokeStyle = 'rgba(128, 216, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, pulseR * 0.85, 0, Math.PI * 2);
    ctx.stroke();

  } else if (shieldType === 'fire_spin') {
    // Charizard: Giro de Fogo / Flame Vortex
    const segments = 14;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2 + time * 7;
      const curR = radius + Math.sin(time * 10 + i) * 2.5;
      const px = x + Math.cos(angle) * curR;
      const py = y + Math.sin(angle) * (curR * 0.75);

      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 145, 0, 0.55)' : 'rgba(255, 241, 118, 0.5)';
      ctx.fillRect(Math.round(px) - 1, Math.round(py) - 1, 3, 3);
    }

  } else if (shieldType === 'electric_cage') {
    // Pikachu: Tela de Luz / Barreira Elétrica
    const pulseR = radius + Math.sin(time * 12) * 2;
    const nodes = 8;
    ctx.strokeStyle = 'rgba(255, 234, 0, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < nodes; i++) {
      const angle = (i / nodes) * Math.PI * 2 + time * 3;
      const jitter = (Math.sin(time * 20 + i * 3) > 0 ? 3 : -2);
      const px = x + Math.cos(angle) * (pulseR + jitter);
      const py = y + Math.sin(angle) * ((pulseR + jitter) * 0.8);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(Math.round(px) - 1, Math.round(py) - 1, 2, 2);
    }
    ctx.closePath();
    ctx.stroke();

  } else if (shieldType === 'grass_safeguard') {
    // Venusaur / Bulbasaur: Salvaguarda Floral
    const pulseR = radius + Math.sin(time * 6) * 2;
    const leaves = 8;
    for (let i = 0; i < leaves; i++) {
      const angle = (i / leaves) * Math.PI * 2 + time * 3;
      const px = x + Math.cos(angle) * pulseR;
      const py = y + Math.sin(angle) * (pulseR * 0.8);

      ctx.fillStyle = i % 2 === 0 ? 'rgba(118, 255, 3, 0.55)' : 'rgba(27, 94, 32, 0.45)';
      ctx.fillRect(Math.round(px) - 1, Math.round(py) - 1, 3, 3);
    }

  } else if (shieldType === 'shadow_vortex') {
    // Gengar: Barreira Espectral / Spite
    const pulseR = radius + Math.sin(time * 8) * 2.5;
    const wisps = 10;
    for (let i = 0; i < wisps; i++) {
      const angle = (i / wisps) * Math.PI * 2 - time * 4;
      const px = x + Math.cos(angle) * pulseR;
      const py = y + Math.sin(angle) * (pulseR * 0.75);

      ctx.fillStyle = i % 2 === 0 ? 'rgba(126, 87, 194, 0.5)' : 'rgba(49, 27, 146, 0.4)';
      ctx.fillRect(Math.round(px) - 1, Math.round(py) - 1, 3, 3);
    }

  } else {
    // Psychic Barrier / Subtle Crystal Hexagon
    const pulseR = radius + Math.sin(time * 6) * 1.5;
    const sides = 6;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2 + time * 1.2;
      const px = x + Math.cos(angle) * pulseR;
      const py = y + Math.sin(angle) * (pulseR * 0.85);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);

      // Delicate micro-vertex sparkle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(Math.round(px) - 1, Math.round(py) - 1, 2, 2);
    }
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Render anime-style directional speed hatching lines (rachuras de velocidade)
 * Gives an intense high-speed flash-step / blur dash aesthetic
 */
export function renderSpeedHatching(ctx, startX, startY, endX, endY, dirX, dirY, progress, color = '#FFFFFF') {
  ctx.save();
  const alpha = (1 - progress) * 0.92;
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const perpX = -dirY;
  const perpY = dirX;
  const streakCount = 9;
  const spreadWidth = 52;
  const lineLength = 54 + (1 - progress) * 40;

  for (let i = -4; i <= 4; i++) {
    const offset = (i / 4) * spreadWidth;
    const stagger = ((Math.abs(i) * 19) % 27) - 13;
    const midX = startX + (endX - startX) * 0.5 + perpX * offset + dirX * stagger;
    const midY = startY + (endY - startY) * 0.5 + perpY * offset + dirY * stagger;

    const x1 = midX - dirX * (lineLength * 0.5);
    const y1 = midY - dirY * (lineLength * 0.5);
    const x2 = midX + dirX * (lineLength * 0.5);
    const y2 = midY + dirY * (lineLength * 0.5);

    ctx.beginPath();
    ctx.moveTo(Math.round(x1), Math.round(y1));
    ctx.lineTo(Math.round(x2), Math.round(y2));
    ctx.stroke();

    // High-energy dithered pixel accents
    if (i % 2 === 0) {
      ctx.fillStyle = '#00E5FF';
      ctx.fillRect(Math.round(x2) - 1, Math.round(y2) - 1, 3, 3);
    }
  }

  ctx.restore();
}

/**
 * Render foliage/leaf storm burst (folhas cortantes, sementes e vinhas em pixel art)
 */
export function renderPixelFoliageBurst(ctx, x, y, progress, color = '#43A047') {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const leafCount = 8;
  const maxRadius = 42;
  const curRadius = progress * maxRadius;

  for (let i = 0; i < leafCount; i++) {
    const angle = (i / leafCount) * Math.PI * 2 + progress * 4.0;
    const lx = Math.round(x + Math.cos(angle) * curRadius);
    const ly = Math.round(y + Math.sin(angle) * curRadius);
    const size = Math.max(2, Math.round((1 - progress * 0.5) * 4));

    // Serrated pixel leaf blade
    ctx.fillStyle = '#1B5E20'; // Dark outline
    ctx.fillRect(lx - size, ly - size, size * 2, size * 2);

    ctx.fillStyle = color; // Foliage green body
    ctx.fillRect(lx - size + 1, ly - size + 1, size * 2 - 2, size * 2 - 2);

    // Pale green highlight vein
    ctx.fillStyle = '#CCFF90';
    ctx.fillRect(lx, ly, 1, 2);
  }
  ctx.restore();
}

/**
 * Render sharp ice crystals & shattering shards (cristais de gelo rígidos)
 */
export function renderPixelIceCrystals(ctx, x, y, progress, color = '#80DEEA') {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const shardCount = 6;
  const spread = progress * 38;

  for (let i = 0; i < shardCount; i++) {
    const angle = (i / shardCount) * Math.PI * 2 + (i % 2 === 0 ? 0.2 : -0.2);
    const sx = Math.round(x + Math.cos(angle) * spread);
    const sy = Math.round(y + Math.sin(angle) * spread);

    // Diamond ice spike
    ctx.fillStyle = '#006064'; // Deep cyan shadow
    ctx.fillRect(sx - 2, sy - 4, 4, 8);
    ctx.fillRect(sx - 4, sy - 2, 8, 4);

    ctx.fillStyle = color; // Cyan body
    ctx.fillRect(sx - 1, sy - 3, 2, 6);
    ctx.fillRect(sx - 3, sy - 1, 6, 2);

    ctx.fillStyle = '#FFFFFF'; // Crisp glint
    ctx.fillRect(sx, sy - 1, 1, 2);
  }
  ctx.restore();
}

/**
 * Render dark shadow pulse / spectral void (esferas sombrias e rasgo espectral)
 */
export function renderPixelShadowPulse(ctx, x, y, progress, color = '#7B1FA2') {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const radius = Math.round(8 + progress * 32);

  // Stepped pixel rings (dark void)
  ctx.fillStyle = 'rgba(26, 0, 44, 0.85)'; // Void perimeter
  ctx.fillRect(x - radius - 2, y - radius - 2, (radius + 2) * 2, (radius + 2) * 2);

  ctx.fillStyle = color; // Spectral purple
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

  ctx.fillStyle = '#1A002C'; // Black core
  const core = Math.max(2, Math.round(radius * 0.5));
  ctx.fillRect(x - core, y - core, core * 2, core * 2);

  // Ethereal purple glints
  ctx.fillStyle = '#E1BEE7';
  ctx.fillRect(x - radius + 2, y - 2, 2, 4);
  ctx.fillRect(x + radius - 4, y - 2, 2, 4);
  ctx.restore();
}

/**
 * Render psychic distortion wave / concentric rings (ondas de distorção mental)
 */
export function renderPixelPsychicRings(ctx, x, y, progress, color = '#F50057') {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  for (let ring = 1; ring <= 3; ring++) {
    const ringProg = Math.max(0, Math.min(1, progress * 1.5 - (ring - 1) * 0.25));
    if (ringProg <= 0 || ringProg >= 1) continue;

    const r = Math.round(6 + ringProg * 36);
    const alpha = 1 - ringProg;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = alpha;
    ctx.strokeRect(x - r, y - r, r * 2, r * 2);

    // Telekinetic corner highlights
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - r, y - r, 3, 3);
    ctx.fillRect(x + r - 3, y - r, 3, 3);
    ctx.fillRect(x - r, y + r - 3, 3, 3);
    ctx.fillRect(x + r - 3, y + r - 3, 3, 3);
  }
  ctx.restore();
}

/**
 * Render stat buff/debuff arrows (setas ascendentes/descendentes em pixel art)
 */
export function renderPixelStatArrows(ctx, x, y, progress, isBuff = true, color = '#00E676') {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const arrowCount = 3;

  for (let i = 0; i < arrowCount; i++) {
    const stagger = (i * 0.2);
    const arrowProg = (progress + stagger) % 1.0;
    const ax = Math.round(x + (i - 1) * 16);
    const ay = isBuff
      ? Math.round(y + 10 - arrowProg * 38)
      : Math.round(y - 28 + arrowProg * 38);

    const alpha = Math.sin(arrowProg * Math.PI);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Arrow shape
    ctx.fillStyle = '#000000'; // Outline
    if (isBuff) {
      // Upward chevron
      ctx.fillRect(ax - 5, ay + 1, 11, 4);
      ctx.fillRect(ax - 3, ay - 2, 7, 4);
      ctx.fillRect(ax - 1, ay - 5, 3, 4);

      ctx.fillStyle = color;
      ctx.fillRect(ax - 4, ay + 2, 9, 2);
      ctx.fillRect(ax - 2, ay - 1, 5, 2);
      ctx.fillRect(ax, ay - 4, 1, 3);
    } else {
      // Downward chevron
      ctx.fillRect(ax - 1, ay + 2, 3, 4);
      ctx.fillRect(ax - 3, ay - 1, 7, 4);
      ctx.fillRect(ax - 5, ay - 4, 11, 4);

      ctx.fillStyle = color;
      ctx.fillRect(ax, ay + 3, 1, 3);
      ctx.fillRect(ax - 2, ay, 5, 2);
      ctx.fillRect(ax - 4, ay - 3, 9, 2);
    }
  }
  ctx.restore();
}

/**
 * Render orbiting dizzy stars (tontura / estonteado) over the entity's head
 */
export function renderDizzyStars(ctx, x, y, time) {
  ctx.save();
  const starCount = 4;
  const orbitRadiusX = 24;
  const orbitRadiusY = 9;
  const headElevation = -62;

  const centerX = x;
  const centerY = y + headElevation;

  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2 + time * 6.5;
    const px = Math.round(centerX + Math.cos(angle) * orbitRadiusX);
    const py = Math.round(centerY + Math.sin(angle) * orbitRadiusY);

    // 4-pointed golden pixel star
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.fillRect(px - 1, py - 3, 3, 7);
    ctx.fillRect(px - 3, py - 1, 7, 3);

    // Core white sparkle
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(px, py, 1, 1);

    // Mini trailing yellow spark
    const trailAngle = angle - 0.25;
    const tx = Math.round(centerX + Math.cos(trailAngle) * orbitRadiusX);
    const ty = Math.round(centerY + Math.sin(trailAngle) * orbitRadiusY);
    ctx.fillStyle = '#FFEE58';
    ctx.fillRect(tx, ty, 2, 2);
  }

  ctx.restore();
}


