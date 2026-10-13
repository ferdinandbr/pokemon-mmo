import Phaser from 'phaser';
import { PLAYER_VISUAL } from './playerVisualConfig';
import { spawnDustEffect } from './dustEffect';

export default class RemotePlayer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, data) {
    super(scene, x, y);

    this.scene = scene;
    this.socketId = data.socketId;
    this.characterId = data.characterId;
    this.name = data.name;
    this.gender = data.gender || 'male';
    this.spriteKey = data.sprite || 'boy_run';
    this.prefix = this.spriteKey.startsWith('boy') ? 'boy' : 'girl';
    this.direction = data.direction || 'down';

    this.targetX = x;
    this.targetY = y;
    this.isMoving = false;
    this.lastDustTime = 0;
    this.dustStepToggle = false;
    this.isInGrass = false;

    // 0. Character Shadow (feet level, rendered underneath character sprite)
    this.shadow = scene.add.image(0, 18, 'character_shadow');
    this.shadow.setOrigin(0.5, 0.5);
    this.add(this.shadow);

    // 1. Character Sprite
    this.sprite = scene.add.sprite(0, 0, this.spriteKey, 0);
    this.sprite.setScale(PLAYER_VISUAL.scale);
    this.sprite.setOrigin(0.5, 0.5);
    this.add(this.sprite);

    // 3. Overhead Container (name tag & speech bubble rendered above all world layers & weather)
    this.overheadContainer = scene.add.container(x, y);
    this.overheadContainer.setDepth(PLAYER_VISUAL.nametagBaseDepth + y / 10000);

    const nameColor = this.gender === 'female' ? '#f472b6' : '#7dd3fc';
    this.nameTag = scene.add.text(0, PLAYER_VISUAL.nameY, this.name, {
      fontFamily: "'Outfit', 'Roboto', sans-serif",
      fontSize: PLAYER_VISUAL.nameFontSize,
      fontWeight: '700',
      color: nameColor,
      stroke: '#0f172a',
      strokeThickness: PLAYER_VISUAL.nameStrokeThickness,
      align: 'center',
      resolution: 3
    }).setOrigin(0.5, 0.5);
    this.overheadContainer.add(this.nameTag);

    // 4. Speech Bubble
    this.bubbleContainer = scene.add.container(0, PLAYER_VISUAL.bubbleY);
    this.bubbleContainer.setVisible(false);
    this.overheadContainer.add(this.bubbleContainer);

    this.speechTimer = null;

    scene.add.existing(this);
    this.setDepth(100 + y / 10000);
    this.updateOverhead();
    this.playIdle();
  }

  updateTarget(data) {
    if (typeof data.x === 'number') this.targetX = data.x;
    if (typeof data.y === 'number') this.targetY = data.y;
    if (data.direction) this.direction = data.direction;
    if (typeof data.isMoving === 'boolean') this.isMoving = data.isMoving;
  }

  update() {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetX, this.targetY);

    if (dist > 2) {
      this.x = Phaser.Math.Linear(this.x, this.targetX, 0.25);
      this.y = Phaser.Math.Linear(this.y, this.targetY, 0.25);

      const animKey = `${this.prefix}_run_${this.direction}`;
      if (this.sprite.anims.currentAnim?.key !== animKey) {
        this.sprite.play(animKey);
      }

      // Footstep dust puff trail for remote player
      const now = this.scene.time?.now || Date.now();
      if (now - this.lastDustTime > 140) {
        this.lastDustTime = now;
        this.dustStepToggle = !this.dustStepToggle;
        if (!this.isInGrass) {
          spawnDustEffect(this.scene, this.x, this.y, this.direction, this.dustStepToggle);
        }
      }
    } else {
      this.x = this.targetX;
      this.y = this.targetY;
      if (!this.isMoving) {
        this.playIdle();
      }
    }

    this.setDepth(100 + this.y / 10000);
    this.updateOverhead();
  }

  playIdle() {
    const idleAnim = `${this.prefix}_idle_${this.direction}`;
    if (this.sprite.anims.currentAnim?.key !== idleAnim) {
      this.sprite.play(idleAnim);
    }
  }

  showSpeechBubble(text) {
    if (this.speechTimer) {
      this.speechTimer.remove();
    }

    this.bubbleContainer.removeAll(true);

    const bubbleText = this.scene.add.text(0, 0, text, {
      fontFamily: "'PokemonBW', 'Outfit', sans-serif",
      fontSize: '11px',
      color: '#000000',
      wordWrap: { width: 140 },
      align: 'center'
    }).setOrigin(0.5, 0.5);

    const padX = 14;
    const padY = 8;
    const width = Math.max(48, bubbleText.width + padX);
    const height = Math.max(24, bubbleText.height + padY);

    const bubbleBg = this.scene.add.graphics();
    bubbleBg.fillStyle(0xffffff, 0.95);
    bubbleBg.lineStyle(2, 0x222222, 1);
    bubbleBg.fillRoundedRect(-width / 2, -height / 2, width, height, 6);
    bubbleBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 6);

    bubbleBg.fillStyle(0xffffff, 0.95);
    bubbleBg.fillTriangle(0, height / 2 + 5, -5, height / 2, 5, height / 2);
    bubbleBg.lineStyle(2, 0x222222, 1);
    bubbleBg.lineBetween(-5, height / 2, 0, height / 2 + 5);
    bubbleBg.lineBetween(5, height / 2, 0, height / 2 + 5);

    this.bubbleContainer.add([bubbleBg, bubbleText]);
    this.bubbleContainer.setVisible(true);

    this.speechTimer = this.scene.time.delayedCall(4500, () => {
      this.bubbleContainer.setVisible(false);
    });
  }

  updateOverhead() {
    if (!this.overheadContainer || !this.overheadContainer.active) return;
    this.overheadContainer.setPosition(Math.round(this.x), Math.round(this.y));
    this.overheadContainer.setDepth(PLAYER_VISUAL.nametagBaseDepth + this.y / 10000);
    this.overheadContainer.setVisible(this.visible);
  }

  setPosition(x, y, z, w) {
    super.setPosition(x, y, z, w);
    this.updateOverhead();
    return this;
  }

  setVisible(value) {
    super.setVisible(value);
    if (this.overheadContainer) {
      this.overheadContainer.setVisible(value);
    }
    return this;
  }

  setAlpha(value) {
    super.setAlpha(value);
    if (this.overheadContainer) {
      this.overheadContainer.setAlpha(value);
    }
    return this;
  }

  setName(name) {
    this.name = name;
    if (this.nameTag) {
      this.nameTag.setText(name);
    }
  }

  destroy(fromScene) {
    if (this.speechTimer) {
      this.speechTimer.remove();
      this.speechTimer = null;
    }
    if (this.overheadContainer) {
      this.overheadContainer.destroy(true);
      this.overheadContainer = null;
    }
    super.destroy(fromScene);
  }
}
