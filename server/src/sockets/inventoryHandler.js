const prisma = require('../database');
const roomManager = require('../rooms/roomManager');

function setupInventoryHandlers(io, socket) {
  // ─── Usar Item do Inventário / Hotbar ───────────────────────────────────────
  socket.on('inventory:use', async (payload) => {
    try {
      const player = roomManager.getPlayer(socket.id);
      if (!player) return;

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

      const item = slot.item;
      let effectMessage = '';
      let updatedPokemon = null;

      // Aplicar efeito conforme o tipo de item
      const itemNameLower = item.name.toLowerCase();

      if (itemNameLower.includes('potion')) {
        const healAmount = itemNameLower.includes('super') ? 50 : 20;
        
        const party = await prisma.pokemon.findMany({
          where: { characterId: player.characterId, isParty: true },
          orderBy: { slot: 'asc' }
        });
        const injuredMon = party.find(p => p.currentHp < p.maxHp) || party[0];

        if (injuredMon) {
          const newHp = Math.min(injuredMon.maxHp, injuredMon.currentHp + healAmount);
          const healed = newHp - injuredMon.currentHp;
          
          updatedPokemon = await prisma.pokemon.update({
            where: { id: injuredMon.id },
            data: { currentHp: newHp }
          });

          effectMessage = `Curou ${healed > 0 ? healed : healAmount} HP de ${injuredMon.name}!`;
        } else {
          effectMessage = `Usou ${item.name}! Recuperou energia do time.`;
        }
      } else if (itemNameLower.includes('ball')) {
        effectMessage = `Você preparou a ${item.name} para arremesso!`;
      } else if (itemNameLower.includes('antidote')) {
        effectMessage = `Usou ${item.name}! O Pokémon foi curado de status negativos.`;
      } else if (itemNameLower.includes('candy')) {
        const leadMon = await prisma.pokemon.findFirst({
          where: { characterId: player.characterId, isParty: true },
          orderBy: { slot: 'asc' }
        });
        if (leadMon) {
          const newLvl = leadMon.level + 1;
          const newMaxHp = leadMon.maxHp + 3;
          updatedPokemon = await prisma.pokemon.update({
            where: { id: leadMon.id },
            data: { level: newLvl, maxHp: newMaxHp, currentHp: newMaxHp }
          });
          effectMessage = `Parabéns! ${leadMon.name} subiu para o Nível ${newLvl}!`;
        } else {
          effectMessage = `Usou ${item.name}! Ganhou experiência instantânea.`;
        }
      } else if (itemNameLower.includes('map')) {
        effectMessage = `Você abriu o Mapa da Região de Kanto.`;
      } else {
        effectMessage = `Usou 1x ${item.name}!`;
      }

      // Decrementar quantidade do item
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
        pokemon: updatedPokemon
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
}

module.exports = setupInventoryHandlers;
