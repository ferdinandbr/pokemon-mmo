import { BattleArena } from './arena.js';
import { ParticleSystem } from './particleSystem.js';
import { ProjectileSystem } from './projectileSystem.js';
import { PokemonEntity } from './pokemonEntity.js';
import { InputManager } from './inputManager.js';
import { getPokemonById, adaptPokemonForBattle } from './pokemonData.js';
import { soundManager } from './soundManager.js';
import { AttackClashSystem } from './attackClashSystem.js';

export class BattleEngine {
  constructor({
    canvas,
    isTrainer = false,
    trainerSprite = 'boy_run',
    rivalTrainerSprite = 'boy_run',
    rivalTrainerName = 'Rival',
    isPvp = false,
    onPvpAction = null,
    onStateChange,
    onLogMessage,
    onMatchEnd,
    onPartySwitchRequired,
    onPokemonDeployed,
  }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isTrainer = Boolean(isTrainer);
    this.trainerSprite = trainerSprite || 'boy_run';
    this.rivalTrainerSprite = rivalTrainerSprite || 'boy_run';
    this.rivalTrainerName = rivalTrainerName || 'Rival';
    this.isPvp = Boolean(isPvp);
    this.onPvpAction = onPvpAction || null;
    this.onStateChange = onStateChange || (() => {});
    this.onLogMessage = onLogMessage || (() => {});
    this.onMatchEnd = onMatchEnd || (() => {});
    this.onPartySwitchRequired = onPartySwitchRequired || (() => {});
    this.onPokemonDeployed = onPokemonDeployed || (() => {});

    this.arena = new BattleArena(canvas);
    this.particleSystem = new ParticleSystem();
    this.projectileSystem = new ProjectileSystem(this.particleSystem, this.arena);
    this.clashSystem = new AttackClashSystem(this);
    this.inputManager = new InputManager();
    this.inputManager.onDodge = (dirX, dirY) => this.executePlayerDodge(dirX, dirY);

    this.playerEntity = null;
    this.enemyEntity = null;

    // 6-Pokemon Party Management
    this.playerParty = [];
    this.activePlayerIndex = 0;
    this.enemyParty = [];
    this.activeEnemyIndex = 0;
    this.isAwaitingSwitch = false;

    this.playerPokemonId = null;
    this.enemyPokemonId = null;

    // Engagement State: 'standby' (waiting on main choices menu) | 'active' (in real-time fight)
    this.combatState = 'standby';

    // Wild Encounter Standby & Trainer Visuals
    this.isIntroStandby = false;
    this.trainer = {
      x: 180,
      y: 290,
      targetX: 180,
      targetY: 290,
      scale: 0.80, // Balanced trainer scale in arena
      facing: 'right',
      frame: 8,
      isThrowing: false,
      throwTimer: 0,
      visible: true,
    };

    this.rivalTrainer = {
      x: 844,
      y: 290,
      targetX: 844,
      targetY: 290,
      scale: 0.80,
      facing: 'left',
      frame: 4, // frame 4 is facing left (row 1, col 0)
      isThrowing: false,
      throwTimer: 0,
      visible: Boolean(this.isTrainer || this.isPvp),
    };

    if (typeof Image !== 'undefined') {
      this.trainerImg = new Image();
      this.trainerImg.src = `/assets/characters/${this.trainerSprite}.png`;
      this.rivalTrainerImg = new Image();
      this.rivalTrainerImg.src = `/assets/characters/${this.rivalTrainerSprite}.png`;
      this.pokeballImg = new Image();
      this.pokeballImg.src = '/assets/items/poke-ball.png';
    }

    this._lastPvpSentMoving = false;
    this._opponentMoving = false;
    this._opponentMoveTimeout = 0;

    this.activePokeball = null;
    this.activeRecallBeam = null;

    // Pre-battle countdown lock
    this.isCountdownActive = false;

    // Direct Manual Control is the Default (WASD + 8 Directions)
    this.autoTurnEnabled = false;
    this.gameSpeed = 1.0;
    this.isPaused = false;
    this.isRunning = false;
    this.battleEnded = false;
    this.lastTime = 0;
    this.rafId = null;

    // AI cadence timers
    this.playerAutoTimer = 0;
    this.enemyAutoTimer = 1.2;
    this.pvpMovementRelayTimer = 0;

    // Singleton tracking to prevent dual animation loops or duplicate entities
    if (typeof window !== 'undefined') {
      if (window._activeBattleEngine && window._activeBattleEngine !== this) {
        try { window._activeBattleEngine.destroy(); } catch (e) {}
      }
      window._activeBattleEngine = this;
    }
  }

  setCombatActive(active) {
    this.combatState = active ? 'active' : 'standby';
    if (!active) {
      if (this.playerEntity) {
        this.playerEntity.vx = 0;
        this.playerEntity.vy = 0;
        this.playerEntity.currentSpeed = 0;
        if (this.playerEntity.state !== 'fainted') {
          this.playerEntity.state = 'moving';
          this.playerEntity.sprite?.setAnimation('Idle', true);
        }
      }
      if (this.enemyEntity) {
        this.enemyEntity.vx = 0;
        this.enemyEntity.vy = 0;
        this.enemyEntity.currentSpeed = 0;
        if (this.enemyEntity.state !== 'fainted') {
          this.enemyEntity.state = 'moving';
          this.enemyEntity.sprite?.setAnimation('Idle', true);
        }
      }
    }
  }

