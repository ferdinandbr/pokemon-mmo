import SocketClient from '../network/SocketClient';
import { getPokemonAnimatedSprite, getPokemonOverworldSprite, formatSpeciesId } from '../utils/pokemonAssets';
import bgmManager from '../audio/BGMManager';
import sfxManager from '../audio/SFXManager';

// Dialog lines that append BELOW the attack line ("X usou Y!\nÉ super efetivo!")
const APPEND_BELOW_DIALOG = new Set([
  'É super efetivo!',
  'Não foi muito efetivo...',
  'Um acerto crítico!',
  'Mas errou o alvo!',
  'Não teve efeito...'
]);

// Only the newest BattleUI instance processes socket events.
// (SocketClient.on accumulates callbacks, so a rebuilt instance — HMR/re-login —
// would otherwise run a second sequencer concurrently: flickering/empty dialog,
// double VFX/sounds and duplicated XP messages. window-level so it survives
// module re-evaluation, where a module-scoped guard would fork.)
function _claimBattleInstance(inst) {
  window._battleUISeq = (window._battleUISeq || 0) + 1;
  inst._seq = window._battleUISeq;
  window._activeBattleSeq = inst._seq;
}

function _isActiveBattleInstance(inst) {
  return Boolean(inst && inst._seq != null && window._activeBattleSeq === inst._seq);
}

export default class BattleUI {
  constructor(worldScene) {
    this.worldScene = worldScene;
    this.isOpen = false;
    this.isProcessingTurn = false;
    this.battleState = null;
    this.currentSubMenu = 'main'; // 'main', 'fight', 'bag', 'team'

    this.container = null;
    this.dialogueTimer = null;
    this.currentText = '';

    // Capture state
    this.isBallInPlay = false;
    this.currentBallSprites = null;

    // Submenu state
    this.currentBagTab = 'balls';
    this.selectedBagItem = null;
    this.isForceSwitch = false;

    // Battle-end XP tracking (shared gains map + stashed active-mon gain)
    this._battleXpGains = new Map();
    this._pendingAttackerExp = null;
    this._pendingPlayerRewards = null;
    this._chatNotifiedXp = new Set();

    this.initDOM();
    this.bindEvents();
    _claimBattleInstance(this);
    this.listenNetwork();
  }

  initDOM() {
    let el = document.getElementById('battle-ui-container');
    if (el) el.remove();

    el = document.createElement('div');
    el.id = 'battle-ui-container';
    el.className = 'battle-ui-container hidden';
    el.innerHTML = `
      <div class="battle-screen" id="battle-screen">
        <!-- Battle Arena Stage -->
        <div class="battle-arena" id="battle-arena">
          <!-- Background Image -->
          <div class="battle-bg" id="battle-bg"></div>

          <!-- Opponent Databox (Top Right - Custom Pixel HUD) -->
          <div class="swsh-databox swsh-enemy-hud hud pixel" id="battle-enemy-databox">
            <div class="name-row">
              <div class="name-group">
                <span class="name" id="enemy-name">Milcery</span>
                <span class="databox-status-badge hidden" id="enemy-status-badge"></span>
                <div class="swsh-caught-ball enemy-caught-ball hidden" id="enemy-caught-icon" title="Capturado"></div>
              </div>
              <div class="level">
                <span class="gender-symbol female" id="enemy-gender">♀</span>
                <div class="level-pill" id="enemy-level">
                  <span class="lv">Lv.</span><span class="lv-num">24</span>
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

            <!-- Party Indicators (Bottom Right Tray) -->
            <div class="swsh-party-dots enemy-dots" id="enemy-party-dots"></div>
          </div>

          <!-- Enemy Base & Pokemon Platform (Center-Right) -->
          <div class="battle-enemy-zone">
            <div class="battle-enemy-platform">
              <img src="/assets/battle/enemybaseFieldGrass.png" class="battle-platform-img enemy-plat" alt="Platform">
              <div class="battle-sprite-wrap enemy-sprite-wrap" id="enemy-sprite-wrap">
                <div class="battle-pokemon-shadow enemy-shadow" id="enemy-pokemon-shadow"></div>
                <img id="enemy-sprite" class="battle-sprite enemy-sprite" src="" alt="Enemy Sprite">
              </div>

              <!-- Capture Pokéball Container -->
              <div class="battle-capture-ball hidden" id="battle-capture-ball">
                <div class="capture-ball-graphic" id="capture-ball-graphic"></div>
                <div class="capture-ball-flash" id="capture-ball-flash"></div>
                <div class="capture-ball-stars hidden" id="capture-ball-stars">
                  <span class="c-star s1">✦</span>
                  <span class="c-star s2">★</span>
                  <span class="c-star s3">✦</span>
                  <span class="c-star s4">★</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Player Base, Trainer & Pokemon Platform (Foreground Bottom Left) -->
          <div class="battle-player-zone">
            <div class="battle-player-platform" id="battle-player-platform">
              <img src="/assets/battle/playerbaseFieldGrass.png" class="battle-platform-img player-plat" alt="Platform">

              <!-- Heroic Trainer Sprite for Intro Throw Animation -->
              <div class="battle-trainer-wrap" id="battle-trainer-wrap">
                <div class="battle-trainer-shadow" id="battle-trainer-shadow"></div>
                <div class="battle-trainer-sprite" id="battle-trainer-sprite"></div>
              </div>

              <!-- Tossed Pokéball during Intro -->
              <div class="battle-intro-ball hidden" id="battle-intro-ball">
                <div class="intro-ball-graphic" id="intro-ball-graphic"></div>
                <div class="intro-ball-flash" id="intro-ball-flash"></div>
              </div>

              <!-- Player Pokemon (emerges after throw) -->
              <div class="battle-sprite-wrap player-sprite-wrap" id="player-sprite-wrap">
                <div class="battle-pokemon-shadow player-shadow" id="player-pokemon-shadow"></div>
                <img id="player-sprite" class="battle-sprite player-sprite" src="" alt="Player Sprite">
              </div>
            </div>
          </div>

          <!-- Player Databox (Bottom Left - Custom Pixel HUD) -->
          <div class="swsh-databox swsh-player-hud hud pixel" id="battle-player-databox">
            <div class="name-row">
              <div class="name-group">
                <span class="name" id="player-name">Rillaboom</span>
                <span class="databox-status-badge hidden" id="player-status-badge"></span>
              </div>
              <div class="level">
                <span class="gender-symbol male" id="player-gender">♂</span>
                <div class="level-pill" id="player-level">
                  <span class="lv">Lv.</span><span class="lv-num">51</span>
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
                <span class="exp-label">EXP</span>
                <span class="exp-numbers" id="player-hp-text">168/168</span>
              </div>
            </div>

            <div class="exp-strip" id="player-exp-strip">
              <div class="filled" id="player-exp-fill" style="width: 55%;"></div>
              <div class="unfilled" id="player-exp-unfill" style="width: 45%;"></div>
            </div>

            <!-- Party Indicators (Bottom Left Tray) -->
            <div class="swsh-party-dots player-dots" id="player-party-dots"></div>
          </div>

          <!-- Attack VFX Layer Canvas -->
          <canvas id="battle-fx-canvas" class="battle-fx-canvas"></canvas>

          <!-- In-Battle Quick Item Bar (Top-Left HUD) -->
          <div class="battle-quick-bar" id="battle-quick-bar" title="Atalhos Rápidos [1-5]"></div>
        </div>

        <!-- Unified Bottom Command Bar (single Placa: dialogue + actions inside) -->
        <div class="swsh-command-bar" id="battle-command-bar">
          <!-- Dialogue & Information (Left) -->
          <div class="swsh-dialogue-area" id="battle-dialogue-box">
            <div class="swsh-dialogue-content" id="battle-dialogue-content">
              <div class="swsh-dialogue-text" id="battle-dialogue-text">O que o Pikachu vai fazer?</div>
              <div class="swsh-dialogue-arrow hidden" id="battle-dialogue-arrow">▼</div>
            </div>
          </div>

          <!-- Action Command Menu (Right, inside the bar - Fire Red Placa Style) -->
          <div class="swsh-action-container" id="battle-action-panel">
            <!-- 1. Main Action Grid: Fight, Bag, Pokemon, Run (2x2) -->
            <div class="swsh-main-menu" id="battle-main-menu">
              <button class="swsh-action-btn btn-fight active" id="bbtn-fight" title="Lutar">
                <span class="swsh-btn-arrow">▶</span>
                <div class="swsh-btn-icon-wrap icon-fight">
                  <img src="/assets/battle/icon_btn_fight.png" class="swsh-pixel-icon" alt="Fight" />
                </div>
                <span class="swsh-btn-lbl">FIGHT</span>
              </button>
              <button class="swsh-action-btn btn-bag" id="bbtn-bag" title="Mochila">
                <span class="swsh-btn-arrow">▶</span>
                <div class="swsh-btn-icon-wrap icon-bag">
                  <img src="/assets/battle/icon_btn_bag.png" class="swsh-pixel-icon" alt="Bag" />
                </div>
                <span class="swsh-btn-lbl">BAG</span>
              </button>
              <button class="swsh-action-btn btn-pokemon" id="bbtn-pokemon" title="Pokémon">
                <span class="swsh-btn-arrow">▶</span>
                <div class="swsh-btn-icon-wrap icon-pokemon">
                  <img src="/assets/battle/icon_btn_pokemon.png" class="swsh-pixel-icon" alt="Pokémon" />
                </div>
                <span class="swsh-btn-lbl">POKÉMON</span>
              </button>
              <button class="swsh-action-btn btn-run" id="bbtn-run" title="Fugir">
                <span class="swsh-btn-arrow">▶</span>
                <div class="swsh-btn-icon-wrap icon-run">
                  <img src="/assets/battle/icon_btn_run.png" class="swsh-pixel-icon" alt="Run" />
                </div>
                <span class="swsh-btn-lbl">RUN</span>
              </button>
            </div>

            <!-- 2. Fight Move Selection Submenu (expanded inside the bar) -->
            <div class="swsh-moves-panel hidden" id="battle-move-detail-panel">
              <div class="swsh-moves-board" id="battle-moves-board"></div>
              <div class="swsh-move-side">
                <div class="swsh-move-meta-row">
                  <div class="swsh-move-meta-box">
                    <span class="smm-label">TYPE</span>
                    <span class="type-chip bmd-type" id="bmd-type">NORMAL</span>
                  </div>
                  <div class="swsh-move-meta-box">
                    <span class="smm-label">PP</span>
                    <span class="bmd-pp" id="bmd-pp">--/--</span>
                  </div>
                </div>
                <button class="swsh-back-btn" id="bbtn-moves-back">◀ VOLTAR</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Bag Action Modal (Matching Overworld Bag Modal - Image 1) -->
        <div class="battle-modal-panel battle-bag-modal hidden" id="battle-bag-action-panel">
          <div class="battle-modal-shelf"></div>
          <div class="battle-modal-header">
            <div class="battle-modal-title">
              <img src="/assets/ui/bag_sprite.png" class="bbm-title-sprite" alt="Bag" />
              <span>MOCHILA DO TREINADOR</span>
              <div class="bbm-capacity-badge">
                <span id="battle-bag-capacity-text">0 / 24 Slots</span>
              </div>
            </div>
            <button class="battle-modal-close" id="bbtn-bag-close" title="Fechar (ESC)">✕</button>
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

        <!-- 4. Team Switch Modal (Matching PC Box / Character Modal - Image 2) -->
        <div class="battle-modal-panel battle-team-modal hidden" id="battle-team-action-panel">
          <div class="battle-modal-shelf"></div>
          <div class="battle-modal-header">
            <div class="battle-modal-title">
              <span class="btm-title-icon">⚡</span>
              <span>EQUIPE POKÉMON</span>
              <div class="btm-badge-count" id="battle-team-count-badge">1/6</div>
            </div>
            <div class="btm-subtitle btap-info">Trocar Pokémon em batalha</div>
            <button class="battle-modal-close" id="bbtn-team-close" title="Fechar (ESC)">✕</button>
          </div>

          <div class="battle-team-board" id="battle-team-board">
            <div class="battle-team-cells-grid" id="battle-team-grid"></div>
            <div class="battle-team-footer">
              <button class="swsh-back-btn" id="bbtn-team-back">◀ VOLTAR</button>
            </div>
          </div>
        </div>

        <!-- Modal Backdrop for Centered Battle Modals -->
        <div class="battle-modal-backdrop hidden" id="battle-modal-backdrop"></div>
      </div>
    `;

    // Attach to game-wrapper so battle renders inside the 16:9 playable viewport
    const targetParent = document.getElementById('game-wrapper') || document.body;
    targetParent.appendChild(el);
    this.container = el;

    // Element references
    this.enemyDataboxEl = el.querySelector('#battle-enemy-databox');
    this.enemyNameEl = el.querySelector('#enemy-name');
    this.enemyGenderEl = el.querySelector('#enemy-gender');
    this.enemyLevelEl = el.querySelector('#enemy-level');
    this.enemyHpFill = el.querySelector('#enemy-hp-fill');
    this.enemySpriteWrapEl = el.querySelector('#enemy-sprite-wrap');
    this.enemySprite = el.querySelector('#enemy-sprite');
    this.enemyShadowEl = el.querySelector('#enemy-pokemon-shadow');
    this.enemyCaughtIconEl = el.querySelector('#enemy-caught-icon');
    this.enemyPartyDotsEl = el.querySelector('#enemy-party-dots');
    this.enemyStatusBadgeEl = el.querySelector('#enemy-status-badge');

    this.playerDataboxEl = el.querySelector('#battle-player-databox');
    this.playerNameEl = el.querySelector('#player-name');
    this.playerGenderEl = el.querySelector('#player-gender');
    this.playerLevelEl = el.querySelector('#player-level');
    this.playerHpFill = el.querySelector('#player-hp-fill');
    this.playerHpText = el.querySelector('#player-hp-text');
    this.playerExpFill = el.querySelector('#player-exp-fill');
    this.playerExpUnfill = el.querySelector('#player-exp-unfill');
    this.playerSpriteWrapEl = el.querySelector('#player-sprite-wrap');
    this.playerSprite = el.querySelector('#player-sprite');
    this.playerShadowEl = el.querySelector('#player-pokemon-shadow');
    this.playerPartyDotsEl = el.querySelector('#player-party-dots');
    this.playerStatusBadgeEl = el.querySelector('#player-status-badge');

    this.trainerWrapEl = el.querySelector('#battle-trainer-wrap');
    this.trainerSpriteEl = el.querySelector('#battle-trainer-sprite');
    this.introBallEl = el.querySelector('#battle-intro-ball');
    this.introBallGraphic = el.querySelector('#intro-ball-graphic');
    this.introBallFlash = el.querySelector('#intro-ball-flash');

    // Capture Ball elements
    this.captureBallEl = el.querySelector('#battle-capture-ball');
    this.captureBallGraphic = el.querySelector('#capture-ball-graphic');
    this.captureBallFlash = el.querySelector('#capture-ball-flash');
    this.captureBallStars = el.querySelector('#capture-ball-stars');

    // Arena canvas & quick bar
    this.fxCanvasEl = el.querySelector('#battle-fx-canvas');
    this.quickBarEl = el.querySelector('#battle-quick-bar');

    this.bottomPanelEl = el.querySelector('#battle-command-bar');
    this.commandBarEl = el.querySelector('#battle-command-bar');
    this.dialogueBoxEl = el.querySelector('#battle-dialogue-box');
    this.dialogueContentEl = el.querySelector('#battle-dialogue-content');
    this.dialogueTextEl = el.querySelector('#battle-dialogue-text');
    this.dialogueArrowEl = el.querySelector('#battle-dialogue-arrow');

    // Fast skip typewriter on dialogue box click
    if (this.dialogueBoxEl) {
      this.dialogueBoxEl.addEventListener('click', () => {
        if (this.dialogueTimer && this.currentText) {
          clearInterval(this.dialogueTimer);
          this.dialogueTimer = null;
          this.dialogueTextEl.textContent = this.currentText;
        }
      });
    }

    this.movesBoardEl = el.querySelector('#battle-moves-board');

    this.actionPanelEl = el.querySelector('#battle-action-panel');
    this.mainMenuEl = el.querySelector('#battle-main-menu');
    this.moveDetailPanelEl = el.querySelector('#battle-move-detail-panel');
    this.bmdTypeEl = el.querySelector('#bmd-type');
    this.bmdPpEl = el.querySelector('#bmd-pp');

    // Bag elements
    this.bagBoardEl = el.querySelector('#battle-bag-board');
    this.bagItemsScrollEl = el.querySelector('#battle-bag-items-scroll');
    this.bagItemDescEl = el.querySelector('#battle-bag-item-desc');
    this.bagActionPanelEl = el.querySelector('#battle-bag-action-panel');
    this.bbapIconWrap = el.querySelector('#bbap-icon-wrap');
    this.bbapName = el.querySelector('#bbap-name');
    this.bbapQty = el.querySelector('#bbap-qty');
    this.bbapCat = el.querySelector('#bbap-cat');
    this.btnItemUse = el.querySelector('#bbtn-item-use');
    this.bagCapacityBadge = el.querySelector('#battle-bag-capacity-text');

    // Team elements
    this.teamBoardEl = el.querySelector('#battle-team-board');
    this.teamGridEl = el.querySelector('#battle-team-grid');
    this.teamActionPanelEl = el.querySelector('#battle-team-action-panel');
    this.teamCountBadge = el.querySelector('#battle-team-count-badge');

    this.btnFight = el.querySelector('#bbtn-fight');
    this.btnBag = el.querySelector('#bbtn-bag');
    this.btnPokemon = el.querySelector('#bbtn-pokemon');
    this.btnRun = el.querySelector('#bbtn-run');
    this.btnMovesBack = el.querySelector('#bbtn-moves-back');
    this.btnBagBack = el.querySelector('#bbtn-bag-back');
    this.btnBagClose = el.querySelector('#bbtn-bag-close');
    this.btnTeamBack = el.querySelector('#bbtn-team-back');
    this.btnTeamClose = el.querySelector('#bbtn-team-close');
    this.modalBackdropEl = el.querySelector('#battle-modal-backdrop');
  }

