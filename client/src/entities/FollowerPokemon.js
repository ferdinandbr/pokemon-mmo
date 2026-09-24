import Phaser from 'phaser';
import { spawnLandingDust } from './dustEffect';
import { COLLISION_TYPES } from '../maps/collisionConfig';

export default class FollowerPokemon extends Phaser.GameObjects.Container {
  /**
   * Spritesheet:
   * 64x128
   * 2 colunas x 4 linhas
   * cada frame = 32x32
   *
   * 0 = UP idle
   * 1 = LEFT idle
   * 2 = UP step
   * 3 = LEFT step
   * 4 = DOWN idle
   * 5 = RIGHT idle
   * 6 = DOWN step
   * 7 = RIGHT step
   */

  static SPRITE_SCALE = 1.0;
  static GROUND_Y = 18;
  static SPRITE_ORIGIN_Y = 60 / 64; // 0.9375 para alinhamento inteiro perfeito em frame 64x64

  // Distância base por direção para manter o mesmo espaço visual equilibrado em todos os lados
  static getOffset(direction) {
    switch (direction) {
      case 'down':
        // Quando o player olha para baixo, o Pokémon fica atrás (acima da cabeça/boné)
        return 50;

      case 'up':
        // Quando o player olha para cima, o Pokémon fica abaixo dos pés
        return 42;

      case 'left':
      case 'right':
      default:
        // Laterais: afasta da mochila/lateral do player (evita colar no sprite)
        return 44;
    }
  }

  // Quantos pixels de movimento real para trocar idle/step (cadência suave)
  static STEP_INTERVAL = 26;

  static idleFrame(direction) {
    switch (direction) {
      case 'up':
        return 0;

      case 'left':
        return 1;

      case 'down':
        return 4;

      case 'right':
        return 5;

      default:
        return 4;
    }
  }

  static stepFrame(direction) {
    return this.idleFrame(direction) + 2;
  }

  /**
   * Calcula a posição atrás do player respeitando o offset específico da direção.
   */
  static behindPosition(x, y, direction, customOffset = null) {
    const offset = customOffset ?? this.getOffset(direction);
    switch (direction) {
      case 'up':
        return {
          x,
          y: y + offset
        };

      case 'down':
        return {
          x,
          y: y - offset
        };

      case 'left':
        return {
          x: x + offset,
          y
        };

      case 'right':
        return {
          x: x - offset,
          y
        };

      default:
        return {
          x,
          y: y - offset
        };
    }
  }

  static getCandidateDirections(direction) {
    switch (direction) {
      case 'down':
        return ['down', 'left', 'right', 'up'];

      case 'up':
        return ['up', 'left', 'right', 'down'];

      case 'left':
        return ['left', 'up', 'down', 'right'];

      case 'right':
      default:
        return ['right', 'up', 'down', 'left'];
    }
  }

  /**
   * Verifica se uma posição no mapa é transitável (sem colisão com água, parede, teto, barranco, etc.)
   */
  isPositionWalkable(x, y) {
    if (!this.scene?.isTileWalkable) {
      return true;
    }
    const feetY = y + FollowerPokemon.GROUND_Y;
    const tileX = Math.floor(x / 32);
    const tileY = Math.floor(feetY / 32);

    return this.scene.isTileWalkable(tileX, tileY);
  }

  /**
   * Escolhe a melhor posição disponível ao redor do treinador:
   * 1º: Atrás (posição padrão do seguidor)
   * 2º: Flancos laterais livres de colisão
   * 3º: Frente (se atrás e lados estiverem bloqueados)
   */
  getValidTarget(ownerX, ownerY, direction) {
    const candidates = FollowerPokemon.getCandidateDirections(direction);
    const primaryDir = candidates[0];
    const primaryPos = FollowerPokemon.behindPosition(ownerX, ownerY, primaryDir);

    // 1. Se a posição padrão atrás do treinador estiver livre de colisão, usa-a
    if (this.isPositionWalkable(primaryPos.x, primaryPos.y)) {
      this._lastFlankDir = primaryDir;
      return primaryPos;
    }

    // 2. Se atrás colide com água, telhado ou parede, busca flancos livres
    const walkableCandidates = [];
    for (let i = 1; i < candidates.length; i++) {
      const candDir = candidates[i];
      const pos = FollowerPokemon.behindPosition(ownerX, ownerY, candDir);
      if (this.isPositionWalkable(pos.x, pos.y)) {
        const distToCurrent = Math.hypot(pos.x - this.x, pos.y - this.y);
        walkableCandidates.push({ candDir, pos, distToCurrent, priority: i });
      }
    }

    if (walkableCandidates.length > 0) {
      // Histerese: se o flanco ativo anterior ainda é válido, mantém para evitar trepidação entre candidatos
      if (this._lastFlankDir) {
        const active = walkableCandidates.find(c => c.candDir === this._lastFlankDir);
        if (active) return active.pos;
      }

      walkableCandidates.sort((a, b) => {
        if (a.priority <= 2 && b.priority <= 2) {
          return a.distToCurrent - b.distToCurrent;
        }
        return a.priority - b.priority;
      });
      this._lastFlankDir = walkableCandidates[0].candDir;
      return walkableCandidates[0].pos;
    }

    this._lastFlankDir = null;
    return { x: ownerX, y: ownerY };
  }