  setupMatchup(playerParam, enemyParam, options = {}) {
    const isWild = options.isWild !== undefined ? options.isWild : !this.isTrainer;
    this.isWild = isWild;

    const arenaKey = options.arenaKey || options.arena || 'arena_grass';
    if (this.arena?.loadArenaMap) {
      this.arena.loadArenaMap(arenaKey);
    }

    if (this.arena?.updateTimePhase) {
      this.arena.updateTimePhase(options.timePhase);
    }

    this.battleEnded = false;
    this.isAwaitingSwitch = false;
    this.combatState = 'standby';
    this.playerAutoTimer = 1.0;
    this.enemyAutoTimer = 3.5;

    // 1. Process Player Party (up to 6 Pokémon)
    if (Array.isArray(playerParam)) {
      this.playerParty = playerParam.map(p => adaptPokemonForBattle(p));
      const firstAlive = this.playerParty.findIndex(p => p.currentHp > 0);
      this.activePlayerIndex = firstAlive !== -1 ? firstAlive : 0;
    } else {
      const pData = typeof playerParam === 'string' ? getPokemonById(playerParam) : adaptPokemonForBattle(playerParam);
      this.playerParty = [pData];
      this.activePlayerIndex = 0;
    }

    // 2. Process Enemy Party (1 for wild, up to 6 for trainers)
    if (Array.isArray(enemyParam)) {
      this.enemyParty = enemyParam.map(e => adaptPokemonForBattle(e));
      const firstAliveEnemy = this.enemyParty.findIndex(e => e.currentHp > 0);
      this.activeEnemyIndex = firstAliveEnemy !== -1 ? firstAliveEnemy : 0;
    } else {
      const eData = typeof enemyParam === 'string' ? getPokemonById(enemyParam) : adaptPokemonForBattle(enemyParam);
      this.enemyParty = [eData];
      this.activeEnemyIndex = 0;
    }

    const currentP = this.playerParty[this.activePlayerIndex];
    const currentE = this.enemyParty[this.activeEnemyIndex];
    this.playerPokemonId = currentP ? currentP.id : null;
    this.enemyPokemonId = currentE ? currentE.id : null;

    this.arena.resize();
    const spawnPoints = this.arena.getSpawnPoints();

    if (this.arena.resetDecals) {
      this.arena.resetDecals();
    }
    this.particleSystem.reset();
    this.projectileSystem.reset();
    this.activePokeball = null;
    this.activeRecallBeam = null;

    this.enemyEntity = new PokemonEntity({
      data: currentE,
      isPlayer: false,
      initialX: spawnPoints.enemy.x,
      initialY: spawnPoints.enemy.y,
      initialFacing: spawnPoints.enemy.facing,
      arena: this.arena,
      particleSystem: this.particleSystem,
      projectileSystem: this.projectileSystem,
      engine: this,
      onLog: (msg, type) => this.onLogMessage(msg, type),
      onStateChange: () => this.checkMatchState(),
    });

    soundManager.playCry(currentE.cry);

    if (this.isWild) {
      // Wild encounter start flow:
      // Player stands in arena with overworld sprite, no Pokémon and no combat HUD
      this.isIntroStandby = true;
      this.playerEntity = null;
      this.trainer.x = 215;
      this.trainer.y = spawnPoints.player.y;
      this.trainer.targetX = 180;
      this.trainer.frame = 8;
      this.trainer.isThrowing = false;
      this.trainer.visible = true;
      if (this.rivalTrainer) {
        this.rivalTrainer.visible = false;
      }

      this.onLogMessage(
        `🌿 Um <strong>${currentE.name}</strong> selvagem apareceu! O que você vai fazer?`,
        'system'
      );
    } else {
      // Trainer or PvP battle: both trainers present at borders
      this.isIntroStandby = false;
      this.trainer.x = 180;
      this.trainer.y = spawnPoints.player.y;
      this.trainer.targetX = 180;
      this.trainer.frame = 8;
      this.trainer.visible = true;

      if (this.rivalTrainer) {
        this.rivalTrainer.x = 844;
        this.rivalTrainer.y = spawnPoints.enemy.y;
        this.rivalTrainer.targetX = 844;
        this.rivalTrainer.frame = 4; // Facing left towards arena
        this.rivalTrainer.facing = 'left';
        this.rivalTrainer.visible = true;
      }

      this.playerEntity = new PokemonEntity({
        data: currentP,
        isPlayer: true,
        initialX: spawnPoints.player.x,
        initialY: spawnPoints.player.y,
        initialFacing: spawnPoints.player.facing,
        arena: this.arena,
        particleSystem: this.particleSystem,
        projectileSystem: this.projectileSystem,
        engine: this,
        onLog: (msg, type) => this.onLogMessage(msg, type),
        onStateChange: () => this.checkMatchState(),
      });

      this.playerEntity.setOpponent(this.enemyEntity);
      this.enemyEntity.setOpponent(this.playerEntity);

      soundManager.playCry(currentP.cry);
      this.onLogMessage(
        `🏟️ Batalha de Treinador iniciada! <strong>${currentP.name}</strong> vs <strong>${currentE.name}</strong>!`,
        'system'
      );
    }

    this.onStateChange();
  }

  // Deploy Player Pokémon with Pokéball throw animation
  deployPlayerPokemon(index = this.activePlayerIndex) {
    if (!this.playerParty || !this.playerParty[index]) return false;
    const targetMon = this.playerParty[index];
    if (targetMon.currentHp <= 0 || targetMon.isFainted) {
      this.onLogMessage(`⚠️ ${targetMon.name} está desmaiado e não pode batalhar!`, 'system');
      return false;
    }

    this.activePlayerIndex = index;
    this.isAwaitingSwitch = false;
    this.playerPokemonId = targetMon.id;

    const spawnPoints = this.arena.getSpawnPoints();
    const startX = this.trainer.x + 8;
    const startY = this.trainer.y - 6;
    const targetX = spawnPoints.player.x;
    const targetY = spawnPoints.player.y;

    this.trainer.isThrowing = true;
    this.trainer.throwTimer = 0.55;
    this.trainer.frame = 9;

    soundManager.play('/assets/audio/se/battle_throw.ogg', 0.8);

    this.activePokeball = {
      startX,
      startY,
      targetX,
      targetY,
      x: startX,
      y: startY,
      progress: 0,
      duration: 0.52,
      rotation: 0,
      targetMon,
    };

    this.onLogMessage(`⚡ Vai, <strong>${targetMon.name}</strong>!`, 'system');
    this.onStateChange();
    return true;
  }

  // Anime-style recall with white/crimson laser beam & white energy dissolution
  recallPlayerPokemon(callback) {
    if (!this.playerEntity) {
      this.isIntroStandby = true;
      if (callback) callback();
      this.onStateChange();
      return;
    }

    soundManager.play('/assets/audio/se/battle_recall.wav', 0.8);

    const startX = this.trainer.x + 8;
    const startY = this.trainer.y - 6;
    const targetX = this.playerEntity.x;
    const targetY = this.playerEntity.y - 12;

    this.activeRecallBeam = {
      startX,
      startY,
      targetX,
      targetY,
      duration: 0.55,
      timer: 0.55,
      callback,
    };
  }

