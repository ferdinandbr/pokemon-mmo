// Pokemon Combatant Entity with Fast Dynamic Real-Time Movement & Turn Combat
import { getTypeMultiplier, calculateDodgeCooldown, calculateCombatDamage, calculateMoveCooldown } from './pokemonData.js';
import { soundManager } from './soundManager.js';
import { OverworldSprite } from './overworldSprite.js';
import {
  renderPixelParalysisArcs,
  renderPixelPoisonBubbles,
  renderDefensiveBarrier,
  renderDizzyStars,
  getTypeColor,
  getTypePalette,
} from './pixelArtVfx.js';
import { getMoveAnimImg } from './particleSystem.js';

// Species-specific attack origins (mouth, cannons, flower bloom, snout) across all 8 PMD directions:
// PMD Collab 8-Directional Attack Origins (Screen Pixels relative to entity foot anchor x, y)
// [0: DOWN, 1: DOWN_RIGHT, 2: RIGHT, 3: UP_RIGHT, 4: UP, 5: UP_LEFT, 6: LEFT, 7: DOWN_LEFT]
const SPECIES_ATTACK_ORIGINS = {
  // Blastoise (009): Dual shoulder cannons mounted on carapace
  '009': [
    { x: 0, y: -24 },   // 0: DOWN (cannons firing over shoulders)
    { x: 16, y: -22 },  // 1: DOWN_RIGHT
    { x: 20, y: -24 },  // 2: RIGHT
    { x: 16, y: -28 },  // 3: UP_RIGHT
    { x: 0, y: -30 },   // 4: UP
    { x: -16, y: -28 }, // 5: UP_LEFT
    { x: -20, y: -24 }, // 6: LEFT
    { x: -16, y: -22 }, // 7: DOWN_LEFT
  ],

  // Venusaur (003): Central palm-flower / mouth
  '003': [
    { x: 0, y: -16 },   // 0: DOWN
    { x: 14, y: -18 },  // 1: DOWN_RIGHT
    { x: 18, y: -19 },  // 2: RIGHT
    { x: 14, y: -22 },  // 3: UP_RIGHT
    { x: 0, y: -24 },   // 4: UP
    { x: -14, y: -22 }, // 5: UP_LEFT
    { x: -18, y: -19 }, // 6: LEFT
    { x: -14, y: -18 }, // 7: DOWN_LEFT
  ],

  // Charizard (006): Elevated dragon head / snout
  '006': [
    { x: 0, y: -26 },   // 0: DOWN
    { x: 18, y: -26 },  // 1: DOWN_RIGHT
    { x: 22, y: -28 },  // 2: RIGHT
    { x: 16, y: -32 },  // 3: UP_RIGHT
    { x: 0, y: -34 },   // 4: UP
    { x: -16, y: -32 }, // 5: UP_LEFT
    { x: -22, y: -28 }, // 6: LEFT
    { x: -18, y: -26 }, // 7: DOWN_LEFT
  ],

  // Mewtwo (150): Elevated psychic focal point / hands
  '150': [
    { x: 0, y: -20 },   // 0: DOWN
    { x: 16, y: -22 },  // 1: DOWN_RIGHT
    { x: 18, y: -24 },  // 2: RIGHT
    { x: 14, y: -28 },  // 3: UP_RIGHT
    { x: 0, y: -30 },   // 4: UP
    { x: -14, y: -28 }, // 5: UP_LEFT
    { x: -18, y: -24 }, // 6: LEFT
    { x: -16, y: -22 }, // 7: DOWN_LEFT
  ],

  // Pikachu (025): Compact electric cheeks / mouth
  '025': [
    { x: 0, y: -10 },   // 0: DOWN
    { x: 10, y: -10 },  // 1: DOWN_RIGHT
    { x: 12, y: -11 },  // 2: RIGHT
    { x: 10, y: -14 },  // 3: UP_RIGHT
    { x: 0, y: -16 },   // 4: UP
    { x: -10, y: -14 }, // 5: UP_LEFT
    { x: -12, y: -11 }, // 6: LEFT
    { x: -10, y: -10 }, // 7: DOWN_LEFT
  ],

  // Gengar (094): Wide shadowy grin
  '094': [
    { x: 0, y: -14 },   // 0: DOWN
    { x: 12, y: -16 },  // 1: DOWN_RIGHT
    { x: 15, y: -17 },  // 2: RIGHT
    { x: 12, y: -20 },  // 3: UP_RIGHT
    { x: 0, y: -22 },   // 4: UP
    { x: -12, y: -20 }, // 5: UP_LEFT
    { x: -15, y: -17 }, // 6: LEFT
    { x: -12, y: -16 }, // 7: DOWN_LEFT
  ],

  // Bulbasaur (001): Small quadruped bulb / mouth
  '001': [
    { x: 0, y: -10 },   // 0: DOWN
    { x: 10, y: -11 },  // 1: DOWN_RIGHT
    { x: 13, y: -12 },  // 2: RIGHT
    { x: 10, y: -15 },  // 3: UP_RIGHT
    { x: 0, y: -16 },   // 4: UP
    { x: -10, y: -15 }, // 5: UP_LEFT
    { x: -13, y: -12 }, // 6: LEFT
    { x: -10, y: -11 }, // 7: DOWN_LEFT
  ],
};

const DEFAULT_ATTACK_ORIGINS = [
  { x: 0, y: -20 },   // 0: DOWN (mouth level pointing down)
  { x: 18, y: -26 },  // 1: DOWN_RIGHT
  { x: 24, y: -28 },  // 2: RIGHT (front of face at head height)
  { x: 18, y: -32 },  // 3: UP_RIGHT
  { x: 0, y: -34 },   // 4: UP (above head pointing away)
  { x: -18, y: -32 }, // 5: UP_LEFT
  { x: -24, y: -28 }, // 6: LEFT (front of face at head height)
  { x: -18, y: -26 }, // 7: DOWN_LEFT
];

// PMD 8-Direction angle mapping (radians, where 0 = Right, PI/2 = Down, PI = Left, -PI/2 = Up)
// [0: DOWN, 1: DOWN_RIGHT, 2: RIGHT, 3: UP_RIGHT, 4: UP, 5: UP_LEFT, 6: LEFT, 7: DOWN_LEFT]
const PMD_DIR_ANGLES = [
  Math.PI / 2,        // 0: DOWN
  Math.PI / 4,        // 1: DOWN_RIGHT
  0,                  // 2: RIGHT
  -Math.PI / 4,       // 3: UP_RIGHT
  -Math.PI / 2,       // 4: UP
  -3 * Math.PI / 4,   // 5: UP_LEFT
  Math.PI,            // 6: LEFT
  3 * Math.PI / 4,    // 7: DOWN_LEFT
];

export class PokemonEntity {
  constructor({
    data,
    isPlayer = true,
    initialX = 300,
    initialY = 300,
    initialFacing = null,
    arena,
    particleSystem,
    projectileSystem,
    engine = null,
    onLog,
    onStateChange,
  }) {
    this.data = data;
    this.isPlayer = isPlayer;
    this.arena = arena;
    this.particleSystem = particleSystem;
    this.projectileSystem = projectileSystem;
    this.engine = engine;
    this.onLog = onLog || (() => {});
    this.onStateChange = onStateChange || (() => {});

    // Overworld Sprite Animator (PMD 8-Directions + Full Actions)
    this.sprite = new OverworldSprite(data.id, data.isShiny);
    if (initialFacing) {
      this.sprite.setDirection(initialFacing);
    } else {
      this.sprite.setDirection(isPlayer ? 'right' : 'left');
    }
    this.scale = 1.32; // Calibrated visual scale: impactful yet balanced in arena
    
    // Position & Physics
    this.x = initialX;
    this.y = initialY;
    this.baseX = initialX;
    this.baseY = initialY;
    this.vx = 0;
    this.vy = 0;
    this.radius = 21; // Calibrated collision radius
    this.elevation = 0;
    this.target = null; // Opponent entity

    // Flying / Levitating Pokémon detection
    const fmtId = String(data.id || data.speciesId || '001').padStart(3, '0');
    const t1 = String(data.type1 || data.species?.type1 || '').toLowerCase();
    const t2 = String(data.type2 || data.species?.type2 || '').toLowerCase();
    const flyingSpeciesIds = ['012', '015', '041', '042', '049', '092', '093', '094', '144', '145', '146', '149', '150', '151'];
    this.isFlying = t1 === 'flying' || t2 === 'flying' || flyingSpeciesIds.includes(fmtId);

    // Unique Entity ID
    this.id = `${data.id}_${isPlayer ? 'player' : 'enemy'}_${Math.floor(Math.random() * 1000)}`;

    // Stance: 'offensive' | 'defensive'
    this.stance = isPlayer ? 'offensive' : 'offensive';

    // MMO Attributes & Stats (PokéMMO authentic formula)
    this.level = data.level || 50;
    this.nature = data.nature || 'Hardy';
    this.ivs = data.ivs || { hp: 31, atk: 31, def: 31, spAtk: 31, spDef: 31, speed: 31 };
    this.evs = data.evs || { hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, speed: 0 };
    this.baseSpeed = data.stats.speed || 100;
    this.dodgeCooldownMax = calculateDodgeCooldown(this.baseSpeed);
    this.dodgeCooldown = 0;
    this.dodgeTimer = 0;

    // Knockback, Push, Wall Collision & Recoil
    this.recoilTimer = 0;
    this.isKnockedBack = false;
    this.knockbackTimer = 0;
    this.knockbackAttacker = null;
    this.hitFreezeTimer = 0; // Subtle hit freeze (impact stop) on taking damage

    // Stun / Dizziness (Tontura 1.5s when pushed into arena wall below 30% HP)
    this.isDizzy = false;
    this.dizzyTimer = 0;

    // Stats
    this.maxHp = data.stats.hp;
    this.currentHp = typeof data.currentHp === 'number' ? Math.max(0, Math.min(this.maxHp, data.currentHp)) : this.maxHp;
    this.isFainted = this.currentHp <= 0;

    // Fast Dynamic Action Cadence & Cooldowns
    this.actionCooldown = 0;
    this.physicalAttackTimer = 0;
    this.physicalCooldown = 0;

    // Defense & i-frames (Authentic Defensive Moves: Withdraw, Fire Spin, Light Screen, Barrier)
    this.isGuarding = false;
    this.guardShieldPower = 0.75; // 75% damage mitigation
    this.iframesTimer = 0; // 0.2s invulnerability post impact
    this.defensiveMove = data.defensiveMove || null;
    this.defenseCooldown = 0;
    this.defenseDurationTimer = 0;

    // Continuous Beam Channeling (Rooted during duration; cancelled on movement)
    this.isChannelingBeam = false;
    this.channelingTimer = 0;
    this.channelingSkill = null;
    this.channelingTarget = null;
    this.activeBeam = null;
    this.beamLockTimer = 0; // Trava total de movimento ao ser atingido por feixe contínuo
    this.hitStunTimer = 0; // Trava de dano contínuo (impede movimento enquanto leva dano)
    this.beamPushDirX = 0;
    this.beamPushDirY = 0;
    this.beamPushSpeed = 0;

    // Disable Move Mechanic (Anulação temporária de golpe)
    this.disabledSkill = null;
    this.disabledSkillTimer = 0;
    this.lastUsedSkill = null;
    this.lastUsedSkillIndex = -1;

    // Status Effects (Burn, Paralysis, Freeze, Poison, Sleep, Confusion)
    this.statusEffect = null;

    // In-Battle Stat Stages (-6 to +6)
    this.statStages = {
      atk: 0,
      def: 0,
      spAtk: 0,
      spDef: 0,
      speed: 0,
    };

    // Moves (Authentic moves of this Pokémon, up to 4 moves)
    const spd = (data.stats && data.stats.speed) || 50;
    const initMove = (m, idx) => ({
      ...m,
      cooldown: (typeof m.cooldown === 'number' && m.cooldown > 0) ? m.cooldown : calculateMoveCooldown(m.power, spd),
      currentCooldown: 0,
      index: idx,
    });
    this.moves = (Array.isArray(data.moves) && data.moves.length > 0 ? data.moves : (data.skills || [])).map(initMove);
    this.skills = this.moves;
    // Dedicated Melee Basic Attack [Espaço]
    this.physicalAttack = {
      name: 'Ataque Básico',
      type: 'Normal',
      power: 28,
      cooldown: 0.8,
      sound: '/assets/audio/se/anim/Blow1.ogg',
    };
    this.defenseCooldownMax = 3.5;

    // Action State Machine:
    // 'moving' | 'dashing_strike' | 'casting_skill' | 'guarding' | 'defending' | 'celebrating' | 'hurt' | 'fainted'
    this.state = 'moving';
    this.stateTimer = 0;
    this.currentAction = null;

    // Visuals & Effects (After-Images Ghost Trail & Particles)
    this.hurtFlashTimer = 0;
    this.dustTimer = 0;
    this.auraPulse = 0;
    this.afterImages = [];
    this.afterImageTimer = 0;
    this.quiverDanceTimer = 0; // Dança ritmada tremendo o sprite em Quiver Dance

    // Double Team Illusory Clone (2.0s duration)
    this.doubleTeamCloneTimer = 0;
    this.doubleTeamCloneOffsetX = 26;
    this.doubleTeamCloneOffsetY = 4;

    // Dynamic Scale Modifier (Growth / Minimize)
    this.scaleMultiplier = 1.0;
    this.targetScaleMultiplier = 1.0;

    // Dynamic wandering & orbiting
    this.orbitAngle = isPlayer ? Math.PI : 0;
    this.orbitDirection = isPlayer ? 1 : -1;
    this.changeOrbitTimer = 0;

    // Melee attack tracking & Anime recall progress
    this.currentDashingSkill = null;
    this.dashDirX = 0;
    this.dashDirY = 0;
    this.dashSpeed = 920;
    this.dashStartX = 0;
    this.dashStartY = 0;
    this.jumpOffset = 0; // Vertical offset for parabolic jumps (Steamroller, Bounce)
    this.twisterSpinTimer = 0;
    this.twisterSpinTotal = 0;
    this.spinAngle = 0;
    this.isRetreatingToOrigin = false;
    this.retreatStartX = 0;
    this.retreatStartY = 0;
    this.retreatTargetX = 0;
    this.retreatTargetY = 0;
    this.retreatTimer = 0;
    this.retreatDuration = 0.35;
    this.hasReactedToCurrentDash = false;
    this.recallProgress = 0;
    this.feintPhase = 0; // 0: none, 1: deceptive divergent dash, 2: direct surprise strike

    // Stance & Guard Stamina System (Calculated from stats def, spDef, speed)
    this.stance = 'offensive'; // 'offensive' | 'defensive'
    this.isGuarding = false;
    const defStat = (data.stats && data.stats.def) || 50;
    const spDefStat = (data.stats && data.stats.spDef) || 50;
    const speedStat = (data.stats && data.stats.speed) || 50;

    // Guard meter: Base 100 + 40% of (Def + SpDef)
    this.guardMeterMax = Math.round(100 + (defStat + spDefStat) * 0.4);
    this.guardMeter = this.guardMeterMax;
    // Drain rate while in defensive stance: 18 points / sec (~6 to 9 seconds max continuous guard)
    this.guardDrainRate = 18;
    // Recovery rate while in offensive stance: Base 16 + 12% of Speed / sec
    this.guardRecoveryRate = Math.round(16 + speedStat * 0.12);
    // Exhaustion cooldown timer (when guard breaks)
    this.guardExhaustedTimer = 0;
    // Hit deflection flash timer
    this.guardBlockFlashTimer = 0;
  }

  setOpponent(opponent) {
    this.target = opponent;
  }

  // Target center of mass (chest / torso) for incoming projectile, beam and impact sprite targeting
  getHitCenter() {
    const hoverY = this.isFlying ? Math.sin(this.auraPulse * 2.8) * 4 - 8 : 0;
    const fmtId = String(this.data?.id || this.data?.speciesId || '001').padStart(3, '0');

    // Species specific calibrated torso center elevations (negative is upward from ground anchor)
    // PMD sprites visible non-transparent centers sit around -12px (small) to -20px (large)
    const TALL_SPECIES = ['003', '006', '009', '094', '130', '143', '149', '150'];
    const SMALL_SPECIES = ['001', '004', '007', '025', '133', '172'];

    let elevation = -16;
    if (TALL_SPECIES.includes(fmtId)) {
      elevation = -20;
    } else if (SMALL_SPECIES.includes(fmtId)) {
      elevation = -12;
    }

    return {
      x: Math.round(this.x),
      y: Math.round(this.y + hoverY + elevation),
    };
  }

  // Calculate precise attack origin (mouth, cannons, hands) based on facing direction, species and hover
  getAttackOrigin() {
    const dir = this.sprite ? this.sprite.currentDirection : 2;
    const hoverY = this.isFlying ? Math.sin(this.auraPulse * 2.8) * 5 - 10 : 0;
    const fmtId = String(this.data?.id || this.data?.speciesId || '001').padStart(3, '0');
    const table = SPECIES_ATTACK_ORIGINS[fmtId] || DEFAULT_ATTACK_ORIGINS;
    const offset = table[dir] || table[2] || { x: 22, y: -30 };

    return {
      x: Math.round(this.x + offset.x),
      y: Math.round(this.y + hoverY + offset.y),
    };
  }

  // Calculate continuous beam / laser emission point strictly in front of the caster at head height
  getBeamOrigin(targetX = null, targetY = null) {
    const hoverY = this.isFlying ? Math.sin(this.auraPulse * 2.8) * 5 - 10 : 0;
    const fmtId = String(this.data?.id || this.data?.speciesId || '001').padStart(3, '0');
    const TALL_SPECIES = ['003', '006', '009', '094', '130', '143', '144', '145', '146', '149', '150'];
    const SMALL_SPECIES = ['001', '004', '007', '025', '133', '172'];

    // Calibrated head height elevation (negative is upward from ground anchor)
    // PMD sprites visible non-transparent head/mouth sits around ~60% of total sprite height above feet
    let headOffsetY = -58;
    if (this.sprite && typeof this.sprite.getAnimConfig === 'function') {
      const cfg = this.sprite.getAnimConfig(this.sprite.currentAnimation || 'Idle');
      const fh = cfg?.frameHeight || 48;
      const effectiveScale = this.scale * (this.scaleMultiplier || 1.0);
      headOffsetY = -Math.round(fh * effectiveScale * 0.60);
    } else if (TALL_SPECIES.includes(fmtId) || this.radius > 22) {
      headOffsetY = -72;
    } else if (SMALL_SPECIES.includes(fmtId) || this.radius < 16) {
      headOffsetY = -48;
    }

    const headX = this.x;
    const headY = this.y + hoverY + headOffsetY;

    // Determine directional vector toward target
    let angle;
    if (targetX != null && targetY != null) {
      angle = Math.atan2(targetY - headY, targetX - headX);
    } else if (this.target && !this.target.isFainted) {
      const tPos = typeof this.target.getHitCenter === 'function'
        ? this.target.getHitCenter()
        : { x: this.target.x, y: this.target.y - 24 };
      angle = Math.atan2(tPos.y - headY, tPos.x - headX);
    } else {
      const dir = this.sprite ? this.sprite.currentDirection : 2;
      angle = PMD_DIR_ANGLES[dir] ?? 0;
    }

    // Project forward from the head in the firing direction so the beam originates cleanly in front of the Pokémon
    const forwardDist = Math.max(18, Math.min(32, this.radius * 0.95 + 8));

    return {
      x: Math.round(headX + Math.cos(angle) * forwardDist),
      y: Math.round(headY + Math.sin(angle) * (forwardDist * 0.65)),
    };
  }

