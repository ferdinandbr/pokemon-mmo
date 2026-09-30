const prisma = require('../../database');

class PlayerProgressionService {
  /**
   * Retorna a quantidade de EXP necessária para o próximo nível do treinador.
   * Fórmula balanceada para MMO (níveis 1 a 100).
   */
  getExpForNextLevel(level) {
    if (level >= 100) return 999999999;
    return Math.floor(Math.pow(level, 1.8) * 60 + 40);
  }

  /**
   * Concede EXP de Treinador e Dinheiro ao jogador após vitórias ou eventos.
   * @param {number} characterId 
   * @param {number} expGain 
   * @param {number} moneyGain 
   * @returns {Promise<Object>} Resumo da progressão do jogador.
   */
  async addPlayerExpAndMoney(characterId, expGain = 0, moneyGain = 0) {
    const char = await prisma.character.findUnique({
      where: { id: characterId },
      select: { id: true, name: true, level: true, exp: true, money: true }
    });

    if (!char) {
      throw new Error(`Personagem ID ${characterId} não encontrado.`);
    }

    let currentLevel = char.level || 1;
    let currentExp = (char.exp || 0) + Math.max(0, parseInt(expGain) || 0);
    const newMoney = Math.max(0, (char.money || 0) + Math.max(0, parseInt(moneyGain) || 0));

    let leveledUp = false;
    let oldLevel = currentLevel;

    while (currentLevel < 100) {
      const requiredExp = this.getExpForNextLevel(currentLevel);
      if (currentExp >= requiredExp) {
        currentExp -= requiredExp;
        currentLevel++;
        leveledUp = true;
      } else {
        break;
      }
    }

    const updated = await prisma.character.update({
      where: { id: characterId },
      data: {
        level: currentLevel,
        exp: currentExp,
        money: newMoney
      }
    });

    const maxExp = this.getExpForNextLevel(currentLevel);

    return {
      success: true,
      characterId,
      oldLevel,
      newLevel: currentLevel,
      leveledUp,
      exp: currentExp,
      maxExp,
      expPercent: Math.min(100, Math.floor((currentExp / maxExp) * 100)),
      expGained: expGain,
      moneyGained: moneyGain,
      totalMoney: newMoney
    };
  }

  /**
   * Retorna os dados de progresso e nível do treinador formatados para a HUD.
   */
  async getPlayerProgress(characterId) {
    const char = await prisma.character.findUnique({
      where: { id: characterId },
      select: { id: true, name: true, level: true, exp: true, money: true }
    });

    if (!char) return null;

    const level = char.level || 1;
    const exp = char.exp || 0;
    const maxExp = this.getExpForNextLevel(level);

    return {
      characterId,
      level,
      exp,
      maxExp,
      expPercent: Math.min(100, Math.floor((exp / maxExp) * 100)),
      money: char.money || 0
    };
  }
}

module.exports = new PlayerProgressionService();
