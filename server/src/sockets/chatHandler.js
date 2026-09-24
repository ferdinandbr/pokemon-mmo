const roomManager = require('../rooms/roomManager');
const worldService = require('../services/worldService');
const pokemonService = require('../services/pokemonService');
const characterService = require('../services/characterService');

function setupChatHandlers(io, socket) {
  socket.on('chat:send', async (payload) => {
    const player = roomManager.getPlayer(socket.id);
    if (!player) return;

    let { message, channel = 'room', target = null } = payload;
    if (!message || typeof message !== 'string') return;

    message = message.trim();
    if (message.length === 0 || message.length > 200) return;

    // Check if message begins with /w or /whisper (regular player whisper)
    if (message.startsWith('/w ') || message.startsWith('/whisper ')) {
      const parts = message.split(' ');
      if (parts.length >= 3) {
        channel = 'whisper';
        target = parts[1];
        message = parts.slice(2).join(' ');
      } else {
        return socket.emit('chat:message', {
          channel: 'system',
          sender: 'Sistema',
          text: 'Uso correto do sussurro: /w <nome_do_jogador> <mensagem>',
          timestamp: new Date().toISOString()
        });
      }
    } else if (message.startsWith('/')) {
      // Server-Authoritative Admin Commands
      const isAdmin = (player.role === 'admin') || (socket.user?.role === 'admin');
      if (!isAdmin) {
        return socket.emit('chat:message', {
          channel: 'system',
          sender: 'Sistema',
          text: '⛔ Acesso negado: apenas administradores podem executar comandos no servidor.',
          timestamp: new Date().toISOString()
        });
      }

      const lower = message.toLowerCase();

      // Command: /gold <quantia> [jogador] or /givemoney <quantia> [jogador]
      if (lower.startsWith('/gold') || lower.startsWith('/givemoney') || lower.startsWith('/money')) {
        const parts = message.split(' ').filter(p => p.trim().length > 0);
        if (parts.length >= 2) {
          const amount = parseInt(parts[1]);
          if (!isNaN(amount)) {
            let targetPlayer = player;
            let targetSocket = socket;
            if (parts[2]) {
              const found = roomManager.getPlayerByCharacterName(parts[2]);
              if (found) {
                targetPlayer = found;
                targetSocket = io.sockets.sockets.get(found.socketId) || socket;
              }
            }

            try {
              const updatedChar = await characterService.addCharacterMoney(targetPlayer.characterId, amount);
              targetSocket.emit('money:updated', { money: updatedChar.money });
              targetSocket.emit('chat:message', {
                channel: 'system',
                sender: 'Sistema',
                text: `💰 [Admin] Saldo de dinheiro atualizado: ${updatedChar.money.toLocaleString('pt-BR')} Pokédólares (+${amount.toLocaleString('pt-BR')})`,
                timestamp: new Date().toISOString()
              });

              if (targetPlayer !== player) {
                socket.emit('chat:message', {
                  channel: 'system',
                  sender: 'Sistema',
                  text: `💰 [Admin] Adicionado ${amount.toLocaleString('pt-BR')} Pokédólares para ${targetPlayer.name}. Novo saldo: ${updatedChar.money.toLocaleString('pt-BR')}`,
                  timestamp: new Date().toISOString()
                });
              }
            } catch (err) {
              socket.emit('chat:message', {
                channel: 'system',
                sender: 'Sistema',
                text: `❌ Erro ao atualizar dinheiro: ${err.message}`,
                timestamp: new Date().toISOString()
              });
            }
            return;
          }
        }
        return socket.emit('chat:message', {
          channel: 'system',
          sender: 'Sistema',
          text: 'Uso correto: /gold <quantia> [nome_jogador]',
          timestamp: new Date().toISOString()
        });
      }

      // Command: /spawn <id_ou_nome> [level] [shiny] [box/party]
      if (lower.startsWith('/spawn')) {
        const parts = message.split(' ').filter(p => p.trim().length > 0);
        if (parts.length >= 2) {
          const speciesInput = parts[1];
          let level = 5;
          let isShiny = null;
          let targetLocation = null;

          for (let i = 2; i < parts.length; i++) {
            const p = parts[i].toLowerCase();
            if (!isNaN(parseInt(p))) {
              level = Math.max(1, Math.min(100, parseInt(p)));
            } else if (p === 'shiny' || p === '1' || p === 'true') {
              isShiny = true;
            } else if (p === 'box' || p === 'pc' || p === 'storage' || p === 'caixa') {
              targetLocation = 'storage';
            } else if (p === 'party' || p === 'equipe' || p === 'time') {
              targetLocation = 'party';
            }
          }

          try {
            const newPokemon = await pokemonService.createPokemon({
              characterId: player.characterId,
              speciesIdOrName: speciesInput,
              level,
              isShiny,
              forceBuddy: targetLocation !== 'storage',
              targetLocation
            });

            const formattedId = String(newPokemon.speciesId).padStart(3, '0');

            if (newPokemon.isBuddy) {
              // Update player runtime state in roomManager
              player.activeBuddy = {
                id: newPokemon.id,
                speciesId: newPokemon.speciesId,
                name: newPokemon.nickname || newPokemon.species.name,
                level: newPokemon.level,
                isShiny: newPokemon.isShiny,
                sprite: `${formattedId}.png`
              };

              // Notify everyone in room about updated active buddy
              io.to(player.roomId).emit('player:buddy_updated', {
                socketId: socket.id,
                characterId: player.characterId,
                buddy: player.activeBuddy
              });
            }

            // Send system chat response to player
            const shinyStr = newPokemon.isShiny ? ' ★ SHINY' : '';
            const locationStr = newPokemon.location === 'party'
              ? `à sua Equipe Principal (Slot ${newPokemon.partySlot + 1}/6)`
              : `ao seu Armazenamento (Caixa ${newPokemon.boxNumber} - Slot ${newPokemon.boxSlot + 1}/30)`;

            socket.emit('chat:message', {
              channel: 'system',
              sender: 'Sistema',
              text: `✨ [Spawn] ${newPokemon.species.name} (Lv. ${newPokemon.level}${shinyStr}) adicionado ${locationStr}! Abra o Gerenciador (tecla 'P' ou botão da Pokebola) para gerenciar.`,
              timestamp: new Date().toISOString()
            });

            // Emit updated pokemon data to player UI
            const allData = await pokemonService.getCharacterPokemonData(player.characterId);
            socket.emit('pokemon:data_response', { success: true, ...allData });
            socket.emit('equipment:updated', { equipment: { buddy: player.activeBuddy } });
          } catch (err) {
            socket.emit('chat:message', {
              channel: 'system',
              sender: 'Sistema',
              text: `❌ Erro ao invocar Pokémon: ${err.message}`,
              timestamp: new Date().toISOString()
            });
          }
          return;
        } else {
          return socket.emit('chat:message', {
            channel: 'system',
            sender: 'Sistema',
            text: 'Uso correto do comando: /spawn <numero_ou_nome> [nivel] [shiny]',
            timestamp: new Date().toISOString()
          });
        }
      }

      const weatherMap = {
        '/chuva': 'rain', '/rain': 'rain',
        '/tempestade': 'storm', '/storm': 'storm',
        '/neve': 'snow', '/snow': 'snow',
        '/nevoa': 'fog', '/fog': 'fog',
        '/sol': 'sunny', '/sunny': 'sunny',
        '/areia': 'sandstorm', '/sandstorm': 'sandstorm',
        '/limpo': 'clear', '/clear': 'clear'
      };

      if (weatherMap[lower]) {
        const type = weatherMap[lower];
        worldService.setWeather(type);
        io.emit('chat:message', {
          channel: 'system',
          sender: 'Servidor',
          text: `🌦️ [Clima Global] ${player.name} alterou o clima do servidor para ${type.toUpperCase()}!`,
          timestamp: new Date().toISOString()
        });
        return;
      }

      if (lower.startsWith('/clima ') || lower.startsWith('/weather ')) {
        const type = lower.split(' ')[1];
        if (worldService.setWeather(type)) {
          io.emit('chat:message', {
            channel: 'system',
            sender: 'Servidor',
            text: `🌦️ [Clima Global] ${player.name} alterou o clima do servidor para ${type.toUpperCase()}!`,
            timestamp: new Date().toISOString()
          });
        }
        return;
      }

      return socket.emit('chat:message', {
        channel: 'system',
        sender: 'Sistema',
        text: `Comando desconhecido: "${message}". Digite /spawn, /clima ou /gold.`,
        timestamp: new Date().toISOString()
      });
    }

    const timestamp = new Date().toISOString();

    if (channel === 'whisper') {
      if (!target) {
        return socket.emit('chat:message', {
          channel: 'system',
          sender: 'Sistema',
          text: 'Destinatário do sussurro não especificado.',
          timestamp
        });
      }

      const targetPlayer = roomManager.getPlayerByCharacterName(target);
      if (!targetPlayer) {
        return socket.emit('chat:message', {
          channel: 'system',
          sender: 'Sistema',
          text: `O jogador "${target}" não está online.`,
          timestamp
        });
      }

      const whisperPayload = {
        channel: 'whisper',
        sender: player.name,
        target: targetPlayer.name,
        text: message,
        timestamp
      };

      // Send to target
      io.to(targetPlayer.socketId).emit('chat:message', whisperPayload);

      // Send back to sender for confirmation
      socket.emit('chat:message', whisperPayload);
      return;
    }

    if (channel === 'global') {
      // Global chat
      io.emit('chat:message', {
        channel: 'global',
        sender: player.name,
        text: message,
        timestamp
      });
      return;
    }

    // Default: Room chat
    io.to(player.roomId).emit('chat:message', {
      channel: 'room',
      sender: player.name,
      senderSocketId: socket.id,
      text: message,
      roomId: player.roomId,
      timestamp
    });
  });
}

module.exports = setupChatHandlers;
