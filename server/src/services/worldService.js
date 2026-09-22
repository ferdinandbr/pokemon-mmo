/**
 * WorldService – Server-side authoritative manager for Day/Night cycle and Weather.
 * Drives dynamic weather with random durations and sensible atmospheric Markov transitions.
 * Broadcasts synchronized state to all connected game clients.
 */

const WEATHER_TYPES = {
  CLEAR: 'clear',
  SUNNY: 'sunny',
  RAIN: 'rain',
  STORM: 'storm',
  SNOW: 'snow',
  FOG: 'fog',
  SANDSTORM: 'sandstorm'
};

// Sensible atmospheric transitions (Markov probability table)
// Prohibits contradictory jumps (e.g. snow/storm -> sandstorm)
const WEATHER_TRANSITIONS = {
  clear: [
    { target: 'clear', weight: 35 },
    { target: 'sunny', weight: 30 },
    { target: 'fog', weight: 15 },
    { target: 'rain', weight: 15 },
    { target: 'snow', weight: 5 }
  ],
  sunny: [
    { target: 'clear', weight: 50 },
    { target: 'sunny', weight: 25 },
    { target: 'fog', weight: 15 },
    { target: 'sandstorm', weight: 10 } // Only from dry/hot sunny conditions
  ],
  rain: [
    { target: 'rain', weight: 30 },
    { target: 'storm', weight: 30 },    // Rain can escalate into storm
    { target: 'fog', weight: 20 },
    { target: 'clear', weight: 20 }
    // Never sandstorm, never intense sunny
  ],
  storm: [
    { target: 'rain', weight: 65 },     // Storm dissipates back into rain
    { target: 'fog', weight: 20 },
    { target: 'clear', weight: 15 }
    // Never sandstorm, never snow
  ],
  snow: [
    { target: 'snow', weight: 35 },
    { target: 'fog', weight: 35 },      // Cold mist/fog
    { target: 'clear', weight: 20 },
    { target: 'rain', weight: 10 }      // Sleet/thaw
    // Never sandstorm, never intense sunny
  ],
  fog: [
    { target: 'clear', weight: 40 },
    { target: 'rain', weight: 25 },
    { target: 'sunny', weight: 20 },
    { target: 'snow', weight: 15 }
    // Never storm or sandstorm directly
  ],
  sandstorm: [
    { target: 'sunny', weight: 55 },    // Wind drops, desert sun remains
    { target: 'clear', weight: 30 },
    { target: 'sandstorm', weight: 15 }
    // Never rain, snow, or storm directly
  ]
};

// Durations for each weather type (in milliseconds)
const WEATHER_DURATION_RANGES = {
  storm: { min: 4 * 60 * 1000, max: 8 * 60 * 1000 },      // Storms are shorter and intense
  rain: { min: 8 * 60 * 1000, max: 18 * 60 * 1000 },
  snow: { min: 8 * 60 * 1000, max: 16 * 60 * 1000 },
  fog: { min: 6 * 60 * 1000, max: 14 * 60 * 1000 },
  sunny: { min: 12 * 60 * 1000, max: 24 * 60 * 1000 },
  sandstorm: { min: 5 * 60 * 1000, max: 10 * 60 * 1000 },
  clear: { min: 15 * 60 * 1000, max: 30 * 60 * 1000 }
};

class WorldService {
  constructor() {
    this.io = null;

    // Day & Night cycle configuration
    this.dayDuration = 60 * 60 * 1000;        // 1 hour
    this.nightDuration = 60 * 60 * 1000;      // 1 hour
    this.transitionDuration = 8 * 60 * 1000;  // 8 minutes
    this.totalCycleDuration = this.dayDuration + this.nightDuration;

    // Weather state
    this.currentWeather = WEATHER_TYPES.CLEAR;
    this.weatherStartedAt = Date.now();
    this.weatherDurationMs = this.getRandomDuration(WEATHER_TYPES.CLEAR);
    this.weatherTimer = null;

    // Heartbeat ticker
    this.heartbeatInterval = null;
    this.lastBroadcastPhase = null;
  }

