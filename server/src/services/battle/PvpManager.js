const prisma = require('../../database');
const roomManager = require('../../rooms/roomManager');
const pokemonService = require('../pokemonService');

class PvpManager {
  constructor() {
    // Map<targetSocketId, { challengerSocketId, challengerName, challengerCharacterId, timeoutHandle }>
    this.pendingChallenges = new Map();
    // Map<matchId, PvpMatchState>
    this.activeMatches = new Map();
    // Map<characterId, matchId>
    this.characterToMatch = new Map();
  }

  /**
   * Helper: validates if character has at least 1 alive Pokémon in party
   */
  async getAlivePartyPokemon(characterId) {
    const pkmnData = await pokemonService.getCharacterPokemonData(characterId);
    const party = pkmnData?.party || [];
    return party.filter(p => (typeof p.currentHp === 'number' ? p.currentHp : p.maxHp) > 0);
  }

  /**
   * Send a challenge from challenger to target
   */
  async sendChallenge(io, challengerSocket, targetSocketId) {
    const challengerPlayer = roomManager.getPlayer(challengerSocket.id);
    if (!challengerPlayer) {
      throw new Error('Você não está conectado ao mundo.');
    }

    if (challengerSocket.id === targetSocketId) {
      throw new Error('Você não pode desafiar a si mesmo.');
    }

    const targetPlayer = roomManager.getPlayer(targetSocketId);
    if (!targetPlayer) {
      throw new Error('Jogador alvo não encontrado ou desconectado.');
    }

    // Check if either player is already in a match
    if (this.characterToMatch.has(challengerPlayer.characterId)) {
      throw new Error('Você já está em uma batalha PvP.');
    }
    if (this.characterToMatch.has(targetPlayer.characterId)) {
      throw new Error(`${targetPlayer.name} já está em uma batalha PvP.`);
    }

    // Check alive Pokémon requirement
    const challengerAlive = await this.getAlivePartyPokemon(challengerPlayer.characterId);
    if (challengerAlive.length === 0) {
      throw new Error('Você não tem nenhum Pokémon em condições de batalha na sua equipe!');
    }

    const targetAlive = await this.getAlivePartyPokemon(targetPlayer.characterId);
    if (targetAlive.length === 0) {
      throw new Error(`${targetPlayer.name} não possui nenhum Pokémon em condições de batalha na equipe!`);
    }

    // Cancel any previous challenge to target
    if (this.pendingChallenges.has(targetSocketId)) {
      const prev = this.pendingChallenges.get(targetSocketId);
      clearTimeout(prev.timeoutHandle);
      this.pendingChallenges.delete(targetSocketId);
    }

    // 25 second timeout for response
    const timeoutHandle = setTimeout(() => {
      this.pendingChallenges.delete(targetSocketId);
      challengerSocket.emit('pvp:challenge_expired', {
        targetName: targetPlayer.name
      });
      io.to(targetSocketId).emit('pvp:challenge_expired', {
        challengerName: challengerPlayer.name
      });
    }, 25000);

    this.pendingChallenges.set(targetSocketId, {
      challengerSocketId: challengerSocket.id,
      challengerCharacterId: challengerPlayer.characterId,
      challengerName: challengerPlayer.name,
      targetCharacterId: targetPlayer.characterId,
      targetName: targetPlayer.name,
      timeoutHandle
    });

    // Notify target
    io.to(targetSocketId).emit('pvp:challenge_received', {
      challengerSocketId: challengerSocket.id,
      challengerCharacterId: challengerPlayer.characterId,
      challengerName: challengerPlayer.name,
      timeoutSeconds: 25
    });

    return {
      success: true,
      targetName: targetPlayer.name
    };
  }

  /**
   * Cancel an outgoing challenge
   */
  cancelChallenge(io, challengerSocketId) {
    for (const [targetSocketId, challenge] of this.pendingChallenges.entries()) {
      if (challenge.challengerSocketId === challengerSocketId) {
        clearTimeout(challenge.timeoutHandle);
        this.pendingChallenges.delete(targetSocketId);
        io.to(targetSocketId).emit('pvp:challenge_cancelled', {
          challengerName: challenge.challengerName
        });
        return true;
      }
    }
    return false;
  }

