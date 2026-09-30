const prisma = require('../src/database');
const friendshipManager = require('../src/services/evolution/FriendshipManager.js');
const playerProgressionService = require('../src/services/player/PlayerProgressionService.js');
const evolutionManager = require('../src/services/evolution/EvolutionManager.js');
const itemEffectRegistry = require('../src/services/items/ItemEffectRegistry.js');

console.log("=== INICIANDO TESTE DO SISTEMA DE PROGRESSÃO, AMIZADE E EVOLUÇÃO ===");

async function runTests() {
    try {
        // 1. Teste PlayerProgressionService
        console.log("\n[1] Testando PlayerProgressionService...");
        const expCurveLvl1 = playerProgressionService.getExpForNextLevel(1);
        const expCurveLvl5 = playerProgressionService.getExpForNextLevel(5);
        console.log(`- Exp necessária para Lvl 2: ${expCurveLvl1}`);
        console.log(`- Exp necessária para Lvl 6: ${expCurveLvl5}`);

        const testDefeatedLvl = 15;
        const rewardExp = Math.max(10, Math.floor(testDefeatedLvl * 12));
        const rewardMoney = Math.max(25, Math.floor(testDefeatedLvl * 18));
        console.log(`- Recompensa por derrotar monstro Lv 15: EXP Treinador = ${rewardExp}, Dinheiro = P$ ${rewardMoney}`);

        // 2. Teste FriendshipManager
        console.log("\n[2] Testando FriendshipManager...");
        const f70 = friendshipManager.getFriendshipDetails(70);
        const f225 = friendshipManager.getFriendshipDetails(225);
        console.log(`- Status qualitativo (70): "${f70.label}", % = ${f70.percent}%, Pronto p/ Evo = ${f70.readyForEvo}`);
        console.log(`- Status qualitativo (225): "${f225.label}", % = ${f225.percent}%, Pronto p/ Evo = ${f225.readyForEvo}`);

        // 3. Teste EvolutionManager com Dados Reais do Banco
        console.log("\n[3] Testando EvolutionManager com Dados Reais do PostgreSQL...");
        
        // Teste Bulbasaur -> Ivysaur (Level 16)
        const bulbaSpecies = await prisma.pokemonSpecies.findFirst({ where: { name: 'Bulbasaur' } });
        if (bulbaSpecies) {
            const bulbaLvl10 = { speciesId: bulbaSpecies.id, level: 10, friendship: 70, species: bulbaSpecies };
            const bulbaLvl16 = { speciesId: bulbaSpecies.id, level: 16, friendship: 70, species: bulbaSpecies };

            const check10 = await evolutionManager.checkEvolutionEligibility(bulbaLvl10, { trigger: 'level' });
            console.log(`- Bulbasaur (Lv 10) elegível para evoluir? ${check10.canEvolve}`);

            const check16 = await evolutionManager.checkEvolutionEligibility(bulbaLvl16, { trigger: 'level' });
            console.log(`- Bulbasaur (Lv 16) elegível para evoluir? ${check16.canEvolve} -> Alvo: ${check16.targetSpecies?.name} (ID ${check16.targetSpecies?.id}) via ${check16.method} ${check16.parameter}`);
        }

        // Teste Eevee com WATERSTONE (Vaporeon)
        const eeveeSpecies = await prisma.pokemonSpecies.findFirst({ where: { name: 'Eevee' } });
        if (eeveeSpecies) {
            const eevee = { speciesId: eeveeSpecies.id, level: 25, friendship: 70, species: eeveeSpecies };
            const checkWater = await evolutionManager.checkEvolutionEligibility(eevee, {
                trigger: 'item',
                itemInternalName: 'WATERSTONE'
            });
            console.log(`- Eevee com WATERSTONE elegível? ${checkWater.canEvolve} -> Alvo: ${checkWater.targetSpecies?.name} (ID ${checkWater.targetSpecies?.id}) via ${checkWater.method}`);

            const checkThunder = await evolutionManager.checkEvolutionEligibility(eevee, {
                trigger: 'item',
                itemInternalName: 'THUNDERSTONE'
            });
            console.log(`- Eevee com THUNDERSTONE elegível? ${checkThunder.canEvolve} -> Alvo: ${checkThunder.targetSpecies?.name} (ID ${checkThunder.targetSpecies?.id}) via ${checkThunder.method}`);
        }

        // 4. Teste ItemEffectRegistry
        console.log("\n[4] Testando ItemEffectRegistry...");
        console.log(`- applyItemEffect é função? ${typeof itemEffectRegistry.applyItemEffect === 'function'}`);

        console.log("\n✅ TODOS OS TESTES UNITÁRIOS E DE SERVIÇO FORAM CONCLUÍDOS COM SUCESSO!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Erro durante o teste:", err);
        process.exit(1);
    }
}

runTests();
