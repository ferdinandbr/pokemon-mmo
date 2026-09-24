import WebAudioTinySynth from 'webaudio-tinysynth';

const REGION_BGM_MAP = {
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
  'indigo_plateau': '/assets/audio/bgm/Battle Elite.mid',

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
  'intro': '/assets/audio/bgm/Radio - Oak.mid',
  'title': '/assets/audio/bgm/Title.mid',
  'oak_lab': '/assets/audio/bgm/Lab.mid',
  'battle_wild': '/assets/audio/bgm/Battle wild.mid',
  'battle_trainer': '/assets/audio/bgm/Battle trainer.mid',
  'gym': '/assets/audio/bgm/gym.mid',
  'pokecenter': '/assets/audio/bgm/Poke Center.mid',
  'pokemart': '/assets/audio/bgm/Poke Mart.mid',
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

    // Attach unlock listener for browser autoplay restrictions
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
    const unlock = async () => {
      this._initSynth();
      const ctx = this.synth?.getAudioContext?.();
      if (ctx && ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch (e) {}
      }

      if (this.pendingTrack) {
        const track = this.pendingTrack;
        this.pendingTrack = null;
        this.playUrl(track);
      } else if (this.currentTrack && this.synth) {
        const status = this.synth.getPlayStatus?.();
        if (!status || !status.play) {
          try {
            this.synth.playMIDI();
          } catch (e) {}
        }
      }
    };

    ['click', 'keydown', 'touchstart', 'pointerdown'].forEach((evt) => {
      window.addEventListener(evt, unlock, { capture: true, passive: true });
    });
  }

  /**
   * Toca a música correspondente à região ou chave de tema
   * @param {string} roomIdOrTrackKey
   */
  async playForRoom(roomIdOrTrackKey) {
    const trackUrl = REGION_BGM_MAP[roomIdOrTrackKey] || REGION_BGM_MAP['pallet_town'];
    return this.playUrl(trackUrl);
  }

  /**
   * Toca um arquivo MIDI direto pela URL de forma confiável via ArrayBuffer
   * @param {string} trackUrl
   */
  async playUrl(trackUrl) {
    if (!trackUrl) return;

    this._initSynth();
    const ctx = this.synth?.getAudioContext?.();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {}
    }

    if (this.currentTrack === trackUrl && this.synth) {
      const status = this.synth.getPlayStatus?.();
      if (status && status.play) return; // Já está tocando
    }

    if (ctx && ctx.state === 'suspended') {
      // Navegador ainda não autorizou áudio, fila até o primeiro clique/tecla
      this.pendingTrack = trackUrl;
      return;
    }

    if (this.isLoading) {
      this.pendingTrack = trackUrl;
      return;
    }

    this.isLoading = true;
    try {
      this.stop();
      this.currentTrack = trackUrl;

      // Baixa os bytes do MIDI diretamente como ArrayBuffer (100% síncrono e confiável no sintetizador)
      const res = await fetch(trackUrl);
      if (!res.ok) throw new Error(`Status HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();

      if (this.synth) {
        this.synth.loadMIDI(arrayBuffer);
        this.synth.setLoop(1);
        this.synth.setMasterVol(this.isMuted ? 0 : this.volume);
        this.synth.playMIDI();
        console.log(`[BGMManager] 🎵 Tocando trilha sonora: ${trackUrl}`);
      }
    } catch (err) {
      console.warn(`[BGMManager] Não foi possível reproduzir trilha ${trackUrl}:`, err);
    } finally {
      this.isLoading = false;
      if (this.pendingTrack && this.pendingTrack !== trackUrl) {
        const next = this.pendingTrack;
        this.pendingTrack = null;
        this.playUrl(next);
      }
    }
  }

  stop() {
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