  // Switch Player Active Pokémon from Party (6-slot team support)
  switchPlayerPokemon(index) {
    if (!this.playerParty || !this.playerParty[index]) return false;
    const targetMon = this.playerParty[index];
    if (targetMon.currentHp <= 0 || targetMon.isFainted) {
      this.onLogMessage(`⚠️ ${targetMon.name} está desmaiado e não pode batalhar!`, 'system');
      return false;
    }

    if (this.activePlayerIndex === index && this.playerEntity && !this.playerEntity.isFainted) {
      this.onLogMessage(`ℹ️ ${targetMon.name} já está em combate!`, 'system');
      return false;
    }

    if (this.playerEntity && !this.playerEntity.isFainted) {
      this.recallPlayerPokemon(() => {
        this.deployPlayerPokemon(index);
        if (this.isPvp && this.onPvpAction) {
          this.onPvpAction({ type: 'switch', partyIndex: index });
        }
      });
      return true;
    }

    const res = this.deployPlayerPokemon(index);
    if (res && this.isPvp && this.onPvpAction) {
      this.onPvpAction({ type: 'switch', partyIndex: index });
    }
    return res;
  }

  // Handle incoming remote action for enemyEntity in PvP mode
  handleOpponentAction(action) {
    if (!this.enemyEntity || this.enemyEntity.isFainted || !this.isPvp) return;

    switch (action.type) {
      case 'move':
        if (typeof action.x === 'number' && typeof action.y === 'number') {
          // Reconcile opponent position smoothly
          const dx = action.x - this.enemyEntity.x;
          const dy = action.y - this.enemyEntity.y;
          if (Math.hypot(dx, dy) > 35) {
            this.enemyEntity.x = action.x;
            this.enemyEntity.y = action.y;
          } else {
            this.enemyEntity.x += dx * 0.35;
            this.enemyEntity.y += dy * 0.35;
          }
        }
        if (typeof action.dirX === 'number' && typeof action.dirY === 'number') {
          this.enemyEntity.moveManual(action.dirX, action.dirY, 0.033);
        }
        this._opponentMoving = (action.dirX !== 0 || action.dirY !== 0);
        this._opponentMoveTimeout = 0.12;
        break;

      case 'move_stop':
        if (typeof action.x === 'number' && typeof action.y === 'number') {
          this.enemyEntity.x = action.x;
          this.enemyEntity.y = action.y;
        }
        this.enemyEntity.vx = 0;
        this.enemyEntity.vy = 0;
        this.enemyEntity.currentSpeed = 0;
        this._opponentMoving = false;
        this._opponentMoveTimeout = 0;
        if (this.enemyEntity.sprite && this.enemyEntity.state !== 'fainted') {
          this.enemyEntity.sprite.setAnimation('Idle', true);
        }
        break;

      case 'dodge':
        this.enemyEntity.performEvasiveDodge(action.dirX || 0, action.dirY || 0);
        break;

      case 'physical':
        this.enemyEntity.executePhysicalAttack();
        break;

      case 'defensive':
        this.enemyEntity.executeDefenseAction();
        break;

      case 'skill':
        if (typeof action.skillIndex === 'number') {
          this.enemyEntity.executeSkill(action.skillIndex);
        }
        break;

      case 'switch':
        if (typeof action.partyIndex === 'number') {
          this.switchEnemyPokemon(action.partyIndex);
        }
        break;

      case 'damage_taken':
        if (this.playerEntity && !this.playerEntity.isFainted) {
          this.playerEntity._isApplyingPvpRemoteDamage = true;
          this.playerEntity.takeDamage(
            action.amount,
            action.isCrit,
            action.isBlocked,
            action.attackType || 'normal',
            action.isSuper,
            action.isWeak
          );
          if (typeof action.newHp === 'number') {
            this.playerEntity.currentHp = Math.max(0, action.newHp);
            if (this.playerEntity.currentHp === 0 && !this.playerEntity.isFainted) {
              this.playerEntity.faint();
            }
          }
          this.playerEntity._isApplyingPvpRemoteDamage = false;
          this.checkMatchState();
        }
        break;

      case 'pvp_match_defeat':
        if (!this.battleEnded) {
          this.battleEnded = true;
          if (this.enemyEntity) {
            this.enemyEntity.faint();
          }
          if (this.playerEntity && !this.playerEntity.isFainted) {
            this.playerEntity.celebrate();
          }
          soundManager.playVictory(this.isTrainer);
          this.onLogMessage(`🎉 Vitória! <strong>${this.playerEntity?.data?.name || 'Seu Pokémon'}</strong> venceu o duelo PvP!`, 'system');
          this.onMatchEnd('victory', this.playerEntity?.data);
        }
        break;
    }
  }

  notifyPvpDamageDealt(data) {
    if (!this.isPvp || !this.onPvpAction) return;
    this.onPvpAction({
      type: 'damage_taken',
      amount: data.amount,
      isCrit: Boolean(data.isCrit),
      isBlocked: Boolean(data.isBlocked),
      attackType: data.attackType || 'normal',
      isSuper: Boolean(data.isSuper),
      isWeak: Boolean(data.isWeak),
      newHp: data.newHp,
      maxHp: data.maxHp,
    });
  }

  // Switch Enemy Pokémon for Trainer battles
  switchEnemyPokemon(index) {
    if (!this.enemyParty || !this.enemyParty[index]) return false;
    const targetMon = this.enemyParty[index];
    if (targetMon.currentHp <= 0 || targetMon.isFainted) return false;

    this.activeEnemyIndex = index;
    this.enemyPokemonId = targetMon.id;

    const spawnPoints = this.arena.getSpawnPoints();
    this.particleSystem.createExplosion(spawnPoints.enemy.x, spawnPoints.enemy.y, targetMon.baseColor || '#2196F3', 35);
    soundManager.playShoot();

    this.enemyEntity = new PokemonEntity({
      data: targetMon,
      isPlayer: false,
      initialX: spawnPoints.enemy.x,
      initialY: spawnPoints.enemy.y,
      initialFacing: 'left',
      arena: this.arena,
      particleSystem: this.particleSystem,
      projectileSystem: this.projectileSystem,
      engine: this,
      onLog: (msg, type) => this.onLogMessage(msg, type),
      onStateChange: () => this.checkMatchState(),
    });

    this.enemyEntity.setOpponent(this.playerEntity);
    if (this.playerEntity) {
      this.playerEntity.setOpponent(this.enemyEntity);
    }

    soundManager.playCry(targetMon.cry);
    this.onLogMessage(`⚠️ Oponente enviou <strong>${targetMon.name}</strong>!`, 'system');
    this.onStateChange();
    return true;
  }