  executeDefenseAction() {
    if (this.isFainted || this.state === 'celebrating' || this.isDizzy || this.defenseCooldown > 0) return false;

    if (this.isChannelingBeam) {
      this.cancelBeamChanneling('defend');
    }

    // Cooldown baixo com redução baseada no IV de Sp. Def (0 a 31)
    const spDefIV = this.data?.ivs?.spDef != null ? Number(this.data.ivs.spDef) : 15;
    const cdReduction = (spDefIV / 31) * 1.5;
    this.defenseCooldownMax = Math.max(1.8, 3.8 - cdReduction);
    this.defenseCooldown = this.defenseCooldownMax;

    this.state = 'defending';
    this.defenseDurationTimer = 1.5; // Imobilização exata de 1.5s
    this.isGuarding = true;
    this.guardShieldPower = 0.70; // 70% de redução de dano recebido
    this.vx = 0;
    this.vy = 0;

    // Encarar o oponente
    if (this.target && !this.target.isFainted) {
      this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
    }
    this.sprite.setAnimation('Charge', true);

    soundManager.play('/assets/audio/se/anim/Thunder2.ogg', 0.85);
    this.onLog(
      `🛡️ <strong>${this.data.name}</strong> assumiu <strong>Defesa</strong>! (-70% dano por 1.5s)`,
      'defensive'
    );

    this.onStateChange();
    return true;
  }

  setStance(newStance) {
    if (newStance === 'defensive') {
      return this.executeDefenseAction();
    }
    return true;
  }

  toggleStance() {
    return this.executeDefenseAction();
  }

  // Guard Break: Stamina depleted or shattered under heavy damage
  triggerGuardBreak() {
    this.guardMeter = 0;
    this.isGuarding = false;
    this.state = 'moving';
    this.stance = 'offensive';
    this.guardExhaustedTimer = 4.5; // Locked out of guard for 4.5s
    this.isDizzy = true;
    this.dizzyTimer = 1.6; // Stunned for 1.6s
    this.sprite.setAnimation('Hurt', false);

    if (soundManager.playGuardBreak) {
      soundManager.playGuardBreak();
    } else {
      soundManager.playHit(true, false);
    }

    this.particleSystem.spawnPixelBurst(this.x, this.y - 10, '#FF1744', 28, 160, 0.6, 4);
    this.particleSystem.spawnShockwave(this.x, this.y, 65, '#FF1744', 0.35);
    this.particleSystem.addFloatingText(this.x, this.y - 20, 'QUEBRA DE GUARDA!', 'blocked', true);
    this.onLog(`💥 <strong>${this.data.name}</strong> teve sua guarda rompida e ficou atordoado!`, 'system');
    if (this.arena && this.arena.triggerScreenShake) {
      this.arena.triggerScreenShake(12);
    }
    this.onStateChange();
  }

  // Absorb damage into Guard Meter
  absorbGuardHit(absorbedAmount) {
    this.guardBlockFlashTimer = 0.22;
    const staminaLoss = Math.max(8, Math.round(absorbedAmount * 0.65));
    this.guardMeter = Math.max(0, this.guardMeter - staminaLoss);
    if (this.guardMeter <= 0) {
      this.triggerGuardBreak();
    }
    this.onStateChange();
  }

  // Apply persistent status effect (Burn, Paralysis, Freeze, Poison)
  applyStatus(type, duration = 3.5) {
    if (this.isFainted || (this.statusEffect && this.statusEffect.type === type)) return;
    this.statusEffect = { type, timer: duration, tickTimer: 0.7 };

    let icon = '⚡';
    let label = 'PARALISADO!';
    if (type === 'burn') { icon = '🔥'; label = 'QUEIMADO!'; }
    else if (type === 'poison') { icon = '🟣'; label = 'ENVENENADO!'; }
    else if (type === 'freeze') { icon = '❄️'; label = 'CONGELADO!'; }

    this.particleSystem.addFloatingText(this.x, this.y - 15, label, type, true);
    this.onLog(`${icon} <strong>${this.data.name}</strong> ficou <strong>${label}</strong>!`, type);
    this.onStateChange();
  }

  // Direct status tick damage (bypasses i-frames)
  takeDirectDamage(amount, label, type) {
    if (this.isFainted) return;
    this.currentHp = Math.max(0, this.currentHp - amount);
    this.particleSystem.addFloatingText(this.x, this.y - 14, label, type, false);
    this.onStateChange();
    if (this.currentHp <= 0) {
      this.faint();
    }
  }

  // Twister Knockup & Spin: Lança o alvo ao ar girando em espiral com o ciclone
  applyTwisterKnockup(duration = 0.85) {
    if (this.isFainted) return;
    this.twisterSpinTimer = duration;
    this.twisterSpinTotal = duration;
    this.vx = 0;
    this.vy = 0;
    this.onLog(`🌪️ <strong>${this.data.name}</strong> foi arremessado no ar girando pelo ciclone!`, 'dragon');
    this.onStateChange();
  }

  update(dt) {
    if (this.isFainted) {
      this.sprite.update(dt, false);
      return;
    }

    this.auraPulse += dt * 4;

    if (this.sprite) {
      this.sprite.isHurtLocked = (this.hitStunTimer > 0 || this.beamLockTimer > 0);
    }

    if (this.hurtFlashTimer > 0) {
      this.hurtFlashTimer -= dt;
    }

    // Always smoothly update & fade existing after-images even during hit freeze
    for (let i = this.afterImages.length - 1; i >= 0; i--) {
      const ai = this.afterImages[i];
      ai.time += dt;
      if (ai.time >= ai.duration) {
        this.afterImages.splice(i, 1);
      } else {
        ai.alpha = (1 - ai.time / ai.duration) * 0.5;
      }
    }

    // Subtle Hit Freeze: freeze animation and position for ~70-90ms on heavy impact
    if (this.hitFreezeTimer > 0) {
      this.hitFreezeTimer = Math.max(0, (this.hitFreezeTimer || 0) - dt);
      return;
    }

    if (this.actionCooldown > 0) {
      this.actionCooldown -= dt;
    }

    if (this.dodgeCooldown > 0) {
      this.dodgeCooldown = Math.max(0, this.dodgeCooldown - dt);
    }

    if (this.recoilTimer > 0) {
      this.recoilTimer = Math.max(0, this.recoilTimer - dt);
    }

    if (this.beamLockTimer > 0) {
      this.beamLockTimer = Math.max(0, this.beamLockTimer - dt);
      // Continuous push sustained by the high-pressure beam
      if (this.beamPushSpeed > 0) {
        this.vx = this.beamPushDirX * this.beamPushSpeed * Math.max(0.35, this.beamLockTimer / 0.7);
        this.vy = this.beamPushDirY * this.beamPushSpeed * Math.max(0.35, this.beamLockTimer / 0.7);
      }
      if (this.sprite.currentAnimation !== 'Hurt' && !this.isFainted) {
        this.sprite.setAnimation('Hurt', false);
      }
      if (this.beamLockTimer <= 0) {
        this.beamLockTimer = 0;
        this.beamPushSpeed = 0;
        if (this.state === 'hurt' && this.hitStunTimer <= 0) {
          this.state = 'moving';
        }
        if (!this.isDizzy && !this.isFainted && this.hitStunTimer <= 0) {
          this.sprite.setAnimation('Idle', true);
        }
      }
    }

    // Hit Stun Timer: mantém pokémon em estado 'tomando dano' sem permitir movimentação durante golpes contínuos
    if (this.hitStunTimer > 0) {
      this.hitStunTimer = Math.max(0, this.hitStunTimer - dt);
      this.vx *= 0.86;
      this.vy *= 0.86;
      if (Math.hypot(this.vx, this.vy) < 6) {
        this.vx = 0;
        this.vy = 0;
      }
      if (this.sprite.currentAnimation !== 'Hurt' && !this.isFainted) {
        this.sprite.setAnimation('Hurt', false);
      }
    }

    // Auto-recuperação garantida: nunca deixa o Pokémon travado em 'hurt' após o término do hit stun
    if (this.hitStunTimer <= 0 && this.beamLockTimer <= 0 && this.state === 'hurt') {
      this.hitStunTimer = 0;
      this.state = 'moving';
      if (!this.isDizzy && !this.isFainted && !this.isGuarding) {
        this.sprite.setAnimation('Idle', true);
      }
    }

    // Disable Move Timer Countdown
    if (this.disabledSkillTimer > 0) {
      this.disabledSkillTimer = Math.max(0, this.disabledSkillTimer - dt);
      if (this.disabledSkillTimer <= 0) {
        this.disabledSkillTimer = 0;
        if (this.disabledSkill) {
          this.disabledSkill.isDisabled = false;
          this.onLog(`✨ <strong>${this.data.name}</strong> pode usar <strong>${this.disabledSkill.name}</strong> novamente!`, 'system');
          this.disabledSkill = null;
        }
        this.onStateChange();
      }
    }

    if (this.knockbackTimer > 0) {
      this.knockbackTimer = Math.max(0, this.knockbackTimer - dt);
      this.vx *= 0.91;
      this.vy *= 0.91;
      if (this.knockbackTimer <= 0) {
        this.isKnockedBack = false;
        this.knockbackAttacker = null;
      }
    }

    if (this.isDizzy) {
      this.dizzyTimer -= dt;
      this.vx = 0;
      this.vy = 0;
      if (this.dizzyTimer <= 0) {
        this.isDizzy = false;
        this.dizzyTimer = 0;
        this.sprite.setAnimation('Idle', true);
        this.onLog(`✨ <strong>${this.data.name}</strong> recuperou a consciência da tontura!`, 'system');
        this.onStateChange();
      }
    }

    // Twister Knockup & Spin: Joga o Pokémon no ar girando com o ciclone
    if (this.twisterSpinTimer > 0) {
      this.twisterSpinTimer = Math.max(0, this.twisterSpinTimer - dt);
      const prog = 1.0 - (this.twisterSpinTimer / (this.twisterSpinTotal || 0.85));
      // Arco parabólico alto no ar (~65px)
      this.jumpOffset = -Math.sin(prog * Math.PI) * 65;
      // Gira 3 voltas completas (1080°) enquanto sobe e desce
      this.spinAngle = prog * Math.PI * 6;
      this.vx = 0;
      this.vy = 0;

      // Partículas de vento do ciclone girando junto
      if (Math.random() < 0.4 && this.particleSystem) {
        this.particleSystem.spawnPixelBurst(this.x, this.y + this.jumpOffset - 8, '#38BDF8', 2, 45, 0.2, 2);
      }

      if (this.twisterSpinTimer <= 0) {
        this.jumpOffset = 0;
        this.spinAngle = 0;
        this.twisterSpinTimer = 0;
        if (this.particleSystem) {
          this.particleSystem.spawnShockwave(this.x, this.y, 45, '#38BDF8', 0.3);
          this.particleSystem.spawnPixelBurst(this.x, this.y, '#94A3B8', 12, 80, 0.35, 2.5);
        }
        soundManager.playPhysicalStrike();
        if (this.arena && this.arena.triggerScreenShake) {
          this.arena.triggerScreenShake(6);
        }
        this.onStateChange();
      }
    }

    if (this.iframesTimer > 0) {
      this.iframesTimer = Math.max(0, this.iframesTimer - dt);
    }

    // Status effect countdown & ticks
    if (this.statusEffect) {
      this.statusEffect.timer -= dt;
      this.statusEffect.tickTimer -= dt;

      if (this.statusEffect.tickTimer <= 0) {
        this.statusEffect.tickTimer = 0.7;
        if (this.statusEffect.type === 'burn') {
          this.takeDirectDamage(7, '🔥 -7', 'fire');
          this.particleSystem.spawnFlame(this.x, this.y, 3);
        } else if (this.statusEffect.type === 'poison') {
          this.takeDirectDamage(8, '🟣 -8', 'poison');
          if (this.particleSystem && typeof this.particleSystem.spawnPoisonBurst === 'function') {
            this.particleSystem.spawnPoisonBurst(this.x, this.y - 12, '#AA00FF', 0.40);
          }
        }
      }

      if (this.statusEffect.type === 'freeze') {
        this.vx = 0;
        this.vy = 0;
      }

      if (this.statusEffect.timer <= 0) {
        this.statusEffect = null;
        this.onStateChange();
      }
    }

    // Guard Exhaustion Timer
    if (this.guardExhaustedTimer > 0) {
      this.guardExhaustedTimer = Math.max(0, this.guardExhaustedTimer - dt);
    }
    // Block Flash Timer
    if (this.guardBlockFlashTimer > 0) {
      this.guardBlockFlashTimer = Math.max(0, this.guardBlockFlashTimer - dt);
    }

    // Cooldown recovery: 0.85x if guarding, 1.0x otherwise
    const cdMult = this.isGuarding ? 0.85 : 1.0;
    for (const skill of this.skills) {
      if (skill.currentCooldown > 0) {
        skill.currentCooldown = Math.max(0, skill.currentCooldown - dt * cdMult);
      }
    }

    if (this.physicalCooldown > 0) {
      this.physicalCooldown = Math.max(0, this.physicalCooldown - dt * cdMult);
    }

    // Defense Cooldown countdown
    if (this.defenseCooldown > 0) {
      this.defenseCooldown = Math.max(0, this.defenseCooldown - dt);
    }

    if (this.quiverDanceTimer > 0) {
      this.quiverDanceTimer = Math.max(0, this.quiverDanceTimer - dt);
    }

    // Defending State duration (1.5s total immobilization facing enemy)
    if (this.state === 'defending') {
      this.defenseDurationTimer -= dt;
      this.vx = 0;
      this.vy = 0;
      // Pokémon com escudo ativo (especialmente inimigo) NÃO pode rotacionar para acompanhar o alvo
      if (this.defenseDurationTimer <= 0) {
        this.defenseDurationTimer = 0;
        this.state = 'moving';
        this.isGuarding = false;
        this.sprite.setAnimation('Idle', true);
        this.onStateChange();
      }
    }

    // Continuous Beam Channeling (Rooted during beam duration; cancelled on movement)
    if (this.isChannelingBeam) {
      this.vx = 0;
      this.vy = 0;
      this.channelingTimer -= dt;

      // Keep caster facing the opponent so mouth/cannons accurately align with the beam
      if (this.channelingTarget && !this.channelingTarget.isFainted) {
        this.sprite.faceTowards(this.channelingTarget.x, this.channelingTarget.y, this.x, this.y);
      }

      if (this.activeBeam) {
        const origin = this.getBeamOrigin(this.activeBeam.targetX, this.activeBeam.targetY);
        this.activeBeam.startX = origin.x;
        this.activeBeam.startY = origin.y;
        if (this.channelingTarget && !this.channelingTarget.isFainted) {
          const targetPos = typeof this.channelingTarget.getHitCenter === 'function'
            ? this.channelingTarget.getHitCenter()
            : { x: this.channelingTarget.x, y: this.channelingTarget.y - 36 };
          this.activeBeam.targetX = targetPos.x;
          this.activeBeam.targetY = targetPos.y;
        }
      }
      if (this.channelingTimer <= 0) {
        this.isChannelingBeam = false;
        this.activeBeam = null;
        this.channelingSkill = null;
        if (this.channelingTarget && this.channelingTarget.beamLockTimer > 0) {
          this.channelingTarget.beamLockTimer = 0.05;
        }
        this.channelingTarget = null;
        if (this.state === 'casting_skill') {
          this.state = 'moving';
        }
        this.sprite.setAnimation('Idle', true);
      }
    }

    if (this.state === 'celebrating') {
      this.vx = 0;
      this.vy = 0;
    }

    if (this.dodgeTimer > 0) {
      this.dodgeTimer -= dt;
      this.vx *= 0.88;
      this.vy *= 0.88;
      if (this.dodgeTimer <= 0) {
        this.dodgeTimer = 0;
        this.vx = 0;
        this.vy = 0;
        // Turn immediately towards opponent upon dodge completion (e.g. after phasing behind)
        if (this.target && !this.target.isFainted && !this.isGuarding) {
          this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
        }
      }
    }

    // High-speed After-Image trail generation (Investidas com rastros ofensivos apenas)
    if (this.state === 'dashing_strike') {
      this.afterImageTimer += dt;
      if (this.afterImageTimer >= 0.04) {
        this.afterImageTimer = 0;
        const color = this.currentDashingSkill?.color || this.currentAction?.color || (this.isPlayer ? '#38BDF8' : '#CBD5E1');
        this.afterImages.push({
          x: this.x,
          y: this.y,
          color,
          alpha: 0.5,
          duration: 0.16,
          time: 0,
        });
      }
    }

    // Double Team clone timer
    if (this.doubleTeamCloneTimer > 0) {
      this.doubleTeamCloneTimer = Math.max(0, this.doubleTeamCloneTimer - dt);
    }

    // Smoothly interpolate scale multiplier (Growth / Minimize)
    if (Math.abs(this.scaleMultiplier - this.targetScaleMultiplier) > 0.005) {
      this.scaleMultiplier += (this.targetScaleMultiplier - this.scaleMultiplier) * Math.min(1.0, dt * 6.0);
    } else {
      this.scaleMultiplier = this.targetScaleMultiplier;
    }

    // State Machine
    switch (this.state) {
      case 'dashing_strike':
        this.updateDashingStrike(dt);
        break;

      case 'casting_skill':
        this.updateCastingSkill(dt);
        break;
    }

    // Retreat to Origin Physics (Steamroller Return Jump & U-turn Retreat)
    if (this.isRetreatingToOrigin) {
      this.retreatTimer += dt;
      const progress = Math.min(1.0, this.retreatTimer / (this.retreatDuration || 0.35));
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      this.x = this.retreatStartX + (this.retreatTargetX - this.retreatStartX) * ease;
      this.y = this.retreatStartY + (this.retreatTargetY - this.retreatStartY) * ease;

      if (this.retreatIsParabolic) {
        // High parabolic leap on return
        this.jumpOffset = -Math.sin(progress * Math.PI) * 45;
      } else {
        // U-turn ground glide with afterimages
        this.jumpOffset = 0;
        if (Math.random() < 0.35) {
          this.particleSystem.spawnDust(this.x, this.y + 10, 1);
        }
      }

      if (progress >= 1.0) {
        this.isRetreatingToOrigin = false;
        this.jumpOffset = 0;
        this.vx = 0;
        this.vy = 0;
      }
    } else {
      // Standard physics integration
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    }

    // Keep entity strictly inside stadium ellipse and resolve obstacle collisions
    this.arena.resolveCollisions(this);

    // Sprite facing & step animation
    const speed = Math.hypot(this.vx, this.vy);
    const isMoving = speed > 10;
    // Escudo travando rotação aplica-se EXCLUSIVAMENTE ao inimigo com escudo ativo
    const isEnemyShieldLocked = !this.isPlayer && (this.isGuarding || this.state === 'defending');

    if (!isEnemyShieldLocked && this.hitStunTimer <= 0 && this.beamLockTimer <= 0) {
      if (this.recoilTimer > 0 || this.isKnockedBack || this.state === 'dashing_strike') {
        // Strictly maintain eye contact with opponent during recoil, push/knockback, and dashing strikes!
        if (this.target && !this.target.isFainted) {
          this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
        }
      } else if (this.isDizzy) {
        if (this.target && !this.target.isFainted) {
          this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
        }
      } else if (isMoving) {
        this.sprite.setDirectionFromVector(this.vx, this.vy);
      } else if (this.target && !this.target.isFainted) {
        this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
      }
    }

    if (this.sprite) {
      if (isMoving && !this.isDizzy) {
        // Synchronize step cycle with ground travel speed to prevent foot-sliding/skating
        this.sprite.animSpeed = Math.max(1.0, Math.min(2.1, speed / 105));
      } else {
        this.sprite.animSpeed = 1.0;
      }
    }
    this.sprite.update(dt, isMoving && !this.isDizzy);

    // Dynamic Dust Particles on running
    if (speed > 60) {
      this.dustTimer += dt;
      if (this.dustTimer > 0.08) {
        this.dustTimer = 0;
        this.particleSystem.spawnDust(this.x, this.y + 16, 2);
      }
    }
  }