  constructor(scene, ownerSprite, buddyData) {
    const direction = ownerSprite?.direction || 'down';

    const ownerX = ownerSprite?.x ?? 0;
    const ownerY = ownerSprite?.y ?? 0;

    let position = FollowerPokemon.behindPosition(
      ownerX,
      ownerY,
      direction
    );

    // Se a cena já possui verificação de colisão, ajusta o spawn para um local livre
    if (scene?.isTileWalkable) {
      const candidates = FollowerPokemon.getCandidateDirections(direction);
      for (const candDir of candidates) {
        const candPos = FollowerPokemon.behindPosition(ownerX, ownerY, candDir);
        const feetY = candPos.y + FollowerPokemon.GROUND_Y;
        const tileX = Math.floor(candPos.x / 32);
        const tileY = Math.floor(feetY / 32);
        if (scene.isTileWalkable(tileX, tileY)) {
          position = candPos;
          break;
        }
      }
    }

    super(
      scene,
      position.x,
      position.y
    );

    this.scene = scene;

    this.ownerSprite = ownerSprite;
    this.buddyData = buddyData;

    this.direction = direction;

    // Estado de movimento e pulo do barranco
    this.isMoving = false;
    this.isJumping = false;
    this.pendingLedgeJump = null;
    this.pendingLedgeTimeout = 0;
    this.lastJumpTime = 0;

    // Controle da animação de passos
    this.stepToggle = false;
    this.distanceAccumulator = 0;

    // Posições para cálculo de deslocamento real
    this.lastX = this.x;
    this.lastY = this.y;
    this.lastOwnerX = ownerX;
    this.lastOwnerY = ownerY;

    // Evita atualizar frame desnecessariamente
    this.currentFrame = -1;

    this.createVisual();

    scene.add.existing(this);

    this.setDepth(100 + this.y / 10000);
  }

  createVisual() {
    /**
     * Pokémon
     */
    this.sprite = this.scene.add.sprite(
      0,
      FollowerPokemon.GROUND_Y,
      this.getTextureKey(),
      FollowerPokemon.idleFrame(this.direction)
    );

    this.sprite.setOrigin(0.5, FollowerPokemon.SPRITE_ORIGIN_Y);
    this.sprite.setScale(FollowerPokemon.SPRITE_SCALE);

    const frameH = this.sprite.frame ? this.sprite.frame.height : 32;
    const ratio = (frameH / 32) * FollowerPokemon.SPRITE_SCALE;

    /**
     * Shadow (alinhada exatamente ao nível dos pés)
     */
    this.shadow = this.scene.add.image(
      0,
      FollowerPokemon.GROUND_Y,
      'character_shadow'
    );

    this.shadow.setOrigin(0.5, 0.5);
    this.shadow.setScale(0.7 * ratio);
    this.shadow.setAlpha(0.3);

    this.add(this.shadow);
    this.add(this.sprite);

    // Overworld shiny sparkles disabled per user request
  }

  createShinyParticles() {
    if (!this.scene.textures.exists('star_sparkle')) {
      return;
    }

    this.particles = this.scene.add.particles(
      0,
      -12,
      'star_sparkle',
      {
        scale: {
          start: 0.35,
          end: 0
        },

        alpha: {
          start: 1,
          end: 0
        },

        speed: {
          min: 8,
          max: 18
        },

        lifespan: 600,

        frequency: 250,

        blendMode: 'ADD'
      }
    );

    this.add(this.particles);
  }

