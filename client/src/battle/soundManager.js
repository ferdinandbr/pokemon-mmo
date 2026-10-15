import bgmManager from '../audio/BGMManager.js';

// Sound Manager for Pokemon Arena 2D & Global Audio Coordination
class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.6;
    this.audioCache = new Map();
    this.activeMusic = null;
    this.audioCtx = null;
    this.userInteracted = false;

    if (typeof window !== 'undefined') {
      window._soundManager = this;
    }
  }

  initUserGesture() {
    if (typeof window === 'undefined') return;
    if (this.userInteracted) return;
    this.userInteracted = true;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
      }
    } catch (e) {
      console.warn('AudioContext init failed', e);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.activeMusic) {
      this.activeMusic.volume = this.volume * 0.85;
    }
  }

  toggleMute() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.activeMusic) {
      this.activeMusic.pause();
    } else if (this.enabled && this.activeMusic) {
      this.activeMusic.play().catch(() => {});
    }
    return this.enabled;
  }

  /**
   * Toca uma faixa musical (BGM ou ME como vitória ou captura).
   * REGRA P0: Se qualquer outra música estiver tocando (BGM MIDI ou ME Audio), ela é parada!
   */
  playMusic(src, relativeVol = 0.85, loop = false) {
    if (!this.enabled || typeof window === 'undefined' || !src) return null;
    this.initUserGesture();

    // 1. Interrompe a trilha MIDI do BGMManager imediatamente
    try {
      if (bgmManager) {
        bgmManager.stop();
      }
    } catch (e) {}

    // 2. Interrompe qualquer música HTMLAudio anterior
    this.stopMusic();

    try {
      const audio = new Audio(src);
      audio.volume = Math.max(0, Math.min(1, this.volume * relativeVol));
      audio.loop = loop;
      this.activeMusic = audio;

      audio.onended = () => {
        if (this.activeMusic === audio) {
          this.activeMusic = null;
        }
      };

      const playPromise = audio.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {});
      }
      return audio;
    } catch (e) {
      console.warn('[SoundManager] Falha ao reproduzir música:', src, e);
      return null;
    }
  }

  stopMusic() {
    if (this.activeMusic) {
      try {
        this.activeMusic.pause();
        this.activeMusic.currentTime = 0;
        this.activeMusic.src = '';
      } catch (e) {}
      this.activeMusic = null;
    }
  }

  playCry(cryPath) {
    if (!this.enabled || !cryPath) return;
    this.playFile(cryPath, 0.85);
  }

  playHit(isSuper = false, isBlocked = false) {
    if (!this.enabled) return;
    if (isBlocked) {
      this.playSynthShield();
      return;
    }
    const path = isSuper
      ? '/assets/audio/se/battle_damage_super.ogg'
      : '/assets/audio/se/battle_damage_normal.ogg';
    this.playFile(path, 0.7);
  }

  playSkillSound(soundPath) {
    if (!this.enabled || !soundPath) return;
    this.playFile(soundPath, 0.75);
  }

  play(soundPath, relativeVol = 0.75) {
    if (!this.enabled || !soundPath) return;
    this.playFile(soundPath, relativeVol);
  }

  playPhysicalStrike() {
    if (!this.enabled) return;
    this.playFile('/assets/audio/se/anim/Blow1.ogg', 0.65);
  }

  playShoot() {
    if (!this.enabled) return;
    this.playFile('/assets/audio/se/anim/Blow1.ogg', 0.65);
  }

  playCursor() {
    if (!this.enabled) return;
    this.playFile('/assets/audio/se/gui_sel_cursor.ogg', 0.55);
  }

  playDecision() {
    if (!this.enabled) return;
    this.playFile('/assets/audio/se/gui_sel_decision.ogg', 0.6);
  }

  playShieldActivate() {
    if (!this.enabled) return;
    this.playSynthShield();
  }

  playGuardBreak() {
    if (!this.audioCtx || !this.enabled) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.32);
      gain.gain.setValueAtTime(this.volume * 0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }

  playVictory(isTrainer = false) {
    if (!this.enabled) return;
    const track = isTrainer
      ? '/assets/audio/me/battle_victory_trainer.ogg'
      : '/assets/audio/me/battle_victory_wild.ogg';
    this.playMusic(track, 0.85, false);
  }

  playCaptureSuccess() {
    if (!this.enabled) return;
    this.playMusic('/assets/audio/me/battle_capture_success.ogg', 0.85, false);
  }

  playFile(src, relativeVol = 1.0) {
    if (!this.enabled || typeof window === 'undefined') return;
    this.initUserGesture();

    try {
      let pool = this.audioCache.get(src);
      if (!pool) {
        pool = [];
        this.audioCache.set(src, pool);
      }

      // Encontra um elemento de áudio ocioso ou cria um novo
      let audio = pool.find((a) => a.paused || a.ended);
      if (!audio) {
        if (pool.length < 5) {
          audio = new Audio(src);
          pool.push(audio);
        } else {
          audio = pool[0];
          try { audio.pause(); audio.currentTime = 0; } catch (e) {}
        }
      }

      audio.currentTime = 0;
      audio.volume = Math.max(0, Math.min(1, this.volume * relativeVol));
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          this.playSynthFallback();
        });
      }
    } catch {
      this.playSynthFallback();
    }
  }

  playSynthShield() {
    if (!this.audioCtx || !this.enabled) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(this.volume * 0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch (e) {}
  }

  playSynthFallback() {
    if (!this.audioCtx || !this.enabled) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(this.volume * 0.2, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    } catch (e) {}
  }
}

export const soundManager = new SoundManager();
