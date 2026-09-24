import Phaser from 'phaser';
import SocketClient from '../network/SocketClient';
import { PLAYER_VISUAL } from './playerVisualConfig';
import { spawnDustEffect, spawnLandingDust } from './dustEffect';
import { COLLISION_TYPES } from '../maps/collisionConfig';

export default class LocalPlayer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, data) {
    super(scene, x, y);

    this.scene = scene;
    this.characterId = data.characterId;
    this.name = data.name;
    this.gender = data.gender || 'male';
    this.spriteKey = data.sprite || 'boy_run';
    this.prefix = this.spriteKey.startsWith('boy') ? 'boy' : 'girl';
    this.direction = data.direction || 'down';
    this.speed = 180; // Exactly 3.0 px/frame at 60Hz to eliminate subpixel jitter

    // Physics follows the lower part of the scaled sprite (the character's feet).
    scene.physics.world.enable(this);
    this.body.setSize(PLAYER_VISUAL.bodyWidth, PLAYER_VISUAL.bodyHeight);
    this.body.setOffset(PLAYER_VISUAL.bodyOffsetX, PLAYER_VISUAL.bodyOffsetY);
    this.body.setCollideWorldBounds(true);

    // 0. Character Shadow (feet level, rendered underneath character sprite)
    this.shadow = scene.add.image(0, 18, 'character_shadow');
    this.shadow.setOrigin(0.5, 0.5);
    this.add(this.shadow);

    // 1. Character Sprite (32x48 FireRed proportion)
    this.sprite = scene.add.sprite(0, 0, this.spriteKey, 0);
    this.sprite.setScale(PLAYER_VISUAL.scale);
    this.sprite.setOrigin(0.5, 0.5);
    this.add(this.sprite);

    // 3. Name Tag (compact and positioned above head)
    const nameColor = this.gender === 'female' ? '#ff80ab' : '#90caf9';
    this.nameTag = scene.add.text(0, PLAYER_VISUAL.nameY, this.name, {
      fontFamily: "'Outfit', sans-serif",
      fontSize: PLAYER_VISUAL.nameFontSize,
      fontWeight: '700',
      color: nameColor,
      stroke: '#000000',
      strokeThickness: PLAYER_VISUAL.nameStrokeThickness,
      align: 'center'
    }).setOrigin(0.5, 0.5);
    this.add(this.nameTag);

    // 4. Speech Bubble Container (positioned above name tag)
    this.bubbleContainer = scene.add.container(0, PLAYER_VISUAL.bubbleY);
    this.bubbleContainer.setVisible(false);
    this.add(this.bubbleContainer);

    this.speechTimer = null;
    this.lastNetworkUpdate = 0;
    this.lastX = x;
    this.lastY = y;
    this.lastDir = this.direction;
    this.wasMoving = false;
    this.isMoving = false;
    this.lastDustTime = 0;
    this.dustStepToggle = false;
    this.lastAnimFrameIndex = -1;
    this.isJumping = false;
    this.isInGrass = false;

