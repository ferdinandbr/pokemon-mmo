# Plano de Implementação: Evolução, Amizade, Party EXP, Progressão do Player e Catálogo de Itens

**Status:** Pronto para Execução  
**Versão:** 1.1 (Atualizada com Nível do Treinador, Recompensas de Batalha e Amizade no PC)  
**Data:** 25 de Setembro de 2026  
**Autor:** Antigravity AI (`@project-planner` + `@frontend-specialist` + `@backend-specialist`)

---

## 🎯 1. Visão Geral e Novos Objetivos

O plano engloba a implementação completa de cinco pilares fundamentais e interligados do PokeMMO:

1. **Sistema de Evolução Dinâmico**:
   - Evolução por nível (`Level`).
   - Evolução por pedras e itens evolutivos (`Item`).
   - Evolução por felicidade/amizade (`Happiness`, `HappinessDay`, `HappinessNight`).
   - Evolução por troca ou item de link (`Trade`, `TradeItem` / Link Cable).
   - Tela/animação cinemática de evolução no cliente com opção de cancelamento ([B] / Botão Cancelar).

2. **Distribuição de EXP para a Party (EXP Share Moderno)**:
   - Pokémon ativos em combate recebem 100% de EXP base.
   - Demais Pokémon vivos da equipe (HP > 0) recebem 50% de EXP da batalha.
   - Checagem individual de subida de nível, aprendizado de golpes e elegibilidade de evolução para todos da equipe.

3. **Sistema de Progressão & Nível do Jogador (Treinador)**:
   - Persistência no banco de dados SQLite/PostgreSQL com `Character.level` e `Character.exp`.
   - Vitória em batalhas concede **EXP de Treinador** e **Dinheiro (Poké-dollars)** ao jogador.
   - Sincronização em tempo real na HUD Superior do Overworld: pílula de nível (`#hud-player-lvl`), barra de progresso de experiência (`#hud-exp-bar-fill`) e mostrador de dinheiro (`#hud-money-val`).
   - Níveis de treinador aumentam capacidade de comando, reputação e bônus futuros.

4. **Sistema de Amizade (Friendship / Happiness Engine)**:
   - Armazenamento de valor de amizade (`0` a `255`, padrão inicial `70`) no modelo `Pokemon`.
   - Mapeamento completo de espécies que evoluem por amizade (Golbat, Chansey, Pichu, Cleffa, Igglybuff, Togepi, Eevee, Munchlax, Riolu, etc.).
   - Ganhos por passos no overworld (com bônus de buddy), level up, vitórias em batalha e vitaminas/berries.
   - Perdas por desmaio em batalha ou remédios amargos.
   - **Exibição visual do nível de amizade na interface de Box/PC (`PokemonStorageUI.js`)**: indicador de coração, valor numérico (`/ 255`) e status de vínculo ("Neutro", "Amigável", "Confiante", "Apegado", "Pronto para Evoluir").

5. **Catálogo Completo e Funcional de Itens (Pokemon Essentials v17.2)**:
   - Importação automatizada dos 596 itens de `E:/Pokemon Essentials v17.2 - Kanto by DefaKS/PBS/items.txt`.
   - Cópia e mapeamento dos 596 sprites originais de `E:/Pokemon Essentials v17.2 - Kanto by DefaKS/Graphics/Icons/itemXXX.png` para `client/public/assets/items/`.
   - Sistema de execução de efeitos modular (`ItemEffectRegistry`) cobrindo poções, reviveres, curas de status, pedras evolutivas, doces raros, pokébolas, repelentes e berries.

---

## 🏛️ 2. Arquitetura Técnica & Banco de Dados

### 2.1 Alterações no Banco de Dados (Prisma Schema)
- **Tabela `Character`**:
  ```prisma
  model Character {
    // ... campos existentes
    level       Int      @default(1)
    exp         Int      @default(0)
    // money já existe (@default(5000))
  }
  ```
- **Tabela `Pokemon`**:
  ```prisma
  model Pokemon {
    // ... campos existentes
    friendship  Int      @default(70) // 0 a 255 (Padrão: 70)
  }
  ```
- **Tabela `Item`**:
  - Campos de categorização e usabilidade: `category`, `description`, `price`, `sprite`.

