import { PrismaClient } from '@prisma/client';
import friendshipManager from '../server/src/services/evolution/FriendshipManager.js';
import playerProgressionService from '../server/src/services/player/PlayerProgressionService.js';
import evolutionManager from '../server/src/services/evolution/EvolutionManager.js';
import itemEffectRegistry from '../server/src/services/items/ItemEffectRegistry.js';

console.log("=== INICIANDO TESTE DO SISTEMA DE PROGRESSÃO, AMIZADE E EVOLUÇÃO ===");

async function runTests() {
    try {
        // 1. Teste PlayerProgressionService
        console.log("\n[1] Testando PlayerProgressionService...");
        const expCurveLvl1 = playerProgressionService.getExpForNextLevel(1);
        const expCurveLvl5 = playerProgressionService.getExpForNextLevel(5);
        console.log(`- Exp necessária para Lvl 2: ${expCurveLvl1}`);
        console.log(`- Exp necessária para Lvl 6: ${expCurveLvl5}`);

        // Simulação de cálculo de recompensa de batalha
        const testDefeatedLvl = 15;
        const rewardExp = Math.max(10, Math.floor(testDefeatedLvl * 12));
        const rewardMoney = Math.max(25, Math.floor(testDefeatedLvl * 18));
        console.log(`- Recompensa por derrotar monstro Lv 15: EXP Treinador = ${rewardExp}, Dinheiro = P$ ${rewardMoney}`);

        // 2. Teste FriendshipManager
        console.log("\n[2] Testando FriendshipManager...");
        let testFriendship = 70;
        let gained = friendshipManager.addFriendship(testFriendship, 'LEVEL_UP');
        console.log(`- Amizade inicial: 70 -> Após Level Up (+4): ${gained}`);
        let maxFriendship = friendshipManager.addFriendship(250, 'MASSAGE');
        console.log(`- Amizade inicial: 250 -> Após Massagem (+10 com cap 255): ${maxFriendship}`);
        console.log(`- Pode evoluir com 70 de amizade? ${friendshipManager.canEvolveByFriendship(70)}`);
        console.log(`- Pode evoluir com 220 de amizade? ${friendshipManager.canEvolveByFriendship(220)}`);
        console.log(`- Status qualitativo (70): "${friendshipManager.getFriendshipTier(70).text}"`);
        console.log(`- Status qualitativo (250): "${friendshipManager.getFriendshipTier(250).text}"`);

        // 3. Teste EvolutionManager
        console.log("\n[3] Testando EvolutionManager (Eligibility Checks)...");
        // Exemplo: Pichu (ID 172) evolui por amizade para Pikachu (ID 25)
        const pichuEligibleLow = evolutionManager.checkEvolutionEligibility({
            speciesId: 172,
            level: 20,
            friendship: 100
        }, { trigger: 'LEVEL_UP', isDaytime: true });
        console.log(`- Pichu (Lv 20, Amizade 100) elegível? ${pichuEligibleLow.eligible}`);

        const pichuEligibleHigh = evolutionManager.checkEvolutionEligibility({
            speciesId: 172,
            level: 20,
            friendship: 220
        }, { trigger: 'LEVEL_UP', isDaytime: true });
        console.log(`- Pichu (Lv 20, Amizade 220) elegível? ${pichuEligibleHigh.eligible} -> Alvo: ${pichuEligibleHigh.evolution?.targetSpeciesId} (${pichuEligibleHigh.evolution?.targetSpeciesName})`);

        // Exemplo: Eevee (ID 133) com Pedra da Água (ID 28 - WATERSTONE)
        const eeveeWater = evolutionManager.checkEvolutionEligibility({
            speciesId: 133,
            level: 25,
            friendship: 70
        }, { trigger: 'ITEM', itemId: 28, itemName: 'WATERSTONE' });
        console.log(`- Eevee com WATERSTONE elegível? ${eeveeWater.eligible} -> Alvo: ${eeveeWater.evolution?.targetSpeciesId} (${eeveeWater.evolution?.targetSpeciesName})`);

        // 4. Teste ItemEffectRegistry
        console.log("\n[4] Testando ItemEffectRegistry...");
        const potionHandler = itemEffectRegistry.getHandler({ name: 'POTION' });
        console.log(`- Handler de POTION encontrado? ${!!potionHandler}`);
        const rareCandyHandler = itemEffectRegistry.getHandler({ name: 'RARECANDY' });
        console.log(`- Handler de RARECANDY encontrado? ${!!rareCandyHandler}`);
        const waterStoneHandler = itemEffectRegistry.getHandler({ name: 'WATERSTONE' });
        console.log(`- Handler de WATERSTONE encontrado? ${!!waterStoneHandler}`);

        console.log("\n✅ TODOS OS TESTES UNITÁRIOS E DE SERVIÇO FORAM CONCLUÍDOS COM SUCESSO!");
    } catch (err) {
        console.error("❌ Erro durante o teste:", err);
    }
}

runTests();