  /**
   * Respond to incoming challenge (accept / decline)
   */
  async respondChallenge(io, targetSocket, { challengerSocketId, accepted }) {
    const targetPlayer = roomManager.getPlayer(targetSocket.id);
    if (!targetPlayer) return;

    const challenge = this.pendingChallenges.get(targetSocket.id);
    if (!challenge || challenge.challengerSocketId !== challengerSocketId) {
      return targetSocket.emit('pvp:error', { message: 'Desafio expirado ou não encontrado.' });
    }

    clearTimeout(challenge.timeoutHandle);
    this.pendingChallenges.delete(targetSocket.id);

    const challengerSocket = io.sockets.sockets.get(challengerSocketId);
    if (!challengerSocket) {
      return targetSocket.emit('pvp:error', { message: 'O desafiante se desconectou.' });
    }

    const challengerPlayer = roomManager.getPlayer(challengerSocketId);
    if (!challengerPlayer) {
      return targetSocket.emit('pvp:error', { message: 'O desafiante não está mais no mapa.' });
    }

    if (!accepted) {
      challengerSocket.emit('pvp:challenge_declined', {
        targetName: targetPlayer.name
      });
      targetSocket.emit('pvp:challenge_declined_ack', {
        challengerName: challengerPlayer.name
      });
      return;
    }

    // Both accepted: Verify alive status once more right before starting
    const p1Alive = await this.getAlivePartyPokemon(challengerPlayer.characterId);
    const p2Alive = await this.getAlivePartyPokemon(targetPlayer.characterId);

    if (p1Alive.length === 0 || p2Alive.length === 0) {
      const msg = 'Um dos treinadores não possui Pokémon vivos suficientes.';
      challengerSocket.emit('pvp:error', { message: msg });
      targetSocket.emit('pvp:error', { message: msg });
      return;
    }

    // Start PvP Match!
    await this.startMatch(io, challengerSocket, challengerPlayer, targetSocket, targetPlayer);
  }

  /**
   * Initializes and starts a PvP match between two players
   */
  async startMatch(io, p1Socket, p1Player, p2Socket, p2Player) {
    const matchId = `pvp_${p1Player.characterId}_vs_${p2Player.characterId}_${Date.now()}`;

    const [p1Data, p2Data] = await Promise.all([
      pokemonService.getCharacterPokemonData(p1Player.characterId),
      pokemonService.getCharacterPokemonData(p2Player.characterId)
    ]);

    const p1Party = p1Data?.party || [];
    const p2Party = p2Data?.party || [];

    const p1FirstMon = p1Party.find(p => (typeof p.currentHp === 'number' ? p.currentHp : p.maxHp) > 0) || p1Party[0];
    const p2FirstMon = p2Party.find(p => (typeof p.currentHp === 'number' ? p.currentHp : p.maxHp) > 0) || p2Party[0];

    const matchState = {
      matchId,
      player1: {
        socketId: p1Socket.id,
        characterId: p1Player.characterId,
        name: p1Player.name,
        sprite: p1Player.sprite || 'boy_run',
        level: p1Player.level || 1,
        party: p1Party,
        activePokemon: p1FirstMon,
      },
      player2: {
        socketId: p2Socket.id,
        characterId: p2Player.characterId,
        name: p2Player.name,
        sprite: p2Player.sprite || 'boy_run',
        level: p2Player.level || 1,
        party: p2Party,
        activePokemon: p2FirstMon,
      },
      startTime: new Date(),
      status: 'active'
    };

    this.activeMatches.set(matchId, matchState);
    this.characterToMatch.set(p1Player.characterId, matchId);
    this.characterToMatch.set(p2Player.characterId, matchId);

    // Emit battle:started for Player 1 (challenger sees player1 as self, player2 as enemy)
    p1Socket.emit('battle:started', {
      success: true,
      isPvp: true,
      matchId,
      role: 'player1',
      trainerName: p2Player.name,
      trainerSprite: p2Player.sprite || 'boy_run',
      playerTrainerSprite: p1Player.sprite || 'boy_run',
      playerPokemon: p1FirstMon,
      playerParty: p1Party,
      enemyPokemon: p2FirstMon,
      enemyParty: p2Party,
      arenaKey: 'arena_grass',
    });

    // Emit battle:started for Player 2 (target sees player2 as self, player1 as enemy)
    p2Socket.emit('battle:started', {
      success: true,
      isPvp: true,
      matchId,
      role: 'player2',
      trainerName: p1Player.name,
      trainerSprite: p1Player.sprite || 'boy_run',
      playerTrainerSprite: p2Player.sprite || 'boy_run',
      playerPokemon: p2FirstMon,
      playerParty: p2Party,
      enemyPokemon: p1FirstMon,
      enemyParty: p1Party,
      arenaKey: 'arena_grass',
    });

    console.log(`[PvP] Batalha iniciada: ${p1Player.name} (P1) vs ${p2Player.name} (P2) | Match: ${matchId}`);
  }