### 2.2 Serviços de Backend
```
server/src/services/
├── evolution/
│   ├── EvolutionManager.js          # Avalia regras de evolução e processa transformação
│   └── FriendshipManager.js         # Gerencia pontos de amizade, bônus de passos e buddy
├── player/
│   └── PlayerProgressionService.js  # Gerencia ganho de EXP do player, level up e dinheiro
├── items/
│   ├── ItemEffectRegistry.js        # Executores modulares de cada item (cura, revive, pedra, etc.)
│   └── ItemManager.js               # Validação de uso in-battle e out-of-battle
└── battle/
    └── BattleManager.js             # Party EXP Share, recompensas de EXP/Dinheiro do player e amizade
```

---

## 📋 3. Mapeamento de Pokémons por Amizade (Happiness)

| Pokémon Base | Evolução | Condição | Nível Mínimo |
| :--- | :--- | :--- | :--- |
| **Golbat** | **Crobat** | Amizade ≥ 220 + Subir de nível | Qualquer |
| **Chansey** | **Blissey** | Amizade ≥ 220 + Subir de nível | Qualquer |
| **Pichu** | **Pikachu** | Amizade ≥ 220 + Subir de nível | Qualquer |
| **Cleffa** | **Clefairy** | Amizade ≥ 220 + Subir de nível | Qualquer |
| **Igglybuff** | **Jigglypuff** | Amizade ≥ 220 + Subir de nível | Qualquer |
| **Togepi** | **Togetic** | Amizade ≥ 220 + Subir de nível | Qualquer |
| **Eevee** | **Espeon** | Amizade ≥ 220 + Subir de nível durante o Dia (06:00 - 17:59) | Qualquer |
| **Eevee** | **Umbreon** | Amizade ≥ 220 + Subir de nível durante a Noite (18:00 - 05:59) | Qualquer |
| **Munchlax** | **Snorlax** | Amizade ≥ 220 + Subir de nível | Qualquer |
| **Riolu** | **Lucario** | Amizade ≥ 220 + Subir de nível durante o Dia | Qualquer |
| **Buneary** | **Lopunny** | Amizade ≥ 220 + Subir de nível | Qualquer |
| **Budew** | **Roselia** | Amizade ≥ 220 + Subir de nível durante o Dia | Qualquer |
| **Chingling** | **Chimecho** | Amizade ≥ 220 + Subir de nível durante a Noite | Qualquer |
| **Woobat** | **Swoobat** | Amizade ≥ 220 + Subir de nível | Qualquer |
| **Swadloon** | **Leavanny** | Amizade ≥ 220 + Subir de nível | Qualquer |

---

## 🔄 4. Fases de Execução Detalhadas

### Fase 1: Atualização do Banco & Progressão do Jogador (Treinador)
1. **Schema Migration**:
   - Adicionar `level` e `exp` ao modelo `Character`.
   - Adicionar `friendship` ao modelo `Pokemon`.
   - Executar `npx prisma db push` e `npx prisma generate`.
2. **Serviço de Progressão do Treinador (`PlayerProgressionService.js`)**:
   - Curva de EXP do Treinador: progressiva e balanceada.
   - Ao vencer batalhas: conceder EXP ao treinador e recompensa monetária proporcional ao nível do oponente derrotado.
   - Sincronização via Socket: disparar evento `character:update` com os novos valores de `level`, `exp`, `maxExp` e `money`.
   - Frontend: atualizar `#hud-player-lvl`, preencher a barra `#hud-exp-bar-fill` e atualizar `#hud-money-val`.

### Fase 2: EXP Compartilhado da Party (EXP Share)
1. Modificar `BattleManager.js` para iterar por todos os Pokémon da equipe do jogador ao vencer a batalha selvagem/treinador:
   - Pokémon ativo: 100% da EXP calculada.
   - Pokémon reservas vivos (`currentHp > 0`): 50% da EXP calculada.
2. Cada Pokémon que atingir a EXP necessária avança de nível, recalcula status, processa novos golpes (`MoveLearnPrompt`) e checa elegibilidade de evolução.
3. Emitir eventos no socket para atualização em tempo real da barra de party no cliente (`oph-slot-level`, HP e EXP).

### Fase 3: Motor de Amizade & Exibição no PC Box
1. **Backend (`FriendshipManager.js`)**:
   - Subida de nível: `+4` amizade (`+2` se amizade já estiver ≥ 200).
   - Vitória em batalha com o Pokémon em campo: `+1` amizade.
   - Passos no overworld: A cada 128 passos no `worldService`/`roomManager`, conceder `+1` de amizade ao Buddy ativo e aos membros da equipe.
   - Remédios/Itens: Vitaminas concedem `+3` a `+5`, Rare Candy `+5`.
   - Desmaio em combate: `-1` amizade.