  bindEvents() {
    // Buttons with Sound Effects
    const attachBtnSound = (btn, action) => {
      if (!btn) return;
      btn.addEventListener('mouseenter', () => sfxManager.playCursor());
      btn.addEventListener('click', () => {
        sfxManager.playDecision();
        action();
      });
    };

    const attachBackSound = (btn, action) => {
      if (!btn) return;
      btn.addEventListener('mouseenter', () => sfxManager.playCursor());
      btn.addEventListener('click', () => {
        sfxManager.playCancel();
        action();
      });
    };

    // Action Menu: Keep active indicator synced on hover
    const actionBtns = [this.btnFight, this.btnBag, this.btnPokemon, this.btnRun];
    actionBtns.forEach((btn) => {
      if (!btn) return;
      btn.addEventListener('mouseenter', () => {
        actionBtns.forEach((b) => b?.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    attachBtnSound(this.btnFight, () => {
      if (this.isForceSwitch) return;
      this.switchSubMenu('fight');
    });
    attachBtnSound(this.btnBag, () => {
      if (this.isForceSwitch) return;
      this.switchSubMenu('bag');
    });
    attachBtnSound(this.btnPokemon, () => this.switchSubMenu('team'));
    attachBtnSound(this.btnRun, () => {
      if (this.isForceSwitch) return;
      this.handleRun();
    });

    attachBackSound(this.btnMovesBack, () => {
      if (this.isForceSwitch) return;
      this.switchSubMenu('main');
    });
    attachBackSound(this.btnBagBack, () => {
      if (this.isForceSwitch) return;
      this.switchSubMenu('main');
    });
    attachBackSound(this.btnBagClose, () => {
      if (this.isForceSwitch) return;
      this.switchSubMenu('main');
    });
    attachBackSound(this.btnTeamBack, () => {
      if (this.isForceSwitch) return;
      this.switchSubMenu('main');
    });
    attachBackSound(this.btnTeamClose, () => {
      if (this.isForceSwitch) return;
      this.switchSubMenu('main');
    });

    if (this.modalBackdropEl) {
      this.modalBackdropEl.addEventListener('click', () => {
        if (this.isForceSwitch) return;
        sfxManager.playCancel();
        this.switchSubMenu('main');
      });
    }

    attachBtnSound(this.btnItemUse, () => {
      if (this.selectedBagItem) {
        this.handleItemSelect(this.selectedBagItem.item.id);
      }
    });

    // Handle Bag Tabs dynamically (All, Balls, Medicine, Battle)
    const bagTabs = this.container.querySelectorAll('.swsh-bag-tab');
    bagTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        sfxManager.playCursor();
        bagTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentBagTab = tab.dataset.tab || 'all';
        this.renderBagBoard();
      });
    });

    // Keyboard support: 1-5 for Quick Items in battle
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen || this.isProcessingTurn) return;

      const tag = document.activeElement?.tagName;
      if (['INPUT', 'TEXTAREA'].includes(tag)) return;

      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        if (this.isForceSwitch) return;
        e.preventDefault();
        const slotNumber = parseInt(e.key);
        this.handleQuickItemSlot(slotNumber);
        return;
      }

