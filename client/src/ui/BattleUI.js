import SocketClient from '../network/SocketClient';
import bgmManager from '../audio/BGMManager';
import { soundManager } from '../battle/soundManager.js';
import { BattleEngine } from '../battle/battleEngine.js';
import { BattleHud } from '../battle/battleHud.js';

// Sequence guard: Only the newest BattleUI instance processes socket events.
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
    this.engine = null;
    this.hud = null;
    this.container = null;
    this._resizeListener = null;
    this._lastBattleOutcome = null;

    this.initDOM();
    _claimBattleInstance(this);
    this.listenNetwork();
  }

  initDOM() {
    let el = document.getElementById('battle-ui-container');
    if (el) el.remove();

    // Purge any rogue prototype HUD elements across the document
    document.querySelectorAll('.arena-hud-layout, .combatants-header, .trainer-command-center, #battle-log-card, .combatant-card').forEach(e => e.remove());

    el = document.createElement('div');
    el.id = 'battle-ui-container';
    el.className = 'battle-ui-container hidden';
    el.innerHTML = `
      <div class="arena-container" id="arena-container">
        <canvas id="arena-canvas"></canvas>
      </div>
      <div id="hud-container"></div>
    `;

    const targetParent = document.getElementById('game-wrapper') || document.body;
    targetParent.appendChild(el);
    this.container = el;
  }

  listenNetwork() {
    // Battle started by server
    SocketClient.on('battle:started', (data) => {
      if (!_isActiveBattleInstance(this)) return;
      console.log('[BattleUI] battle:started recebido:', data);
      if (data && data.success !== false) {
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

    // Event sequence from server (EXP gains, rewards, text, captures)
    SocketClient.on('battle:turn_result', (result) => {
      if (!_isActiveBattleInstance(this)) return;
      console.log('[BattleUI] battle:turn_result recebido:', result);
      if (result && result.events) {
        for (const ev of result.events) {
          if (ev.type === 'catch_success') {
            soundManager.playCaptureSuccess();
            this.hud?.addLog(`🎉 ${ev.message || 'Gotcha! Pokémon capturado!'}`, 'system');
            setTimeout(() => {
              this.handleMatchEnd('victory', this.engine?.playerEntity?.data);
            }, 1200);
          } else if (ev.type === 'catch_failed') {
            this.hud?.addLog(`💨 ${ev.message || 'O Pokémon escapou da Pokébola!'}`, 'system');
          } else if (ev.type === 'exp_gain') {
            this.hud?.addLog(`✨ ${ev.message || '+' + ev.amount + ' EXP!'}`, 'exp');
          } else if (ev.type === 'text') {
            this.hud?.addLog(ev.message, 'system');
          } else if (ev.type === 'battle_end' && ev.reason === 'victory') {
            const pExp = ev.playerRewards?.expAdded || Math.floor((this.engine?.enemyEntity?.data?.level || 5) * 18);
            const pMoney = ev.playerRewards?.moneyAdded || Math.floor((this.engine?.enemyEntity?.data?.level || 5) * 35);
            const pokeName = this.engine?.playerEntity?.data?.name || 'Seu Pokémon';
            const logMsg = `🎉 <strong>${pokeName}</strong> venceu! <b>+${ev.levelUpResults?.[0]?.expGained || Math.floor(pExp * 1.5)} EXP</b> para ${pokeName} | <b>+${pExp} EXP</b> de Treinador | <b>+$${pMoney}</b>!`;
            this.hud?.addLog(logMsg, 'victory');
          }
        }
      }
    });

    // Inventory sync (updates bag in real-time)
    SocketClient.on('inventory:update', () => {
      if (!_isActiveBattleInstance(this)) return;
      if (this.isOpen && this.hud?.currentSubMenu === 'bag') {
        this.hud.renderBagBoard();
      }
    });

    // Action error
    SocketClient.on('battle:action_error', (data) => {
      if (!_isActiveBattleInstance(this)) return;
      this.hud?.addLog(`⚠️ ${data?.message || 'Erro na ação de batalha.'}`, 'system');
    });
  }

  setProcessingTurn(val) {
    this.isProcessingTurn = Boolean(val);
  }

  open(battleData) {
    console.log('[BattleUI] Abrindo Arena Pokémon 2D com dados:', battleData);
    this.isOpen = true;
    this.battleState = battleData;

    // Purge any lingering prototype HUD elements anywhere in document
    document.querySelectorAll('.arena-hud-layout, .combatants-header, .trainer-command-center, #battle-log-card, .combatant-card').forEach(e => e.remove());

    // Clean up previous engine & hud instances if any
    if (this.hud) {
      try { this.hud.destroy(); } catch (e) {}
      this.hud = null;
    }
    if (this.engine) {
      try { this.engine.destroy(); } catch (e) {}
      this.engine = null;
    }

    // Ensure attached to game-wrapper so it scales with the playable game screen
    const gw = document.getElementById('game-wrapper');
    if (gw && this.container && this.container.parentElement !== gw) {
      gw.appendChild(this.container);
    }

    // Reset container DOM to guarantee fresh canvas and hud
    if (this.container) {
      this.container.innerHTML = `
        <div class="arena-container" id="arena-container">
          <canvas id="arena-canvas"></canvas>
        </div>
        <div id="hud-container"></div>
      `;
    }

    // Hide ALL overworld HUDs and force close overworld dialogue while in battle
    if (this.worldScene?.dialogueBox) {
      this.worldScene.dialogueBox.close();
    }
    const overworldDlg = document.getElementById('fr-dialogue-box');
    if (overworldDlg) {
      overworldDlg.classList.add('hidden');
    }
    document.getElementById('hud-quick-bar')?.classList.add('hidden');
    document.getElementById('hud')?.classList.add('hidden');
    document.getElementById('overworld-party-hud')?.classList.add('hidden');

    this.container.classList.remove('hidden');

    // Safe BGM Play (wild or trainer theme)
    try {
      soundManager.stopMusic();
      const bgmTrack = battleData.isTrainer ? 'battle_trainer' : 'battle_wild';
      if (bgmManager.play) {
        bgmManager.play(bgmTrack);
      } else if (bgmManager.playForRoom) {
        bgmManager.playForRoom(bgmTrack);
      }
    } catch (e) {
      console.warn('[BattleUI] BGM play failed:', e);
    }

    // Prepare Player Team (up to 6 Pokémon)
    let playerPartyData = Array.isArray(battleData.playerParty) && battleData.playerParty.length > 0
      ? battleData.playerParty
      : [battleData.playerPokemon];

    // Safeguard: Ensure active combatant and each member retain their authentic learned moves
    const activeIdx = typeof battleData.activePlayerIndex === 'number' ? battleData.activePlayerIndex : 0;
    if (playerPartyData[activeIdx] && (!playerPartyData[activeIdx].moves || playerPartyData[activeIdx].moves.length === 0)) {
      if (battleData.playerPokemon?.moves?.length > 0) {
        playerPartyData[activeIdx].moves = battleData.playerPokemon.moves;
      }
    }

    // Prepare Enemy Team (single wild Pokémon or trainer party)
    const enemyPartyData = battleData.isTrainer
      ? (battleData.trainerTeam || [battleData.wildPokemon || battleData.trainerPokemon])
      : [battleData.wildPokemon];

    const canvas = document.getElementById('arena-canvas');
    const hudContainer = document.getElementById('hud-container');

    // Initialize 2D Battle Engine
    const trainerSprite = this.worldScene?.cachedPlayerData?.spriteKey ||
                          this.worldScene?.cachedPlayerData?.sprite ||
                          this.worldScene?.localPlayer?.spriteKey ||
                          'boy_run';

    this.engine = new BattleEngine({
      canvas,
      isTrainer: Boolean(battleData.isTrainer),
      trainerSprite,
      onStateChange: () => this.hud?.update(),
      onLogMessage: (msg, type) => this.hud?.addLog(msg, type),
      onMatchEnd: (outcome, winnerData) => this.handleMatchEnd(outcome, winnerData),
      onPartySwitchRequired: (party, activeIdx) => {
        this.engine?.recallPlayerPokemon(() => {
          this.hud?.showPartySwitchModal(party, activeIdx, true);
        });
      },
      onPokemonDeployed: (mon) => {
        this.hud?.onPlayerPokemonDeployed?.(mon);
      },
    });

    const timePhase = this.worldScene?.dayNightManager?.currentPhase ||
                      (typeof window !== 'undefined' ? window.dayNight?.currentPhase : null);

    this.engine.setupMatchup(playerPartyData, enemyPartyData, {
      isWild: !battleData.isTrainer,
      timePhase,
    });

    // Initialize 2D Battle HUD (Authentic PokéMMO Gen 5 / FireRed UI)
    this.hud = new BattleHud({
      battleEngine: this.engine,
      container: hudContainer,
      worldScene: this.worldScene,
      onSwitchPokemon: (partyIndex) => this.handleSwitchPokemon(partyIndex),
      onRun: () => this.handleRun(),
      onUseItem: (itemId, targetPokemonId) => this.handleUseItem(itemId, targetPokemonId),
    });

    // Resize binding
    if (this._resizeListener) {
      window.removeEventListener('resize', this._resizeListener);
    }
    this._resizeListener = () => {
      if (this.engine && this.isOpen) {
        this.engine.arena.resize();
      }
    };
    window.addEventListener('resize', this._resizeListener);

    // Start Battle Game Loop in Standby / Menu Mode (Pokemon idle at spawn positions until FIGHT is clicked)
    this.engine.start();
  }

  handleUseItem(itemId, targetPokemonId = null) {
    if (!this.isOpen || !this.engine) return;
    const bagUI = this.worldScene?.bagUI || (typeof window !== 'undefined' ? window._bagUI : null);
    const bagItems = bagUI?.inventory || [];
    const slot = bagItems.find(s => s && s.item && s.item.id === itemId);
    const itemName = slot?.item?.name || 'Item';
    const isBall = String(slot?.item?.category || '').toLowerCase() === 'pokeball' || itemName.toLowerCase().includes('ball') || itemName.toLowerCase().includes('bola');

    if (isBall) {
      if (this.battleState?.isTrainer) {
        this.hud?.addLog('⚠️ Não é possível capturar o Pokémon de outro treinador!', 'system');
        return;
      }
      this.hud?.addLog(`🎒 Você arremessou 1x <strong>${itemName}</strong>!`, 'system');
    } else {
      this.hud?.addLog(`🎒 Você usou 1x <strong>${itemName}</strong>!`, 'system');
    }

    SocketClient.emit('battle:action', {
      action: {
        type: 'item',
        itemId,
        targetPokemonId
      }
    });
  }

  handleSwitchPokemon(partyIndex) {
    if (!this.engine) return;
    const switched = this.engine.switchPlayerPokemon(partyIndex);
    if (switched) {
      SocketClient.emit('battle:action', {
        action: { type: 'switch', partyIndex }
      });
    }
  }

  handleRun() {
    if (this.battleState?.isTrainer) {
      this.hud?.addLog('⚠️ Não é possível fugir de uma batalha contra outro treinador!', 'system');
      return;
    }

    const partyHp = this.engine ? this.engine.getPartyHpPayload() : [];
    this.hud?.addLog('💨 Você fugiu da batalha com segurança!', 'system');
    SocketClient.emit('battle:action', {
      action: {
        type: 'run',
        partyHp
      }
    });

    setTimeout(() => {
      this.close();
    }, 600);
  }

  handleMatchEnd(outcome, winnerData) {
    this._lastBattleOutcome = outcome;
    this.hud?.showMatchResult(outcome, winnerData);

    const partyHp = this.engine ? this.engine.getPartyHpPayload() : [];
    // Notify server to conclude and grant EXP, rewards, and persist battle results
    SocketClient.emit('battle:action', {
      action: {
        type: 'conclude',
        winner: outcome === 'victory' ? 'player' : 'opponent',
        partyHp
      }
    });

    // Auto return to overworld after displaying dialog rewards and celebration fanfare
    setTimeout(() => {
      if (this.isOpen) {
        this.close();
      }
    }, 4500);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.battleState = null;

    if (this._resizeListener) {
      window.removeEventListener('resize', this._resizeListener);
      this._resizeListener = null;
    }

    if (this.hud) {
      this.hud.destroy();
      this.hud = null;
    }

    if (this.engine) {
      this.engine.destroy();
      this.engine = null;
    }

    const hudContainer = document.getElementById('hud-container');
    if (hudContainer) {
      hudContainer.innerHTML = '';
    }

    this.container.classList.add('hidden');

    // Notify server that battle view has closed
    SocketClient.emit('battle:exit');

    // Lock wild encounters on this tile so we don't chain-battle on exit
    try { this.worldScene?.notifyBattleExited?.(); } catch (e) { }

    // Overworld-only cinematics queued during battle (evolutions, move learns)
    try { window._evolutionUI?.flushQueue?.(); } catch (e) {}
    try { window._moveLearnUI?.flushQueue?.(); } catch (e) {}

    // Restore ALL overworld HUDs
    document.getElementById('hud-quick-bar')?.classList.remove('hidden');
    document.getElementById('hud')?.classList.remove('hidden');
    document.getElementById('overworld-party-hud')?.classList.remove('hidden');

    // Refresh overworld party & follower data with post-battle health
    SocketClient.emit('pokemon:get_data');

    // Stop any victory or combat fanfare before restoring overworld music
    try {
      soundManager.stopMusic();
    } catch (e) {}

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

    if (this.worldScene) {
      this.worldScene.isTransitioning = false;
    }

    if (this._lastBattleOutcome) {
      const outcome = this._lastBattleOutcome;
      this._lastBattleOutcome = null;
      try {
        this.worldScene?.onBattleFinished?.(outcome);
      } catch (e) {
        console.warn('[BattleUI] Erro em onBattleFinished:', e);
      }
    }
  }
}