    // Keys setup
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      arrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
      arrowDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
      arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
      arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT
    });
    scene.input.keyboard.clearCaptures();

    scene.add.existing(this);
    this.setDepth(100 + y / 10000);
    this.playIdle();
  }

  update(time) {
    if (this.isJumping) return;

    if (this.scene.isChatting || (this.scene.dialogueBox && this.scene.dialogueBox.isOpen)) {
      this.body.setVelocity(0, 0);
      this.isMoving = false;
      this.playIdle();
      return;
    }

    let vx = 0;
    let vy = 0;
    let newDirection = this.direction;

    // WASD and Arrow Keys
    const isUp = this.keys.up.isDown || this.keys.arrowUp.isDown;
    const isDown = this.keys.down.isDown || this.keys.arrowDown.isDown;
    const isLeft = this.keys.left.isDown || this.keys.arrowLeft.isDown;
    const isRight = this.keys.right.isDown || this.keys.arrowRight.isDown;

    if (isLeft) {
      vx = -this.speed;
      newDirection = 'left';
    } else if (isRight) {
      vx = this.speed;
      newDirection = 'right';
    }

    if (isUp) {
      vy = -this.speed;
      newDirection = 'up';
    } else if (isDown) {
      vy = this.speed;
      newDirection = 'down';
    }

    // Check for ledge jump (one-way hop in permitted direction)
    if (isDown && this._checkLedgeJump('down')) return;
    if (isLeft && this._checkLedgeJump('left')) return;
    if (isRight && this._checkLedgeJump('right')) return;
    if (isUp && this._checkLedgeJump('up')) return;

    // Diagonal normalization
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.body.setVelocity(vx, vy);

    const isMoving = vx !== 0 || vy !== 0;

    this.isMoving = isMoving;

    if (isMoving) {
      this.direction = newDirection;
      const animKey = `${this.prefix}_run_${this.direction}`;
      if (this.sprite.anims.currentAnim?.key !== animKey) {
        this.sprite.play(animKey);
      }

      // Footstep dust puff synchronized to actual footstep frames (frames 2 and 4 of walk cycle)
      const currentFrameIndex = this.sprite.anims.currentFrame?.index;
      if (currentFrameIndex !== this.lastAnimFrameIndex) {
        this.lastAnimFrameIndex = currentFrameIndex;
        if (currentFrameIndex === 2 || currentFrameIndex === 4) {
          this.dustStepToggle = !this.dustStepToggle;
          if (!this.isInGrass) {
            spawnDustEffect(this.scene, this.x, this.y, this.direction, this.dustStepToggle);
          }
        }
      }
    } else {
      this.playIdle();
    }

    // Depth sorting
    this.setDepth(100 + this.y / 10000);

    // Network Sync throttling (~15 times per second or on state stop/direction change)
    const movedFar = Math.hypot(this.x - this.lastX, this.y - this.lastY) > 4;
    const dirChanged = this.direction !== this.lastDir;
    const moveStateChanged = isMoving !== this.wasMoving;

    if ((isMoving && movedFar && time - this.lastNetworkUpdate > 60) || moveStateChanged || dirChanged) {
      SocketClient.sendMove({
        x: Math.round(this.x),
        y: Math.round(this.y),
        direction: this.direction,
        isMoving
      });

      this.lastNetworkUpdate = time;
      this.lastX = this.x;
      this.lastY = this.y;
      this.lastDir = this.direction;
      this.wasMoving = isMoving;
    }
  }

  _checkLedgeJump(dir) {
    if (this.isJumping || !this.scene.getCollisionAt) return false;

    if (dir === 'down') {
      const feetY = this.y + 24;
      const targetTileY = Math.floor((feetY + 4) / 32);
      const targetTileX = Math.floor(this.x / 32);
      const colType = this.scene.getCollisionAt(targetTileX, targetTileY);

      if (colType === COLLISION_TYPES.LEDGE_DOWN) {
        const ledgeTop = targetTileY * 32;
        const dist = ledgeTop - feetY;
        if (dist >= -6 && dist <= 10) {
          const landingTileX = targetTileX;
          const landingTileY = targetTileY + 1;
          if (this.scene.isTileWalkable(landingTileX, landingTileY)) {
            this.jumpLedge('down', targetTileX, targetTileY, landingTileX, landingTileY);
            return true;
          }
        }
      }
    } else if (dir === 'left') {
      const leftX = this.x - 10;
      const feetY = this.y + 17;
      const targetTileX = Math.floor((leftX - 4) / 32);
      const targetTileY = Math.floor(feetY / 32);
      const colType = this.scene.getCollisionAt(targetTileX, targetTileY);

      if (colType === COLLISION_TYPES.LEDGE_LEFT) {
        const ledgeRight = (targetTileX + 1) * 32;
        const dist = leftX - ledgeRight;
        if (dist >= -6 && dist <= 10) {
          const landingTileX = targetTileX - 1;
          const landingTileY = targetTileY;
          if (this.scene.isTileWalkable(landingTileX, landingTileY)) {
            this.jumpLedge('left', targetTileX, targetTileY, landingTileX, landingTileY);
            return true;
          }
        }
      }
    } else if (dir === 'right') {
      const rightX = this.x + 10;
      const feetY = this.y + 17;
      const targetTileX = Math.floor((rightX + 4) / 32);
      const targetTileY = Math.floor(feetY / 32);
      const colType = this.scene.getCollisionAt(targetTileX, targetTileY);

      if (colType === COLLISION_TYPES.LEDGE_RIGHT) {
        const ledgeLeft = targetTileX * 32;
        const dist = ledgeLeft - rightX;
        if (dist >= -6 && dist <= 10) {
          const landingTileX = targetTileX + 1;
          const landingTileY = targetTileY;
          if (this.scene.isTileWalkable(landingTileX, landingTileY)) {
            this.jumpLedge('right', targetTileX, targetTileY, landingTileX, landingTileY);
            return true;
          }
        }
      }
    } else if (dir === 'up') {
      const topY = this.y + 10;
      const targetTileY = Math.floor((topY - 4) / 32);
      const targetTileX = Math.floor(this.x / 32);
      const colType = this.scene.getCollisionAt(targetTileX, targetTileY);

      if (colType === COLLISION_TYPES.LEDGE_UP) {
        const ledgeBottom = (targetTileY + 1) * 32;
        const dist = topY - ledgeBottom;
        if (dist >= -6 && dist <= 10) {
          const landingTileX = targetTileX;
          const landingTileY = targetTileY - 1;
          if (this.scene.isTileWalkable(landingTileX, landingTileY)) {
            this.jumpLedge('up', targetTileX, targetTileY, landingTileX, landingTileY);
            return true;
          }
        }
      }
    }

    return false;
  }

  jumpLedge(direction, ledgeTileX, ledgeTileY, landingTileX, landingTileY) {
    if (this.isJumping) {
      this.isMoving = false;
      return;
    }
    this.isJumping = true;
    this.direction = direction;

    // Halt physics and disable physics collisions during hop
    this.body.setVelocity(0, 0);
    this.body.checkCollision.none = true;

    // Play jumping pose (stepping frame for the direction)
    const animKey = `${this.prefix}_run_${direction}`;
    this.sprite.play(animKey);
    this.sprite.anims.pause();

    const targetX = landingTileX * 32 + 16;
    const targetY = landingTileY * 32 + 6;
    this.jumpTargetX = targetX;
    this.jumpTargetY = targetY;
    this.lastLedgeInfo = {
      direction,
      ledgeTileX,
      ledgeTileY,
      landingTileX,
      landingTileY,
      targetX,
      targetY
    };
    const jumpDuration = 360;

    // Parabolic arc on sprite
    this.scene.tweens.add({
      targets: this.sprite,
      y: -20,
      duration: jumpDuration / 2,
      ease: 'Sine.easeOut',
      yoyo: true,
      onComplete: () => {
        this.sprite.y = 0;
      }
    });

    // Name tag & bubble follow jump arc
    this.scene.tweens.add({
      targets: [this.nameTag, this.bubbleContainer],
      y: '-=20',
      duration: jumpDuration / 2,
      ease: 'Sine.easeOut',
      yoyo: true,
      onComplete: () => {
        this.nameTag.y = PLAYER_VISUAL.nameY;
        this.bubbleContainer.y = PLAYER_VISUAL.bubbleY;
      }
    });

    // Shadow scales slightly down at apex
    this.scene.tweens.add({
      targets: this.shadow,
      scaleX: 0.75,
      scaleY: 0.75,
      alpha: 0.2,
      duration: jumpDuration / 2,
      ease: 'Sine.easeOut',
      yoyo: true,
      onComplete: () => {
        this.shadow.setScale(1.0);
        this.shadow.setAlpha(0.3);
      }
    });

    // Move container over the ledge to the landing position
    this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration: jumpDuration,
      ease: 'Linear',
      onComplete: () => {
        this.isJumping = false;
        this.jumpTargetX = null;
        this.jumpTargetY = null;
        this.body.checkCollision.none = false;

        this.x = targetX;
        this.y = targetY;
        this.setDepth(100 + this.y / 10000);

        this.playIdle();

        // 1. Energetic landing dust burst
        spawnLandingDust(this.scene, this.x, this.y);

        // 2. Landing squash & stretch for juicy game feel
        this.scene.tweens.add({
          targets: this.sprite,
          scaleX: PLAYER_VISUAL.scale * 1.18,
          scaleY: PLAYER_VISUAL.scale * 0.82,
          duration: 70,
          yoyo: true,
          ease: 'Quad.easeOut',
          onComplete: () => {
            this.sprite.setScale(PLAYER_VISUAL.scale);
          }
        });

        // 3. Sync final position with server
        SocketClient.sendMove({
          x: Math.round(this.x),
          y: Math.round(this.y),
          direction: this.direction,
          isMoving: false
        });
        this.lastX = this.x;
        this.lastY = this.y;
        this.lastDir = this.direction;
        this.wasMoving = false;
      }
    });
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
      fontFamily: "'Outfit', sans-serif",
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

    // Little triangle pointer
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
}
