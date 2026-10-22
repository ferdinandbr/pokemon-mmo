// Authentic PokéMMO Battle HUD Controller with Real Pokémon Stats & Moves
// Real-Time 2D Movement Combat with Main Choices Menu (Fight, Bag, Pokémon, Run)
import { TYPE_COLORS, getTypeIconSvg } from './pokemonData.js';
import { soundManager } from './soundManager.js';
import { formatSpeciesId, getPokemonOverworldSprite } from '../utils/pokemonAssets.js';
import { getItemIcon } from '../ui/BagUI.js';

export class BattleHud {
  constructor({
    battleEngine,
    container,
    worldScene = null,
    onSwitchPokemon,
    onRun,
    onFinish,
    onUseItem,
    onSoundToggle,
  }) {
    // Singleton tracking to eliminate duplicate HUDs or overlapping cards
    if (typeof window !== 'undefined') {
      if (window._activeBattleHud && window._activeBattleHud !== this) {
        try { window._activeBattleHud.destroy(); } catch (e) {}
      }
      window._activeBattleHud = this;
    }

    this.engine = battleEngine;
    this.container = container;
    this.worldScene = worldScene || (typeof window !== 'undefined' ? window._worldScene : null);
    this.onSwitchPokemon = onSwitchPokemon;
    this.onRun = onRun;
    this.onFinish = onFinish || null;
    this.onUseItem = onUseItem || (() => {});
    this.onSoundToggle = onSoundToggle;

    this.currentSubMenu = 'main'; // 'main' | 'fight' | 'bag' | 'team'
    this.currentBagTab = 'balls'; // 'balls' | 'medicine'
    this.selectedBagItem = null;
    this.reviveItemPending = null;

    this.hudRafId = null;
    this._keyHandler = null;
    this._renderedMovesSignature = null;

    this.renderInitialDom();
    this.bindEvents();
    this.switchSubMenu('main');
    this.update();
    this.startHudLoop();
  }

  startHudLoop() {
    const loop = () => {
      this.update();
      this.hudRafId = requestAnimationFrame(loop);
    };
    this.hudRafId = requestAnimationFrame(loop);
  }

  onPlayerPokemonDeployed(mon) {
    const pDatabox = document.getElementById('battle-player-databox');
    if (pDatabox) {
      pDatabox.classList.remove('hidden');
      pDatabox.classList.add('databox-slide-in');
    }
    const hints = document.querySelector('.swsh-action-hints');
    if (hints) hints.style.display = 'flex';

    if (this.currentSubMenu === 'fight' || this.isWaitingForDeployToFight) {
      this.isWaitingForDeployToFight = false;
      this.switchSubMenu('fight');
    } else {
      this.switchSubMenu(this.currentSubMenu || 'main');
    }

    this.engine?.setCombatActive(true);
    if (this.engine?.playerEntity) {
      this.renderMovesCluster(this.engine.playerEntity);
    }
    this.update();
  }

