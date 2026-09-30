const prisma = require('../database');
const roomManager = require('../rooms/roomManager');
const pokemonProgressionService = require('../services/pokemonProgressionService');
const pokemonService = require('../services/pokemonService');
const itemEffectRegistry = require('../services/items/ItemEffectRegistry');
const battleManager = require('../services/battle/BattleManager');

function setupInventoryHandlers(io, socket) {
  // ─── Usar Item do Inventário / Hotbar ───────────────────────────────────────
  socket.on('inventory:use', async (payload) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

      const activeBattle = battleManager.getSession(player.characterId);
      if (activeBattle && !activeBattle.isEnded) {
        return socket.emit('inventory:used_result', {
          success: false,
          message: 'Você está em batalha! Use os itens pelo menu de combate ou atalho de batalha.'
        });
      }

      const { slotIndex, itemId } = payload;

      // Buscar slot do inventário do personagem
      let slot = null;
      if (typeof slotIndex === 'number') {
        slot = await prisma.inventorySlot.findFirst({
          where: { characterId: player.characterId, slotIndex },
          include: { item: true }
        });
      } else if (itemId) {
        slot = await prisma.inventorySlot.findFirst({
          where: { characterId: player.characterId, itemId },
          include: { item: true }
        });
      }

      if (!slot || slot.quantity <= 0) {
        return socket.emit('inventory:used_result', {
          success: false,
          message: 'Item não encontrado ou esgotado na mochila!'
        });
      }

      const targetPokemonId = payload.pokemonId || payload.targetPokemonId || null;

      const item = slot.item;
      const effectResult = await itemEffectRegistry.applyItemEffect({
        player,
        item,
        targetPokemonId
      });

      if (!effectResult.success) {
        return socket.emit('inventory:used_result', {
          success: false,
          message: effectResult.message || 'Não foi possível usar este item agora.'
        });
      }

      const effectMessage = effectResult.message || `Usou 1x ${item.name}!`;

      // Decrementar quantidade do item se foi consumido
      if (effectResult.consumed !== false) {
        if (slot.quantity > 1) {
          await prisma.inventorySlot.update({
            where: { id: slot.id },
            data: { quantity: slot.quantity - 1 }
          });
        } else {
          await prisma.inventorySlot.delete({
            where: { id: slot.id }
          });
        }
      }

      // Se disparou prompt de evolução
      if (effectResult.evolutionPrompt) {
        socket.emit('pokemon:evolution_eligible', effectResult.evolutionPrompt);
      }

      // Se disparou level up (ex: Rare Candy)
      if (effectResult.levelUpResult) {
        const lvl = effectResult.levelUpResult;
        socket.emit('pokemon:level_up', lvl);

        if (lvl.autoLearnedMoves && lvl.autoLearnedMoves.length > 0) {
          socket.emit('pokemon:move_learned_auto', {
            pokemonId: lvl.pokemon.id,
            moves: lvl.autoLearnedMoves
          });
        }

        if (lvl.pendingPromptMove) {
          socket.emit('pokemon:move_learn_prompt', lvl.pendingPromptMove);
        }

        if (lvl.evolutionEligibility) {
          socket.emit('pokemon:evolution_eligible', {
            pokemonId: lvl.pokemon.id,
            pokemonName: lvl.pokemon.nickname || lvl.pokemon.species.name,
            ...lvl.evolutionEligibility
          });
        }

        if (player.activeBuddy && player.activeBuddy.id === lvl.pokemon.id) {
          player.activeBuddy.level = lvl.newLevel;
          io.to(player.roomId).emit('player:buddy_updated', {
            socketId: socket.id,
            characterId: player.characterId,
            buddy: player.activeBuddy
          });
        }
      }

      // Sincronizar dados de Pokémon com o cliente (atualiza HP no HUD e Equipe)
      const allData = await pokemonService.getCharacterPokemonData(player.characterId);
      socket.emit('pokemon:data_response', { success: true, ...allData });

      // Atualizar dados de Buddy se necessário
      if (player.activeBuddy) {
        const freshBuddy = (allData.party || []).find(p => p.id === player.activeBuddy.id);
        if (freshBuddy) {
          player.activeBuddy.currentHp = freshBuddy.currentHp;
          player.activeBuddy.maxHp = freshBuddy.maxHp;
          player.activeBuddy.level = freshBuddy.level;
          player.activeBuddy.isFainted = freshBuddy.currentHp <= 0;
          io.to(player.roomId).emit('player:buddy_updated', {
            socketId: socket.id,
            characterId: player.characterId,
            buddy: player.activeBuddy
          });
        }
      }

      // Buscar inventário atualizado
      const updatedInventory = await prisma.inventorySlot.findMany({
        where: { characterId: player.characterId },
        include: { item: true },
        orderBy: { slotIndex: 'asc' }
      });

      socket.emit('inventory:update', { inventory: updatedInventory });
      socket.emit('inventory:used_result', {
        success: true,
        itemId: item.id,
        itemName: item.name,
        message: effectMessage,
        pokemon: effectResult.updatedPokemon || null
      });

    } catch (err) {
      console.error('Error on inventory:use:', err);
      socket.emit('inventory:used_result', {
        success: false,
        message: 'Erro ao utilizar o item.'
      });
    }
  });

  // ─── Reordenar / Trocar Slots (Drag and Drop) ──────────────────────────────
  socket.on('inventory:swap', async ({ fromSlot, toSlot }) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;
      if (typeof fromSlot !== 'number' || typeof toSlot !== 'number' || fromSlot === toSlot) return;

      const slotA = await prisma.inventorySlot.findFirst({
        where: { characterId: player.characterId, slotIndex: fromSlot }
      });
      const slotB = await prisma.inventorySlot.findFirst({
        where: { characterId: player.characterId, slotIndex: toSlot }
      });

      if (slotA && slotB) {
        // Usar índice temporário para evitar colisão de unique constraint
        await prisma.inventorySlot.update({
          where: { id: slotA.id },
          data: { slotIndex: -999 }
        });
        await prisma.inventorySlot.update({
          where: { id: slotB.id },
          data: { slotIndex: fromSlot }
        });
        await prisma.inventorySlot.update({
          where: { id: slotA.id },
          data: { slotIndex: toSlot }
        });
      } else if (slotA && !slotB) {
        await prisma.inventorySlot.update({
          where: { id: slotA.id },
          data: { slotIndex: toSlot }
        });
      }

      const updatedInventory = await prisma.inventorySlot.findMany({
        where: { characterId: player.characterId },
        include: { item: true },
        orderBy: { slotIndex: 'asc' }
      });

      socket.emit('inventory:update', { inventory: updatedInventory });
    } catch (err) {
      console.error('Error on inventory:swap:', err);
    }
  });

  // ─── Atualizar Equipamentos do Personagem ─────────────────────────────────
  socket.on('equipment:update', async ({ equipment }) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

      const characterService = require('../services/characterService');
      const updated = await characterService.updateCharacterEquipment(player.characterId, equipment);

      socket.emit('equipment:updated', { equipment: updated.equipment });
    } catch (err) {
      console.error('Error on equipment:update:', err);
    }
  });
}

module.exports = setupInventoryHandlers;
