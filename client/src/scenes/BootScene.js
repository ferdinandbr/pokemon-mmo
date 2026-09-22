import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // ── Character spritesheets (Fire Red, 32×48 per frame) ──
    this.load.spritesheet('boy_run', '/assets/characters/boy_run.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.spritesheet('girl_run', '/assets/characters/girl_run.png', {
      frameWidth: 32,
      frameHeight: 48
    });

    // ── Tiled map & tileset ──
    const timestamp = Date.now();
    this.load.image('Outside1 Spring', `/assets/tilesets/Outside1 Spring_extruded.png?t=${timestamp}`);
    this.load.image('tall_grass_overlay', `/assets/tilesets/tall_grass_overlay.png?t=${timestamp}`);
    this.load.image('grass_leaf', `/assets/tilesets/grass_leaf.png?t=${timestamp}`);

    const kantoMaps = [
      'pallet_town', 'viridian_city', 'pewter_city', 'cerulean_city',
      'vermilion_city', 'lavender_town', 'celadon_city', 'saffron_city',
      'fuchsia_city', 'cinnabar_island', 'indigo_plateau',
      'route_1', 'route_2', 'route_3', 'route_4', 'route_5',
      'route_6', 'route_7', 'route_8', 'route_9', 'route_10', 'route_11'
    ];

    for (const mapKey of kantoMaps) {
      this.load.tilemapTiledJSON(mapKey, `/assets/maps/${mapKey}.json?t=${timestamp}`);
    }

  }

  create() {
    this._generateVisualTextures();
    this._createAnimations();
    this.scene.start('WorldScene');
  }

  _generateVisualTextures() {
    // 1. Character Shadow Texture (smooth dark ellipse)
    if (!this.textures.exists('character_shadow')) {
      const shadowCanvas = this.textures.createCanvas('character_shadow', 24, 12);
      const ctx = shadowCanvas.getContext();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(12, 6, 9, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      shadowCanvas.refresh();
    }

    // 2. Dust Particle Texture (soft ground puff)
    if (!this.textures.exists('dust_puff')) {
      const dustCanvas = this.textures.createCanvas('dust_puff', 12, 12);
      const ctx = dustCanvas.getContext();
      ctx.fillStyle = 'rgba(215, 205, 185, 0.8)';
      ctx.beginPath();
      ctx.arc(6, 6, 3.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(195, 185, 165, 0.65)';
      ctx.beginPath();
      ctx.arc(3.5, 4.5, 2.2, 0, Math.PI * 2);
      ctx.fill();
      dustCanvas.refresh();
    }
  }

  _createAnimations() {
    const sprites = ['boy_run', 'girl_run'];

    for (const key of sprites) {
      const prefix = key.startsWith('boy') ? 'boy' : 'girl';

      // Down  (frames 0–3)
      this.anims.create({ key: `${prefix}_run_down`,  frames: this.anims.generateFrameNumbers(key, { frames: [0,1,2,3]   }), frameRate: 11, repeat: -1 });
      this.anims.create({ key: `${prefix}_idle_down`, frames: [{ key, frame: 0  }], frameRate: 1 });

      // Left  (frames 4–7)
      this.anims.create({ key: `${prefix}_run_left`,  frames: this.anims.generateFrameNumbers(key, { frames: [4,5,6,7]   }), frameRate: 11, repeat: -1 });
      this.anims.create({ key: `${prefix}_idle_left`, frames: [{ key, frame: 4  }], frameRate: 1 });

      // Right (frames 8–11)
      this.anims.create({ key: `${prefix}_run_right`,  frames: this.anims.generateFrameNumbers(key, { frames: [8,9,10,11] }), frameRate: 11, repeat: -1 });
      this.anims.create({ key: `${prefix}_idle_right`, frames: [{ key, frame: 8  }], frameRate: 1 });

      // Up    (frames 12–15)
      this.anims.create({ key: `${prefix}_run_up`,  frames: this.anims.generateFrameNumbers(key, { frames: [12,13,14,15] }), frameRate: 11, repeat: -1 });
      this.anims.create({ key: `${prefix}_idle_up`, frames: [{ key, frame: 12 }], frameRate: 1 });
    }
  }
}
