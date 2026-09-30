import SocketClient from '../network/SocketClient';
import { getPokemonAnimatedSprite } from '../utils/pokemonAssets';

function isBattleOpen() {
  try {
    if (window._battleUI?.isOpen) return true;
    const el = document.getElementById('battle-ui-container');
    return Boolean(el && !el.classList.contains('hidden'));
  } catch (e) {
    return false;
  }
}

function findPartySpeciesId(pokemonId) {
  if (pokemonId == null) return null;
  const pools = [
    window._pokemonStorageUI?.party,
    window._partyHUDUI?.party,
  ];
  for (const pool of pools) {
    const found = (pool || []).find(p => Number(p.id) === Number(pokemonId));
    if (found && (found.speciesId || found.species?.id)) {
      return found.speciesId || found.species.id;
    }
  }
  return null;
}

export default class EvolutionUI {
  constructor(worldScene) {
    this.worldScene = worldScene;
    this.modal = null;
    this.isOpen = false;
    this.isEvolving = false;
    this.currentData = null;
    this._pulseInterval = null;
    this._autoEvolveTimer = null;
    this.pendingQueue = [];

    this.initDOM();
    this.bindEvents();
    this.listenNetwork();
  }

  initDOM() {
    let el = document.getElementById('pkmn-evolution-modal');
    if (el) el.remove();

    el = document.createElement('div');
    el.id = 'pkmn-evolution-modal';
    el.className = 'pkmn-evolution-modal hidden';
    el.innerHTML = `
      <div class="pevo-backdrop"></div>
      <div class="pevo-window">
        <!-- Fullscreen evolution scene -->
        <div class="pevo-stage-container">
          <div class="pevo-evo-aura" id="pevo-aura"></div>
          <div class="pevo-glow-ring"></div>
          <div class="pevo-particles" id="pevo-particles"></div>

          <!-- Pokémon silhouette stage -->
          <div class="pevo-sprite-stage">
            <img id="pevo-sprite" class="pevo-sprite" src="" alt="Evolução" />
          </div>
        </div>

        <!-- FireRed dialogue box -->
        <div class="pevo-dialogue-box">
          <p id="pevo-dialogue-text" class="pevo-dialogue-text">O quê?! Pokémon está evoluindo!</p>
        </div>

        <!-- Finish only appears when done — no exit mid-evolution -->
        <div class="pevo-actions-bar">
          <button id="pevo-finish-btn" class="pevo-finish-btn hidden">
            CONCLUIR
          </button>
        </div>
        <div class="pevo-white-flash hidden" id="pevo-white-flash"></div>
      </div>
    `;

    document.body.appendChild(el);
    this.modal = el;
    this.spriteEl = document.getElementById('pevo-sprite');
    this.textEl = document.getElementById('pevo-dialogue-text');
    this.finishBtn = document.getElementById('pevo-finish-btn');
    this.flashEl = document.getElementById('pevo-white-flash');
  }

