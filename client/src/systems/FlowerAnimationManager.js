export default class FlowerAnimationManager {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.frameIndex = 0;
    this.totalFrames = 5;
    this.frameDuration = 260; // 260ms por frame (~1.3s por ciclo de balanço suave original do FireRed)
    this.lastFrameTime = 0;
    this.isReady = false;
    this.tileData = []; // Array<{ gid, dx, dy, frames: Array<HTMLCanvasElement> }>

    // GID da flor clássica de Kanto (Fire Red / Leaf Green)
    this.targetGids = [1309];

    this._init();
  }

  _init() {
    const texture = this.scene.textures.get('Outside1 Spring');
    if (!texture || !texture.source || !texture.source[0]) {
      return;
    }

    // Garante que todos os 5 frames foram carregados
    for (let f = 0; f < this.totalFrames; f++) {
      if (!this.scene.textures.exists(`anim_flower_${f}`)) {
        return;
      }
    }

    try {
      this.tileData = [];

      for (const gid of this.targetGids) {
        const tileIndex = gid - 1;
        const sc = tileIndex % 64;
        const sr = Math.floor(tileIndex / 64);
        const dx = sc * 34;
        const dy = sr * 34;

        // Pré-renderiza os 5 frames com a extrusão de 1px nas bordas
        const frames = [];
        for (let f = 0; f < this.totalFrames; f++) {
          const frameTexture = this.scene.textures.get(`anim_flower_${f}`);
          const frameImg = frameTexture.getSourceImage();

          const fCanvas = document.createElement('canvas');
          fCanvas.width = 34;
          fCanvas.height = 34;
          const fctx = fCanvas.getContext('2d');
          fctx.imageSmoothingEnabled = false;

          // 1. Desenha o miolo 32x32 da flor na posição (1, 1)
          fctx.drawImage(frameImg, 0, 0, 32, 32, 1, 1, 32, 32);

          // 2. Extrusão da borda de 1px para evitar artefatos ao movimentar a câmera
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
      console.log(`[FlowerAnimation] Inicializado com sucesso para ${this.tileData.length} tiles de flores!`);
    } catch (err) {
      console.error('[FlowerAnimation] Erro ao pré-renderizar frames de flor:', err);
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
        ctx.clearRect(item.dx, item.dy, 34, 34);
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