  /**
   * Relays real-time combat action (movement, dodge, attack, skill, shield, switch) to opponent
   */
  relayAction(io, socket, actionPayload) {
    const player = roomManager.getPlayer(socket.id);
    if (!player) return;

    const matchId = this.characterToMatch.get(player.characterId);
    if (!matchId) return;

    const match = this.activeMatches.get(matchId);
    if (!match || match.status !== 'active') return;

    const isPlayer1 = match.player1.characterId === player.characterId;
    const opponentSocketId = isPlayer1 ? match.player2.socketId : match.player1.socketId;

    io.to(opponentSocketId).emit('pvp:action_relay', actionPayload);
  }

  /**
   * Completes a PvP match, registers history in database, and updates Pokémon HP in party
   */
  async endMatch(io, characterId, { outcome, finalPlayerParty, finalEnemyParty, isDisconnection = false }) {
    const matchId = this.characterToMatch.get(characterId);
    if (!matchId) return;

    const match = this.activeMatches.get(matchId);
    if (!match) return;

    // Guard against double completion
    if (match.status === 'completed') return;
    match.status = 'completed';

    const isReporterPlayer1 = match.player1.characterId === characterId;

    // Determine winner Character ID
    let winnerId = null;
    if (outcome === 'victory') {
      winnerId = isReporterPlayer1 ? match.player1.characterId : match.player2.characterId;
    } else if (outcome === 'defeat') {
      winnerId = isReporterPlayer1 ? match.player2.characterId : match.player1.characterId;
    }

    // Party state mapping
    const p1PartyState = isReporterPlayer1 ? finalPlayerParty : finalEnemyParty;
    const p2PartyState = isReporterPlayer1 ? finalEnemyParty : finalPlayerParty;

    // Calculate survivors
    const countSurvivors = (party) => {
      if (!Array.isArray(party)) return 0;
      return party.filter(p => (typeof p.currentHp === 'number' ? p.currentHp : p.maxHp) > 0).length;
    };

    const p1Survivors = countSurvivors(p1PartyState || match.player1.party);
    const p2Survivors = countSurvivors(p2PartyState || match.player2.party);

    try {
      // 1. Persist battle history record in database
      await prisma.pvpBattleHistory.create({
        data: {
          player1Id: match.player1.characterId,
          player2Id: match.player2.characterId,
          winnerId,
          player1Level: match.player1.level,
          player2Level: match.player2.level,
          player1Party: JSON.stringify(p1PartyState || match.player1.party || []),
          player2Party: JSON.stringify(p2PartyState || match.player2.party || []),
          player1Survivors: p1Survivors,
          player2Survivors: p2Survivors,
          isDisconnection: Boolean(isDisconnection),
          createdAt: new Date(),
        }
      });
      console.log(`[PvP] Histórico salvo com sucesso para match ${matchId}. Vencedor: ${winnerId}`);

      // 2. Persist damage & faints back to party Pokémon in DB
      if (Array.isArray(p1PartyState)) {
        await this._syncPartyHpToDb(match.player1.characterId, p1PartyState);
      }
      if (Array.isArray(p2PartyState)) {
        await this._syncPartyHpToDb(match.player2.characterId, p2PartyState);
      }

      // 3. Emit updated Pokémon data to both sockets
      const p1Socket = io.sockets.sockets.get(match.player1.socketId);
      if (p1Socket) {
        const freshData = await pokemonService.getCharacterPokemonData(match.player1.characterId);
        p1Socket.emit('pokemon:data_response', { success: true, ...freshData });
      }

      const p2Socket = io.sockets.sockets.get(match.player2.socketId);
      if (p2Socket) {
        const freshData = await pokemonService.getCharacterPokemonData(match.player2.characterId);
        p2Socket.emit('pokemon:data_response', { success: true, ...freshData });
      }

    } catch (err) {
      console.error('[PvP] Erro ao salvar histórico e status pós-batalha:', err);
    } finally {
      // Cleanup match memory
      this.characterToMatch.delete(match.player1.characterId);
      this.characterToMatch.delete(match.player2.characterId);
      this.activeMatches.delete(matchId);
    }
  }