  // Manual 8-Direction Movement (Player WASD / Arrow Keys)
  moveManual(dirX, dirY, dt) {
    if (this.isFainted || this.state === 'celebrating') return;
    if (this.isDizzy) {
      this.vx = 0;
      this.vy = 0;
      return;
    }
    if (this.hitStunTimer > 0) return; // Imobilizado apenas durante a janela ativa de dano contínuo!
    if (this.dodgeTimer > 0) return; // Allow hop dash velocity to play through without cancellation
    if (this.beamLockTimer > 0) return; // Trava total de movimento ao ser atingido por feixe contínuo!
    if (this.isKnockedBack || this.knockbackTimer > 0 || this.recoilTimer > 0) return; // Allow knockback & recoil slide to play through without cancellation!
    if (this.statusEffect && this.statusEffect.type === 'freeze') {
      this.vx = 0;
      this.vy = 0;
      return;
    }

    // Se o estado estava em 'hurt' e o stun encerrou, recupera para 'moving' imediatamente ao receber input
    if (this.state === 'hurt') {
      this.state = 'moving';
    }

    // If channeling a beam: pressing movement cancels the beam!
    if (this.isChannelingBeam) {
      if (dirX !== 0 || dirY !== 0) {
        this.cancelBeamChanneling('movement');
      } else {
        return; // Remain completely immobile while channeling
      }
    }

    if (this.state === 'dashing_strike' || this.state === 'casting_skill' || this.state === 'defending') return;

    if (dirX !== 0 || dirY !== 0) {
      this.state = 'moving';
      let speedMult = this.stance === 'offensive' ? 1.10 : 0.95;
      if (this.statusEffect && this.statusEffect.type === 'paralysis') {
        speedMult *= 0.6; // Paralysis slows movement
      }
      // Stat Stage speed multiplier (Gen 5/6 standards: -2 = 0.5x, -1 = 0.67x, +1 = 1.5x, +2 = 2.0x)
      const spdStage = (this.statStages && this.statStages.speed) || 0;
      const spdStageMult = spdStage >= 0 ? (2 + spdStage) / 2 : 2 / (2 - spdStage);
      const effectiveSpeedStat = this.data.stats.speed * spdStageMult;
      // Dynamic agile base speed scaled by Speed Stat Stages
      const baseSpeed = (165 + effectiveSpeedStat * 0.65) * speedMult;
      const targetVx = dirX * baseSpeed;
      const targetVy = dirY * baseSpeed;

      // Silky-smooth analog acceleration with natural momentum (no rigid snapping)
      const accelRate = 14;
      const t = 1 - Math.exp(-accelRate * dt);
      this.vx += (targetVx - this.vx) * t;
      this.vy += (targetVy - this.vy) * t;
    } else {
      // Smooth natural deceleration / organic glide to stop
      const friction = Math.exp(-13 * dt);
      this.vx *= friction;
      this.vy *= friction;
      if (Math.hypot(this.vx, this.vy) < 6) {
        this.vx = 0;
        this.vy = 0;
      }
    }
  }

  // Cancel beam channeling immediately if caster moves or gets interrupted
  cancelBeamChanneling(reason = 'movement') {
    if (!this.isChannelingBeam) return;
    this.isChannelingBeam = false;
    this.channelingTimer = 0;

    if (this.activeBeam) {
      this.particleSystem.removeBeam(this.activeBeam);
      this.activeBeam = null;
    }
    if (this.channelingTarget && this.channelingTarget.beamLockTimer > 0) {
      this.channelingTarget.beamLockTimer = 0.05;
    }
    this.channelingSkill = null;
    this.channelingTarget = null;

    if (this.state === 'casting_skill') {
      this.state = 'moving';
    }
    this.sprite.setAnimation('Idle', true);

    if (reason === 'movement') {
      this.onLog(`⚠️ <strong>${this.data.name}</strong> moveu-se e interrompeu o feixe de energia!`, 'system');
      this.particleSystem.spawnPixelBurst(this.x, this.y, '#90A4AE', 15, 120, 0.4, 3);
    }
  }

  // Active Defensive Move (Recolher, Giro de Fogo, Tela de Luz, Barreira Psíquica, etc.)
  executeDefensiveMove() {
    if (this.isFainted || this.state === 'celebrating' || this.isDizzy || this.defenseCooldown > 0) return false;

    if (this.isChannelingBeam) {
      this.cancelBeamChanneling('defend');
    }

    const defMove = this.defensiveMove || {
      name: 'Proteção',
      duration: 1.5,
      cooldown: 4.5,
      anim: 'Charge',
      shieldType: 'psychic_barrier',
      mitigation: 0.8,
      sound: '/assets/audio/se/anim/Thunder2.ogg',
      color: '#00E5FF',
    };

    this.state = 'defending';
    this.defenseDurationTimer = defMove.duration || 1.6;
    this.defenseCooldown = defMove.cooldown || 4.5;
    this.isGuarding = true;
    this.guardShieldPower = defMove.mitigation || 0.8;
    this.vx = 0;
    this.vy = 0;

    // Use specific authentic defensive animation (e.g. 'Withdraw' for Blastoise, 'Charge' for others)
    this.sprite.setAnimation(defMove.anim || 'Charge', true);

    soundManager.play(defMove.sound || '/assets/audio/se/anim/Wind1.ogg');
    this.onLog(
      `🛡️ <strong>${this.data.name}</strong> ativou <strong>${defMove.name}</strong>! (-${Math.round(this.guardShieldPower * 100)}% Dano)`,
      'defensive'
    );

    // Initial activation particle burst
    this.particleSystem.spawnPixelBurst(this.x, this.y, defMove.color || '#00E5FF', 22, 140, 0.5, 4);

    this.onStateChange();
    return true;
  }

  // Stable Tactical Movement (For Enemy AI or Auto-Battle) - Eliminates random twirling
  updateTacticalAIMovement(dt) {
    if (!this.target || this.target.isFainted || this.isFainted || this.isDizzy || this.beamLockTimer > 0 || this.hitStunTimer > 0 || this.state === 'hurt' || this.state === 'celebrating' || this.isChannelingBeam || this.state === 'dashing_strike' || this.state === 'casting_skill' || this.state === 'defending' || this.isGuarding) return;
    if (this.isDizzy) {
      this.vx = 0;
      this.vy = 0;
      return;
    }
    if (this.isKnockedBack || this.knockbackTimer > 0 || this.recoilTimer > 0) return; // Allow knockback & recoil slide to play through!
    if (this.statusEffect && this.statusEffect.type === 'freeze') {
      this.vx = 0;
      this.vy = 0;
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;

    // Reset reaction flag once incoming dash ends
    if (!this.target || this.target.state !== 'dashing_strike') {
      this.hasReactedToCurrentDash = false;
    }

    // Reactive evasion: if opponent is dashing at this entity, chance to dodge sideways out of the trajectory!
    // Roll ONLY ONCE per incoming attack, scaled by Pokémon Speed stat (prevents rolling 60x/second!)
    if (this.target && this.target.state === 'dashing_strike' && dist < 240) {
      if (!this.hasReactedToCurrentDash) {
        this.hasReactedToCurrentDash = true; // Roll exactly once per dash!

        if (this.dodgeCooldown <= 0) {
          // Speed-based reaction probability:
          // Low speed (~40): ~10% chance
          // Average speed (~90): ~18% chance
          // High speed (~140): ~28% chance
          const speedStat = this.data?.stats?.speed || 80;
          const dodgeChance = Math.min(0.28, Math.max(0.10, speedStat / 500));

          if (Math.random() < dodgeChance) {
            const perpX = -ny;
            const perpY = nx;
            const side = Math.random() < 0.5 ? 1 : -1;
            this.performEvasiveDodge(perpX * side, perpY * side);
            return;
          }
        }
      }
    }

    // Desired combat spacing:
    // Offensive mode keeps close range (~160px); Defensive mode keeps distance (~270px)
    const idealDist = this.stance === 'offensive' ? 160 : 270;
    const distTolerance = 30;
    let speedMult = this.stance === 'offensive' ? 1.05 : 0.92;
    if (this.statusEffect && this.statusEffect.type === 'paralysis') {
      speedMult *= 0.6;
    }
    const spdStage = (this.statStages && this.statStages.speed) || 0;
    const spdStageMult = spdStage >= 0 ? (2 + spdStage) / 2 : 2 / (2 - spdStage);
    const effectiveSpeedStat = this.data.stats.speed * spdStageMult;
    // Dynamic agile AI speed scaled by Speed Stat Stages
    const baseSpeed = (150 + effectiveSpeedStat * 0.58) * speedMult;

    let targetVx = 0;
    let targetVy = 0;

    if (dist > idealDist + distTolerance) {
      // Approach steadily towards opponent
      targetVx = nx * baseSpeed;
      targetVy = ny * baseSpeed;
    } else if (dist < idealDist - distTolerance) {
      // Retreat smoothly straight back
      targetVx = -nx * baseSpeed * 0.75;
      targetVy = -ny * baseSpeed * 0.75;
    } else {
      // In the sweet spot: HOLD POSITION FIRMLY! No erratic circling!
      targetVx = 0;
      targetVy = 0;
    }

    // Gentle obstacle avoidance if walking towards a pillar
    if (this.arena && (targetVx !== 0 || targetVy !== 0)) {
      const aheadX = this.x + targetVx * dt * 3;
      const aheadY = this.y + targetVy * dt * 3;
      const obsHit = this.arena.checkObstacleCollision(aheadX, aheadY, this.radius + 10);
      if (obsHit.collided && obsHit.obstacle) {
        const toObsX = this.x - obsHit.obstacle.x;
        const toObsY = this.y - obsHit.obstacle.y;
        const toObsDist = Math.hypot(toObsX, toObsY) || 1;
        targetVx += (toObsX / toObsDist) * baseSpeed * 0.7;
        targetVy += (toObsY / toObsDist) * baseSpeed * 0.7;
      }
    }

    // Organic smooth momentum transition for AI movement
    if (targetVx === 0 && targetVy === 0) {
      const friction = Math.exp(-13 * dt);
      this.vx *= friction;
      this.vy *= friction;
      if (Math.hypot(this.vx, this.vy) < 6) {
        this.vx = 0;
        this.vy = 0;
      }
    } else {
      const accelRate = 12;
      const t = 1 - Math.exp(-accelRate * dt);
      this.vx += (targetVx - this.vx) * t;
      this.vy += (targetVy - this.vy) * t;
    }
  }

  // Active Evasive Dodge (8-Directional double-tap dash with speed hatching blur & phasing through opponent)
  performEvasiveDodge(dirX = 0, dirY = 0) {
    if (this.isFainted || this.state === 'celebrating' || this.dodgeCooldown > 0 || this.isDizzy || this.beamLockTimer > 0 || this.hitStunTimer > 0 || this.state === 'hurt') return false;

    if (this.isChannelingBeam) {
      this.cancelBeamChanneling('movement');
    }

    let dodgeX = dirX;
    let dodgeY = dirY;

    // If no direction passed, dash through/past the opponent or current facing direction
    if (dodgeX === 0 && dodgeY === 0) {
      if (this.target && !this.target.isFainted) {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy) || 1;
        dodgeX = dx / dist;
        dodgeY = dy / dist;
      } else {
        dodgeX = this.sprite.currentDirection === 2 ? 1 : -1;
        dodgeY = 0;
      }
    }

    const dodgeLen = Math.hypot(dodgeX, dodgeY) || 1;
    dodgeX /= dodgeLen;
    dodgeY /= dodgeLen;

    const dodgeSpd = 480; // Alcance ajustado e equilibrado para a arena (reduzido de 960)
    this.vx = dodgeX * dodgeSpd;
    this.vy = dodgeY * dodgeSpd;
    this.dodgeCooldown = this.dodgeCooldownMax; // Dynamic MMO cooldown based on Speed stat!
    this.dodgeTimer = 0.20; // Duração equilibrada de esquiva (reduzida de 0.28)

    this.sprite.setDirectionFromVector(dodgeX, dodgeY);
    this.sprite.setAnimation('Walk', true);

    // Smoke Dash VFX (Smoke VFX 1 substituindo as hachuras de velocidade)
    if (this.particleSystem && typeof this.particleSystem.spawnMoveSpriteAnim === 'function') {
      this.particleSystem.spawnMoveSpriteAnim(
        this.x - dodgeX * 8,
        this.y + 4 - dodgeY * 4,
        {
          file: 'vfx/smoke/smoke_vfx_01.png',
          cols: 9,
          rows: 1,
          startFrame: 0,
          endFrame: 8,
          fps: 26,
          scale: 1.15,
          noRotate: true,
          blendMode: 'source-over',
        },
        0
      );
    }

    this.particleSystem.spawnDust(this.x, this.y + 12, 6);
    this.particleSystem.spawnShockwave(this.x, this.y, 45, '#FFFFFF', 0.22);
    soundManager.playPhysicalStrike();

    this.onLog(`💨 <strong>${this.data.name}</strong> executou uma <strong>Esquiva Ágil</strong> em alta velocidade!`, 'dodge');
    this.onStateChange();
    return true;
  }

  // EXECUTE PHYSICAL MELEE ATTACK (Modo Ofensivo)
  executePhysicalAttack() {
    if (!this.target || this.isFainted || this.isDizzy || this.beamLockTimer > 0 || this.hitStunTimer > 0 || this.state === 'hurt' || this.state === 'dashing_strike' || this.state === 'casting_skill') return false;
    if (this.physicalCooldown > 0) return false;

    this.physicalCooldown = this.physicalAttack.cooldown || 0.8;
    this.state = 'dashing_strike';
    this.currentDashingSkill = null;
    this.stateTimer = 0.42;
    this.actionCooldown = 0.55;

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const dashSpd = 920;

    // LOCKED VECTOR: calculado uma única vez no início, impedindo correção de rota!
    this.dashDirX = dx / dist;
    this.dashDirY = dy / dist;
    this.dashSpeed = dashSpd;
    this.vx = this.dashDirX * this.dashSpeed;
    this.vy = this.dashDirY * this.dashSpeed;

    this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
    this.sprite.setAnimation('Attack', false);

    soundManager.playPhysicalStrike();
    this.particleSystem.spawnDust(this.x, this.y + 10, 6);
    this.onLog(
      `⚡ ${this.data.name} desferiu <strong>${this.physicalAttack.name}</strong> em investida!`,
      'physical'
    );
    this.onStateChange();
    return true;
  }

  updateDashingStrike(dt) {
    this.stateTimer -= dt;

    // FEINT ATTACK: Transição da Fase 1 (finta divergente) para Fase 2 (dash direto no inimigo)
    if (this.feintPhase === 1 && this.stateTimer <= 0) {
      if (this.target && !this.target.isFainted) {
        this.feintPhase = 2;
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy) || 1;
        this.dashDirX = dx / dist;
        this.dashDirY = dy / dist;
        this.dashSpeed = 1200; // Impulso repentino e ultrarrápido em direção ao oponente!
        this.vx = this.dashDirX * this.dashSpeed;
        this.vy = this.dashDirY * this.dashSpeed;
        this.stateTimer = 0.36;
        this.totalDashTimer = 0.36;

        this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
        this.sprite.setAnimation('Attack', false);
        this.particleSystem.spawnDust(this.x, this.y + 10, 8);
        this.particleSystem.burst(this.x, this.y, '#4A148C', 10, 160, 0.35, 3.5);
        soundManager.playPhysicalStrike();
        this.onLog(`⚡ <strong>${this.data.name}</strong> emergiu da finta avançando direto sobre <strong>${this.target.data.name}</strong>!`, 'dark');
        return;
      } else {
        this.feintPhase = 0;
      }
    }

    const sk = this.currentDashingSkill;
    const isSteamroller = sk && (sk.internalName === 'STEAMROLLER' || (sk.name && sk.name.toLowerCase().includes('steamroller')));
    const isUturn = sk && (sk.internalName === 'UTURN' || (sk.name && sk.name.toLowerCase().includes('u-turn')));

    // Parabolic vertical jump arc for Steamroller: climbs up to 55px and slams down
    if (isSteamroller) {
      const totalT = this.totalDashTimer || 0.42;
      const progress = Math.max(0, Math.min(1, 1 - (this.stateTimer / totalT)));
      this.jumpOffset = -Math.sin(progress * Math.PI) * 55;
    } else {
      this.jumpOffset = 0;
    }

    // Speed particles trail
    const isMegahornDash = sk && (sk.internalName === 'MEGAHORN' || (sk.name && sk.name.toLowerCase().includes('megahorn')));
    if (isMegahornDash) {
      this.particleSystem.spawnDust(this.x, this.y + 10, 1);
      this.particleSystem.spawnPixelBurst(this.x, this.y, '#8be316', 2, 40, 0.20, 2);
      this.particleSystem.spawnPixelBurst(this.x, this.y, '#ffffff', 1, 25, 0.16, 1.5);
    } else {
      this.particleSystem.spawnDust(this.x, this.y + 12, 1);
    }

    // VETOR FIXO: O dash se projeta em linha reta sem corrigir rota/homing.
    const dashDirX = this.dashDirX || 0;
    const dashDirY = this.dashDirY || 0;
    const dashSpeed = this.dashSpeed || 920;
    this.vx = dashDirX * dashSpeed;
    this.vy = dashDirY * dashSpeed;

    if (this.target && !this.target.isFainted) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const dist = Math.hypot(dx, dy);

