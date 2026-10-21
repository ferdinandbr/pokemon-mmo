// Particle & Visual Effects Engine for Pokemon Arena 2D
// Cinematic VFX: High-Performance batched rendering, fluid subpixel motion & additive lighting
import {
  renderPixelMatrix,
  renderPixelSlash,
  renderPixelCrossSlash,
  renderPixelBite,
  renderPixelPunch,
  renderPixelFireBlast,
  renderPixelLightningBolt,
  renderPixelStoneEdge,
  renderCombatBeam,
  renderCombatLightning,
  renderCombatDash,
  renderCombatSlash,
  renderCombatBite,
  renderCombatEarth,
  renderCombatPunch,
  renderCombatBuff,
  renderCombatSoundWave,
  renderCombatProjectile,
  getTypeColor,
  getTypePalette,
  renderSpeedHatching,
  renderPixelFoliageBurst,
  renderPixelIceCrystals,
  renderPixelPoisonBurst,
  renderPixelShadowPulse,
  renderPixelPsychicRings,
  renderPixelStatArrows,
  renderPixelElementalBuffSpiral,
  renderDracoMeteorCombat,
  renderAirCutterCombat,
  renderWhirlwindCombat,
  renderNightDazeCombat,
  renderSpacialRendCombat,
  renderBurningAuraCombat,
  PIXEL_COLOR_PALETTES,
} from './pixelArtVfx.js';

const MOVE_ANIM_CACHE = new Map();

// All official move animation spritesheets from PokeMMO
const ANIMATION_FILES = [
  'core/attack_physical_01.png',
  'core/attack_physical_02.png',
  'core/fire_01.png',
  'core/thunder_01.png',
  'core/water_01.png',
  'core/burst_01.png',
  'core/explosion_01.png',
  'core/earth_01.png',
  'core/grass.png',
  'core/ice_01.png',
  'core/normal_01.png',
  'core/poison.png',
  'core/punches.png',
  'core/scratch_shadow_claw.png',
  'core/tackle_b.png',
  'core/teeth.png',
  'core/wind_01.png',
  'vfx/smear/smear_h_01.png',
  'vfx/smear/smear_v_01.png',
  'vfx/smoke/smoke_vfx_01.png',
  'vfx/smoke/smoke_vfx_02.png',
  'vfx/custom/shield_bubble.png',
  'vfx/custom/pillar_green.png',
  'vfx/custom/lightning_strike.png',
  'vfx/custom/pillar_yellow.png',
  'vfx/custom/pillar_blue.png',
  'vfx/pixel_fire/colored/purple/group_4_2.png',
  'vfx/pixel_fire/colored/purple/group_4_5.png',
  'vfx/pixel_fire/colored/red/group_4_5.png',
  'vfx/pixel_fire/colored/blue/group_4_5.png',
  'vfx/custom/spore_puff.png',
  'vfx/custom/spider_web.png',
  'vfx/custom/spikes_hazard.png',
  'vfx/custom/megahorn_drill.png',
  'vfx/custom/pin_missile_spike.png',
  'vfx/custom/string_shot_silk.png',
  'vfx/custom/snarl_soundwave.png',
  'vfx/custom/question_marks_dark.png',
  'vfx/custom/night_slash_cross.png',
  'vfx/custom/thief_swipe_dark.png',
  'vfx/custom/musical_notes_green.png',
  'vfx/custom/heart_burst.png',
  'vfx/ice/ice_vfx_01.png',
  'vfx/ice/ice_vfx_02_active.png',
  'vfx/fire/fire_thrower_01.png',
  'vfx/fire/fire_thrower_02.png',
  'vfx/fire/fire_thrower_03.png',
  'vfx/fire/dragon_breath_stream.png',
  'vfx/fire/fire_stream_billow.png',
  'vfx/wind/air_cutter_volumetric.png',
  'vfx/wind/whirlwind.png',
  'vfx/dark/night_daze_burst.png',
  'vfx/dimension/spacial_rend.png',
  'vfx/magic/beams/beam_dark.png',
  'vfx/magic/beams/beam_dragon.png',
  'vfx/magic/beams/beam_electric.png',
  'vfx/magic/beams/beam_fire.png',
  'vfx/magic/beams/beam_grass.png',
  'vfx/magic/beams/beam_ice.png',
  'vfx/magic/beams/beam_normal.png',
  'vfx/magic/beams/beam_psychic.png',
  'vfx/magic/beams/beam_steel.png',
  'vfx/magic/beams/beam_water.png',
  'vfx/magic/signal_beam.png',
  'vfx/water/water_jet_stream.png',
  'vfx/custom/bug_buzz.png',
  'vfx/wind/silver_wind_volumetric.png',
  'vfx/earth/ground_crater_round.png',
  'vfx/earth/ground_crater_spiked.png',
  'vfx/earth/ground_fissure_crack.png',
  'vfx/earth/ground_skid_trench.png',
  'vfx/earth/ground_stone_ring.png',
];

// Multi-element dynamic color palettes for sprite animations (Palette Swap Engine)
export const ELEMENT_VFX_FILTERS = {
  grass: 'hue-rotate(85deg) saturate(2.2) brightness(1.1)',
  fire: 'hue-rotate(345deg) saturate(2.4) brightness(1.1)',
  water: 'hue-rotate(190deg) saturate(1.5) brightness(1.2)',
  electric: 'hue-rotate(40deg) saturate(2.5) brightness(1.3)',
  ice: 'hue-rotate(175deg) saturate(1.8) brightness(1.3)',
  psychic: 'hue-rotate(295deg) saturate(2.5) brightness(1.2)',
  ghost: 'hue-rotate(240deg) saturate(1.8) brightness(0.9)',
  dark: 'hue-rotate(230deg) saturate(1.5) brightness(0.75)',
  dragon: 'hue-rotate(260deg) saturate(2.0) brightness(1.15)',
  poison: 'hue-rotate(280deg) saturate(2.2) brightness(1.0)',
  ground: 'sepia(100%) hue-rotate(350deg) saturate(1.8) brightness(0.9)',
  rock: 'sepia(80%) hue-rotate(355deg) saturate(1.2) brightness(0.85)',
  steel: 'grayscale(100%) brightness(1.4) contrast(1.2)',
  flying: 'hue-rotate(180deg) saturate(1.2) brightness(1.25)',
  bug: 'hue-rotate(70deg) saturate(2.0) brightness(1.05)',
  fighting: 'hue-rotate(15deg) saturate(1.8) brightness(1.0)',
  normal: 'none',
};

export function getMoveAnimImg(file) {
  if (!file || typeof Image === 'undefined') return null;
  if (!MOVE_ANIM_CACHE.has(file)) {
    const img = new Image();
    if (file.startsWith('/') || file.startsWith('http')) {
      img.src = file;
    } else {
      img.src = `/assets/battle/animations/${file}`;
    }
    MOVE_ANIM_CACHE.set(file, img);
  }
  return MOVE_ANIM_CACHE.get(file);
}