  getTextureKey() {
    const isShiny = Boolean(this.buddyData?.isShiny);
    const id = String(this.buddyData?.speciesId || 1).padStart(3, '0');
    const shinyKey = `pkmn_${id}_shiny`;

    if (isShiny && this.scene?.textures?.exists(shinyKey)) {
      return shinyKey;
    }

    return `pkmn_${id}`;
  }

  /**
   * Define o frame do Pokémon somente quando necessário.
   * Mantém estritamente a origem fixa no centro para eliminar trepidação.
   */
  setPokemonFrame(frame) {
    if (!this.sprite) {
      return;
    }

    if (this.currentFrame === frame) {
      return;
    }

    this.currentFrame = frame;
    this.sprite.setFrame(frame);
    this.sprite.y = FollowerPokemon.GROUND_Y;
  }

  /**
   * Detecta se as patas do Pokémon atingiram a borda de um barranco na direção de movimento.
   * Se sim, inicia o salto sobre o barranco até o tile de aterrissagem.
   */
  checkLedgeJump(dir) {
    if (this.isJumping || !this.scene?.getCollisionAt) return false;
    if ((this.scene?.time?.now ?? 0) < this.lastJumpTime + 1000) return false;

    const feetX = this.x;
    const feetY = this.y + FollowerPokemon.GROUND_Y;

    if (dir === 'down') {
      const targetTileY = Math.floor((feetY + 4) / 32);
      const targetTileX = Math.floor(feetX / 32);
      const colType = this.scene.getCollisionAt(targetTileX, targetTileY);

      if (colType === COLLISION_TYPES.LEDGE_DOWN) {
        const ledgeTop = targetTileY * 32;
        const dist = ledgeTop - feetY;
        if (dist >= -6 && dist <= 12) {
          const landingTileX = targetTileX;
          const landingTileY = targetTileY + 1;
          const landingX = landingTileX * 32 + 16;
          const landingY = landingTileY * 32 + 6;
          this.performLedgeJump('down', landingX, landingY);
          return true;
        }
      }
    } else if (dir === 'left') {
      const targetTileX = Math.floor((feetX - 4) / 32);
      const targetTileY = Math.floor(feetY / 32);
      const colType = this.scene.getCollisionAt(targetTileX, targetTileY);

      if (colType === COLLISION_TYPES.LEDGE_LEFT) {
        const ledgeRight = (targetTileX + 1) * 32;
        const dist = feetX - ledgeRight;
        if (dist >= -6 && dist <= 12) {
          const landingTileX = targetTileX - 1;
          const landingTileY = targetTileY;
          const landingX = landingTileX * 32 + 16;
          const landingY = landingTileY * 32 + 6;
          this.performLedgeJump('left', landingX, landingY);
          return true;
        }
      }
    } else if (dir === 'right') {
      const targetTileX = Math.floor((feetX + 4) / 32);
      const targetTileY = Math.floor(feetY / 32);
      const colType = this.scene.getCollisionAt(targetTileX, targetTileY);

      if (colType === COLLISION_TYPES.LEDGE_RIGHT) {
        const ledgeLeft = targetTileX * 32;
        const dist = ledgeLeft - feetX;
        if (dist >= -6 && dist <= 12) {
          const landingTileX = targetTileX + 1;
          const landingTileY = targetTileY;
          const landingX = landingTileX * 32 + 16;
          const landingY = landingTileY * 32 + 6;
          this.performLedgeJump('right', landingX, landingY);
          return true;
        }
      }
    } else if (dir === 'up') {
      const targetTileY = Math.floor((feetY - 4) / 32);
      const targetTileX = Math.floor(feetX / 32);
      const colType = this.scene.getCollisionAt(targetTileX, targetTileY);

      if (colType === COLLISION_TYPES.LEDGE_UP) {
        const ledgeBottom = (targetTileY + 1) * 32;
        const dist = feetY - ledgeBottom;
        if (dist >= -6 && dist <= 12) {
          const landingTileX = targetTileX;
          const landingTileY = targetTileY - 1;
          const landingX = landingTileX * 32 + 16;
          const landingY = landingTileY * 32 + 6;
          this.performLedgeJump('up', landingX, landingY);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Executa a animação de pulo do barranco (ledge jump) com arco parabólico, sombra e poeira
   */
  performLedgeJump(direction, jumpTargetX, jumpTargetY) {
    if (this.isJumping || !this.scene?.tweens) return;

    this.isJumping = true;
    this.pendingLedgeJump = null;
    this.lastJumpTime = this.scene?.time?.now ?? 0;
    this.direction = direction;

    // Cancela tweens pendentes
    this.scene.tweens.killTweensOf(this);
    if (this.sprite) this.scene.tweens.killTweensOf(this.sprite);
    if (this.shadow) this.scene.tweens.killTweensOf(this.shadow);

    // Frame de passo / pose de salto no ar
    this.setPokemonFrame(FollowerPokemon.stepFrame(direction));

    const jumpDuration = 320;

    // 1. Arco parabólico do sprite (salto vertical no ar)
    this.scene.tweens.add({
      targets: this.sprite,
      y: FollowerPokemon.GROUND_Y - 22,
      duration: jumpDuration / 2,
      ease: 'Sine.easeOut',
      yoyo: true,
      onComplete: () => {
        if (this.sprite) {
          this.sprite.y = FollowerPokemon.GROUND_Y;
        }
      }
    });

    // 2. Sombra encolhe e clareia no ápice do pulo
    const frameH = this.sprite?.frame ? this.sprite.frame.height : 32;
    const baseShadowScale = 0.7 * (frameH / 32) * FollowerPokemon.SPRITE_SCALE;

    this.scene.tweens.add({
      targets: this.shadow,
      scaleX: baseShadowScale * 0.65,
      scaleY: baseShadowScale * 0.65,
      alpha: 0.15,
      duration: jumpDuration / 2,
      ease: 'Sine.easeOut',
      yoyo: true,
      onComplete: () => {
        if (this.shadow) {
          this.shadow.setScale(baseShadowScale);
          this.shadow.setAlpha(0.3);
        }
      }
    });

    // 3. Move horizontal/verticalmente até o ponto de aterrissagem
    this.scene.tweens.add({
      targets: this,
      x: jumpTargetX,
      y: jumpTargetY,
      duration: jumpDuration,
      ease: 'Linear',
      onComplete: () => {
        this.isJumping = false;
        this.pendingLedgeJump = null;
        this.lastJumpTime = this.scene?.time?.now ?? 0;
        this.x = jumpTargetX;
        this.y = jumpTargetY;
        this.lastX = this.x;
        this.lastY = this.y;
        this.lastOwnerX = Math.round(this.ownerSprite?.x ?? this.x);
        this.lastOwnerY = Math.round(this.ownerSprite?.y ?? this.y);
        this.setDepth(100 + this.y / 10000);

        this.setPokemonFrame(FollowerPokemon.idleFrame(this.direction));

        // Partículas de poeira de aterrissagem
        spawnLandingDust(this.scene, this.x, this.y);

        // Efeito elástico squash & stretch na aterrissagem
        if (this.sprite) {
          this.scene.tweens.add({
            targets: this.sprite,
            scaleX: FollowerPokemon.SPRITE_SCALE * 1.25,
            scaleY: FollowerPokemon.SPRITE_SCALE * 0.75,
            duration: 80,
            yoyo: true,
            ease: 'Quad.easeOut',
            onComplete: () => {
              if (this.sprite) {
                this.sprite.setScale(FollowerPokemon.SPRITE_SCALE);
              }
            }
          });
        }
      }
    });
  }

  /**
   * Atualiza posição + animação com interpolação suave (lerp) e transições orgânicas.
   */
  updateFollower(ownerX, ownerY, ownerDirection, ownerMoving = null, delta = 16.666, ownerJumping = false) {
    if (!this.active || !this.ownerSprite) {
      return;
    }

    const direction =
      ownerDirection ||
      this.ownerSprite.direction ||
      this.direction;

    /**
     * PULO DO BARRANCO (LEDGE JUMP)
     * O Pokémon NUNCA pula sozinho ao virar de costas ou ficar perto do barranco.
     * Ele SÓ pula para seguir o treinador quando o treinador salta o barranco!
     */
    if (this.isJumping) {
      return;
    }

    // Se o treinador pulou o barranco, mira no barranco que o treinador acabou de saltar
    if (ownerJumping && !this.pendingLedgeJump && !this.isJumping) {
      if ((this.scene?.time?.now ?? 0) > this.lastJumpTime + 800) {
        const ledge = this.ownerSprite?.lastLedgeInfo;
        const dir = ledge?.direction || direction;

        let takeoffX = this.x;
        let takeoffY = this.y;
        let landX = (ledge?.landingTileX ?? Math.floor(ownerX / 32)) * 32 + 16;
        let landY = (ledge?.landingTileY ?? Math.floor(ownerY / 32)) * 32 + 6;

        if (ledge) {
          if (dir === 'down') {
            takeoffX = ledge.ledgeTileX * 32 + 16;
            takeoffY = ledge.ledgeTileY * 32 - 14;
          } else if (dir === 'up') {
            takeoffX = ledge.ledgeTileX * 32 + 16;
            takeoffY = (ledge.ledgeTileY + 1) * 32 + 6;
          } else if (dir === 'left') {
            takeoffX = (ledge.ledgeTileX + 1) * 32 + 14;
            takeoffY = ledge.ledgeTileY * 32 + 6;
          } else if (dir === 'right') {
            takeoffX = ledge.ledgeTileX * 32 - 14;
            takeoffY = ledge.ledgeTileY * 32 + 6;
          }
        }

        this.pendingLedgeJump = {
          dir,
          takeoffX,
          takeoffY,
          landX,
          landY,
          traveled: 0
        };
        this.pendingLedgeTimeout = (this.scene?.time?.now ?? 0) + 1200;
      }
    }

    if (this.pendingLedgeJump) {
      const p = this.pendingLedgeJump;
      const isTimeout = (this.scene?.time?.now ?? 0) > this.pendingLedgeTimeout;
      const distToTakeoff = Math.hypot(p.takeoffX - this.x, p.takeoffY - this.y);

      // Se chegou perto do barranco, ou já andou 80px, ou deu timeout: PULA IMEDIATAMENTE!
      if (distToTakeoff <= 12 || p.traveled >= 80 || isTimeout) {
        this.pendingLedgeJump = null;
        this.performLedgeJump(p.dir, p.landX, p.landY);
        return;
      }

      // Caminha em direção ao ponto de decolagem do barranco (ajustando X e Y)
      const step = 3;
      const angle = Math.atan2(p.takeoffY - this.y, p.takeoffX - this.x);
      const moveX = Math.cos(angle) * step;
      const moveY = Math.sin(angle) * step;

      this.x = Math.round(this.x + moveX);
      this.y = Math.round(this.y + moveY);
      p.traveled += step;

      // Animação de passos enquanto caminha até a beirada
      this.distanceAccumulator += step;
      if (this.distanceAccumulator >= FollowerPokemon.STEP_INTERVAL) {
        this.distanceAccumulator -= FollowerPokemon.STEP_INTERVAL;
        this.stepToggle = !this.stepToggle;
      }
      this.setPokemonFrame(
        this.stepToggle
          ? FollowerPokemon.stepFrame(p.dir)
          : FollowerPokemon.idleFrame(p.dir)
      );

      // Checa se o novo passo atingiu a beirada
      const newDist = Math.hypot(p.takeoffX - this.x, p.takeoffY - this.y);
      if (newDist <= 12 || p.traveled >= 80) {
        this.pendingLedgeJump = null;
        this.performLedgeJump(p.dir, p.landX, p.landY);
      }
      return;
    }

    /**
     * Mudança de direção: atualiza facing limpo sem squash deformador
     */
    if (direction !== this.direction) {
      this.direction = direction;
      this.setPokemonFrame(
        FollowerPokemon.idleFrame(direction)
      );
    }

    /**
     * ---------------------------------------------------------
     * POSIÇÃO: DISTÂNCIA RIGOROSAMENTE IDÊNTICA + TRANSIÇÃO SUAVE AO VIRAR
     * ---------------------------------------------------------
     */

    if (this.lastOwnerX === undefined) {
      this.lastOwnerX = ownerX;
      this.lastOwnerY = ownerY;
    }

    const playerDx = ownerX - this.lastOwnerX;
    const playerDy = ownerY - this.lastOwnerY;
    this.lastOwnerX = ownerX;
    this.lastOwnerY = ownerY;

    const target = this.getValidTarget(
      ownerX,
      ownerY,
      direction
    );

    const distToTarget = Math.hypot(target.x - this.x, target.y - this.y);

    if (distToTarget > 120) {
      // Teleporte, warp ou troca abrupta de mapa: alinha imediatamente
      this.x = target.x;
      this.y = target.y;
    } else {
      // 1. Move junto com o player de forma contínua (elimina 100% da trepidação de arredondamento)
      this.x += playerDx;
      this.y += playerDy;

      // 2. Interpola suavemente o reposicionamento lateral durante curvas
      const diffX = target.x - this.x;
      const diffY = target.y - this.y;
      const remainingDist = Math.hypot(diffX, diffY);

      if (remainingDist <= 0.05) {
        this.x = target.x;
        this.y = target.y;
      } else {
        const factor = 1 - Math.exp(-14 * (delta / 1000));
        this.x += diffX * factor;
        this.y += diffY * factor;
      }
    }

    /**
     * ---------------------------------------------------------
     * MOVIMENTO & CADÊNCIA DOS PASSOS
     * ---------------------------------------------------------
     */

    const moveDist = Math.hypot(this.x - this.lastX, this.y - this.lastY);
    this.lastX = this.x;
    this.lastY = this.y;

    // Está em movimento se o Pokémon ou o dono está se deslocando
    const isMoving = moveDist > 0.05 || Boolean(ownerMoving);
    this.isMoving = isMoving;

    if (!isMoving) {
      this.distanceAccumulator = 0;
      this.stepToggle = false;

      this.setPokemonFrame(
        FollowerPokemon.idleFrame(this.direction)
      );

      this.setDepth(100 + this.y / 10000);
      return;
    }

    // Acumula distância real percorrida pelo Pokémon para cadência estável
    this.distanceAccumulator += moveDist;

    if (this.distanceAccumulator >= FollowerPokemon.STEP_INTERVAL) {
      this.distanceAccumulator -= FollowerPokemon.STEP_INTERVAL;
      this.stepToggle = !this.stepToggle;
    }

    const frame = this.stepToggle
      ? FollowerPokemon.stepFrame(this.direction)
      : FollowerPokemon.idleFrame(this.direction);

    this.setPokemonFrame(frame);

    this.setDepth(100 + this.y / 10000);
  }

  /**
   * Troca o Pokémon ativo.
   */
  updateBuddy(buddyData) {
    if (!buddyData) {
      this.destroy();
      return;
    }

    this.buddyData = buddyData;

    const textureKey = this.getTextureKey();

    if (
      this.sprite &&
      this.scene.textures.exists(textureKey)
    ) {
      if (this.scene?.tweens) {
        this.scene.tweens.killTweensOf(this.sprite);
      }

      this.sprite.setTexture(
        textureKey,
        FollowerPokemon.idleFrame(this.direction)
      );

      this.sprite.setOrigin(0.5, FollowerPokemon.SPRITE_ORIGIN_Y);
      this.sprite.y = FollowerPokemon.GROUND_Y;

      this.sprite.setScale(
        FollowerPokemon.SPRITE_SCALE
      );

      if (this.shadow) {
        const frameH = this.sprite.frame ? this.sprite.frame.height : 32;
        const ratio = (frameH / 32) * FollowerPokemon.SPRITE_SCALE;
        this.shadow.y = FollowerPokemon.GROUND_Y;
        this.shadow.setScale(0.7 * ratio);
      }

      this.currentFrame =
        FollowerPokemon.idleFrame(this.direction);
    }

    // Overworld shiny sparkles disabled per user request
    if (this.particles) {
      this.particles.destroy();
      this.particles = null;
    }

    this.distanceAccumulator = 0;
    this.stepToggle = false;
  }

  destroy(fromScene) {
    if (this.jumpTimer) {
      this.jumpTimer.remove();
      this.jumpTimer = null;
    }

    if (this.scene?.tweens) {
      this.scene.tweens.killTweensOf(this);
      if (this.sprite) this.scene.tweens.killTweensOf(this.sprite);
      if (this.shadow) this.scene.tweens.killTweensOf(this.shadow);
    }

    if (this.particles) {
      this.particles.destroy();
      this.particles = null;
    }

    if (this.shadow) {
      this.shadow.destroy();
      this.shadow = null;
    }

    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
    }

    super.destroy(fromScene);
  }
}