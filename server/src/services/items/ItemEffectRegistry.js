const prisma = require('../../database');
const pokemonProgressionService = require('../pokemonProgressionService');
const evolutionManager = require('../evolution/EvolutionManager');
const friendshipManager = require('../evolution/FriendshipManager');

class ItemEffectRegistry {
  /**
   * Executa o efeito de um item fora ou dentro de batalha.
   * @param {Object} params
   * @param {Object} params.player
   * @param {Object} params.item
   * @param {number} [params.targetPokemonId]
   * @returns {Promise<Object>} Resultado da aplicação do item { success, message, updatedPokemon, evolutionPrompt }
   */
  async applyItemEffect({ player, item, targetPokemonId = null }) {
    const characterId = player.characterId;
    const nameLower = (item.name || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();

    // 1. Obter Pokémon Alvo
    let targetMon = null;
    const party = await prisma.pokemon.findMany({
      where: { characterId, location: 'party' },
      include: { species: true },
      orderBy: { partySlot: 'asc' }
    });

    if (targetPokemonId) {
      targetMon = party.find(p => p.id === Number(targetPokemonId)) ||
        await prisma.pokemon.findFirst({ where: { id: Number(targetPokemonId), characterId }, include: { species: true } });
    }

    // 1.1 Pokébolas fora de batalha
    if (cat === 'pokeball' || nameLower.endsWith('ball') || nameLower.endsWith('bola')) {
      return {
        success: false,
        consumed: false,
        message: 'Pokébolas só podem ser usadas durante uma batalha para capturar Pokémon selvagens!'
      };
    }

    // 2. Pedras Evolutivas & Itens de Evolução
    if (cat === 'evolution_stone' || nameLower.includes('stone') || nameLower.includes('scale') || nameLower.includes('coat')) {
      const cleanInternalName = item.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      
      // Se não especificou alvo, procurar o primeiro na party compatível
      const candidateList = targetMon ? [targetMon] : party;
      let matchedCandidate = null;
      let evoCheck = null;

      for (const cand of candidateList) {
        const check = await evolutionManager.checkEvolutionEligibility(cand, {
          trigger: 'item',
          itemInternalName: cleanInternalName
        });
        if (check && check.canEvolve) {
          matchedCandidate = cand;
          evoCheck = check;
          break;
        }
      }

      if (!matchedCandidate || !evoCheck) {
        return {
          success: false,
          consumed: false,
          message: `Nenhum Pokémon da equipe é compatível com ${item.name}!`
        };
      }

      return {
        success: true,
        consumed: true,
        evolutionPrompt: {
          pokemonId: matchedCandidate.id,
          pokemonName: matchedCandidate.nickname || matchedCandidate.species.name,
          currentSpeciesName: matchedCandidate.species.name,
          targetSpeciesId: evoCheck.targetSpecies.id,
          targetSpeciesName: evoCheck.targetSpecies.name,
          method: evoCheck.method
        },
        message: `${item.name} irradiou uma luz misteriosa sobre ${matchedCandidate.nickname || matchedCandidate.species.name}!`
      };
    }

    // 3. Doces (Rare Candy & Exp Candies)
    if (nameLower.includes('candy') || nameLower.includes('doce')) {
      const mon = targetMon || party[0];
      if (!mon) return { success: false, consumed: false, message: 'Nenhum Pokémon encontrado!' };

      // 3.1 Rare Candy (Doce Raro)
      if (nameLower.includes('rare candy') || nameLower === 'candy' || nameLower === 'doce raro') {
        if (mon.level >= 100) {
          return { success: false, consumed: false, message: `${mon.nickname || mon.species.name} já está no nível máximo (100)!` };
        }

        const result = await pokemonProgressionService.levelUpPokemon({
          characterId,
          pokemonId: mon.id,
          levelsToAdd: 1
        });

        return {
          success: true,
          consumed: true,
          levelUpResult: result,
          updatedPokemon: result.pokemon,
          message: `Parabéns! ${result.pokemon.nickname || result.pokemon.species.name} subiu para o Nível ${result.newLevel}!`
        };
      }

      // 3.2 Exp. Candy (XS, S, M, L, XL)
      if (nameLower.includes('exp')) {
        if (mon.level >= 100) {
          return { success: false, consumed: false, message: `${mon.nickname || mon.species.name} já está no nível máximo (100)!` };
        }

        let expGain = 1000;
        if (nameLower.includes('xl')) expGain = 30000;
        else if (nameLower.includes('xs')) expGain = 100;
        else if (nameLower.endsWith(' l') || nameLower.includes(' l ')) expGain = 10000;
        else if (nameLower.endsWith(' m') || nameLower.includes(' m ')) expGain = 3000;
        else if (nameLower.endsWith(' s') || nameLower.includes(' s ')) expGain = 800;

        let curExp = (mon.exp || 0) + expGain;
        let curLevel = mon.level;
        let levelsToAdd = 0;

        while (curLevel + levelsToAdd < 100 && curExp >= Math.pow(curLevel + levelsToAdd + 1, 3)) {
          levelsToAdd++;
        }

        if (levelsToAdd > 0) {
          const result = await pokemonProgressionService.levelUpPokemon({
            characterId,
            pokemonId: mon.id,
            levelsToAdd
          });
          await prisma.pokemon.update({
            where: { id: mon.id },
            data: { exp: curExp }
          });
          return {
            success: true,
            consumed: true,
            levelUpResult: result,
            updatedPokemon: result.pokemon,
            message: `${mon.nickname || mon.species.name} ganhou ${expGain} EXP e subiu para o Nível ${result.newLevel}!`
          };
        } else {
          const updated = await prisma.pokemon.update({
            where: { id: mon.id },
            data: { exp: curExp },
            include: { species: true }
          });
          return {
            success: true,
            consumed: true,
            updatedPokemon: updated,
            message: `${mon.nickname || mon.species.name} ganhou ${expGain} EXP!`
          };
        }
      }

      // 3.3 Stat Candies (Health, Mighty, Courage, Quick, Smart, Tough)
      if (nameLower.includes('health') || nameLower.includes('mighty') || nameLower.includes('courage') || nameLower.includes('quick') || nameLower.includes('smart') || nameLower.includes('tough')) {
        await friendshipManager.addFriendship(mon.id, 5);
        return {
          success: true,
          consumed: true,
          updatedPokemon: mon,
          message: `Usou ${item.name}! ${mon.nickname || mon.species.name} ficou mais forte e afetuoso!`
        };
      }
    }

    // 4. Vitaminas (HP Up, Protein, Iron, Carbos, Calcium, Zinc)
    if (nameLower === 'hp up' || nameLower === 'protein' || nameLower === 'iron' || nameLower === 'carbos' || nameLower === 'calcium' || nameLower === 'zinc') {
      const mon = targetMon || party[0];
      if (!mon) return { success: false, consumed: false, message: 'Nenhum Pokémon encontrado!' };

      // Concede +5 de amizade
      await friendshipManager.addFriendship(mon.id, 5);

      return {
        success: true,
        consumed: true,
        updatedPokemon: mon,
        message: `Usou ${item.name}! ${mon.nickname || mon.species.name} ficou mais forte e afetuoso!`
      };
    }

    // 5. Reviveres (Revive, Max Revive, Sacred Ash)
    if (nameLower.includes('revive') || nameLower.includes('sacred ash')) {
      const faintedMon = targetMon || party.find(p => p.currentHp <= 0);
      if (!faintedMon) {
        return { success: false, consumed: false, message: 'Nenhum Pokémon da equipe está desmaiado para reviver!' };
      }
      if (faintedMon.currentHp > 0) {
        return { success: false, consumed: false, message: `${faintedMon.nickname || faintedMon.species.name} não está desmaiado!` };
      }

      const reviveHp = nameLower.includes('max') || nameLower.includes('sacred')
        ? faintedMon.maxHp
        : Math.max(1, Math.floor(faintedMon.maxHp / 2));

      const updated = await prisma.pokemon.update({
        where: { id: faintedMon.id },
        data: { currentHp: reviveHp },
        include: { species: true }
      });

      return {
        success: true,
        consumed: true,
        updatedPokemon: updated,
        message: `${faintedMon.nickname || faintedMon.species.name} foi revivido com ${reviveHp} HP!`
      };
    }

    // 6. Poções & Bebidas de Cura de HP
    if (nameLower.includes('potion') || nameLower.includes('milk') || nameLower.includes('water') || nameLower.includes('soda') || nameLower.includes('lemonade') || nameLower.includes('berry') || nameLower.includes('restore')) {
      const injuredMon = targetMon || party.find(p => p.currentHp > 0 && p.currentHp < p.maxHp) || party[0];
      if (!injuredMon) return { success: false, consumed: false, message: 'Nenhum Pokémon encontrado!' };

      if (injuredMon.currentHp <= 0) {
        return { success: false, consumed: false, message: `${injuredMon.nickname || injuredMon.species.name} está desmaiado! Use um Revive.` };
      }

      if (injuredMon.currentHp >= injuredMon.maxHp) {
        return { success: false, consumed: false, message: `${injuredMon.nickname || injuredMon.species.name} já está com HP máximo!` };
      }

      let healAmount = 20;
      if (nameLower.includes('super')) healAmount = 50;
      else if (nameLower.includes('hyper')) healAmount = 200;
      else if (nameLower.includes('max') || nameLower.includes('full')) healAmount = injuredMon.maxHp;
      else if (nameLower.includes('soda')) healAmount = 60;
      else if (nameLower.includes('lemonade')) healAmount = 80;
      else if (nameLower.includes('milk')) healAmount = 100;
      else if (nameLower.includes('water')) healAmount = 50;
      else if (nameLower.includes('oran')) healAmount = 10;
      else if (nameLower.includes('sitrus')) healAmount = Math.max(30, Math.floor(injuredMon.maxHp / 4));

      const newHp = Math.min(injuredMon.maxHp, injuredMon.currentHp + healAmount);
      const actualHealed = newHp - injuredMon.currentHp;

      const updated = await prisma.pokemon.update({
        where: { id: injuredMon.id },
        data: { currentHp: newHp },
        include: { species: true }
      });

      return {
        success: true,
        consumed: true,
        updatedPokemon: updated,
        message: `Curou ${actualHealed} HP de ${injuredMon.nickname || injuredMon.species.name}!`
      };
    }

    // 7. Curas de Status (Antidote, Paralyze Heal, Awakening, Burn Heal, Ice Heal, Full Heal)
    if (nameLower.includes('antidote') || nameLower.includes('heal') || nameLower.includes('awakening') || nameLower.includes('cure')) {
      const mon = targetMon || party[0];
      return {
        success: true,
        consumed: true,
        updatedPokemon: mon,
        message: `${mon ? (mon.nickname || mon.species.name) : 'O Pokémon'} foi curado de todas as condições anormais de status!`
      };
    }

    // 8. Repelentes (Repel, Super Repel, Max Repel)
    if (nameLower.includes('repel')) {
      const steps = nameLower.includes('max') ? 250 : (nameLower.includes('super') ? 200 : 100);
      return {
        success: true,
        consumed: true,
        repelSteps: steps,
        message: `Usou ${item.name}! Pokémon selvagens não aparecerão por ${steps} passos.`
      };
    }

    // 9. Itens Chave (Town Map, etc.)
    if (nameLower.includes('map')) {
      return {
        success: true,
        consumed: false, // Key items não são consumidos
        openMap: true,
        message: `Consultando o Mapa da Região de Kanto.`
      };
    }

    // 10. Fallback Geral
    return {
      success: true,
      consumed: true,
      message: `Usou 1x ${item.name}!`
    };
  }
}

module.exports = new ItemEffectRegistry();