  init(io) {
    this.io = io;
    console.log('[WorldService] Inicializando sistema autoritativo de Clima e Dia/Noite...');

    // Schedule initial weather transition
    this.scheduleNextWeatherTransition();

    // Start 1-second server ticker to detect phase transitions & sync clients
    this.heartbeatInterval = setInterval(() => {
      this.tick();
    }, 1000);

    const initialTimeState = this.calculateTimeState();
    console.log(`[WorldService] Horário inicial: ${initialTimeState.clockTime} (${initialTimeState.phase}), Clima: ${this.currentWeather} (${Math.round(this.weatherDurationMs / 60000)} min)`);
  }

  // ─── Day / Night Calculation (Server Authoritative) ─────────────────────────

  calculateTimeState(timestamp = Date.now()) {
    const t = timestamp % this.totalCycleDuration;
    const transition = this.transitionDuration;
    const dayEnd = this.dayDuration;
    const total = this.totalCycleDuration;

    let phase = 'day';
    let remainingMs = 0;
    let icon = '☀️';
    let label = 'Dia';

    if (t < dayEnd - transition) {
      phase = 'day';
      remainingMs = (dayEnd - transition) - t;
      icon = '☀️';
      label = 'Dia';
    } else if (t < dayEnd) {
      phase = 'dusk';
      remainingMs = dayEnd - t;
      icon = '🌅';
      label = 'Entardecer';
    } else if (t < total - transition) {
      phase = 'night';
      remainingMs = (total - transition) - t;
      icon = '🌙';
      label = 'Noite';
    } else {
      phase = 'dawn';
      remainingMs = total - t;
      icon = '🌄';
      label = 'Amanhecer';
    }

    // 24-hour virtual clock (mapped to start at 08:00 morning)
    const cycleFrac = t / total;
    const virtualTotalMins = (Math.floor(cycleFrac * 24 * 60) + 8 * 60) % (24 * 60);
    const vHours = String(Math.floor(virtualTotalMins / 60)).padStart(2, '0');
    const vMins = String(virtualTotalMins % 60).padStart(2, '0');
    const clockTime = `${vHours}:${vMins}`;

    return {
      phase,
      remainingMs: Math.round(remainingMs),
      icon,
      label,
      clockTime,
      serverTime: timestamp,
      cycleProgress: cycleFrac,
      totalCycleDuration: this.totalCycleDuration,
      dayDuration: this.dayDuration,
      nightDuration: this.nightDuration,
      transitionDuration: this.transitionDuration
    };
  }

  // ─── Weather System (Markov State Machine & Random Duration) ─────────────────

  getRandomDuration(weatherType) {
    const range = WEATHER_DURATION_RANGES[weatherType] || { min: 10 * 60 * 1000, max: 20 * 60 * 1000 };
    return Math.floor(range.min + Math.random() * (range.max - range.min));
  }

  isNightTime() {
    const timeState = this.calculateTimeState();
    return timeState.phase === 'night' || timeState.phase === 'dusk';
  }

  pickNextSensibleWeather(currentWeather) {
    const isNight = this.isNightTime();
    let transitions = WEATHER_TRANSITIONS[currentWeather] || WEATHER_TRANSITIONS.clear;

    // Se for noite ou entardecer, proíbe 'sunny' (sol intenso) e reatribui o peso para 'clear'
    if (isNight) {
      transitions = transitions.map(item => {
        if (item.target === 'sunny') {
          return { target: 'clear', weight: item.weight };
        }
        return item;
      });
    }

    const totalWeight = transitions.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;

    for (const item of transitions) {
      if (rand < item.weight) {
        return item.target;
      }
      rand -= item.weight;
    }

    return isNight ? 'clear' : transitions[0].target;
  }

  scheduleNextWeatherTransition() {
    if (this.weatherTimer) {
      clearTimeout(this.weatherTimer);
    }

    const elapsed = Date.now() - this.weatherStartedAt;
    const remaining = Math.max(1000, this.weatherDurationMs - elapsed);

    this.weatherTimer = setTimeout(() => {
      this.advanceWeather();
    }, remaining);
  }