  destroy() {
    if (this.hudRafId) {
      cancelAnimationFrame(this.hudRafId);
      this.hudRafId = null;
    }
    if (this._keyHandler && typeof window !== 'undefined') {
      window.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
    if (typeof window !== 'undefined' && window._activeBattleHud === this) {
      window._activeBattleHud = null;
    }
  }

  renderInitialDom() {
    this.container.innerHTML = `
      <div class="swsh-battle-hud-layout" id="swsh-battle-hud-layout">
        <!-- TOP RIGHT: Opponent Databox with Right Circle Avatar -->
        <div class="swsh-databox swsh-enemy-hud hud pixel databox-slide-in" id="battle-enemy-databox">
          <div class="hud-databox-content enemy-content">
            <div class="name-row">
              <div class="name-group">
                <span class="name" id="enemy-name">Pokémon</span>
                <span class="databox-status-badge hidden" id="enemy-status-badge"></span>
                <div class="swsh-caught-ball enemy-caught-ball hidden" id="enemy-caught-icon" title="Capturado"></div>
              </div>
              <div class="level">
                <span class="gender-symbol male" id="enemy-gender">♂</span>
                <div class="level-pill" id="enemy-level">
                  <span class="lv">Lv.</span><span class="lv-num" id="enemy-level-num">--</span>
                </div>
              </div>
            </div>

            <div class="banner enemy-banner">
              <div class="banner-row hp-row">
                <span class="hp-label">HP</span>
                <div class="hp-bar-track">
                  <div class="hp-bar-fill healthy" id="enemy-hp-fill" style="width: 100%;"></div>
                </div>
              </div>
            </div>

            <div class="swsh-party-dots enemy-dots" id="enemy-party-dots"></div>
          </div>
          <div class="hud-mon-circle enemy-circle" id="enemy-avatar-circle" title="Pokémon Inimigo">
            <img id="enemy-avatar-img" class="hud-avatar-img" src="" alt="Enemy" onerror="this.style.display='none'" />
          </div>
        </div>

        <!-- TOP LEFT: Player Databox with Left Circle Avatar -->
        <div class="swsh-databox swsh-player-hud hud pixel databox-slide-in" id="battle-player-databox">
          <div class="hud-mon-circle player-circle" id="player-avatar-circle" title="Seu Pokémon">
            <img id="player-avatar-img" class="hud-avatar-img" src="" alt="Player" onerror="this.style.display='none'" />
          </div>
          <div class="hud-databox-content player-content">
            <div class="name-row">
              <div class="name-group">
                <span class="name" id="player-name">Pokémon</span>
                <span class="databox-status-badge hidden" id="player-status-badge"></span>
              </div>
              <div class="level">
                <span class="gender-symbol male" id="player-gender">♂</span>
                <div class="level-pill" id="player-level">
                  <span class="lv">Lv.</span><span class="lv-num" id="player-level-num">--</span>
                </div>
              </div>
            </div>

            <div class="banner">
              <div class="banner-row hp-row">
                <span class="hp-label">HP</span>
                <div class="hp-bar-track">
                  <div class="hp-bar-fill healthy" id="player-hp-fill" style="width: 100%;"></div>
                </div>
              </div>
              <div class="banner-row exp-row">
                <span class="exp-label">HP</span>
                <span class="exp-numbers" id="player-hp-text">-- / --</span>
              </div>
            </div>

            <!-- EXP Progress Strip -->
            <div class="exp-strip" id="player-exp-strip">
              <div class="filled" id="player-exp-fill" style="width: 65%;"></div>
              <div class="unfilled" id="player-exp-unfill" style="width: 35%;"></div>
            </div>

            <div class="swsh-party-dots player-dots" id="player-party-dots"></div>
          </div>
        </div>

        <!-- RIGHT-CENTER: 5 VERTICAL QUICK ACCESS ITEM SLOTS (OVERWORLD HOTBAR STYLE) -->
        <div class="battle-quick-items-hud" id="battle-quick-items-hud" title="Itens de Acesso Rápido">
          <div class="bquick-slot-item empty" id="bquick-slot-0" data-slot="0">
            <span class="bquick-hotkey">1</span>
            <img class="bquick-icon" src="" alt="" style="display: none;" />
            <span class="bquick-qty"></span>
          </div>
          <div class="bquick-slot-item empty" id="bquick-slot-1" data-slot="1">
            <span class="bquick-hotkey">2</span>
            <img class="bquick-icon" src="" alt="" style="display: none;" />
            <span class="bquick-qty"></span>
          </div>
          <div class="bquick-slot-item empty" id="bquick-slot-2" data-slot="2">
            <span class="bquick-hotkey">3</span>
            <img class="bquick-icon" src="" alt="" style="display: none;" />
            <span class="bquick-qty"></span>
          </div>
          <div class="bquick-slot-item empty" id="bquick-slot-3" data-slot="3">
            <span class="bquick-hotkey">4</span>
            <img class="bquick-icon" src="" alt="" style="display: none;" />
            <span class="bquick-qty"></span>
          </div>
          <div class="bquick-slot-item empty" id="bquick-slot-4" data-slot="4">
            <span class="bquick-hotkey">5</span>
            <img class="bquick-icon" src="" alt="" style="display: none;" />
            <span class="bquick-qty"></span>
          </div>
        </div>

        <!-- TOP COMBAT ACTION TICKER (Placed directly below Top Databoxes) -->
        <div class="combat-ticker-wrap" id="combat-ticker-wrap">
          <div class="combat-ticker-banner" id="combat-ticker-banner">
            <span class="combat-ticker-icon" id="combat-ticker-icon">⚔️</span>
            <span class="combat-ticker-text" id="combat-ticker-text">Prepare-se para a batalha!</span>
          </div>
        </div>

        <!-- UNIFIED BOTTOM COMMAND BAR (Initial modal with FIGHT, BAG, POKEMON, RUN) -->
        <div class="swsh-command-bar" id="battle-command-bar">
          <div class="swsh-action-container" id="battle-action-panel">
            <div class="swsh-main-menu" id="battle-main-menu">
              <button class="swsh-action-btn btn-fight active" id="bbtn-fight" title="Lutar [1 / ESPAÇO]">
                <span class="swsh-btn-arrow">▶</span>
                <span class="swsh-btn-lbl">FIGHT</span>
              </button>
              <button class="swsh-action-btn btn-bag" id="bbtn-bag" title="Mochila [2 / B]">
                <span class="swsh-btn-arrow">▶</span>
                <span class="swsh-btn-lbl">BAG</span>
              </button>
              <button class="swsh-action-btn btn-pokemon" id="bbtn-pokemon" title="Equipe Pokémon [3 / P]">
                <span class="swsh-btn-arrow">▶</span>
                <span class="swsh-btn-lbl">POKÉMON</span>
              </button>
              <button class="swsh-action-btn btn-run" id="bbtn-run" title="Fugir da Batalha [4 / F]">
                <span class="swsh-btn-arrow">▶</span>
                <span class="swsh-btn-lbl">RUN</span>
              </button>
            </div>
          </div>
        </div>

        <!-- BOTTOM COMBAT ACTION CLUSTER (New Unified Console Tray: DEF [D] | 4 Moves | ATK [Espaço]) -->
        <div class="battle-action-cluster" id="battle-action-cluster">
          <!-- Small sub-nav buttons positioned above moves 1 and 2 -->
          <div class="cluster-sub-nav">
            <button class="cluster-pill-btn btn-pill-back" id="bbtn-moves-back" title="Voltar ao Menu Inicial [ESC]">
              <span class="pill-arrow">◀</span> VOLTAR <span class="pill-key">[ESC]</span>
            </button>
            <button class="cluster-pill-btn btn-pill-run" id="bbtn-moves-run" title="Fugir da Batalha [F]">
              <span class="pill-pokeball-icon">
                <svg viewBox="0 0 16 16" width="12" height="12">
                  <circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#000" stroke-width="1.2"/>
                  <path d="M1 8a7 7 0 0 1 14 0H1z" fill="#ef4444"/>
                  <line x1="1" y1="8" x2="15" y2="8" stroke="#000" stroke-width="1.4"/>
                  <circle cx="8" cy="8" r="2.5" fill="#ffffff" stroke="#000" stroke-width="1.2"/>
                  <circle cx="8" cy="8" r="1" fill="#000"/>
                </svg>
              </span>
              FUGIR <span class="pill-key">[F]</span>
            </button>
          </div>

          <div class="cluster-main-row">
            <!-- 1. Round Defense Button [Q] -->
            <button class="battle-round-action-btn btn-action-def" id="bbtn-def-stance" title="Defesa [Q] (-70% Dano por 1.5s)">
              <div class="round-btn-inner">
                <span class="round-btn-hotkey round-btn-hotkey-def">[Q]</span>
                <div class="round-def-shield-icon">
                  <svg viewBox="0 0 24 28" width="20" height="24">
                    <path d="M12 2L3 5v8c0 8 9 13 9 13s9-5 9-13V5l-9-3z" fill="#0c172a" stroke="#00d4ff" stroke-width="2"/>
                    <path d="M12 4L5 6.5v6.5c0 6 7 10.5 7 10.5V4z" fill="#ffffff"/>
                    <path d="M12 4v17.5c0 0 7-4.5 7-10.5V6.5L12 4z" fill="#ef4444"/>
                  </svg>
                </div>
                <span class="round-btn-lbl round-btn-lbl-def">DEF</span>
              </div>
              <div class="round-cd-overlay" id="def-cd-overlay">
                <span class="cd-timer-txt" id="def-cd-timer"></span>
              </div>
            </button>

            <!-- 2. 4 Move Buttons [1], [2], [3], [4] (Horizontal Row) -->
            <div class="battle-moves-row" id="battle-moves-row">
              <div class="battle-skill-card slot-0 active-card" id="bbtn-skill-0" data-slot="0" title="Golpe 1 [1]">
                <div class="bsc-caret">▲</div>
                <div class="bsc-row-top">
                  <div class="bsc-top-left">
                    <span class="bsc-hotkey">[1]</span>
                    <div class="bsc-type-pill type-pill-normal" id="bsc-type-0">
                      <span class="bsc-type-label">NORMAL</span>
                    </div>
                    <span class="bsc-name" id="bcs-name-0">—</span>
                  </div>
                  <span class="bsc-pp" id="bcs-pp-0">PP --/--</span>
                </div>
                <div class="bsc-row-bottom">
                  <div class="bsc-stats-group">
                    <span class="bsc-stat-item"><span class="bsc-stat-k">PWR</span> <span class="bsc-stat-v" id="bsc-pwr-0">—</span></span>
                    <span class="bsc-stat-item"><span class="bsc-stat-k">ACC</span> <span class="bsc-stat-v" id="bsc-acc-0">—</span></span>
                  </div>
                </div>
                <div class="cluster-cd-overlay" id="skill-cd-overlay-0">
                  <span class="cd-timer-txt" id="skill-cd-timer-0"></span>
                </div>
              </div>

              <div class="battle-skill-card slot-1" id="bbtn-skill-1" data-slot="1" title="Golpe 2 [2]">
                <div class="bsc-caret">▲</div>
                <div class="bsc-row-top">
                  <div class="bsc-top-left">
                    <span class="bsc-hotkey">[2]</span>
                    <div class="bsc-type-pill type-pill-normal" id="bsc-type-1">
                      <span class="bsc-type-label">NORMAL</span>
                    </div>
                    <span class="bsc-name" id="bcs-name-1">—</span>
                  </div>
                  <span class="bsc-pp" id="bcs-pp-1">PP --/--</span>
                </div>
                <div class="bsc-row-bottom">
                  <div class="bsc-stats-group">
                    <span class="bsc-stat-item"><span class="bsc-stat-k">PWR</span> <span class="bsc-stat-v" id="bsc-pwr-1">—</span></span>
                    <span class="bsc-stat-item"><span class="bsc-stat-k">ACC</span> <span class="bsc-stat-v" id="bsc-acc-1">—</span></span>
                  </div>
                </div>
                <div class="cluster-cd-overlay" id="skill-cd-overlay-1">
                  <span class="cd-timer-txt" id="skill-cd-timer-1"></span>
                </div>
              </div>

              <div class="battle-skill-card slot-2" id="bbtn-skill-2" data-slot="2" title="Golpe 3 [3]">
                <div class="bsc-caret">▲</div>
                <div class="bsc-row-top">
                  <div class="bsc-top-left">
                    <span class="bsc-hotkey">[3]</span>
                    <div class="bsc-type-pill type-pill-normal" id="bsc-type-2">
                      <span class="bsc-type-label">NORMAL</span>
                    </div>
                    <span class="bsc-name" id="bcs-name-2">—</span>
                  </div>
                  <span class="bsc-pp" id="bcs-pp-2">PP --/--</span>
                </div>
                <div class="bsc-row-bottom">
                  <div class="bsc-stats-group">
                    <span class="bsc-stat-item"><span class="bsc-stat-k">PWR</span> <span class="bsc-stat-v" id="bsc-pwr-2">—</span></span>
                    <span class="bsc-stat-item"><span class="bsc-stat-k">ACC</span> <span class="bsc-stat-v" id="bsc-acc-2">—</span></span>
                  </div>
                </div>
                <div class="cluster-cd-overlay" id="skill-cd-overlay-2">
                  <span class="cd-timer-txt" id="skill-cd-timer-2"></span>
                </div>
              </div>

              <div class="battle-skill-card slot-3" id="bbtn-skill-3" data-slot="3" title="Golpe 4 [4]">
                <div class="bsc-caret">▲</div>
                <div class="bsc-row-top">
                  <div class="bsc-top-left">
                    <span class="bsc-hotkey">[4]</span>
                    <div class="bsc-type-pill type-pill-normal" id="bsc-type-3">
                      <span class="bsc-type-label">NORMAL</span>
                    </div>
                    <span class="bsc-name" id="bcs-name-3">—</span>
                  </div>
                  <span class="bsc-pp" id="bcs-pp-3">PP --/--</span>
                </div>
                <div class="bsc-row-bottom">
                  <div class="bsc-stats-group">
                    <span class="bsc-stat-item"><span class="bsc-stat-k">PWR</span> <span class="bsc-stat-v" id="bsc-pwr-3">—</span></span>
                    <span class="bsc-stat-item"><span class="bsc-stat-k">ACC</span> <span class="bsc-stat-v" id="bsc-acc-3">—</span></span>
                  </div>
                </div>
                <div class="cluster-cd-overlay" id="skill-cd-overlay-3">
                  <span class="cd-timer-txt" id="skill-cd-timer-3"></span>
                </div>
              </div>
            </div>

            <!-- 3. Round Basic Attack Button [Espaço] -->
            <button class="battle-round-action-btn btn-action-atk" id="bbtn-basic-atk" title="Ataque Básico [Espaço] (Investida Curta)">
              <div class="round-btn-inner">
                <span class="round-btn-hotkey round-btn-hotkey-atk">ESPAÇO</span>
                <div class="round-atk-swords-row">
                  <span class="atk-arrow-left">◀</span>
                  <div class="round-atk-swords-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      <path d="M5 2l4 4-2 2-4-4V2h2z" fill="#f59e0b"/>
                      <path d="M7 4l12 12-2 2L5 6 7 4z" fill="#f8fafc"/>
                      <path d="M3 19l2 2-2 2-1-1 1-3zm16-17l4 4-2 2-4-4 2-2z" fill="#f59e0b"/>
                      <path d="M17 4L5 16l2 2L19 6l-2-2z" fill="#cbd5e1"/>
                    </svg>
                  </div>
                  <span class="atk-arrow-right">▶</span>
                </div>
                <span class="round-btn-lbl round-btn-lbl-atk">ATK</span>
              </div>
              <div class="round-cd-overlay" id="atk-cd-overlay">
                <span class="cd-timer-txt" id="atk-cd-timer"></span>
              </div>
            </button>
          </div>
        </div>

        <!-- MODAL BACKDROP -->
        <div class="battle-modal-backdrop hidden" id="battle-modal-backdrop"></div>

        <!-- 3. BAG ACTION MODAL (Mochila PokéMMO com Abas Pokébolas / Medicina) -->
        <div class="battle-modal-panel battle-bag-modal hidden" id="battle-bag-action-panel">
          <div class="battle-modal-shelf"></div>
          <div class="battle-modal-header">
            <div class="battle-modal-title">
              <img src="/assets/ui/hud_bag.png" class="bbm-title-sprite" alt="Bag" onerror="this.src='/assets/ui/custom_icons/3.png'" />
              <span>MOCHILA DO TREINADOR</span>
              <div class="bbm-capacity-badge">
                <span id="battle-bag-capacity-text">0 / 24 Slots</span>
              </div>
            </div>
            <button class="battle-modal-close" id="bbtn-bag-close" title="Fechar [ESC]">✕</button>
          </div>

          <div class="battle-bag-toolbar">
            <div class="swsh-bag-tabs" id="battle-bag-tabs">
              <button class="swsh-bag-tab active" data-tab="balls" id="bbt-tab-balls">
                <img src="/assets/ui/custom_icons/3.png" class="swsh-bag-tab-img" alt="" onerror="this.style.display='none'">
                <span>POKÉBOLAS</span>
              </button>
              <button class="swsh-bag-tab" data-tab="medicine" id="bbt-tab-medicine">
                <img src="/assets/ui/custom_icons/2.png" class="swsh-bag-tab-img" alt="" onerror="this.style.display='none'">
                <span>MEDICINA</span>
              </button>
            </div>
          </div>

          <div class="battle-bag-board" id="battle-bag-board">
            <div class="battle-bag-slots-grid" id="battle-bag-items-scroll"></div>

            <div class="battle-bag-footer-preview" id="bbap-preview">
              <div class="bbfp-left">
                <div class="bbfp-icon-wrap" id="bbap-icon-wrap"></div>
                <div class="bbfp-info">
                  <div class="bbfp-name-row">
                    <span class="bbfp-name" id="bbap-name">—</span>
                    <span class="bbfp-qty-pill" id="bbap-qty">X1</span>
                    <span class="bbfp-cat-pill" id="bbap-cat">GERAL</span>
                  </div>
                  <div class="bbfp-desc" id="battle-bag-item-desc">Selecione um item da mochila.</div>
                </div>
              </div>
              <div class="bbfp-actions">
                <button class="btn-use-item" id="bbtn-item-use">USAR ITEM</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. TEAM SWITCH MODAL (Equipe de até 6 Pokémon) -->
        <div class="battle-modal-panel battle-team-modal hidden" id="battle-team-action-panel">
          <div class="battle-modal-shelf"></div>
          <div class="battle-modal-header">
            <div class="battle-modal-title">
              <span class="btm-title-icon">⚡</span>
              <span id="battle-team-modal-title">EQUIPE POKÉMON</span>
              <div class="btm-badge-count" id="battle-team-count-badge">1/6</div>
            </div>
            <button class="battle-modal-close" id="bbtn-team-close" title="Fechar [ESC]">✕</button>
          </div>
          <div class="btm-subtitle btap-info" id="battle-team-subtitle">Trocar Pokémon em batalha</div>

          <div class="battle-team-board" id="battle-team-board">
            <div class="battle-team-cells-grid" id="battle-team-grid"></div>
            <div class="battle-team-footer">
              <button class="swsh-back-btn" id="bbtn-team-back">◀ VOLTAR</button>
            </div>
          </div>
        </div>

        <!-- 5-SECOND PRE-BATTLE COUNTDOWN OVERLAY -->
        <div class="battle-countdown-overlay hidden" id="battle-countdown-overlay">
          <div class="battle-countdown-card">
            <div class="battle-countdown-sub">BATALHA COMEÇA EM</div>
            <div class="battle-countdown-num" id="battle-countdown-num">5</div>
          </div>
        </div>

        <!-- MATCH OUTCOME BANNER -->
        <div class="match-result-overlay hidden" id="match-result-overlay">
          <div class="result-modal modal-victory" id="result-modal-box">
            <div class="result-badge-icon" id="result-badge-icon">🏆</div>
            <div class="result-title victory" id="result-title">VITÓRIA!</div>
            <div class="result-subtitle" id="result-subtitle">Você venceu a batalha!</div>

            <div class="result-stats-card" id="result-stats-card">
              <div class="result-mon-preview">
                <div class="result-mon-avatar-ring">
                  <img id="result-mon-img" src="" alt="Pokémon" onerror="this.style.display='none'" />
                </div>
                <div class="result-mon-meta">
                  <span class="result-mon-name" id="result-mon-name">Pokémon</span>
                  <span class="result-mon-lvl" id="result-mon-lvl">Nv. --</span>
                </div>
              </div>
              <div class="result-divider"></div>
              <div class="result-metrics">
                <div class="result-metric-item">
                  <span class="metric-label">STATUS</span>
                  <span class="metric-val status-win" id="result-status-val">VENCEDOR</span>
                </div>
                <div class="result-metric-item">
                  <span class="metric-label">EQUIPE</span>
                  <span class="metric-val" id="result-team-val">--</span>
                </div>
              </div>
            </div>

            <div class="result-actions">
              <button id="btn-result-finish" class="fr-result-btn">
                <span id="btn-result-text">Retornar ao Mundo</span>
                <span class="key-hint">(ESC)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // ─── 1. Main Menu Action Buttons (FIGHT, BAG, POKEMON, RUN) ──────────────
    const bbtnFight = document.getElementById('bbtn-fight');
    if (bbtnFight) {
      bbtnFight.addEventListener('click', () => {
        soundManager.playShoot();
        this.isWaitingForDeployToFight = true;
        if (!this.engine.playerEntity) {
          const firstConscious = this.engine.playerParty.findIndex(p => p && (typeof p.currentHp === 'number' ? p.currentHp : p.maxHp) > 0 && !p.isFainted);
          const idx = firstConscious >= 0 ? firstConscious : 0;
          this.engine.deployPlayerPokemon(idx);
          if (this.engine.isPvp && this.engine.onPvpAction) {
            this.engine.onPvpAction({ type: 'switch', partyIndex: idx });
          }
        }
        this.switchSubMenu('fight');
      });
    }

    // ─── 1.5. Combat Moves & Defense Action Cluster Events ─────────────────
    const bbtnMovesBack = document.getElementById('bbtn-moves-back');
    if (bbtnMovesBack) {
      bbtnMovesBack.addEventListener('click', () => {
        soundManager.playShoot();
        this.switchSubMenu('main');
      });
    }

    const bbtnMovesRun = document.getElementById('bbtn-moves-run');
    if (bbtnMovesRun) {
      bbtnMovesRun.addEventListener('click', () => {
        if (this.onRun) this.onRun();
      });
    }

    const bbtnDefStance = document.getElementById('bbtn-def-stance');
    if (bbtnDefStance) {
      bbtnDefStance.addEventListener('click', () => {
        this.engine?.executePlayerDefensive?.();
      });
    }

    const bbtnBasicAtk = document.getElementById('bbtn-basic-atk');
    if (bbtnBasicAtk) {
      bbtnBasicAtk.addEventListener('click', () => {
        this.engine?.executePlayerBasicAttack?.();
      });
    }

    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`bbtn-skill-${i}`);
      if (btn) {
        btn.addEventListener('click', () => {
          this.triggerMoveSlot(i);
        });
      }
    }

    // Bind 5 Right-Center Quick Items
    for (let i = 0; i < 5; i++) {
      const slotEl = document.getElementById(`bquick-slot-${i}`);
      if (slotEl) {
        slotEl.addEventListener('click', () => {
          this.triggerQuickSlot(i);
        });
      }
    }

    const bbtnBag = document.getElementById('bbtn-bag');
    if (bbtnBag) {
      bbtnBag.addEventListener('click', () => {
        soundManager.playShoot();
        this.switchSubMenu('bag');
      });
    }

    const bbtnPokemon = document.getElementById('bbtn-pokemon');
    if (bbtnPokemon) {
      bbtnPokemon.addEventListener('click', () => {
        soundManager.playShoot();
        // Do NOT recall active Pokemon here. Only switch when player actually selects one from the team board.
        this.switchSubMenu('team');
      });
    }

    const bbtnRun = document.getElementById('bbtn-run');
    if (bbtnRun) {
      bbtnRun.addEventListener('click', () => {
        if (this.onRun) this.onRun();
      });
    }

    // ─── 2. Bag Modal Events ────────────────────────────────────────────────
    const bbtnBagClose = document.getElementById('bbtn-bag-close');
    if (bbtnBagClose) {
      bbtnBagClose.addEventListener('click', () => {
        this.switchSubMenu(this.engine?.playerEntity ? 'fight' : 'main');
      });
    }

    const tabBalls = document.getElementById('bbt-tab-balls');
    if (tabBalls) {
      tabBalls.addEventListener('click', () => {
        this.currentBagTab = 'balls';
        this.renderBagBoard();
      });
    }

    const tabMedicine = document.getElementById('bbt-tab-medicine');
    if (tabMedicine) {
      tabMedicine.addEventListener('click', () => {
        this.currentBagTab = 'medicine';
        this.renderBagBoard();
      });
    }

    const btnItemUse = document.getElementById('bbtn-item-use');
    if (btnItemUse) {
      btnItemUse.addEventListener('click', () => {
        this.executeUseSelectedItem();
      });
    }

    // ─── 3. Team Modal Events ───────────────────────────────────────────────
    const bbtnTeamClose = document.getElementById('bbtn-team-close');
    if (bbtnTeamClose) {
      bbtnTeamClose.addEventListener('click', () => {
        if (this.engine.isAwaitingSwitch) return; // Cannot close if active mon fainted!
        this.switchSubMenu(this.engine?.playerEntity ? 'fight' : 'main');
      });
    }

    const bbtnTeamBack = document.getElementById('bbtn-team-back');
    if (bbtnTeamBack) {
      bbtnTeamBack.addEventListener('click', () => {
        if (this.engine.isAwaitingSwitch) {
          // If forced switch, back can open Bag to use Revive
          this.switchSubMenu('bag');
        } else {
          this.switchSubMenu(this.engine?.playerEntity ? 'fight' : 'main');
        }
      });
    }

    // ─── 4. Sound & Finish Events ───────────────────────────────────────────
    const btnSoundToggle = document.getElementById('btn-sound-toggle');
    if (btnSoundToggle) {
      btnSoundToggle.addEventListener('click', (e) => {
        const enabled = soundManager.toggleMute();
        e.target.textContent = enabled ? '🔊 Som' : '🔇 Mudo';
        if (this.onSoundToggle) this.onSoundToggle(enabled);
      });
    }

    const btnResultFinish = document.getElementById('btn-result-finish');
    if (btnResultFinish) {
      btnResultFinish.addEventListener('click', () => {
        this.hideMatchResult();
        if (this.onFinish) {
          this.onFinish();
        } else if (this.onRun) {
          this.onRun();
        }
      });
    }

    // ─── 5. Keyboard Bindings ───────────────────────────────────────────────
    this._keyHandler = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (this._matchEnded) {
        if (e.code === 'Escape' || e.code === 'Enter' || e.code === 'Space') {
          if (this.onFinish) {
            this.onFinish();
            return;
          }
        }
      }

      if (this.currentSubMenu === 'bag' || this.currentSubMenu === 'team') {
        if (e.code === 'Escape' && !this.engine.isAwaitingSwitch) {
          this.switchSubMenu('main');
        } else if (e.code === 'KeyB' && this.currentSubMenu === 'bag') {
          this.switchSubMenu('main');
        } else if (e.code === 'KeyP' && this.currentSubMenu === 'team' && !this.engine.isAwaitingSwitch) {
          this.switchSubMenu('main');
        }
        return;
      }

      if (this.currentSubMenu === 'fight') {
        if (e.code === 'Escape') {
          this.switchSubMenu('main');
          return;
        }
      }

      if (this.currentSubMenu === 'main') {
        if (e.code === 'Digit1' || e.code === 'Numpad1' || e.code === 'Space') {
          this.switchSubMenu('fight');
          return;
        } else if (e.code === 'Digit2' || e.code === 'Numpad2' || e.code === 'KeyB') {
          this.switchSubMenu('bag');
          return;
        } else if (e.code === 'Digit3' || e.code === 'Numpad3' || e.code === 'KeyP') {
          this.switchSubMenu('team');
          return;
        } else if (e.code === 'Digit4' || e.code === 'Numpad4' || e.code === 'KeyF') {
          if (this.onRun) this.onRun();
          return;
        }
      }

      // Real-time battle hotkeys in fight mode
      if (e.code === 'KeyQ') {
        this.engine?.executePlayerDefensive?.();
      } else if (e.code === 'Space') {
        this.engine?.executePlayerBasicAttack?.();
      } else if (!e.shiftKey && (e.code === 'Digit1' || e.code === 'Numpad1')) {
        this.triggerMoveSlot(0);
      } else if (!e.shiftKey && (e.code === 'Digit2' || e.code === 'Numpad2')) {
        this.triggerMoveSlot(1);
      } else if (!e.shiftKey && (e.code === 'Digit3' || e.code === 'Numpad3')) {
        this.triggerMoveSlot(2);
      } else if (!e.shiftKey && (e.code === 'Digit4' || e.code === 'Numpad4')) {
        this.triggerMoveSlot(3);
      } else if (e.code === 'Digit5' || e.code === 'Numpad5' || (e.shiftKey && (e.code === 'Digit1' || e.code === 'Numpad1'))) {
        this.triggerQuickSlot(0);
      } else if (e.code === 'Digit6' || e.code === 'Numpad6' || (e.shiftKey && (e.code === 'Digit2' || e.code === 'Numpad2'))) {
        this.triggerQuickSlot(1);
      } else if (e.code === 'Digit7' || e.code === 'Numpad7' || (e.shiftKey && (e.code === 'Digit3' || e.code === 'Numpad3'))) {
        this.triggerQuickSlot(2);
      } else if (e.code === 'Digit8' || e.code === 'Numpad8' || (e.shiftKey && (e.code === 'Digit4' || e.code === 'Numpad4'))) {
        this.triggerQuickSlot(3);
      } else if (e.code === 'Digit9' || e.code === 'Numpad9' || (e.shiftKey && (e.code === 'Digit5' || e.code === 'Numpad5'))) {
        this.triggerQuickSlot(4);
      } else if (e.code === 'KeyB') {
        this.switchSubMenu('bag');
      } else if (e.code === 'KeyP') {
        this.switchSubMenu('team');
      } else if (e.code === 'KeyF') {
        if (this.onRun) this.onRun();
      } else if (e.code === 'KeyM') {
        const enabled = soundManager.toggleMute();
        const btn = document.getElementById('btn-sound-toggle');
        if (btn) btn.textContent = enabled ? '🔊 Som' : '🔇 Mudo';
      }
    };
    window.addEventListener('keydown', this._keyHandler);
  }

  switchSubMenu(menuKey) {
    if (this.engine.isAwaitingSwitch) {
      menuKey = 'team';
    }

    this.currentSubMenu = menuKey;

    const commandBar = document.getElementById('battle-command-bar');
    const mainMenu = document.getElementById('battle-main-menu');
    const actionCluster = document.getElementById('battle-action-cluster');
    const bagModal = document.getElementById('battle-bag-action-panel');
    const teamModal = document.getElementById('battle-team-action-panel');
    const backdrop = document.getElementById('battle-modal-backdrop');

    // Update active highlight on main action buttons
    const btnFight = document.getElementById('bbtn-fight');
    const btnBag = document.getElementById('bbtn-bag');
    const btnPokemon = document.getElementById('bbtn-pokemon');
    const btnRun = document.getElementById('bbtn-run');

    btnFight?.classList.toggle('active', menuKey === 'fight' || menuKey === 'main');
    btnBag?.classList.toggle('active', menuKey === 'bag');
    btnPokemon?.classList.toggle('active', menuKey === 'team');
    btnRun?.classList.toggle('active', false);

    if (menuKey === 'main') {
      commandBar?.classList.remove('hidden');
      mainMenu?.classList.remove('hidden');
      actionCluster?.classList.add('hidden');
      bagModal?.classList.add('hidden');
      teamModal?.classList.add('hidden');
      backdrop?.classList.add('hidden');
    } else if (menuKey === 'fight') {
      this.engine?.setCombatActive(true);
      commandBar?.classList.add('hidden');
      actionCluster?.classList.remove('hidden');
      bagModal?.classList.add('hidden');
      teamModal?.classList.add('hidden');
      backdrop?.classList.add('hidden');
      const activeMon = this.engine.playerEntity || this.engine.playerParty[this.engine.activePlayerIndex];
      if (activeMon) {
        this.renderMovesCluster(activeMon);
      }
    } else if (menuKey === 'bag') {
      commandBar?.classList.remove('hidden');
      mainMenu?.classList.remove('hidden');
      actionCluster?.classList.add('hidden');
      bagModal?.classList.remove('hidden');
      teamModal?.classList.add('hidden');
      backdrop?.classList.remove('hidden');
      this.renderBagBoard();
    } else if (menuKey === 'team') {
      commandBar?.classList.remove('hidden');
      mainMenu?.classList.remove('hidden');
      actionCluster?.classList.add('hidden');
      bagModal?.classList.add('hidden');
      teamModal?.classList.remove('hidden');
      backdrop?.classList.remove('hidden');
      this.renderTeamBoard();
    }
  }

  showPartySwitchModal(party = this.engine.playerParty, activeIdx = this.engine.activePlayerIndex, isForced = false) {
    this.switchSubMenu('team');
  }

  renderTeamBoard() {
    const grid = document.getElementById('battle-team-grid');
    const title = document.getElementById('battle-team-modal-title');
    const subtitle = document.getElementById('battle-team-subtitle');
    const countBadge = document.getElementById('battle-team-count-badge');
    const closeBtn = document.getElementById('bbtn-team-close');
    const backBtn = document.getElementById('bbtn-team-back');
    if (!grid) return;

    const party = this.engine.playerParty || [];
    const activeIdx = this.engine.activePlayerIndex ?? 0;
    const isForced = this.engine.isAwaitingSwitch || !this.engine.playerEntity;

    if (countBadge) {
      countBadge.textContent = `${party.length}/6`;
    }

    if (title) {
      title.textContent = isForced
        ? (this.engine.isAwaitingSwitch ? '💀 POKÉMON DESMAIOU! ESCOLHA O PRÓXIMO:' : 'ESCOLHA O POKÉMON PARA LUTAR:')
        : 'EQUIPE POKÉMON';
    }

    if (subtitle) {
      subtitle.textContent = isForced
        ? 'Selecione um Pokémon consciente para entrar em combate.'
        : 'Trocar Pokémon em batalha';
      subtitle.style.color = isForced ? '#ef4444' : '';
    }

    if (closeBtn) {
      closeBtn.style.display = isForced ? 'none' : 'flex';
    }

    if (backBtn) {
      if (this.engine.isAwaitingSwitch) {
        backBtn.textContent = '🎒 ABRIR MOCHILA (REVIVE)';
      } else {
        backBtn.textContent = '◀ VOLTAR';
      }
    }

    grid.innerHTML = '';

    // Render cells in 6 columns (Image 2 style: 12 cells = 2 rows x 6 columns)
    const totalCells = Math.max(12, Math.ceil(party.length / 6) * 6);
    for (let idx = 0; idx < totalCells; idx++) {
      const pkmn = party[idx];
      const cell = document.createElement('div');

      if (pkmn) {
        const isFainted = pkmn.currentHp <= 0 || pkmn.isFainted;
        const isCurrent = Boolean(this.engine.playerEntity) && idx === activeIdx;
        const isShiny = Boolean(pkmn.isShiny);

        cell.className = `battle-pbc pkmn-box-cell ${isCurrent ? 'in-battle' : ''} ${isFainted ? 'is-fainted' : ''}`;

        const speciesId = pkmn.speciesId || pkmn.id || 1;
        const fmtId = formatSpeciesId(speciesId);
        const owSpriteUrl = getPokemonOverworldSprite(speciesId, { isShiny });
        const hpPct = Math.max(0, Math.min(100, Math.round(((pkmn.currentHp || 0) / (pkmn.maxHp || 1)) * 100)));
        const hpColor = hpPct > 50 ? 'hp-green' : hpPct > 20 ? 'hp-yellow' : 'hp-red';

        const genderSymbol = pkmn.gender === 'F' ? '♀' : pkmn.gender === 'M' ? '♂' : '';
        const genderClass = pkmn.gender === 'F' ? 'female' : 'male';
        const name = pkmn.nickname || pkmn.name || 'POKÉMON';

        let statusTag = '';
        if (isFainted) {
          statusTag = '<span class="pbc-tag-status fainted">DESMAIADO</span>';
        } else if (isCurrent) {
          statusTag = '<span class="pbc-tag-status in-battle">EM BATALHA</span>';
        }

        cell.innerHTML = `
          <span class="pbc-dex-num">#${fmtId}</span>
          ${genderSymbol ? `<span class="pbc-gender ${genderClass}">${genderSymbol}</span>` : ''}
          <div class="pkmn-ow-sprite pbc-ow-sprite" style="background-image: url('${owSpriteUrl}')"></div>
          <span class="pbc-name">${name}</span>
          <span class="pbc-level">Lv.${pkmn.level || 5}</span>
          <div class="pbc-hp-row" title="HP: ${Math.round(pkmn.currentHp)}/${pkmn.maxHp}">
            <span class="pbc-hp-lbl">HP</span>
            <div class="pbc-hp-track">
              <div class="pbc-hp-fill ${hpColor}" style="width: ${hpPct}%;"></div>
            </div>
          </div>
          ${statusTag}
        `;

        if (!isFainted && !isCurrent) {
          cell.addEventListener('mouseenter', () => {
            soundManager.playCursor?.();
          });
          cell.addEventListener('click', () => {
            soundManager.playDecision?.();
            this.switchSubMenu('fight');
            if (this.onSwitchPokemon) {
              this.onSwitchPokemon(idx);
            } else {
              this.engine.switchPlayerPokemon(idx);
            }
          });
        }
      } else {
        // Empty cell matching Image 2 with number in faint gray
        cell.className = 'battle-pbc pkmn-box-cell empty-cell';
        cell.innerHTML = `<span class="pbc-num">${idx + 1}</span>`;
      }

      grid.appendChild(cell);
    }
  }

  // ─── Bag Modal Rendering ─────────────────────────────────────────────────
  getItemBattleIcon(item) {
    if (!item) return '/assets/items/poke-ball.png';
    return getItemIcon(item);
  }

  renderBagBoard() {
    const scrollEl = document.getElementById('battle-bag-items-scroll');
    const capBadge = document.getElementById('battle-bag-capacity-text');
    if (!scrollEl) return;

    const bagTabs = this.container.querySelectorAll('.swsh-bag-tab');
    bagTabs.forEach(tab => {
      tab.classList.toggle('active', (tab.dataset.tab || 'balls') === this.currentBagTab);
    });

    const bagUI = this.worldScene?.bagUI || (typeof window !== 'undefined' ? window._bagUI : null);
    const bagItems = bagUI?.inventory || [];

    const totalCount = bagItems.filter(s => s && s.item && s.quantity > 0).length;
    if (capBadge) {
      capBadge.textContent = `${totalCount} / 24 Slots`;
    }

    const filtered = bagItems.filter(slot => {
      if (!slot || !slot.item || slot.quantity <= 0) return false;
      const cat = String(slot.item.category || '').toLowerCase();
      const name = String(slot.item.name || '').toLowerCase();

      if (this.currentBagTab === 'medicine') {
        return cat === 'medicine' ||
          name.includes('potion') || name.includes('poção') ||
          name.includes('revive') || name.includes('cure') ||
          name.includes('antidote') || name.includes('restore') ||
          name.includes('candy') || name.includes('heal');
      }
      return cat === 'pokeball' || name.includes('ball') || name.includes('bola');
    });

    scrollEl.innerHTML = '';

    const updateSelectedItem = (slot) => {
      this.selectedBagItem = slot;
      const bbapName = document.getElementById('bbap-name');
      const bbapQty = document.getElementById('bbap-qty');
      const bbapCat = document.getElementById('bbap-cat');
      const bbapIcon = document.getElementById('bbap-icon-wrap');
      const descEl = document.getElementById('battle-bag-item-desc');

      if (bbapName) bbapName.textContent = slot?.item?.name ? String(slot.item.name) : '—';
      if (bbapQty) bbapQty.textContent = slot?.quantity ? `X${slot.quantity}` : 'X0';
      if (bbapCat) {
        const cat = slot?.item?.category || (this.currentBagTab === 'balls' ? 'pokeball' : 'medicine');
        bbapCat.textContent = cat === 'pokeball' ? 'POKÉBOLA' : 'MEDICINA';
      }
      if (bbapIcon) {
        if (slot?.item) {
          const iconSrc = slot.item.icon || this.getItemBattleIcon(slot.item);
          bbapIcon.innerHTML = `<img src="${iconSrc}" alt="${slot.item.name}" onerror="this.src='/assets/battle/ui/ball_00.png'">`;
        } else {
          bbapIcon.innerHTML = '';
        }
      }
      if (descEl) {
        descEl.textContent = slot?.item?.description || (slot?.item ? `Item utilizável em combate: ${slot.item.name}.` : 'Selecione um item da mochila.');
      }
    };

    updateSelectedItem(filtered[0] || null);

    const totalSlots = 24;
    for (let i = 0; i < totalSlots; i++) {
      const slot = filtered[i];
      const slotEl = document.createElement('div');

      if (slot && slot.item) {
        const isSelected = this.selectedBagItem?.item?.id === slot.item.id;
        slotEl.className = `battle-bag-slot ${isSelected ? 'selected' : ''}`;
        const iconSrc = slot.item.icon || this.getItemBattleIcon(slot.item);

        slotEl.innerHTML = `
          <img src="${iconSrc}" class="bag-slot-icon" alt="${slot.item.name}" onerror="this.src='/assets/battle/ui/ball_00.png'">
          <span class="bag-slot-qty">x${slot.quantity}</span>
        `;

        slotEl.addEventListener('click', () => {
          scrollEl.querySelectorAll('.battle-bag-slot').forEach(s => s.classList.remove('selected'));
          slotEl.classList.add('selected');
          updateSelectedItem(slot);
        });

        slotEl.addEventListener('dblclick', () => {
          this.executeUseSelectedItem();
        });
      } else {
        slotEl.className = 'battle-bag-slot empty';
        slotEl.innerHTML = `<span class="bag-slot-empty-num">${i + 1}</span>`;
      }

      scrollEl.appendChild(slotEl);
    }
  }

  executeUseSelectedItem(fromQuickSlot = false) {
    if (!this.selectedBagItem || !this.selectedBagItem.item) {
      this.addLog('⚠️ Selecione um item da mochila primeiro!', 'system');
      return;
    }

    const slot = this.selectedBagItem;
    const item = slot.item;
    const itemName = item.name || 'Item';
    const isBall = String(item.category || '').toLowerCase() === 'pokeball' || itemName.toLowerCase().includes('ball') || itemName.toLowerCase().includes('bola');

    // PvP Item Rules: Only Potions allowed, max 3 uses per duel, all other items vetoed
    if (this.engine?.isPvp) {
      if (isBall) {
        this.addLog('⚠️ Não é permitido arremessar Pokébolas em duelos PvP!', 'system');
        return;
      }

      const isPotion = (
        String(item.category || '').toLowerCase() === 'medicine' ||
        itemName.toLowerCase().includes('potion') ||
        itemName.toLowerCase().includes('poção') ||
        itemName.toLowerCase().includes('pocao')
      ) && !itemName.toLowerCase().includes('revive');

      if (!isPotion) {
        this.addLog('⚠️ Durante duelos PvP, outros itens estão vetados por hora! Apenas Poções de cura são permitidas.', 'system');
        return;
      }

      this.pvpPotionsUsed = this.pvpPotionsUsed || 0;
      if (this.pvpPotionsUsed >= 3) {
        this.addLog(`⚠️ Limite de itens excedido! Você já atingiu o limite de 3 poções nesta batalha PvP (${this.pvpPotionsUsed}/3).`, 'system');
        return;
      }
    }

    if (isBall) {
      if (this.engine.enemyParty && this.engine.enemyParty.length > 1) {
        this.addLog('⚠️ Não é possível capturar Pokémon de outros treinadores!', 'system');
        return;
      }
      if (!fromQuickSlot) {
        this.switchSubMenu('main');
      }
      this.addLog(`🎒 Você arremessou 1x <strong>${itemName}</strong>!`, 'system');
      if (this.onUseItem) {
        this.onUseItem(item.id, null);
      }
    } else {
      // Medicine item: Potions / Revives
      const isRevive = itemName.toLowerCase().includes('revive');
      if (isRevive) {
        // Open team modal to pick fainted mon
        this.reviveItemPending = item;
        this.switchSubMenu('team');
        const subtitle = document.getElementById('battle-team-subtitle');
        if (subtitle) {
          subtitle.textContent = `Selecione o Pokémon desmaiado para usar ${itemName}.`;
          subtitle.style.color = '#38bdf8';
        }
      } else {
        // Heal active combatant
        const player = this.engine.playerEntity;
        if (player && !player.isFainted) {
          if (this.engine?.isPvp) {
            this.pvpPotionsUsed = (this.pvpPotionsUsed || 0) + 1;
          }
          const healAmt = item.healAmount || 50;
          player.currentHp = Math.min(player.maxHp, player.currentHp + healAmt);
          if (this.engine.playerParty[this.engine.activePlayerIndex]) {
            this.engine.playerParty[this.engine.activePlayerIndex].currentHp = player.currentHp;
          }
          this.engine.particleSystem.spawnPixelBurst(player.x, player.y, '#00E676', 25, 140, 0.5, 4);

          const pvpCounterText = this.engine?.isPvp ? ` (Poções no duelo: ${this.pvpPotionsUsed}/3)` : '';
          this.addLog(`💚 <strong>${player.data.name}</strong> recuperou HP com ${itemName}!${pvpCounterText}`, 'system');
          
          if (!fromQuickSlot) {
            this.switchSubMenu(this.engine.playerEntity ? 'fight' : 'main');
          }
          if (this.onUseItem) {
            this.onUseItem(item.id, player.data.id);
          }
          if (this.engine?.isPvp && this.engine.onPvpAction) {
            this.engine.onPvpAction({
              type: 'heal',
              amount: healAmt,
              newHp: player.currentHp,
              maxHp: player.maxHp
            });
          }
        }
      }
    }
    this.updateQuickItemsView();
  }

  triggerQuickSlot(slotIdx) {
    const bagUI = this.worldScene?.bagUI || (typeof window !== 'undefined' ? window._bagUI : null);
    if (!bagUI) return;

    const quickSlot = bagUI.hotbarSlots?.[slotIdx];
    if (!quickSlot || (!quickSlot.itemId && !quickSlot.itemName)) return;

    const inventory = bagUI.inventory || [];
    const invSlot = inventory.find(s => s && s.item && (
      (quickSlot.itemId && s.item.id === quickSlot.itemId) ||
      (quickSlot.itemName && s.item.name?.toLowerCase() === quickSlot.itemName?.toLowerCase())
    ) && s.quantity > 0);

    if (!invSlot || !invSlot.item) {
      this.addLog(`⚠️ Você não tem mais <strong>${quickSlot.itemName || 'este item'}</strong> na mochila!`, 'system');
      return;
    }

    const item = invSlot.item;
    const cat = String(item.category || '').toLowerCase();
    const isBall = cat === 'pokeball' || item.name?.toLowerCase().includes('ball') || item.name?.toLowerCase().includes('bola');
    const isMedicine = cat === 'medicine' || item.name?.toLowerCase().includes('potion') || item.name?.toLowerCase().includes('revive') || item.name?.toLowerCase().includes('heal');

    if (!isBall && !isMedicine) {
      this.addLog(`⚠️ <strong>${item.name}</strong> não pode ser usado em batalha!`, 'system');
      return;
    }

    if (this.engine?.isPvp) {
      const isPotion = (
        cat === 'medicine' ||
        item.name?.toLowerCase().includes('potion') ||
        item.name?.toLowerCase().includes('poção') ||
        item.name?.toLowerCase().includes('pocao')
      ) && !item.name?.toLowerCase().includes('revive');

      if (!isPotion) {
        this.addLog('⚠️ Durante duelos PvP, outros itens estão vetados por hora! Apenas Poções são permitidas.', 'system');
        return;
      }

      this.pvpPotionsUsed = this.pvpPotionsUsed || 0;
      if (this.pvpPotionsUsed >= 3) {
        this.addLog(`⚠️ Limite de itens atingido! Você só pode usar até 3 poções por duelo PvP (${this.pvpPotionsUsed}/3 usadas).`, 'system');
        return;
      }
    }

    this.selectedBagItem = invSlot;
    this.executeUseSelectedItem(true);
  }

  updateQuickItemsView() {
    const bagUI = this.worldScene?.bagUI || (typeof window !== 'undefined' ? window._bagUI : null);
    const hotbar = bagUI?.hotbarSlots || [];
    const inventory = bagUI?.inventory || [];

    for (let i = 0; i < 5; i++) {
      const slotEl = document.getElementById(`bquick-slot-${i}`);
      if (!slotEl) continue;

      const imgEl = slotEl.querySelector('.bquick-icon');
      const qtyEl = slotEl.querySelector('.bquick-qty');
      const hotbarSlot = hotbar[i];

      if (!hotbarSlot || (!hotbarSlot.itemId && !hotbarSlot.itemName)) {
        slotEl.className = 'bquick-slot-item empty';
        slotEl.title = `Slot ${i + 1} Vazio`;
        if (imgEl) imgEl.style.display = 'none';
        if (qtyEl) qtyEl.textContent = '';
        continue;
      }

      const invSlot = inventory.find(s => s && s.item && (
        (hotbarSlot.itemId && s.item.id === hotbarSlot.itemId) ||
        (hotbarSlot.itemName && s.item.name?.toLowerCase() === hotbarSlot.itemName?.toLowerCase())
      ));

      const item = invSlot?.item || { name: hotbarSlot.itemName };
      const qty = invSlot?.quantity || 0;
      const cat = String(item.category || '').toLowerCase();
      const isBall = cat === 'pokeball' || item.name?.toLowerCase().includes('ball') || item.name?.toLowerCase().includes('bola');
      const isMedicine = cat === 'medicine' || item.name?.toLowerCase().includes('potion') || item.name?.toLowerCase().includes('revive') || item.name?.toLowerCase().includes('heal');
      const isValid = isBall || isMedicine;

      slotEl.className = `bquick-slot-item ${qty <= 0 ? 'out-of-stock' : ''} ${!isValid ? 'invalid-battle-item' : ''}`;
      slotEl.title = `[${i + 1}] ${item.name || 'Item'} (${qty})` + (!isValid ? ' - Inválido em Batalha' : '');

      if (imgEl) {
        imgEl.src = this.getItemBattleIcon(item);
        imgEl.style.display = 'block';
      }
      if (qtyEl) {
        qtyEl.textContent = qty > 0 ? `${qty}` : '0';
      }
    }
  }

  triggerMoveSlot(slotIdx) {
    if (!this.engine || !this.engine.playerEntity) return;
    this.engine.setCombatActive(true);
    const player = this.engine.playerEntity;
    if (player.isFainted || player.isDizzy) return;

    const used = player.executeMove(slotIdx);
    if (used) {
      const btn = document.getElementById(`bbtn-skill-${slotIdx}`) || document.querySelector(`.swsh-move-btn[data-slot="${slotIdx}"]`);
      if (btn) {
        btn.classList.add('card-pressed');
        setTimeout(() => btn.classList.remove('card-pressed'), 120);
      }
    }
  }

  addLog(htmlMessage, type = 'normal') {
    const textEl = document.getElementById('battle-dialogue-text');
    if (textEl) {
      textEl.innerHTML = htmlMessage;
    }

    // Mirror to top combat action ticker banner (Ensure only 1 icon is displayed)
    const tickerText = document.getElementById('combat-ticker-text');
    const tickerBanner = document.getElementById('combat-ticker-banner');
    const tickerIcon = document.getElementById('combat-ticker-icon');
    if (tickerText && tickerBanner) {
      // Strip any duplicate leading emoji from htmlMessage so only tickerIcon is shown
      const cleanedMessage = htmlMessage.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, '').trim();
      tickerText.innerHTML = cleanedMessage;
      
      // Determine single type icon
      if (tickerIcon) {
        if (type === 'fire') tickerIcon.textContent = '🔥';
        else if (type === 'water') tickerIcon.textContent = '💧';
        else if (type === 'grass') tickerIcon.textContent = '🌿';
        else if (type === 'electric') tickerIcon.textContent = '⚡';
        else if (type === 'defensive') tickerIcon.textContent = '🛡️';
        else if (type === 'dodge') tickerIcon.textContent = '💨';
        else if (type === 'faint') tickerIcon.textContent = '💀';
        else if (type === 'victory') tickerIcon.textContent = '🎉';
        else if (type === 'heal') tickerIcon.textContent = '💚';
        else tickerIcon.textContent = '⚔️';
      }

      // Re-trigger subtle pulse
      tickerBanner.classList.remove('ticker-pulse');
      void tickerBanner.offsetWidth; // reflow
      tickerBanner.classList.add('ticker-pulse');
    }
  }

  showMatchResult(outcome, winnerData, rewards = null) {
    this._matchEnded = true;
    const overlay = document.getElementById('match-result-overlay');
    const modalBox = document.getElementById('result-modal-box');
    const badgeIcon = document.getElementById('result-badge-icon');
    const title = document.getElementById('result-title');
    const subtitle = document.getElementById('result-subtitle');
    const monImg = document.getElementById('result-mon-img');
    const monName = document.getElementById('result-mon-name');
    const monLvl = document.getElementById('result-mon-lvl');
    const statusVal = document.getElementById('result-status-val');
    const teamVal = document.getElementById('result-team-val');
    const btnText = document.getElementById('btn-result-text');

    const isWin = outcome === 'victory';

    // Update active / MVP Pokemon info
    const playerMon = this.engine?.playerEntity?.data || this.engine?.playerParty?.[this.engine?.activePlayerIndex || 0];
    if (playerMon) {
      const monId = String(playerMon.id || playerMon.speciesId || 1).padStart(3, '0');
      if (monImg) {
        monImg.src = `/assets/pokemon/animated/front/normal/${monId}.gif`;
        monImg.style.display = 'block';
      }
      if (monName) monName.textContent = playerMon.name || 'Pokémon';
      if (monLvl) monLvl.textContent = `Nv. ${playerMon.level || 50}`;
    }

    // Calculate survivors
    const party = this.engine?.playerParty || [];
    const survivors = party.filter(p => p && (typeof p.currentHp === 'number' ? p.currentHp : p.maxHp) > 0 && !p.isFainted).length;

    if (this.engine?.isPvp) {
      if (overlay && title && subtitle) {
        if (modalBox) {
          modalBox.className = `result-modal ${isWin ? 'modal-victory' : 'modal-defeat'}`;
        }
        if (badgeIcon) {
          badgeIcon.textContent = isWin ? '🏆' : '💀';
        }
        if (title) {
          title.textContent = isWin ? 'VITÓRIA PVP!' : 'DERROTA PVP';
          title.className = `result-title ${isWin ? 'victory' : 'defeat'}`;
        }
        if (subtitle) {
          subtitle.textContent = isWin
            ? `Você venceu o duelo contra ${this.engine.rivalTrainerName || 'o adversário'}!`
            : `Seus Pokémon não resistiram ao duelo contra ${this.engine.rivalTrainerName || 'o adversário'}.`;
        }
        if (statusVal) {
          statusVal.textContent = isWin ? 'CAMPEÃO' : 'DERROTADO';
          statusVal.className = `metric-val ${isWin ? 'status-win' : 'status-loss'}`;
        }
        if (teamVal) {
          teamVal.textContent = isWin ? `${survivors}/${party.length || 1} Vivos` : '0 Vivos (FNT)';
        }
        if (btnText) {
          btnText.textContent = 'Sair da Batalha';
        }
        overlay.classList.remove('hidden');
      }

      if (isWin) {
        this.addLog(`🎉 <strong>Vitória PvP!</strong> Você venceu o duelo contra ${this.engine.rivalTrainerName || 'o rival'}!`, 'victory');
      } else {
        this.addLog('💀 Seus Pokémon desmaiaram no combate contra o adversário.', 'faint');
      }
      return;
    }

    if (isWin) {
      // Wild victory: keep dialog in overworld
      if (overlay) overlay.classList.add('hidden');

      const enemyMon = this.engine?.enemyEntity?.data;
      const pName = playerMon?.name || 'Seu Pokémon';
      const lvl = enemyMon?.level || 5;

      const baseExp = enemyMon?.baseExp || 64;
      const pokeExp = Math.max(6, Math.floor(((baseExp * lvl) / 7) * 1.5));
      const trainerExp = Math.max(10, Math.floor(lvl * 18));
      const gold = Math.max(20, Math.floor(lvl * 35));

      const victoryMsg = `🎉 <strong>${pName}</strong> venceu! <b>+${pokeExp} EXP</b> para ${pName} | <b>+${trainerExp} EXP</b> de Treinador | <b>+$${gold}</b>! (Pressione ESC ou clique para sair)`;
      this.addLog(victoryMsg, 'victory');
    } else {
      if (overlay && title && subtitle) {
        if (modalBox) {
          modalBox.className = 'result-modal modal-defeat';
        }
        if (badgeIcon) {
          badgeIcon.textContent = '💀';
        }
        title.textContent = 'DERROTA...';
        title.className = 'result-title defeat';
        subtitle.textContent = 'Todos os seus Pokémon desmaiaram!';
        if (statusVal) {
          statusVal.textContent = 'DERROTADO';
          statusVal.className = 'metric-val status-loss';
        }
        if (teamVal) {
          teamVal.textContent = '0 Vivos (FNT)';
        }
        if (btnText) {
          btnText.textContent = 'Retornar ao Mundo';
        }
        overlay.classList.remove('hidden');
      }
      this.addLog('💀 Todos os seus Pokémon foram derrotados...', 'faint');
    }
  }

  hideMatchResult() {
    const overlay = document.getElementById('match-result-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  renderPartyDots() {
    const pContainer = document.getElementById('player-party-dots');
    const eContainer = document.getElementById('enemy-party-dots');

    if (pContainer && this.engine.playerParty) {
      let pHtml = '';
      for (let i = 0; i < 6; i++) {
        if (i < this.engine.playerParty.length) {
          const mon = this.engine.playerParty[i];
          const isActive = i === this.engine.activePlayerIndex;
          const isFainted = mon.currentHp <= 0 || mon.isFainted;
          const status = isActive ? 'active' : (isFainted ? 'fainted' : 'healthy alive');
          pHtml += `<div class="swsh-party-dot ${status}" title="${mon.name}"></div>`;
        } else {
          pHtml += `<div class="swsh-party-dot empty"></div>`;
        }
      }
      if (this._lastPlayerPartySig !== pHtml) {
        this._lastPlayerPartySig = pHtml;
        pContainer.innerHTML = pHtml;
      }
    }

    if (eContainer && this.engine.enemyParty) {
      let eHtml = '';
      const slots = Math.max(1, Math.min(6, this.engine.enemyParty.length));
      for (let i = 0; i < slots; i++) {
        const mon = this.engine.enemyParty[i];
        const isActive = i === this.engine.activeEnemyIndex;
        const isFainted = mon.currentHp <= 0 || mon.isFainted;
        const status = isActive ? 'active' : (isFainted ? 'fainted' : 'healthy alive');
        eHtml += `<div class="swsh-party-dot ${status}"></div>`;
      }
      if (this._lastEnemyPartySig !== eHtml) {
        this._lastEnemyPartySig = eHtml;
        eContainer.innerHTML = eHtml;
      }
    }
  }

  renderMovesBoard(player) {
    const movesBoard = document.getElementById('battle-moves-board');
    if (!movesBoard || !player) return;

    const moves = player.moves || [];
    const signature = moves.map(m => `${m.id}_${m.pp}`).join('|');
    if (this._renderedMovesSignature === signature) {
      this.updateMovesCooldowns(player);
      return;
    }
    this._renderedMovesSignature = signature;

    movesBoard.innerHTML = '';

    for (let i = 0; i < 4; i++) {
      const move = moves[i];
      const slotBtn = document.createElement('button');

      if (move) {
        const typeLower = String(move.type || 'normal').toLowerCase();
        const catLower = String(move.category || '').toLowerCase();
        const catLabel = catLower === 'physical' ? 'FÍSICO' : (catLower === 'special' ? 'ESPECIAL' : 'EFEITO');

        slotBtn.className = `swsh-move-btn type-card-${typeLower}`;
        slotBtn.dataset.slot = i;
        slotBtn.title = move.description || move.name || '';

        slotBtn.innerHTML = `
          <div class="smb-indicator type-bg-${typeLower}"></div>
          <div class="smb-body">
            <div class="dmc-top">
              <span class="dmc-hotkey">[${i + 1}]</span>
              <span class="dmc-name">${move.name}</span>
              <span class="dmc-pp ${move.pp <= 0 ? 'empty' : move.pp <= 5 ? 'low' : ''}">PP ${move.pp}/${move.maxPp}</span>
            </div>
            <div class="dmc-bottom">
              <div class="dmc-type-group">
                <span class="type-chip type-${typeLower}">${String(move.type || 'NORMAL').toUpperCase()}</span>
              </div>
              <div class="dmc-stats">
                <span class="dmc-stat-item"><span class="dmc-stat-k">PWR</span> <span class="dmc-stat-v">${move.power || '—'}</span></span>
                <span class="dmc-stat-item"><span class="dmc-stat-k">CD</span> <span class="dmc-stat-v">${move.cooldown}s</span></span>
              </div>
            </div>
          </div>
          <div class="move-cd-overlay" id="move-cd-overlay-${i}" style="height: 0%;">
            <span class="cd-timer-txt" id="move-cd-timer-${i}"></span>
          </div>
        `;

        slotBtn.addEventListener('click', () => {
          this.triggerMoveSlot(i);
        });

        slotBtn.addEventListener('mouseenter', () => {
          const bmdType = document.getElementById('bmd-type');
          const bmdPp = document.getElementById('bmd-pp');
          if (bmdType) {
            bmdType.textContent = String(move.type || 'NORMAL').toUpperCase();
            bmdType.className = `type-chip bmd-type type-${typeLower}`;
          }
          if (bmdPp) {
            bmdPp.textContent = `${move.pp}/${move.maxPp}`;
          }
        });

        if (move.pp <= 0) {
          slotBtn.classList.add('no-pp');
        }
      } else {
        slotBtn.className = 'swsh-move-btn empty-slot';
        slotBtn.innerHTML = '<span class="dmc-empty-label">— VAZIO —</span>';
      }

      movesBoard.appendChild(slotBtn);
    }

    this.renderMovesCluster(player);
  }

  // Render authentic moves into the bottom-right action cluster (Horizontal 4-card row)
  renderMovesCluster(player) {
    if (!player || !player.moves) return;

    for (let i = 0; i < 4; i++) {
      const move = player.moves[i];
      const cardEl = document.getElementById(`bbtn-skill-${i}`);
      const nameEl = document.getElementById(`bcs-name-${i}`);
      const ppEl = document.getElementById(`bcs-pp-${i}`);
      const typePill = document.getElementById(`bsc-type-${i}`);
      const pwrEl = document.getElementById(`bsc-pwr-${i}`);
      const accEl = document.getElementById(`bsc-acc-${i}`);
      if (!cardEl) continue;

      if (move) {
        const typeLower = String(move.type || 'normal').toLowerCase();
        const cleanName = String(move.name || '')
          .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
          .trim();

        cardEl.className = `battle-skill-card slot-${i} type-card-${typeLower} ${i === 0 ? 'active-card' : ''}`;
        cardEl.classList.remove('empty-slot');
        cardEl.title = `[${i + 1}] ${cleanName} (${String(move.type || 'Normal').toUpperCase()}) - Poder: ${move.power || '—'} | Precisão: ${move.accuracy || 100}% | CD: ${move.cooldown}s`;

        if (nameEl) nameEl.textContent = cleanName;
        if (ppEl) {
          ppEl.textContent = `PP ${move.pp}/${move.maxPp}`;
          ppEl.className = `bsc-pp ${move.pp <= 0 ? 'empty' : move.pp <= 5 ? 'low' : ''}`;
        }

        if (typePill) {
          const typeName = String(move.type || 'NORMAL').toUpperCase();
          typePill.innerHTML = `<span class="bsc-type-label">${typeName}</span>`;
          typePill.className = `bsc-type-pill type-pill-${typeLower}`;
        }

        if (pwrEl) {
          pwrEl.textContent = move.power && move.power > 0 ? move.power : '—';
        }

        if (accEl) {
          accEl.textContent = move.accuracy ? `${move.accuracy}` : '100';
        }

        if (move.pp <= 0) {
          cardEl.classList.add('no-pp');
        } else {
          cardEl.classList.remove('no-pp');
        }
      } else {
        cardEl.className = `battle-skill-card slot-${i} empty-slot`;
        cardEl.title = `Slot ${i + 1} Vazio`;
        if (nameEl) nameEl.textContent = '—';
        if (ppEl) ppEl.textContent = 'PP --/--';
        if (typePill) {
          typePill.innerHTML = '<span class="bsc-type-label">—</span>';
          typePill.className = 'bsc-type-pill';
        }
        if (pwrEl) pwrEl.textContent = '—';
        if (accEl) accEl.textContent = '—';
      }
    }
  }

  // Update defense button, stamina gauge & state indicator
  updateDefenseMeter(player) {
    if (!player) return;
    const defBtn = document.getElementById('bbtn-def-stance');
    const defFill = document.getElementById('def-meter-bar-fill');
    const defIcon = document.getElementById('def-ball-icon');
    const defLbl = document.getElementById('def-ball-lbl');
    const defCdOverlay = document.getElementById('def-cd-overlay');
    const defCdTimer = document.getElementById('def-cd-timer');

    if (!defBtn) return;

    const maxStamina = player.guardMeterMax || 100;
    const curStamina = Math.max(0, player.guardMeter || 0);
    const staminaRatio = Math.max(0, Math.min(1, curStamina / maxStamina));

    if (defFill) {
      defFill.style.width = `${(staminaRatio * 100).toFixed(0)}%`;
      if (player.guardExhaustedTimer > 0 || staminaRatio <= 0.25) {
        defFill.style.background = '#ef4444';
      } else if (staminaRatio <= 0.5) {
        defFill.style.background = '#f59e0b';
      } else {
        defFill.style.background = '#00e5ff';
      }
    }

    // Active guarding state
    if (player.isGuarding) {
      defBtn.classList.add('active-guard');
      if (defLbl) defLbl.textContent = 'ATIVO';
    } else {
      defBtn.classList.remove('active-guard');
      if (defLbl) defLbl.textContent = 'DEF';
    }

    // Guard broken exhaustion cooldown (LoL radial clock sweep)
    if (player.guardExhaustedTimer > 0) {
      defBtn.classList.add('guard-broken');
      defBtn.classList.add('on-cooldown');
      if (defIcon) defIcon.textContent = '💥';
      if (defLbl) defLbl.textContent = 'ROMPIDA';
      if (defCdOverlay && defCdTimer) {
        defCdOverlay.style.display = 'flex';
        const totalDuration = 4.5;
        const progress = Math.max(0, Math.min(1, player.guardExhaustedTimer / totalDuration));
        const deg = Math.round(progress * 360);
        defCdOverlay.style.background = `conic-gradient(from 0deg, rgba(239, 68, 68, 0.78) 0deg ${deg}deg, rgba(0, 0, 0, 0.25) ${deg}deg 360deg)`;
        defCdTimer.textContent = `${player.guardExhaustedTimer.toFixed(1)}s`;
      }
    } else {
      defBtn.classList.remove('guard-broken');
      defBtn.classList.remove('on-cooldown');
      if (defIcon) defIcon.textContent = '🛡️';
      if (defCdOverlay && defCdTimer) {
        defCdOverlay.style.display = 'none';
        defCdOverlay.style.background = 'none';
        defCdTimer.textContent = '';
      }
    }

    defBtn.title = `Modo Defensivo [Q] - Vigor: ${Math.round(curStamina)}/${maxStamina} (${Math.round(staminaRatio * 100)}%)`;
  }

  updateMovesCooldowns(player) {
    if (!player || !player.moves) return;

    for (let i = 0; i < player.moves.length; i++) {
      const move = player.moves[i];
      const overlay = document.getElementById(`skill-cd-overlay-${i}`) || document.getElementById(`move-cd-overlay-${i}`);
      const timerTxt = document.getElementById(`skill-cd-timer-${i}`) || document.getElementById(`move-cd-timer-${i}`);
      const btn = document.getElementById(`bbtn-skill-${i}`) || document.querySelector(`.swsh-move-btn[data-slot="${i}"]`);

      if (move && overlay && timerTxt) {
        const isDisabled = move.isDisabled || (player.disabledSkill && player.disabledSkill.id === move.id && player.disabledSkillTimer > 0);
        if (isDisabled) {
          overlay.style.display = 'flex';
          overlay.style.background = 'rgba(74, 20, 140, 0.88)';
          timerTxt.textContent = `🚫 ${Math.ceil(player.disabledSkillTimer || 0)}s`;
          if (btn) {
            btn.classList.add('disabled-by-disable');
            btn.classList.remove('on-cooldown');
          }
        } else if (typeof move.currentCooldown === 'number' && move.currentCooldown > 0) {
          const maxCd = Math.max(0.1, Number(move.cooldown) || 1);
          const ratio = Math.max(0, Math.min(1, move.currentCooldown / maxCd));
          const degrees = Math.round(ratio * 360);

          overlay.style.display = 'flex';
          overlay.style.background = `conic-gradient(from 0deg, rgba(0, 0, 0, 0.78) 0deg ${degrees}deg, rgba(0, 0, 0, 0.22) ${degrees}deg 360deg)`;

          const formattedTime = move.currentCooldown >= 3 
            ? Math.ceil(move.currentCooldown).toString() 
            : move.currentCooldown.toFixed(1);
          timerTxt.textContent = formattedTime;

          if (btn) {
            btn.classList.remove('disabled-by-disable');
            btn.classList.add('on-cooldown');
          }
        } else {
          overlay.style.display = 'none';
          overlay.style.background = 'none';
          timerTxt.textContent = '';
          if (btn) {
            btn.classList.remove('disabled-by-disable');
            btn.classList.remove('on-cooldown');
          }
        }
      }
    }
  }

  update() {
    this._hudFrame = (this._hudFrame || 0) + 1;
    // Throttle DOM tree updates to every 2 frames (~30 FPS), cutting browser layout reflow by 50%
    if (this._hudFrame % 2 !== 0) return;

    const p = this.engine.playerEntity;
    const e = this.engine.enemyEntity;

    const pDatabox = document.getElementById('battle-player-databox');
    const hints = document.querySelector('.swsh-action-hints');

    if (!p) {
      if (pDatabox) pDatabox.classList.add('hidden');
      if (hints) hints.style.display = 'none';
    } else {
      if (pDatabox) pDatabox.classList.remove('hidden');
      if (hints) hints.style.display = 'flex';

      // 1. Update Player Databox
      const pNameEl = document.getElementById('player-name');
      if (pNameEl) pNameEl.textContent = p.data.name;

      const pLevelNum = document.getElementById('player-level-num');
      if (pLevelNum) pLevelNum.textContent = p.level || 50;

      const pGenderEl = document.getElementById('player-gender');
      if (pGenderEl) {
        pGenderEl.textContent = p.data.gender === 'F' ? '♀' : '♂';
        pGenderEl.className = `gender-symbol ${p.data.gender === 'F' ? 'female' : 'male'}`;
      }

      const pHpText = document.getElementById('player-hp-text');
      if (pHpText) pHpText.textContent = `${Math.round(p.currentHp)} / ${p.maxHp}`;

      const pPercent = Math.max(0, Math.min(100, (p.currentHp / p.maxHp) * 100));
      const pHpFill = document.getElementById('player-hp-fill');
      if (pHpFill) {
        pHpFill.style.width = `${pPercent}%`;
        pHpFill.className = `hp-bar-fill ${pPercent > 50 ? 'healthy' : pPercent > 20 ? 'moderate' : 'danger'}`;
      }

      // Player Stats Pill (ATK, DEF, SPA, SPD, VEL, Nature)
      const statAtk = document.getElementById('stat-atk');
      if (statAtk) statAtk.textContent = p.data.stats.atk;
      const statDef = document.getElementById('stat-def');
      if (statDef) statDef.textContent = p.data.stats.def;
      const statSpa = document.getElementById('stat-spa');
      if (statSpa) statSpa.textContent = p.data.stats.spAtk;
      const statSpd = document.getElementById('stat-spd');
      if (statSpd) statSpd.textContent = p.data.stats.spDef;
      const statVel = document.getElementById('stat-vel');
      if (statVel) statVel.textContent = p.data.stats.speed;
      const statNature = document.getElementById('stat-nature');
      if (statNature) statNature.textContent = p.data.nature || 'Hardy';

      // Player Status Badge
      const pStatusBadge = document.getElementById('player-status-badge');
      if (pStatusBadge) {
        if (p.isFainted) {
          pStatusBadge.textContent = 'FNT';
          pStatusBadge.className = 'databox-status-badge status-fnt';
        } else if (p.isDizzy) {
          pStatusBadge.textContent = 'TONTO';
          pStatusBadge.className = 'databox-status-badge status-par';
        } else if (p.statusEffect) {
          const s = p.statusEffect.type;
          pStatusBadge.textContent = s.toUpperCase().slice(0, 3);
          pStatusBadge.className = `databox-status-badge status-${s}`;
        } else {
          pStatusBadge.className = 'databox-status-badge hidden';
        }
      }

      // Player Avatar GIF in round circle
      const pAvatarImg = document.getElementById('player-avatar-img');
      if (pAvatarImg && p.data) {
        const id = String(p.data.id || p.data.speciesId || 1).padStart(3, '0');
        const gifSrc = `/assets/pokemon/animated/front/normal/${id}.gif`;
        if (pAvatarImg.src !== gifSrc && !pAvatarImg.src.endsWith(gifSrc)) {
          pAvatarImg.src = gifSrc;
          pAvatarImg.style.display = 'block';
        }
      }

      // Basic Attack Cooldown Overlay
      const atkCdOverlay = document.getElementById('atk-cd-overlay');
      const atkCdTimer = document.getElementById('atk-cd-timer');
      const atkBtn = document.getElementById('bbtn-basic-atk');
      if (atkCdOverlay && atkCdTimer) {
        if (p.physicalCooldown > 0) {
          atkCdOverlay.style.display = 'flex';
          const maxCd = p.physicalAttack?.cooldown || 0.8;
          const progress = Math.max(0, Math.min(1, p.physicalCooldown / maxCd));
          const deg = Math.round(progress * 360);
          atkCdOverlay.style.background = `conic-gradient(from 0deg, rgba(0, 0, 0, 0.78) 0deg ${deg}deg, rgba(0, 0, 0, 0.22) ${deg}deg 360deg)`;
          atkCdTimer.textContent = p.physicalCooldown.toFixed(1);
          atkBtn?.classList.add('on-cooldown');
        } else {
          atkCdOverlay.style.display = 'none';
          atkCdTimer.textContent = '';
          atkBtn?.classList.remove('on-cooldown');
        }
      }

      // 3. Render / Update Moves & Defense Meter
      this.renderMovesCluster(p);
      this.updateMovesCooldowns(p);
      this.updateDefenseMeter(p);
      if (this.currentSubMenu === 'fight') {
        this.renderMovesBoard(p);
      }
    }

    // 2. Update Opponent Databox
    if (e) {
      const eNameEl = document.getElementById('enemy-name');
      if (eNameEl) eNameEl.textContent = e.data.name;

      // Enemy Avatar GIF in round circle
      const eAvatarImg = document.getElementById('enemy-avatar-img');
      if (eAvatarImg && e.data) {
        const id = String(e.data.id || e.data.speciesId || 1).padStart(3, '0');
        const gifSrc = `/assets/pokemon/animated/front/normal/${id}.gif`;
        if (eAvatarImg.src !== gifSrc && !eAvatarImg.src.endsWith(gifSrc)) {
          eAvatarImg.src = gifSrc;
          eAvatarImg.style.display = 'block';
        }
      }

      const eLevelNum = document.getElementById('enemy-level-num');
      if (eLevelNum) eLevelNum.textContent = e.level || 50;

      const eGenderEl = document.getElementById('enemy-gender');
      if (eGenderEl) {
        eGenderEl.textContent = e.data.gender === 'F' ? '♀' : '♂';
        eGenderEl.className = `gender-symbol ${e.data.gender === 'F' ? 'female' : 'male'}`;
      }

      const ePercent = Math.max(0, Math.min(100, (e.currentHp / e.maxHp) * 100));
      const eHpFill = document.getElementById('enemy-hp-fill');
      if (eHpFill) {
        eHpFill.style.width = `${ePercent}%`;
        eHpFill.className = `hp-bar-fill ${ePercent > 50 ? 'healthy' : ePercent > 20 ? 'moderate' : 'danger'}`;
      }

      // Enemy Status Badge
      const eStatusBadge = document.getElementById('enemy-status-badge');
      if (eStatusBadge) {
        if (e.isFainted) {
          eStatusBadge.textContent = 'FNT';
          eStatusBadge.className = 'databox-status-badge status-fnt';
        } else if (e.isDizzy) {
          eStatusBadge.textContent = 'TONTO';
          eStatusBadge.className = 'databox-status-badge status-par';
        } else if (e.statusEffect) {
          const s = e.statusEffect.type;
          eStatusBadge.textContent = s.toUpperCase().slice(0, 3);
          eStatusBadge.className = `databox-status-badge status-${s}`;
        } else {
          eStatusBadge.className = 'databox-status-badge hidden';
        }
      }
    }

    // 4. Render Party line indicators
    this.renderPartyDots();

    // 5. Update right-center 5 quick slots
    this.updateQuickItemsView();
  }

  startPreBattleCountdown(seconds = 5, onComplete = () => {}) {
    this.isCountdownActive = true;
    if (this.engine) this.engine.isCountdownActive = true;

    const overlay = document.getElementById('battle-countdown-overlay');
    const numEl = document.getElementById('battle-countdown-num');
    const subEl = overlay?.querySelector('.battle-countdown-sub');

    if (!overlay || !numEl) {
      this.isCountdownActive = false;
      if (this.engine) this.engine.isCountdownActive = false;
      onComplete();
      return;
    }

    if (subEl) subEl.textContent = 'BATALHA COMEÇA EM';
    numEl.className = 'battle-countdown-num';
    numEl.textContent = seconds;
    overlay.classList.remove('hidden');

    let currentSec = seconds;

    if (this._countdownTimer) {
      clearInterval(this._countdownTimer);
    }

    this._countdownTimer = setInterval(() => {
      currentSec--;
      if (currentSec > 0) {
        numEl.textContent = currentSec;
        soundManager.playShoot?.();
      } else {
        clearInterval(this._countdownTimer);
        this._countdownTimer = null;

        if (subEl) subEl.textContent = 'VAI!';
        numEl.textContent = '⚔️ LUTE!';
        numEl.classList.add('fight-ready');
        soundManager.playPhysicalStrike?.();

        setTimeout(() => {
          overlay.classList.add('hidden');
          this.isCountdownActive = false;
          if (this.engine) this.engine.isCountdownActive = false;
          onComplete();
        }, 650);
      }
    }, 1000);
  }

  destroy() {
    if (this._countdownTimer) {
      clearInterval(this._countdownTimer);
      this._countdownTimer = null;
    }
    if (this.hudRafId) {
      cancelAnimationFrame(this.hudRafId);
      this.hudRafId = null;
    }
    if (this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
    if (typeof window !== 'undefined' && window._activeBattleHud === this) {
      window._activeBattleHud = null;
    }
  }
}