  /**
   * Handles player disconnection during an active match (awards W.O. to other player)
   */
  async handleDisconnect(io, socketId) {
    // Check if player had a pending challenge
    if (this.pendingChallenges.has(socketId)) {
      const challenge = this.pendingChallenges.get(socketId);
      clearTimeout(challenge.timeoutHandle);
      this.pendingChallenges.delete(socketId);
      io.to(challenge.challengerSocketId).emit('pvp:challenge_cancelled', {
        reason: 'Oponente desconectou-se.'
      });
    }

    // Check if player was the challenger in any pending challenge
    for (const [targetSocketId, challenge] of this.pendingChallenges.entries()) {
      if (challenge.challengerSocketId === socketId) {
        clearTimeout(challenge.timeoutHandle);
        this.pendingChallenges.delete(targetSocketId);
        io.to(targetSocketId).emit('pvp:challenge_cancelled', {
          reason: 'Desafiante desconectou-se.'
        });
      }
    }

    // Check if socket was in an active match
    for (const [matchId, match] of this.activeMatches.entries()) {
      if (match.player1.socketId === socketId || match.player2.socketId === socketId) {
        const disconnectedIsP1 = match.player1.socketId === socketId;
        const stayingSocketId = disconnectedIsP1 ? match.player2.socketId : match.player1.socketId;
        const stayingCharId = disconnectedIsP1 ? match.player2.characterId : match.player1.characterId;
        const discoCharId = disconnectedIsP1 ? match.player1.characterId : match.player2.characterId;

        console.log(`[PvP] Jogador desconectou durante batalha PvP. W.O. concedido a socket ${stayingSocketId}`);

        // Notify staying player
        io.to(stayingSocketId).emit('pvp:opponent_disconnected', {
          message: 'Seu oponente se desconectou! Vitória concedida por W.O.'
        });

        await this.endMatch(io, stayingCharId, {
          outcome: 'victory',
          finalPlayerParty: disconnectedIsP1 ? match.player2.party : match.player1.party,
          finalEnemyParty: disconnectedIsP1 ? match.player1.party : match.player2.party,
          isDisconnection: true
        });
        break;
      }
    }
  }

  /**
   * Internal helper: persists HP values of party Pokémon to DB
   */
  async _syncPartyHpToDb(characterId, party) {
    for (const p of party) {
      if (!p || !p.id) continue;
      const curHp = Math.max(0, typeof p.currentHp === 'number' ? p.currentHp : (p.maxHp || 20));
      try {
        await prisma.pokemon.update({
          where: { id: p.id },
          data: { currentHp: curHp }
        });
      } catch (e) {
        console.warn(`[PvP] Falha ao atualizar HP do Pokémon ${p.id}:`, e.message);
      }
    }
  }
}

const pvpManager = new PvpManager();
module.exports = pvpManager;
