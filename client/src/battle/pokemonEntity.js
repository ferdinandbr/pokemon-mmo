// Pokemon Combatant Entity with Fast Dynamic Real-Time Movement & Turn Combat
import { getTypeMultiplier, calculateDodgeCooldown, calculateCombatDamage, calculateMoveCooldown } from './pokemonData.js';
import { soundManager } from './soundManager.js';
import { OverworldSprite } from './overworldSprite.js';
import {
  renderPixelBurnFlames,
  renderPixelParalysisArcs,
  renderPixelPoisonBubbles,
  renderPixelIceBlock,
  renderDefensiveBarrier,
  renderDizzyStars,
} from './pixelArtVfx.js';

// Species-specific attack origins (mouth, cannons, flower bloom, snout) across all 8 PMD directions:
// [0: DOWN, 1: DOWN_RIGHT, 2: RIGHT, 3: UP_RIGHT, 4: UP, 5: UP_LEFT, 6: LEFT, 7: DOWN_LEFT]
const SPECIES_ATTACK_ORIGINS = {
  // Blastoise (009): Dual shoulder cannons mounted high on carapace
  '009': [
    { x: 0, y: -56 },   // 0: DOWN (cannons firing over shoulders)
    { x: 32, y: -52 },  // 1: DOWN_RIGHT (front-right cannon angled forward)
    { x: 38, y: -54 },  // 2: RIGHT (cannons extended right)
    { x: 30, y: -66 },  // 3: UP_RIGHT (cannon angled up-right)
    { x: 0, y: -74 },   // 4: UP (cannons pointing straight up away from camera)
    { x: -30, y: -66 }, // 5: UP_LEFT (cannon angled up-left)
    { x: -38, y: -54 }, // 6: LEFT (cannons extended left)
    { x: -32, y: -52 }, // 7: DOWN_LEFT (front-left cannon angled forward)
  ],

  // Venusaur (003): Central palm-flower / mouth
  '003': [
    { x: 0, y: -42 },   // 0: DOWN
    { x: 26, y: -44 },  // 1: DOWN_RIGHT
    { x: 32, y: -46 },  // 2: RIGHT
    { x: 24, y: -54 },  // 3: UP_RIGHT
    { x: 0, y: -58 },   // 4: UP
    { x: -24, y: -54 }, // 5: UP_LEFT
    { x: -32, y: -46 }, // 6: LEFT
    { x: -26, y: -44 }, // 7: DOWN_LEFT
  ],

  // Charizard (006): Elevated dragon head / snout
  '006': [
    { x: 0, y: -66 },   // 0: DOWN
    { x: 30, y: -72 },  // 1: DOWN_RIGHT
    { x: 38, y: -76 },  // 2: RIGHT
    { x: 28, y: -84 },  // 3: UP_RIGHT
    { x: 0, y: -90 },   // 4: UP
    { x: -28, y: -84 }, // 5: UP_LEFT
    { x: -38, y: -76 }, // 6: LEFT
    { x: -30, y: -72 }, // 7: DOWN_LEFT
  ],

  // Mewtwo (150): Elevated psychic focal point / hands
  '150': [
    { x: 0, y: -52 },   // 0: DOWN
    { x: 26, y: -56 },  // 1: DOWN_RIGHT
    { x: 32, y: -60 },  // 2: RIGHT
    { x: 24, y: -68 },  // 3: UP_RIGHT
    { x: 0, y: -74 },   // 4: UP
    { x: -24, y: -68 }, // 5: UP_LEFT
    { x: -32, y: -60 }, // 6: LEFT
    { x: -26, y: -56 }, // 7: DOWN_LEFT
  ],

  // Pikachu (025): Compact electric cheeks / mouth
  '025': [
    { x: 0, y: -26 },   // 0: DOWN
    { x: 16, y: -28 },  // 1: DOWN_RIGHT
    { x: 22, y: -30 },  // 2: RIGHT
    { x: 16, y: -34 },  // 3: UP_RIGHT
    { x: 0, y: -38 },   // 4: UP
    { x: -16, y: -34 }, // 5: UP_LEFT
    { x: -22, y: -30 }, // 6: LEFT
    { x: -16, y: -28 }, // 7: DOWN_LEFT
  ],

  // Gengar (094): Wide shadowy grin
  '094': [
    { x: 0, y: -34 },   // 0: DOWN
    { x: 20, y: -38 },  // 1: DOWN_RIGHT
    { x: 26, y: -40 },  // 2: RIGHT
    { x: 20, y: -46 },  // 3: UP_RIGHT
    { x: 0, y: -50 },   // 4: UP
    { x: -20, y: -46 }, // 5: UP_LEFT
    { x: -26, y: -40 }, // 6: LEFT
    { x: -20, y: -38 }, // 7: DOWN_LEFT
  ],

  // Bulbasaur (001): Small quadruped bulb / mouth
  '001': [
    { x: 0, y: -24 },   // 0: DOWN
    { x: 16, y: -26 },  // 1: DOWN_RIGHT
    { x: 20, y: -28 },  // 2: RIGHT
    { x: 16, y: -32 },  // 3: UP_RIGHT
    { x: 0, y: -36 },   // 4: UP
    { x: -16, y: -32 }, // 5: UP_LEFT
    { x: -20, y: -28 }, // 6: LEFT
    { x: -16, y: -26 }, // 7: DOWN_LEFT
  ],
};

