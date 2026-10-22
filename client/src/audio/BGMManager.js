import WebAudioTinySynth from 'webaudio-tinysynth';

const REGION_BGM_MAP = {
  'kanto': '/assets/audio/bgm/begin.mid',
  // Cidades & Vilas
  'pallet_town': '/assets/audio/bgm/begin.mid',
  'viridian_city': '/assets/audio/bgm/018-Field01.mid',
  'pewter_city': '/assets/audio/bgm/018-Field01.mid',
  'cerulean_city': '/assets/audio/bgm/021-Field04.mid',
  'vermilion_city': '/assets/audio/bgm/021-Field04n.mid',
  'lavender_town': '/assets/audio/bgm/Cave.mid',
  'celadon_city': '/assets/audio/bgm/022-Field05.mid',
  'saffron_city': '/assets/audio/bgm/018-Field01.mid',
  'fuchsia_city': '/assets/audio/bgm/Safari.mid',
  'cinnabar_island': '/assets/audio/bgm/cinnabar.mid',
  'indigo_plateau': '/assets/audio/bgm/battle_elite.mid',

  // Rotas
  'route_1': '/assets/audio/bgm/route.mid',
  'route_2': '/assets/audio/bgm/route.mid',
  'route_3': '/assets/audio/bgm/route.mid',
  'route_4': '/assets/audio/bgm/route.mid',
  'route_5': '/assets/audio/bgm/021-Field04.mid',
  'route_6': '/assets/audio/bgm/021-Field04.mid',
  'route_7': '/assets/audio/bgm/022-Field05.mid',
  'route_8': '/assets/audio/bgm/022-Field05.mid',
  'route_9': '/assets/audio/bgm/route.mid',
  'route_10': '/assets/audio/bgm/route.mid',
  'route_11': '/assets/audio/bgm/route.mid',

  // Temas especiais
  'intro': '/assets/audio/bgm/radio_oak.mid',
  'title': '/assets/audio/bgm/Title.mid',
  'oak_lab': '/assets/audio/bgm/Lab.mid',
  'battle_wild': '/assets/audio/bgm/battle_wild.mid',
  'battle_trainer': '/assets/audio/bgm/battle_trainer.mid',
  'gym': '/assets/audio/bgm/gym.mid',
  'pokecenter': '/assets/audio/bgm/poke_center.mid',
  'pokemart': '/assets/audio/bgm/poke_mart.mid',
  'bicycle': '/assets/audio/bgm/Bicycle.mid',
  'surfing': '/assets/audio/bgm/Surfing.mid'
};

class BGMManager {
  constructor() {
    this.synth = null;
    this.currentTrack = null;
    this.isMuted = localStorage.getItem('pokemmo_bgm_muted') === 'true';
    this.volume = parseFloat(localStorage.getItem('pokemmo_bgm_volume') || '0.35');
    this.pendingTrack = null;
    this.isLoading = false;
    this.isStopped = false;
    this.disabled = true; // Soundtracks disabled by user request
    this._currentRequestId = 0;

    if (typeof window !== 'undefined') {
      window._bgmManager = this;
    }

    // Attach unlock listener for browser autoplay restrictions (fires only until unlocked)
    this._attachUnlockHandler();
  }

  _initSynth() {
    if (this.synth) return;
    try {
      this.synth = new WebAudioTinySynth({
        quality: 1,
        useReverb: 1,
        voices: 48
      });
      this.synth.setLoop(1);
      this.synth.setMasterVol(this.isMuted ? 0 : this.volume);
    } catch (err) {
      console.warn('[BGMManager] Falha ao inicializar sintetizador:', err);
    }
  }

  _attachUnlockHandler() {
    if (typeof window === 'undefined') return;

    const events = ['click', 'keydown', 'touchstart', 'pointerdown'];
    let unlocked = false;

    const unlock = async () => {
      this._initSynth();
      const ctx = this.synth?.getAudioContext?.();
      if (ctx && ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch (e) {}
      }

      // Once successfully resumed, remove the unlock listeners completely
      if (!unlocked && ctx && ctx.state === 'running') {
        unlocked = true;
        events.forEach((evt) => {
          try { window.removeEventListener(evt, unlock, { capture: true }); } catch (e) {}
        });
      }

      // If a track was queued before user gesture, play it now
      if (this.pendingTrack && !this.isStopped) {
        const track = this.pendingTrack;
        this.pendingTrack = null;
        this.playUrl(track);
      }
    };

    events.forEach((evt) => {
      window.addEventListener(evt, unlock, { capture: true, passive: true });
    });
  }

