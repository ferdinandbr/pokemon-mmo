const roomManager = require('../rooms/roomManager');
const battleManager = require('../services/battle/BattleManager');
const pokemonService = require('../services/pokemonService');
const playerProgressionService = require('../services/player/PlayerProgressionService');
const prisma = require('../database');

function setupBattleHandlers(io, socket) {
  // ─── 1. Trigger Wild Encounter (Step on Tall Grass) ──────────────────────
  socket.on('battle:wild_trigger', async () => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) {
        console.warn(`[Battle] Socket ${socket.id} não possui player ativo em roomManager.`);
        return socket.emit('battle:start_failed', { message: 'Personagem não conectado à sala.' });
      }

      console.log(`[Battle] Iniciando wild battle para personagem ${player.name} (id: ${player.characterId}) no mapa ${player.roomId}`);
      const battleState = await battleManager.startWildBattle(player.characterId, {
        roomId: player.roomId,
        playerName: player.name
      });

      socket.emit('battle:started', {
        success: true,
        ...battleState
      });
      console.log(`[Battle] battle:started emitido com sucesso para ${player.name} vs ${battleState.wildPokemon?.name}`);
    } catch (err) {
      console.warn('[Battle Socket Warning battle:wild_trigger]:', err.message);
      socket.emit('battle:start_failed', { message: err.message });
    }
  });

  // ─── 2. Execute Action (Fight, Bag, Switch, Run) ──────────────────────────
  socket.on('battle:action', async (payload) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      const { action } = payload || {};
      if (!action || !action.type) return;

      const session = battleManager.getSession(player.characterId);
      if (!session || session.isEnded) {
        return socket.emit('battle:action_error', { message: 'Nenhuma batalha ativa no momento.' });
      }
      if (session.isProcessingTurn) {
        return socket.emit('battle:action_error', { message: 'Aguarde o término do seu turno!' });
      }

      const turnResult = await battleManager.executeTurn(player.characterId, action);

      socket.emit('battle:turn_result', {
        success: true,
        ...turnResult
      });

      // Se usou um item, emitir inventário atualizado em tempo real
      if (action.type === 'item') {
        const updatedInventory = await prisma.inventorySlot.findMany({
          where: { characterId: player.characterId },
          include: { item: true },
          orderBy: { slotIndex: 'asc' }
        });
        socket.emit('inventory:update', { inventory: updatedInventory });
      }

      // If battle ended (victory, run, catch, blackout), sync player party data & character progress
      if (turnResult.battleEnded) {
        const allData = await pokemonService.getCharacterPokemonData(player.characterId);
        socket.emit('pokemon:data_response', { success: true, ...allData });

        if (player.activeBuddy) {
          const freshBuddy = (allData.party || []).find(p => p.id === player.activeBuddy.id)
            || (allData.storage || []).find(p => p.id === player.activeBuddy.id);
          if (freshBuddy) {
            player.activeBuddy.currentHp = freshBuddy.currentHp;
            player.activeBuddy.maxHp = freshBuddy.maxHp;
            player.activeBuddy.isFainted = freshBuddy.currentHp <= 0;
            io.to(player.roomId).emit('player:buddy_updated', {
              socketId: socket.id,
              characterId: player.characterId,
              buddy: player.activeBuddy
            });
          }
        }

        const progress = await playerProgressionService.getPlayerProgress(player.characterId);
        if (progress) {
          socket.emit('character:progress_update', progress);
        }

        // Se houver Pokémon que atingiu nível de evolução pós-batalha, disparar tela de evolução
        if (Array.isArray(turnResult.events)) {
          for (const ev of turnResult.events) {
            if (ev.type === 'evolution_eligible') {
              socket.emit('pokemon:evolution_eligible', {
                pokemonId: ev.pokemonId,
                pokemonName: ev.pokemonName,
                targetSpeciesId: ev.targetSpeciesId,
                targetSpeciesName: ev.targetSpeciesName,
                method: ev.method
              });
            }
          }
        }
      }
    } catch (err) {
      console.error('[Battle Socket Error battle:action]:', err);
      socket.emit('battle:action_error', { message: err.message });
    }
  });

  // ─── 3. Quick Item Hotkey Triggered in Battle ────────────────────────────
  socket.on('battle:quick_item', async (payload) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

      const session = battleManager.getSession(player.characterId);
      if (!session || session.isEnded) {
        return socket.emit('battle:action_error', { message: 'Nenhuma batalha ativa no momento.' });
      }
      if (session.isProcessingTurn) {
        return socket.emit('battle:action_error', { message: 'Aguarde o término do seu turno!' });
      }

      const { itemId, itemName, slotNumber, slotIndex } = payload || {};

      let targetItemId = itemId;

      // Find available items in player's inventory
      const invSlots = await prisma.inventorySlot.findMany({
        where: { characterId: player.characterId },
        include: { item: true }
      });

      let matchedSlot = null;
      if (targetItemId) {
        matchedSlot = invSlots.find(s => s.itemId === targetItemId);
      }
      if (!matchedSlot && itemName) {
        matchedSlot = invSlots.find(s => s.item && s.item.name.toLowerCase() === itemName.toLowerCase());
      }
      if (!matchedSlot && typeof slotIndex === 'number') {
        matchedSlot = invSlots.find(s => s.slotIndex === slotIndex);
      }

      if (!matchedSlot) {
        return socket.emit('battle:action_error', {
          message: itemName ? `Você não possui ${itemName} na mochila!` : 'Item do atalho rápido não encontrado na mochila!'
        });
      }

      const turnResult = await battleManager.executeTurn(player.characterId, {
        type: 'item',
        itemId: matchedSlot.itemId
      });

      socket.emit('battle:turn_result', {
        success: true,
        ...turnResult
      });

      // Emitir inventário atualizado após consumo do item rápido
      const updatedInventory = await prisma.inventorySlot.findMany({
        where: { characterId: player.characterId },
        include: { item: true },
        orderBy: { slotIndex: 'asc' }
      });
      socket.emit('inventory:update', { inventory: updatedInventory });

      if (turnResult.battleEnded) {
        const allData = await pokemonService.getCharacterPokemonData(player.characterId);
        socket.emit('pokemon:data_response', { success: true, ...allData });

        if (player.activeBuddy) {
          const freshBuddy = (allData.party || []).find(p => p.id === player.activeBuddy.id)
            || (allData.storage || []).find(p => p.id === player.activeBuddy.id);
          if (freshBuddy) {
            player.activeBuddy.currentHp = freshBuddy.currentHp;
            player.activeBuddy.maxHp = freshBuddy.maxHp;
            player.activeBuddy.isFainted = freshBuddy.currentHp <= 0;
            io.to(player.roomId).emit('player:buddy_updated', {
              socketId: socket.id,
              characterId: player.characterId,
              buddy: player.activeBuddy
            });
          }
        }

        const progress = await playerProgressionService.getPlayerProgress(player.characterId);
        if (progress) {
          socket.emit('character:progress_update', progress);
        }

        if (Array.isArray(turnResult.events)) {
          for (const ev of turnResult.events) {
            if (ev.type === 'evolution_eligible') {
              socket.emit('pokemon:evolution_eligible', {
                pokemonId: ev.pokemonId,
                pokemonName: ev.pokemonName,
                targetSpeciesId: ev.targetSpeciesId,
                targetSpeciesName: ev.targetSpeciesName,
                method: ev.method
              });
            }
          }
        }
      }
    } catch (err) {
      console.error('[Battle Socket Error battle:quick_item]:', err);
      socket.emit('battle:action_error', { message: err.message });
    }
  });
}

module.exports = setupBattleHandlers;