const DEFAULT_ATTACK_ORIGINS = [
  { x: 0, y: -42 },   // 0: DOWN
  { x: 24, y: -46 },  // 1: DOWN_RIGHT
  { x: 30, y: -50 },  // 2: RIGHT
  { x: 24, y: -58 },  // 3: UP_RIGHT
  { x: 0, y: -64 },   // 4: UP
  { x: -24, y: -58 }, // 5: UP_LEFT
  { x: -30, y: -50 }, // 6: LEFT
  { x: -24, y: -46 }, // 7: DOWN_LEFT
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
    onLog,
    onStateChange,
  }) {
    this.data = data;
    this.isPlayer = isPlayer;
    this.arena = arena;
    this.particleSystem = particleSystem;
    this.projectileSystem = projectileSystem;
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
    this.moves = Array.isArray(data.moves) && data.moves.length > 0
      ? data.moves.map((m, idx) => ({ ...m, currentCooldown: 0, index: idx }))
      : (data.skills || []).map((s, idx) => ({ ...s, currentCooldown: 0, index: idx }));
    this.skills = this.moves;
    this.physicalAttack = this.moves[0] || (data.physicalAttack ? { ...data.physicalAttack, cooldown: data.physicalAttack.cooldown || 0.8 } : {
      name: 'Investida',
      type: 'Normal',
      power: 40,
      cooldown: 0.8,
      sound: '/assets/audio/se/anim/Blow1.ogg',
    });

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

    // Dynamic wandering & orbiting
    this.orbitAngle = isPlayer ? Math.PI : 0;
    this.orbitDirection = isPlayer ? 1 : -1;
    this.changeOrbitTimer = 0;

    // Melee attack tracking & Anime recall progress
    this.currentDashingSkill = null;
    this.dashDirX = 0;
    this.dashDirY = 0;
    this.dashSpeed = 920;
    this.hasReactedToCurrentDash = false;
    this.recallProgress = 0;

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

  // Target center of mass (chest / torso) for incoming projectile and beam targeting
  getHitCenter() {
    const scaleFactor = (this.scale || 2.4) / 2.4;
    let torsoElevation = -36;
    if (this.data.id === '006') torsoElevation = -54; // Charizard
    else if (this.data.id === '009') torsoElevation = -46; // Blastoise
    else if (this.data.id === '003') torsoElevation = -38; // Venusaur
    else if (this.data.id === '150') torsoElevation = -50; // Mewtwo
    else if (this.data.id === '025') torsoElevation = -24; // Pikachu
    else if (this.data.id === '001') torsoElevation = -22; // Bulbasaur
    else if (this.data.id === '094') torsoElevation = -32; // Gengar

    return {
      x: this.x,
      y: Math.round(this.y + torsoElevation * scaleFactor),
    };
  }

  // Calculate precise attack origin (mouth, cannons, hands) based on facing direction and scale
  getAttackOrigin() {
    const dir = this.sprite ? this.sprite.currentDirection : 2;
    const scaleFactor = (this.scale || 2.4) / 2.4;
    const table = SPECIES_ATTACK_ORIGINS[this.data?.id] || DEFAULT_ATTACK_ORIGINS;
    const offset = table[dir] || table[2] || { x: 30, y: -50 };

    return {
      x: Math.round(this.x + offset.x * scaleFactor),
      y: Math.round(this.y + offset.y * scaleFactor),
    };
  }

  setStance(newStance) {
    if (this.stance === newStance) return true;

    // Check if trying to guard while exhausted or with no stamina
    if (newStance === 'defensive') {
      if (this.guardExhaustedTimer > 0 || this.guardMeter <= 12) {
        if (this.isPlayer) {
          this.particleSystem.addFloatingText(this.x, this.y - 18, '⚠️ VIGOR ESGOTADO!', 'status', false);
        }
        return false;
      }
      this.stance = 'defensive';
      this.isGuarding = true;
      soundManager.playShieldActivate();
      this.particleSystem.spawnShockwave(this.x, this.y, 45, '#00E5FF', 0.25);
      this.onLog(`${this.data.name} assumiu postura <strong style="color: #00E5FF">DEFENSIVA</strong>!`, 'defensive');
    } else {
      this.stance = 'offensive';
      this.isGuarding = false;
      this.onLog(`${this.data.name} assumiu postura <strong style="color: #FF5722">OFENSIVA</strong>!`, 'offensive');
    }

    this.onStateChange();
    return true;
  }

  toggleStance() {
    return this.setStance(this.stance === 'offensive' ? 'defensive' : 'offensive');
  }

  // Guard Break: Stamina depleted or shattered under heavy damage
  triggerGuardBreak() {
    this.guardMeter = 0;
    this.isGuarding = false;
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
    this.particleSystem.addFloatingText(this.x, this.y - 20, '🛡️💥 QUEBRA DE GUARDA!', 'blocked', true);
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

    this.particleSystem.addFloatingText(this.x, this.y - 15, `${icon} ${label}`, type, true);
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

  update(dt) {
    if (this.isFainted) {
      this.sprite.update(dt, false);
      return;
    }

    this.auraPulse += dt * 4;

    if (this.hurtFlashTimer > 0) {
      this.hurtFlashTimer -= dt;
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

    if (this.knockbackTimer > 0) {
      this.knockbackTimer = Math.max(0, this.knockbackTimer - dt);
      this.vx *= 0.86;
      this.vy *= 0.86;
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

    // Defensive Stance vs Offensive Stance stamina & cooldown dynamics:
    if (this.isGuarding || this.stance === 'defensive') {
      this.guardMeter = Math.max(0, this.guardMeter - this.guardDrainRate * dt);
      this.vx *= 0.65;
      this.vy *= 0.65;
      if (this.guardMeter <= 0) {
        this.triggerGuardBreak();
      }
    } else {
      // Regenerate guard stamina when in offensive stance and not exhausted
      if (this.guardExhaustedTimer <= 0 && this.guardMeter < this.guardMeterMax) {
        this.guardMeter = Math.min(this.guardMeterMax, this.guardMeter + this.guardRecoveryRate * dt);
      }
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

    // Defending State duration (Active Shield Move)
    if (this.state === 'defending') {
      this.defenseDurationTimer -= dt;
      this.vx *= 0.5;
      this.vy *= 0.5;
      if (this.defenseDurationTimer <= 0) {
        this.state = 'moving';
        this.isGuarding = (this.stance === 'defensive' && this.guardMeter > 0 && this.guardExhaustedTimer <= 0);
        this.guardShieldPower = 0.75;
        this.sprite.setAnimation('Idle', true);
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
        const origin = this.getAttackOrigin();
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
      this.vx *= 0.94;
      this.vy *= 0.94;
      if (this.dodgeTimer <= 0) {
        this.dodgeTimer = 0;
        // Turn immediately towards opponent upon dodge completion (e.g. after phasing behind)
        if (this.target && !this.target.isFainted) {
          this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
        }
      }
    }

    // High-speed After-Image trail generation (Investidas com rastros)
    if (this.state === 'dashing_strike' || this.dodgeTimer > 0) {
      this.afterImageTimer += dt;
      if (this.afterImageTimer >= 0.035) {
        this.afterImageTimer = 0;
        const color = this.currentAction ? this.currentAction.color : (this.isPlayer ? '#2979FF' : '#FF1744');
        this.afterImages.push({
          x: this.x,
          y: this.y,
          color,
          alpha: 0.65,
          duration: 0.22,
          time: 0,
        });
      }
    }

    // Update & fade after-images
    for (let i = this.afterImages.length - 1; i >= 0; i--) {
      const ai = this.afterImages[i];
      ai.time += dt;
      if (ai.time >= ai.duration) {
        this.afterImages.splice(i, 1);
      } else {
        ai.alpha = (1 - ai.time / ai.duration) * 0.65;
      }
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

    // Physics integration
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Keep entity strictly inside stadium ellipse and resolve obstacle collisions
    this.arena.resolveCollisions(this);

    // Sprite facing & step animation
    const speed = Math.hypot(this.vx, this.vy);
    const isMoving = speed > 15;
    if (this.state === 'moving' || this.state === 'guarding') {
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
    this.sprite.update(dt, isMoving && !this.isDizzy);

    // Dynamic Dust Particles on running
    if (speed > 80) {
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
    if (this.dodgeTimer > 0) return; // Allow hop dash velocity to play through without cancellation
    if (this.isKnockedBack || this.knockbackTimer > 0 || this.recoilTimer > 0) return; // Allow knockback & recoil slide to play through without cancellation!
    if (this.statusEffect && this.statusEffect.type === 'freeze') {
      this.vx = 0;
      this.vy = 0;
      return;
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
      let speedMult = this.stance === 'offensive' ? 1.25 : 1.0;
      if (this.statusEffect && this.statusEffect.type === 'paralysis') {
        speedMult *= 0.6; // Paralysis slows movement
      }
      const baseSpeed = (230 + this.data.stats.speed * 1.15) * speedMult;
      const targetVx = dirX * baseSpeed;
      const targetVy = dirY * baseSpeed;

      // Responsive acceleration
      this.vx += (targetVx - this.vx) * dt * 16;
      this.vy += (targetVy - this.vy) * dt * 16;
    } else {
      // Smooth deceleration to dead stop
      this.vx *= 0.8;
      this.vy *= 0.8;
      if (Math.hypot(this.vx, this.vy) < 8) {
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
    if (!this.target || this.target.isFainted || this.isFainted || this.isDizzy || this.state === 'celebrating' || this.isChannelingBeam || this.state === 'dashing_strike' || this.state === 'casting_skill' || this.state === 'defending') return;
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
    let speedMult = this.stance === 'offensive' ? 1.15 : 0.95;
    if (this.statusEffect && this.statusEffect.type === 'paralysis') {
      speedMult *= 0.6;
    }
    const baseSpeed = (190 + this.data.stats.speed * 1.0) * speedMult;

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

    // Smooth momentum transition
    this.vx += (targetVx - this.vx) * dt * 8;
    this.vy += (targetVy - this.vy) * dt * 8;
  }

  // Active Evasive Dodge (8-Directional double-tap dash with speed hatching blur & phasing through opponent)
  performEvasiveDodge(dirX = 0, dirY = 0) {
    if (this.isFainted || this.state === 'celebrating' || this.dodgeCooldown > 0 || this.isDizzy) return false;

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

    const dodgeSpd = 960; // Lightning fast evasive dash
    this.vx = dodgeX * dodgeSpd;
    this.vy = dodgeY * dodgeSpd;
    this.dodgeCooldown = this.dodgeCooldownMax; // Dynamic MMO cooldown based on Speed stat!
    this.dodgeTimer = 0.28; // Active invulnerable phasing window

    this.sprite.setDirectionFromVector(dodgeX, dodgeY);
    this.sprite.setAnimation('Hop', false);

    // Speed Hatching lines (rachuras de velocidade)
    const hatchColor = this.isPlayer ? '#00E5FF' : '#FF5252';
    const travelDist = dodgeSpd * 0.28;
    this.particleSystem.spawnSpeedHatching(
      this.x,
      this.y - 18,
      this.x + dodgeX * travelDist,
      this.y - 18 + dodgeY * travelDist,
      dodgeX,
      dodgeY,
      hatchColor,
      0.32
    );

    this.particleSystem.spawnDust(this.x, this.y + 12, 6);
    this.particleSystem.spawnShockwave(this.x, this.y, 45, '#FFFFFF', 0.22);
    soundManager.playPhysicalStrike();

    this.onLog(`💨 <strong>${this.data.name}</strong> executou uma <strong>Esquiva Ágil</strong> em alta velocidade!`, 'dodge');
    this.onStateChange();
    return true;
  }

  // EXECUTE PHYSICAL MELEE ATTACK (Modo Ofensivo)
  executePhysicalAttack() {
    if (!this.target || this.isFainted || this.isDizzy || this.state === 'dashing_strike' || this.state === 'casting_skill') return false;
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

    // Speed particles trail
    this.particleSystem.spawnDust(this.x, this.y + 12, 1);

    // VETOR FIXO: O dash se projeta em linha reta sem corrigir rota/homing.
    // O oponente pode se esquivar ou andar para os lados e fazer o golpe passar direto!
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
        const sk = this.currentDashingSkill;
        this.currentDashingSkill = null;
        if (sk) {
          this.resolveSkillHit(this.target, sk);
        } else {
          this.resolvePhysicalHit(this.target);
        }

        // Attacker recoil: recuo suave após impacto
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
      this.currentDashingSkill = null;
      this.state = 'moving';
      this.vx *= 0.25;
      this.vy *= 0.25;
      if (this.target && !this.target.isFainted) {
        this.sprite.faceTowards(this.target.x, this.target.y, this.x, this.y);
      }
      this.onStateChange();
    }
  }

  resolvePhysicalHit(target) {
    if (!target || target.isFainted) return;
    if (target.dodgeTimer > 0) {
      this.particleSystem.addFloatingText(target.x, target.y - 14, '💨 ESQUIVOU!', 'dodge', false);
      return;
    }

    const isCrit = Math.random() < 0.25;
    const baseDmg = (this.physicalAttack.power * (this.data.stats.atk / target.data.stats.def)) * 1.0;
    const critMult = isCrit ? 1.5 : 1.0;
    let finalDmg = Math.round(baseDmg * critMult);

    let isBlocked = false;
    if (target.isGuarding) {
      const targetDef = (target.data && target.data.stats) ? (target.data.stats.def || 50) : 50;
      const mitigationPct = Math.min(0.75, 0.45 + (targetDef / 400) * 0.30);
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
    const pushSpeed = target.isGuarding ? 160 : 360;
    target.applyPush(nx, ny, pushSpeed, this);

    this.recoilTimer = 0.12;
    this.vx = -nx * 85;
    this.vy = -ny * 85;
    this.sprite.faceTowards(target.x, target.y, this.x, this.y);

    const hitCenter = typeof target.getHitCenter === 'function' ? target.getHitCenter() : { x: target.x, y: target.y - 32 };

    const physVisual = this.physicalAttack?.visual || {
      file: '003-Attack01.png',
      cols: 5,
      rows: 2,
      startFrame: 0,
      endFrame: 4,
      fps: 18,
    };
    this.particleSystem.spawnMoveSpriteAnim(hitCenter.x, hitCenter.y, physVisual);

    const moveName = (this.physicalAttack.name || '').toLowerCase();
    if (moveName.includes('mordida') || moveName.includes('bite')) {
      this.particleSystem.spawnBite(hitCenter.x, hitCenter.y);
    } else if (moveName.includes('asa') || moveName.includes('garra') || moveName.includes('corte') || moveName.includes('vinha')) {
      this.particleSystem.spawnSlash(hitCenter.x, hitCenter.y, '#ECEFF1', false);
    } else {
      this.particleSystem.spawnPunch(hitCenter.x, hitCenter.y, '#FF9100');
    }

    if (this.arena && this.arena.addDecal) {
      this.arena.addDecal(target.x, target.y, 'crack', 22, 8.0);
    }

    this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, isBlocked ? '#00E5FF' : '#FF9100', 20, 190, 0.45, 4);
    soundManager.playHit(isCrit, isBlocked);
    this.arena.triggerScreenShake(isCrit ? 14 : 7);
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
    this.knockbackTimer = 0.24; // Subtle slide duration for controlled knockback
    this.knockbackAttacker = attacker;
    this.recoilTimer = 0;
    // Maintain eye contact with attacker while being pushed
    if (attacker && !attacker.isFainted) {
      this.sprite.faceTowards(attacker.x, attacker.y, this.x, this.y);
    }
    if (this.particleSystem && this.particleSystem.spawnDust) {
      this.particleSystem.spawnDust(this.x, this.y + 12, 4);
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
        this.arena.addDecal(this.x, this.y, 'crack', 28, 8.0);
      }
    }
    this.particleSystem.spawnPixelBurst(this.x, this.y, '#FFD700', 24, 180, 0.5, 4);
    this.particleSystem.spawnShockwave(this.x, this.y, 50, '#FFD700', 0.35);
    this.particleSystem.addFloatingText(this.x, this.y - 20, '💫 TONTURA! (1.5s)', 'electric', true);

    this.onLog(`💫 <strong>${this.data.name}</strong> colidiu contra o limite da arena e ficou <strong>TONTO</strong> por 1.5s!`, 'system');
    this.onStateChange();
  }

  // Identify whether a skill is a true physical melee contact attack (Tackle, Bite, Punches, Tails, etc.)
  isMeleeSkill(skill) {
    if (!skill) return false;

    // Direct contact declaration from Move Spec
    if (skill.combatBehavior && skill.combatBehavior.isContact) return true;

    const rawMode = (skill.executionType || skill.typeCategory || '').toLowerCase();
    if (rawMode === 'dash' || rawMode === 'melee_dash' || rawMode === 'strike') return true;

    const name = (skill.name || skill.internalName || '').toLowerCase();
    const meleeKeywords = [
      'tackle', 'investida', 'bite', 'mordida', 'crunch', 'mastigada', 'scratch', 'arranhão',
      'slash', 'corte', 'quick attack', 'ataque rápido', 'headbutt', 'cabeçada', 'slam',
      'pound', 'tail', 'cauda', 'punch', 'soco', 'punho', 'chop', 'golpe', 'strike',
      'fury', 'fúria', 'bind', 'constrição', 'megahorn', 'x-scissor', 'jab', 'claw', 'garra',
      'fang', 'presa', 'horn', 'chifre', 'peck', 'bicada', 'drill', 'broca', 'takedown',
      'take down', 'double-edge', 'body slam', 'wrap', 'clamp', 'superpower', 'close combat',
      'outrage', 'thrash', 'aqua tail', 'iron tail', 'poison jab', 'drain punch', 'mach punch'
    ];
    if (meleeKeywords.some(k => name.includes(k))) return true;

    if (rawMode === 'beam' || rawMode === 'area' || rawMode === 'area_blast' || rawMode === 'sky_strike' || rawMode === 'buff' || rawMode === 'barrier') return false;

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
    this.actionCooldown = 0.55;

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const spd = Math.max(900, skill.dashSpeed || 920);

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
    if (!this.target || this.isFainted || this.isDizzy || this.state === 'dashing_strike' || this.state === 'casting_skill') return false;

    const skill = this.skills[skillIndex];
    if (!skill) return false;

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
    skill.currentCooldown = skill.cooldown;

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
      this.fireSkill(this.currentAction);
      if (!this.isChannelingBeam) {
        this.state = 'moving';
      }
      this.currentAction = null;
      this.onStateChange();
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
    if (isMelee) {
      mode = 'dash';
    } else if (!mode) {
      mode = 'projectile';
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

      const origin = this.getAttackOrigin();

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
        target
      );

      if (this.arena && this.arena.addDecal) {
        this.arena.addDecal(target.x, target.y, skill.type === 'Water' ? 'wet' : 'scorch', 30, 9.0);
      }
      this.arena.triggerScreenShake(14);
      this.resolveSkillHit(target, skill);
    } else if (mode === 'area' || mode === 'area_blast' || (skill.name && (skill.name.toLowerCase().includes('earthquake') || skill.name.toLowerCase().includes('terremoto') || skill.name.toLowerCase().includes('magnitude')))) {
      if (skill.visual) {
        this.particleSystem.spawnMoveSpriteAnim(targetPos.x, targetPos.y, skill.visual);
      }
      this.particleSystem.spawnStoneEdge(target.x, target.y, 0.6);
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
        this.particleSystem.spawnMoveSpriteAnim(targetPos.x, targetPos.y, skill.visual);
      }
      this.particleSystem.spawnLightning(target.x, target.y);
      if (this.arena && this.arena.addDecal) {
        this.arena.addDecal(target.x, target.y, 'zap_burn', 30, 10.0);
      }
      this.arena.triggerScreenShake(18);
      this.resolveSkillHit(target, skill);
    } else if (mode === 'buff' || mode === 'barrier' || skill.category === 'Status') {
      const cb = skill.combatBehavior || {};
      this.particleSystem.spawnShockwave(this.x, this.y, 65, skill.color || '#4CAF50', 0.5);
      this.particleSystem.spawnPixelBurst(this.x, this.y, skill.color || '#4CAF50', 25, 120, 0.5, 4);
      if (skill.visual) {
        this.particleSystem.spawnMoveSpriteAnim(this.x, this.y - 20, skill.visual);
      }

      // Barrier activation
      if (cb.isBarrier) {
        this.isGuarding = true;
        this.state = 'defending';
        this.defenseDurationTimer = 1.8;
        this.guardShieldPower = 0.90; // 90% mitigation on Protect/Detect
        soundManager.playShieldActivate();
        this.particleSystem.addFloatingText(this.x, this.y - 18, `🛡️ ${skill.name}`, 'heal');
        this.onLog(`🛡️ <strong>${this.data.name}</strong> ativou proteção com <strong>${skill.name}</strong>!`, 'system');
      }

      // Healing move (Recover, Roost, Softboiled, Heal Order, etc.)
      if (cb.healPercent && cb.healPercent > 0) {
        const healAmt = Math.round(this.maxHp * cb.healPercent);
        this.heal(healAmt, `💚 +${healAmt} RECUPERADO!`);
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
              color: skill.color || '#00E5FF',
              type: skill.type,
              skillData: skill,
              onHit: (t) => {
                this.resolveSkillHit(t, skill);
                this.particleSystem.addFloatingText(t.x, t.y - 28, `HIT #${h + 1}!`, 'electric', false);
              },
            });
          }, h * 130);
        }
        this.onLog(`⚡ ${this.data.name} atacou em rajada de <strong>${totalHits} golpes</strong> com <strong>${skill.name}</strong>!`, skill.type.toLowerCase());
      } else {
        // Standard projectile
        const origin = this.getAttackOrigin();
        this.projectileSystem.spawn({
          sourceEntity: this,
          targetEntity: target,
          startX: origin.x,
          startY: origin.y,
          targetX: targetPos.x,
          targetY: targetPos.y,
          speed: skill.speed || 560,
          radius: skill.projectileSize || 18,
          color: skill.color || '#00E5FF',
          type: skill.type,
          skillData: skill,
          onHit: (t) => this.resolveSkillHit(t, skill),
        });
      }
    }
  }

  resolveSkillHit(target, skill) {
    if (!target || target.isFainted) return;
    if (target.dodgeTimer > 0) {
      this.particleSystem.addFloatingText(target.x, target.y - 14, '💨 ESQUIVOU!', 'dodge', false);
      return;
    }

    const { damage, isCrit, typeMultiplier, isSuperEffective, isNotVeryEffective, isImmune } = calculateCombatDamage(this, target, skill);

    if (isImmune) {
      this.particleSystem.addFloatingText(target.x, target.y - 14, 'NÃO TEVE EFEITO...', 'normal', false);
      this.onLog(`🛡️ <strong>${target.data.name}</strong> não foi afetado pelo golpe!`, 'system');
      return;
    }

    let finalDmg = damage;
    let isBlocked = false;
    if (target.isGuarding) {
      const targetDef = (target.data && target.data.stats) ? (target.data.stats.def || 50) : 50;
      const targetSpDef = (target.data && target.data.stats) ? (target.data.stats.spDef || 50) : 50;
      const statUsed = (skill.category === 'Special') ? targetSpDef : targetDef;
      const mitigationPct = Math.min(0.75, 0.45 + (statUsed / 400) * 0.30);
      const absorbedDmg = Math.round(finalDmg * mitigationPct);
      finalDmg = Math.max(1, finalDmg - absorbedDmg);
      isBlocked = true;

      if (typeof target.absorbGuardHit === 'function') {
        target.absorbGuardHit(absorbedDmg);
      }
    }

    target.takeDamage(finalDmg, isCrit, isBlocked, skill.type.toLowerCase(), isSuperEffective, isNotVeryEffective);

    const hitCenter = typeof target.getHitCenter === 'function' ? target.getHitCenter() : { x: target.x, y: target.y - 32 };

    // Spritesheet Animation centered at target body
    if (skill.visual) {
      this.particleSystem.spawnMoveSpriteAnim(hitCenter.x, hitCenter.y, skill.visual);
    }

    // 19 Visual Families VFX Dispatch
    const fam = skill.vfxFamily || '';
    if (fam === 'foliage') {
      this.particleSystem.spawnFoliageBurst(hitCenter.x, hitCenter.y, skill.color || '#4CAF50');
      this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#76FF03', 14, 140);
    } else if (fam === 'ice') {
      this.particleSystem.spawnIceCrystals(hitCenter.x, hitCenter.y, skill.color || '#80DEEA');
      this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#E0F7FA', 16, 140);
    } else if (fam === 'shadow') {
      this.particleSystem.spawnShadowPulse(hitCenter.x, hitCenter.y, skill.color || '#7B1FA2');
      this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#BA68C8', 16, 150);
    } else if (fam === 'psychic') {
      this.particleSystem.spawnPsychicRings(hitCenter.x, hitCenter.y, skill.color || '#F50057');
      this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#FF80AB', 16, 150);
    } else if (fam === 'bite') {
      this.particleSystem.spawnBite(hitCenter.x, hitCenter.y);
    } else if (fam === 'slash') {
      this.particleSystem.spawnSlash(hitCenter.x, hitCenter.y, skill.color || '#FFFFFF', false);
    } else if (fam === 'explosion') {
      this.particleSystem.createExplosion(hitCenter.x, hitCenter.y, skill.color || '#FF5722', 28, 220);
      this.arena.triggerScreenShake(16);
      if (this.arena.addDecal) this.arena.addDecal(target.x, target.y, 'scorch', 32, 9.0);
    } else if (fam === 'ground') {
      this.particleSystem.spawnStoneEdge(target.x, target.y, 0.48);
      this.particleSystem.spawnDust(target.x, target.y + 6, 8);
      if (this.arena.addDecal) this.arena.addDecal(target.x, target.y, 'crack', 28, 8.0);
    } else {
      // Type-based fallback particle accents
      const tLower = (skill.type || '').toLowerCase();
      if (tLower === 'fire') {
        this.particleSystem.spawnFlame(hitCenter.x, hitCenter.y, 5);
        this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#FF5722', 18, 150);
      } else if (tLower === 'water') {
        this.particleSystem.spawnWater(hitCenter.x, hitCenter.y, 6);
        this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#0288D1', 18, 150);
      } else if (tLower === 'electric') {
        this.particleSystem.spawnSparks(hitCenter.x, hitCenter.y, 7);
        this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#FFEB3B', 18, 160);
      } else if (tLower === 'grass') {
        this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#4CAF50', 16, 140);
      } else if (tLower === 'ice') {
        this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#80DEEA', 16, 140);
      } else if (tLower === 'rock' || tLower === 'ground') {
        const rockColor = tLower === 'ground' ? '#8D6E63' : '#B0BEC5';
        this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, rockColor, 22, 180, 0.45, 4);
        this.particleSystem.spawnDust(target.x, target.y + 6, 8);
        this.particleSystem.spawnStoneEdge(target.x, target.y, 0.48);
        if (this.arena && this.arena.addDecal) {
          this.arena.addDecal(target.x, target.y, 'crack', 28, 8.0);
        }
      } else {
        this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, skill.color || '#FFFFFF', 16, 150);
      }
    }

    if (isSuperEffective) {
      this.onLog(`💥 <strong>É super efetivo!</strong> (${typeMultiplier}x)`, 'fire');
    } else if (isNotVeryEffective) {
      this.onLog(`🛡️ Não foi muito efetivo... (${typeMultiplier}x)`, 'system');
    }
    if (isCrit) {
      this.onLog(`⭐ <strong>Um acerto crítico!</strong>`, 'electric');
    }

    // Knockback / Push mechanics
    const kx = target.x - this.x;
    const ky = target.y - this.y;
    const kDist = Math.hypot(kx, ky) || 1;
    const nx = kx / kDist;
    const ny = ky / kDist;

    const isMeleeHit = this.isMeleeSkill(skill);

    if (isMeleeHit) {
      const moveName = (skill.name || '').toLowerCase();
      if (moveName.includes('mordida') || moveName.includes('bite') || moveName.includes('crunch') || moveName.includes('fang')) {
        this.particleSystem.spawnBite(hitCenter.x, hitCenter.y);
      } else if (moveName.includes('garra') || moveName.includes('claw') || moveName.includes('corte') || moveName.includes('slash') || moveName.includes('scratch')) {
        this.particleSystem.spawnSlash(hitCenter.x, hitCenter.y, skill.color || '#FFFFFF', false);
      } else {
        this.particleSystem.spawnPunch(hitCenter.x, hitCenter.y, skill.color || '#FF9100');
      }

      const pushSpeed = target.isGuarding ? 160 : 360;
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
    } else if (skill.typeCategory === 'beam' || skill.typeCategory === 'stream') {
      const pushSpeed = target.isGuarding ? 140 : 320;
      target.applyPush(nx, ny, pushSpeed, this);
    } else if (skill.typeCategory === 'area_blast') {
      const pushSpeed = target.isGuarding ? 160 : 380;
      target.applyPush(nx, ny, pushSpeed, this);
    } else if (skill.typeCategory === 'sky_strike') {
      const pushSpeed = target.isGuarding ? 140 : 320;
      target.applyPush(nx, ny, pushSpeed, this);
    } else {
      const pushSpeed = target.isGuarding ? 120 : 280;
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
      this.particleSystem.addFloatingText(this.x, this.y - 18, text || `💚 +${actualHeal}`, 'heal', false);
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

    this.particleSystem.spawnStatArrows(this.x, this.y, isBuff, color);
    this.particleSystem.addFloatingText(
      this.x,
      this.y - 16,
      `${isBuff ? '🔺' : '🔻'} ${label} ${isBuff ? `+${stages}` : stages}`,
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
      this.particleSystem.addFloatingText(this.x, this.y - 14, '💫 HESITOU!', 'electric', false);
      this.onLog(`⚠️ <strong>${this.data.name}</strong> hesitou e não pôde se mover!`, 'system');
      return;
    }

    if (this.statusEffect) return; // Only 1 primary status condition at a time

    let duration = 5.0;
    let label = '';
    let soundSE = null;

    if (statusType === 'burn') {
      duration = 6.0;
      label = '🔥 QUEIMADURA!';
    } else if (statusType === 'paralysis') {
      duration = 5.5;
      label = '⚡ PARALISIA!';
    } else if (statusType === 'poison') {
      duration = 7.0;
      label = '🟣 ENVENENADO!';
    } else if (statusType === 'freeze') {
      duration = 3.5;
      label = '❄️ CONGELADO!';
    } else if (statusType === 'sleep') {
      duration = 4.0;
      label = '💤 ADORMECEU!';
    } else if (statusType === 'confusion') {
      duration = 4.5;
      label = '🌀 CONFUSÃO!';
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
    if (this.isFainted) return;

    // Complete evasion if actively dodging during hop window
    if (this.dodgeTimer > 0) {
      this.particleSystem.addFloatingText(this.x, this.y - 12, '💨 ESQUIVOU!', 'dodge', false);
      return;
    }

    // Invulnerability window (i-frames: 0.2s single-hit protection)
    if (this.iframesTimer > 0) {
      return;
    }
    this.iframesTimer = 0.2;

    this.currentHp = Math.max(0, Math.min(this.maxHp, this.currentHp - amount));
    this.hurtFlashTimer = 0.25;
    this.sprite.setAnimation('Hurt', false);

    if (isBlocked) {
      this.particleSystem.addFloatingText(this.x, this.y - 12, `🛡️ -${amount} BLOQUEADO!`, 'blocked', false);
    } else if (isSuper) {
      this.particleSystem.addFloatingText(this.x, this.y - 12, `💥 -${amount} SUPER EFETIVO!`, attackType, true);
    } else if (isCrit) {
      this.particleSystem.addFloatingText(this.x, this.y - 12, `⚡ -${amount} CRÍTICO!`, attackType, true);
    } else {
      this.particleSystem.addFloatingText(this.x, this.y - 12, `-${amount}`, attackType, false);
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
    this.vx = 0;
    this.vy = 0;
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
    const hoverY = this.isFlying ? Math.sin(this.auraPulse * 2.8) * 5 - 10 : 0;
    for (const ai of this.afterImages) {
      if (this.sprite.renderAfterImage) {
        this.sprite.renderAfterImage(ctx, ai.x, ai.y + hoverY, this.scale, ai.alpha, ai.color);
      }
    }

    // 2. Drop shadow & stance ring
    this.renderFloor(ctx);

    // 3. Overworld Sprite (Flying pokemon gently hover above the ground, while grounded ones stay firmly planted)
    const isHurt = this.hurtFlashTimer > 0;
    this.sprite.render(ctx, this.x, this.y + hoverY, this.scale, isHurt, this.isGuarding);

    // 4. Authentic Procedural Pixel-Art Defensive Barrier / Subtle Guard Aura
    if (this.state === 'defending') {
      // Active barrier skill running (Protect / Light Screen / Barrier / Withdraw)
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
    } else if (this.isGuarding) {
      // Passive defensive stance: subtle, soft ground ring and deflection shimmer
      this.renderPassiveGuardAura(ctx);
    }

    // 5. Active Status Effects Overlay in authentic pixel art (Congelamento, Paralisia, Queimadura, Veneno)
    if (this.statusEffect) {
      const effectTime = this.arena ? this.arena.time : Date.now() * 0.001;
      if (this.statusEffect.type === 'burn') {
        renderPixelBurnFlames(ctx, this.x, this.y, effectTime);
      } else if (this.statusEffect.type === 'paralysis') {
        renderPixelParalysisArcs(ctx, this.x, this.y, effectTime);
      } else if (this.statusEffect.type === 'poison') {
        renderPixelPoisonBubbles(ctx, this.x, this.y, effectTime);
      } else if (this.statusEffect.type === 'freeze') {
        renderPixelIceBlock(ctx, this.x, this.y, this.radius * 1.4);
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
    ctx.save();
    // Non-flying grounded Pokémon have shadow sitting directly under their paws/body base
    const shadowY = this.isFlying ? Math.round(this.y + 8) : Math.round(this.y - 1);
    const rx = this.isFlying ? this.radius * 0.95 : this.radius * 1.15;
    const ry = this.isFlying ? this.radius * 0.35 : this.radius * 0.42;
    const shadowAlpha = this.isFlying ? 0.28 : 0.48;

    ctx.beginPath();
    ctx.ellipse(this.x, shadowY, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
    ctx.fill();
    ctx.restore();
  }
}
