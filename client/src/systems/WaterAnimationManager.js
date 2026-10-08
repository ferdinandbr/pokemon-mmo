export default class WaterAnimationManager {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.frameIndex = 0;
    this.totalFrames = 16;
    this.frameDuration = 90; // 90ms por frame (~1.44s por ciclo de onda suave)
    this.lastFrameTime = 0;
    this.isReady = false;
    this.tileData = []; // Array<{ textureKey, dx, dy, w, h, frames: Array<HTMLCanvasElement> }>

    // Conjunto de Local IDs correspondentes EXCLUSIVAMENTE a água profunda / rio nos tilesets FireRed / Outside
    this.targetLocalIds = new Set([
      112, 113, 117, 120, 121, 125, 128, 130, 132, 136, 137, 141, 142, 144, 145, 149, 150, 152, 154
    ]);

    this._init();
  }

  _init() {
    const candidateKeys = [
      'Outside1 Spring',
      'Outside2 Summer',
      'Outside3 Autumn',
      'Outside4 Winter',
      'spz3zUx_scaled',
      'Outside'
    ];

    const activeKeys = new Set(candidateKeys);
    if (this.scene?.textures?.list) {
      Object.keys(this.scene.textures.list).forEach(key => {
        if (key.includes('Outside') || key.includes('spz') || key.includes('water')) {
          activeKeys.add(key);
        }
      });
    }

    // Coleta GIDs colocados especificamente no layer 'Water' do mapa atual (se o mapa já estiver carregado)
    const waterLayerGids = new Set();
    const nonWaterLayerGids = new Set();

    if (this.scene?.currentMap?.layers) {
      for (const layer of this.scene.currentMap.layers) {
        if (!layer.data) continue;
        const isWater = layer.name && layer.name.toLowerCase().includes('water');
        for (let i = 0; i < layer.data.length; i++) {
          const row = layer.data[i];
          if (!row) continue;
          const gids = Array.isArray(row) ? row.map(t => t?.index ?? 0) : [row];
          for (const gid of gids) {
            if (gid > 0) {
              if (isWater) waterLayerGids.add(gid);
              else nonWaterLayerGids.add(gid);
            }
          }
        }
      }
    }

    this.tileData = [];

    for (const key of activeKeys) {
      if (!this.scene.textures.exists(key)) continue;
      const texture = this.scene.textures.get(key);
      if (!texture || !texture.source || !texture.source[0]) continue;

      const source = texture.source[0];
      const image = source.image;
      if (!image || !image.width || !image.height) continue;

      try {
        const isExtruded = image.width === 2176 || key.includes('extruded');
        const margin = isExtruded ? 1 : 0;
        const spacing = isExtruded ? 2 : 0;
        const tileW = 32;
        const tileH = 32;
        const tileStepW = tileW + spacing;
        const tileStepH = tileH + spacing;
        const cols = isExtruded ? Math.floor((image.width - margin * 2 + spacing) / tileStepW) : Math.floor(image.width / tileW);

        for (const localId of this.targetLocalIds) {
          const sc = localId % cols;
          const sr = Math.floor(localId / cols);
          const dx = margin + sc * tileStepW;
          const dy = margin + sr * tileStepH;
          const uploadX = isExtruded ? dx - margin : dx;
          const uploadY = isExtruded ? dy - margin : dy;

          if (dx + tileW > image.width || dy + tileH > image.height) continue;

          // Extrai o tile base 32x32 original
          const baseCanvas = document.createElement('canvas');
          baseCanvas.width = 32;
          baseCanvas.height = 32;
          const bctx = baseCanvas.getContext('2d');
          bctx.drawImage(image, dx, dy, 32, 32, 0, 0, 32, 32);

          // Verifica pixels para garantir que é água azul pura
          const imgData = bctx.getImageData(0, 0, 32, 32).data;
          let landPixels = 0;
          let waterPixels = 0;
          for (let p = 0; p < imgData.length; p += 4) {
            const r = imgData[p], g = imgData[p+1], b = imgData[p+2], a = imgData[p+3];
            if (a > 100) {
              if (r > 90 && g > 50 && r >= b - 20) {
                landPixels++;
              } else if (b > 150 && b > r + 30) {
                waterPixels++;
              }
            }
          }

          // Só anima se for água pura e sem pixels de grama/terra
          if (landPixels > 0 || waterPixels < 500) {
            continue;
          }

          // Pré-renderiza os 16 frames com deslocamento diagonal contínuo (2px por frame)
          const frames = [];
          for (let f = 0; f < this.totalFrames; f++) {
            const step = f * 2;
            const fCanvas = document.createElement('canvas');
            fCanvas.width = isExtruded ? 34 : 32;
            fCanvas.height = isExtruded ? 34 : 32;
            const fctx = fCanvas.getContext('2d');

            const startOffset = isExtruded ? 1 : 0;

            // 1. Desenha o miolo 32x32 com wrapping contínuo de ondas sem frestas ou linhas pretas
            const shiftX = (step % 32);
            const shiftY = (step % 32);

            for (const ox of [shiftX - 32, shiftX]) {
              for (const oy of [shiftY - 32, shiftY]) {
                fctx.drawImage(baseCanvas, startOffset + ox, startOffset + oy);
              }
            }

            // 2. Se extrudada, preenche a borda de 1px
            if (isExtruded) {
              fctx.drawImage(fCanvas, 1, 1, 32, 1, 1, 0, 32, 1);
              fctx.drawImage(fCanvas, 1, 32, 32, 1, 1, 33, 32, 1);
              fctx.drawImage(fCanvas, 1, 1, 1, 32, 0, 1, 1, 32);
              fctx.drawImage(fCanvas, 32, 1, 1, 32, 33, 1, 1, 32);
              fctx.drawImage(fCanvas, 1, 1, 1, 1, 0, 0, 1, 1);
              fctx.drawImage(fCanvas, 32, 1, 1, 1, 33, 0, 1, 1);
              fctx.drawImage(fCanvas, 1, 32, 1, 1, 0, 33, 1, 1);
              fctx.drawImage(fCanvas, 32, 32, 1, 1, 33, 33, 1, 1);
            }

            frames.push(fCanvas);
          }

          this.tileData.push({
            textureKey: key,
            dx,
            dy,
            uploadX,
            uploadY,
            isExtruded,
            w: isExtruded ? 34 : 32,
            h: isExtruded ? 34 : 32,
            frames
          });
        }
      } catch (err) {
        console.error(`[WaterAnimation] Erro ao pré-renderizar água para ${key}:`, err);
      }
    }

    if (this.tileData.length > 0) {
      this.isReady = true;
      console.log(`[WaterAnimation] Inicializado com sucesso para ${this.tileData.length} tiles de água!`);
    }
  }

  update(time) {
    if (!this.isReady || this.tileData.length === 0) {
      this._init();
      return;
    }

    if (time - this.lastFrameTime < this.frameDuration) {
      return;
    }

    this.lastFrameTime = time;
    this.frameIndex = (this.frameIndex + 1) % this.totalFrames;

    const renderer = this.scene.renderer;
    const texturesToUpdate = new Map();

    for (let i = 0; i < this.tileData.length; i++) {
      const item = this.tileData[i];
      if (!texturesToUpdate.has(item.textureKey)) {
        texturesToUpdate.set(item.textureKey, []);
      }
      texturesToUpdate.get(item.textureKey).push(item);
    }

    for (const [key, items] of texturesToUpdate.entries()) {
      if (!this.scene.textures.exists(key)) continue;
      const texture = this.scene.textures.get(key);
      if (!texture || !texture.source || !texture.source[0]) continue;

      const source = texture.source[0];

      if (renderer && renderer.gl) {
        const gl = renderer.gl;
        const webGLTexture = source.glTexture ? (source.glTexture.webGLTexture || source.glTexture) : null;
        if (webGLTexture) {
          gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
          gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const frameCanvas = item.frames[this.frameIndex];
            gl.texSubImage2D(gl.TEXTURE_2D, 0, item.uploadX, item.uploadY, gl.RGBA, gl.UNSIGNED_BYTE, frameCanvas);
          }
        }
      } else if (source.image && source.image instanceof HTMLCanvasElement) {
        const ctx = source.image.getContext('2d');
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const frameCanvas = item.frames[this.frameIndex];
          ctx.drawImage(frameCanvas, item.uploadX, item.uploadY);
        }
        source.update();
      }
    }
  }

  destroy() {
    this.tileData = [];
    this.isReady = false;
  }
}
