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

    if (typeof window !== 'undefined') {
      window._activeBattleUI = this;
      window._startTestBattle = (playerSpecies = 6, enemySpecies = 131) => {
        this.open({
          isTrainer: false,
          playerPokemon: { speciesId: playerSpecies, level: 35 },
          playerParty: [{ speciesId: playerSpecies, level: 35 }],
          enemyPokemon: { speciesId: enemySpecies, level: 30 },
          enemyParty: [{ speciesId: enemySpecies, level: 30 }],
        });
      };
    }
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

    // PvP Opponent Action Relay
    SocketClient.on('pvp:action_relay', (actionPayload) => {
      if (!_isActiveBattleInstance(this)) return;
      if (this.engine && this.engine.isPvp) {
        this.engine.handleOpponentAction(actionPayload);
      }
    });

    // PvP Opponent Disconnected (Victory by W.O.)
    SocketClient.on('pvp:opponent_disconnected', (data) => {
      if (!_isActiveBattleInstance(this)) return;
      this.hud?.addLog(`🏆 ${data?.message || 'Oponente desconectou-se. Vitória concedida por W.O.!'}`, 'victory');
      if (this.engine) {
        this.engine.battleEnded = true;
        this.handleMatchEnd('victory', this.engine?.playerEntity?.data);
      }
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

    // Reset container DOM to guarantee fresh canvas, loading overlay and hud
    if (this.container) {
      this.container.innerHTML = `
        <div class="arena-container" id="arena-container">
          <canvas id="arena-canvas"></canvas>
          <div class="arena-loading-overlay" id="arena-loading-overlay">
            <div class="arena-loading-card">
              <div class="arena-loading-pokeball"></div>
              <div class="arena-loading-text">CARREGANDO ARENA...</div>
              <div class="arena-loading-sub">Preparando terreno e atmosfera de batalha</div>
            </div>
          </div>
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

    // Prepare Enemy Team (single wild Pokémon, trainer party, or PvP party)
    const enemyPartyData = battleData.isPvp
      ? (Array.isArray(battleData.enemyParty) && battleData.enemyParty.length > 0
          ? battleData.enemyParty
          : (battleData.enemyPokemon ? [battleData.enemyPokemon] : []))
      : (battleData.isTrainer
          ? (battleData.trainerTeam || (battleData.wildPokemon || battleData.trainerPokemon ? [battleData.wildPokemon || battleData.trainerPokemon] : []))
          : (battleData.wildPokemon ? [battleData.wildPokemon] : []));

    const canvas = document.getElementById('arena-canvas');
    const hudContainer = document.getElementById('hud-container');

    // Initialize 2D Battle Engine
    const trainerSprite = this.worldScene?.cachedPlayerData?.spriteKey ||
                          this.worldScene?.cachedPlayerData?.sprite ||
                          this.worldScene?.localPlayer?.spriteKey ||
                          battleData.playerTrainerSprite ||
                          'boy_run';

    const rivalTrainerSprite = battleData.trainerSprite || 'boy_run';
    const rivalTrainerName = battleData.trainerName || 'Rival';

    this.engine = new BattleEngine({
      canvas,
      isTrainer: Boolean(battleData.isTrainer || battleData.isPvp),
      trainerSprite,
      rivalTrainerSprite,
      rivalTrainerName,
      isPvp: Boolean(battleData.isPvp),
      onPvpAction: (action) => {
        SocketClient.emit('pvp:action_relay', action);
      },
      onStateChange: () => this.hud?.update(),
      onLogMessage: (msg, type, ent) => this.hud?.addLog(msg, type, ent),
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

    const arenaKey = battleData.arena || battleData.arenaKey || 'arena_grass';

    const weather = battleData.weather ||
                    this.worldScene?.weatherManager?.currentWeather ||
                    (typeof window !== 'undefined' ? window.weather?.currentWeather : null) ||
                    'clear';

    this.engine.setupMatchup(playerPartyData, enemyPartyData, {
      isWild: !battleData.isTrainer && !battleData.isPvp,
      timePhase,
      weather,
      arenaKey,
    });

    // Dismiss arena loading overlay smoothly once tilemap is built
    const hideLoading = () => {
      const loader = document.getElementById('arena-loading-overlay');
      if (loader && !loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 320);
      }
    };
    if (this.engine?.arena?.mapLoaded) {
      setTimeout(hideLoading, 100);
    } else if (this.engine?.arena) {
      this.engine.arena.onMapReady = hideLoading;
      setTimeout(hideLoading, 1200);
    }

    // Initialize 2D Battle HUD (Authentic PokéMMO Gen 5 / FireRed UI)
    this.hud = new BattleHud({
      battleEngine: this.engine,
      container: hudContainer,
      worldScene: this.worldScene,
      onSwitchPokemon: (partyIndex) => this.handleSwitchPokemon(partyIndex),
      onRun: () => this.handleRun(),
      onFinish: () => this.close(),
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

    if (battleData.isPvp) {
      // In PvP, open team selection modal for 5 seconds so player can choose starter Pokemon
      this.hud?.switchSubMenu('team');
      this.engine?.setCombatActive(false);
      if (this.engine) this.engine.isCountdownActive = true;

      this.hud?.startPreBattleCountdown(5, () => {
        if (this.engine) {
          this.engine.isCountdownActive = false;

          // If player hasn't deployed a Pokémon yet and none is in flight, deploy default 1st conscious party member
          if (!this.engine.playerEntity && !this.engine.activePokeball && !this.engine._hasPlayerChosenStarter) {
            const firstConscious = this.engine.playerParty.findIndex(
              p => p && (typeof p.currentHp === 'number' ? p.currentHp : p.maxHp) > 0 && !p.isFainted
            );
            const idx = firstConscious >= 0 ? firstConscious : 0;
            this.engine.deployPlayerPokemon(idx);
            if (this.engine.onPvpAction) {
              this.engine.onPvpAction({ type: 'switch', partyIndex: idx });
            }
          }

          // If enemy entity hasn't spawned yet and rival hasn't thrown pokeball or chosen yet, deploy default
          if (!this.engine.enemyEntity && !this.engine.activeEnemyPokeball && !this.engine._hasEnemyChosenStarter && this.engine.enemyParty && this.engine.enemyParty.length > 0) {
            this.engine.switchEnemyPokemon(0);
          }

          this.engine.setCombatActive(true);
        }

        // Force team modal and backdrop to close
        const teamModal = document.getElementById('battle-team-action-panel');
        const backdrop = document.getElementById('battle-modal-backdrop');
        teamModal?.classList.add('hidden');
        backdrop?.classList.add('hidden');

        this.hud?.switchSubMenu('fight');
        this.hud?.addLog('⚔️ <strong>A BATALHA COMEÇOU!</strong>', 'system');
      });
    } else if (!this.engine.playerEntity) {
      // In PvE (Wild or Trainer): Start at the main command choices menu (FIGHT, BAG, POKEMON, RUN)
      this.hud?.switchSubMenu('main');
      this.engine?.setCombatActive(false);
    }
  }

  handleUseItem(itemId, targetPokemonId = null) {
    if (!this.isOpen || !this.engine) return;
    const bagUI = this.worldScene?.bagUI || (typeof window !== 'undefined' ? window._bagUI : null);
    const bagItems = bagUI?.inventory || [];
    const slot = bagItems.find(s => s && s.item && s.item.id === itemId);
    const itemName = slot?.item?.name || 'Item';
    const isBall = String(slot?.item?.category || '').toLowerCase() === 'pokeball' || itemName.toLowerCase().includes('ball') || itemName.toLowerCase().includes('bola');

    if (this.battleState?.isPvp) {
      const isPotion = !isBall && (
        String(slot?.item?.category || '').toLowerCase() === 'medicine' ||
        itemName.toLowerCase().includes('potion') ||
        itemName.toLowerCase().includes('poção') ||
        itemName.toLowerCase().includes('pocao')
      ) && !itemName.toLowerCase().includes('revive');

      if (!isPotion) {
        this.hud?.addLog('⚠️ Durante duelos PvP, outros itens estão vetados por hora! Apenas Poções são permitidas.', 'system');
        return;
      }
    }

    if (isBall) {
      if (this.battleState?.isTrainer || this.battleState?.isPvp) {
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
    if (this.battleState?.isPvp) {
      // PvP Rule: Run triggers instant forfeit / defeat
      this.hud?.addLog('🏳️ Você desistiu do duelo PvP! Derrota aplicada por rendição.', 'system');

      // Send instant defeat relay to opponent so they get victory celebration immediately
      if (this.engine && this.engine.onPvpAction) {
        this.engine.onPvpAction({ type: 'pvp_match_defeat' });
      }

      if (this.engine) {
        this.engine.battleEnded = true;
      }

      this.handleMatchEnd('defeat', this.engine?.enemyEntity?.data);
      return;
    }

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

    if (this.battleState?.isPvp) {
      // In PvP, send full party states to PvpManager to save battle history and persist HP
      const finalPlayerParty = this.engine?.playerParty || [];
      const finalEnemyParty = this.engine?.enemyParty || [];

      SocketClient.emit('pvp:match_completed', {
        matchId: this.battleState.matchId,
        outcome,
        finalPlayerParty,
        finalEnemyParty,
        isDisconnection: false
      });

      this._pendingExpGains = [];
      this._pendingBattleSummary = null;
    } else {
      // Notify server to conclude and grant EXP, rewards, and persist battle results for PvE
      SocketClient.emit('battle:action', {
        action: {
          type: 'conclude',
          winner: outcome === 'victory' ? 'player' : 'opponent',
          partyHp
        }
      });

      // Collect EXP gains to broadcast and display in Overworld
      const enemyMon = this.engine?.enemyEntity?.data;
      const playerMon = this.engine?.playerEntity?.data;
      const pName = playerMon?.name || 'Seu Pokémon';
      const lvl = enemyMon?.level || 5;
      const baseExp = enemyMon?.baseExp || 64;
      const pokeExp = Math.max(6, Math.floor(((baseExp * lvl) / 7) * 1.5));
      const trainerExp = Math.max(10, Math.floor(lvl * 18));
      const gold = Math.max(20, Math.floor(lvl * 35));

      this._pendingExpGains = [
        { slotIndex: this.engine?.activePlayerIndex || 0, exp: pokeExp, name: pName }
      ];
      this._pendingBattleSummary = {
        pokeExp,
        trainerExp,
        gold,
        pName,
        outcome
      };
    }

    // User requirement: "quando finalizar a batalha não quero um timer para sair e sim esperar o clique do jogador"
    // Wait for player to click either the finish button or the combat ticker/dialogue box, or press ESC
    const finishBtn = document.getElementById('btn-result-finish');
    if (finishBtn) {
      finishBtn.onclick = () => {
        if (this.isOpen) this.close();
      };
    }

    const tickerBanner = document.getElementById('combat-ticker-banner');
    if (tickerBanner) {
      tickerBanner.style.cursor = 'pointer';
      tickerBanner.onclick = () => {
        if (this.isOpen) this.close();
      };
    }

    if (this._matchEndedKeyHandler) {
      window.removeEventListener('keydown', this._matchEndedKeyHandler);
    }
    this._matchEndedKeyHandler = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.code === 'Escape' || e.code === 'Enter') {
        if (this.isOpen) this.close();
      }
    };
    window.addEventListener('keydown', this._matchEndedKeyHandler);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.battleState = null;

    if (this._matchEndedKeyHandler) {
      window.removeEventListener('keydown', this._matchEndedKeyHandler);
      this._matchEndedKeyHandler = null;
    }

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

    // Broadcast battle result summary to System Chat
    if (this._pendingBattleSummary && typeof window !== 'undefined' && window._chatUI) {
      const summary = this._pendingBattleSummary;
      if (summary.outcome === 'victory') {
        window._chatUI.addSystemMessage(
          `🎉 Vitória! +${summary.pokeExp} EXP para ${summary.pName} | +${summary.trainerExp} EXP de Treinador | +$${summary.gold}!`
        );
      }
      this._pendingBattleSummary = null;
    }

    // Trigger floating +XP gain animation on the overworld Party HUD
    if (this._pendingExpGains && this._pendingExpGains.length > 0) {
      const partyHUDUI = this.worldScene?.partyHUDUI || (typeof window !== 'undefined' ? window._partyHUDUI : null);
      if (partyHUDUI && typeof partyHUDUI.showXpGains === 'function') {
        setTimeout(() => {
          partyHUDUI.showXpGains(this._pendingExpGains);
          this._pendingExpGains = null;
        }, 350);
      }
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