      // Hit detection: acerto OCORRE APENAS se atingir o raio físico de contato
      const hitRadius = this.radius + this.target.radius + 18;
      if (dist <= hitRadius) {
        this.feintPhase = 0;
        this.currentDashingSkill = null;

        const isTwineedle = sk && (sk.internalName === 'TWINEEDLE' || (sk.name && sk.name.toLowerCase().includes('twineedle')));
        const isDualChop = sk && (sk.internalName === 'DUALCHOP' || (sk.name && sk.name.toLowerCase().includes('dual chop')) || sk.id === 60 || sk.visual?.isDualChop);
        const isOutrage = sk && (sk.internalName === 'OUTRAGE' || (sk.name && sk.name.toLowerCase().includes('outrage')) || sk.id === 53 || sk.visual?.isOutrage);
        const isDragonAscent = sk && (sk.internalName === 'DRAGONASCENT' || (sk.name && sk.name.toLowerCase().includes('dragon ascent')) || sk.id === 620 || sk.visual?.isDragonAscent);
        const isBeatUp = sk && (sk.internalName === 'BEATUP' || (sk.name && sk.name.toLowerCase().includes('beat up')));
        const isHyperspaceFury = sk && (sk.internalName === 'HYPERSPACEFURY' || (sk.name && sk.name.toLowerCase().includes('hyperspace fury')));
        const isSuckerPunch = sk && (sk.internalName === 'SUCKERPUNCH' || (sk.name && sk.name.toLowerCase().includes('sucker punch')));
        const isPursuit = sk && (sk.internalName === 'PURSUIT' || (sk.name && sk.name.toLowerCase().includes('pursuit')));
        const isFeintAttackHit = sk && (sk.internalName === 'FEINTATTACK' || (sk.name && sk.name.toLowerCase().includes('feint attack')));

        if (sk) {
          if (isDragonAscent) {
            // Dragon Ascent: Dash acertou! Sobe ao céu inalvejável e dispara o mergulho de sopro verde com burning!
            this.executeDragonAscentSky(this.target, sk);
            return;
          } else if (isDualChop) {
            // Dual Chop: 2 golpes consecutivos com dano dividido por 2
            this.resolveSkillHit(this.target, sk, 2);
            this.particleSystem.addFloatingText(this.target.x, this.target.y - 28, 'HIT #1!', 'dragon', false);
            this.particleSystem.spawnSlash(this.target.x - 12, this.target.y - 22, '#6366F1', false, 0.25, sk.visual);
            soundManager.playPhysicalStrike();

            setTimeout(() => {
              if (this.isFainted || !this.target || this.target.isFainted) return;
              this.resolveSkillHit(this.target, sk, 2);
              this.particleSystem.addFloatingText(this.target.x, this.target.y - 28, 'HIT #2!', 'dragon', false);
              this.particleSystem.spawnSlash(this.target.x + 12, this.target.y - 24, '#A855F7', true, 0.25, sk.visual);
              soundManager.playPhysicalStrike();
              if (this.arena && this.arena.triggerScreenShake) this.arena.triggerScreenShake(7);
            }, 130);
          } else if (isOutrage) {
            this.resolveSkillHit(this.target, sk);
            this.particleSystem.spawnShockwave(this.target.x, this.target.y - 18, 55, '#C084FC', 0.35);
            this.particleSystem.spawnPixelBurst(this.target.x, this.target.y - 20, '#A855F7', 28, 160, 0.45, 3.5);
            if (this.arena && this.arena.triggerScreenShake) this.arena.triggerScreenShake(8);
          } else if (isTwineedle) {
            // Golpe 1 imediato (metade do dano)
            this.resolveSkillHit(this.target, sk, 2);
            this.particleSystem.addFloatingText(this.target.x, this.target.y - 28, 'HIT #1!', 'bug', false);

            // Golpe 2 após 120ms (metade do dano)
            setTimeout(() => {
              if (this.isFainted || !this.target || this.target.isFainted) return;
              this.resolveSkillHit(this.target, sk, 2);
              this.particleSystem.addFloatingText(this.target.x, this.target.y - 28, 'HIT #2!', 'bug', false);
            }, 120);
          } else if (isBeatUp) {
            // Beat Up: "The user gets all the party Pokémon to attack the foe. The more party Pokémon, the more damage."
            const party = this.engine ? (this.isPlayer ? this.engine.playerParty : this.engine.enemyParty) : null;
            const aliveMembers = (Array.isArray(party) && party.length > 0)
              ? party.filter(p => (p.currentHp > 0 || p.hp > 0) && !p.isFainted)
              : [
                  { name: this.data.name },
                  { name: 'Aliado 1' },
                  { name: 'Aliado 2' },
                  { name: 'Aliado 3' }
                ];
            const totalPartyHits = Math.max(1, Math.min(6, aliveMembers.length));

            this.onLog(`👥 <strong>${this.data.name}</strong> reuniu <strong>${totalPartyHits} Pokémon da equipe</strong> para o ataque coordenado <strong>Beat Up</strong>!`, 'dark');

            for (let pIdx = 0; pIdx < totalPartyHits; pIdx++) {
              const member = aliveMembers[pIdx] || aliveMembers[0];
              const memberName = member.name || member.species || `Membro #${pIdx + 1}`;
              setTimeout(() => {
                if (this.isFainted || !this.target || this.target.isFainted) return;
                this.resolveSkillHit(this.target, sk, totalPartyHits);
                const jx = (Math.random() - 0.5) * 26;
                const jy = (Math.random() - 0.5) * 20;
                this.particleSystem.addFloatingText(this.target.x + jx, this.target.y - 28 + jy, `HIT #${pIdx + 1} (${memberName})!`, 'dark', false);
                soundManager.playPhysicalStrike();
                this.onLog(`💥 [${pIdx + 1}/${totalPartyHits}] <strong>${memberName}</strong> atacou com Beat Up!`, 'dark');
              }, pIdx * 130);
            }
          } else if (isHyperspaceFury) {
            // Hyperspace Fury: Sequência furiosa de 3 golpes dimensionais com sprite de impacto
            const furyHits = 3;
            this.onLog(`🌀 <strong>${this.data.name}</strong> abriu fendas dimensionais em saraivada com <strong>Hyperspace Fury</strong>!`, 'dark');
            for (let f = 0; f < furyHits; f++) {
              setTimeout(() => {
                if (this.isFainted || !this.target || this.target.isFainted) return;
                this.resolveSkillHit(this.target, sk, furyHits);
                const jx = (Math.random() - 0.5) * 32;
                const jy = (Math.random() - 0.5) * 24;
                this.particleSystem.addFloatingText(this.target.x + jx, this.target.y - 28 + jy, `FURY #${f + 1}!`, 'dark', false);
                this.particleSystem.spawnSlash(this.target.x + jx, this.target.y - 24 + jy, '#c084fc', false, 0.28, sk.visual);
                if (this.arena && this.arena.triggerScreenShake) this.arena.triggerScreenShake(7);
                soundManager.playPhysicalStrike();
              }, f * 110);
            }
          } else if (isSuckerPunch) {
            // Sucker Punch: Impacto físico de soco repentino
            this.resolveSkillHit(this.target, sk);
            this.particleSystem.addFloatingText(this.target.x, this.target.y - 28, 'SUCKER PUNCH!', 'dark', false);
          } else if (isPursuit) {
            // Pursuit: Impacto físico de perseguição
            this.resolveSkillHit(this.target, sk);
            this.particleSystem.addFloatingText(this.target.x, this.target.y - 28, 'PURSUIT!', 'dark', false);
          } else if (isFeintAttackHit) {
            // Feint Attack: Golpe surpresa direto após a finta
            this.resolveSkillHit(this.target, sk);
            this.particleSystem.addFloatingText(this.target.x, this.target.y - 28, 'FEINT ATTACK!', 'dark', false);
          } else {
            this.resolveSkillHit(this.target, sk);
          }
        } else {
          this.resolvePhysicalHit(this.target);
        }

        // Caso especial Steamroller: após esmagar, salta/retorna à posição inicial antes do pulo
        if (isSteamroller && (this.dashStartX !== 0 || this.dashStartY !== 0)) {
          this.startRetreatAnimation(this.dashStartX, this.dashStartY, 0.35, true);
          return;
        }

        // Caso especial U-turn: aplicar ataque e recuar em alta velocidade para trás com afterimages
        if (isUturn) {
          const retreatDistance = 260;
          const targetRetreatX = this.x - dashDirX * retreatDistance;
          const targetRetreatY = this.y - dashDirY * retreatDistance;
          this.startRetreatAnimation(targetRetreatX, targetRetreatY, 0.38, false);
          this.onLog(`🔄 <strong>${this.data.name}</strong> executou <strong>U-turn</strong> e recuou do combate!`, 'bug');
          return;
        }

        // Attacker recoil padrão: recuo suave após impacto
        this.jumpOffset = 0;
        this.state = 'moving';
        this.recoilTimer = 0.20;
        this.vx = -dashDirX * 200;
        this.vy = -dashDirY * 200;
        this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
        this.onStateChange();
        return;
      }
    }

    // Se o timer esgotar sem acertar, o dash passou direto (desviado com sucesso!)
    if (this.stateTimer <= 0) {
      this.feintPhase = 0;
      this.currentDashingSkill = null;
      this.jumpOffset = 0;
      this.state = 'moving';
      this.vx *= 0.25;
      this.vy *= 0.25;
      if (this.target && !this.target.isFainted) {
        this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
      }
      this.onStateChange();
    }
  }

  // Smooth retreat animation helper (Steamroller back to launch pad / U-turn backward retreat)
  startRetreatAnimation(targetX, targetY, duration = 0.35, isParabolic = false) {
    this.isRetreatingToOrigin = true;
    this.retreatStartX = this.x;
    this.retreatStartY = this.y;
    this.retreatTargetX = targetX;
    this.retreatTargetY = targetY;
    this.retreatTimer = 0;
    this.retreatDuration = duration;
    this.retreatIsParabolic = isParabolic;
    this.state = 'moving';
    this.vx = 0;
    this.vy = 0;
    this.recoilTimer = duration;
    if (this.target && !this.target.isFainted) {
      this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
    }
  }

  // Dragon Ascent: Aerial Soar & Green Dragon Breath Dive with Collision Burning Aura
  executeDragonAscentSky(target, skill) {
    if (!target || target.isFainted) return;
    this.state = 'dragon_ascent_sky';
    this.dodgeTimer = 0.95; // Inalvejável durante toda a manobra aérea
    this.isUntargetable = true;
    this.vx = 0;
    this.vy = 0;
    this.jumpOffset = 0;

    this.onLog(`☁️ <strong>${this.data.name}</strong> ascendeu aos céus ficando inalvejável com <strong>${skill.name}</strong>!`, 'dragon');
    soundManager.playPhysicalStrike();

    let elapsed = 0;
    const ascentInterval = setInterval(() => {
      elapsed += 0.03;
      if (this.isFainted) {
        clearInterval(ascentInterval);
        this.isUntargetable = false;
        return;
      }
      if (elapsed < 0.30) {
        // Subida vertiginosa ao céu
        this.jumpOffset = -Math.sin((elapsed / 0.30) * (Math.PI * 0.5)) * 140;
        if (Math.random() < 0.4) {
          this.particleSystem.spawnPixelBurst(this.x, this.y + this.jumpOffset + 20, '#22C55E', 2, 40, 0.2, 2);
        }
      } else if (elapsed >= 0.30 && elapsed < 0.50) {
        // Pausa no pico inalvejável
        this.jumpOffset = -140;
      } else {
        clearInterval(ascentInterval);
        if (!target || target.isFainted) {
          this.jumpOffset = 0;
          this.isUntargetable = false;
          this.state = 'moving';
          return;
        }

        this.onLog(`🐲 <strong>${this.data.name}</strong> mergulhou em rasante disparando um sopro verde devastador!`, 'dragon');

        // Mergulho e colisão
        const hitCenter = typeof target.getHitCenter === 'function' ? target.getHitCenter() : { x: target.x, y: target.y - 32 };
        this.jumpOffset = 0;
        this.x = target.x - (this.x < target.x ? 32 : -32);
        this.y = target.y;
        this.isUntargetable = false;
        this.state = 'moving';
        this.recoilTimer = 0.22;
        this.vx = (this.x < target.x ? -1 : 1) * 160;
        this.vy = 0;

        this.resolveSkillHit(target, skill);
        this.particleSystem.spawnShockwave(hitCenter.x, hitCenter.y, 80, '#22C55E', 0.45);
        this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#4ADE80', 34, 240, 0.5, 4.5);
        if (this.arena && this.arena.triggerScreenShake) this.arena.triggerScreenShake(14);
        if (this.arena && this.arena.addDecal) this.arena.addDecal(target.x, target.y, 'crater_round', 36, 9.0);
        soundManager.playPhysicalStrike();
      }
    }, 30);
  }

  resolvePhysicalHit(target) {
    if (!target || target.isFainted) return;
    if (target.dodgeTimer > 0) {
      this.particleSystem.addFloatingText(target.x, target.y - 14, 'ESQUIVOU!', 'dodge', false);
      return;
    }

    // Stat Stages application: Attack and Defense stages directly scale damage!
    const getStageMult = (s) => (s >= 0 ? (2 + s) / 2 : 2 / (2 - s));
    const atkStage = (this.statStages && this.statStages.atk) || 0;
    const defStage = (target.statStages && target.statStages.def) || 0;
    const effectiveAtk = Math.max(1, Math.round(this.data.stats.atk * getStageMult(atkStage)));
    const effectiveDef = Math.max(1, Math.round(target.data.stats.def * getStageMult(defStage)));
    const isCrit = Math.random() < 0.0416;
    const critMult = isCrit ? 1.35 : 1.0;
    const baseDmg = Math.max(1, Math.round((this.physicalAttack.power * (effectiveAtk / effectiveDef) * 0.45) + 2));
    let finalDmg = Math.round(baseDmg * critMult);

    // 70% Damage reduction after winning an attack clash (30% reduction, once per move)
    if (this.hasClashWonReduced || (this.currentDashingSkill && this.currentDashingSkill.clashWonReduced)) {
      finalDmg = Math.max(1, Math.round(finalDmg * 0.70));
      this.hasClashWonReduced = false;
      if (this.currentDashingSkill) this.currentDashingSkill.clashWonReduced = false;
    }

    let isBlocked = false;
    if (target.isGuarding) {
      const mitigationPct = target.guardShieldPower || 0.70;
      const absorbedDmg = Math.round(finalDmg * mitigationPct);
      finalDmg = Math.max(1, finalDmg - absorbedDmg);
      isBlocked = true;

      if (typeof target.absorbGuardHit === 'function') {
        target.absorbGuardHit(absorbedDmg);
      }
    }

    target.takeDamage(finalDmg, isCrit, isBlocked, 'physical');

    const kx = target.x - this.x;
    const ky = target.y - this.y;
    const kDist = Math.hypot(kx, ky) || 1;
    const nx = kx / kDist;
    const ny = ky / kDist;
    const pushSpeed = target.isGuarding ? 260 : 540;
    target.applyPush(nx, ny, pushSpeed, this);

    this.recoilTimer = 0.12;
    this.vx = -nx * 85;
    this.vy = -ny * 85;
    this.sprite.faceTowards(target.x, target.y, this.x, this.y);

    const hitCenter = typeof target.getHitCenter === 'function' ? target.getHitCenter() : { x: target.x, y: target.y - 32 };
    const hitAngle = Math.atan2(ny, nx);

    const physVisual = this.physicalAttack?.visual || {
      file: 'core/attack_physical_01.png',
      cols: 5,
      rows: 2,
      startFrame: 0,
      endFrame: 4,
      fps: 18,
      scale: 0.48,
    };
    // Physical impact punch animation anchored to target
    this.particleSystem.spawnPunch(hitCenter.x, hitCenter.y, isBlocked ? '#00E5FF' : '#FF9100', 0.28, physVisual);

    if (this.arena && this.arena.addDecal) {
      this.arena.addDecal(target.x, target.y, 'crater_round', 22, 8.0);
    }

    this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, isBlocked ? '#00E5FF' : '#FF9100', 20, 190, 0.45, 4);
    soundManager.playHit(isCrit, isBlocked);
    this.arena.triggerScreenShake(isCrit ? 14 : 7);
  }

  // Disable Move mechanic: seals the target's last used move for 8 seconds
  applyDisable(duration = 8.0, attacker = null) {
    if (this.isFainted) return;
    const disabledMove = this.lastUsedSkill || (this.skills && this.skills.find(s => s && s.category !== 'Status')) || this.skills[0];
    if (!disabledMove) return;

    this.disabledSkill = disabledMove;
    this.disabledSkillTimer = duration;
    disabledMove.isDisabled = true;

    const attackerName = attacker ? attacker.data.name : 'O oponente';
    this.onLog(`🚫 <strong>${attackerName}</strong> usou <strong>Disable</strong>! <strong>${this.data.name}</strong> teve <strong>${disabledMove.name}</strong> bloqueado por ${Math.round(duration)}s!`, 'system');
    this.particleSystem.addFloatingText(this.x, this.y - 18, `🚫 ${disabledMove.name.toUpperCase()} ANULADO!`, 'status', true);
    this.particleSystem.spawnShockwave(this.x, this.y, 55, '#9C27B0', 0.4);
    this.particleSystem.spawnPixelBurst(this.x, this.y - 18, '#AB47BC', 26, 170, 0.5, 4);
    this.onStateChange();
  }

  // Continuous Beam Impact Lock: roots the victim, interrupts actions, and sustains directional push
  applyBeamLock(duration, dirX, dirY, speed, attacker, type = 'water') {
    if (this.isFainted || this.dodgeTimer > 0) return;
    const lockDuration = Math.max(0.45, duration);
    this.beamLockTimer = lockDuration;
    this.hitStunTimer = lockDuration;
    this.state = 'hurt';
    this.isKnockedBack = true;
    this.knockbackTimer = lockDuration;
    this.knockbackAttacker = attacker;

    const len = Math.hypot(dirX, dirY) || 1;
    this.beamPushDirX = dirX / len;
    this.beamPushDirY = dirY / len;
    this.beamPushSpeed = speed;
    this.vx = this.beamPushDirX * speed;
    this.vy = this.beamPushDirY * speed;

    // Interrupt victim if they were channeling a beam or casting a skill
    if (this.isChannelingBeam) {
      this.cancelBeamChanneling('interrupted');
    }
    if (this.state === 'casting_skill' || this.state === 'dashing_strike') {
      this.state = 'hurt';
      this.currentAction = null;
      this.currentDashingSkill = null;
    }

    if (!this.isGuarding && attacker && !attacker.isFainted) {
      this.sprite.faceTowards(attacker.x, attacker.y, this.x, this.y);
    }
    this.sprite.setAnimation('Hurt', false);

    if (this.particleSystem && this.particleSystem.spawnDust) {
      this.particleSystem.spawnDust(this.x, this.y + 12, 5);
    }
    this.particleSystem.addFloatingText(this.x, this.y - 18, 'IMOBILIZADO!', 'status', false);
    this.onStateChange();
  }

  // Knockback & Push mechanics: pushes entity in direction
  applyPush(dirX, dirY, speed, attacker) {
    if (this.isFainted || this.dodgeTimer > 0) return; // Inalvejável: Cannot be pushed while dodging!
    const len = Math.hypot(dirX, dirY) || 1;
    const nx = dirX / len;
    const ny = dirY / len;
    this.vx = nx * speed;
    this.vy = ny * speed;
    this.isKnockedBack = true;
    this.knockbackTimer = 0.32; // Solid slide duration for satisfying impact
    this.knockbackAttacker = attacker;
    this.recoilTimer = 0;
    // Maintain eye contact with attacker while being pushed unless guard/shield is active
    if (!this.isGuarding && attacker && !attacker.isFainted) {
      this.sprite.faceTowards(attacker.x, attacker.y, this.x, this.y);
    }
    if (this.particleSystem && this.particleSystem.spawnDust) {
      this.particleSystem.spawnDust(this.x, this.y + 12, 5);
    }
    if (this.arena && this.arena.addDecal && speed >= 200) {
      const slideAngle = Math.atan2(ny, nx);
      this.arena.addDecal(this.x, this.y + 6, 'skid_trench', 24, 6.0, slideAngle);
    }
  }

  // Arena wall boundary collision handler: triggers dizziness when HP <= 30% and pushed
  onArenaWallCollide(impactSpeed = 0) {
    if (this.isFainted) return;

    const hpRatio = this.currentHp / this.maxHp;
    if (this.isKnockedBack && hpRatio <= 0.30 && !this.isDizzy) {
      this.applyDizziness(1.5);
    } else if (impactSpeed > 160) {
      this.particleSystem.spawnDust(this.x, this.y, 4);
    }
  }

  // Dizziness (Tontura) state: 1.5s total immobilization with orbiting golden pixel stars
  applyDizziness(duration = 1.5) {
    if (this.isFainted || this.isDizzy) return;
    this.isDizzy = true;
    this.dizzyTimer = duration;
    this.isKnockedBack = false;
    this.vx = 0;
    this.vy = 0;
    this.state = 'moving';

    if (this.isChannelingBeam) {
      this.cancelBeamChanneling('stun');
    }

    this.sprite.setAnimation('Hurt', false);

    soundManager.playHit(true, false);
    if (this.arena) {
      this.arena.triggerScreenShake(14);
      if (this.arena.addDecal) {
        this.arena.addDecal(this.x, this.y, 'crater_spiked', 32, 8.0);
      }
    }
    this.particleSystem.spawnPixelBurst(this.x, this.y, '#FFD700', 24, 180, 0.5, 4);
    this.particleSystem.spawnShockwave(this.x, this.y, 50, '#FFD700', 0.35);
    this.particleSystem.addFloatingText(this.x, this.y - 20, 'TONTURA! (1.5s)', 'electric', true);

    this.onLog(`💫 <strong>${this.data.name}</strong> colidiu contra o limite da arena e ficou <strong>TONTO</strong> por 1.5s!`, 'system');
    this.onStateChange();
  }

  // Identify whether a skill is a true physical melee contact attack (Tackle, Bite, Punches, Tails, etc.)
  isMeleeSkill(skill) {
    if (!skill) return false;

    // Status moves and buffs/barriers are NEVER melee dashes
    const rawMode = (skill.executionType || skill.typeCategory || '').toLowerCase();
    if (skill.category === 'Status' || rawMode === 'buff' || rawMode === 'barrier' || skill.vfxFamily === 'buff') {
      return false;
    }

    // Direct contact declaration from Move Spec
    if (skill.combatBehavior && skill.combatBehavior.isContact) return true;

    if (rawMode === 'dash' || rawMode === 'melee_dash' || rawMode === 'strike') return true;

    const name = (skill.name || skill.internalName || '').toLowerCase();
    const meleeKeywords = [
      'tackle', 'investida', 'bite', 'mordida', 'crunch', 'mastigada', 'scratch', 'arranhão',
      'slash', 'corte', 'quick attack', 'ataque rápido', 'headbutt', 'cabeçada', 'slam',
      'pound', 'tail', 'cauda', 'punch', 'soco', 'punho', 'chop', 'golpe', 'strike',
      'fury', 'fúria', 'bind', 'constrição', 'x-scissor', 'jab', 'claw', 'garra',
      'fang', 'presa', 'peck', 'bicada', 'drill', 'broca', 'takedown',
      'take down', 'double-edge', 'body slam', 'wrap', 'clamp', 'superpower', 'close combat',
      'outrage', 'thrash', 'aqua tail', 'iron tail', 'poison jab', 'drain punch', 'mach punch'
    ];
    if (meleeKeywords.some(k => name.includes(k))) return true;

    if (rawMode === 'beam' || rawMode === 'area' || rawMode === 'area_blast' || rawMode === 'sky_strike' || rawMode === 'buff' || rawMode === 'barrier' || rawMode === 'projectile') return false;

    if (skill.category === 'Physical') {
      const rangedPhysical = [
        'rock throw', 'rock slide', 'stone edge', 'earthquake', 'terremoto',
        'magnitude', 'fissure', 'mud-slap', 'razor leaf', 'pin missile',
        'icicle spear', 'bone rush', 'bonemerang', 'bullet seed'
      ];
      if (rangedPhysical.some(r => name.includes(r))) return false;
      return true;
    }
    return false;
  }

  // Instant snappy melee dash initiation
  fireMeleeDash(skill) {
    if (!this.target || this.isFainted) return;
    const target = this.target;

    this.state = 'dashing_strike';
    this.currentDashingSkill = skill;
    this.stateTimer = 0.42; // Snappy 420ms dash window
    this.totalDashTimer = 0.42;
    this.actionCooldown = 0.55;
    this.dashStartX = this.x;
    this.dashStartY = this.y;
    this.jumpOffset = 0;

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const spd = Math.max(900, skill.dashSpeed || 920);

    const isFeintAttack = skill.internalName === 'FEINTATTACK' || (skill.name && skill.name.toLowerCase().includes('feint attack'));
    if (isFeintAttack) {
      // Phase 1: Dash em direção divergente/aleatória (desviando da rota do inimigo)
      this.feintPhase = 1;
      this.dashStartX = this.x;
      this.dashStartY = this.y;
      this.actionCooldown = 0.65;

      const targetAngle = Math.atan2(dy, dx);
      // Ângulo divergente proposital (entre 75° e 115° para a esquerda ou direita)
      const side = Math.random() < 0.5 ? 1 : -1;
      const feintAngle = targetAngle + side * (1.35 + Math.random() * 0.4);
      this.dashDirX = Math.cos(feintAngle);
      this.dashDirY = Math.sin(feintAngle);
      this.dashSpeed = 980;
      this.vx = this.dashDirX * this.dashSpeed;
      this.vy = this.dashDirY * this.dashSpeed;
      this.stateTimer = 0.18; // 180ms dash de finta
      this.totalDashTimer = 0.18;

      this.sprite.faceTowards(this.x + this.dashDirX * 100, this.y + this.dashDirY * 100, this.x, this.y);
      this.sprite.setAnimation('Attack', false);

      soundManager.playPhysicalStrike();
      this.particleSystem.spawnDust(this.x, this.y + 10, 6);
      this.particleSystem.burst(this.x, this.y, '#4A148C', 8, 120, 0.3, 3);
      this.onLog(`🌀 <strong>${this.data.name}</strong> executou uma finta evasiva com <strong>${skill.name}</strong>!`, 'dark');
      return;
    }

    // LOCKED VECTOR: calculado uma única vez no início, impedindo correção de rota!
    this.dashDirX = dx / dist;
    this.dashDirY = dy / dist;
    this.dashSpeed = spd;
    this.vx = this.dashDirX * this.dashSpeed;
    this.vy = this.dashDirY * this.dashSpeed;

    this.sprite.faceTowards(target.x, target.y, this.x, this.y);
    this.sprite.setAnimation('Attack', false);

    soundManager.playPhysicalStrike();
    this.particleSystem.spawnDust(this.x, this.y + 10, 6);
    this.particleSystem.spawnShockwave(this.x, this.y, 40, skill.color || '#FFFFFF', 0.25);
    if (skill.color && skill.type !== 'Normal') {
      this.particleSystem.burst(this.x, this.y, skill.color, 6, 120, 0.35, 3);
    }

    this.onLog(`⚡ ${this.data.name} avançou com <strong>${skill.name}</strong> em investida!`, skill.type?.toLowerCase() || 'physical');
  }

  // EXECUTE SKILL / MOVE (Strict cooldown & PP check)
  executeMove(index) {
    return this.executeSkill(index);
  }

  executeSkill(skillIndex) {
    if (!this.target || this.isFainted || this.isDizzy || this.beamLockTimer > 0 || this.hitStunTimer > 0 || this.state === 'hurt' || this.state === 'dashing_strike' || this.state === 'casting_skill') return false;

    const skill = this.skills[skillIndex];
    if (!skill) return false;

    // Strict Disable check
    if (skill.isDisabled || (this.disabledSkill && this.disabledSkill.id === skill.id && this.disabledSkillTimer > 0)) {
      this.particleSystem.addFloatingText(this.x, this.y - 14, 'GOLPE ANULADO!', 'status', false);
      this.onLog(`⚠️ <strong>${skill.name}</strong> está bloqueado pelo Disable! (${Math.ceil(this.disabledSkillTimer)}s restantes)`, 'system');
      return false;
    }

    // Strict cooldown lock: reject activation during cooldown
    if (skill.currentCooldown > 0) {
      return false;
    }

    // PP check: reject if move has 0 PP
    if (skill.pp !== undefined && skill.pp <= 0) {
      this.onLog(`⚠️ <strong>${this.data.name}</strong> está sem PP para <strong>${skill.name}</strong>!`, 'system');
      return false;
    }
    if (skill.pp !== undefined && skill.pp > 0) {
      skill.pp--;
    }

    // Lock cooldown immediately
    const maxCd = (typeof skill.cooldown === 'number' && skill.cooldown > 0)
      ? skill.cooldown
      : calculateMoveCooldown(skill.power, (this.data.stats && this.data.stats.speed) || 50);
    skill.cooldown = maxCd;
    skill.currentCooldown = maxCd;

    // Track last used skill for mechanics like Disable, Mirror Move, Copycat
    this.lastUsedSkill = skill;
    this.lastUsedSkillIndex = skillIndex;

    const isMelee = this.isMeleeSkill(skill);

    if (isMelee) {
      this.fireMeleeDash(skill);
      this.onStateChange();
      return true;
    }

    // Ranged / special / status move casting
    this.currentAction = skill;
    this.state = 'casting_skill';
    this.stateTimer = 0.28;
    this.actionCooldown = 0.5;

    this.vx *= 0.2;
    this.vy *= 0.2;

    this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
    const animName = skill.typeCategory === 'beam' ? 'Shoot' : (skill.category === 'Status' ? 'Charge' : 'Shoot');
    this.sprite.setAnimation(animName, false);

    this.particleSystem.spawnShockwave(this.x, this.y, 45, skill.color, 0.35);
    soundManager.playSkillSound(skill.sound);

    this.onLog(
      `💥 ${this.data.name} disparou <strong>${skill.name}</strong>!`,
      skill.type.toLowerCase()
    );
    this.onStateChange();
    return true;
  }

  updateCastingSkill(dt) {
    if (this.isChannelingBeam) return;

    this.stateTimer -= dt;

    if (this.currentAction) {
      this.particleSystem.burst(this.x, this.y, this.currentAction.color, 3, 80, 0.25, 3);
    }

    if (this.stateTimer <= 0) {
      try {
        this.fireSkill(this.currentAction);
      } catch (err) {
        console.error('Error firing skill:', err);
      } finally {
        if (!this.isChannelingBeam) {
          this.state = 'moving';
        }
        this.currentAction = null;
        this.onStateChange();
      }
    }
  }

  fireSkill(skill) {
    if (!this.target || !skill) return;

    const target = this.target;
    const targetPos = typeof target.getHitCenter === 'function'
      ? target.getHitCenter()
      : { x: target.x, y: target.y - 36 };

    const isMelee = this.isMeleeSkill(skill);
    let mode = (skill.executionType || skill.typeCategory || '').toLowerCase();
    const isWebSkill = skill.internalName === 'SPIDERWEB' || skill.internalName === 'STICKYWEB' || skill.internalName === 'STRINGSHOT' ||
      (skill.name && (skill.name.toLowerCase().includes('spider web') || skill.name.toLowerCase().includes('sticky web') || skill.name.toLowerCase().includes('string shot')));

    if (isMelee) {
      mode = 'dash';
    } else if (isWebSkill) {
      mode = 'projectile';
    } else if (!mode) {
      mode = 'projectile';
    }

    const isDracoMeteor = skill.visual?.isDracoMeteor || skill.internalName === 'DRACOMETEOR' || skill.id === 52 || (skill.name && skill.name.toLowerCase().includes('draco meteor'));
    const isSpacialRend = skill.visual?.isSpacialRend || skill.internalName === 'SPACIALREND' || skill.id === 55 || (skill.name && skill.name.toLowerCase().includes('spacial rend'));
    const isNightDaze = skill.visual?.isNightDaze || skill.internalName === 'NIGHTDAZE' || skill.internalName === 'DARKPULSE' || skill.id === 23 || skill.id === 24 || (skill.name && (skill.name.toLowerCase().includes('night daze') || skill.name.toLowerCase().includes('dark pulse')));
    const isWhirlwindOnly = (skill.visual?.isWhirlwind && !skill.visual?.isTwister) || skill.internalName === 'WHIRLWIND' || (skill.name && skill.name.toLowerCase().includes('whirlwind') && !skill.name.toLowerCase().includes('twister'));
    const isAirCutter = skill.visual?.isAirCutter || skill.internalName === 'AIRCUTTER' || skill.id === 166 || (skill.name && skill.name.toLowerCase().includes('air cutter'));

    if (isDracoMeteor) {
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      this.sprite.setAnimation('Shoot', true);
      this.particleSystem.spawnDracoMeteor(
        targetPos.x, targetPos.y, skill.visual, target, this, skill,
        (t, s) => {
          this.resolveSkillHit(t, s);
          if (this.arena?.triggerScreenShake) this.arena.triggerScreenShake(24);
          if (this.arena?.addDecal) this.arena.addDecal(t.x, t.y, 'scorch', 48, 9.0);
        }
      );
      this.onLog(`☄️ <strong>${this.data.name}</strong> invocou uma chuva catastrófica de <strong>${skill.name}</strong>!`, 'dragon');
      return;
    }

    if (isSpacialRend) {
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      this.sprite.setAnimation('Physical', true);
      this.particleSystem.spawnSpacialRend(
        targetPos.x, targetPos.y, skill.visual, target, this, skill,
        (t, s) => {
          this.resolveSkillHit(t, s);
          if (this.arena?.triggerScreenShake) this.arena.triggerScreenShake(18);
          if (this.arena?.addDecal) this.arena.addDecal(t.x, t.y, 'crack', 30, 8.0);
        }
      );
      this.onLog(`🌌 <strong>${this.data.name}</strong> rasgou o tecido do espaço com <strong>${skill.name}</strong>!`, 'dragon');
      return;
    }

    if (isNightDaze) {
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      this.sprite.setAnimation('Shoot', true);
      this.particleSystem.spawnNightDaze(
        targetPos.x, targetPos.y, skill.visual, target, this, skill,
        (t, s) => {
          this.resolveSkillHit(t, s);
          if (this.arena?.triggerScreenShake) this.arena.triggerScreenShake(16);
          if (this.arena?.addDecal) this.arena.addDecal(t.x, t.y, 'shadow', 32, 8.0);
        }
      );
      this.onLog(`🌑 <strong>${this.data.name}</strong> detonou uma onda de escuridão com <strong>${skill.name}</strong>!`, 'dark');
      return;
    }

    if (isWhirlwindOnly) {
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      this.sprite.setAnimation('Shoot', true);
      this.particleSystem.spawnWhirlwind(
        targetPos.x, targetPos.y, skill.visual, target, this, skill,
        (t, s) => {
          this.resolveSkillHit(t, s);
          if (this.arena?.triggerScreenShake) this.arena.triggerScreenShake(14);
        }
      );
      this.onLog(`🌪️ <strong>${this.data.name}</strong> conjurou um redemoinho violento com <strong>${skill.name}</strong>!`, 'flying');
      return;
    }

    if (isAirCutter) {
      const origin = this.getAttackOrigin();
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      this.sprite.setAnimation('Shoot', true);
      this.particleSystem.spawnAirCutter(
        origin.x, origin.y, targetPos.x, targetPos.y, skill.visual, target, this, skill,
        (t, s) => {
          this.resolveSkillHit(t, s);
          if (this.arena?.triggerScreenShake) this.arena.triggerScreenShake(12);
        }
      );
      this.onLog(`💨 <strong>${this.data.name}</strong> disparou lâminas cortantes de vento com <strong>${skill.name}</strong>!`, 'flying');
      return;
    }

    if (mode === 'dash') {
      this.fireMeleeDash(skill);
    } else if (mode === 'beam' || mode === 'stream') {
      const beamDuration = skill.duration || 0.9;
      this.isChannelingBeam = true;
      this.channelingTimer = beamDuration;
      this.channelingSkill = skill;
      this.channelingTarget = target;
      this.state = 'casting_skill';
      this.vx = 0;
      this.vy = 0;
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      this.sprite.setAnimation('Shoot', true);

      const origin = this.getBeamOrigin(targetPos.x, targetPos.y);

      this.activeBeam = this.particleSystem.addBeam(
        origin.x,
        origin.y,
        targetPos.x,
        targetPos.y,
        skill.color,
        skill.beamWidth || 50,
        beamDuration,
        skill.type.toLowerCase(),
        this,
        target,
        skill
      );

      if (this.arena && this.arena.addDecal) {
        this.arena.addDecal(target.x, target.y, skill.type === 'Water' ? 'wet' : 'scorch', 30, 9.0);
      }
      this.arena.triggerScreenShake(14);

      // Delayed beam damage resolution so clashes can interrupt before damage is registered
      const beamRef = this.activeBeam;
      setTimeout(() => {
        if (!beamRef || beamRef.isCancelled || this.isFainted || target.isFainted) return;
        if (beamRef.clashWonReduced) {
          skill.clashWonReduced = true;
        }
        this.resolveSkillHit(target, skill);
      }, 160);
    } else if (mode === 'area' || mode === 'area_blast' || (skill.name && (skill.name.toLowerCase().includes('earthquake') || skill.name.toLowerCase().includes('terremoto') || skill.name.toLowerCase().includes('magnitude')))) {
      if (skill.visual) {
        this.particleSystem.spawnMoveSpriteAnim(targetPos.x, targetPos.y, skill.visual, 0, target);
      }
      this.particleSystem.spawnShockwave(target.x, target.y, skill.radius || 95, skill.color || '#8D6E63', 0.6);
      this.particleSystem.spawnPixelBurst(targetPos.x, targetPos.y, skill.color || '#8D6E63', 35, 240, 0.6, 5);
      this.particleSystem.spawnDust(target.x, target.y, 10);
      if (this.arena && this.arena.addDecal) {
        this.arena.addDecal(target.x, target.y, 'crack', 34, 10.0);
      }
      this.arena.triggerScreenShake(18);
      this.resolveSkillHit(target, skill);
    } else if (mode === 'sky_strike') {
      if (skill.visual) {
        this.particleSystem.spawnMoveSpriteAnim(targetPos.x, targetPos.y, skill.visual, 0, target);
      }
      if (this.arena && this.arena.addDecal) {
        this.arena.addDecal(target.x, target.y, 'zap_burn', 30, 10.0);
      }
      this.arena.triggerScreenShake(18);
      this.resolveSkillHit(target, skill);
    } else if (mode === 'buff' || mode === 'barrier' || skill.category === 'Status') {
      const cb = skill.combatBehavior || {};
      const selfCenter = typeof this.getHitCenter === 'function' ? this.getHitCenter() : { x: this.x, y: this.y - 28 };
      
      // Determine elemental VFX theme:
      // If move has an elemental type other than Normal, use move's type.
      // If move is Normal/Status (e.g. Growl, Defense Curl, Growth, Roar), adopt the Pokémon's native type (e.g. Charizard -> Fire spiral)
      const primaryPokemonType = String(
        this.data?.type1 || 
        this.data?.species?.type1 || 
        (Array.isArray(this.data?.types) ? this.data.types[0] : null) || 
        this.data?.type || 
        'normal'
      ).toLowerCase();

      const moveType = String(skill.type || 'Normal').toLowerCase();
      const effectiveElem = (moveType && moveType !== 'normal') ? moveType : primaryPokemonType;

      // Target resolution for status moves / buffs:
      // If move visual explicitly defines target: 'target' or 'self', respect it.
      let targetsFoe = false;
      const explicitTarget = skill.visual?.target;
      if (explicitTarget === 'target' || explicitTarget === 'foe' || explicitTarget === 'opponent') {
        targetsFoe = true;
      } else if (explicitTarget === 'self') {
        targetsFoe = false;
      } else {
        const isSelfBuff = skill.internalName === 'NASTYPLOT' || skill.internalName === 'HONECLAWS' || skill.internalName === 'TAUNT' || skill.internalName === 'SNATCH' ||
          skill.internalName === 'DEFENDORDER' || skill.internalName === 'HEALORDER' || skill.internalName === 'QUIVERDANCE' ||
          skill.internalName === 'BULKUP' || skill.internalName === 'QUICKGUARD' || skill.internalName === 'ROOST' ||
          skill.internalName === 'DRAGONDANCE' || skill.internalName === 'MAGNETRISE';
        targetsFoe = !isSelfBuff && (
          skill.internalName === 'DARKVOID' || skill.internalName === 'EMBARGO' || skill.internalName === 'MEMENTO' ||
          skill.internalName === 'WILLOWISP' || skill.internalName === 'THUNDERWAVE' || (skill.type === 'Dark' && skill.category === 'Status') ||
          (Boolean(cb.secondaryStatus) && !cb.healPercent && !cb.isBarrier)
        );
      }
      const statusVfxTarget = targetsFoe ? targetPos : selfCenter;
      const attachedEntity = targetsFoe ? target : this;

      const noExtraVfx = skill.visual?.noExtraVfx === true || 
        skill.internalName === 'MAGNETRISE' || 
        skill.internalName === 'THUNDERWAVE';

      if (!noExtraVfx) {
        // Spawn rich ascending elemental spiral aura around Pokémon
        if (this.particleSystem && typeof this.particleSystem.spawnElementalBuffSpiral === 'function') {
          this.particleSystem.spawnElementalBuffSpiral(this.x, this.y, effectiveElem, skill.color || null, 0.85);
        }

        this.particleSystem.spawnShockwave(this.x, this.y, 65, skill.color || '#4CAF50', 0.5);
        this.particleSystem.spawnPixelBurst(selfCenter.x, selfCenter.y, skill.color || '#4CAF50', 25, 120, 0.5, 4);

        // Additional type-specific thematic bursts
        if (effectiveElem === 'fire') {
          this.particleSystem.spawnFire(selfCenter.x, selfCenter.y, 10);
        } else if (effectiveElem === 'water') {
          this.particleSystem.spawnWater(selfCenter.x, selfCenter.y, 10);
        } else if (effectiveElem === 'electric') {
          this.particleSystem.spawnSparks(selfCenter.x, selfCenter.y, 10);
        }

        if (effectiveElem === 'ghost' || effectiveElem === 'dark') {
          this.particleSystem.spawnPixelBurst(statusVfxTarget.x, statusVfxTarget.y, '#BA68C8', 24, 100, 0.45, 3);
          this.particleSystem.spawnShockwave(statusVfxTarget.x, statusVfxTarget.y, 60, '#4A148C', 0.4);
        }
      }

      const isDarkStatus = skill.type === 'Dark' && skill.category === 'Status';

      if (this.particleSystem && typeof this.particleSystem.spawnBuff === 'function') {
        this.particleSystem.spawnBuff(statusVfxTarget.x, statusVfxTarget.y, 0.85, skill.type || effectiveElem, skill.visual);
      } else if (skill.visual) {
        this.particleSystem.spawnMoveSpriteAnim(statusVfxTarget.x, statusVfxTarget.y, skill.visual, 0, attachedEntity);
      }

      if (isDarkStatus) {
        if (skill.internalName === 'DARKVOID') {
          target.applyStatus('sleep');
          this.particleSystem.addFloatingText(target.x, target.y - 28, 'SONO PROFUNDO!', 'status', false);
          this.onLog(`🌑 <strong>${target.data.name}</strong> adormeceu na escuridão de <strong>${skill.name}</strong>!`, 'dark');
        } else if (skill.internalName === 'TAUNT') {
          this.particleSystem.addFloatingText(target.x, target.y - 28, 'PROVOCADO!', 'status', false);
          this.onLog(`💢 <strong>${target.data.name}</strong> foi provocado por <strong>${skill.name}</strong>!`, 'dark');
        } else if (skill.internalName === 'TORMENT') {
          this.particleSystem.addFloatingText(target.x, target.y - 28, 'ATORMENTADO!', 'status', false);
          this.onLog(`⚡ <strong>${target.data.name}</strong> está atormentado por <strong>${skill.name}</strong>!`, 'dark');
        } else if (skill.internalName === 'TOPSYTURVY') {
          if (target.statStages) {
            for (const k in target.statStages) {
              target.statStages[k] = -target.statStages[k];
            }
            this.particleSystem.addFloatingText(target.x, target.y - 28, 'STATUS INVERTIDOS!', 'status', false);
            this.onLog(`🔄 Os atributos de <strong>${target.data.name}</strong> foram invertidos com <strong>${skill.name}</strong>!`, 'dark');
          }
        } else if (skill.internalName === 'NIGHTMARE') {
          target.isHavingNightmare = true;
          this.particleSystem.addFloatingText(target.x, target.y - 28, 'PESADELO!', 'ghost', true);
          this.onLog(`👻 <strong>${target.data.name}</strong> está sendo atormentado por <strong>${skill.name}</strong>!`, 'ghost');
        }
      }

      // Aromatherapy -> Cura todos os status da equipe
      if (skill.internalName === 'AROMATHERAPY') {
        if (this.statusEffect) {
          this.statusEffect = null;
          this.particleSystem.addFloatingText(this.x, this.y - 28, 'STATUS CURADO!', 'heal', true);
        }
        this.onLog(`🌸 <strong>${this.data.name}</strong> purificou a equipe com o aroma curativo de <strong>${skill.name}</strong>!`, 'heal');
      }

      // Leech Seed -> Drenagem no adversário
      if (skill.internalName === 'LEECHSEED') {
        target.isSeeded = true;
        this.particleSystem.addFloatingText(target.x, target.y - 28, 'DRENAGEM!', 'heal', false);
        this.onLog(`🌱 <strong>${target.data.name}</strong> foi infestado pelas <strong>${skill.name}</strong> de <strong>${this.data.name}</strong>!`, 'grass');
      }

      // Ingrain -> Enraizar para cura contínua
      if (skill.internalName === 'INGRAIN') {
        this.isIngrained = true;
        this.particleSystem.addFloatingText(this.x, this.y - 28, 'ENRAIZADO!', 'heal', false);
        this.onLog(`🌱 <strong>${this.data.name}</strong> fincou raízes profundas no solo com <strong>${skill.name}</strong>!`, 'grass');
      }

      // Defend Order (ID 15) -> Escudo verde de quitina
      const isDefendOrder = skill.internalName === 'DEFENDORDER' || (skill.name && skill.name.toLowerCase().includes('defend order'));
      if (isDefendOrder) {
        this.isGuarding = true;
        this.state = 'defending';
        this.defenseDurationTimer = 2.0;
        this.guardShieldPower = 0.85;
        this.defensiveMove = {
          name: 'Defend Order',
          shieldType: 'bug_chitin',
          duration: 2.0,
        };
        soundManager.playShieldActivate();
        this.particleSystem.spawnPixelBurst(selfCenter.x, selfCenter.y, '#76FF03', 25, 90, 0.45, 3);
        this.particleSystem.addFloatingText(this.x, this.y - 18, 'DEFEND ORDER!', 'heal');
        this.onLog(`🛡️ <strong>${this.data.name}</strong> ergueu um escudo de quitina com <strong>${skill.name}</strong>!`, 'bug');
      }

      // Barrier activation
      if (cb.isBarrier && !isDefendOrder) {
        this.isGuarding = true;
        this.state = 'defending';
        this.defenseDurationTimer = 1.8;
        this.guardShieldPower = 0.90; // 90% mitigation on Protect/Detect
        soundManager.playShieldActivate();
        this.particleSystem.addFloatingText(this.x, this.y - 18, skill.name, 'heal');
        this.onLog(`🛡️ <strong>${this.data.name}</strong> ativou proteção com <strong>${skill.name}</strong>!`, 'system');
      }

      // Heal Order (ID 16) -> VFX Healing verde
      const isHealOrder = skill.internalName === 'HEALORDER' || (skill.name && skill.name.toLowerCase().includes('heal order'));
      if (isHealOrder) {
        this.particleSystem.spawnPixelBurst(selfCenter.x, selfCenter.y, '#69F0AE', 28, 90, 0.5, 3);
        this.particleSystem.spawnPixelBurst(selfCenter.x, selfCenter.y, '#B9F6CA', 16, 60, 0.4, 2);
        this.particleSystem.spawnShockwave(this.x, this.y, 55, '#69F0AE', 0.4);
      }

      // Quiver Dance (ID 17) -> VFX verde de healing/buff e leve tremida para simular a dança
      const isQuiverDance = skill.internalName === 'QUIVERDANCE' || (skill.name && skill.name.toLowerCase().includes('quiver dance'));
      if (isQuiverDance) {
        this.quiverDanceTimer = 0.65; // Tremida e oscilação ritmada na renderização do sprite
        this.particleSystem.spawnPixelBurst(selfCenter.x, selfCenter.y, '#76FF03', 24, 85, 0.5, 3);
        this.particleSystem.spawnPixelBurst(selfCenter.x, selfCenter.y, '#B9F6CA', 18, 70, 0.45, 2);
        this.particleSystem.spawnShockwave(this.x, this.y, 60, '#76FF03', 0.45);
        this.onLog(`💃 <strong>${this.data.name}</strong> dançou elegantemente com <strong>${skill.name}</strong>!`, 'bug');
      }

      // Tail Glow (ID 21) -> VFX verde de buff radiante
      const isTailGlow = skill.internalName === 'TAILGLOW' || (skill.name && skill.name.toLowerCase().includes('tail glow'));
      if (isTailGlow) {
        this.particleSystem.spawnPixelBurst(selfCenter.x, selfCenter.y, '#76FF03', 30, 110, 0.55, 3.5);
        this.particleSystem.spawnPixelBurst(selfCenter.x, selfCenter.y, '#CCFF90', 20, 80, 0.45, 2.5);
        this.particleSystem.spawnShockwave(this.x, this.y, 70, '#76FF03', 0.5);
        this.onLog(`✨ <strong>${this.data.name}</strong> concentrou sua mente com uma cauda reluzente em <strong>${skill.name}</strong>!`, 'bug');
      }

      // Double Team (ID 359) -> Deixar cópia do Pokémon no campo por 2.0s
      if (skill.internalName === 'DOUBLETEAM' || skill.visual?.isDoubleTeam) {
        this.doubleTeamCloneTimer = 2.0;
        this.doubleTeamCloneOffsetX = (Math.random() > 0.5 ? 1 : -1) * 28;
        this.doubleTeamCloneOffsetY = (Math.random() - 0.5) * 8;
        this.particleSystem.addFloatingText(this.x, this.y - 18, 'DOUBLE TEAM!', 'dodge', true);
        this.onLog(`👥 <strong>${this.data.name}</strong> criou uma cópia ilusória com <strong>${skill.name}</strong>!`, 'normal');
      }

      // Growth (ID 369) -> Aumentar tamanho do Pokémon
      if (skill.internalName === 'GROWTH' || skill.visual?.isGrowth) {
        this.targetScaleMultiplier = Math.min(1.6, this.targetScaleMultiplier + 0.25);
        this.particleSystem.addFloatingText(this.x, this.y - 18, 'CRESCIMENTO!', 'heal', true);
        this.onLog(`🌱 <strong>${this.data.name}</strong> aumentou seu porte físico com <strong>${skill.name}</strong>!`, 'grass');
      }

      // Minimize (ID 384) -> Diminuir tamanho do Pokémon
      if (skill.internalName === 'MINIMIZE' || skill.visual?.isMinimize) {
        this.targetScaleMultiplier = Math.max(0.65, this.targetScaleMultiplier - 0.25);
        this.particleSystem.addFloatingText(this.x, this.y - 18, 'MINIMIZE!', 'dodge', true);
        this.onLog(`✨ <strong>${this.data.name}</strong> encolheu seu corpo para esquiva com <strong>${skill.name}</strong>!`, 'normal');
      }

      // Healing move (Recover, Roost, Softboiled, Heal Order, etc.)
      if (cb.healPercent && cb.healPercent > 0) {
        const healAmt = Math.round(this.maxHp * cb.healPercent);
        this.heal(healAmt, `+${healAmt} RECUPERADO!`);
        this.onLog(`✨ <strong>${this.data.name}</strong> recuperou HP com <strong>${skill.name}</strong>!`, 'heal');
      }

      // Stat stages changes for Status moves
      if (cb.statChanges && Array.isArray(cb.statChanges)) {
        for (const sc of cb.statChanges) {
          const affectedEntity = sc.target === 'self' ? this : target;
          if (affectedEntity && !affectedEntity.isFainted) {
            affectedEntity.modifyStatStage(sc.stat, sc.stages);
          }
        }
      }

      // Direct Status infliction on enemy from Status moves (Thunder Wave, Will-O-Wisp, Spore, etc.)
      if (cb.secondaryStatus && target && !target.isGuarding && !target.isFainted) {
        target.applyStatus(cb.secondaryStatus);
      }

      // Disable Move Mechanic (Disable, Torment, Spite, etc.)
      const isDisableMove = cb.isDisable || skill.internalName === 'DISABLE' || (skill.name && skill.name.toLowerCase().includes('disable'));
      if (isDisableMove && target && !target.isGuarding && !target.isFainted) {
        target.applyDisable(8.0, this);
      }

      this.onStateChange();
    } else {
      // Check for Multi-Hit moves (Twineedle, Double Kick, Pin Missile, Bullet Seed, Arm Thrust, etc.)
      const cb = skill.combatBehavior || {};
      const multiHitRange = cb.multiHit;
      if (multiHitRange && Array.isArray(multiHitRange)) {
        const minHits = multiHitRange[0] || 2;
        const maxHits = multiHitRange[1] || minHits;
        const totalHits = minHits + Math.floor(Math.random() * (maxHits - minHits + 1));
        const origin = this.getAttackOrigin();

        for (let h = 0; h < totalHits; h++) {
          setTimeout(() => {
            if (this.isFainted || !target || target.isFainted) return;
            const jitterX = (Math.random() - 0.5) * 16;
            const jitterY = (Math.random() - 0.5) * 16;
            this.projectileSystem.spawn({
              sourceEntity: this,
              targetEntity: target,
              startX: origin.x,
              startY: origin.y,
              targetX: targetPos.x + jitterX,
              targetY: targetPos.y + jitterY,
              speed: (skill.speed || 580) + h * 30,
              radius: Math.max(10, (skill.projectileSize || 16) - 2),
              color: skill.color || getTypeColor(skill.type) || '#F08030',
              type: skill.type,
              skillData: skill,
              onHit: (t) => {
                this.resolveSkillHit(t, skill, totalHits);
                this.particleSystem.addFloatingText(t.x, t.y - 28, `HIT #${h + 1}!`, 'electric', false);
              },
            });
          }, h * 130);
        }
        this.onLog(`⚡ ${this.data.name} atacou em rajada de <strong>${totalHits} golpes</strong> com <strong>${skill.name}</strong>!`, skill.type.toLowerCase());
      } else {
        const isStruggleBug = skill.internalName === 'STRUGGLEBUG' || (skill.name && skill.name.toLowerCase().includes('struggle bug'));
        const isDarkPulse = skill.internalName === 'DARKPULSE' || (skill.name && skill.name.toLowerCase().includes('dark pulse'));
        const isNightDaze = skill.internalName === 'NIGHTDAZE' || (skill.name && skill.name.toLowerCase().includes('night daze'));
        const isSnarl = skill.internalName === 'SNARL' || (skill.name && skill.name.toLowerCase().includes('snarl'));
        const origin = this.getAttackOrigin();

        if (isDarkPulse) {
          // Dark Pulse: Projéteis sombrios em direção ao inimigo que ativam o spritesheet de impacto
          this.particleSystem.spawnShockwave(this.x, this.y, 65, '#4A148C', 0.45);
          this.particleSystem.spawnPixelBurst(this.x, this.y, '#BA68C8', 22, 110, 0.45, 3.5);

          const darkPulseCount = 3;
          for (let pIdx = 0; pIdx < darkPulseCount; pIdx++) {
            setTimeout(() => {
              if (this.isFainted || !target || target.isFainted) return;
              this.projectileSystem.spawn({
                sourceEntity: this,
                targetEntity: target,
                startX: origin.x,
                startY: origin.y,
                targetX: targetPos.x + (pIdx - 1) * 8,
                targetY: targetPos.y + (pIdx - 1) * 6,
                speed: 620 + pIdx * 25,
                radius: 18,
                color: '#4A148C',
                type: 'Dark',
                skillData: skill,
                isDarkPulse: true,
                onHit: (t) => {
                  if (pIdx === darkPulseCount - 1) {
                    this.resolveSkillHit(t, skill);
                    this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#BA68C8', 20, 100);
                  } else {
                    this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#7B1FA2', 10, 60);
                  }
                },
              });
            }, pIdx * 90);
          }
          this.onLog(`🌑 <strong>${this.data.name}</strong> liberou um pulso de aura sombria com <strong>${skill.name}</strong>!`, 'dark');
        } else if (isNightDaze) {
          // Night Daze: Onda de choque sombria + projéteis que ativam o spritesheet de impacto
          this.particleSystem.spawnShockwave(this.x, this.y, 85, '#7B1FA2', 0.55);
          this.particleSystem.spawnPixelBurst(this.x, this.y, '#BA68C8', 28, 140, 0.55, 4);
          if (this.arena && this.arena.triggerScreenShake) this.arena.triggerScreenShake(8);

          const dazeCount = 2;
          for (let dIdx = 0; dIdx < dazeCount; dIdx++) {
            setTimeout(() => {
              if (this.isFainted || !target || target.isFainted) return;
              this.projectileSystem.spawn({
                sourceEntity: this,
                targetEntity: target,
                startX: origin.x,
                startY: origin.y,
                targetX: targetPos.x + (dIdx === 0 ? -12 : 12),
                targetY: targetPos.y + (dIdx === 0 ? -8 : 8),
                speed: 580,
                radius: 24,
                color: '#26004D',
                type: 'Dark',
                skillData: skill,
                isNightDaze: true,
                onHit: (t) => {
                  if (dIdx === dazeCount - 1) {
                    this.resolveSkillHit(t, skill);
                    this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#BA68C8', 26, 130);
                    if (this.arena && this.arena.triggerScreenShake) this.arena.triggerScreenShake(8);
                    // 40% chance de reduzir precisão
                    if (Math.random() < 0.40) {
                      t.modifyStatStage('accuracy', -1);
                      this.particleSystem.addFloatingText(t.x, t.y - 28, 'PRECISÃO CAIU!', 'status', false);
                    }
                  } else {
                    this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#7B1FA2', 14, 80);
                  }
                },
              });
            }, dIdx * 115);
          }
          this.onLog(`🌑 <strong>${this.data.name}</strong> cobriu o campo em trevas lancinantes com <strong>${skill.name}</strong>!`, 'dark');
        } else if (isSnarl) {
          // Snarl: Disparo de onda sonora sombria acústica
          this.particleSystem.spawnShockwave(this.x, this.y, 50, '#BA68C8', 0.35);

          this.projectileSystem.spawn({
            sourceEntity: this,
            targetEntity: target,
            startX: origin.x,
            startY: origin.y,
            targetX: targetPos.x,
            targetY: targetPos.y,
            speed: 640,
            radius: 22,
            color: '#7B1FA2',
            type: 'Dark',
            skillData: skill,
            isDarkWave: true,
            onHit: (t) => {
              this.resolveSkillHit(t, skill);
              this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#BA68C8', 18, 90);
              t.modifyStatStage('spAtk', -1);
              this.particleSystem.addFloatingText(t.x, t.y - 28, 'SP. ATK CAIU!', 'status', false);
              this.onLog(`📢 <strong>${t.data.name}</strong> teve seu Ataque Especial reduzido pelo rosnado de <strong>${skill.name}</strong>!`, 'dark');
            },
          });
          this.onLog(`📢 <strong>${this.data.name}</strong> ecoou um rosnado de ondas sombrias com <strong>${skill.name}</strong>!`, 'dark');
        } else if (isStruggleBug) {
          // Struggle Bug: Disparo de 3 raios menores divididos em leque cônico
          const dx = targetPos.x - origin.x;
          const dy = targetPos.y - origin.y;
          const baseAngle = Math.atan2(dy, dx);
          const dist = Math.hypot(dx, dy) || 1;
          const angles = [baseAngle - 0.22, baseAngle, baseAngle + 0.22];

          angles.forEach((ang, idx) => {
            const tx = origin.x + Math.cos(ang) * dist;
            const ty = origin.y + Math.sin(ang) * dist;
            this.projectileSystem.spawn({
              sourceEntity: this,
              targetEntity: target,
              startX: origin.x,
              startY: origin.y,
              targetX: tx,
              targetY: ty,
              speed: 620,
              radius: 12,
              color: '#76FF03',
              type: 'Bug',
              skillData: skill,
              onHit: (t) => {
                this.resolveSkillHit(t, skill, 3);
                this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#76FF03', 10, 80);
              },
            });
          });
          this.onLog(`🌿 ${this.data.name} disparou feixes divididos de <strong>${skill.name}</strong>!`, 'bug');
        } else if (skill.internalName === 'TWISTER' || skill.visual?.isTwister || (skill.name && skill.name.toLowerCase().includes('twister'))) {
          // Twister: 3 projéteis de whirlwind.png disparados em formação cônica
          const dx = targetPos.x - origin.x;
          const dy = targetPos.y - origin.y;
          const baseAngle = Math.atan2(dy, dx);
          const dist = Math.hypot(dx, dy) || 1;
          const offsets = [-0.18, 0, 0.18];

          this.particleSystem.spawnShockwave(this.x, this.y, 45, '#38BDF8', 0.35);

          offsets.forEach((angOffset, idx) => {
            setTimeout(() => {
              if (this.isFainted || !target || target.isFainted) return;
              const ang = baseAngle + angOffset;
              const tx = origin.x + Math.cos(ang) * dist;
              const ty = origin.y + Math.sin(ang) * dist;

              this.projectileSystem.spawn({
                sourceEntity: this,
                targetEntity: target,
                startX: origin.x,
                startY: origin.y,
                targetX: tx,
                targetY: ty,
                speed: 600,
                radius: 20,
                color: '#38BDF8',
                type: 'Dragon',
                skillData: skill,
                isTwister: true,
                onHit: (t) => {
                  if (idx === 1) {
                    this.resolveSkillHit(t, skill);
                    this.particleSystem.spawnShockwave(t.x, t.y, 50, '#38BDF8', 0.4);
                  } else {
                    this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#38BDF8', 12, 80);
                  }
                  if (t && typeof t.applyTwisterKnockup === 'function') {
                    t.applyTwisterKnockup(0.85);
                  }
                },
              });
            }, idx * 75);
          });
          this.onLog(`🌪️ <strong>${this.data.name}</strong> disparou 3 ciclones devastadores com <strong>${skill.name}</strong>!`, 'dragon');
        } else if (skill.internalName === 'ROAROFTIME' || skill.visual?.isRoarOfTime || (skill.name && skill.name.toLowerCase().includes('roar of time')) || skill.internalName === 'DRAGONRAGE' || skill.visual?.isDragonRage || (skill.name && skill.name.toLowerCase().includes('dragon rage'))) {
          // Roar of Time / Dragon Rage: Projétil de dragon_breath_stream roxo com efeito burning no impacto
          const isRoar = skill.internalName === 'ROAROFTIME' || skill.visual?.isRoarOfTime || (skill.name && skill.name.toLowerCase().includes('roar of time'));
          this.particleSystem.spawnShockwave(this.x, this.y, 55, '#C084FC', 0.40);
          this.particleSystem.spawnPixelBurst(this.x, this.y, '#9333EA', 22, 120, 0.4, 3);

          this.projectileSystem.spawn({
            sourceEntity: this,
            targetEntity: target,
            startX: origin.x,
            startY: origin.y,
            targetX: targetPos.x,
            targetY: targetPos.y,
            speed: isRoar ? 680 : 620,
            radius: 22,
            color: '#A855F7',
            type: 'Dragon',
            skillData: skill,
            onHit: (t) => {
              this.resolveSkillHit(t, skill);
              this.particleSystem.spawnShockwave(t.x, t.y - 18, 55, '#C084FC', 0.35);
              this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#C084FC', 28, 160, 0.45, 3.5);
              if (this.arena && this.arena.triggerScreenShake) this.arena.triggerScreenShake(isRoar ? 14 : 7);
            },
          });
          this.onLog(`🔮 <strong>${this.data.name}</strong> disparou o sopro temporal púrpura com <strong>${skill.name}</strong>!`, 'dragon');
        } else {
          // Standard projectile (including Megahorn, Spider Web, Sticky Web, String Shot)
          const isMegahorn = skill.internalName === 'MEGAHORN' || (skill.name && skill.name.toLowerCase().includes('megahorn'));
          const isSpiderWeb = skill.internalName === 'SPIDERWEB' || (skill.name && skill.name.toLowerCase().includes('spider web'));
          const isStickyWeb = skill.internalName === 'STICKYWEB' || (skill.name && skill.name.toLowerCase().includes('sticky web'));
          const isStringShot = skill.internalName === 'STRINGSHOT' || (skill.name && skill.name.toLowerCase().includes('string shot'));
          const isAnyWeb = isSpiderWeb || isStickyWeb;

          this.projectileSystem.spawn({
            sourceEntity: this,
            targetEntity: target,
            startX: origin.x,
            startY: origin.y,
            targetX: targetPos.x,
            targetY: targetPos.y,
            speed: isMegahorn ? 720 : (isAnyWeb || isStringShot ? 600 : (skill.speed || 560)),
            radius: isMegahorn ? 22 : (isAnyWeb ? 20 : (isStringShot ? 14 : (skill.projectileSize || 18))),
            color: isMegahorn ? '#C5E1A5' : (isAnyWeb ? '#76FF03' : (isStringShot ? '#F1F8E9' : (skill.color || getTypeColor(skill.type) || '#F08030'))),
            type: skill.type,
            skillData: skill,
            isHorn: isMegahorn,
            isWeb: isAnyWeb,
            isStringShot: isStringShot,
            onHit: (t) => {
              if (isStringShot) {
                // String Shot: ao atingir, gera um casulo de fios de seda ao redor do alvo
                this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#F1F8E9', 24, 75, 0.45, 2.5);
                this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#76FF03', 14, 50, 0.35, 2);
                if (typeof this.particleSystem.spawnMoveSpriteAnim === 'function') {
                  this.particleSystem.spawnMoveSpriteAnim(t.x, t.y - 18, {
                    file: 'vfx/custom/spider_web.png',
                    cols: 8,
                    rows: 1,
                    startFrame: 0,
                    endFrame: 7,
                    fps: 16,
                    scale: 0.85,
                    key: 'spider_web',
                    theme: 'Casulo de Fios de Seda (String Shot)'
                  }, 0, t);
                }
                t.modifyStatStage('speed', -1);
                this.particleSystem.addFloatingText(t.x, t.y - 28, 'CASULO DE SEDA!', 'status', false);
                this.onLog(`🕸️ <strong>${t.data.name}</strong> foi envolvido em um casulo de seda e sua velocidade caiu!`, 'bug');
              } else if (isAnyWeb) {
                // Spider Web / Sticky Web: teia verde pegajosa prendendo o alvo
                this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#76FF03', 26, 90, 0.5, 3);
                this.particleSystem.spawnPixelBurst(t.x, t.y - 18, '#C5E1A5', 16, 60, 0.4, 2);
                if (typeof this.particleSystem.spawnMoveSpriteAnim === 'function') {
                  this.particleSystem.spawnMoveSpriteAnim(t.x, t.y - 18, {
                    file: 'vfx/custom/spider_web.png',
                    cols: 8,
                    rows: 1,
                    startFrame: 0,
                    endFrame: 7,
                    fps: 16,
                    scale: 1.0,
                    key: 'spider_web',
                    theme: 'Teia de Aranha (Spider/Sticky Web)'
                  }, 0, t);
                }
                t.modifyStatStage('speed', -1);
                this.particleSystem.addFloatingText(t.x, t.y - 28, 'PRESO NA TEIA!', 'bug', false);
                this.onLog(`🕸️ <strong>${t.data.name}</strong> foi aprisionado pela teia viscosa de <strong>${skill.name}</strong>!`, 'bug');
              } else {
                this.resolveSkillHit(t, skill);
              }
            },
          });
        }
      }
    }
  }

  resolveSkillHit(target, skill, hitCount = 1) {
    if (!target || target.isFainted) return;
    if (target.dodgeTimer > 0) {
      this.particleSystem.addFloatingText(target.x, target.y - 14, 'ESQUIVOU!', 'dodge', false);
      return;
    }

    const { damage, isCrit, typeMultiplier, isSuperEffective, isNotVeryEffective, isImmune } = calculateCombatDamage(this, target, skill);

    if (isImmune) {
      this.particleSystem.addFloatingText(target.x, target.y - 14, 'NÃO TEVE EFEITO...', 'normal', false);
      this.onLog(`🛡️ <strong>${target.data.name}</strong> não foi afetado pelo golpe!`, 'system');
      return;
    }

    let finalDmg = damage;

    // Se for golpe multi-hit (ex: Twineedle dividindo dano por 2, Pin Missile por projétil)
    if (hitCount > 1) {
      finalDmg = Math.max(1, Math.round(finalDmg / hitCount));
    }

    // 70% Damage reduction after winning an attack clash (30% reduction, once per move)
    if (skill.clashWonReduced || this.hasClashWonReduced) {
      finalDmg = Math.max(1, Math.round(finalDmg * 0.70));
      skill.clashWonReduced = false;
      this.hasClashWonReduced = false;
    }
    let isBlocked = false;
    if (target.isGuarding) {
      const mitigationPct = target.guardShieldPower || 0.70;
      const absorbedDmg = Math.round(finalDmg * mitigationPct);
      finalDmg = Math.max(1, finalDmg - absorbedDmg);
      isBlocked = true;

      if (typeof target.absorbGuardHit === 'function') {
        target.absorbGuardHit(absorbedDmg);
      }
    }

    const isStatusMove = skill.category === 'Status' || skill.power === 0;
    if (isStatusMove) {
      finalDmg = 0;
    } else {
      target.takeDamage(finalDmg, isCrit, isBlocked, skill.type.toLowerCase(), isSuperEffective, isNotVeryEffective);
    }

    const hitCenter = typeof target.getHitCenter === 'function' ? target.getHitCenter() : { x: target.x, y: target.y - 32 };
    const origin = typeof this.getAttackOrigin === 'function' ? this.getAttackOrigin() : { x: this.x, y: this.y - 28 };
    const hitAngle = Math.atan2(hitCenter.y - origin.y, hitCenter.x - origin.x);

    // =========================================================================
    // AUTHENTIC MOVE CATALOG COMBAT VISUAL DISPATCH (100% FIEL AO MOVE CATALOG)
    // =========================================================================
    const sName = skill.name || '';
    const sInternal = skill.internalName || '';
    const sFam = (skill.vfxFamily || '').toLowerCase();
    const sType = (skill.type || '').toUpperCase();
    const typeColor = getTypeColor(skill.type);

    const isThunderFang = sName === 'Thunder Fang' || sInternal === 'THUNDERFANG';
    const isAirCutter = Boolean(skill.visual?.isAirCutter || sInternal === 'AIRCUTTER');
    const isDracoMeteor = Boolean(skill.visual?.isDracoMeteor || sInternal === 'DRACOMETEOR');
    const isWhirlwind = Boolean((skill.visual?.isWhirlwind && !skill.visual?.isTwister) || sInternal === 'WHIRLWIND');
    const isNightDaze = Boolean(skill.visual?.isNightDaze || skill.visual?.isNightDazeBurst || sInternal === 'NIGHTDAZE' || sInternal === 'DARKPULSE' || sInternal === 'FOULPLAY' || sInternal === 'ASSURANCE' || sInternal === 'PAYBACK' || sInternal === 'DARKVOID' || sInternal === 'PARTINGSHOT');
    const isSpacialRend = Boolean(skill.visual?.isSpacialRend || sInternal === 'SPACIALREND');
    const isTwister = Boolean(skill.visual?.isTwister || sInternal === 'TWISTER' || sName.toLowerCase().includes('twister'));

    if (isTwister && target && typeof target.applyTwisterKnockup === 'function') {
      target.applyTwisterKnockup(0.85);
    }

    // Burning aura (catalog-identical vertical flame column) - single spawn point, Dragon moves only
    if (skill.visual?.isBurningAura && !skill.visual?.target?.includes('self') && skill.type === 'Dragon') {
      const auraColor = skill.visual.color || '#A855F7';
      const auraFilter = auraColor === '#22C55E'
        ? 'hue-rotate(290deg) saturate(2.0) brightness(1.15)'
        : 'hue-rotate(90deg) saturate(1.8) brightness(1.2)';
      this.particleSystem.spawnBurningAura(target.x, target.y, 0.95, skill.visual, target, auraColor, auraFilter);
    }

    if (isThunderFang) {
      // Thunder Fang: Leave ONLY thunder sprite, without procedural bite fangs
      this.particleSystem.spawnLightning(hitCenter.x, hitCenter.y, 0.40, skill.visual, null, true);
    } else if (isAirCutter) {
      this.particleSystem.spawnAirCutter(origin.x, origin.y, hitCenter.x, hitCenter.y, skill.visual, target, this, skill);
    } else if (isDracoMeteor) {
      this.particleSystem.spawnDracoMeteor(hitCenter.x, hitCenter.y, skill.visual, target, this, skill);
    } else if (isWhirlwind) {
      this.particleSystem.spawnWhirlwind(hitCenter.x, hitCenter.y, skill.visual, target, this, skill);
    } else if (isNightDaze) {
      this.particleSystem.spawnNightDaze(hitCenter.x, hitCenter.y, skill.visual, target, this, skill);
    } else if (isSpacialRend) {
      this.particleSystem.spawnSpacialRend(hitCenter.x, hitCenter.y, skill.visual, target, this, skill);
    } else if (sFam === 'electric' || sName.includes('Thunder') || sName.includes('Bolt') || sName.includes('Shock') || sType === 'ELECTRIC') {
      this.particleSystem.spawnLightning(hitCenter.x, hitCenter.y, 0.40, skill.visual, null, false);
      if (this.arena && this.arena.addDecal) this.arena.addDecal(target.x, target.y, 'zap_burn', 30, 9.0);
    } else if (skill.internalName === 'MEGAHORN' || (skill.name && skill.name.toLowerCase().includes('megahorn'))) {
      if (typeof this.particleSystem.spawnMoveSpriteAnim === 'function') {
        this.particleSystem.spawnMoveSpriteAnim(hitCenter.x, hitCenter.y, skill.visual || {
          file: 'vfx/dimension/spacial_rend.png',
          cols: 4,
          rows: 4,
          startFrame: 0,
          endFrame: 15,
          fps: 24,
          scale: 0.55,
          key: 'megahorn_impacto',
          theme: 'Impacto Perfurante MegaHorn (Spacial Rend Diminuído)'
        }, 0, target);
      }
      this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#8be316', 22, 160, 0.40, 3);
      this.particleSystem.spawnShockwave(hitCenter.x, hitCenter.y, 45, '#d5fa7a', 0.30);
      if (this.arena && this.arena.triggerScreenShake) this.arena.triggerScreenShake(10);
      if (this.arena && this.arena.addDecal) this.arena.addDecal(target.x, target.y, 'crack', 28, 8.0);
    } else if (sFam === 'slash' || sName.includes('Claw') || sName.includes('Slash') || sName.includes('Blade') || sName.includes('Scissor') || sName.includes('Cutter')) {
      this.particleSystem.spawnSlash(hitCenter.x, hitCenter.y, typeColor, false, 0.32, skill.visual);
    } else if (sFam === 'bite' || sName.includes('Bite') || sName.includes('Crunch') || sName.includes('Fang')) {
      this.particleSystem.spawnBite(hitCenter.x, hitCenter.y, 0.35, skill.visual);
    } else if (sFam === 'ground' || sType === 'GROUND' || sType === 'ROCK' || sName.includes('Earth') || sName.includes('Stone') || sName.includes('Rock')) {
      this.particleSystem.spawnEarth(hitCenter.x, target.y + 4, 0.70, skill.visual);
      if (this.arena && this.arena.addDecal) {
        const isFissure = sName.includes('Fissure') || sName.includes('Earthquake') || sName.includes('Magnitude') || sName.includes('Bulldoze') || sName.includes('Dig');
        const groundType = isFissure ? 'fissure_crack' : 'crater_spiked';
        this.arena.addDecal(target.x, target.y, groundType, isFissure ? 36 : 32, 9.0);
      }
    } else if (sFam === 'explosion') {
      this.particleSystem.createExplosion(hitCenter.x, hitCenter.y, skill.color || typeColor, 28, 220);
      if (skill.visual && !skill.visual.isDragonBreathStream && !skill.visual.file?.includes('dragon_breath_stream')) {
        this.particleSystem.spawnMoveSpriteAnim(hitCenter.x, hitCenter.y, skill.visual, 0);
      }
      if (this.arena && this.arena.addDecal) this.arena.addDecal(target.x, target.y, 'crater_round', 38, 10.0);
      this.arena.triggerScreenShake(16);
    } else if (skill.executionType === 'projectile' || sFam === 'projectile' || sFam === 'fire' || sFam === 'water' || sFam === 'shadow' || sFam === 'wind' || sFam === 'foliage' || sFam === 'ice' || sFam === 'poison' || sFam === 'psychic') {
      const vfile = skill.visual?.file || '';
      const isStreamBody = vfile.includes('dragon_breath_stream') || vfile.includes('pixel_fire/colored');
      const isImpactExplosion = !isStreamBody && (sType !== 'FIRE' || sFam === 'explosion' || vfile.includes('explosion') || vfile.includes('burst') || vfile.includes('impact'));
      if (skill.visual && isImpactExplosion) {
        this.particleSystem.spawnMoveSpriteAnim(hitCenter.x, hitCenter.y, skill.visual, 0);
      }
      this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, skill.color || typeColor, 22, 180, 0.45, 4);
      this.particleSystem.spawnShockwave(hitCenter.x, hitCenter.y, 48, skill.color || typeColor, 0.35);
      if (skill.visual?.isSnarl || sInternal === 'SNARL' || sName.toLowerCase().includes('snarl')) {
        this.particleSystem.spawnSoundWave(origin.x, origin.y, hitCenter.x, hitCenter.y, 0.45, true);
      }
      if (this.arena && this.arena.addDecal) {
        const decalType = sType === 'FIRE' ? 'scorch' : sType === 'WATER' ? 'wet' : sType === 'ELECTRIC' ? 'zap_burn' : sType === 'GROUND' || sType === 'ROCK' ? 'crack' : 'shadow';
        this.arena.addDecal(target.x, target.y, decalType, 28, 8.0);
      }
    } else {
      // Default / Physical strike
      this.particleSystem.spawnPunch(hitCenter.x, hitCenter.y, typeColor, 0.30, skill.visual);
    }

    if (!isStatusMove) {
      if (isSuperEffective) {
        this.onLog(`💥 <strong>É super efetivo!</strong> (${typeMultiplier}x)`, 'fire');
      } else if (isNotVeryEffective) {
        this.onLog(`🛡️ Não foi muito efetivo... (${typeMultiplier}x)`, 'system');
      }
      if (isCrit) {
        this.onLog(`⭐ <strong>Um acerto crítico!</strong>`, 'electric');
      }
    }

    // Knockback / Push mechanics
    const kx = target.x - this.x;
    const ky = target.y - this.y;
    const kDist = Math.hypot(kx, ky) || 1;
    const nx = kx / kDist;
    const ny = ky / kDist;

    const isMeleeHit = this.isMeleeSkill(skill);

    if (isMeleeHit) {

      const pushSpeed = target.isGuarding ? 260 : 540;
      target.applyPush(nx, ny, pushSpeed, this);
      this.recoilTimer = 0.12;
      this.vx = -nx * 85;
      this.vy = -ny * 85;
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      if (this.arena && this.arena.triggerScreenShake) {
        this.arena.triggerScreenShake(isCrit ? 10 : 5);
      }
      if (this.arena && this.arena.addDecal) {
        this.arena.addDecal(target.x, target.y, 'crack', 20);
      }
    } else if (skill.typeCategory === 'beam' || skill.typeCategory === 'stream' || skill.executionType === 'beam' || (skill.combatBehavior && skill.combatBehavior.executionType === 'beam') || this.isChannelingBeam) {
      const pushSpeed = target.isGuarding ? 220 : 480;
      const remainingBeamTime = Math.max(0.48, (this.channelingTimer || 0.65));
      target.applyBeamLock(remainingBeamTime, nx, ny, pushSpeed, this, skill.type.toLowerCase());
    } else if (skill.typeCategory === 'area_blast') {
      const pushSpeed = target.isGuarding ? 280 : 580;
      target.applyPush(nx, ny, pushSpeed, this);
    } else if (skill.typeCategory === 'sky_strike') {
      const pushSpeed = target.isGuarding ? 220 : 480;
      target.applyPush(nx, ny, pushSpeed, this);
    } else {
      const pushSpeed = target.isGuarding ? 200 : 420;
      target.applyPush(nx, ny, pushSpeed, this);
    }

    // Dynamic Status Infliction based on skill combatBehavior & secondaryEffect
    if (!target.isGuarding) {
      const cb = skill.combatBehavior || {};
      if (cb.secondaryStatus && Math.random() < (cb.secondaryChance || 0.3)) {
        target.applyStatus(cb.secondaryStatus);
      } else {
        if (skill.type === 'Fire' && Math.random() < 0.28) {
          target.applyStatus('burn');
        } else if (skill.type === 'Electric' && Math.random() < 0.28) {
          target.applyStatus('paralysis');
        } else if (skill.type === 'Poison' && Math.random() < 0.35) {
          target.applyStatus('poison');
        } else if (skill.type === 'Ice' && Math.random() < 0.28) {
          target.applyStatus('freeze');
        }
      }
    }

    // Apply Stat Stages modifications from Move specification
    const cb = skill.combatBehavior || {};
    if (cb.statChanges && Array.isArray(cb.statChanges)) {
      for (const sc of cb.statChanges) {
        const affectedEntity = sc.target === 'self' ? this : target;
        if (affectedEntity && !affectedEntity.isFainted) {
          affectedEntity.modifyStatStage(sc.stat, sc.stages);
        }
      }
    }

    // HP Drain recovery (e.g. Leech Life, Drain Punch, Mega Drain, Giga Drain)
    if (cb.drainPercent && cb.drainPercent > 0 && finalDmg > 0) {
      const healAmount = Math.max(1, Math.round(finalDmg * cb.drainPercent));
      this.heal(healAmount, `🌱 +${healAmount} DRENADO!`);
      this.particleSystem.burst(this.x, this.y, '#69F0AE', 16, 90, 0.45, 3);
    }

    // Recoil damage to user (e.g. Take Down, Double-Edge, Flare Blitz, Brave Bird, Head Smash)
    if (cb.recoilPercent && cb.recoilPercent > 0 && finalDmg > 0) {
      const recoilDmg = Math.max(1, Math.round(finalDmg * cb.recoilPercent));
      this.takeDirectDamage(recoilDmg, `💥 -${recoilDmg} RECUO!`, 'physical');
      this.particleSystem.burst(this.x, this.y, '#FF5252', 12, 100, 0.35, 3);
      this.onLog(`⚠️ <strong>${this.data.name}</strong> sofreu ${recoilDmg} de dano de recuo!`, 'system');
    }

    // Fell Stinger (Ferrão Fatal): se o golpe nocauteou o alvo, eleva o Ataque do atacante em +3 estágios!
    const isFellStinger = skill.internalName === 'FELLSTINGER' || (skill.name && skill.name.toLowerCase().includes('fell stinger'));
    if (isFellStinger && target.currentHp <= 0 && !this.isFainted) {
      this.modifyStatStage('atk', 3);
      this.particleSystem.spawnPixelBurst(this.x, this.y - 18, '#FF5252', 20, 140, 0.5, 3);
      this.particleSystem.addFloatingText(this.x, this.y - 24, 'FELL STINGER: ATK +3!', 'physical', true);
      this.onLog(`🗡️ O ataque de <strong>${this.data.name}</strong> subiu drasticamente com <strong>Fell Stinger</strong> (+3)!`, 'bug');
    }

    soundManager.playHit(isSuperEffective, isBlocked);
    this.arena.triggerScreenShake(isCrit || isSuperEffective ? 14 : 7);
  }

  // Heal user HP with floating text and state update
  heal(amount, text = '') {
    if (this.isFainted) return;
    const oldHp = this.currentHp;
    this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
    const actualHeal = this.currentHp - oldHp;
    if (actualHeal > 0) {
      this.particleSystem.addFloatingText(this.x, this.y - 18, text || `+${actualHeal}`, 'heal', false);
      this.particleSystem.burst(this.x, this.y, '#69F0AE', 14, 80, 0.4, 3);
      this.onStateChange();
    }
  }

  // Modify Stat Stage (-6 to +6)
  modifyStatStage(statKey, stages) {
    if (this.isFainted || !this.statStages || stages === 0) return;
    const current = this.statStages[statKey] || 0;
    const next = Math.max(-6, Math.min(6, current + stages));
    if (current === next) {
      const msg = stages > 0 ? 'já não pode subir mais!' : 'já não pode descer mais!';
      this.onLog(`🛡️ Os atributos de <strong>${this.data.name}</strong> ${msg}`, 'system');
      return;
    }
    this.statStages[statKey] = next;
    const isBuff = stages > 0;
    const statLabels = { atk: 'Ataque', def: 'Defesa', spAtk: 'Sp. Atk', spDef: 'Sp. Def', speed: 'Velocidade', accuracy: 'Precisão' };
    const label = statLabels[statKey] || statKey;
    const verb = Math.abs(stages) >= 2
      ? (isBuff ? 'subiu drasticamente!' : 'caiu drasticamente!')
      : (isBuff ? 'subiu!' : 'caiu!');
    const color = isBuff ? '#00E676' : '#FF5252';

    this.particleSystem.spawnStatArrows(this.x, this.y, isBuff, color, 0.95, this);
    if (isBuff && this.particleSystem && typeof this.particleSystem.spawnElementalBuffSpiral === 'function') {
      const pType = String(
        this.data?.type1 || 
        this.data?.species?.type1 || 
        (Array.isArray(this.data?.types) ? this.data.types[0] : null) || 
        this.data?.type || 
        'normal'
      ).toLowerCase();
      this.particleSystem.spawnElementalBuffSpiral(this.x, this.y, pType, color, 0.7, this);
    }
    this.particleSystem.addFloatingText(
      this.x,
      this.y - 16,
      `${label} ${isBuff ? `+${stages}` : stages}`,
      isBuff ? 'heal' : 'physical',
      false
    );
    this.onLog(`📊 <strong>${this.data.name}</strong>: ${label} ${verb}`, isBuff ? 'heal' : 'system');
    this.onStateChange();
  }

  // Status effect application (burn, paralysis, poison, freeze, sleep, confusion, flinch)
  applyStatus(statusType) {
    if (this.isFainted || !statusType) return;
    if (statusType === 'flinch') {
      // Flinch: instant short stagger
      this.vx *= 0.1;
      this.vy *= 0.1;
      this.particleSystem.addFloatingText(this.x, this.y - 14, 'HESITOU!', 'electric', false);
      this.onLog(`⚠️ <strong>${this.data.name}</strong> hesitou e não pôde se mover!`, 'system');
      return;
    }

    if (this.statusEffect) return; // Only 1 primary status condition at a time

    let duration = 5.0;
    let label = '';
    let soundSE = null;

    if (statusType === 'burn') {
      duration = 6.0;
      label = 'QUEIMADURA!';
    } else if (statusType === 'paralysis') {
      duration = 5.5;
      label = 'PARALISIA!';
    } else if (statusType === 'poison') {
      duration = 7.0;
      label = 'ENVENENADO!';
    } else if (statusType === 'freeze') {
      duration = 3.5;
      label = 'CONGELADO!';
    } else if (statusType === 'sleep') {
      duration = 4.0;
      label = 'ADORMECEU!';
    } else if (statusType === 'confusion') {
      duration = 4.5;
      label = 'CONFUSÃO!';
    }

    this.statusEffect = {
      type: statusType,
      timer: duration,
      tickTimer: 0.7,
    };

    this.particleSystem.addFloatingText(this.x, this.y - 16, label, statusType === 'burn' ? 'fire' : (statusType === 'paralysis' ? 'electric' : 'ghost'), true);
    this.onLog(`⚠️ <strong>${this.data.name}</strong> foi afligido por <strong>${statusType.toUpperCase()}</strong>!`, 'system');
    this.onStateChange();
  }

  takeDamage(amount, isCrit, isBlocked, attackType, isSuper = false, isWeak = false) {
    if (this.isFainted || amount <= 0) return;

    // Complete evasion if actively dodging during hop window
    if (this.dodgeTimer > 0) {
      this.particleSystem.addFloatingText(this.x, this.y - 12, 'ESQUIVOU!', 'dodge', false);
      return;
    }

    // Invulnerability window (i-frames: 0.2s single-hit protection)
    if (this.iframesTimer > 0) {
      return;
    }
    this.iframesTimer = 0.2;

    this.currentHp = Math.max(0, Math.min(this.maxHp, this.currentHp - amount));
    this.hurtFlashTimer = 0.22; // White silhouette flash duration
    this.hitFreezeTimer = 0.085; // Subtle 85ms hit freeze for weighty physical impact

    if (!isBlocked) {
      this.hitStunTimer = Math.max(this.hitStunTimer || 0, 0.22); // Trava responsiva em 'tomando dano' para golpes contínuos
      this.state = 'hurt';
      this.vx *= 0.35;
      this.vy *= 0.35;
    }
    this.sprite.setAnimation('Hurt', false);

    if (isBlocked) {
      this.particleSystem.addFloatingText(this.x, this.y - 12, `-${amount} BLOQUEADO!`, 'blocked', false);
    } else if (isSuper) {
      this.particleSystem.addFloatingText(this.x, this.y - 12, `-${amount} SUPER EFETIVO!`, attackType, true);
    } else if (isCrit) {
      this.particleSystem.addFloatingText(this.x, this.y - 12, `-${amount} CRÍTICO!`, attackType, true);
    } else {
      this.particleSystem.addFloatingText(this.x, this.y - 12, `-${amount}`, attackType, false);
    }

    // Sync damage dealt to opponent over PvP socket relay
    if (this.engine && this.engine.isPvp && !this.isPlayer && !this._isApplyingPvpRemoteDamage) {
      this.engine.notifyPvpDamageDealt?.({
        amount,
        isCrit,
        isBlocked,
        attackType,
        isSuper,
        isWeak,
        newHp: this.currentHp,
        maxHp: this.maxHp
      });
    }

    this.onStateChange();

    if (this.currentHp <= 0) {
      this.faint();
    }
  }

  faint() {
    if (this.isFainted) return;
    this.isFainted = true;
    this.currentHp = 0;
    this.state = 'fainted';
    this.hitStunTimer = 0;
    this.vx = 0;
    this.vy = 0;
    if (this.beamLockTimer > 0) {
      this.beamLockTimer = 0;
    }
    if (this.isChannelingBeam) {
      this.cancelBeamChanneling('faint');
    }
    this.sprite.setAnimation('Faint', false);
    this.particleSystem.burst(this.x, this.y, '#9E9E9E', 40, 150, 1.2, 5);
    this.onLog(`💀 <strong>${this.data.name}</strong> foi derrotado!`, 'faint');
    soundManager.playCry(this.data.cry);
    this.onStateChange();
  }

  // Celebratory victory hopping & joy (Hop animation with bounce & confetti)
  celebrate() {
    if (this.isFainted) return;
    this.state = 'celebrating';
    this.vx = 0;
    this.vy = 0;
    if (this.isChannelingBeam) {
      this.cancelBeamChanneling('victory');
    }
    // Set to Hop animation (jumping / hopping celebration!)
    this.sprite.setAnimation('Hop', true);
    this.onLog(`🎉 <strong>${this.data.name}</strong> está comemorando a vitória!`, 'victory');
    this.onStateChange();
  }

  render(ctx) {
    if (this.isFainted) {
      ctx.save();
      // Render fallen defeat sprite clearly on the field (grounded)
      ctx.globalAlpha = 0.95;
      this.renderFloor(ctx);
      this.sprite.render(ctx, this.x, this.y, this.scale, false, false);
      ctx.restore();
      return;
    }

    if (this.state === 'celebrating') {
      ctx.save();
      // Hopping vertical bounce animation
      const hopY = -Math.abs(Math.sin(this.auraPulse * 8)) * 16;

      // Periodic victory confetti star sparkles
      if (Math.random() < 0.1) {
        const starColors = ['#FFD700', '#FF4081', '#00E5FF', '#76FF03'];
        const col = starColors[Math.floor(Math.random() * starColors.length)];
        this.particleSystem.spawnPixelBurst(
          this.x + (Math.random() - 0.5) * 40,
          this.y - 25 + hopY,
          col,
          5,
          70,
          0.45,
          3
        );
      }

      this.renderFloor(ctx);
      this.sprite.render(ctx, this.x, this.y + hopY, this.scale, false, false);
      ctx.restore();
      return;
    }

    if (this.recallProgress > 0) {
      ctx.save();
      const alpha = Math.max(0, 1 - this.recallProgress * 0.95);
      ctx.globalAlpha = alpha;
      const curScale = Math.max(0.1, this.scale * (1 - this.recallProgress * 0.45));
      ctx.filter = `brightness(${1 + this.recallProgress * 8}) drop-shadow(0 0 16px #ffffff)`;
      this.renderFloor(ctx);
      this.sprite.render(ctx, this.x, this.y, curScale, false, false);
      ctx.restore();
      return;
    }

    // 1. Render After-Images Ghost Trail (Investidas com rastros)
    const jumpY = this.jumpOffset || 0;
    const hoverY = (this.isFlying ? Math.sin(this.auraPulse * 2.8) * 5 - 10 : 0) + jumpY;
    for (const ai of this.afterImages) {
      if (this.sprite.renderAfterImage) {
        this.sprite.renderAfterImage(ctx, ai.x, ai.y + hoverY, this.scale, ai.alpha, ai.color);
      }
    }

    // 2. Drop shadow & stance ring
    this.renderFloor(ctx);

    // 3. Overworld Sprite (Flying pokemon gently hover above the ground, while grounded ones stay firmly planted)
    const isHurt = this.hurtFlashTimer > 0;
    // Leve tremida e balanço ritmado para Quiver Dance
    const danceJitterX = this.quiverDanceTimer > 0 ? Math.sin(this.auraPulse * 35) * 3.5 : 0;
    const danceJitterY = this.quiverDanceTimer > 0 ? Math.cos(this.auraPulse * 28) * 1.5 : 0;
    const effectiveScale = this.scale * (this.scaleMultiplier || 1.0);

    // Double Team: Render illusory clone beside the Pokémon during 2.0s duration
    if (this.doubleTeamCloneTimer > 0) {
      ctx.save();
      const cloneAlpha = Math.min(0.65, (this.doubleTeamCloneTimer / 2.0) * 0.75 + 0.15);
      ctx.globalAlpha = cloneAlpha;
      const cloneX = this.x + (this.doubleTeamCloneOffsetX || 26);
      const cloneY = this.y + hoverY + (this.doubleTeamCloneOffsetY || 0);
      this.sprite.render(ctx, cloneX, cloneY, effectiveScale, false, false);
      ctx.restore();
    }

    if (this.spinAngle) {
      ctx.save();
      const centerY = this.y + hoverY + danceJitterY - (effectiveScale * 20);
      const centerX = this.x + danceJitterX;
      ctx.translate(centerX, centerY);
      ctx.rotate(this.spinAngle);
      this.sprite.render(ctx, 0, effectiveScale * 20, effectiveScale, isHurt, this.isGuarding);
      ctx.restore();
    } else {
      this.sprite.render(ctx, this.x + danceJitterX, this.y + hoverY + danceJitterY, effectiveScale, isHurt, this.isGuarding);
    }

    // Megahorn Dash Drill Attachment (Anime & Game Reference)
    const isMegahornDashActive = this.state === 'dashing_strike' && this.currentDashingSkill &&
      (this.currentDashingSkill.internalName === 'MEGAHORN' || (this.currentDashingSkill.name && this.currentDashingSkill.name.toLowerCase().includes('megahorn')));
    if (isMegahornDashActive) {
      const drillImg = getMoveAnimImg('vfx/custom/megahorn_drill.png');
      if (drillImg && drillImg.complete && drillImg.naturalWidth > 0) {
        const cols = 6;
        const fw = 64;
        const fh = 36;
        const totalT = this.totalDashTimer || 0.42;
        const elapsed = Math.max(0, totalT - this.stateTimer);
        const frame = Math.floor(elapsed * 24) % cols;
        const sx = frame * fw;
        const sy = 0;

        let dashAngle;
        if (this.target && !this.target.isFainted) {
          dashAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        } else {
          dashAngle = Math.atan2(this.vy, this.vx);
        }

        const headPos = typeof this.getBeamOrigin === 'function' ? this.getBeamOrigin() : { x: this.x, y: this.y - 14 };
        const scale = 1.15;
        const dw = fw * scale;
        const dh = fh * scale;

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.globalCompositeOperation = 'source-over';
        ctx.translate(Math.round(headPos.x), Math.round(headPos.y));
        ctx.rotate(dashAngle);
        ctx.drawImage(drillImg, sx, sy, fw, fh, -8, -dh / 2, dw, dh);
        ctx.restore();
      }
    }

    // 4. Combat Defense Barrier: 8-Directional Hexagonal Energy Shield with Startup & Disappear
    if (this.state === 'defending') {
      const shieldImg = getMoveAnimImg('vfx/custom/shield_bubble.png');
      if (shieldImg && shieldImg.complete && shieldImg.naturalWidth > 0) {
        const cols = 5;
        const rows = 4;
        const totalDuration = 1.5;
        const remaining = Math.max(0, this.defenseDurationTimer || 0);
        const elapsed = Math.max(0, totalDuration - remaining);

        // 3-Phase Animation Lifecycle:
        // Startup (0.35s): Frames 0 to 9 (Hexagons expand and form curved barrier dome)
        // Sustain (0.35s to 1.22s): Frames 10 to 15 (Active barrier with energy sweep loop)
        // Disappear/Fadeout (last 0.28s): Frames 16 to 19 (Dissolves into wireframe hexes and vanishes)
        const startupDuration = 0.35;
        const outroDuration = 0.28;
        let currentFrame;

        if (elapsed < startupDuration) {
          const p = elapsed / startupDuration;
          currentFrame = Math.min(9, Math.floor(p * 10));
        } else if (remaining <= outroDuration) {
          const p = 1.0 - (remaining / outroDuration);
          currentFrame = 16 + Math.min(3, Math.floor(p * 4));
        } else {
          const sustainElapsed = elapsed - startupDuration;
          currentFrame = 10 + (Math.floor(sustainElapsed * 9) % 6);
        }

        const fw = shieldImg.naturalWidth / cols;
        const fh = shieldImg.naturalHeight / rows;
        const col = currentFrame % cols;
        const row = Math.floor(currentFrame / cols);
        const sx = col * fw;
        const sy = row * fh;

        // Facing direction (8 directions supported)
        let facingAngle;
        if (this.target && !this.target.isFainted) {
          facingAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        } else {
          const dir = this.sprite?.currentDirection ?? 0;
          facingAngle = PMD_DIR_ANGLES[dir] ?? (Math.PI / 2);
        }

        // Position slightly in front of the character along facing direction
        const frontDist = Math.max(18, this.radius * 0.90 + 12);
        const shieldX = this.x + Math.cos(facingAngle) * frontDist;
        const shieldY = (this.y - 10) + Math.sin(facingAngle) * frontDist;

        // In raw sprite, the convex arc faces left (Math.PI). Rotate so it faces facingAngle.
        const shieldRotation = facingAngle - Math.PI;

        const shieldScale = Math.max(0.42, (this.radius / 18) * 0.48);
        const dw = fw * shieldScale;
        const dh = fh * shieldScale;

        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.translate(Math.round(shieldX), Math.round(shieldY));
        ctx.rotate(shieldRotation);
        ctx.globalCompositeOperation = 'lighter';

        if (this.guardBlockFlashTimer > 0) {
          ctx.globalAlpha = 1.0;
          ctx.filter = 'brightness(1.5) contrast(1.2)';
        } else {
          ctx.globalAlpha = 0.95;
        }

        ctx.drawImage(
          shieldImg,
          sx, sy, fw, fh,
          Math.round(-dw / 2),
          Math.round(-dh / 2),
          Math.round(dw),
          Math.round(dh)
        );
        ctx.restore();
      } else {
        // Fallback procedural barrier if sprite is loading
        const shieldType = this.defensiveMove?.shieldType || 'psychic_barrier';
        renderDefensiveBarrier(
          ctx,
          this.x,
          this.y - 12,
          shieldType,
          this.radius * 1.25,
          this.auraPulse,
          0.55
        );
      }
    } else if (this.isGuarding) {
      // Passive defensive stance: subtle, soft ground ring and deflection shimmer
      this.renderPassiveGuardAura(ctx);
    }

    // 5. Active Status Effects Overlay (Paralisia, Veneno)
    if (this.statusEffect) {
      const effectTime = this.arena ? this.arena.time : Date.now() * 0.001;
      if (this.statusEffect.type === 'paralysis') {
        renderPixelParalysisArcs(ctx, this.x, this.y, effectTime);
      } else if (this.statusEffect.type === 'poison') {
        renderPixelPoisonBubbles(ctx, this.x, this.y, effectTime);
      }
    }

    // 6. Active Dizziness (Tontura) Stun Effect with orbiting golden pixel stars
    if (this.isDizzy) {
      const effectTime = this.arena ? this.arena.time : Date.now() * 0.001;
      renderDizzyStars(ctx, this.x, this.y, effectTime);
    }
  }

  // Subtle, non-obtrusive passive defensive posture aura at ground level
  renderPassiveGuardAura(ctx) {
    ctx.save();
    // Soft glowing ring on the ground under the Pokémon
    const pulseAlpha = Math.sin(this.auraPulse * 3.5) * 0.08 + 0.32;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 7, this.radius * 1.25, this.radius * 0.52, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 229, 255, ${pulseAlpha.toFixed(2)})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = -this.auraPulse * 12;
    ctx.stroke();

    // Deflection flash if a hit was just blocked
    if (this.guardBlockFlashTimer > 0) {
      const flashAlpha = Math.min(0.7, this.guardBlockFlashTimer * 3.2);
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.ellipse(this.x, this.y - 8, this.radius * 1.15, this.radius * 0.95, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${flashAlpha.toFixed(2)})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  renderFloor(ctx) {
    if (this.isFainted) return;

    ctx.save();
    const jumpY = Math.abs(this.jumpOffset || 0);
    const airProgress = Math.min(1.0, jumpY / 60);
    const flyingAir = this.isFlying ? 0.35 : 0;
    const totalAir = Math.min(1.0, airProgress + flyingAir);

    // Natural authentic pixel art shadow that softens and shrinks when airborne
    const shadowScale = Math.max(0.45, 1.0 - totalAir * 0.40);
    const shadowAlpha = Math.max(0.12, 0.30 * (1.0 - totalAir * 0.45));

    const effectiveScale = this.scaleMultiplier || 1.0;
    const rx = this.radius * 0.88 * shadowScale * effectiveScale;
    const ry = this.radius * 0.35 * shadowScale * effectiveScale;

    ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
