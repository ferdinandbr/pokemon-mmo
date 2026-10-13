import Phaser from 'phaser';
import { PLAYER_VISUAL } from './playerVisualConfig';
import { COLLISION_TYPES } from '../maps/collisionConfig';

export default class NPC extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x Pixel X position
   * @param {number} y Pixel Y position
   * @param {object} data NPC configuration data
   */
  constructor(scene, x, y, data = {}) {
    super(scene, x, y);

    this.scene = scene;
    this.id = data.id || `npc_${Math.round(x)}_${Math.round(y)}`;
    this.name = data.name || 'NPC';
    this.spriteKey = data.sprite || data.spriteKey || 'npc_oak';
    this.direction = data.direction || 'down';
    this.npcType = data.npcType || data.type || 'dialogue'; // 'dialogue' | 'battle' | 'shop' | 'starter_oak'
    this.dialogue = data.dialogue || ['Olá, treinador!'];
    if (typeof this.dialogue === 'string') {
      this.dialogue = [this.dialogue];
    }

    this.visionRange = Number(data.visionRange) || (this.npcType === 'battle' ? 3 : 0);
    this.trainerData = data.trainerData || {
      trainerName: this.name,
      rewardMoney: Number(data.rewardMoney) || 200,
      rewardExp: Number(data.rewardExp) || 150,
      cooldown: Number(data.cooldown) || 300,
      team: data.team || [{ speciesId: 19, level: 3, name: 'Rattata' }],
      winDialogue: data.winDialogue || 'Você é forte...',
      lossDialogue: data.lossDialogue || 'Haha, ainda precisa treinar mais!'
    };
    this.shopItems = data.shopItems || null;

    this.isDefeated = Boolean(data.isDefeated);
    this.isEngaging = false;
    this.hasSpottedPlayer = false;

    // Physics body for collision
    scene.physics.world.enable(this);
    this.body.setSize(PLAYER_VISUAL.bodyWidth, PLAYER_VISUAL.bodyHeight);
    this.body.setOffset(PLAYER_VISUAL.bodyOffsetX, PLAYER_VISUAL.bodyOffsetY);
    this.body.setImmovable(true);

    // 1. Sombra do NPC
    this.shadow = scene.add.image(0, 18, 'character_shadow');
    this.shadow.setOrigin(0.5, 0.5);
    this.add(this.shadow);

    // 2. Sprite do NPC
    this.sprite = scene.add.sprite(0, 0, this.spriteKey, 0);
    this.sprite.setScale(PLAYER_VISUAL.scale);
    this.sprite.setOrigin(0.5, 0.5);
    this.add(this.sprite);

    // 3. Container de identificação (Nome e Badge)
    this.overheadContainer = scene.add.container(x, y);
    this.overheadContainer.setDepth(PLAYER_VISUAL.nametagBaseDepth + y / 10000);

    const typeBadge = this._getTypeBadge();
    const tagText = typeBadge ? `${typeBadge} ${this.name}` : this.name;
    const tagColor = this._getTagColor();

    this.nameTag = scene.add.text(0, PLAYER_VISUAL.nameY, tagText, {
      fontFamily: "'Outfit', 'Roboto', sans-serif",
      fontSize: PLAYER_VISUAL.nameFontSize,
      fontWeight: '700',
      color: tagColor,
      stroke: '#0f172a',
      strokeThickness: PLAYER_VISUAL.nameStrokeThickness,
      align: 'center',
      resolution: 3
    }).setOrigin(0.5, 0.5);
    this.overheadContainer.add(this.nameTag);

    // 4. Balão de exclamação "!" para detecção de batalha
    this.alertBubble = scene.add.container(0, PLAYER_VISUAL.bubbleY - 8);
    this.alertBubble.setVisible(false);

    const alertBg = scene.add.circle(0, 0, 10, 0xf59e0b);
    alertBg.setStrokeStyle(2, 0xffffff);
    const alertText = scene.add.text(0, 0, '!', {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '14px',
      fontWeight: '900',
      color: '#000000'
    }).setOrigin(0.5, 0.5);
    this.alertBubble.add([alertBg, alertText]);
    this.overheadContainer.add(this.alertBubble);

    scene.add.existing(this);
    this.setDirection(this.direction);
    this.updateDepth();
  }

  _getTypeBadge() {
    switch (this.npcType) {
      case 'starter_oak': return '🎓';
      case 'shop': return '🛒';
      case 'battle': return '⚔️';
      case 'dialogue':
      default: return '💬';
    }
  }

  _getTagColor() {
    switch (this.npcType) {
      case 'starter_oak': return '#fbbf24'; // Dourado Carvalho
      case 'shop': return '#34d399';       // Verde Mart
      case 'battle': return '#f87171';     // Vermelho Batalha
      case 'dialogue':
      default: return '#e2e8f0';          // Branco clássico
    }
  }

  setDirection(direction) {
    this.direction = direction;
    const animKey = `${this.spriteKey}_idle_${direction}`;
    if (this.scene.anims.exists(animKey)) {
      this.sprite.play(animKey, true);
    } else {
      // Fallback para frame estático por direção
      const frames = { down: 0, left: 4, right: 8, up: 12 };
      this.sprite.setFrame(frames[direction] ?? 0);
    }
  }

  playWalk(direction) {
    this.direction = direction;
    const animKey = `${this.spriteKey}_run_${direction}`;
    if (this.scene.anims.exists(animKey)) {
      this.sprite.play(animKey, true);
    }
  }

  playIdle() {
    this.setDirection(this.direction);
  }

  updateDepth() {
    const depth = 100 + this.y / 10000;
    this.setDepth(depth);
    if (this.overheadContainer) {
      this.overheadContainer.setPosition(this.x, this.y);
      this.overheadContainer.setDepth(PLAYER_VISUAL.nametagBaseDepth + this.y / 10000);
    }
  }

  /**
   * Linha de visão clássica de Pokémon:
   * Dispara um raio em grade na direção em que o NPC está olhando.
   */
  checkLineOfSight(player) {
    if (this.npcType !== 'battle' || this.isDefeated || this.isEngaging || this.hasSpottedPlayer) {
      return false;
    }
    if (!player || !player.active || this.scene.battleUI?.isOpen || this.scene.isTransitioning) {
      return false;
    }

    // Se o cooldown de batalha estiver ativo para este jogador, não inicia combate
    const cd = this.getCooldownStatus();
    if (cd.isActive) {
      return false;
    }

    const tileSize = this.scene.currentMap?.tileWidth || 32;
    const npcTileX = Math.floor(this.x / tileSize);
    const npcTileY = Math.floor(this.y / tileSize);
    const playerTileX = Math.floor(player.x / tileSize);
    const playerTileY = Math.floor(player.y / tileSize);

    let isAligned = false;
    let distance = 0;

    switch (this.direction) {
      case 'down':
        if (playerTileX === npcTileX && playerTileY > npcTileY && playerTileY <= npcTileY + this.visionRange) {
          isAligned = true;
          distance = playerTileY - npcTileY;
        }
        break;
      case 'up':
        if (playerTileX === npcTileX && playerTileY < npcTileY && playerTileY >= npcTileY - this.visionRange) {
          isAligned = true;
          distance = npcTileY - playerTileY;
        }
        break;
      case 'left':
        if (playerTileY === npcTileY && playerTileX < npcTileX && playerTileX >= npcTileX - this.visionRange) {
          isAligned = true;
          distance = npcTileX - playerTileX;
        }
        break;
      case 'right':
        if (playerTileY === npcTileY && playerTileX > npcTileX && playerTileX <= npcTileX + this.visionRange) {
          isAligned = true;
          distance = playerTileX - npcTileX;
        }
        break;
    }

    if (!isAligned || distance <= 0) return false;

    // Verifica se há paredes / obstáculos entre o NPC e o jogador
    const stepX = this.direction === 'right' ? 1 : (this.direction === 'left' ? -1 : 0);
    const stepY = this.direction === 'down' ? 1 : (this.direction === 'up' ? -1 : 0);

    for (let i = 1; i < distance; i++) {
      const checkX = npcTileX + stepX * i;
      const checkY = npcTileY + stepY * i;
      if (this.scene.isTileWalkable && !this.scene.isTileWalkable(checkX, checkY)) {
        return false; // Visão bloqueada por parede ou árvore
      }
    }

    // Jogador avistado!
    this.triggerSpotted(player, distance);
    return true;
  }

  /**
   * Animação clássica de detecção de batalha (Exclamação "!" e aproximação)
   */
  triggerSpotted(player, distance) {
    this.hasSpottedPlayer = true;
    this.isEngaging = true;

    // Congela temporariamente o jogador
    if (player.body) {
      player.body.setVelocity(0, 0);
      player.playIdle?.();
    }

    // Exclamação "!"
    this.alertBubble.setVisible(true);
    this.alertBubble.setScale(0.1);
    this.alertBubble.setAlpha(1);

    this.scene.tweens.add({
      targets: this.alertBubble,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 180,
      yoyo: true,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(300, () => {
          this.alertBubble.setVisible(false);
          this._walkToPlayer(player, distance);
        });
      }
    });
  }

  _walkToPlayer(player, distance) {
    const tileSize = this.scene.currentMap?.tileWidth || 32;
    // Anda até o tile imediatamente anterior ao jogador
    const stepsToWalk = Math.max(0, distance - 1);

    if (stepsToWalk === 0) {
      this.playIdle();
      this.interact(player);
      return;
    }

    const stepX = this.direction === 'right' ? 1 : (this.direction === 'left' ? -1 : 0);
    const stepY = this.direction === 'down' ? 1 : (this.direction === 'up' ? -1 : 0);
    const targetX = this.x + stepX * stepsToWalk * tileSize;
    const targetY = this.y + stepY * stepsToWalk * tileSize;

    this.playWalk(this.direction);

    this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration: stepsToWalk * 220,
      ease: 'Linear',
      onUpdate: () => {
        this.updateDepth();
      },
      onComplete: () => {
        this.playIdle();
        this.updateDepth();
        this.interact(player);
      }
    });
  }

  /**
   * Acionado quando o jogador interage com o NPC ou é alcançado por ele.
   */
  interact(player) {
    // Vira o NPC para olhar diretamente para o jogador
    if (player) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        this.setDirection(dx > 0 ? 'right' : 'left');
      } else {
        this.setDirection(dy > 0 ? 'down' : 'up');
      }
    }

    switch (this.npcType) {
      case 'starter_oak':
        this._handleStarterOakInteraction(player);
        break;

      case 'shop':
        this._handleShopInteraction();
        break;

      case 'battle':
        this._handleBattleInteraction();
        break;

      case 'dialogue':
      default:
        this._handleDialogueInteraction();
        break;
    }
  }

  _handleDialogueInteraction() {
    if (this.scene.dialogueBox) {
      this.scene.dialogueBox.show(this.name, this.dialogue);
    }
  }

  _handleStarterOakInteraction(player) {
    // Verifica se o jogador já possui Pokémon na party ou se já escolheu seu inicial
    const party = this.scene.partyHUDUI?.party || this.scene.pokemonStorageUI?.party || [];
    const hasPokemon = (Array.isArray(party) && party.length > 0) || Boolean(this.scene.hasChosenStarter);

    if (!hasPokemon && this.scene.starterSelectionUI) {
      // Jogador recém-criado sem inicial: abre a tela temática de escolha de Pokémon inicial
      this.scene.starterSelectionUI.open(this);
    } else {
      // Já escolheu o inicial: diálogo personalizado de mentoria e encorajamento
      const firstPokemon = (Array.isArray(party) && party.length > 0) ? party[0] : null;
      const partnerName = firstPokemon
        ? (firstPokemon.nickname || firstPokemon.species?.name || firstPokemon.name)
        : 'parceiro Pokémon';
      const trainerName = this.scene.localPlayer?.name || 'jovem treinador';

      const oakLines = [
        `Olá, ${trainerName}!`,
        `Vejo que você e seu ${partnerName} estão se tornando grandes amigos!`,
        'Cuidar do seu Pokémon com carinho, paciência e amizade é o verdadeiro segredo de um Mestre Pokémon.',
        'Explore as rotas de Kanto, batalhe contra outros treinadores e desafie os Líderes de Ginásio para conquistar suas insígnias!',
        'Sempre que quiser conversar sobre sua jornada, o laboratório estará de portas abertas. Boa sorte!'
      ];

      if (this.scene.dialogueBox) {
        this.scene.dialogueBox.show(this.name, oakLines);
      }
    }
  }

  _handleShopInteraction() {
    if (this.scene.shopUI) {
      this.scene.shopUI.open(this);
    } else {
      this._handleDialogueInteraction();
    }
  }

  getCooldownStatus() {
    const charId = this.scene?.currentCharacterData?.id || this.scene?.localPlayer?.id || 'local';
    const storageKey = `pokemmo_npc_cd_${charId}_${this.id}`;
    let stored = null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) stored = JSON.parse(raw);
    } catch (e) { }

    const now = Date.now();
    if (stored && stored.cooldownUntil && now < stored.cooldownUntil) {
      const remainingSeconds = Math.ceil((stored.cooldownUntil - now) / 1000);
      return {
        isActive: true,
        lastResult: stored.lastResult || 'win',
        remainingSeconds
      };
    }

    return {
      isActive: false,
      lastResult: null,
      remainingSeconds: 0
    };
  }

  setBattleResult(result = 'win') {
    const charId = this.scene?.currentCharacterData?.id || this.scene?.localPlayer?.id || 'local';
    const storageKey = `pokemmo_npc_cd_${charId}_${this.id}`;
    const cdSeconds = Number(this.trainerData.cooldown) || 300;
    const cooldownUntil = Date.now() + (cdSeconds * 1000);

    const data = {
      lastResult: result, // 'win' ou 'loss'
      cooldownUntil
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) { }

    this.isDefeated = (result === 'win');
    this.isEngaging = false;
    this.hasSpottedPlayer = false;
  }

  _handleBattleInteraction() {
    if (this.scene.battleUI?.isOpen || this.scene.isTransitioning) {
      return;
    }

    const cd = this.getCooldownStatus();
    if (cd.isActive) {
      // Cooldown ativo: exibe a mensagem de vitória ou derrota dependendo se o jogador ganhou ou perdeu
      const msg = cd.lastResult === 'win'
        ? (this.trainerData.winDialogue || 'Você já me venceu nesta rota... Boa sorte na jornada!')
        : (this.trainerData.lossDialogue || 'Haha, ainda precisa treinar mais! Volte quando estiver mais forte!');

      if (this.scene.dialogueBox) {
        this.scene.dialogueBox.show(this.name, [msg]);
      }
      return;
    }

    // Cooldown expirado ou primeira batalha: inicia a batalha normalmente
    this.isDefeated = false;
    this.isEngaging = true;
    this.hasSpottedPlayer = true;

    const rawDlg = this.dialogue || this.trainerData?.dialogue;
    const challengeLines = (Array.isArray(rawDlg) && rawDlg.length > 0)
      ? rawDlg
      : [typeof rawDlg === 'string' && rawDlg.trim() ? rawDlg : 'Ei, você! Vamos batalhar!'];

    if (this.scene.dialogueBox) {
      this.scene.dialogueBox.show(this.name, challengeLines, () => {
        // Ao fechar a fala de desafio, inicia a batalha de treinador
        this.scene.startTrainerBattle?.(this);
      });
    } else {
      this.scene.startTrainerBattle?.(this);
    }
  }

  destroy() {
    if (this.overheadContainer) {
      this.overheadContainer.destroy();
      this.overheadContainer = null;
    }
    super.destroy();
  }
}