      if (e.key === 'Escape' || e.key === 'x' || e.key === 'X') {
        if (this.isForceSwitch) return;
        if (this.currentSubMenu !== 'main') {
          e.preventDefault();
          sfxManager.playCancel();
          this.switchSubMenu('main');
        }
      }
    });

    // Intercept clicks on the HUD Quick Bar while in battle
    document.querySelector('.hud-quick-bar')?.addEventListener('click', (e) => {
      if (!this.isOpen || this.isProcessingTurn || this.isForceSwitch) return;
      const slotEl = e.target.closest('.quick-slot');
      if (slotEl && slotEl.dataset.slot !== undefined) {
        e.preventDefault();
        e.stopPropagation();
        const slotNumber = parseInt(slotEl.dataset.slot);
        this.handleQuickItemSlot(slotNumber);
      }
    }, true);
  }

  listenNetwork() {
    // Battle started by server
    SocketClient.on('battle:started', (data) => {
      if (!_isActiveBattleInstance(this)) return;
      console.log('[BattleUI] battle:started recebido:', data);
      if (data && data.success) {
        this.open(data);
      }
    });

    // Battle start failed by server
    SocketClient.on('battle:start_failed', (data) => {
      if (!_isActiveBattleInstance(this)) return;
      console.warn('[BattleUI] battle:start_failed:', data);
      this.close();
      if (this.worldScene?.dialogueBox) {
        this.worldScene.dialogueBox.show('BATALHA', data?.message || 'Falha ao iniciar batalha.');
      }
    });

    // Turn result with event sequence
    SocketClient.on('battle:turn_result', (result) => {
      if (!_isActiveBattleInstance(this)) return;
      if (result && result.success) {
        this.processTurnEvents(result.events, result);
      }
    });

    // Error in battle action
    SocketClient.on('battle:action_error', (data) => {
      if (!_isActiveBattleInstance(this)) return;
      this.setProcessingTurn(false);
      this.typeText(data.message || 'Erro ao executar ação.');
    });

    // Refresh battle quick bar when inventory updates
    SocketClient.on('inventory:update', () => {
      if (!_isActiveBattleInstance(this)) return;
      if (this.isOpen) {
        this.renderBattleQuickBar();
      }
    });
  }

  async open(battleData) {
    console.log('[BattleUI] open() acionado com dados:', battleData);
    this.isOpen = true;
    this.setProcessingTurn(true);
    this.isForceSwitch = false;
    this.battleState = battleData;
    this.currentSubMenu = 'main';

    // Ensure attached to game-wrapper so it scales with the playable game screen
    const gw = document.getElementById('game-wrapper');
    if (gw && this.container && this.container.parentElement !== gw) {
      gw.appendChild(this.container);
    }

    // Hide ALL overworld HUDs while in battle
    document.getElementById('hud-quick-bar')?.classList.add('hidden');
    document.getElementById('hud')?.classList.add('hidden');
    document.getElementById('overworld-party-hud')?.classList.add('hidden');

    this.container.classList.remove('hidden');

    // Safe BGM Play (wild battle theme)
    try {
      if (bgmManager.play) {
        bgmManager.play('battle_wild');
      } else if (bgmManager.playForRoom) {
        bgmManager.playForRoom('battle_wild');
      }
    } catch (e) {
      console.warn('[BattleUI] BGM play failed:', e);
    }

    // Populate data safely
    try {
      this.renderBattleState();
    } catch (e) {
      console.error('[BattleUI] Erro ao renderizar estado da batalha:', e);
    }

    // Run authentic intro animation: Wild entry -> Trainer throw -> Ball open -> Pokémon burst -> Databoxes slide
    try {
      await this.playBattleIntro(battleData);
    } catch (e) {
      console.error('[BattleUI] Erro na animação de intro:', e);
      this.setProcessingTurn(false);
      this.switchSubMenu('main');
    }
  }

  close() {
    this.isOpen = false;
    this.setProcessingTurn(false);
    this.isForceSwitch = false;
    this.isBallInPlay = false;
    this.battleState = null;
    this.commandBarEl?.classList.remove('mode-fight');
    // Lock wild encounters on this tile so we don't chain-battle on exit
    try { this.worldScene?.notifyBattleExited?.(); } catch (e) { }
    // Overworld-only cinematics queued during battle (evolutions, move learns)
    try { window._evolutionUI?.flushQueue?.(); } catch (e) {}
    try { window._moveLearnUI?.flushQueue?.(); } catch (e) {}
    this.container.classList.add('hidden');
    this.modalBackdropEl?.classList.add('hidden');

    if (this.captureBallEl) {
      this.captureBallEl.className = 'battle-capture-ball hidden';
      if (this.captureBallStars) this.captureBallStars.classList.add('hidden');
    }
    if (this.enemySprite) {
      this.enemySprite.className = 'battle-sprite enemy-sprite';
      this.enemySprite.style.transform = '';
      this.enemySprite.style.filter = '';
      this.enemySprite.style.opacity = '1';
    }

    // Restore ALL overworld HUDs
    document.getElementById('hud-quick-bar')?.classList.remove('hidden');
    document.getElementById('hud')?.classList.remove('hidden');
    document.getElementById('overworld-party-hud')?.classList.remove('hidden');

    // Restore room music safely
    try {
      if (this.worldScene?.currentRoom?.id) {
        bgmManager.playForRoom(this.worldScene.currentRoom.id);
      }
    } catch (e) { }

    // Ensure follower reflects post-battle health state (hidden if fainted, shown if alive)
    try {
      this.worldScene?.checkLocalBuddyState?.();
    } catch (e) { }
  }

  // ─── TRAINER & INTRO ANIMATIONS ─────────────────────────────────────────────

  getTrainerBackSprite() {
    const charData = this.worldScene?.currentCharacterData;
    const localP = this.worldScene?.localPlayer;
    const gender = String(charData?.gender || localP?.gender || 'male').toLowerCase();
    const isFemale = gender === 'female' || gender === 'f' || gender === 'girl';
    return isFemale ? '/assets/characters/trback001.png' : '/assets/characters/trback000.png';
  }

  setTrainerFrame(frameIndex) {
    if (!this.trainerSpriteEl) return;
    const clamped = Math.max(0, Math.min(4, frameIndex));
    // 5 frames across the 640px sheet => 0%, 25%, 50%, 75%, 100%
    this.trainerSpriteEl.style.backgroundPosition = `${clamped * 25}% 0%`;
  }

  async playBattleIntro(battleData) {
    const wild = battleData.wildPokemon || {};
    const player = battleData.playerPokemon || {};

    const wildName = wild.name || wild.species?.name || 'POKÉMON';
    const playerName = player.name || player.nickname || player.species?.name || 'POKÉMON';

    // 1. Reset visual elements for the cinematic intro
    this.isBallInPlay = false;
    this._battleXpGains = new Map();
    this._pendingAttackerExp = null;
    this._pendingPlayerRewards = null;
    this._chatNotifiedXp = new Set();
    if (this.captureBallEl) {
      this.captureBallEl.className = 'battle-capture-ball hidden';
      if (this.captureBallStars) this.captureBallStars.classList.add('hidden');
    }
    if (this.enemySprite) {
      this.enemySprite.className = 'battle-sprite enemy-sprite';
      this.enemySprite.style.transform = '';
      this.enemySprite.style.filter = '';
      this.enemySprite.style.opacity = '1';
    }
    // Drop stale silhouette from a previous battle (ellipse fallback shows meanwhile)
    if (this.enemyShadowEl) this.enemyShadowEl.style.backgroundImage = 'none';
    if (this.playerShadowEl) this.playerShadowEl.style.backgroundImage = 'none';
    this.enemyDataboxEl?.classList.add('databox-hidden-right');
    this.playerDataboxEl?.classList.add('databox-hidden-left');
    this.dialogueBoxEl?.classList.add('full-width-dialogue');
    this.actionPanelEl?.classList.add('hidden');
    this.mainMenuEl?.classList.add('hidden');

    // Setup Trainer on platform
    if (this.trainerWrapEl && this.trainerSpriteEl) {
      this.trainerWrapEl.style.display = 'block';
      this.trainerWrapEl.className = 'battle-trainer-wrap trainer-enter-left';
      this.trainerSpriteEl.style.backgroundImage = `url("${this.getTrainerBackSprite()}")`;
      this.setTrainerFrame(0);
    }

    // Hide player pokemon initially
    if (this.playerSpriteWrapEl) {
      this.playerSpriteWrapEl.style.display = 'none';
    }

    // Hide intro ball
    if (this.introBallEl) {
      this.introBallEl.className = 'battle-intro-ball hidden';
    }

    // Wild Pokemon slides in from right
    if (this.enemySpriteWrapEl) {
      this.enemySpriteWrapEl.className = 'battle-sprite-wrap enemy-sprite-wrap foe-slide-in';
    }

    // Play Wild Pokémon cry
    const wildSpeciesId = wild.speciesId || wild.species?.id || 16;
    sfxManager.playCry(wildSpeciesId);

    // Initial message
    await this.typeTextAsync(`Um ${String(wildName).toUpperCase()} selvagem apareceu!`);
    await this.wait(1000);

    // 2. Trainer throw speech & animation
    await this.typeTextAsync(`Vai, ${String(playerName).toUpperCase()}!`);
    await this.wait(200);

    // Frame 0 -> 1: Ready / Wind up
    this.setTrainerFrame(1);
    await this.wait(120);

    // Frame 2: Arm pulled back
    this.setTrainerFrame(2);
    await this.wait(120);

    // Frame 3: Throw forward!
    this.setTrainerFrame(3);
    sfxManager.playThrow();

    // Set correct Pokeball sprite for intro
    const introBallName = player.caughtBall || player.ball || 'pokeball';
    const introBallIdx = this.getBallIndex(introBallName);
    const introClosedBallSrc = `/assets/battle/ball_${introBallIdx}.png`;
    const introOpenBallSrc = `/assets/battle/ball_${introBallIdx}_open.png`;

    if (this.introBallGraphic) {
      this.introBallGraphic.className = 'intro-ball-graphic';
      this.introBallGraphic.style.backgroundImage = `url("${introClosedBallSrc}")`;
    }

    // Pokeball toss arc towards player platform center
    if (this.introBallEl) {
      this.introBallEl.className = 'battle-intro-ball ball-toss-arc';
    }

    // Trainer begins sliding out to the left
    if (this.trainerWrapEl) {
      this.trainerWrapEl.className = 'battle-trainer-wrap trainer-exit-left';
    }
    await this.wait(120);

    // Frame 4: Follow-through
    this.setTrainerFrame(4);
    await this.wait(350);

    // 3. Pokeball lands and opens with burst of light
    sfxManager.playBallOpen();
    if (this.introBallGraphic) {
      this.introBallGraphic.style.backgroundImage = `url("${introOpenBallSrc}")`;
      this.introBallGraphic.classList.add('ball-open-pop');
    }
    if (this.introBallEl) {
      this.introBallEl.classList.add('ball-burst-glow');
    }
    await this.wait(160);

    if (this.introBallEl) {
      this.introBallEl.className = 'battle-intro-ball hidden';
    }
    if (this.introBallGraphic) {
      this.introBallGraphic.classList.remove('ball-open-pop');
    }
    if (this.trainerWrapEl) {
      this.trainerWrapEl.style.display = 'none';
    }

    // 4. Player Pokemon emerges with glowing expansion
    if (this.playerSpriteWrapEl) {
      this.playerSpriteWrapEl.style.display = 'flex';
    }
    if (this.playerSprite) {
      this.playerSprite.className = 'battle-sprite player-sprite pokemon-burst-enter';
    }
    const playerSpeciesId = player.speciesId || player.species?.id || 25;
    sfxManager.playCry(playerSpeciesId);
    await this.wait(600);

    if (this.playerSprite) {
      this.playerSprite.className = 'battle-sprite player-sprite';
    }

    // 5. Databoxes slide in from offscreen
    sfxManager.play('GUI menu open.ogg', 0.5);
    this.enemyDataboxEl?.classList.remove('databox-hidden-right');
    this.enemyDataboxEl?.classList.add('databox-slide-in');
    this.playerDataboxEl?.classList.remove('databox-hidden-left');
    this.playerDataboxEl?.classList.add('databox-slide-in');
    await this.wait(400);

    // 6. Action panel restores & becomes interactive
    this.dialogueBoxEl?.classList.remove('full-width-dialogue');
    this.actionPanelEl?.classList.remove('hidden');
    this.mainMenuEl?.classList.remove('hidden');
    this.typeText(`O que ${String(playerName).toUpperCase()} vai fazer?`);
    this.setProcessingTurn(false);
  }

  async playPlayerPokemonSwitchIn(pokemon, message) {
    if (!pokemon) return;

    // 1. If old pokemon is still on field and not fainted, play recall shrink animation
    if (this.playerSprite && this.playerSprite.style.opacity !== '0' && !this.playerSprite.classList.contains('faint-sink') && !this.playerSprite.classList.contains('firered-faint') && this.playerSprite.style.display !== 'none') {
      sfxManager.playBallOpen();
      this.playerSprite.style.transition = 'transform 0.25s ease, filter 0.25s ease, opacity 0.25s ease';
      this.playerSprite.style.transform = 'scale(0.04) translateY(40px)';
      this.playerSprite.style.filter = 'brightness(3) sepia(1) hue-rotate(-50deg) drop-shadow(0 0 16px #ff2233)';
      this.playerSprite.style.opacity = '0';
      await this.wait(250);
    }

    // 2. Hide and reset player sprite while the new Pokéball is thrown
    if (this.playerSprite) {
      this.playerSprite.className = 'battle-sprite player-sprite';
      this.playerSprite.classList.remove('faint-sink', 'firered-faint', 'pokemon-burst-enter');
      this.playerSprite.style.display = 'none';
      this.playerSprite.style.opacity = '0';
      this.playerSprite.style.transform = 'none';
      this.playerSprite.style.transition = 'none';
      this.playerSprite.style.filter = '';
    }
    this._hideShadow(this.playerShadowEl);

    // 3. Display send-out text (e.g. "Vai, MEWTWO!")
    if (message) {
      await this.typeTextAsync(message);
      await this.wait(100);
    }

    // 4. Reset introBallEl and set correct Pokéball sprite for switched Pokémon
    const ballName = pokemon.caughtBall || pokemon.ball || 'pokeball';
    const ballIdx = this.getBallIndex(ballName);
    const closedBallSrc = `/assets/battle/ball_${ballIdx}.png`;
    const openBallSrc = `/assets/battle/ball_${ballIdx}_open.png`;

    if (this.introBallGraphic) {
      this.introBallGraphic.className = 'intro-ball-graphic';
      this.introBallGraphic.style.backgroundImage = `url("${closedBallSrc}")`;
    }

    // Pokeball switch flight arc from trainer edge to platform
    sfxManager.playThrow();
    if (this.introBallEl) {
      this.introBallEl.className = 'battle-intro-ball hidden';
      void this.introBallEl.offsetWidth; // Force CSS reflow so animation starts fresh
      this.introBallEl.className = 'battle-intro-ball ball-switch-arc';
    }
    await this.wait(450);

    // 5. Pokéball lands and bursts open with flash of light
    sfxManager.playBallOpen();
    if (this.introBallGraphic) {
      this.introBallGraphic.style.backgroundImage = `url("${openBallSrc}")`;
      this.introBallGraphic.classList.add('ball-open-pop');
    }
    if (this.introBallEl) {
      this.introBallEl.classList.add('ball-burst-glow');
    }
    await this.wait(180);

    if (this.introBallEl) {
      this.introBallEl.className = 'battle-intro-ball hidden';
    }
    if (this.introBallGraphic) {
      this.introBallGraphic.classList.remove('ball-open-pop');
    }

    // 6. Update state with new Pokémon and render HUD/moves/etc.
    this.battleState.playerPokemon = pokemon;
    this.renderBattleState();

    // 7. New Pokémon bursts onto the field with bright glowing expansion
    if (this.playerSpriteWrapEl) {
      this.playerSpriteWrapEl.style.display = 'flex';
    }
    if (this.playerSprite) {
      this.playerSprite.style.display = 'block';
      this.playerSprite.style.visibility = 'visible';
      this.playerSprite.style.opacity = '1';
      this.playerSprite.style.transform = 'none';
      void this.playerSprite.offsetWidth; // Force reflow
      this.playerSprite.className = 'battle-sprite player-sprite pokemon-burst-enter';
    }
    this._paintShadow(this.playerShadowEl);

    // Play new Pokémon's authentic Cry!
    const speciesId = pokemon.speciesId || pokemon.species?.id || 1;
    sfxManager.playCry(speciesId);
    await this.wait(450);

    // 8. Settle sprite to idle state
    if (this.playerSprite) {
      this.playerSprite.className = 'battle-sprite player-sprite';
      this.playerSprite.style.opacity = '1';
      this.playerSprite.style.transform = 'none';
      this.playerSprite.style.filter = '';
      this.playerSprite.style.display = 'block';
      this.playerSprite.style.visibility = 'visible';
    }
    this._paintShadow(this.playerShadowEl);
  }

  // ─── DATA RENDERING ────────────────────────────────────────────────────────

  renderBattleState() {
    if (!this.battleState) return;

    const playerPokemon = this.battleState.playerPokemon || {};
    const wildPokemon = this.battleState.wildPokemon || {};

    // ─── 1. Enemy Data & Sprites ─────────────────────────────────────────────
    const rawEnemyName = wildPokemon.name || wildPokemon.species?.name || 'POKÉMON';
    const enemyName = String(rawEnemyName).charAt(0).toUpperCase() + String(rawEnemyName).slice(1).toLowerCase();
    if (this.enemyNameEl) this.enemyNameEl.textContent = enemyName;
    if (this.enemyLevelEl) {
      this.enemyLevelEl.innerHTML = `<span class="lv">Lv.</span><span class="lv-num">${wildPokemon.level || 5}</span>`;
    }

    if (this.enemyGenderEl) {
      if (wildPokemon.gender === 'F') {
        this.enemyGenderEl.textContent = '♀';
        this.enemyGenderEl.className = 'gender-symbol female';
        this.enemyGenderEl.style.display = 'inline-flex';
      } else if (wildPokemon.gender === 'M') {
        this.enemyGenderEl.textContent = '♂';
        this.enemyGenderEl.className = 'gender-symbol male';
        this.enemyGenderEl.style.display = 'inline-flex';
      } else {
        this.enemyGenderEl.style.display = 'none';
      }
    }

    this._updateStatusBadge(this.enemyStatusBadgeEl, wildPokemon.status);

    const enemyCurHp = typeof wildPokemon.currentHp === 'number' ? wildPokemon.currentHp : (wildPokemon.maxHp || 20);
    const enemyMaxHp = wildPokemon.maxHp || Math.max(1, enemyCurHp);
    const enemyHpPct = Math.max(0, Math.min(100, Math.round((enemyCurHp / enemyMaxHp) * 100)));

    if (this.enemyHpFill) {
      this.enemyHpFill.style.width = `${enemyHpPct}%`;
      this.enemyHpFill.className = `hp-bar-fill ${this._getHpColorClass(enemyHpPct)}`;
    }

    const enemySpeciesId = wildPokemon.speciesId || 1;
    const enemyFmtId = String(enemySpeciesId).padStart(3, '0');
    if (this.enemySprite) {
      const enemyGif = getPokemonAnimatedSprite(enemyFmtId, { isShiny: Boolean(wildPokemon.isShiny), isBack: false });
      const applyEnemyScale = () => {
        const natW = this.enemySprite.naturalWidth || 64;
        const natH = this.enemySprite.naturalHeight || 64;
        const scale = 3.6;
        const w = Math.round(natW * scale);
        const h = Math.round(natH * scale);
        this.enemySprite.style.width = `${w}px`;
        this.enemySprite.style.height = `${h}px`;
        this._paintShadow(this.enemyShadowEl, null, w, h);
      };

      this.enemySprite.onload = applyEnemyScale;
      this.enemySprite.onerror = () => {
        const fallback = `/assets/pokemon/overworld/normal/${enemyFmtId}.png`;
        this.enemySprite.src = fallback;
        this._paintShadow(this.enemyShadowEl, fallback);
      };
      this.enemySprite.src = enemyGif;
      this.enemySprite.alt = enemyName;
      this._paintShadow(this.enemyShadowEl, enemyGif);

      if (this.enemySprite.complete && this.enemySprite.naturalWidth > 0) {
        applyEnemyScale();
      }

      if (!this.isBallInPlay && !this.enemySprite.classList.contains('faint-sink')) {
        this.enemySprite.classList.remove('captured-suck-in', 'caught-sink');
        this.enemySprite.style.transform = '';
        this.enemySprite.style.filter = '';
        this.enemySprite.style.opacity = '1';
        this.enemySprite.style.display = 'block';
        this.enemySprite.style.visibility = 'visible';
        this._paintShadow(this.enemyShadowEl);
      }
    }

    // ─── 2. Player Data & Sprites ────────────────────────────────────────────
    const rawPName = playerPokemon.name || playerPokemon.nickname || playerPokemon.species?.name || 'MEU POKÉMON';
    const pName = String(rawPName).charAt(0).toUpperCase() + String(rawPName).slice(1).toLowerCase();
    if (this.playerNameEl) this.playerNameEl.textContent = pName;
    if (this.playerLevelEl) {
      this.playerLevelEl.innerHTML = `<span class="lv">Lv.</span><span class="lv-num">${playerPokemon.level || 5}</span>`;
    }

    if (this.playerGenderEl) {
      if (playerPokemon.gender === 'F') {
        this.playerGenderEl.textContent = '♀';
        this.playerGenderEl.className = 'gender-symbol female';
        this.playerGenderEl.style.display = 'inline-flex';
      } else if (playerPokemon.gender === 'M') {
        this.playerGenderEl.textContent = '♂';
        this.playerGenderEl.className = 'gender-symbol male';
        this.playerGenderEl.style.display = 'inline-flex';
      } else {
        this.playerGenderEl.style.display = 'none';
      }
    }

    this._updateStatusBadge(this.playerStatusBadgeEl, playerPokemon.status);

    const playerCurHp = typeof playerPokemon.currentHp === 'number' ? playerPokemon.currentHp : (playerPokemon.maxHp || 20);
    const playerMaxHp = playerPokemon.maxHp || Math.max(1, playerCurHp);
    const playerHpPct = Math.max(0, Math.min(100, Math.round((playerCurHp / playerMaxHp) * 100)));

    if (this.playerHpFill) {
      this.playerHpFill.style.width = `${playerHpPct}%`;
      this.playerHpFill.className = `hp-bar-fill ${this._getHpColorClass(playerHpPct)}`;
    }
    if (this.playerHpText) {
      this.playerHpText.textContent = `${playerCurHp}/${playerMaxHp}`;
    }

    const playerSpeciesId = playerPokemon.speciesId || (playerPokemon.species && playerPokemon.species.id) || 1;
    const playerFmtId = String(playerSpeciesId).padStart(3, '0');
    if (this.playerSpriteWrapEl) {
      this.playerSpriteWrapEl.style.display = 'flex';
    }
    if (this.playerSprite) {
      const playerBackGif = getPokemonAnimatedSprite(playerFmtId, { isShiny: Boolean(playerPokemon.isShiny), isBack: true });

      const applyPlayerScale = () => {
        const natW = this.playerSprite.naturalWidth || 64;
        const natH = this.playerSprite.naturalHeight || 64;
        const scale = 4.4;
        const w = Math.round(natW * scale);
        const h = Math.round(natH * scale);
        this.playerSprite.style.width = `${w}px`;
        this.playerSprite.style.height = `${h}px`;
        this._paintShadow(this.playerShadowEl, null, w, h);
      };

      this.playerSprite.onload = applyPlayerScale;
      this.playerSprite.onerror = () => {
        const variant = playerPokemon.isShiny ? 'shiny' : 'normal';
        const fallback = `/assets/pokemon/animated/front/${variant}/${playerFmtId}.gif`;
        this.playerSprite.src = fallback;
        this._paintShadow(this.playerShadowEl, fallback);
      };
      this.playerSprite.src = playerBackGif;
      this.playerSprite.alt = pName;
      this._paintShadow(this.playerShadowEl, playerBackGif);

      if (this.playerSprite.complete && this.playerSprite.naturalWidth > 0) {
        applyPlayerScale();
      }

      if (!this.playerSprite.classList.contains('faint-sink')) {
        this.playerSprite.style.display = 'block';
        this.playerSprite.style.visibility = 'visible';
        this.playerSprite.style.opacity = '1';
        this.playerSprite.style.transform = 'none';
        this.playerSprite.style.filter = '';
        this._paintShadow(this.playerShadowEl);
      }
    }

    // Refresh quick item bar on right
    this.renderBattleQuickBar();

    // ─── 3. Player EXP Bar ───────────────────────────────────────────────────
    if (this.playerExpFill) {
      const curExp = playerPokemon.exp || 0;
      const lvl = playerPokemon.level || 5;
      const baseLvlExp = Math.pow(lvl, 3);
      const nextLvlExp = Math.pow(lvl + 1, 3);
      const expRange = Math.max(1, nextLvlExp - baseLvlExp);
      const progress = Math.max(0, Math.min(100, Math.round(((curExp - baseLvlExp) / expRange) * 100)));
      this.playerExpFill.style.width = `${progress}%`;
      if (this.playerExpUnfill) {
        this.playerExpUnfill.style.width = `${100 - progress}%`;
      }
    }

    // ─── 4. Render Authentic Sword & Shield Party Dots ───────────────────────
    this.renderPartyDots();

    // ─── 5. Render 4 Moves ───────────────────────────────────────────────────
    this.renderMovesGrid();
  }

  renderPartyDots() {
    // 1. Enemy Party Dots
    if (this.enemyPartyDotsEl) {
      this.enemyPartyDotsEl.innerHTML = '';
      const wild = this.battleState?.wildPokemon;
      const enemyParty = this.battleState?.enemyParty || (wild ? [wild] : []);
      for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.className = 'swsh-party-dot';
        if (i < enemyParty.length) {
          const pkmn = enemyParty[i];
          if (pkmn.currentHp <= 0) {
            dot.classList.add('fainted');
          } else {
            dot.classList.add('alive');
          }
        } else {
          dot.classList.add('empty');
        }
        this.enemyPartyDotsEl.appendChild(dot);
      }
    }

    // 2. Player Party Dots
    if (this.playerPartyDotsEl) {
      this.playerPartyDotsEl.innerHTML = '';
      const party = this.battleState?.playerParty || [];
      const activeIdx = this.battleState?.activePlayerIndex ?? 0;
      for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.className = 'swsh-party-dot';
        if (i < party.length) {
          const pkmn = party[i];
          if (pkmn.currentHp <= 0) {
            dot.classList.add('fainted');
          } else if (i === activeIdx) {
            dot.classList.add('active');
          } else {
            dot.classList.add('alive');
          }
        } else {
          dot.classList.add('empty');
        }
        this.playerPartyDotsEl.appendChild(dot);
      }
    }
  }

  renderMovesGrid() {
    if (!this.battleState || !this.movesBoardEl) return;

    this.movesBoardEl.innerHTML = '';
    const moves = this.battleState.playerPokemon?.moves || [];

    const updateInspector = (move) => {
      if (!this.bmdTypeEl || !this.bmdPpEl) return;
      if (move) {
        const type = (move.type || 'NORMAL').toLowerCase();
        this.bmdTypeEl.textContent = String(move.type || 'NORMAL').toUpperCase();
        this.bmdTypeEl.className = `type-chip bmd-type type-${type}`;
        this.bmdPpEl.textContent = `${move.pp}/${move.maxPp}`;
      } else {
        this.bmdTypeEl.textContent = '—';
        this.bmdTypeEl.className = 'type-chip bmd-type';
        this.bmdPpEl.textContent = '--/--';
      }
    };

    // Default inspector to first valid move
    const firstMove = moves.find(m => Boolean(m));
    updateInspector(firstMove);

    for (let i = 0; i < 4; i++) {
      const move = moves[i];
      const slotBtn = document.createElement('button');

      if (move) {
        const type = String(move.type || 'normal').toLowerCase();
        slotBtn.className = `swsh-move-btn type-card-${type} ${i === 0 ? 'active' : ''}`;
        slotBtn.title = move.description || move.name || '';

        const catLower = String(move.category || '').toLowerCase();
        let catBadge = '';
        if (catLower === 'physical') {
          catBadge = '<span class="dmc-cat dmc-cat-physical">FÍSICO</span>';
        } else if (catLower === 'special') {
          catBadge = '<span class="dmc-cat dmc-cat-special">ESPECIAL</span>';
        } else if (catLower === 'status') {
          catBadge = '<span class="dmc-cat dmc-cat-status">EFEITO</span>';
        }

        const ppState = move.pp <= 0 ? 'empty' : move.pp <= 5 ? 'low' : '';
        const hasStats = Boolean(move.power || move.accuracy);
        const statsHtml = hasStats ? `
          <div class="dmc-stats">
            <span class="dmc-stat-item"><span class="dmc-stat-k">PWR</span> <span class="dmc-stat-v">${move.power ? move.power : '—'}</span></span>
            <span class="dmc-stat-item"><span class="dmc-stat-k">ACC</span> <span class="dmc-stat-v">${move.accuracy ? move.accuracy + '%' : '—'}</span></span>
          </div>` : '';

        slotBtn.innerHTML = `
          <div class="smb-indicator type-bg-${type}"></div>
          <div class="smb-body">
            <div class="dmc-top">
              <span class="dmc-name">${move.name || 'Desconhecido'}</span>
              <span class="dmc-pp ${ppState}">PP ${move.pp}/${move.maxPp}</span>
            </div>
            <div class="dmc-bottom">
              <div class="dmc-type-group">
                <span class="type-chip type-${type}">${String(move.type || 'NORMAL').toUpperCase()}</span>
                ${catBadge}
              </div>
              ${statsHtml}
            </div>
          </div>
          <span class="smb-arrow">▸</span>
        `;

        slotBtn.addEventListener('mouseenter', () => {
          sfxManager.playCursor();
          this.movesBoardEl.querySelectorAll('.swsh-move-btn').forEach(b => b.classList.remove('active'));
          slotBtn.classList.add('active');
          updateInspector(move);
        });

        if (move.pp <= 0) {
          slotBtn.classList.add('no-pp');
          slotBtn.disabled = true;
        } else {
          slotBtn.addEventListener('click', () => {
            sfxManager.playDecision();
            this.handleMoveSelect(i);
          });
        }
      } else {
        slotBtn.className = 'swsh-move-btn empty-slot';
        slotBtn.innerHTML = `
          <div class="det-move-card-empty" style="width:100%;height:100%;border:none;background:transparent;opacity:1;">
            <span class="dmc-empty-dash">- - Espaço Vazio - -</span>
          </div>
        `;
        slotBtn.disabled = true;
      }

      this.movesBoardEl.appendChild(slotBtn);
    }
  }

  switchSubMenu(menuKey) {
    if (this.isForceSwitch || (this.battleState?.playerPokemon?.currentHp <= 0)) {
      this.isForceSwitch = true;
      if (menuKey !== 'bag' && menuKey !== 'team') {
        menuKey = 'team';
      }
    }

    this.currentSubMenu = menuKey;

    // Fight mode: moves take over the full bar (dialogue area hidden via CSS)
    this.commandBarEl?.classList.toggle('mode-fight', menuKey === 'fight');

    // Reset visibility of sub elements
    this.moveDetailPanelEl?.classList.add('hidden');
    this.bagActionPanelEl?.classList.add('hidden');
    this.teamActionPanelEl?.classList.add('hidden');
    this.modalBackdropEl?.classList.add('hidden');

    this.movesBoardEl?.classList.add('hidden');
    this.bagBoardEl?.classList.add('hidden');
    this.teamBoardEl?.classList.add('hidden');

    if (menuKey === 'main') {
      this.dialogueContentEl?.classList.remove('hidden');
      this.mainMenuEl?.classList.remove('hidden');

      // Highlight Fight as active
      this.mainMenuEl.querySelectorAll('.swsh-action-btn').forEach(b => b.classList.remove('active'));
      this.btnFight?.classList.add('active');

      const pName = this.battleState?.playerPokemon?.nickname || this.battleState?.playerPokemon?.species?.name || 'seu Pokémon';
      this.typeText(`O que ${String(pName).toUpperCase()} vai fazer?`);
    } else if (menuKey === 'fight') {
      this.mainMenuEl?.classList.add('hidden');
      this.moveDetailPanelEl?.classList.remove('hidden');
      this.movesBoardEl?.classList.remove('hidden');
      this.renderMovesGrid();
    } else if (menuKey === 'bag') {
      this.mainMenuEl?.classList.remove('hidden');
      this.mainMenuEl?.querySelectorAll('.swsh-action-btn').forEach(b => b.classList.remove('active'));
      this.btnBag?.classList.add('active');
      this.modalBackdropEl?.classList.remove('hidden');
      this.bagActionPanelEl?.classList.remove('hidden');
      this.bagBoardEl?.classList.remove('hidden');
      this.renderBagBoard();
    } else if (menuKey === 'team') {
      this.modalBackdropEl?.classList.remove('hidden');
      if (this.isForceSwitch) {
        this.mainMenuEl?.classList.add('hidden');
      } else {
        this.mainMenuEl?.classList.remove('hidden');
        this.mainMenuEl?.querySelectorAll('.swsh-action-btn').forEach(b => b.classList.remove('active'));
        this.btnPokemon?.classList.add('active');
      }
      this.teamActionPanelEl?.classList.remove('hidden');
      this.teamBoardEl?.classList.remove('hidden');
      this.renderTeamBoard();
    }
  }

  renderBagBoard() {
    if (!this.bagItemsScrollEl) return;
    this.bagItemsScrollEl.innerHTML = '<div class="battle-menu-loading">Buscando itens...</div>';

    // Update active tab buttons
    const bagTabs = this.container.querySelectorAll('.swsh-bag-tab');
    bagTabs.forEach(tab => {
      if ((tab.dataset.tab || 'all') === this.currentBagTab) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    try {
      const bagUI = this.worldScene?.bagUI || window._bagUI;
      const bagItems = bagUI?.inventory || [];
      const hotbarSlots = bagUI?.hotbarSlots || [];

      // Update capacity badge (e.g. 17 / 24 Slots)
      const totalCount = bagItems.filter(s => s && s.item && s.quantity > 0).length;
      if (this.bagCapacityBadge) {
        this.bagCapacityBadge.textContent = `${totalCount} / 24 Slots`;
      }

      if (this.currentBagTab !== 'medicine') {
        this.currentBagTab = 'balls';
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
        // Default: 'balls' (Pokeballs)
        return cat === 'pokeball' || name.includes('ball') || name.includes('bola');
      });

      this.bagItemsScrollEl.innerHTML = '';

      const updateSelectedItem = (slot) => {
        this.selectedBagItem = slot;
        if (this.bbapName) this.bbapName.textContent = slot?.item?.name ? String(slot.item.name) : '—';
        if (this.bbapQty) this.bbapQty.textContent = slot?.quantity ? `X${slot.quantity}` : 'X0';
        if (this.bbapCat) {
          const cat = slot?.item?.category || 'geral';
          const label = cat === 'pokeball' ? 'POKÉBOLA' : cat === 'medicine' ? 'MEDICINA' : cat === 'battle' ? 'BATALHA' : 'GERAL';
          this.bbapCat.textContent = label;
        }
        if (this.bbapIconWrap) {
          if (slot?.item) {
            const iconSrc = slot.item.icon || this.getItemBattleIcon(slot.item);
            this.bbapIconWrap.innerHTML = `<img src="${iconSrc}" alt="${slot.item.name}" onerror="this.src='/assets/battle/ball_00.png'">`;
          } else {
            this.bbapIconWrap.innerHTML = '';
          }
        }
        if (this.bagItemDescEl) {
          this.bagItemDescEl.textContent = slot?.item?.description || (slot?.item ? `Item utilizável em batalha: ${slot.item.name}.` : 'Selecione um item da mochila.');
        }
      };

      if (filtered.length > 0) {
        updateSelectedItem(filtered[0]);
      } else {
        updateSelectedItem(null);
      }

      // Always render 24 slots (4 rows x 6 columns) exactly matching Image 1
      const totalSlots = 24;
      for (let i = 0; i < totalSlots; i++) {
        const slot = filtered[i];
        const slotEl = document.createElement('div');

        if (slot && slot.item) {
          const isSelected = this.selectedBagItem?.item?.id === slot.item.id;
          slotEl.className = `battle-bag-slot ${isSelected ? 'selected' : ''}`;

          const iconSrc = slot.item.icon || this.getItemBattleIcon(slot.item);

          // Find hotbar key [1-5] if equipped
          let hotbarKey = null;
          const hb = hotbarSlots.find(h => h.itemId === slot.item.id || (h.itemName && h.itemName.toLowerCase() === slot.item.name.toLowerCase()));
          if (hb) hotbarKey = hb.key;

          slotEl.innerHTML = `
            ${hotbarKey ? `<span class="bag-slot-hotbar-key">[${hotbarKey}]</span>` : ''}
            <img src="${iconSrc}" class="bag-slot-icon" alt="${slot.item.name}" onerror="this.src='/assets/battle/ball_00.png'">
            <span class="bag-slot-qty">x${slot.quantity}</span>
          `;

          slotEl.addEventListener('mouseenter', () => sfxManager.playCursor());

          slotEl.addEventListener('click', () => {
            sfxManager.playDecision();
            this.bagItemsScrollEl.querySelectorAll('.battle-bag-slot').forEach(s => s.classList.remove('selected'));
            slotEl.classList.add('selected');
            updateSelectedItem(slot);
          });

          slotEl.addEventListener('dblclick', () => {
            sfxManager.playDecision();
            this.handleItemSelect(slot.item.id);
          });
        } else {
          // Empty slot with slot number matching Image 1
          slotEl.className = 'battle-bag-slot empty';
          slotEl.innerHTML = `<span class="bag-slot-empty-num">${i + 1}</span>`;
        }

        this.bagItemsScrollEl.appendChild(slotEl);
      }
    } catch (e) {
      console.error('[BattleUI] Erro ao renderizar itens da mochila:', e);
      this.bagItemsScrollEl.innerHTML = '<div class="battle-bag-empty">Erro ao carregar itens.</div>';
    }
  }

  renderTeamBoard() {
    if (!this.teamGridEl) return;
    this.teamGridEl.innerHTML = '';
    const party = this.battleState?.playerParty || [];

    // Update count badge (e.g. 1/6 or 6/6)
    if (this.teamCountBadge) {
      this.teamCountBadge.textContent = `${party.length}/6`;
    }

    // Toggle Back button visibility & info prompt when forced switch
    const infoEl = this.teamActionPanelEl?.querySelector('.btap-info');
    if (infoEl) {
      if (this.reviveItemPending) {
        infoEl.textContent = `Selecione o Pokémon desmaiado para usar ${this.reviveItemPending.itemName}`;
        infoEl.style.color = '#00e5ff';
      } else if (this.isForceSwitch) {
        infoEl.textContent = 'Pokémon desmaiou! Escolha outro para lutar ou use um Revive.';
        infoEl.style.color = '#ef4444';
      } else {
        infoEl.textContent = 'Trocar Pokémon em batalha';
        infoEl.style.color = '';
      }
    }

    if (this.btnTeamBack) {
      if (this.isForceSwitch) {
        this.btnTeamBack.textContent = '🎒 ABRIR MOCHILA (REVIVE)';
        this.btnTeamBack.classList.remove('hidden');
        this.btnTeamBack.onclick = (e) => {
          e.preventDefault();
          this.switchSubMenu('bag');
        };
      } else {
        this.btnTeamBack.textContent = '◀ VOLTAR';
        this.btnTeamBack.classList.remove('hidden');
        this.btnTeamBack.onclick = (e) => {
          e.preventDefault();
          this.reviveItemPending = null;
          this.switchSubMenu('main');
        };
      }
    }

    // Render cells in 6 columns (Image 2 style: 12 cells = 2 rows x 6 columns)
    const totalCells = Math.max(12, Math.ceil(party.length / 6) * 6);
    for (let idx = 0; idx < totalCells; idx++) {
      const pkmn = party[idx];
      const cell = document.createElement('div');

      if (pkmn) {
        const isFainted = pkmn.currentHp <= 0;
        const isCurrent = idx === this.battleState?.activePlayerIndex;
        const isShiny = Boolean(pkmn.isShiny);

        cell.className = `battle-pbc pkmn-box-cell ${isCurrent ? 'in-battle' : ''} ${isFainted ? 'is-fainted' : ''}`;

        const speciesId = pkmn.speciesId || pkmn.species?.id || 1;
        const fmtId = formatSpeciesId(speciesId);
        const owSpriteUrl = getPokemonOverworldSprite(speciesId, { isShiny });
        const hpPct = Math.max(0, Math.min(100, Math.round(((pkmn.currentHp || 0) / (pkmn.maxHp || 1)) * 100)));
        const hpColor = this._getHpColorClass(hpPct);

        const genderSymbol = pkmn.gender === 'F' ? '♀' : pkmn.gender === 'M' ? '♂' : '';
        const genderClass = pkmn.gender === 'F' ? 'female' : 'male';
        const name = pkmn.nickname || pkmn.species?.name || pkmn.name || 'POKÉMON';

        let statusTag = '';
        if (isFainted) {
          if (this.reviveItemPending) {
            statusTag = '<span class="pbc-tag-status revive-active">CLIQUE P/ REVIVER</span>';
            cell.classList.add('revive-target');
          } else {
            statusTag = '<span class="pbc-tag-status fainted">DESMAIADO</span>';
          }
        }

        cell.innerHTML = `
          <span class="pbc-dex-num">#${fmtId}</span>
          ${genderSymbol ? `<span class="pbc-gender ${genderClass}">${genderSymbol}</span>` : ''}
          <div class="pkmn-ow-sprite pbc-ow-sprite" style="background-image: url('${owSpriteUrl}')"></div>
          <span class="pbc-name">${name}</span>
          <span class="pbc-level">Lv.${pkmn.level || 5}</span>
          <div class="pbc-hp-row" title="HP: ${pkmn.currentHp}/${pkmn.maxHp}">
            <span class="pbc-hp-lbl">HP</span>
            <div class="pbc-hp-track">
              <div class="pbc-hp-fill ${hpColor}" style="width: ${hpPct}%;"></div>
            </div>
          </div>
          ${statusTag}
        `;

        cell.addEventListener('mouseenter', () => {
          if (this.reviveItemPending && isFainted) {
            sfxManager.playCursor();
          } else if (!isCurrent && !isFainted) {
            sfxManager.playCursor();
          }
        });

        cell.addEventListener('click', () => {
          if (this.reviveItemPending) {
            if (isFainted) {
              sfxManager.playDecision();
              const p = this.reviveItemPending;
              this.reviveItemPending = null;
              this.handleItemSelect(p.itemId, pkmn.id);
            } else {
              sfxManager.playCancel();
              this.typeText(`${name} não está desmaiado!`);
            }
            return;
          }

          if (isFainted) {
            // Se o Pokémon estiver desmaiado e o jogador clicar nele, verificar se tem Revive na mochila
            const bagUI = this.worldScene?.bagUI || window._bagUI;
            const bagItems = bagUI?.inventory || [];
            const reviveSlot = bagItems.find(s =>
              s && s.item && s.quantity > 0 && String(s.item.name || '').toLowerCase().includes('revive')
            );
            if (reviveSlot) {
              sfxManager.playDecision();
              this.typeText(`Usando 1x ${reviveSlot.item.name} em ${name}...`);
              this.handleItemSelect(reviveSlot.item.id, pkmn.id);
            } else {
              sfxManager.playCancel();
              this.typeText(`${name} está desmaiado! Você não possui Revive na mochila.`);
            }
            return;
          }

          if (isCurrent) {
            return;
          }

          sfxManager.playDecision();
          this.handleSwitchSelect(idx);
        });
      } else {
        // Empty cell matching Image 2 with number in faint gray
        cell.className = 'battle-pbc pkmn-box-cell empty-cell';
        cell.innerHTML = `<span class="pbc-num">${idx + 1}</span>`;
      }

      this.teamGridEl.appendChild(cell);
    }
  }

  _getHpColorClass(pct) {
    if (pct > 50) return 'hp-green';
    if (pct > 20) return 'hp-yellow';
    return 'hp-red';
  }

  // ─── SPRITE-SILHOUETTE SHADOWS (black sprite cast diagonally) ──────────
  _paintShadow(shadowEl, url = null, w = null, h = null) {
    if (!shadowEl) return;
    if (url) shadowEl.style.backgroundImage = `url("${url}")`;
    if (w) shadowEl.style.width = `${w}px`;
    if (h) shadowEl.style.height = `${h}px`;
    shadowEl.style.display = 'block';
  }

  _hideShadow(shadowEl) {
    if (shadowEl) shadowEl.style.display = 'none';
  }

  // ─── BATTLE-END XP (shared messages + active-mon summary + party fx) ──
  _battlePartyMonName(pokemonId) {
    if (pokemonId == null) return '';
    const mon = (this.battleState?.playerParty || []).find(p => Number(p.id) === Number(pokemonId));
    if (!mon) return '';
    return String(mon.nickname || mon.species?.name || mon.name || '').trim();
  }

  _notifySystemChat(text) {
    try {
      window._chatUI?.addMessage?.({ channel: 'system', sender: 'Sistema', text });
    } catch (e) { }
  }

  _notifyPartyXpGains() {
    try {
      const gains = this._battleXpGains;
      this._battleXpGains = new Map();
      if (!gains || gains.size === 0) return;
      const hud = this.worldScene?.partyHUDUI || window._partyHUDUI;
      hud?.showXpGains?.(gains);
    } catch (e) { }
  }

  // ─── PLAYER ACTIONS & TURN VALIDATION ────────────────────────────────────

  setProcessingTurn(isProcessing) {
    this.isProcessingTurn = isProcessing;
    if (this.quickBarEl) {
      if (isProcessing) {
        this.quickBarEl.classList.add('turn-locked');
      } else {
        this.quickBarEl.classList.remove('turn-locked');
      }
    }
  }

  handleMoveSelect(slotIndex) {
    if (this.isProcessingTurn) {
      this.typeText('Aguarde o término do turno atual!');
      return;
    }
    if (this.isForceSwitch || (this.battleState?.playerPokemon?.currentHp <= 0)) {
      this.typeText('Seu Pokémon desmaiou! Troque de Pokémon para continuar.');
      return;
    }
    this.setProcessingTurn(true);
    SocketClient.emit('battle:action', {
      action: { type: 'fight', slotIndex }
    });
  }

  handleRun() {
    if (this.isProcessingTurn) {
      this.typeText('Aguarde o término do turno atual!');
      return;
    }
    if (this.isForceSwitch || (this.battleState?.playerPokemon?.currentHp <= 0)) {
      this.typeText('Seu Pokémon desmaiou! Troque de Pokémon para continuar.');
      return;
    }
    this.setProcessingTurn(true);
    sfxManager.playFlee();
    SocketClient.emit('battle:action', {
      action: { type: 'run' }
    });
  }

  handleItemSelect(itemId, targetPokemonId = null) {
    if (this.isProcessingTurn) {
      this.typeText('Aguarde o término do turno atual!');
      return;
    }

    const bagUI = this.worldScene?.bagUI || window._bagUI;
    const invSlot = (bagUI?.inventory || []).find(s => s && s.item && s.item.id === itemId);
    const itemName = String(invSlot?.item?.name || '').toLowerCase();
    const isRevive = itemName.includes('revive');

    if ((this.isForceSwitch || (this.battleState?.playerPokemon?.currentHp <= 0)) && !isRevive) {
      this.typeText('Seu Pokémon desmaiou! Escolha outro para lutar ou use um Revive.');
      return;
    }

    // Se for Revive e não especificou um Pokémon alvo, direcionar para a tela de equipe
    if (isRevive && !targetPokemonId) {
      const party = this.battleState?.playerParty || [];
      const faintedList = party.filter(p => p.currentHp <= 0);
      if (faintedList.length === 0) {
        this.typeText('Nenhum Pokémon da sua equipe está desmaiado!');
        return;
      }

      this.reviveItemPending = { itemId, itemName: invSlot?.item?.name || 'Revive' };
      this.switchSubMenu('team');
      this.renderTeamBoard();
      return;
    }

    this.reviveItemPending = null;
    this.setProcessingTurn(true);
    SocketClient.emit('battle:action', {
      action: { type: 'item', itemId, targetPokemonId }
    });
  }

  handleSwitchSelect(partyIndex) {
    if (this.isProcessingTurn) {
      this.typeText('Aguarde a finalização da ação atual!');
      return;
    }
    this.setProcessingTurn(true);
    sfxManager.playBallOpen();
    SocketClient.emit('battle:action', {
      action: { type: 'switch', partyIndex }
    });
  }

  handleQuickItemSlot(slotNumber) {
    if (!this.isOpen) return;

    if (this.isProcessingTurn) {
      this.typeText('Aguarde o término do turno atual!');
      return;
    }

    if (this.isForceSwitch || (this.battleState?.playerPokemon?.currentHp <= 0)) {
      this.typeText('Seu Pokémon desmaiou! Troque de Pokémon para continuar.');
      return;
    }

    let hotbarItem = null;
    const bagUI = this.worldScene?.bagUI || window._bagUI;
    if (bagUI && Array.isArray(bagUI.hotbarSlots)) {
      hotbarItem = bagUI.hotbarSlots.find(s => s.key === slotNumber);
    }

    if (!hotbarItem || (!hotbarItem.itemId && !hotbarItem.itemName)) {
      try {
        const charId = this.worldScene?.currentCharacterData?.id || 'default';
        const saved = localStorage.getItem(`pokemmo_hotbar_${charId}`);
        if (saved) {
          const slots = JSON.parse(saved);
          hotbarItem = slots.find(s => s.key === slotNumber);
        }
      } catch (e) { }
    }

    if (!hotbarItem || (!hotbarItem.itemId && !hotbarItem.itemName)) {
      this.typeText(`Nenhum item equipado no atalho [${slotNumber}]!`);
      return;
    }

    this.setProcessingTurn(true);
    this.typeText(`Usando ${hotbarItem.itemName || 'item'} do atalho [${slotNumber}]...`);

    SocketClient.emit('battle:quick_item', {
      slotNumber,
      itemId: hotbarItem.itemId,
      itemName: hotbarItem.itemName
    });
  }

  renderBattleQuickBar() {
    if (!this.quickBarEl) return;
    this.quickBarEl.innerHTML = '';

    const bagUI = this.worldScene?.bagUI || window._bagUI;
    let hotbarSlots = bagUI?.hotbarSlots;

    if (!hotbarSlots || !hotbarSlots.length) {
      try {
        const charId = this.worldScene?.currentCharacterData?.id || 'default';
        const saved = localStorage.getItem(`pokemmo_hotbar_${charId}`);
        if (saved) hotbarSlots = JSON.parse(saved);
      } catch (e) { }
    }

    if (!hotbarSlots || !hotbarSlots.length) {
      hotbarSlots = [1, 2, 3, 4, 5].map(k => ({ key: k, itemId: null, itemName: null }));
    }

    const inventory = bagUI?.inventory || [];

    hotbarSlots.forEach(slot => {
      const slotEl = document.createElement('div');
      slotEl.className = 'battle-quick-slot';
      slotEl.dataset.key = slot.key;

      let qty = 0;
      let icon = null;
      let name = slot.itemName || '';

      if (slot.itemId) {
        const invItem = inventory.find(i => (i.item?.id === slot.itemId || i.itemId === slot.itemId));
        if (invItem) {
          qty = invItem.quantity || 0;
          icon = invItem.item?.icon || invItem.icon;
          name = invItem.item?.name || invItem.name || name;
        }
      }

      if (!icon && name) {
        icon = this.getItemBattleIcon(name);
      }

      slotEl.innerHTML = `
        <span class="bqs-key">${slot.key}</span>
        ${icon ? `<img src="${icon}" class="bqs-icon" alt="${name}" onerror="this.src='/assets/battle/ball_00.png'">` : ''}
        ${qty > 0 ? `<span class="bqs-qty">x${qty}</span>` : ''}
      `;

      if (slot.itemId && qty > 0) {
        slotEl.title = `[${slot.key}] ${name} (x${qty})`;
        slotEl.addEventListener('mouseenter', () => sfxManager.playCursor());
        slotEl.addEventListener('click', () => {
          sfxManager.playDecision();
          this.handleQuickItemSlot(slot.key);
        });
      } else {
        slotEl.classList.add('empty');
      }

      this.quickBarEl.appendChild(slotEl);
    });
  }

  // ─── ATTACK ANIMATION SYSTEM (ESSENTIALS SPRITESHEETS) ─────────────────────

  getAttackAnimationConfig(moveName = '') {
    const m = String(moveName).toLowerCase();

    // NOTE: ranges only cover frames verified to have content (see assets audit).
    // Order matters: special/rare types first, generic physical last.

    // Explosion / Self-destruct
    if (m.includes('explos') || m.includes('selfdestruct') || m.includes('self-destruct') || m.includes('detonat') || m.includes('mind blown')) {
      return { file: '030-Explosion01.png', cols: 5, rows: 2, startFrame: 0, endFrame: 7, fps: 24 };
    }

    // Psychic (energy burst reads as mind power)
    if (m.includes('psychic') || m.includes('psycho') || m.includes('psywave') || m.includes('psybeam') || m.includes('confus') || m.includes('extrasensory') || m.includes('hypnosis') || m.includes('dream') || m.includes('zen') || m.includes('kinesis') || m.includes('stored') || m.includes('meditat') || m.includes('miracle') || m.includes('psiqu') || m.includes('hipnose')) {
      return { file: '023-Burst01.png', cols: 5, rows: 2, startFrame: 0, endFrame: 7, fps: 24 };
    }

    // Fairy (bright burst)
    if (m.includes('fairy') || m.includes('fada') || m.includes('moonblast') || m.includes('dazzling') || m.includes('play rough') || m.includes('charm') || m.includes('draining kiss') || m.includes('misty') || m.includes('sweet') || m.includes('fleur')) {
      return { file: '023-Burst01.png', cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24 };
    }

    // Ghost (dark burst)
    if (m.includes('ghost') || m.includes('spirit') || m.includes('hex') || m.includes('astonish') || m.includes('lick') || m.includes('curse') || m.includes('nightmare') || m.includes('ominous') || m.includes('phantom') || m.includes('shadow ball') || m.includes('fantasma')) {
      return { file: '030-Explosion01.png', cols: 5, rows: 2, startFrame: 4, endFrame: 7, fps: 24 };
    }

    // Dark special (energy) vs Dark physical (slashes)
    if (m.includes('pulse') || m.includes('daze') || m.includes('snarl')) {
      return { file: '023-Burst01.png', cols: 5, rows: 2, startFrame: 4, endFrame: 7, fps: 24 };
    }
    if (m.includes('shadow') || m.includes('dark') || m.includes('night') || m.includes('thief') || m.includes('pursuit') || m.includes('sucker') || m.includes('payback') || m.includes('feint') || m.includes('assurance') || m.includes('foul') || m.includes('brutal') || m.includes('sombra') || m.includes('ladrao') || m.includes('ladrão')) {
      return { file: '004-Attack02.png', cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22 };
    }

    // Dragon (fiery breath)
    if (m.includes('dragon') || m.includes('draco') || m.includes('outrage') || m.includes('rage') || m.includes('dual chop') || m.includes('dragao') || m.includes('dragão')) {
      return { file: '015-Fire01.png', cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24 };
    }

    // Steel (checked before claw/punch: Metal Claw, Bullet Punch)
    if (m.includes('steel') || m.includes('metal') || m.includes('iron') || m.includes('bullet') || m.includes('gyro') || m.includes('flash cannon') || m.includes('mirror') || m.includes('smart strike') || m.includes('corkscrew') || m.includes('magnet') || m.includes('aco') || m.includes('aço')) {
      return { file: '004-Attack02.png', cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22 };
    }

    // Fighting (full-content slash/impact sheet)
    if (m.includes('punch') || m.includes('hit') || m.includes('kick') || m.includes('combat') || m.includes('fight') || m.includes('karate') || m.includes('chop') || m.includes('brick') || m.includes('aura') || m.includes('focus') || m.includes('revenge') || m.includes('force palm') || m.includes('mach') || m.includes('bulk') || m.includes('cross') || m.includes('submission') || m.includes('superpower') || m.includes('soco') || m.includes('chute') || m.includes('scratch') || m.includes('claw') || m.includes('slash') || m.includes('cut') || m.includes('fury') || m.includes('cutter') || m.includes('scissor') || m.includes('aranh') || m.includes('garra')) {
      return { file: '004-Attack02.png', cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22 };
    }

    // Bug (string/special-ish -> leaves; slashy bugs fall in Fighting above via fury/cutter)
    if (m.includes('bug') || m.includes('inseto') || m.includes('string') || m.includes('web') || m.includes('leech') || m.includes('signal') || m.includes('silver wind') || m.includes('infestation') || m.includes('quiver') || m.includes('sticky') || m.includes('spider')) {
      return { file: 'grass.png', cols: 5, rows: 5, startFrame: 5, endFrame: 7, fps: 24 };
    }

    // Fire moves - Vortex/Tornado vs Burst/Ember
    if (m.includes('spin') || m.includes('vortex') || m.includes('tornado') || m.includes('whirl') || m.includes('redemoinho')) {
      return { file: '015-Fire01.png', cols: 5, rows: 2, startFrame: 5, endFrame: 9, fps: 24 };
    }
    if (m.includes('fire') || m.includes('ember') || m.includes('flame') || m.includes('blast') || m.includes('erupt') || m.includes('burn') || m.includes('flare') || m.includes('pyro') || m.includes('magma') || m.includes('lava') || m.includes('fogo') || m.includes('brasa') || m.includes('queim') || m.includes('inciner')) {
      return { file: '015-Fire01.png', cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24 };
    }

    // Electric moves (frames 0-5 only, frames 6-9 are blank)
    if (m.includes('thunder') || m.includes('electric') || m.includes('electro') || m.includes('eletric') || m.includes('shock') || m.includes('spark') || m.includes('volt') || m.includes('trovao') || m.includes('trovão') || m.includes('choque')) {
      return { file: '017-Thunder01.png', cols: 5, rows: 2, startFrame: 0, endFrame: 5, fps: 24 };
    }

    // Ice moves (frames 0-8)
    if (m.includes('ice') || m.includes('icicle') || m.includes('icy') || m.includes('blizzard') || m.includes('freeze') || m.includes('snow') || m.includes('gelo') || m.includes('frost') || m.includes('hail') || m.includes('aurora')) {
      return { file: 'Ice1.png', cols: 5, rows: 2, startFrame: 0, endFrame: 8, fps: 24 };
    }

    // Wind / Flying moves (content frames 8-12)
    if (m.includes('gust') || m.includes('wind') || m.includes('wing') || m.includes('fly') || m.includes('aerial') || m.includes('air') || m.includes('twister') || m.includes('hurricane') || m.includes('vento') || m.includes('asa')) {
      return { file: 'Wind1.png', cols: 5, rows: 3, startFrame: 8, endFrame: 12, fps: 24 };
    }

    // Grass moves (only frames 5-7 have content)
    if (m.includes('vine') || m.includes('leaf') || m.includes('grass') || m.includes('seed') || m.includes('petal') || m.includes('absorb') || m.includes('drain') || m.includes('growth') || m.includes('chicote') || m.includes('folha') || m.includes('semente')) {
      return { file: 'grass.png', cols: 5, rows: 5, startFrame: 5, endFrame: 7, fps: 24 };
    }

    // Bite / Crunch / Fang
    if (m.includes('bite') || m.includes('crunch') || m.includes('fang') || m.includes('mord') || m.includes('jaw')) {
      return { file: 'teeth.png', cols: 5, rows: 5, startFrame: 0, endFrame: 4, fps: 24 };
    }

    // Poison / Toxic / Acid / Spores
    if (m.includes('poison') || m.includes('acid') || m.includes('toxic') || m.includes('veneno') || m.includes('sludge') || m.includes('smog') || m.includes('gunk') || m.includes('venoshock') || m.includes('spore') || m.includes('sleep powder') || m.includes('stun spore') || m.includes('gas') || m.includes('corrosiv')) {
      return { file: 'poison.png', cols: 5, rows: 3, startFrame: 0, endFrame: 10, fps: 24 };
    }

    // Earth / Ground / Rock / Mud
    if (m.includes('mud') || m.includes('earth') || m.includes('rock') || m.includes('dig') || m.includes('sand') || m.includes('magnitude') || m.includes('fissure') || m.includes('tomb') || m.includes('terra') || m.includes('pedra')) {
      return { file: 'Earth1.png', cols: 5, rows: 2, startFrame: 0, endFrame: 6, fps: 22 };
    }

    // Water moves (content 0-3 and 6-11; 4-5 are blank)
    if (m.includes('surf') || m.includes('hydro') || m.includes('wave') || m.includes('aqua jet') || m.includes('waterfall') || m.includes('onda') || m.includes('dive')) {
      return { file: '018-Water01.png', cols: 5, rows: 3, startFrame: 6, endFrame: 10, fps: 24 };
    }
    if (m.includes('water') || m.includes('bubble') || m.includes('aqua') || m.includes('agua') || m.includes('água') || m.includes('bolha')) {
      return { file: '018-Water01.png', cols: 5, rows: 3, startFrame: 0, endFrame: 3, fps: 24 };
    }

    // Default Physical impact (Tackle, Pound, Quick Attack, Headbutt, Slam, etc. - frames 0-4)
    return { file: '003-Attack01.png', cols: 5, rows: 2, startFrame: 0, endFrame: 4, fps: 24 };
  }

  async playAttackAnimation(moveName, targetSpriteEl) {
    const canvas = this.fxCanvasEl;
    if (!canvas || !targetSpriteEl) return;

    const config = this.getAttackAnimationConfig(moveName);
    const imgPath = `/assets/battle/animations/${config.file}`;

    const arenaEl = this.container?.querySelector('.battle-arena');
    const arenaRect = arenaEl?.getBoundingClientRect() || canvas.getBoundingClientRect();
    canvas.width = arenaRect.width || 960;
    canvas.height = arenaRect.height || 540;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const targetRect = targetSpriteEl.getBoundingClientRect();
    const targetCenterX = (targetRect.left + targetRect.width / 2) - arenaRect.left;
    const targetCenterY = (targetRect.top + targetRect.height / 2) - arenaRect.top;

    const img = await new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = imgPath;
    });

    if (!img) return;

    const frameW = 192;
    const frameH = 192;
    const cols = config.cols || 5;
    const startFrame = config.startFrame !== undefined ? config.startFrame : 0;
    const endFrame = config.endFrame !== undefined ? config.endFrame : ((config.totalFrames || cols) - 1);
    const drawSize = 250;

    const frameDuration = 1000 / (config.fps || 24);

    return new Promise((resolve) => {
      let currentFrame = startFrame;
      let lastTime = performance.now();

      const render = (now) => {
        if (now - lastTime >= frameDuration) {
          lastTime = now;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (currentFrame <= endFrame) {
            const col = currentFrame % cols;
            const row = Math.floor(currentFrame / cols);
            const sx = col * frameW;
            const sy = row * frameH;

            ctx.drawImage(
              img,
              sx, sy, frameW, frameH,
              targetCenterX - drawSize / 2,
              targetCenterY - drawSize / 2,
              drawSize, drawSize
            );

            currentFrame++;
            requestAnimationFrame(render);
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            resolve();
          }
        } else {
          requestAnimationFrame(render);
        }
      };

      requestAnimationFrame(render);
    });
  }

  // ─── TURN SEQUENCER & ANIMATIONS ───────────────────────────────────────────

  async processTurnEvents(events, turnResult) {
    try {
      this.mainMenuEl?.classList.add('hidden');
      this.movesBoardEl?.classList.add('hidden');
      this.moveDetailPanelEl?.classList.add('hidden');
      this.bagBoardEl?.classList.add('hidden');
      this.bagActionPanelEl?.classList.add('hidden');
      this.teamBoardEl?.classList.add('hidden');
      this.teamActionPanelEl?.classList.add('hidden');
      this.modalBackdropEl?.classList.add('hidden');
      // Turn sequence always runs in the dialogue area: leave fight (full-bar moves) mode
      this.commandBarEl?.classList.remove('mode-fight');
      this.dialogueContentEl?.classList.remove('hidden');

      for (const ev of (events || [])) {
        if (ev.type === 'text') {
          // If a ball was in play and Pokemon breaks out
          if (this.isBallInPlay && (ev.message.includes('escapou') || ev.message.includes('Ah não') || ev.message.includes('libertou'))) {
            await this.animateCaptureBreakout(ev.message);
          } else {
            if (this.isBallInPlay) {
              await this.animateCaptureBreakout();
            }
            // Effectiveness/crit lines append BELOW the attack line, continuing
            // the typewriter where it stopped instead of retyping from zero
            if (APPEND_BELOW_DIALOG.has(ev.message) && this.currentText && !this.currentText.includes(ev.message)) {
              const prevLen = this.currentText.length;
              await this.typeTextAsync(`${this.currentText}\n${ev.message}`, prevLen);
            } else {
              await this.typeTextAsync(ev.message);
            }
            await this.wait(400);
          }
        } else if (ev.type === 'attack') {
          if (this.isBallInPlay) {
            await this.animateCaptureBreakout();
          }
          const attackerSprite = ev.attacker === 'player' ? this.playerSprite : this.enemySprite;
          const targetSprite = ev.attacker === 'player' ? this.enemySprite : this.playerSprite;

          // Show "X usou Y!" immediately so the dialog never sits stale/empty during the animation
          this.typeText(ev.message || `${ev.attackerName || 'Pokémon'} usou ${ev.moveName || 'um ataque'}!`);
          sfxManager.playAttackHit();
          this.animateAttackLunge(attackerSprite, ev.attacker);

          // Play frame-based attack animation over target
          await this.playAttackAnimation(ev.moveName || '', targetSprite);
          await this.wait(250);
        } else if (ev.type === 'damage') {
          if (this.isBallInPlay) {
            await this.animateCaptureBreakout();
          }
          const hpFill = ev.target === 'wild' ? this.enemyHpFill : this.playerHpFill;
          const sprite = ev.target === 'wild' ? this.enemySprite : this.playerSprite;

          sfxManager.playDamage(ev.effectiveness || 'normal');
          this.animateSpriteFlash(sprite);
          this.animateHpDrain(hpFill, ev.remainingHp, ev.maxHp);

          if (ev.target === 'player' && this.playerHpText) {
            this.playerHpText.textContent = `${ev.remainingHp} / ${ev.maxHp}`;
          }
          await this.wait(450);
        } else if (ev.type === 'status_inflict') {
          if (ev.target === 'wild' && this.battleState?.wildPokemon) {
            this.battleState.wildPokemon.status = ev.status;
            this._updateStatusBadge(this.enemyStatusBadgeEl, ev.status);
          } else if (ev.target === 'player' && this.battleState?.playerPokemon) {
            this.battleState.playerPokemon.status = ev.status;
            this._updateStatusBadge(this.playerStatusBadgeEl, ev.status);
          }
          if (ev.message) {
            await this.typeTextAsync(ev.message);
            await this.wait(200);
          }
        } else if (ev.type === 'stat_change') {
          if (ev.message) {
            await this.typeTextAsync(ev.message);
            await this.wait(200);
          }
        } else if (ev.type === 'throw_ball') {
          await this.typeTextAsync(ev.message);
          await this.animateCaptureThrow(ev.ballName);
        } else if (ev.type === 'ball_shake') {
          await this.animateCaptureShakes(ev.shakes);
        } else if (ev.type === 'catch_success') {
          await this.animateCaptureSuccess(ev.message);
        } else if (ev.type === 'faint') {
          const sprite = ev.target === 'wild' ? this.enemySprite : this.playerSprite;
          const targetMon = ev.target === 'wild' ? this.battleState?.wildPokemon : this.battleState?.playerPokemon;
          const speciesId = targetMon?.speciesId || targetMon?.species?.id;
          await this.animateFaint(sprite, speciesId);
          await this.typeTextAsync(ev.message);
          await this.wait(500);
        } else if (ev.type === 'force_switch') {
          this.isForceSwitch = true;
          await this.typeTextAsync(ev.message || 'Escolha outro Pokémon para continuar a batalha!');
          await this.wait(250);
        } else if (ev.type === 'blackout') {
          await this.typeTextAsync(ev.message || 'Todos os seus Pokémon desmaiaram! Você correu para o Centro Pokémon.');
          await this.wait(1200);
        } else if (ev.type === 'exp_gain') {
          // Track every gain for the party-HUD effect on scene exit
          const pid = ev.pokemonId != null ? Number(ev.pokemonId) : null;
          const amt = Number(ev.amount) || 0;
          if (pid != null && amt > 0) {
            const prev = this._battleXpGains.get(pid) || 0;
            this._battleXpGains.set(pid, prev + amt);
          }
          if (ev.isAttacker) {
            // Active mon XP is shown once at the very end — skip here
            if (pid != null) this._pendingAttackerExp = { pokemonId: pid, amount: amt };
          } else {
            // Shared XP: tracked for the party-HUD effect + mirrored to system
            // chat ONCE per mon (dedupe guards against double-processed loops),
            // but NOT typed in the battle dialog (end shows only the trio)
            if (pid != null && !this._chatNotifiedXp.has(pid)) {
              this._chatNotifiedXp.add(pid);
              const nm = this._battlePartyMonName(pid);
              this._notifySystemChat(`${nm || 'Pokémon'} ganhou ${amt} de xp compartilhada`);
            }
          }
        } else if (ev.type === 'level_up') {
          sfxManager.play('GUI save game.ogg', 0.8);
          await this.typeTextAsync(ev.message);
          await this.wait(750);
        } else if (ev.type === 'player_rewards') {
          // Trainer XP + gold are shown once in the final summary — skip here
          if (ev.rewards) this._pendingPlayerRewards = ev.rewards;
        } else if (ev.type === 'player_level_up') {
          sfxManager.play('GUI save game.ogg', 0.8);
          if (ev.message) {
            await this.typeTextAsync(ev.message);
            await this.wait(750);
          }
        } else if (ev.type === 'switch_in') {
          this.isForceSwitch = false;
          await this.playPlayerPokemonSwitchIn(ev.pokemon, ev.message);
          await this.wait(350);
        } else if (ev.type === 'heal') {
          sfxManager.play('GUI save game.ogg', 0.8);
          await this.typeTextAsync(ev.message);
          // Patch local state immediately so the HP bar jumps on heal,
          // before the wild counter-attack drains it again in the same turn
          try {
            const st = this.battleState;
            const amt = Number(ev.amount) || 0;
            if (st) {
              if (ev.target === 'player' && st.playerPokemon) {
                if (ev.currentHp != null) st.playerPokemon.currentHp = ev.currentHp;
                if (ev.maxHp != null) st.playerPokemon.maxHp = ev.maxHp;
              }
              const entry = (st.playerParty || []).find(p => Number(p.id) === Number(ev.pokemonId));
              if (entry) {
                entry.currentHp = ev.target === 'player' && ev.currentHp != null
                  ? ev.currentHp
                  : Math.min(entry.maxHp || 1, (entry.currentHp || 0) + amt);
              }
            }
          } catch (e) { }
          this.renderBattleState();
          await this.wait(500);
        } else if (ev.type === 'battle_end') {
          // Final summary only: trainer XP + gold, then the last used mon EXP
          const rewards = this._pendingPlayerRewards;
          this._pendingPlayerRewards = null;
          if (rewards && (Number(rewards.expGained) > 0 || Number(rewards.moneyGained) > 0)) {
            await this.typeTextAsync(`Você ganhou ${Number(rewards.expGained) || 0} XP de Treinador e ${Number(rewards.moneyGained) || 0} Poké-dollars!`);
            await this.wait(650);
          }
          const pend = this._pendingAttackerExp;
          this._pendingAttackerExp = null;
          if (pend && pend.amount > 0) {
            const nm = this._battlePartyMonName(pend.pokemonId) || 'Seu Pokémon';
            await this.typeTextAsync(`${nm} ganhou ${pend.amount} pontos de EXP!`);
            await this.wait(650);
          }
          if ((ev.winner === 'player' || ev.reason === 'victory') && ev.reason !== 'catch') {
            sfxManager.playVictory(bgmManager);
          }
          await this.wait(800);
          this.close();
          this._notifyPartyXpGains();
          return;
        }
      }

      if (!turnResult.battleEnded && turnResult.state) {
        this.battleState = turnResult.state;
        this.renderBattleState();
        if (this.isForceSwitch || this.battleState?.playerPokemon?.currentHp <= 0) {
          this.isForceSwitch = true;
          this.switchSubMenu('team');
        } else {
          this.switchSubMenu('main');
        }
      }
    } catch (err) {
      console.error('[BattleUI] Erro ao processar turn events:', err);
    } finally {
      if (!turnResult?.battleEnded) {
        if (this.isBallInPlay) {
          await this.animateCaptureBreakout();
        }
        this.renderBattleQuickBar();
        this.setProcessingTurn(false);
      }
    }
  }

  // ─── VISUAL ANIMATION HELPERS ──────────────────────────────────────────────

  animateAttackLunge(spriteEl, role) {
    if (!spriteEl) return;
    const offset = role === 'player' ? '25px, -25px' : '-25px, 25px';
    spriteEl.style.transition = 'transform 0.12s ease';
    spriteEl.style.transform = `translate(${offset})`;
    setTimeout(() => {
      spriteEl.style.transform = 'translate(0, 0)';
    }, 150);
  }

  animateSpriteFlash(spriteEl) {
    if (!spriteEl) return;
    spriteEl.classList.add('damage-flash');
    setTimeout(() => {
      spriteEl.classList.remove('damage-flash');
    }, 450);
  }

  animateHpDrain(hpFillEl, remainingHp, maxHp) {
    if (!hpFillEl) return;
    const pct = Math.max(0, Math.min(100, Math.round((remainingHp / maxHp) * 100)));
    hpFillEl.style.transition = 'width 0.5s ease-out';
    hpFillEl.style.width = `${pct}%`;
    hpFillEl.className = `hp-bar-fill ${this._getHpColorClass(pct)}`;
  }

  getItemBattleIcon(itemOrName = '') {
    const name = typeof itemOrName === 'string' ? itemOrName : (itemOrName?.name || '');
    const lower = name.toLowerCase();
    if (lower.includes('ball') || lower.includes('bola')) {
      return `/assets/battle/ball_${this.getBallIndex(name)}.png`;
    }
    const slug = lower.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `/assets/items/${slug}.png`;
  }

  getBallIndex(ballName = '') {
    const name = String(ballName).toLowerCase();
    if (name.includes('master')) return '03';
    if (name.includes('ultra')) return '02';
    if (name.includes('great') || name.includes('super')) return '01';
    if (name.includes('safari')) return '04';
    if (name.includes('level')) return '05';
    if (name.includes('lure')) return '06';
    if (name.includes('moon')) return '07';
    if (name.includes('friend')) return '08';
    if (name.includes('fast')) return '09';
    if (name.includes('heavy')) return '10';
    if (name.includes('love')) return '11';
    if (name.includes('park')) return '12';
    if (name.includes('sport')) return '13';
    if (name.includes('premier')) return '14';
    if (name.includes('repeat')) return '15';
    if (name.includes('timer')) return '16';
    if (name.includes('nest')) return '17';
    if (name.includes('net')) return '18';
    if (name.includes('dive')) return '19';
    if (name.includes('luxury')) return '20';
    if (name.includes('heal')) return '21';
    if (name.includes('quick')) return '22';
    if (name.includes('dusk')) return '23';
    return '00';
  }

  getBallSpritePaths(ballName = '') {
    const idx = this.getBallIndex(ballName);
    return {
      closed: `/assets/battle/ball_${idx}.png`,
      open: `/assets/battle/ball_${idx}_open.png`
    };
  }

  async animateCaptureThrow(ballName = '') {
    if (!this.captureBallEl) return;
    this.isBallInPlay = true;
    this.currentBallSprites = this.getBallSpritePaths(ballName);

    // 1. Reset ball state
    this.captureBallEl.className = 'battle-capture-ball';
    if (this.captureBallGraphic) {
      this.captureBallGraphic.style.backgroundImage = `url("${this.currentBallSprites.closed}")`;
    }
    if (this.captureBallFlash) {
      this.captureBallFlash.className = 'capture-ball-flash';
    }
    if (this.captureBallStars) {
      this.captureBallStars.classList.add('hidden');
    }

    // 2. Play throw sound & start parabolic throw flight
    sfxManager.playThrow();
    this.captureBallEl.classList.add('ball-capture-throw');
    await this.wait(650);

    // 3. Ball pops open right in front of Pokémon
    if (this.captureBallGraphic) {
      this.captureBallGraphic.style.backgroundImage = `url("${this.currentBallSprites.open}")`;
    }
    if (this.captureBallFlash) {
      this.captureBallFlash.className = 'capture-ball-flash burst-active';
    }
    sfxManager.playBallOpen();
    sfxManager.play('Battle jump to ball.ogg', 0.8);

    // 4. Wild Pokémon gets sucked into the ball with red energy glow
    if (this.enemySprite) {
      this.enemySprite.classList.add('captured-suck-in');
    }
    await this.wait(450);

    // 5. Ball snaps shut
    if (this.captureBallGraphic) {
      this.captureBallGraphic.style.backgroundImage = `url("${this.currentBallSprites.closed}")`;
    }

    // 6. Ball drops and bounces on the grass platform
    this.captureBallEl.className = 'battle-capture-ball ball-bounce-drop';
    await this.wait(250);
    sfxManager.playBallDrop();
    await this.wait(400);
  }

  async animateCaptureShakes(shakesCount) {
    if (!this.captureBallEl) return;
    const count = typeof shakesCount === 'number' ? shakesCount : 1;

    for (let i = 0; i < count; i++) {
      await this.wait(450);
      sfxManager.playBallShake();
      this.captureBallEl.classList.add('capture-ball-wiggle');
      await this.wait(360);
      this.captureBallEl.classList.remove('capture-ball-wiggle');
    }
    await this.wait(400);
  }

  async animateCaptureBreakout(message = '') {
    if (!this.captureBallEl) return;
    this.isBallInPlay = false;

    // 1. Ball pops open with burst light
    if (this.captureBallGraphic) {
      const openSprite = this.currentBallSprites?.open || '/assets/battle/ball_00_open.png';
      this.captureBallGraphic.style.backgroundImage = `url("${openSprite}")`;
    }

    if (this.captureBallFlash) {
      this.captureBallFlash.className = 'capture-ball-flash burst-active';
    }

    sfxManager.playBallOpen();
    await this.wait(200);

    // 2. Hide ball container
    if (this.captureBallEl) {
      this.captureBallEl.className = 'battle-capture-ball hidden';
    }

    // 3. Wild Pokémon bursts back onto screen with full appearance & cry
    if (this.enemySprite) {
      this.enemySprite.classList.remove('captured-suck-in', 'caught-sink');
      this.enemySprite.style.transform = '';
      this.enemySprite.style.filter = '';
      this.enemySprite.style.opacity = '1';
      this.enemySprite.classList.add('pokemon-burst-enter');
    }

    const enemySpecies = this.battleState?.wildPokemon?.speciesId || this.battleState?.wildPokemon?.species?.id;
    if (enemySpecies) {
      sfxManager.playCry(enemySpecies);
    }

    // 4. Type the escape message if provided
    if (message) {
      await this.typeTextAsync(message);
      await this.wait(800);
    }

    if (this.enemySprite) {
      this.enemySprite.classList.remove('pokemon-burst-enter');
    }
  }

  async animateCaptureSuccess(message = '') {
    this.isBallInPlay = false;

    // 1. Click lock & stars sparkle
    if (this.captureBallEl) {
      this.captureBallEl.classList.add('capture-ball-locked');
    }
    if (this.captureBallStars) {
      this.captureBallStars.classList.remove('hidden');
    }

    // 2. Play victory ME (stops battle music and plays victory capture fanfare)
    sfxManager.playCatchSuccess(bgmManager);

    // 3. Type message
    await this.typeTextAsync(message || 'Gotcha! Pokémon capturado!');
    await this.wait(3200);
  }

  async animateFaint(spriteEl, speciesId = null) {
    if (!spriteEl) return;

    // Authentic Fire Red cry + faint SFX
    if (speciesId) {
      sfxManager.playCry(speciesId);
    }
    sfxManager.playFaint();

    // Fire Red downward platform sink effect
    spriteEl.classList.remove('pokemon-burst-enter', 'damage-flash');
    spriteEl.classList.add('firered-faint');

    await this.wait(650);

    spriteEl.style.display = 'none';
    spriteEl.style.opacity = '0';
    spriteEl.classList.remove('firered-faint');
  }

  typeText(text, startFrom = 0) {
    // Generation guard: a stale interval (double loop, HMR, parallel writer)
    // must never overwrite newer text — this kills the mid-type "restart".
    this._typeGen = (this._typeGen || 0) + 1;
    const gen = this._typeGen;
    if (this.dialogueTimer) clearInterval(this.dialogueTimer);
    this.dialogueTimer = null;
    this.currentText = text || '';
    const safeStart = Math.max(0, Math.min(startFrom || 0, this.currentText.length));
    this.dialogueTextEl.textContent = this.currentText.substring(0, safeStart);

    let idx = safeStart;
    this.dialogueTimer = setInterval(() => {
      if (gen !== this._typeGen) {
        clearInterval(this.dialogueTimer);
        this.dialogueTimer = null;
        return;
      }
      if (idx < this.currentText.length) {
        idx++;
        this.dialogueTextEl.textContent = this.currentText.substring(0, idx);
      } else {
        clearInterval(this.dialogueTimer);
        this.dialogueTimer = null;
      }
    }, 11);
  }

  typeTextAsync(text, startFrom = 0) {
    return new Promise((resolve) => {
      this.typeText(text, startFrom);
      const remaining = Math.max(0, (text || '').length - (startFrom || 0));
      const duration = (remaining * 11) + 160;
      setTimeout(resolve, Math.max(280, duration));
    });
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _updateStatusBadge(badgeEl, status) {
    if (!badgeEl) return;
    if (!status) {
      badgeEl.className = 'databox-status-badge hidden';
      badgeEl.textContent = '';
      return;
    }
    const s = String(status).toLowerCase();
    let text = '';
    let cls = '';
    if (s.includes('poison') || s === 'psn' || s === 'tox') {
      text = 'PSN';
      cls = 'psn';
    } else if (s.includes('paraly') || s === 'par') {
      text = 'PAR';
      cls = 'par';
    } else if (s.includes('burn') || s === 'brn') {
      text = 'BRN';
      cls = 'brn';
    } else if (s.includes('sleep') || s === 'slp') {
      text = 'SLP';
      cls = 'slp';
    } else if (s.includes('freeze') || s === 'frz') {
      text = 'FRZ';
      cls = 'frz';
    }

    if (text) {
      badgeEl.textContent = text;
      badgeEl.className = `databox-status-badge ${cls}`;
    } else {
      badgeEl.className = 'databox-status-badge hidden';
      badgeEl.textContent = '';
    }
  }

  _getHpColorClass(pct) {
    if (pct <= 20) return 'danger';
    if (pct <= 50) return 'warning';
    return 'healthy';
  }
}
