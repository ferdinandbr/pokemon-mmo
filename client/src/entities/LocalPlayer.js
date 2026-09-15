import Phaser from 'phaser';
import SocketClient from '../network/SocketClient';

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
    this.speed = 160; // Running speed

    // Physics
    scene.physics.world.enable(this);
    this.body.setSize(24, 20);
    this.body.setOffset(-12, 10);
    this.body.setCollideWorldBounds(true);

    // 1. Soft Shadow
    this.shadow = scene.add.ellipse(0, 20, 22, 10, 0x000000, 0.35);
    this.add(this.shadow);

    // 2. Character Sprite (32x48)
    this.sprite = scene.add.sprite(0, 0, this.spriteKey, 0);
    this.sprite.setOrigin(0.5, 0.5);
    this.add(this.sprite);

    // 3. Name Tag
    const nameColor = this.gender === 'female' ? '#ff80ab' : '#90caf9';
    this.nameTag = scene.add.text(0, -32, this.name, {
      fontFamily: "'Outfit', sans-serif",
      fontSize: '11px',
      fontWeight: '700',
      color: nameColor,
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5, 0.5);
    this.add(this.nameTag);

    // 4. Speech Bubble Container
    this.bubbleContainer = scene.add.container(0, -56);
    this.bubbleContainer.setVisible(false);
    this.add(this.bubbleContainer);

    this.speechTimer = null;
    this.lastNetworkUpdate = 0;
    this.lastX = x;
    this.lastY = y;
    this.lastDir = this.direction;
    this.wasMoving = false;

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

    scene.add.existing(this);
    this.setDepth(y);
    this.playIdle();
  }

  update(time) {
    if (this.scene.isChatting) {
      this.body.setVelocity(0, 0);
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

    // Diagonal normalization
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.body.setVelocity(vx, vy);

    const isMoving = vx !== 0 || vy !== 0;

    if (isMoving) {
      this.direction = newDirection;
      const animKey = `${this.prefix}_run_${this.direction}`;
      if (this.sprite.anims.currentAnim?.key !== animKey) {
        this.sprite.play(animKey);
      }
    } else {
      this.playIdle();
    }

    // Depth sorting
    this.setDepth(this.y);

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