  checkMatchState() {
    this.onStateChange();

    if (this.battleEnded) return;

    // Sync active player entity HP to party
    if (this.playerEntity && this.playerParty && this.playerParty[this.activePlayerIndex]) {
      this.playerParty[this.activePlayerIndex].currentHp = this.playerEntity.currentHp;
      this.playerParty[this.activePlayerIndex].isFainted = this.playerEntity.isFainted;
    }

    if (this.playerEntity && this.playerEntity.isFainted) {
      if (this.playerParty && this.playerParty[this.activePlayerIndex]) {
        this.playerParty[this.activePlayerIndex].isFainted = true;
        this.playerParty[this.activePlayerIndex].currentHp = 0;
      }

      // Check if there are other conscious Pokémon in party
      const hasNextMon = this.playerParty.some((p, idx) => idx !== this.activePlayerIndex && p.currentHp > 0 && !p.isFainted);
      if (hasNextMon) {
        if (!this.isAwaitingSwitch) {
          this.isAwaitingSwitch = true;
          this.onLogMessage(`💀 <strong>${this.playerEntity.data.name}</strong> desmaiou! Escolha seu próximo Pokémon!`, 'system');
          this.onPartySwitchRequired(this.playerParty, this.activePlayerIndex);
        }
        return;
      }

      // Entire party fainted: Defeat
      this.battleEnded = true;
      if (this.enemyEntity && !this.enemyEntity.isFainted) {
        this.enemyEntity.celebrate();
      }
      this.onLogMessage(`💀 Todos os seus Pokémon desmaiaram! <strong>${this.enemyEntity?.data?.name || 'Oponente'}</strong> venceu!`, 'system');
      if (this.isPvp && this.onPvpAction) {
        this.onPvpAction({ type: 'pvp_match_defeat' });
      }
      this.onMatchEnd('defeat', this.enemyEntity?.data);
    } else if (this.enemyEntity && this.enemyEntity.isFainted) {
      if (this.enemyParty && this.enemyParty[this.activeEnemyIndex]) {
        this.enemyParty[this.activeEnemyIndex].isFainted = true;
        this.enemyParty[this.activeEnemyIndex].currentHp = 0;
      }

      // Check if trainer has remaining Pokémon in party
      const nextEnemyIdx = this.enemyParty.findIndex((p, idx) => idx !== this.activeEnemyIndex && p.currentHp > 0 && !p.isFainted);
      if (nextEnemyIdx !== -1) {
        this.onLogMessage(`💀 <strong>${this.enemyEntity.data.name}</strong> foi derrotado!`, 'system');
        setTimeout(() => {
          if (!this.battleEnded) {
            this.switchEnemyPokemon(nextEnemyIdx);
          }
        }, 1200);
        return;
      }

      // Entire enemy party defeated: Victory!
      this.battleEnded = true;
      if (this.playerEntity && !this.playerEntity.isFainted) {
        this.playerEntity.celebrate();
      }
      soundManager.playVictory(this.isTrainer);
      this.onLogMessage(`🎉 Vitória! <strong>${this.playerEntity.data.name}</strong> dominou a arena!`, 'system');
      this.onMatchEnd('victory', this.playerEntity.data);
    }
  }

  getPartyHpPayload() {
    if (this.playerEntity && this.playerParty && this.playerParty[this.activePlayerIndex]) {
      this.playerParty[this.activePlayerIndex].currentHp = this.playerEntity.currentHp;
      this.playerParty[this.activePlayerIndex].isFainted = this.playerEntity.isFainted;
    }

    if (!Array.isArray(this.playerParty)) return [];

    return this.playerParty.map(p => {
      if (!p) return null;
      const arenaMaxHp = p.maxHp || (p.stats && p.stats.hp) || 100;
      const arenaHpRatio = arenaMaxHp > 0 ? (p.currentHp / arenaMaxHp) : 0;
      const dbMaxHp = p.rawMaxHp || (p.stats && p.stats.hp) || 100;
      const finalDbHp = p.currentHp <= 0 ? 0 : Math.max(1, Math.round(arenaHpRatio * dbMaxHp));
      return {
        id: p.dbId,
        speciesId: p.speciesId,
        currentHp: finalDbHp,
        isFainted: p.currentHp <= 0
      };
    }).filter(p => p && p.id != null);
  }

  setPlayerStance(stance) {
    if (this.playerEntity && !this.battleEnded) {
      this.playerEntity.setStance(stance);
    }
  }

  togglePlayerStance() {
    if (this.playerEntity && !this.battleEnded) {
      this.playerEntity.toggleStance();
    }
  }

  // Player Manual Actions (execute immediately when clicked!)
  executePlayerPhysical() {
    if (this.playerEntity && !this.battleEnded && !this.isCountdownActive) {
      const res = this.playerEntity.executePhysicalAttack();
      if (res && this.isPvp && this.onPvpAction) {
        this.onPvpAction({ type: 'physical' });
      }
      return res;
    }
    return false;
  }

  executePlayerDodge(dirX = 0, dirY = 0) {
    if (this.playerEntity && !this.battleEnded && !this.isCountdownActive) {
      const res = this.playerEntity.performEvasiveDodge(dirX, dirY);
      if (res && this.isPvp && this.onPvpAction) {
        this.onPvpAction({ type: 'dodge', dirX: -dirX, dirY });
      }
      return res;
    }
    return false;
  }

  executePlayerBasicAttack() {
    if (this.playerEntity && !this.battleEnded && !this.isCountdownActive) {
      const res = this.playerEntity.executePhysicalAttack();
      if (res && this.isPvp && this.onPvpAction) {
        this.onPvpAction({ type: 'physical' });
      }
      this.onStateChange();
      return res;
    }
    return false;
  }

