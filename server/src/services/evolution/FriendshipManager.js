const prisma = require('../../database');

class FriendshipManager {
  /**
   * Adiciona pontos de amizade ao Pokémon respeitando o limite máximo de 255.
   * @param {number} pokemonId 
   * @param {number} amount 
   * @returns {Promise<number>} Novo valor de amizade.
   */
  async addFriendship(pokemonId, amount = 1) {
    const mon = await prisma.pokemon.findUnique({
      where: { id: pokemonId },
      select: { id: true, friendship: true }
    });

    if (!mon) return 70;

    const current = mon.friendship ?? 70;
    // Bônus menor se a amizade já estiver muito alta (regra clássica dos jogos)
    let bonus = amount;
    if (current >= 200) {
      bonus = Math.max(1, Math.floor(amount / 2));
    }

    const newFriendship = Math.min(255, current + bonus);

    await prisma.pokemon.update({
      where: { id: pokemonId },
      data: { friendship: newFriendship }
    });

    return newFriendship;
  }

  /**
   * Reduz pontos de amizade (ex: desmaio ou itens amargos).
   * @param {number} pokemonId 
   * @param {number} amount 
   * @returns {Promise<number>} Novo valor de amizade.
   */
  async removeFriendship(pokemonId, amount = 1) {
    const mon = await prisma.pokemon.findUnique({
      where: { id: pokemonId },
      select: { id: true, friendship: true }
    });

    if (!mon) return 70;

    const current = mon.friendship ?? 70;
    const newFriendship = Math.max(0, current - amount);

    await prisma.pokemon.update({
      where: { id: pokemonId },
      data: { friendship: newFriendship }
    });

    return newFriendship;
  }

  /**
   * Retorna os metadados visuais e qualitativos do nível de amizade.
   * @param {number} value (0 a 255)
   */
  getFriendshipDetails(value = 70) {
    const safeVal = Math.max(0, Math.min(255, value));
    const percent = Math.floor((safeVal / 255) * 100);

    if (safeVal < 50) {
      return { value: safeVal, percent, key: 'distrust', label: 'Desconfiado', color: '#94a3b8', readyForEvo: false };
    }
    if (safeVal < 100) {
      return { value: safeVal, percent, key: 'neutral', label: 'Neutro', color: '#38bdf8', readyForEvo: false };
    }
    if (safeVal < 150) {
      return { value: safeVal, percent, key: 'friendly', label: 'Amigável', color: '#4ade80', readyForEvo: false };
    }
    if (safeVal < 220) {
      return { value: safeVal, percent, key: 'confident', label: 'Confiante', color: '#facc15', readyForEvo: false };
    }
    return { value: safeVal, percent, key: 'bonded', label: 'Vínculo Forte ✨', color: '#ec4899', readyForEvo: true };
  }
}

module.exports = new FriendshipManager();
