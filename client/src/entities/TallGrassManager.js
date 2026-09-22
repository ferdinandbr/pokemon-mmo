import Phaser from 'phaser';

/**
 * TallGrassManager handles the classic Pokémon FireRed tall grass immersion:
 * 1. Automatic tall grass overlay in front of the player's lower body across the entire 'Grass' layer.
 * 2. Dynamic swaying and rustling ("mexer") when players enter or walk through grass tiles.
 * 3. Fluttering pixel-art leaf particles scattered on footsteps.
 * Zero tile modifications required — operates on any map containing a 'Grass' tilelayer.
 */
export default class TallGrassManager {
  constructor(scene) {
    this.scene = scene;
    this.grassLayer = null;
    this.overlays = new Map(); // key `${tx},${ty}` -> Phaser.GameObjects.Sprite
    this.lastRustleTime = new Map(); // key -> timestamp
  }

  setLayer(grassLayer) {
    this.clear();
    this.grassLayer = grassLayer;
  }

  isGrassAt(tileX, tileY) {
    if (!this.grassLayer || !this.grassLayer.tilemap) return false;
    if (tileX < 0 || tileX >= this.grassLayer.tilemap.width || tileY < 0 || tileY >= this.grassLayer.tilemap.height) {
      return false;
    }
    const tile = this.grassLayer.getTileAt(tileX, tileY);
    return Boolean(tile && tile.index > 0);
  }

  update(players, time) {
    if (!this.grassLayer) return;

    const activeTileKeys = new Set();

    for (const player of players) {
      if (!player || !player.active) continue;

      const px = player.x;
      const py = player.y + 19; // feet level

      const tileX = Math.floor(px / 32);
      const tileY = Math.floor(py / 32);

      let inGrass = false;

      // Check only the tile the player is actually standing on
      // Plus horizontal neighbor if crossing the border
      const tilesToCheck = [{ tx: tileX, ty: tileY, isPrimary: true }];
      const seamOffset = px - (tileX * 32 + 16);
      if (seamOffset < -8) {
        tilesToCheck.push({ tx: tileX - 1, ty: tileY, isPrimary: false });
      } else if (seamOffset > 8) {
        tilesToCheck.push({ tx: tileX + 1, ty: tileY, isPrimary: false });
      }

      for (const { tx, ty, isPrimary } of tilesToCheck) {
        if (this.isGrassAt(tx, ty)) {
          inGrass = true;
          const key = `${tx},${ty}`;
          activeTileKeys.add(key);

          let overlay = this.overlays.get(key);
          if (!overlay) {
            overlay = this._createOverlay(tx, ty, player.depth + 0.5);
            this.overlays.set(key, overlay);
            if (isPrimary) {
              this.triggerRustle(overlay, tx, ty);
              this.lastRustleTime.set(key, time);
            }
          } else {
            overlay.setDepth(Math.max(overlay.depth, player.depth + 0.5));

            if (isPrimary) {
              const isMoving = player.isMoving || (player.body && (player.body.velocity.x !== 0 || player.body.velocity.y !== 0));
              const lastTime = this.lastRustleTime.get(key) || 0;
              if (isMoving && time - lastTime > 260) {
                this.triggerRustle(overlay, tx, ty);
                this.lastRustleTime.set(key, time);
              }
            }
          }
        }
      }

      player.isInGrass = inGrass;
    }

    // Clean up overlays that no players are standing on
    for (const [key, overlay] of this.overlays.entries()) {
      if (!activeTileKeys.has(key)) {
        if (!overlay.isFading) {
          overlay.isFading = true;
          this.scene.tweens.add({
            targets: overlay,
            alpha: 0,
            duration: 120,
            onComplete: () => {
              if (overlay && overlay.active) overlay.destroy();
              this.overlays.delete(key);
              this.lastRustleTime.delete(key);
            }
          });
        }
      }
    }
  }

  _createOverlay(tileX, tileY, depth) {
    const worldX = tileX * 32 + 16;
    const worldY = tileY * 32 + 16;
    const sprite = this.scene.add.sprite(worldX, worldY, 'tall_grass_overlay');
    sprite.setOrigin(0.5, 0.5);
    sprite.setDepth(depth);
    sprite.setAlpha(1);
    return sprite;
  }

  triggerRustle(overlay, tileX, tileY) {
    if (!overlay || !overlay.active) return;

    this.scene.tweens.killTweensOf(overlay);
    overlay.setAngle(0);

    const dir = Math.random() > 0.5 ? 1 : -1;

    // Subtle, natural rustle sway
    this.scene.tweens.add({
      targets: overlay,
      angle: dir * 4,
      duration: 65,
      yoyo: true,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        if (overlay && overlay.active) {
          overlay.setAngle(0);
        }
      }
    });

    // 2 fluttering leaf particles
    this._spawnLeafParticle(tileX * 32 + 16, tileY * 32 + 16);
    this._spawnLeafParticle(tileX * 32 + 16, tileY * 32 + 16);
  }

  _spawnLeafParticle(cx, cy) {
    const offsetX = (Math.random() - 0.5) * 16;
    const startY = cy + 2 + (Math.random() - 0.5) * 8;
    const leaf = this.scene.add.image(cx + offsetX, startY, 'grass_leaf');
    leaf.setDepth(200);
    leaf.setScale(0.85 + Math.random() * 0.35);
    leaf.setAlpha(0.95);
    leaf.setAngle(Math.random() * 360);

    const driftX = (Math.random() - 0.5) * 24;
    const riseY = -12 - Math.random() * 14;

    this.scene.tweens.add({
      targets: leaf,
      x: leaf.x + driftX,
      y: leaf.y + riseY,
      angle: leaf.angle + (Math.random() > 0.5 ? 120 : -120),
      alpha: 0,
      scale: leaf.scale * 0.6,
      duration: 360 + Math.random() * 120,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        if (leaf && leaf.active) leaf.destroy();
      }
    });
  }

  clear() {
    for (const overlay of this.overlays.values()) {
      if (overlay && overlay.active) overlay.destroy();
    }
    this.overlays.clear();
    this.lastRustleTime.clear();
  }
}