  advanceWeather() {
    const previous = this.currentWeather;
    let next = this.pickNextSensibleWeather(previous);

    // Salvaguarda final: nunca permite 'sunny' à noite
    if (this.isNightTime() && next === 'sunny') {
      next = 'clear';
    }

    const nextDuration = this.getRandomDuration(next);

    this.currentWeather = next;
    this.weatherStartedAt = Date.now();
    this.weatherDurationMs = nextDuration;

    console.log(`[WorldService] 🌦️ Clima mudou: ${previous.toUpperCase()} ➔ ${next.toUpperCase()} (Duração: ${Math.round(nextDuration / 60000)} min)`);

    if (this.io) {
      this.io.emit('world:weather', this.getWeatherState());
    }

    this.scheduleNextWeatherTransition();
  }

  setWeather(weatherType, customDurationMs = null) {
    if (!WEATHER_TYPES[weatherType.toUpperCase()] && !Object.values(WEATHER_TYPES).includes(weatherType)) {
      console.warn(`[WorldService] Clima inválido: ${weatherType}`);
      return false;
    }

    let normalized = weatherType.toLowerCase();

    // Se for noite/entardecer e tentarem forçar 'sunny', ajusta para 'clear'
    if (this.isNightTime() && normalized === 'sunny') {
      console.warn(`[WorldService] Não é possível aplicar sol intenso ('sunny') à noite. Ajustando para 'clear'.`);
      normalized = 'clear';
    }

    this.currentWeather = normalized;
    this.weatherStartedAt = Date.now();
    this.weatherDurationMs = customDurationMs || this.getRandomDuration(normalized);

    console.log(`[WorldService] ⛈️ Clima atualizado: ${normalized.toUpperCase()} (${Math.round(this.weatherDurationMs / 60000)} min)`);

    if (this.io) {
      this.io.emit('world:weather', this.getWeatherState());
    }

    this.scheduleNextWeatherTransition();
    return true;
  }

  getWeatherState() {
    const elapsed = Date.now() - this.weatherStartedAt;
    const remaining = Math.max(0, this.weatherDurationMs - elapsed);

    return {
      weather: this.currentWeather,
      remainingMs: remaining,
      durationMs: this.weatherDurationMs,
      startedAt: this.weatherStartedAt
    };
  }

  // ─── Ticker / Heartbeat ──────────────────────────────────────────────────────

  tick() {
    const timeState = this.calculateTimeState();

    // Broadcast phase change when Day/Night phase changes
    if (timeState.phase !== this.lastBroadcastPhase) {
      this.lastBroadcastPhase = timeState.phase;
      console.log(`[WorldService] 🌅 Transição de fase Dia/Noite: ${timeState.phase.toUpperCase()} (${timeState.clockTime})`);
      if (this.io) {
        this.io.emit('world:time', timeState);
      }

      // Se transicionou para entardecer ou noite e o clima ativo for 'sunny', converte para 'clear' imediatamente
      if ((timeState.phase === 'night' || timeState.phase === 'dusk') && this.currentWeather === WEATHER_TYPES.SUNNY) {
        console.log(`[WorldService] 🌙 Entrando na ${timeState.phase}: sol intenso desativado, clima agora é 'clear' (céu limpo)`);
        this.currentWeather = WEATHER_TYPES.CLEAR;
        this.weatherStartedAt = Date.now();
        this.weatherDurationMs = this.getRandomDuration(WEATHER_TYPES.CLEAR);
        if (this.io) {
          this.io.emit('world:weather', this.getWeatherState());
        }
        this.scheduleNextWeatherTransition();
      }
    }
  }

  // Full state snapshot sent to joining players
  getFullWorldState() {
    return {
      time: this.calculateTimeState(),
      weather: this.getWeatherState()
    };
  }
}

module.exports = new WorldService();
