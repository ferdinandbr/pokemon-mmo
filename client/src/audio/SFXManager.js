class SFXManager {
  constructor() {
    this.isMuted = localStorage.getItem('pokemmo_sfx_muted') === 'true';
    this.volume = parseFloat(localStorage.getItem('pokemmo_sfx_volume') || '0.7');
    this.audioCache = new Map();
    this.currentME = null;
  }

  getVolume() {
    return this.isMuted ? 0 : this.volume;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('pokemmo_sfx_volume', this.volume.toString());
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
    localStorage.setItem('pokemmo_sfx_muted', this.isMuted.toString());
  }

  /**
   * Play any sound effect by relative URL or name
   */
  play(url, volumeScale = 1) {
    const vol = this.getVolume() * volumeScale;
    if (vol <= 0) return null;

    try {
      const fullUrl = url.startsWith('/') ? url : `/assets/audio/se/${url}`;
      const audio = new Audio(fullUrl);
      audio.volume = Math.max(0, Math.min(1, vol));
      const promise = audio.play();
      if (promise && promise.catch) {
        promise.catch(() => {
          // Autoplay policy or missing file; ignore safely
        });
      }
      return audio;
    } catch (err) {
      console.warn('[SFXManager] Error playing sound:', url, err);
      return null;
    }
  }

  /**
   * Play Pokémon cry by national dex number (e.g. 1 -> 001Cry.ogg, 25 -> 025Cry.ogg)
   */
  playCry(speciesId, volumeScale = 0.9) {
    if (!speciesId) return;
    const num = parseInt(speciesId, 10);
    if (isNaN(num)) return;
    const padded = String(num).padStart(3, '0');
    return this.play(`/assets/audio/se/cries/${padded}Cry.ogg`, volumeScale);
  }

  /**
   * Play Music Effect (ME) such as victory fanfare, temporarily ducking BGM
   */
  playME(filename, bgmManager = null, volumeScale = 1) {
    const vol = this.getVolume() * volumeScale;
    if (vol <= 0) return;

    if (this.currentME) {
      try {
        this.currentME.pause();
        this.currentME.currentTime = 0;
      } catch (e) {}
    }

    try {
      const fullUrl = filename.startsWith('/') ? filename : `/assets/audio/me/${filename}`;
      const audio = new Audio(fullUrl);
      audio.volume = Math.max(0, Math.min(1, vol));
      this.currentME = audio;

      let prevBgmVol = 0.35;
      if (bgmManager && bgmManager.synth) {
        prevBgmVol = bgmManager.synth.masterVol || 0.35;
        bgmManager.synth.setMasterVol(0.05); // Duck BGM
      }

      audio.onended = () => {
        if (this.currentME === audio) {
          this.currentME = null;
        }
        if (bgmManager && bgmManager.synth) {
          bgmManager.synth.setMasterVol(bgmManager.isMuted ? 0 : bgmManager.volume);
        }
      };

      const promise = audio.play();
      if (promise && promise.catch) {
        promise.catch(() => {});
      }
    } catch (e) {
      console.warn('[SFXManager] Error playing ME:', filename, e);
    }
  }

  // Pre-configured Battle SFX
  playThrow() {
    return this.play('Battle throw.ogg', 0.85);
  }

  playBallOpen() {
    return this.play('Battle recall.wav', 0.8);
  }

  playBallDrop() {
    return this.play('Battle ball drop.ogg', 0.8);
  }

  playBallShake() {
    return this.play('Battle ball shake.wav', 0.85);
  }

  playDamage(effectiveness = 'normal') {
    if (effectiveness === 'super') {
      return this.play('Battle damage super.ogg', 0.85);
    } else if (effectiveness === 'weak') {
      return this.play('Battle damage weak.ogg', 0.8);
    }
    return this.play('Battle damage normal.ogg', 0.8);
  }

  playAttackHit() {
    return this.play('/assets/audio/se/anim/Blow1.ogg', 0.75);
  }

  playFaint() {
    return this.play('Battle flee.ogg', 0.8);
  }

  playFlee() {
    return this.play('Battle flee.ogg', 0.85);
  }

  playCursor() {
    return this.play('GUI sel cursor.ogg', 0.6);
  }

  playDecision() {
    return this.play('GUI sel decision.ogg', 0.7);
  }

  playCancel() {
    return this.play('GUI sel cancel.ogg', 0.7);
  }

  playVictory(bgmManager = null) {
    return this.playME('Battle victory wild.ogg', bgmManager, 0.9);
  }

  playCatchSuccess(bgmManager = null) {
    return this.playME('Battle capture success.ogg', bgmManager, 0.95);
  }
}

const sfxManager = new SFXManager();
export default sfxManager;