  // Pokéball Throw Arc & Capture Sequence for Wild Pokémon
  throwCaptureBall(ballName = 'poke-ball', onCapturedCallback = null) {
    if (!this.enemyEntity || this.enemyEntity.isFainted || !this.isWild) return false;

    const startX = this.playerEntity ? this.playerEntity.x : (this.trainer ? this.trainer.x + 8 : 180);
    const startY = this.playerEntity ? this.playerEntity.y - 10 : (this.trainer ? this.trainer.y - 6 : 280);
    const targetX = this.enemyEntity.x;
    const targetY = this.enemyEntity.y - 12;

    soundManager.play('/assets/audio/se/battle_throw.ogg', 0.85);

    this.activeCaptureBall = {
      ballName,
      startX,
      startY,
      targetX,
      targetY,
      x: startX,
      y: startY,
      progress: 0,
      duration: 0.65,
      rotation: 0,
      stage: 'flight', // 'flight' -> 'suction' -> 'wobble' -> 'settled'
      wobbleTimer: 0,
      wobbleCount: 0,
      wobbleAngle: 0,
      enemyMon: this.enemyEntity.data,
      onCapturedCallback,
    };

    if (this.trainer) {
      this.trainer.isThrowing = true;
      this.trainer.throwTimer = 0.55;
    }

    return true;
  }

  executePlayerDefensive() {
    if (this.playerEntity && !this.battleEnded && !this.isCountdownActive) {
      const def = this.playerEntity.executeDefenseAction();
      if (def && this.isPvp && this.onPvpAction) {
        this.onPvpAction({ type: 'defensive' });
      }
      this.onStateChange();
      return def;
    }
    return false;
  }

  executePlayerSkill(index) {
    if (this.playerEntity && !this.battleEnded && !this.isCountdownActive) {
      const res = this.playerEntity.executeSkill(index);
      if (res && this.isPvp && this.onPvpAction) {
        this.onPvpAction({ type: 'skill', skillIndex: index });
      }
      return res;
    }
    return false;
  }

  toggleAutoTurn() {
    this.autoTurnEnabled = !this.autoTurnEnabled;
    this.onLogMessage(
      `⚙️ Modo: ${this.autoTurnEnabled ? '<strong>AUTO-COMBATE</strong> (IA assume ações e movimentação)' : '<strong>CONTROLE MANUAL</strong> (Use WASD para mover e Shift para esquivar)'}`,
      'system'
    );
    this.onStateChange();
    return this.autoTurnEnabled;
  }

