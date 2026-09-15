import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load official Fire Red character spritesheets (32x48 per frame)
    this.load.spritesheet('boy_run', '/assets/characters/boy_run.png', {
      frameWidth: 32,
      frameHeight: 48
    });

    this.load.spritesheet('girl_run', '/assets/characters/girl_run.png', {
      frameWidth: 32,
      frameHeight: 48
    });

    // Tilesets for Tiled maps (key must match tileset name in Tiled JSON exactly)
    // Compact per-map tilesets (only tiles actually used by each map)
    this.load.image('pallet_town_tiles', '/assets/tilesets/pallet_town_tiles.png');
    // Keep legacy tileset for fallback procedural maps
    this.load.image('pokemon_tileset', '/assets/tilesets/pokemon_tileset.png');

    // Tiled JSON maps
    this.load.tilemapTiledJSON('pallet_town', '/assets/maps/pallet_town.json');
  }

  create() {
    this.createAnimations();
    this.generateMapTextures();

    // Start WorldScene once loaded
    this.scene.start('WorldScene');
  }

  createAnimations() {
    const sprites = ['boy_run', 'girl_run'];

    for (const key of sprites) {
      const prefix = key.startsWith('boy') ? 'boy' : 'girl';

      // Down (Row 0: 0, 1, 2, 3)
      this.anims.create({
        key: `${prefix}_run_down`,
        frames: this.anims.generateFrameNumbers(key, { frames: [0, 1, 2, 3] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${prefix}_idle_down`,
        frames: [{ key, frame: 0 }],
        frameRate: 1
      });

      // Left (Row 1: 4, 5, 6, 7)
      this.anims.create({
        key: `${prefix}_run_left`,
        frames: this.anims.generateFrameNumbers(key, { frames: [4, 5, 6, 7] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${prefix}_idle_left`,
        frames: [{ key, frame: 4 }],
        frameRate: 1
      });

      // Right (Row 2: 8, 9, 10, 11)
      this.anims.create({
        key: `${prefix}_run_right`,
        frames: this.anims.generateFrameNumbers(key, { frames: [8, 9, 10, 11] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${prefix}_idle_right`,
        frames: [{ key, frame: 8 }],
        frameRate: 1
      });

      // Up (Row 3: 12, 13, 14, 15)
      this.anims.create({
        key: `${prefix}_run_up`,
        frames: this.anims.generateFrameNumbers(key, { frames: [12, 13, 14, 15] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${prefix}_idle_up`,
        frames: [{ key, frame: 12 }],
        frameRate: 1
      });
    }
  }

  generateMapTextures() {
    // Generate clean retro textures using canvas graphics
    // 1. Grass tile (32x32)
    const grassGfx = this.make.graphics({ x: 0, y: 0, add: false });
    grassGfx.fillStyle(0x70b860, 1);
    grassGfx.fillRect(0, 0, 32, 32);
    grassGfx.fillStyle(0x5ca04c, 1);
    grassGfx.fillRect(4, 4, 2, 4);
    grassGfx.fillRect(18, 16, 2, 4);
    grassGfx.fillRect(24, 8, 2, 4);
    grassGfx.fillRect(8, 22, 2, 4);
    grassGfx.generateTexture('tile_grass', 32, 32);

    // 2. Dirt Road tile (32x32)
    const roadGfx = this.make.graphics({ x: 0, y: 0, add: false });
    roadGfx.fillStyle(0xd0b880, 1);
    roadGfx.fillRect(0, 0, 32, 32);
    roadGfx.fillStyle(0xb8a068, 1);
    roadGfx.fillRect(6, 6, 2, 2);
    roadGfx.fillRect(20, 14, 2, 2);
    roadGfx.fillRect(10, 24, 2, 2);
    roadGfx.generateTexture('tile_road', 32, 32);

    // 3. Tall Grass tile (32x32)
    const tallGrassGfx = this.make.graphics({ x: 0, y: 0, add: false });
    tallGrassGfx.fillStyle(0x388830, 1);
    tallGrassGfx.fillRect(0, 0, 32, 32);
    tallGrassGfx.fillStyle(0x286820, 1);
    tallGrassGfx.fillRect(2, 6, 8, 20);
    tallGrassGfx.fillRect(12, 4, 8, 24);
    tallGrassGfx.fillRect(22, 8, 8, 20);
    tallGrassGfx.fillStyle(0x50a840, 1);
    tallGrassGfx.fillRect(4, 2, 4, 10);
    tallGrassGfx.fillRect(14, 2, 4, 10);
    tallGrassGfx.fillRect(24, 4, 4, 10);
    tallGrassGfx.generateTexture('tile_tall_grass', 32, 32);

    // 4. Tree (48x64)
    const treeGfx = this.make.graphics({ x: 0, y: 0, add: false });
    treeGfx.fillStyle(0x184818, 1);
    treeGfx.fillCircle(24, 24, 22);
    treeGfx.fillStyle(0x287828, 1);
    treeGfx.fillCircle(24, 22, 19);
    treeGfx.fillStyle(0x40a038, 1);
    treeGfx.fillCircle(20, 18, 14);
    treeGfx.fillStyle(0x785028, 1);
    treeGfx.fillRect(18, 42, 12, 20);
    treeGfx.generateTexture('tile_tree', 48, 64);

    // 5. Flower (16x16)
    const flowerGfx = this.make.graphics({ x: 0, y: 0, add: false });
    flowerGfx.fillStyle(0xff4040, 1);
    flowerGfx.fillCircle(8, 8, 5);
    flowerGfx.fillStyle(0xffeb3b, 1);
    flowerGfx.fillCircle(8, 8, 2);
    flowerGfx.generateTexture('tile_flower', 16, 16);

    // 6. Water tile (32x32)
    const waterGfx = this.make.graphics({ x: 0, y: 0, add: false });
    waterGfx.fillStyle(0x3878b8, 1);
    waterGfx.fillRect(0, 0, 32, 32);
    waterGfx.fillStyle(0x5098d8, 1);
    waterGfx.fillRect(4, 8, 12, 2);
    waterGfx.fillRect(16, 20, 12, 2);
    waterGfx.generateTexture('tile_water', 32, 32);

    // 7. Fence (32x16)
    const fenceGfx = this.make.graphics({ x: 0, y: 0, add: false });
    fenceGfx.fillStyle(0xa07840, 1);
    fenceGfx.fillRect(0, 4, 32, 6);
    fenceGfx.fillRect(4, 0, 6, 16);
    fenceGfx.fillRect(22, 0, 6, 16);
    fenceGfx.generateTexture('tile_fence', 32, 16);

    // 8. Signpost (24x24)
    const signGfx = this.make.graphics({ x: 0, y: 0, add: false });
    signGfx.fillStyle(0xa07840, 1);
    signGfx.fillRect(2, 2, 20, 14);
    signGfx.fillRect(10, 16, 4, 8);
    signGfx.fillStyle(0xffffff, 1);
    signGfx.fillRect(5, 5, 14, 2);
    signGfx.fillRect(5, 9, 10, 2);
    signGfx.generateTexture('tile_sign', 24, 24);
  }
}
