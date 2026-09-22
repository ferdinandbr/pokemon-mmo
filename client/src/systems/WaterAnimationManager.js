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
    this.tileData = []; // Array<{ gid, dx, dy, frames: Array<HTMLCanvasElement> }>

    // GIDs das águas clássicas que possuem padrão de onda contínuo
    this.targetGids = [21, 13, 7, 8, 15, 16];

    this._init();
  }

  _init() {
    const texture = this.scene.textures.get('Outside1 Spring');
    if (!texture || !texture.source || !texture.source[0]) {
      console.warn('[WaterAnimation] Textura Outside1 Spring ainda não disponível.');
      return;
    }

    const source = texture.source[0];
    const image = source.image;
    if (!image) return;

    try {
      this.tileData = [];

      for (const gid of this.targetGids) {
        const tileIndex = gid - 1;
        const sc = tileIndex % 64;
        const sr = Math.floor(tileIndex / 64);
        const dx = sc * 34;
        const dy = sr * 34;

        // Extrai o tile base 32x32 original da textura extrudada (offset +1, +1 para ignorar a borda antiga)
        const baseCanvas = document.createElement('canvas');
        baseCanvas.width = 32;
        baseCanvas.height = 32;
        const bctx = baseCanvas.getContext('2d');
        bctx.drawImage(image, dx + 1, dy + 1, 32, 32, 0, 0, 32, 32);

        // Pré-renderiza os 16 frames com deslocamento diagonal contínuo (2px por frame)
        const frames = [];
        for (let f = 0; f < this.totalFrames; f++) {
          const step = f * 2;
          const fCanvas = document.createElement('canvas');
          fCanvas.width = 34;
          fCanvas.height = 34;
          const fctx = fCanvas.getContext('2d');

          // 1. Desenha o miolo 32x32 com wrapping contínuo de ondas
          for (let ox = -32; ox <= 32; ox += 32) {
            for (let oy = -32; oy <= 32; oy += 32) {
              fctx.drawImage(baseCanvas, 1 + ((ox + step) % 32), 1 + ((oy + step) % 32));
            }
          }

          // 2. Extrusão da borda de 1px para evitar artefatos de renderização na câmera móvel
          // Topo
          fctx.drawImage(fCanvas, 1, 1, 32, 1, 1, 0, 32, 1);
          // Fundo
          fctx.drawImage(fCanvas, 1, 32, 32, 1, 1, 33, 32, 1);
          // Esquerda
          fctx.drawImage(fCanvas, 1, 1, 1, 32, 0, 1, 1, 32);
          // Direita
          fctx.drawImage(fCanvas, 32, 1, 1, 32, 33, 1, 1, 32);
          // Cantos
          fctx.drawImage(fCanvas, 1, 1, 1, 1, 0, 0, 1, 1);
          fctx.drawImage(fCanvas, 32, 1, 1, 1, 33, 0, 1, 1);
          fctx.drawImage(fCanvas, 1, 32, 1, 1, 0, 33, 1, 1);
          fctx.drawImage(fCanvas, 32, 32, 1, 1, 33, 33, 1, 1);

          frames.push(fCanvas);
        }

        this.tileData.push({
          gid,
          dx,
          dy,
          frames
        });
      }

      this.isReady = true;
      console.log(`[WaterAnimation] Inicializado com sucesso para ${this.tileData.length} tiles de água!`);
    } catch (err) {
      console.error('[WaterAnimation] Erro ao pré-renderizar frames de água:', err);
    }
  }

  /**
   * Chamado a cada frame pelo WorldScene.update()
   * @param {number} time
   */
  update(time) {
    if (!this.isReady) {
      this._init();
      return;
    }

    if (time - this.lastFrameTime < this.frameDuration) {
      return;
    }

    this.lastFrameTime = time;
    this.frameIndex = (this.frameIndex + 1) % this.totalFrames;

    const texture = this.scene.textures.get('Outside1 Spring');
    if (!texture || !texture.source || !texture.source[0]) return;

    const source = texture.source[0];
    const renderer = this.scene.renderer;

    // 1. Atualização via WebGL (Hardware acelerado instantâneo)
    if (renderer && renderer.gl) {
      const gl = renderer.gl;
      const webGLTexture = source.glTexture ? (source.glTexture.webGLTexture || source.glTexture) : null;
      if (webGLTexture) {
        gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

        for (let i = 0; i < this.tileData.length; i++) {
          const item = this.tileData[i];
          const frameCanvas = item.frames[this.frameIndex];
          gl.texSubImage2D(gl.TEXTURE_2D, 0, item.dx, item.dy, gl.RGBA, gl.UNSIGNED_BYTE, frameCanvas);
        }
      }
    } else if (source.image && source.image instanceof HTMLCanvasElement) {
      // 2. Fallback modo 2D Canvas
      const ctx = source.image.getContext('2d');
      for (let i = 0; i < this.tileData.length; i++) {
        const item = this.tileData[i];
        const frameCanvas = item.frames[this.frameIndex];
        ctx.drawImage(frameCanvas, item.dx, item.dy);
      }
      source.update();
    }
  }

  destroy() {
    this.tileData = [];
    this.isReady = false;
  }
}