// Eagerly preload core animations at startup
if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
  for (const f of ANIMATION_FILES) {
    getMoveAnimImg(f);
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
    this.beams = [];
    this.areaRings = [];

    // Dedicated Attack VFX Overlays
    this.slashes = [];
    this.bites = [];
    this.punches = [];
    this.fireBlasts = [];
    this.lightnings = [];
    this.stoneEdges = [];
    this.speedHatchings = [];
    this.moveSpriteAnims = [];
    this.foliageBursts = [];
    this.iceCrystals = [];
    this.poisonBursts = [];
    this.shadowPulses = [];
    this.psychicRings = [];
    this.statArrows = [];
    this.elementalSpirals = [];

    // Authentic Visual Attacks
    this.dracoMeteors = [];
    this.airCutters = [];
    this.whirlwinds = [];
    this.nightDazes = [];
    this.spacialRends = [];
    this.buffs = [];
    this.soundWaves = [];
    this.dashes = [];
    this.burningAuras = [];

    this.maxParticles = 120; // Lean budget for locked 60 FPS without GC stutter
  }

  reset() {
    this.particles = [];
    this.floatingTexts = [];
    this.beams = [];
    this.areaRings = [];
    this.slashes = [];
    this.bites = [];
    this.punches = [];
    this.fireBlasts = [];
    this.lightnings = [];
    this.stoneEdges = [];
    this.speedHatchings = [];
    this.moveSpriteAnims = [];
    this.foliageBursts = [];
    this.iceCrystals = [];
    this.poisonBursts = [];
    this.shadowPulses = [];
    this.psychicRings = [];
    this.statArrows = [];
    this.elementalSpirals = [];
    this.dracoMeteors = [];
    this.airCutters = [];
    this.whirlwinds = [];
    this.nightDazes = [];
    this.spacialRends = [];
    this.buffs = [];
    this.soundWaves = [];
    this.dashes = [];
    this.burningAuras = [];
  }

  // Spawn cinematic luminous burst with flash core, directional sparks & organic embers
  spawnPixelBurst(x, y, color = '#FF9800', count = 18, speed = 140, life = 0.4, size = 3) {
    // Keep particle budget tight
    if (this.particles.length > this.maxParticles) {
      this.particles.splice(0, this.particles.length - this.maxParticles);
    }

    // 1. Instantaneous luminous impact flash disc
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      drag: 0.9,
      size: Math.max(7, size * 3.0),
      color,
      coreColor: '#FFFFFF',
      life: 0.10,
      maxLife: 0.10,
      type: 'flash',
      alpha: 1.0,
      maxAlpha: 1.0,
    });

    // 2. High-speed directional radiant sparks
    const sparkCount = Math.max(3, Math.min(6, Math.floor(count * 0.35)));
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const spd = (Math.random() * 0.4 + 0.8) * speed * 1.2;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        drag: 0.94,
        size: Math.max(1.8, size * 0.75),
        color,
        coreColor: '#FFFFFF',
        life: life * (0.65 + Math.random() * 0.35),
        maxLife: life,
        type: 'spark',
        alpha: 1.0,
        maxAlpha: 1.0,
      });
    }

    // 3. Volumetric glowing embers with smooth deceleration
    const emberCount = Math.max(4, Math.min(8, Math.floor(count * 0.55)));
    for (let i = 0; i < emberCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 0.6 + 0.3) * speed;
      const pLife = life * (0.8 + Math.random() * 0.4);

      this.particles.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        drag: 0.92,
        size: Math.max(2.4, (Math.random() < 0.3 ? size * 1.3 : size)),
        color,
        coreColor: Math.random() < 0.35 ? '#FFFFFF' : color,
        life: pLife,
        maxLife: pLife,
        type: 'glow',
        alpha: 1.0,
        maxAlpha: 1.0,
      });
    }
  }

  burst(x, y, color = '#FF9800', count = 16, speed = 120, life = 0.5, size = 4) {
    this.spawnPixelBurst(x, y, color, count, speed, life, size);
  }

  createExplosion(x, y, color = '#FF9800', count = 24, speed = 150) {
    this.spawnShockwave(x, y, 56, color, 0.32);
    this.spawnPixelBurst(x, y, color, count, speed, 0.48, 4.2);
    this.spawnDust(x, y - 4, 3);
  }

  // Cinematic Flame trail & rising hot embers
  spawnFlame(x, y, count = 3) {
    const flamePalette = [
      { color: '#FF3D00', core: '#FFF176' },
      { color: '#FF9100', core: '#FFFFFF' },
      { color: '#FFAB00', core: '#FFF59D' },
    ];

    const actualCount = Math.min(3, count);
    for (let i = 0; i < actualCount; i++) {
      const p = flamePalette[i % flamePalette.length];
      const pLife = 0.34 + Math.random() * 0.12;

      this.particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 32,
        vy: -Math.random() * 55 - 22,
        drag: 0.94,
        size: Math.random() < 0.4 ? 4.8 : 3.5,
        color: p.color,
        coreColor: p.core,
        life: pLife,
        maxLife: pLife,
        type: 'flame',
        alpha: 1.0,
        maxAlpha: 1.0,
      });
    }
  }

  // Cinematic fluid water droplets
  spawnWater(x, y, count = 4) {
    const waterPalette = [
      { color: '#00B0FF', core: '#FFFFFF' },
      { color: '#0288D1', core: '#80D8FF' },
      { color: '#00E5FF', core: '#FFFFFF' },
    ];

    const actualCount = Math.min(3, count);
    for (let i = 0; i < actualCount; i++) {
      const p = waterPalette[i % waterPalette.length];
      const pLife = 0.32 + Math.random() * 0.12;

      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 75,
        vy: (Math.random() - 0.5) * 50 - 25,
        drag: 0.95,
        gravity: 240,
        size: Math.random() < 0.4 ? 4.2 : 3.0,
        color: p.color,
        coreColor: p.core,
        life: pLife,
        maxLife: pLife,
        type: 'fluid',
        alpha: 0.95,
        maxAlpha: 0.95,
      });
    }
  }

  // Cinematic high-voltage electric spark streaks
  spawnSparks(x, y, count = 5) {
    const sparkColors = [
      { color: '#FFEA00', core: '#FFFFFF' },
      { color: '#FFD600', core: '#FFFFFF' },
      { color: '#00E5FF', core: '#FFFFFF' },
    ];

    const actualCount = Math.min(4, count);
    for (let i = 0; i < actualCount; i++) {
      const c = sparkColors[i % sparkColors.length];
      const spd = 130 + Math.random() * 80;
      const angle = Math.random() * Math.PI * 2;
      const pLife = 0.18 + Math.random() * 0.10;

      this.particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        drag: 0.93,
        size: 2.6,
        color: c.color,
        coreColor: c.core,
        life: pLife,
        maxLife: pLife,
        type: 'spark',
        alpha: 1.0,
        maxAlpha: 1.0,
      });
    }
  }

  // Cinematic soft volumetric dust cloud
  spawnDust(x, y, count = 3) {
    const dustColors = ['#90A4AE', '#B0BEC5', '#78909C'];
    const actualCount = Math.min(3, count);
    for (let i = 0; i < actualCount; i++) {
      const c = dustColors[i % dustColors.length];
      const pLife = 0.35 + Math.random() * 0.14;

      this.particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 5,
        vx: (Math.random() - 0.5) * 26,
        vy: -Math.random() * 16 - 6,
        drag: 0.90,
        startSize: 3.0,
        endSize: 7.5 + Math.random() * 2.5,
        size: 3.0,
        color: c,
        life: pLife,
        maxLife: pLife,
        type: 'dust',
        alpha: 0.35,
        maxAlpha: 0.35,
      });
    }
  }

  // Smooth expanding shockwave ring with isometric perspective
  spawnShockwave(x, y, maxRadius = 60, color = '#FFFFFF', duration = 0.35) {
    this.areaRings.push({
      x,
      y,
      radius: 5,
      maxRadius,
      color,
      duration,
      time: 0,
    });
  }

  // Add Continuous Beam
  addBeam(startX, startY, targetX, targetY, color = '#00B0FF', width = 45, duration = 0.85, type = 'water', caster = null, targetEntity = null, skill = null) {
    const beam = {
      startX,
      startY,
      targetX,
      targetY,
      color,
      width,
      duration,
      time: 0,
      type,
      caster,
      targetEntity,
      skill,
      isCancelled: false,
      clashWonReduced: false,
    };
    this.beams.push(beam);
    return beam;
  }

  removeBeam(beam) {
    const idx = this.beams.indexOf(beam);
    if (idx !== -1) {
      this.beams.splice(idx, 1);
    }
  }

  // Slash Animation (Authentic Move Catalog)
  spawnSlash(x, y, color = '#00E5FF', isCross = false, duration = 0.32, visual = null, img = null) {
    this.slashes.push({
      x,
      y,
      color,
      isCross,
      duration,
      time: 0,
      visual,
      img,
    });
  }

  // Bite / Crunch Animation (Authentic Move Catalog)
  spawnBite(x, y, duration = 0.35, visual = null, img = null) {
    this.bites.push({
      x,
      y,
      duration,
      time: 0,
      visual,
      img,
    });
  }

  // Energized Punch Impact (Authentic Move Catalog)
  spawnPunch(x, y, color = '#FF9100', duration = 0.30, visual = null, img = null) {
    this.punches.push({
      x,
      y,
      color,
      duration,
      time: 0,
      visual,
      img,
    });
  }

  // Fire Blast Kanji Symbol Detonation
  spawnFireBlast(x, y, duration = 0.65) {
    this.fireBlasts.push({
      x,
      y,
      duration,
      time: 0,
    });
  }

  // Lightning Strike (Authentic Move Catalog)
  spawnLightning(targetX, targetY, duration = 0.40, visual = null, img = null, onlySprite = false) {
    this.lightnings.push({
      targetX,
      targetY,
      duration,
      time: 0,
      visual,
      img,
      onlySprite,
    });
  }

  // Stone Edge Spires & Earth Tremors (Authentic Move Catalog)
  spawnStoneEdge(targetX, targetY, duration = 0.70, visual = null, img = null) {
    this.stoneEdges.push({
      targetX,
      targetY,
      duration,
      time: 0,
      visual,
      img,
    });
  }

  spawnEarth(targetX, targetY, duration = 0.70, visual = null, img = null) {
    this.spawnStoneEdge(targetX, targetY, duration, visual, img);
  }

  // Buff / Barrier / Status Field (Authentic Move Catalog)
  spawnBuff(x, y, duration = 0.85, type = 'Normal', visual = null, img = null) {
    this.buffs.push({
      x,
      y,
      duration,
      time: 0,
      type,
      visual,
      img,
    });
  }

  // Sound Wave Distortion Waves (Authentic Move Catalog)
  spawnSoundWave(startX, startY, targetX, targetY, duration = 0.65, isDark = false) {
    this.soundWaves.push({
      startX,
      startY,
      targetX,
      targetY,
      duration,
      time: 0,
      isDark,
    });
  }

  // Physical Dash Attack (Authentic Move Catalog)
  spawnDash(startX, startY, targetX, targetY, duration = 0.50, move = {}, visual = null, img = null) {
    this.dashes.push({
      startX,
      startY,
      targetX,
      targetY,
      duration,
      time: 0,
      move,
      visual,
      img,
    });
  }

  // Anime-style Speed Hatching streaks
  spawnSpeedHatching(startX, startY, endX, endY, dirX, dirY, color = '#FFFFFF', duration = 0.28, entity = null) {
    this.speedHatchings.push({
      startX,
      startY,
      endX,
      endY,
      dirX,
      dirY,
      color,
      duration,
      time: 0,
      entity,
    });
  }

  // Foliage / Leaf Storm Burst
  spawnFoliageBurst(x, y, color = '#43A047', duration = 0.42) {
    this.foliageBursts.push({
      x,
      y,
      color,
      duration,
      time: 0,
    });
  }

  // Sharp Ice Crystals & Shards
  spawnIceCrystals(x, y, color = '#80DEEA', duration = 0.55) {
    this.iceCrystals.push({
      x,
      y,
      color,
      duration,
      time: 0,
    });
  }

  // Pressurized Acid Geyser & Poison Burst
  spawnPoisonBurst(x, y, color = '#8E24AA', duration = 0.55) {
    this.poisonBursts.push({
      x,
      y,
      color,
      duration,
      time: 0,
    });
  }

  // Dark Shadow Pulse
  spawnShadowPulse(x, y, color = '#7B1FA2', duration = 0.45) {
    this.shadowPulses.push({
      x,
      y,
      color,
      duration,
      time: 0,
    });
  }

  // Psychic Concentric Distortion Rings
  spawnPsychicRings(x, y, color = '#F50057', duration = 0.5) {
    this.psychicRings.push({
      x,
      y,
      color,
      duration,
      time: 0,
    });
  }

  // Cinematic Stat Surge
  spawnStatArrows(x, y, isBuff = true, color = null, duration = 0.95, entity = null) {
    this.statArrows.push({
      x,
      y,
      isBuff,
      color: color || (isBuff ? '#00E676' : '#FF5252'),
      duration,
      time: 0,
      entity: entity || null,
    });
  }

  // Ascending Elemental Buff Spiral
  spawnElementalBuffSpiral(x, y, elemType = 'fire', color = null, duration = 0.85, entity = null) {
    this.elementalSpirals.push({
      x,
      y,
      elemType: (elemType || 'normal').toLowerCase(),
      color,
      duration,
      time: 0,
      entity: entity || null,
    });
  }

  // Draco Meteor: Hail-style falling meteors with white ground targeting circle
  spawnDracoMeteor(targetX, targetY, visual = {}, target = null, source = null, skill = null, onHit = null) {
    this.dracoMeteors.push({
      targetX,
      targetY,
      visual,
      target,
      source,
      skill,
      onHit,
      duration: 1.25,
      time: 0,
      hasHit: false,
    });
  }

  // Burning Aura: Enveloping spiral of flame sprites and draconic embers
  spawnBurningAura(targetX, targetY, duration = 0.85, visual = null, entity = null, color = '#A855F7', filter = null) {
    this.burningAuras.push({
      targetX,
      targetY,
      duration,
      time: 0,
      visual,
      entity,
      color,
      filter,
    });
  }

  // Air Cutter: Multi-blade sweeping crescent razor winds
  spawnAirCutter(startX, startY, targetX, targetY, visual = {}, target = null, source = null, skill = null, onHit = null) {
    this.airCutters.push({
      startX,
      startY,
      targetX,
      targetY,
      visual,
      target,
      source,
      skill,
      onHit,
      duration: 0.65,
      time: 0,
      hasHit: false,
    });
  }

  // Whirlwind / Twister: Rising cyclonic tornado vortex
  spawnWhirlwind(targetX, targetY, visual = {}, target = null, source = null, skill = null, onHit = null) {
    this.whirlwinds.push({
      targetX,
      targetY,
      visual,
      target,
      source,
      skill,
      onHit,
      duration: 0.85,
      time: 0,
      hasHit: false,
    });
  }

  // Night Daze: Crimson / Dark shadowy dome shockwave burst
  spawnNightDaze(targetX, targetY, visual = {}, target = null, source = null, skill = null, onHit = null) {
    this.nightDazes.push({
      targetX,
      targetY,
      visual,
      target,
      source,
      skill,
      onHit,
      duration: 0.80,
      time: 0,
      hasHit: false,
    });
  }

  // Spacial Rend: Cosmic dimensional rift tear across reality
  spawnSpacialRend(targetX, targetY, visual = {}, target = null, source = null, skill = null, onHit = null) {
    this.spacialRends.push({
      targetX,
      targetY,
      visual,
      target,
      source,
      skill,
      onHit,
      duration: 0.80,
      time: 0,
      hasHit: false,
    });
  }

  // Official Spritesheet Animation
  spawnMoveSpriteAnim(x, y, visual = {}, rotation = 0, entity = null) {
    const file = visual.file || 'core/attack_physical_01.png';
    const cols = visual.cols || 5;
    const rows = visual.rows || 2;
    const startFrame = typeof visual.startFrame === 'number' ? visual.startFrame : 0;
    const endFrame = typeof visual.endFrame === 'number' ? visual.endFrame : 4;
    const fps = visual.fps || 16;

    const frameCount = Math.max(1, (endFrame - startFrame) + 1);
    const duration = Math.max(0.38, frameCount / fps);
    const calScale = visual.scale || 0.48;

    const elem = (visual.element || '').toLowerCase();
    const resolvedFilter = visual.filter || (elem && ELEMENT_VFX_FILTERS[elem] ? ELEMENT_VFX_FILTERS[elem] : null);

    // Sprites for flames, ice, earth/ground, lightning, impacts, auras etc. ALWAYS render upright (0 rotation)
    // Only explicitly flagged directional projectiles are allowed to rotate
    const shouldRotate = visual.isProjectile === true || visual.rotate === true;
    const finalRot = shouldRotate && typeof rotation === 'number' ? rotation : 0;
    const ox = visual.offsetX || 0;
    const oy = visual.offsetY || 0;

    // Anchor offsets relative to target or source entity
    let anchorOffsetX = ox;
    let anchorOffsetY = oy;
    if (entity) {
      anchorOffsetX = (x - entity.x) + ox;
      anchorOffsetY = (y - entity.y) + oy;
    }

    const visualOpacity = typeof visual.opacity === 'number' ? visual.opacity : (typeof visual.alpha === 'number' ? visual.alpha : 1.0);

    this.moveSpriteAnims.push({
      x: x + ox,
      y: y + oy,
      entity: entity || null,
      anchorOffsetX,
      anchorOffsetY,
      visualOffsetX: ox,
      visualOffsetY: oy,
      rotation: finalRot,
      filter: resolvedFilter,
      hue: typeof visual.hue === 'number' ? visual.hue : null,
      brightness: typeof visual.brightness === 'number' ? visual.brightness : null,
      saturate: typeof visual.saturate === 'number' ? visual.saturate : null,
      blendMode: visual.blendMode || null,
      opacity: visualOpacity,
      file,
      cols,
      rows,
      startFrame,
      endFrame,
      frameCount,
      fps,
      duration,
      scale: calScale,
      time: 0,
      fallSpeedY: visual.isHail ? 85 : 0,
      startY: visual.isHail ? (y + oy - 75) : (y + oy),
    });

    // Hail: Spawn multiple staggered ice shards falling strictly vertically from above onto the target down to ground level
    if (visual.isHail) {
      const shardOffsets = [
        { dx: -18, startYOff: -85, delay: 0.06, scale: calScale * 0.8 },
        { dx: 16, startYOff: -95, delay: 0.14, scale: calScale * 0.85 },
        { dx: -6, startYOff: -80, delay: 0.22, scale: calScale * 0.75 },
        { dx: 12, startYOff: -90, delay: 0.30, scale: calScale * 0.8 },
      ];
      for (const off of shardOffsets) {
        setTimeout(() => {
          this.moveSpriteAnims.push({
            x: x + ox + off.dx,
            y: y + oy + off.startYOff,
            rotation: 0,
            filter: resolvedFilter,
            opacity: visualOpacity * 0.9,
            file,
            cols,
            rows,
            startFrame,
            endFrame,
            frameCount,
            fps: fps + Math.floor(Math.random() * 4),
            duration,
            scale: off.scale,
            time: 0,
            fallSpeedY: 85,
            startY: y + oy + off.startYOff,
          });
        }, Math.round(off.delay * 1000));
      }
    }

    // Charm / Attract / Captivate / Lovely Kiss: Spawn heart particles alongside the pink smoke
    if (visual.hearts) {
      this.moveSpriteAnims.push({
        x: x + ox,
        y: y + oy - 12,
        rotation: 0,
        filter: null,
        opacity: 1.0,
        file: 'vfx/custom/heart_burst.png',
        cols: 8,
        rows: 1,
        startFrame: 0,
        endFrame: 7,
        frameCount: 8,
        fps: 16,
        duration: Math.max(duration, 0.55),
        scale: 0.95,
        time: 0,
      });
    }
  }

  // Floating Combat Text
  addFloatingText(x, y, text, type = 'normal', isCrit = false) {
    let color = '#FFFFFF';
    let size = 6;

    if (type === 'fire') color = '#FF7043';
    else if (type === 'water') color = '#29B6F6';
    else if (type === 'electric') color = '#FFEE58';
    else if (type === 'grass') color = '#9CCC65';
    else if (type === 'ghost') color = '#BA68C8';
    else if (type === 'psychic') color = '#F06292';
    else if (type === 'blocked') color = '#81D4FA';
    else if (type === 'physical') color = '#FFAB91';
    else if (type === 'heal') color = '#69F0AE';
    else if (type === 'dodge') color = '#ECEFF1';

    if (isCrit) {
      color = '#FFD700';
      size = 11;
    }

    this.floatingTexts.push({
      x: x + (Math.random() - 0.5) * 12,
      y: y - 10,
      vx: (Math.random() - 0.5) * 14,
      vy: -42,
      text,
      color,
      size,
      life: 0.85,
      maxLife: 0.85,
      scale: isCrit ? 1.08 : 1.0,
      isCrit,
    });
  }

  update(dt) {
    // 1. Update Particles with Subpixel physics & deceleration
    const dragTimeScale = dt * 60;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.drag) {
        const d = Math.pow(p.drag, dragTimeScale);
        p.vx *= d;
        p.vy *= d;
      }
      if (p.gravity) {
        p.vy += p.gravity * dt;
      }
    }

    // 2. Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.life -= dt;
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      t.x += t.vx * dt;
      t.y += t.vy * dt;
      t.vy += 80 * dt;
    }

    // 3. Update Shockwave Rings
    for (let i = this.areaRings.length - 1; i >= 0; i--) {
      const r = this.areaRings[i];
      r.time += dt;
      if (r.time >= r.duration) {
        this.areaRings.splice(i, 1);
        continue;
      }
      const progress = r.time / r.duration;
      const ease = 1 - Math.pow(1 - progress, 2);
      r.radius = 5 + ease * (r.maxRadius - 5);
    }

    // 4. Update Beams
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      b.time += dt;
      if (b.caster && !b.caster.isFainted) {
        if (typeof b.caster.getBeamOrigin === 'function') {
          const origin = b.caster.getBeamOrigin(b.targetX, b.targetY);
          b.startX = origin.x;
          b.startY = origin.y;
        } else if (typeof b.caster.getAttackOrigin === 'function') {
          const origin = b.caster.getAttackOrigin();
          b.startX = origin.x;
          b.startY = origin.y;
        } else {
          b.startX = b.caster.x;
          b.startY = b.caster.y;
        }
      }
      if (b.targetEntity && !b.targetEntity.isFainted) {
        if (typeof b.targetEntity.getHitCenter === 'function') {
          const hitCenter = b.targetEntity.getHitCenter();
          b.targetX = hitCenter.x;
          b.targetY = hitCenter.y;
        } else {
          b.targetX = b.targetEntity.x;
          b.targetY = b.targetEntity.y - 18;
        }
      }
      if (b.time >= b.duration) {
        this.beams.splice(i, 1);
      }
    }

    // 5. Update Slashes
    for (let i = this.slashes.length - 1; i >= 0; i--) {
      const s = this.slashes[i];
      s.time += dt;
      if (s.time >= s.duration) {
        this.slashes.splice(i, 1);
      }
    }

    // 6. Update Bites
    for (let i = this.bites.length - 1; i >= 0; i--) {
      const b = this.bites[i];
      b.time += dt;
      if (b.time >= b.duration) {
        this.bites.splice(i, 1);
      }
    }

    // 7. Update Punches
    for (let i = this.punches.length - 1; i >= 0; i--) {
      const p = this.punches[i];
      p.time += dt;
      if (p.time >= p.duration) {
        this.punches.splice(i, 1);
      }
    }

    // 8. Update Fire Blasts
    for (let i = this.fireBlasts.length - 1; i >= 0; i--) {
      const fb = this.fireBlasts[i];
      fb.time += dt;
      if (fb.time >= fb.duration) {
        this.fireBlasts.splice(i, 1);
      }
    }

    // 9. Update Lightnings
    for (let i = this.lightnings.length - 1; i >= 0; i--) {
      const l = this.lightnings[i];
      l.time += dt;
      if (l.time >= l.duration) {
        this.lightnings.splice(i, 1);
      }
    }

    // 10. Update Stone Edges
    for (let i = this.stoneEdges.length - 1; i >= 0; i--) {
      const se = this.stoneEdges[i];
      se.time += dt;
      if (se.time >= se.duration) {
        this.stoneEdges.splice(i, 1);
      }
    }

    // 11. Update Speed Hatchings
    for (let i = this.speedHatchings.length - 1; i >= 0; i--) {
      const sh = this.speedHatchings[i];
      sh.time += dt;
      if (sh.time >= sh.duration) {
        this.speedHatchings.splice(i, 1);
      }
    }

    // 12. Update Foliage Bursts
    for (let i = this.foliageBursts.length - 1; i >= 0; i--) {
      const fb = this.foliageBursts[i];
      fb.time += dt;
      if (fb.time >= fb.duration) {
        this.foliageBursts.splice(i, 1);
      }
    }

    // 13. Update Poison Bursts
    for (let i = this.poisonBursts.length - 1; i >= 0; i--) {
      const pb = this.poisonBursts[i];
      pb.time += dt;
      if (pb.time >= pb.duration) {
        this.poisonBursts.splice(i, 1);
      }
    }

    // 14. Update Ice Crystals
    for (let i = this.iceCrystals.length - 1; i >= 0; i--) {
      const ic = this.iceCrystals[i];
      ic.time += dt;
      if (ic.time >= ic.duration) {
        this.iceCrystals.splice(i, 1);
      }
    }

    // 15. Update Shadow Pulses
    for (let i = this.shadowPulses.length - 1; i >= 0; i--) {
      const sp = this.shadowPulses[i];
      sp.time += dt;
      if (sp.time >= sp.duration) {
        this.shadowPulses.splice(i, 1);
      }
    }

    // 16. Update Psychic Rings
    for (let i = this.psychicRings.length - 1; i >= 0; i--) {
      const pr = this.psychicRings[i];
      pr.time += dt;
      if (pr.time >= pr.duration) {
        this.psychicRings.splice(i, 1);
      }
    }

    // 17. Update Stat Arrows
    for (let i = this.statArrows.length - 1; i >= 0; i--) {
      const sa = this.statArrows[i];
      sa.time += dt;
      if (sa.time >= sa.duration) {
        this.statArrows.splice(i, 1);
      }
    }

    // 18. Update Elemental Spirals
    for (let i = this.elementalSpirals.length - 1; i >= 0; i--) {
      const es = this.elementalSpirals[i];
      es.time += dt;
      if (es.time >= es.duration) {
        this.elementalSpirals.splice(i, 1);
      }
    }

    // 19. Update Move Spritesheet Animations
    for (let i = this.moveSpriteAnims.length - 1; i >= 0; i--) {
      const ma = this.moveSpriteAnims[i];
      ma.time += dt;

      // Real-time Dynamic Tracking: Attach sprite effect to target or caster entity!
      if (ma.entity && !ma.entity.isFainted) {
        ma.x = ma.entity.x + ma.anchorOffsetX;
        ma.y = ma.entity.y + ma.anchorOffsetY;
      } else if (ma.fallSpeedY && typeof ma.startY === 'number') {
        const fallProg = Math.min(1.0, ma.time / ma.duration);
        ma.y = ma.startY + fallProg * (ma.fallSpeedY || 55);
      }
      if (ma.time >= ma.duration) {
        this.moveSpriteAnims.splice(i, 1);
      }
    }

    // 20. Update Draco Meteors
    for (let i = this.dracoMeteors.length - 1; i >= 0; i--) {
      const dm = this.dracoMeteors[i];
      dm.time += dt;
      const prog = dm.time / dm.duration;
      if (!dm.hasHit && prog >= 0.70) {
        dm.hasHit = true;
        if (dm.onHit && dm.target && !dm.target.isFainted) {
          dm.onHit(dm.target, dm.skill);
        }
        this.spawnShockwave(dm.targetX, dm.targetY, 95, '#FF4500', 0.50);
        this.spawnPixelBurst(dm.targetX, dm.targetY, '#FFD700', 45, 250, 0.55, 4.5);
      }
      if (dm.time >= dm.duration) {
        this.dracoMeteors.splice(i, 1);
      }
    }

    // 20.1. Update Burning Auras
    for (let i = this.burningAuras.length - 1; i >= 0; i--) {
      const ba = this.burningAuras[i];
      ba.time += dt;
      if (ba.entity && !ba.entity.isFainted) {
        ba.targetX = ba.entity.x;
        ba.targetY = ba.entity.y;
      }
      if (ba.time >= ba.duration) {
        this.burningAuras.splice(i, 1);
      }
    }

    // 21. Update Air Cutters
    for (let i = this.airCutters.length - 1; i >= 0; i--) {
      const ac = this.airCutters[i];
      ac.time += dt;
      const prog = ac.time / ac.duration;
      if (!ac.hasHit && prog >= 0.70) {
        ac.hasHit = true;
        if (ac.onHit && ac.target && !ac.target.isFainted) {
          ac.onHit(ac.target, ac.skill);
        }
        this.spawnShockwave(ac.targetX, ac.targetY, 45, '#38BDF8', 0.35);
        this.spawnPixelBurst(ac.targetX, ac.targetY, '#BAE6FD', 20, 160, 0.4, 3);
      }
      if (ac.time >= ac.duration) {
        this.airCutters.splice(i, 1);
      }
    }

    // 22. Update Whirlwinds / Twisters
    for (let i = this.whirlwinds.length - 1; i >= 0; i--) {
      const ww = this.whirlwinds[i];
      ww.time += dt;
      const prog = ww.time / ww.duration;
      if (!ww.hasHit && prog >= 0.50) {
        ww.hasHit = true;
        if (ww.onHit && ww.target && !ww.target.isFainted) {
          ww.onHit(ww.target, ww.skill);
        }
        this.spawnShockwave(ww.targetX, ww.targetY, 50, '#38BDF8', 0.4);
      }
      if (ww.time >= ww.duration) {
        this.whirlwinds.splice(i, 1);
      }
    }

    // 23. Update Night Dazes
    for (let i = this.nightDazes.length - 1; i >= 0; i--) {
      const nd = this.nightDazes[i];
      nd.time += dt;
      const prog = nd.time / nd.duration;
      if (!nd.hasHit && prog >= 0.45) {
        nd.hasHit = true;
        if (nd.onHit && nd.target && !nd.target.isFainted) {
          nd.onHit(nd.target, nd.skill);
        }
        this.spawnShockwave(nd.targetX, nd.targetY, 65, '#E11D48', 0.45);
        this.spawnPixelBurst(nd.targetX, nd.targetY, '#BE123C', 26, 180, 0.45, 3.5);
      }
      if (nd.time >= nd.duration) {
        this.nightDazes.splice(i, 1);
      }
    }

    // 24. Update Spacial Rends
    for (let i = this.spacialRends.length - 1; i >= 0; i--) {
      const sr = this.spacialRends[i];
      sr.time += dt;
      const prog = sr.time / sr.duration;
      if (!sr.hasHit && prog >= 0.55) {
        sr.hasHit = true;
        if (sr.onHit && sr.target && !sr.target.isFainted) {
          sr.onHit(sr.target, sr.skill);
        }
        this.spawnShockwave(sr.targetX, sr.targetY, 60, '#EC4899', 0.45);
        this.spawnPixelBurst(sr.targetX, sr.targetY, '#F472B6', 24, 190, 0.45, 3.5);
      }
      if (sr.time >= sr.duration) {
        this.spacialRends.splice(i, 1);
      }
    }

    // 25. Update Buffs
    for (let i = this.buffs.length - 1; i >= 0; i--) {
      const bf = this.buffs[i];
      bf.time += dt;
      if (bf.time >= bf.duration) {
        this.buffs.splice(i, 1);
      }
    }

    // 26. Update Sound Waves
    for (let i = this.soundWaves.length - 1; i >= 0; i--) {
      const sw = this.soundWaves[i];
      sw.time += dt;
      if (sw.time >= sw.duration) {
        this.soundWaves.splice(i, 1);
      }
    }

    // 27. Update Dashes
    for (let i = this.dashes.length - 1; i >= 0; i--) {
      const d = this.dashes[i];
      d.time += dt;
      if (d.time >= d.duration) {
        this.dashes.splice(i, 1);
      }
    }
  }

  render(ctx) {
    // 1. Render Shockwave Rings (Zero inner save/restore)
    if (this.areaRings.length > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < this.areaRings.length; i++) {
        const r = this.areaRings[i];
        const progress = Math.min(1, r.time / r.duration);
        const fade = 1 - progress;
        const alpha = Math.sin(progress * Math.PI) * fade;
        if (alpha <= 0.01) continue;

        const rx = r.radius;
        const ry = r.radius * 0.58;

        // Outer soft glow halo
        ctx.globalAlpha = Math.min(1, alpha * 0.45);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = Math.max(1.5, (1 - progress) * 5.5);
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner luminous core ring
        ctx.globalAlpha = Math.min(1, alpha * 0.95);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = Math.max(1, (1 - progress) * 2.0);
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Render Beams (Unified spritesheet beam engine matching Move Catalog)
    for (let i = 0; i < this.beams.length; i++) {
      const b = this.beams[i];
      const prog = Math.min(1.0, b.time / b.duration);
      const beamImg = b.skill?.visual?.file ? getMoveAnimImg(b.skill.visual.file) : null;
      renderCombatBeam(
        ctx,
        b.startX,
        b.startY,
        b.targetX,
        b.targetY,
        prog,
        b.type || b.skill?.type || 'normal',
        b.width || 34,
        beamImg,
        b.skill?.visual,
        b.color,
        getMoveAnimImg,
        b.skill?.name
      );
    }

    // 3. Render Area & Ground Attacks
    for (let i = 0; i < this.fireBlasts.length; i++) {
      const fb = this.fireBlasts[i];
      renderPixelFireBlast(ctx, fb.x, fb.y, fb.time / fb.duration);
    }

    for (let i = 0; i < this.stoneEdges.length; i++) {
      const se = this.stoneEdges[i];
      const prog = Math.min(1.0, se.time / se.duration);
      const img = se.img || (se.visual?.file ? getMoveAnimImg(se.visual.file) : null);
      renderCombatEarth(ctx, se.targetX, se.targetY, prog, img, se.visual);
    }

    for (let i = 0; i < this.lightnings.length; i++) {
      const l = this.lightnings[i];
      const prog = Math.min(1.0, l.time / l.duration);
      const img = l.img || (l.visual?.file ? getMoveAnimImg(l.visual.file) : null);
      renderCombatLightning(ctx, l.targetX, l.targetY, prog, img, l.visual, l.onlySprite);
    }

    // 4. Render Melee / Hit VFX Overlays (Authentic Move Catalog)
    for (let i = 0; i < this.slashes.length; i++) {
      const s = this.slashes[i];
      const prog = Math.min(1.0, s.time / s.duration);
      const img = s.img || (s.visual?.file ? getMoveAnimImg(s.visual.file) : null);
      renderCombatSlash(ctx, s.x, s.y, prog, s.color, img, s.visual);
    }

    for (let i = 0; i < this.bites.length; i++) {
      const b = this.bites[i];
      const prog = Math.min(1.0, b.time / b.duration);
      const img = b.img || (b.visual?.file ? getMoveAnimImg(b.visual.file) : null);
      renderCombatBite(ctx, b.x, b.y, prog, img, b.visual);
    }

    for (let i = 0; i < this.punches.length; i++) {
      const p = this.punches[i];
      const prog = Math.min(1.0, p.time / p.duration);
      const img = p.img || (p.visual?.file ? getMoveAnimImg(p.visual.file) : null);
      renderCombatPunch(ctx, p.x, p.y, prog, p.color, img, p.visual);
    }

    // 4.1. Buffs & Barriers (Authentic Move Catalog)
    for (let i = 0; i < this.buffs.length; i++) {
      const bf = this.buffs[i];
      const prog = Math.min(1.0, bf.time / bf.duration);
      const img = bf.img || (bf.visual?.file ? getMoveAnimImg(bf.visual.file) : null);
      renderCombatBuff(ctx, bf.x, bf.y, prog, bf.type, img, bf.visual, getMoveAnimImg);
    }

    // 4.2. Sound Waves (Authentic Move Catalog)
    for (let i = 0; i < this.soundWaves.length; i++) {
      const sw = this.soundWaves[i];
      const prog = Math.min(1.0, sw.time / sw.duration);
      renderCombatSoundWave(ctx, sw.startX, sw.startY, sw.targetX, sw.targetY, prog, sw.isDark);
    }

    // 4.3. Dash Attacks (Authentic Move Catalog)
    for (let i = 0; i < this.dashes.length; i++) {
      const d = this.dashes[i];
      const prog = Math.min(1.0, d.time / d.duration);
      const img = d.img || (d.visual?.file ? getMoveAnimImg(d.visual.file) : null);
      renderCombatDash(ctx, d.startX, d.startY, d.targetX, d.targetY, prog, d.move, img, d.visual);
    }

    // 4.5. Speed Hatching Lines
    for (let i = 0; i < this.speedHatchings.length; i++) {
      const sh = this.speedHatchings[i];
      const progress = sh.time / sh.duration;
      let cx = sh.startX;
      let cy = sh.startY;
      if (sh.entity && !sh.entity.isFainted) {
        const center = typeof sh.entity.getHitCenter === 'function' ? sh.entity.getHitCenter() : { x: sh.entity.x, y: sh.entity.y - 18 };
        cx = center.x;
        cy = center.y;
      } else {
        cx = sh.startX + (sh.endX - sh.startX) * progress;
        cy = sh.startY + (sh.endY - sh.startY) * progress;
      }
      renderSpeedHatching(ctx, cx, cy, sh.dirX, sh.dirY, progress, sh.color);
    }

    // 4.6. Specialized Elemental VFX
    for (let i = 0; i < this.foliageBursts.length; i++) {
      const fb = this.foliageBursts[i];
      renderPixelFoliageBurst(ctx, fb.x, fb.y, fb.time / fb.duration, fb.color);
    }

    for (let i = 0; i < this.poisonBursts.length; i++) {
      const pb = this.poisonBursts[i];
      renderPixelPoisonBurst(ctx, pb.x, pb.y, pb.time / pb.duration, pb.color);
    }

    for (let i = 0; i < this.iceCrystals.length; i++) {
      const ic = this.iceCrystals[i];
      renderPixelIceCrystals(ctx, ic.x, ic.y, ic.time / ic.duration, ic.color);
    }

    for (let i = 0; i < this.shadowPulses.length; i++) {
      const sp = this.shadowPulses[i];
      renderPixelShadowPulse(ctx, sp.x, sp.y, sp.time / sp.duration, sp.color);
    }

    for (let i = 0; i < this.psychicRings.length; i++) {
      const pr = this.psychicRings[i];
      renderPixelPsychicRings(ctx, pr.x, pr.y, pr.time / pr.duration, pr.color);
    }

    for (let i = 0; i < this.statArrows.length; i++) {
      const sa = this.statArrows[i];
      const cx = (sa.entity && !sa.entity.isFainted) ? sa.entity.x : sa.x;
      const cy = (sa.entity && !sa.entity.isFainted) ? sa.entity.y : sa.y;
      renderPixelStatArrows(ctx, cx, cy, sa.time / sa.duration, sa.isBuff, sa.color);
    }

    for (let i = 0; i < this.elementalSpirals.length; i++) {
      const es = this.elementalSpirals[i];
      const cx = (es.entity && !es.entity.isFainted) ? es.entity.x : es.x;
      const cy = (es.entity && !es.entity.isFainted) ? es.entity.y : es.y;
      renderPixelElementalBuffSpiral(ctx, cx, cy, es.time / es.duration, es.elemType, es.color);
    }

    // 4.8. Move Spritesheet Animations
    for (let i = 0; i < this.moveSpriteAnims.length; i++) {
      const ma = this.moveSpriteAnims[i];
      const img = getMoveAnimImg(ma.file);
      if (img && img.complete && img.naturalWidth > 0) {
        const frameProgress = Math.min(0.999, ma.time / ma.duration);
        const currentFrameRel = Math.floor(frameProgress * ma.frameCount);
        const actualFrame = ma.startFrame + currentFrameRel;

        const fw = img.naturalWidth / ma.cols;
        const fh = img.naturalHeight / ma.rows;
        const col = actualFrame % ma.cols;
        const row = Math.floor(actualFrame / ma.cols);
        const sx = col * fw;
        const sy = row * fh;
        const dw = fw * ma.scale;
        const dh = fh * ma.scale;

        let renderX = ma.x;
        let renderY = ma.y;
        if (ma.entity && !ma.entity.isFainted) {
          const shakeX = ma.entity.shakeX || 0;
          const shakeY = ma.entity.shakeY || 0;
          renderX = ma.entity.x + ma.anchorOffsetX + shakeX;
          renderY = ma.entity.y + ma.anchorOffsetY + shakeY;
        }

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.translate(renderX, renderY);
        if (ma.rotation) {
          ctx.rotate(ma.rotation);
        }
        if (ma.blendMode) {
          ctx.globalCompositeOperation = ma.blendMode;
        }
        if (ma.filter) {
          ctx.filter = ma.filter;
        } else if (ma.hue !== null || ma.brightness !== null || ma.saturate !== null) {
          const parts = [];
          if (ma.hue !== null) parts.push(`hue-rotate(${ma.hue}deg)`);
          if (ma.saturate !== null) parts.push(`saturate(${ma.saturate})`);
          if (ma.brightness !== null) parts.push(`brightness(${ma.brightness})`);
          ctx.filter = parts.join(' ');
        }
        if (typeof ma.opacity === 'number') {
          ctx.globalAlpha = ma.opacity;
        }
        ctx.drawImage(
          img,
          sx, sy, fw, fh,
          -dw / 2,
          -dh / 2,
          dw,
          dh
        );
        ctx.restore();
      } else {
        const prog = ma.time / ma.duration;
        ctx.save();
        ctx.translate(ma.x, ma.y);
        if (ma.rotation) {
          ctx.rotate(ma.rotation);
        }
        renderPixelSlash(ctx, 0, 0, prog, '#00E5FF');
        ctx.restore();
      }
    }

    // 4.9. Dedicated Authentic Visual Attacks
    for (let i = 0; i < this.dracoMeteors.length; i++) {
      const dm = this.dracoMeteors[i];
      const img = getMoveAnimImg(dm.visual?.file || 'vfx/fire/fire_stream_billow.png');
      renderDracoMeteorCombat(ctx, dm.targetX, dm.targetY, Math.min(1.0, dm.time / dm.duration), img, dm.visual);
    }

    for (let i = 0; i < this.airCutters.length; i++) {
      const ac = this.airCutters[i];
      const img = getMoveAnimImg(ac.visual?.file || 'vfx/wind/air_cutter_volumetric.png');
      renderAirCutterCombat(ctx, ac.startX, ac.startY, ac.targetX, ac.targetY, Math.min(1.0, ac.time / ac.duration), img, ac.visual);
    }

    for (let i = 0; i < this.whirlwinds.length; i++) {
      const ww = this.whirlwinds[i];
      const img = getMoveAnimImg(ww.visual?.file || 'vfx/wind/whirlwind.png');
      renderWhirlwindCombat(ctx, ww.targetX, ww.targetY, Math.min(1.0, ww.time / ww.duration), img, ww.visual, ww.skill?.type);
    }

    for (let i = 0; i < this.nightDazes.length; i++) {
      const nd = this.nightDazes[i];
      const img = getMoveAnimImg(nd.visual?.file || 'vfx/dark/night_daze_burst.png');
      renderNightDazeCombat(ctx, nd.targetX, nd.targetY, Math.min(1.0, nd.time / nd.duration), img, nd.visual);
    }

    for (let i = 0; i < this.spacialRends.length; i++) {
      const sr = this.spacialRends[i];
      const img = getMoveAnimImg(sr.visual?.file || 'vfx/dimension/spacial_rend.png');
      renderSpacialRendCombat(ctx, sr.targetX, sr.targetY, Math.min(1.0, sr.time / sr.duration), img, sr.visual);
    }

    // 4.10. Burning Auras
    for (let i = 0; i < this.burningAuras.length; i++) {
      const ba = this.burningAuras[i];
      const prog = Math.min(1.0, ba.time / ba.duration);
      const isRedFire = ba.visual?.file?.includes('pixel_fire') || ba.visual?.isDragonDance || ba.color === '#FF5722' || ba.color === '#EF4444' || ba.color === '#F08030';
      const defaultImg = isRedFire ? 'vfx/pixel_fire/colored/red/group_4_5.png' : 'vfx/fire/dragon_breath_stream.png';
      const img = ba.visual?.file ? getMoveAnimImg(ba.visual.file) : getMoveAnimImg(defaultImg);
      renderBurningAuraCombat(ctx, ba.targetX, ba.targetY, prog, img, ba.visual, ba.color, ba.filter);
    }

    // 5. High-Performance Batched Particle Rendering (Zero Inner Save/Restore)
    if (this.particles.length > 0) {
      // Pass A: Lighter Additive Particles (Single globalCompositeOperation switch)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        if (p.type === 'dust' || p.type === 'fluid') continue;

        const lifeRatio = Math.max(0, p.life / p.maxLife);
        const alpha = Math.min(1, lifeRatio * (p.maxAlpha || 1.0));
        if (alpha <= 0.01) continue;

        if (p.type === 'spark') {
          // Directional motion-blurred streak
          const tailLen = 0.035;
          const tailX = p.x - p.vx * tailLen;
          const tailY = p.y - p.vy * tailLen;

          // Outer colored streak
          ctx.globalAlpha = alpha;
          ctx.lineWidth = Math.max(1.8, p.size * 1.5);
          ctx.strokeStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();

          // Inner pure white razor core
          ctx.lineWidth = Math.max(1.0, p.size * 0.55);
          ctx.strokeStyle = p.coreColor || '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();

        } else if (p.type === 'flash') {
          // Expanding impact flash disc
          const curR = p.size * (1 + (1 - lifeRatio) * 1.3);
          ctx.globalAlpha = alpha * 0.75;
          ctx.fillStyle = p.haloColor || p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, curR, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, curR * 0.45, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // 'flame' or 'glow' radiant particle
          const curSize = p.endSize 
            ? p.startSize + (p.endSize - p.startSize) * (1 - lifeRatio)
            : p.size * (0.35 + 0.65 * lifeRatio);

          // Outer halo
          ctx.globalAlpha = alpha * 0.50;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, curSize * 1.7, 0, Math.PI * 2);
          ctx.fill();

          // Inner white/bright core
          ctx.globalAlpha = alpha * 0.95;
          ctx.fillStyle = p.coreColor || '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, curSize * 0.62), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Pass B: Standard Composite Particles (Dust Clouds, Fluid Droplets)
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        if (p.type !== 'dust' && p.type !== 'fluid') continue;

        const lifeRatio = Math.max(0, p.life / p.maxLife);
        const alpha = Math.min(1, lifeRatio * (p.maxAlpha || 1.0));
        if (alpha <= 0.01) continue;

        if (p.type === 'dust') {
          // Smooth expanding dust puff
          const curSize = p.startSize + (p.endSize - p.startSize) * (1 - lifeRatio);
          ctx.globalAlpha = alpha * (p.alpha || 0.35);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, curSize, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === 'fluid') {
          // Fluid water droplet with specular highlight
          const curSize = p.size * (0.4 + 0.6 * lifeRatio);
          ctx.globalAlpha = alpha * 0.85;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, curSize, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = p.coreColor || '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x - curSize * 0.3, p.y - curSize * 0.3, Math.max(0.8, curSize * 0.32), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // 6. Floating Damage / Status Texts
    if (this.floatingTexts.length > 0) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#000000';

      for (let i = 0; i < this.floatingTexts.length; i++) {
        const t = this.floatingTexts[i];
        const progress = t.life / t.maxLife;
        const alpha = Math.min(1, progress * 1.5);
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${t.size}px 'Outfit', sans-serif`;

        const tx = Math.round(t.x);
        const ty = Math.round(t.y);
        ctx.strokeText(t.text, tx, ty);

        ctx.fillStyle = t.color;
        ctx.fillText(t.text, tx, ty);
      }
      ctx.restore();
    }
  }
}