  bindEvents() {
    this.finishBtn?.addEventListener('click', () => this.close());

    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      // Enter or Space finishes, but only after the evolution is done
      if ((e.key === 'Enter' || e.key === ' ') && !this.isEvolving) {
        e.preventDefault();
        this.close();
      }
    });
  }

  listenNetwork() {
    SocketClient.on('pokemon:evolution_eligible', (data) => {
      if (data && data.targetSpeciesId) {
        this.startEvolution(data);
      }
    });

    SocketClient.on('pokemon:evolve_success', (data) => {
      this.handleEvolveSuccess(data);
    });
  }

  /** Overworld-only: evolutions triggered mid-battle wait for scene exit. */
  flushQueue() {
    if (this.isOpen || isBattleOpen()) return;
    const next = this.pendingQueue.shift();
    if (next) this.startEvolution(next);
  }

  startEvolution(data) {
    if (!data) return;
    // Defer to overworld — never during battle
    if (isBattleOpen()) {
      this.pendingQueue.push(data);
      return;
    }
    this.currentData = data;
    this.isOpen = true;
    this.isEvolving = true;

    this.modal.classList.remove('hidden');
    this.finishBtn.classList.add('hidden');
    this.flashEl?.classList.add('hidden');

    const monName = data.pokemonName || 'Seu Pokémon';
    const targetName = data.targetSpeciesName || 'uma nova forma';

    this.textEl.innerText = `O quê?! ${monName} está evoluindo!`;

    // Sprites — resolve current form from client party (server event may
    // omit currentSpeciesId; never fall back to Bulbasaur silently)
    let currentSpeciesId = data.currentSpeciesId || data.currentSpecies?.id
      || findPartySpeciesId(data.pokemonId);
    const targetSpeciesId = data.targetSpeciesId;

    const baseFmt = currentSpeciesId ? String(currentSpeciesId).padStart(3, '0') : null;
    const targetFmt = String(targetSpeciesId).padStart(3, '0');

    const baseSpriteSrc = baseFmt
      ? getPokemonAnimatedSprite(baseFmt, { isShiny: Boolean(data.isShiny) })
      : getPokemonAnimatedSprite(targetFmt, { isShiny: Boolean(data.isShiny) });
    const targetSpriteSrc = getPokemonAnimatedSprite(targetFmt, { isShiny: Boolean(data.isShiny) });

    this.spriteEl.src = baseSpriteSrc;
    this.spriteEl.classList.remove('is-silhouette', 'flash-white', 'burst-glow');

    // Pulse sequence alternating between base and target form silhouettes
    let toggle = false;
    let cycleCount = 0;
    const totalCycles = 16;
    let intervalTime = 380;

    clearInterval(this._pulseInterval);
    clearTimeout(this._autoEvolveTimer);

    const runPulse = () => {
      if (!this.isEvolving) return;

      cycleCount++;
      toggle = !toggle;

      this.spriteEl.classList.add('is-silhouette');
      this.spriteEl.src = toggle ? targetSpriteSrc : baseSpriteSrc;

      if (cycleCount >= totalCycles) {
        // Pulse complete! Trigger evolution on server
        clearInterval(this._pulseInterval);
        this.textEl.innerText = `${monName} está brilhando intensamente...!`;
        this.spriteEl.classList.add('flash-white');
        this.flashEl?.classList.remove('hidden');

        this._autoEvolveTimer = setTimeout(() => {
          this.flashEl?.classList.add('hidden');
          SocketClient.emit('pokemon:evolve', {
            pokemonId: data.pokemonId,
            targetSpeciesId: data.targetSpeciesId
          });
        }, 1200);
      } else {
        // Accelerate pulse
        intervalTime = Math.max(90, intervalTime - 18);
        clearInterval(this._pulseInterval);
        this._pulseInterval = setInterval(runPulse, intervalTime);
      }
    };

    // Begin pulse after 1.5s initial contemplation
    this._autoEvolveTimer = setTimeout(() => {
      if (this.isEvolving) {
        this._pulseInterval = setInterval(runPulse, intervalTime);
      }
    }, 1500);
  }

  handleEvolveSuccess(result) {
    this.isEvolving = false;
    this.finishBtn.classList.remove('hidden');

    const newMon = result.pokemon;
    const targetFmt = String(newMon.speciesId).padStart(3, '0');
    const newSpriteSrc = getPokemonAnimatedSprite(targetFmt, { isShiny: Boolean(newMon.isShiny) });

    this.spriteEl.classList.remove('is-silhouette', 'flash-white');
    this.spriteEl.classList.add('burst-glow');
    this.spriteEl.src = newSpriteSrc;

    const newName = result.newSpeciesName || newMon.nickname || newMon.species?.name;
    const oldName = result.oldSpeciesName || 'Seu Pokémon';

    let successMsg = `Parabéns! Seu ${oldName} evoluiu para ${newName}!`;
    if (result.movesLearned && result.movesLearned.length > 0) {
      const movesStr = result.movesLearned.map(m => m.name).join(', ');
      successMsg += ` Aprendeu: ${movesStr}!`;
    }

    this.textEl.innerText = successMsg;
  }

  close() {
    this.isOpen = false;
    this.isEvolving = false;
    clearInterval(this._pulseInterval);
    clearTimeout(this._autoEvolveTimer);
    this.modal.classList.add('hidden');
    this.spriteEl.className = 'pevo-sprite';
    this.flashEl?.classList.add('hidden');
    // Chain any evolutions that waited for overworld
    this.flushQueue();
  }
}