  setSpeed(speed) {
    this.gameSpeed = speed;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  openArena() {
    this.start();
  }

  closeArena() {
    this.stop();
    this.particleSystem.reset();
    this.projectileSystem.reset();
    this.clashSystem?.reset();
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    const rawDt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    const dt = Math.min(rawDt, 0.1) * this.gameSpeed;

    try {
      if (!this.isPaused && dt > 0) {
        this.update(dt);
      }
      this.render();
    } catch (err) {
      console.error('[BattleEngine] Error in main loop frame:', err);
    }

    this.rafId = requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    this.arena.update(dt);

    // 1. Update Trainer Position & Throw Animation
    if (this.trainer) {
      if (this.trainer.throwTimer > 0) {
        this.trainer.throwTimer -= dt;
        if (this.trainer.throwTimer <= 0) {
          this.trainer.isThrowing = false;
          this.trainer.frame = 8;
        }
      }
      if (this.trainer.x > this.trainer.targetX && !this.isIntroStandby) {
        this.trainer.x = Math.max(this.trainer.targetX, this.trainer.x - dt * 140);
      }
    }

    // 2. Update Pokéball Throw Arc Flight
    if (this.activePokeball) {
      const pb = this.activePokeball;
      pb.progress += dt / pb.duration;
      pb.rotation += dt * 16;
      const t = Math.min(1.0, pb.progress);
      pb.x = pb.startX + (pb.targetX - pb.startX) * t;
      const arcHeight = Math.sin(t * Math.PI) * 75;
      pb.y = pb.startY + (pb.targetY - pb.startY) * t - arcHeight;
      this.particleSystem.spawnDust(pb.x, pb.y + 4, 1);

      if (pb.progress >= 1.0) {
        soundManager.playShoot();
        this.particleSystem.spawnPixelBurst(pb.targetX, pb.targetY, pb.targetMon.baseColor || '#00E5FF', 30, 220, 0.6, 5);
        this.particleSystem.spawnShockwave(pb.targetX, pb.targetY, 70, '#FFFFFF', 0.4);
        if (this.arena && this.arena.triggerScreenShake) {
          this.arena.triggerScreenShake(8);
        }

        this.playerEntity = new PokemonEntity({
          data: pb.targetMon,
          isPlayer: true,
          initialX: pb.targetX,
          initialY: pb.targetY,
          initialFacing: 'right',
          arena: this.arena,
          particleSystem: this.particleSystem,
          projectileSystem: this.projectileSystem,
          engine: this,
          onLog: (msg, type) => this.onLogMessage(msg, type),
          onStateChange: () => this.checkMatchState(),
        });

        if (this.enemyEntity) {
          this.playerEntity.setOpponent(this.enemyEntity);
          this.enemyEntity.setOpponent(this.playerEntity);
        }

        soundManager.playCry(pb.targetMon.cry);
        this.isIntroStandby = false;
        this.activePokeball = null;
        this.setCombatActive(true);
        if (this.trainer) {
          this.trainer.isThrowing = false;
          this.trainer.frame = 8;
        }
        this.onPokemonDeployed?.(pb.targetMon);
        this.onStateChange();
      }
    }

    // 2.5. Update Pokéball Capture Throw & Wobbles
    if (this.activeCaptureBall) {
      const cb = this.activeCaptureBall;

      if (cb.stage === 'flight') {
        cb.progress += dt / cb.duration;
        cb.rotation += dt * 18;
        const t = Math.min(1.0, cb.progress);
        cb.x = cb.startX + (cb.targetX - cb.startX) * t;
        // Parabolic arc (curves upwards then descends towards the wild Pokémon)
        const arcHeight = Math.sin(t * Math.PI) * 95;
        cb.y = cb.startY + (cb.targetY - cb.startY) * t - arcHeight;
        this.particleSystem.spawnDust(cb.x, cb.y + 4, 1);

        if (cb.progress >= 1.0) {
          cb.stage = 'suction';
          cb.progress = 0;
          cb.duration = 0.45;
          soundManager.play('/assets/audio/se/battle_recall.wav', 0.85);
          this.particleSystem.spawnPixelBurst(cb.targetX, cb.targetY, '#FFFFFF', 25, 180, 0.4, 4);
          if (this.enemyEntity) {
            this.enemyEntity.isCapturedVisual = true;
          }
        }
      } else if (cb.stage === 'suction') {
        cb.progress += dt / cb.duration;
        if (this.enemyEntity) {
          this.enemyEntity.recallProgress = Math.min(1.0, cb.progress);
        }
        if (cb.progress >= 1.0) {
          cb.stage = 'wobble';
          cb.wobbleTimer = 0;
          cb.wobbleCount = 0;
          cb.wobbleAngle = 0;
          soundManager.play('/assets/audio/se/battle_ball_drop.wav', 0.85);
        }
      } else if (cb.stage === 'wobble') {
        cb.wobbleTimer += dt;
        // 3 distinct wobbles, 1.05s apart
        const cycle = cb.wobbleTimer % 1.05;
        if (cycle < 0.28) {
          cb.wobbleAngle = Math.sin((cycle / 0.28) * Math.PI * 2) * 0.38;
          if (cb._lastCycle !== Math.floor(cb.wobbleTimer / 1.05)) {
            cb._lastCycle = Math.floor(cb.wobbleTimer / 1.05);
            cb.wobbleCount++;
            soundManager.play('/assets/audio/se/battle_ball_shake.wav', 0.85);
            this.particleSystem.spawnDust(cb.targetX, cb.targetY + 8, 2);
          }
        } else {
          cb.wobbleAngle = 0;
        }

        if (cb.wobbleCount >= 3 && cb.wobbleTimer >= 3.2) {
          cb.stage = 'settled';
          soundManager.playCaptureSuccess();
          this.particleSystem.spawnPixelBurst(cb.targetX, cb.targetY, '#FFD700', 35, 200, 0.7, 5);
          this.particleSystem.spawnShockwave(cb.targetX, cb.targetY, 60, '#FFD700', 0.4);
          this.activeCaptureBall = null;
          if (cb.onCapturedCallback) {
            cb.onCapturedCallback(true);
          }
        }
      }
    }

    // 3. Update Anime Recall Laser Beam
    if (this.activeRecallBeam) {
      const beam = this.activeRecallBeam;
      beam.timer -= dt;
      const progress = Math.max(0, Math.min(1.0, 1 - (beam.timer / beam.duration)));

      if (this.playerEntity) {
        this.playerEntity.recallProgress = progress;
        beam.targetX = this.playerEntity.x;
        beam.targetY = this.playerEntity.y - 18;
        if (Math.random() < 0.4) {
          this.particleSystem.spawnPixelBurst(beam.targetX, beam.targetY, '#FFFFFF', 3, 90, 0.25, 2);
        }
      }

      if (beam.timer <= 0) {
        if (this.playerEntity && this.playerParty[this.activePlayerIndex]) {
          this.playerParty[this.activePlayerIndex].currentHp = this.playerEntity.currentHp;
          this.playerParty[this.activePlayerIndex].isFainted = this.playerEntity.isFainted;
        }
        this.playerEntity = null;
        this.isIntroStandby = true;
        const cb = beam.callback;
        this.activeRecallBeam = null;
        if (cb) cb();
        this.onStateChange();
      }
    }

    // If in STANDBY / MENU mode (waiting for player to select FIGHT or an action) or Countdown active:
    // Pokémon idle at their positions, no enemy AI movement or attacks occur!
    if (this.isCountdownActive || this.combatState !== 'active' || this.isIntroStandby) {
      if (this.playerEntity && !this.playerEntity.isFainted) {
        this.playerEntity.vx = 0;
        this.playerEntity.vy = 0;
        this.playerEntity.currentSpeed = 0;
        this.playerEntity.update(dt);
      }
      if (this.enemyEntity && !this.enemyEntity.isFainted) {
        this.enemyEntity.vx = 0;
        this.enemyEntity.vy = 0;
        this.enemyEntity.currentSpeed = 0;
        this.enemyEntity.update(dt);
      }
      this.projectileSystem.update(dt);
      this.particleSystem.update(dt);
      return;
    }

    if (this.playerEntity && !this.playerEntity.isFainted) {
      // 8-Direction WASD / Arrow Keys Movement with strict diagonal normalization
      const moveInput = this.inputManager.getMovementVector();
      if (moveInput.isMoving || !this.autoTurnEnabled) {
        this.playerEntity.moveManual(moveInput.dirX, moveInput.dirY, dt);
      } else if (this.autoTurnEnabled) {
        this.playerEntity.updateTacticalAIMovement(dt);
      }

      // Periodically relay movement and position in PvP mode (every 50ms)
      if (this.isPvp && this.onPvpAction) {
        this.pvpMovementRelayTimer -= dt;
        if (this.pvpMovementRelayTimer <= 0) {
          this.pvpMovementRelayTimer = 0.05;
          const hasVel = Math.abs(this.playerEntity.vx) > 5 || Math.abs(this.playerEntity.vy) > 5;
          if (moveInput.isMoving || hasVel) {
            this.onPvpAction({
              type: 'move',
              dirX: -moveInput.dirX, // Mirror X direction for opponent perspective
              dirY: moveInput.dirY,
              x: Math.round(1024 - this.playerEntity.x), // Mirror X across arena center (512)
              y: Math.round(this.playerEntity.y)
            });
            this._lastPvpSentMoving = true;
          } else if (this._lastPvpSentMoving) {
            this._lastPvpSentMoving = false;
            this.onPvpAction({
              type: 'move_stop',
              dirX: 0,
              dirY: 0,
              x: Math.round(1024 - this.playerEntity.x),
              y: Math.round(this.playerEntity.y)
            });
          }
        }
      }

      this.playerEntity.update(dt);

      // Auto-battle logic for player (only when explicitly enabled)
      if (!this.battleEnded && this.autoTurnEnabled && this.playerEntity.actionCooldown <= 0) {
        this.playerAutoTimer -= dt;
        if (this.playerAutoTimer <= 0) {
          this.playerAutoTimer = 0.95;
          this.executeAutoCombat(this.playerEntity);
        }
      }
    }

    if (this.enemyEntity && !this.enemyEntity.isFainted) {
      if (!this.isAwaitingSwitch) {
        if (!this.isPvp) {
          // Stable tactical movement for enemy AI in PvE (no random spinning/circling)
          this.enemyEntity.updateTacticalAIMovement(dt);
          this.enemyEntity.update(dt);

          // Enemy AI decision cadence
          if (!this.battleEnded && this.enemyEntity.actionCooldown <= 0) {
            this.enemyAutoTimer -= dt;
            if (this.enemyAutoTimer <= 0) {
              this.enemyAutoTimer = 2.4;
              this.executeEnemyAI(this.enemyEntity);
            }
          }
        } else {
          // In PvP, enemy movement and actions are driven remotely via socket relay
          if (this._opponentMoveTimeout > 0) {
            this._opponentMoveTimeout -= dt;
            if (this._opponentMoveTimeout <= 0) {
              this._opponentMoving = false;
              this.enemyEntity.moveManual(0, 0, dt);
            }
          } else {
            this.enemyEntity.moveManual(0, 0, dt);
          }
          this.enemyEntity.update(dt);
        }
      } else {
        // Opponent holds position and idles while player selects next Pokémon
        this.enemyEntity.update(dt);
      }
    }

    // Mutual entity separation (prevents combatants from overlapping)
    this.resolveEntitySeparation();

    // Resolve Simultaneous Attack Clashes (Physical, Projectile, Beam)
    if (this.clashSystem) {
      this.clashSystem.update(dt);
    }

    this.projectileSystem.update(dt);
    this.particleSystem.update(dt);
  }

  resolveEntitySeparation() {
    if (!this.playerEntity || !this.enemyEntity) return;
    if (this.playerEntity.isFainted || this.enemyEntity.isFainted) return;

    // Phasing Dodge: Ignore entity collision during directional dodge to allow dashing through and behind opponent!
    if (this.playerEntity.dodgeTimer > 0 || this.enemyEntity.dodgeTimer > 0) return;

    const dx = this.enemyEntity.x - this.playerEntity.x;
    const dy = this.enemyEntity.y - this.playerEntity.y;
    const dist = Math.hypot(dx, dy) || 1;
    const minDist = this.playerEntity.radius + this.enemyEntity.radius;

    if (dist < minDist) {
      const overlap = (minDist - dist) * 0.5;
      const nx = dx / dist;
      const ny = dy / dist;

      this.playerEntity.x -= nx * overlap;
      this.playerEntity.y -= ny * overlap;
      this.enemyEntity.x += nx * overlap;
      this.enemyEntity.y += ny * overlap;

      // Re-clamp separated positions against obstacles and arena
      this.arena.resolveCollisions(this.playerEntity);
      this.arena.resolveCollisions(this.enemyEntity);
    }
  }

  // Enemy Tactical AI decision
  executeEnemyAI(enemy) {
    if (enemy.isFainted || !enemy.target || enemy.target.isFainted || this.battleEnded) return;

    // Tactical stance shifts based on Guard Stamina:
    const guardRatio = (enemy.guardMeter || 0) / (enemy.guardMeterMax || 100);

    // If stamina is low or exhausted, AI MUST drop guard to avoid Guard Break!
    if (enemy.stance === 'defensive' && (guardRatio < 0.3 || enemy.guardExhaustedTimer > 0)) {
      enemy.setStance('offensive');
    } else if (enemy.stance === 'offensive' && enemy.currentHp < enemy.maxHp * 0.35 && guardRatio > 0.6 && enemy.guardExhaustedTimer <= 0) {
      if (Math.random() < 0.35) {
        enemy.setStance('defensive');
      }
    } else if (Math.random() < 0.15) {
      if (guardRatio > 0.5 && enemy.guardExhaustedTimer <= 0) {
        enemy.setStance(Math.random() > 0.6 ? 'defensive' : 'offensive');
      } else {
        enemy.setStance('offensive');
      }
    }

    if (enemy.stance === 'defensive' || enemy.currentHp < enemy.maxHp * 0.4) {
      // Use authentic defense move (Withdraw, Fire Spin, Light Screen, etc.)
      if (enemy.defenseCooldown <= 0 && Math.random() < 0.65) {
        enemy.executeDefensiveMove();
        return;
      }
      // Or counter with a skill
      if (Math.random() < 0.5) {
        const skillIdx = Math.floor(Math.random() * enemy.skills.length);
        enemy.executeSkill(skillIdx);
      }
    } else {
      // In offensive: alternate between physical dash strikes and skills
      if (Math.random() < 0.4) {
        enemy.executePhysicalAttack();
      } else {
        const skillIdx = Math.floor(Math.random() * enemy.skills.length);
        enemy.executeSkill(skillIdx);
      }
    }
  }

  // Player Auto Combat (when auto-battle is enabled)
  executeAutoCombat(player) {
    if (player.isFainted || !player.target || player.target.isFainted || this.battleEnded) return;

    if (player.stance === 'offensive') {
      // In offensive: alternate physical rush and skills
      if (Math.random() < 0.45) {
        player.executePhysicalAttack();
      } else {
        const skillIdx = Math.floor(Math.random() * player.skills.length);
        player.executeSkill(skillIdx);
      }
    } else {
      // In defensive: activate defensive move when available
      if (player.defenseCooldown <= 0 && Math.random() < 0.6) {
        player.executeDefensiveMove();
        return;
      }
      // Or counter
      if (Math.random() < 0.35) {
        const skillIdx = Math.floor(Math.random() * player.skills.length);
        player.executeSkill(skillIdx);
      }
    }
  }

  renderTrainer(ctx) {
    if (!this.trainer || !this.trainer.visible) return;
    const t = this.trainer;

    ctx.save();
    // Drop shadow at trainer feet
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(t.x, t.y + 4, 8, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sprite frame
    if (this.trainerImg && this.trainerImg.complete && this.trainerImg.naturalWidth > 0) {
      const frameIdx = t.frame || 8;
      const col = frameIdx % 4;
      const row = Math.floor(frameIdx / 4);
      const sx = col * 32;
      const sy = row * 48;
      const dw = 32 * t.scale;
      const dh = 48 * t.scale;
      const dx = Math.round(t.x - dw / 2);
      const dy = Math.round(t.y - dh + 4);

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.trainerImg, sx, sy, 32, 48, dx, dy, dw, dh);
    }
    ctx.restore();
  }

  renderRivalTrainer(ctx) {
    if (!this.rivalTrainer || !this.rivalTrainer.visible) return;
    const rt = this.rivalTrainer;

    ctx.save();
    // Drop shadow at rival trainer feet
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(rt.x, rt.y + 4, 8, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sprite frame (frame 4 is facing left: row 1, col 0)
    if (this.rivalTrainerImg && this.rivalTrainerImg.complete && this.rivalTrainerImg.naturalWidth > 0) {
      const frameIdx = rt.frame || 4;
      const col = frameIdx % 4;
      const row = Math.floor(frameIdx / 4);
      const sx = col * 32;
      const sy = row * 48;
      const dw = 32 * (rt.scale || 0.80);
      const dh = 48 * (rt.scale || 0.80);
      const dx = Math.round(rt.x - dw / 2);
      const dy = Math.round(rt.y - dh + 4);

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.rivalTrainerImg, sx, sy, 32, 48, dx, dy, dw, dh);
    }
    ctx.restore();
  }

  renderPokeball(ctx) {
    // 1. Player Deploy Pokéball
    if (this.activePokeball) {
      const pb = this.activePokeball;
      ctx.save();
      ctx.translate(pb.x, pb.y);
      ctx.rotate(pb.rotation);

      if (this.pokeballImg && this.pokeballImg.complete && this.pokeballImg.naturalWidth > 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.pokeballImg, -9, -9, 18, 18);
      } else {
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Wild Pokémon Capture Pokéball
    if (this.activeCaptureBall) {
      const cb = this.activeCaptureBall;
      ctx.save();
      ctx.translate(cb.x, cb.y);

      // In wobble phase, apply shake tilt angle; in flight, apply spinning rotation
      if (cb.stage === 'wobble') {
        ctx.rotate(cb.wobbleAngle || 0);
      } else {
        ctx.rotate(cb.rotation || 0);
      }

      // Ground shadow under ball during wobble phase
      if (cb.stage === 'wobble' || cb.stage === 'suction') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 10, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      if (this.pokeballImg && this.pokeballImg.complete && this.pokeballImg.naturalWidth > 0) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.pokeballImg, -10, -10, 20, 20);
      } else {
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  renderRecallBeam(ctx) {
    if (!this.activeRecallBeam) return;
    const b = this.activeRecallBeam;
    ctx.save();

    // Outer intense anime red/white energy aura
    ctx.beginPath();
    ctx.moveTo(b.startX, b.startY);
    ctx.lineTo(b.targetX, b.targetY);
    ctx.strokeStyle = 'rgba(255, 60, 90, 0.85)';
    ctx.lineWidth = 14 + Math.sin(Date.now() * 0.03) * 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Inner pure brilliant white laser beam
    ctx.beginPath();
    ctx.moveTo(b.startX, b.startY);
    ctx.lineTo(b.targetX, b.targetY);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Flare at trainer's Pokéball
    const gradStart = ctx.createRadialGradient(b.startX, b.startY, 2, b.startX, b.startY, 20);
    gradStart.addColorStop(0, '#FFFFFF');
    gradStart.addColorStop(0.5, 'rgba(255, 60, 90, 0.9)');
    gradStart.addColorStop(1, 'rgba(255, 60, 90, 0)');
    ctx.fillStyle = gradStart;
    ctx.beginPath();
    ctx.arc(b.startX, b.startY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Radial flare surrounding recalled Pokémon
    const gradEnd = ctx.createRadialGradient(b.targetX, b.targetY, 4, b.targetX, b.targetY, 44);
    gradEnd.addColorStop(0, '#FFFFFF');
    gradEnd.addColorStop(0.4, 'rgba(255, 80, 100, 0.85)');
    gradEnd.addColorStop(1, 'rgba(255, 80, 100, 0)');
    ctx.fillStyle = gradEnd;
    ctx.beginPath();
    ctx.arc(b.targetX, b.targetY, 44, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  render() {
    const ctx = this.ctx;
    const arena = this.arena;

    // 1. Dark letterbox padding for viewport outside the 1024x790 arena
    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    try {
      // 2. Uniform Viewport Projection: center fixed 1024x790 arena
      ctx.translate(arena.drawX, arena.drawY);
      ctx.scale(arena.scale, arena.scale);

      // 3. Screen shake in logical arena space
      ctx.translate(arena.shakeOffsetX, arena.shakeOffsetY);

      // 4. Draw background (at 0, 0, 1024, 790 in logical space) & decals
      arena.renderBackground(ctx);

      // 5. Depth sort entities, trainer, rival trainer, and tactical obstacles based on Y position (Z-ordering)
      const renderables = [
        this.playerEntity,
        this.enemyEntity,
        this.trainer && this.trainer.visible ? {
          y: this.trainer.y,
          render: (context) => this.renderTrainer(context),
        } : null,
        this.rivalTrainer && this.rivalTrainer.visible ? {
          y: this.rivalTrainer.y,
          render: (context) => this.renderRivalTrainer(context),
        } : null,
        ...arena.obstacles.map((obs) => ({
          y: obs.y,
          render: (context) => arena.renderObstacle(context, obs),
        })),
      ].filter(Boolean);

      renderables.sort((a, b) => a.y - b.y);

      for (const item of renderables) {
        item.render(ctx);
      }

      this.renderPokeball(ctx);
      this.renderRecallBeam(ctx);

      this.projectileSystem.render(ctx);
      this.particleSystem.render(ctx);

      if (arena.renderForeground) {
        arena.renderForeground(ctx);
      }
    } catch (err) {
      console.error('[BattleEngine] Error during frame render:', err);
    } finally {
      ctx.restore();
    }
  }

  restartBattle() {
    this.setupMatchup(this.playerPokemonId, this.enemyPokemonId);
  }

  destroy() {
    this.stop();
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.arena.destroy();
    if (this.inputManager) {
      this.inputManager.destroy();
    }
    this.particleSystem.reset();
    this.projectileSystem.reset();
    this.playerEntity = null;
    this.enemyEntity = null;
    if (typeof window !== 'undefined' && window._activeBattleEngine === this) {
      window._activeBattleEngine = null;
    }
  }
}