  /**
   * Toca a música correspondente à região ou chave de tema
   * @param {string} roomIdOrTrackKey
   */
  async playForRoom(roomIdOrTrackKey) {
    if (this.disabled) return;
    const trackUrl = REGION_BGM_MAP[roomIdOrTrackKey] || REGION_BGM_MAP['pallet_town'];
    return this.playUrl(trackUrl);
  }

  /**
   * Alias de conveniência para tocar trilhas por chave
   */
  async play(roomIdOrTrackKey) {
    if (this.disabled) return;
    return this.playForRoom(roomIdOrTrackKey);
  }

  /**
   * Toca um arquivo MIDI direto pela URL de forma confiável via ArrayBuffer.
   * Garante que APENAS UMA música toque por vez: interrompe qualquer BGM anterior ou ME ativo.
   * @param {string} trackUrl
   */
  async playUrl(trackUrl) {
    if (this.disabled) {
      if (this.synth) {
        try { this.synth.stopMIDI(); } catch (e) {}
      }
      return;
    }
    if (!trackUrl) return;

    this.isStopped = false;
    const requestId = ++this._currentRequestId;

    // 1. Interrompe qualquer música HTMLAudio tocando no SoundManager (ex: vitória/fanfarra)
    try {
      if (typeof window !== 'undefined' && window._soundManager?.stopMusic) {
        window._soundManager.stopMusic();
      }
    } catch (e) {}

    this._initSynth();
    const ctx = this.synth?.getAudioContext?.();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {}
    }

    if (this.currentTrack === trackUrl && this.synth) {
      const status = this.synth.getPlayStatus?.();
      if (status && status.play) return; // Já está tocando exatamente esta trilha
    }

    if (ctx && ctx.state === 'suspended') {
      // Navegador ainda não autorizou áudio, fila até o primeiro clique/tecla
      this.pendingTrack = trackUrl;
      return;
    }

    // 2. Para a trilha atual do sintetizador antes de carregar a próxima
    if (this.synth) {
      try { this.synth.stopMIDI(); } catch (e) {}
    }

    this.currentTrack = trackUrl;
    this.isLoading = true;

    try {
      // Baixa os bytes do MIDI diretamente como ArrayBuffer
      const res = await fetch(trackUrl);
      if (!res.ok) throw new Error(`Status HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();

      // Se outra música foi solicitada ou stop() foi chamado durante o download, aborte!
      if (this._currentRequestId !== requestId || this.isStopped) {
        return;
      }

      if (this.synth) {
        this.synth.stopMIDI();
        this.synth.loadMIDI(arrayBuffer);
        this.synth.setLoop(1);
        this.synth.setMasterVol(this.isMuted ? 0 : this.volume);
        this.synth.playMIDI();
        console.log(`[BGMManager] 🎵 Tocando trilha sonora: ${trackUrl}`);
      }
    } catch (err) {
      if (this._currentRequestId === requestId) {
        console.warn(`[BGMManager] Não foi possível reproduzir trilha ${trackUrl}:`, err);
      }
    } finally {
      if (this._currentRequestId === requestId) {
        this.isLoading = false;
      }
    }
  }

  stop(clearCurrent = true) {
    this._currentRequestId++;
    if (clearCurrent) {
      this.isStopped = true;
      this.currentTrack = null;
      this.pendingTrack = null;
    }
    if (this.synth) {
      try {
        this.synth.stopMIDI();
      } catch (e) {}
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('pokemmo_bgm_volume', String(this.volume));
    if (this.synth && !this.isMuted) {
      this.synth.setMasterVol(this.volume);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('pokemmo_bgm_muted', String(this.isMuted));
    if (this.synth) {
      this.synth.setMasterVol(this.isMuted ? 0 : this.volume);
    }
    return this.isMuted;
  }
}

export const bgmManager = new BGMManager();
export default bgmManager;