2. **Frontend (`PokemonStorageUI.js`)**:
   - No painel de detalhes do Pokémon (lado direito da Box):
     - Nova linha de afinidade com badge estilizado (`.det-friendship-badge`).
     - Ícone de coração colorido pulsante.
     - Barra de progresso de amizade (0 a 255) e texto descritivo de status:
       - *0–49:* "Desconfiado"
       - *50–99:* "Neutro" (Padrão)
       - *100–149:* "Amigável"
       - *150–219:* "Confiante"
       - *220–255:* "Vínculo Forte (Evolução Pronta ✨)"

### Fase 4: Sistema de Evolução Completo (Backend & Frontend)
1. **Backend (`EvolutionManager.js`)**:
   - `checkEvolutionEligibility(pokemon, context)`: avalia método (`Level`, `Item`, `Happiness`, `Trade`).
   - `executeEvolution(characterId, pokemonId, targetSpeciesId)`:
     - Altera `speciesId` do Pokémon para a nova forma.
     - Recalcula HP e atributos com base nas novas `BaseStats` da espécie.
     - Registra a nova espécie na Pokedex (`status: 'caught'`).
     - Processa learnset de golpes característicos da evolução.
2. **Frontend (Interface & Animação de Evolução)**:
   - Modal cinemático com background escuro e partículas estelares.
   - Animação de silhueta e transição entre os sprites do Pokémon anterior e o evoluído.
   - Botão para cancelar evolução durante a animação de nível ([B] ou botão na tela).
   - Efeitos sonoros e música de evolução (`ME_Evolution`, `ME_Evolution_Success`).

### Fase 5: Catálogo Completo e Funcional de Itens (Essentials v17.2)
1. **Script de Importação (`sync_essentials_items.js`)**:
   - Ler os 596 itens de `E:/Pokemon Essentials v17.2 - Kanto by DefaKS/PBS/items.txt`.
   - Copiar os 596 ícones de `E:/Pokemon Essentials v17.2 - Kanto by DefaKS/Graphics/Icons/itemXXX.png` para `client/public/assets/items/`.
   - Inserir/atualizar todos os itens na tabela `Item` do banco com nomes, categorias, preços e sprites.
2. **Executor Unificado de Efeitos (`ItemEffectRegistry.js`)**:
   - **Poções & Comidas**: Cura imediata de HP (Potion, Super, Hyper, Max, Full Restore, refrigerantes e leite).
   - **Remédios de Status**: Remove estados de paralisia, veneno, sono, queimadura ou congelamento.
   - **Doces Raros (Rare Candy)**: Incrementa 1 nível imediato chamando o fluxo de level up.
   - **Pedras Evolutivas**: Disparam a evolução ao serem usadas sobre um Pokémon compatível (Fire, Water, Thunder, Leaf, Moon, Sun, etc.).
   - **Repelentes**: Ativam contador de passos sem encontros na grama alta.
   - **Pokébolas**: Integradas no `CatchCalculator.js` com seus devidos fatores multiplicadores (Great 1.5x, Ultra 2.0x, Master 255x, etc.).
   - **Berries**: Oran, Sitrus, Lum, Leppa utilizáveis para cura de HP, status e PP.

---

## 🧪 5. Critérios de Validação & Testes
- [ ] O modelo `Character` persiste `level` e `exp`, sincronizando em tempo real com `#hud-player-lvl` e `#hud-exp-bar-fill`.
- [ ] Vencer uma batalha confere EXP e dinheiro ao Treinador, 100% de EXP ao Pokémon ativo e 50% de EXP aos demais membros vivos da equipe.
- [ ] O nível de amizade (`friendship`) é visível na tela de Box (`PokemonStorageUI`), exibindo valor numérico, barra de progresso e rótulo de afeto.
- [ ] Pokémons com amizade ≥ 220 (ex: Golbat) evoluem ao subir de nível.
- [ ] Pedras evolutivas acionam a tela de evolução e transformam o Pokémon corretamente.
- [ ] O script importa com sucesso os 596 itens e seus sprites correspondentes.
- [ ] Build do cliente e servidor completam sem nenhum erro.
