# Plano de Implementação: Sistema de NPCs e Seleção de Inicial (Estilo FRLG / Essentials)

## 1. Visão Geral
Implementar um sistema completo, modular e configurável de NPCs (Personagens Não-Jogáveis) para o PokeMMO com:
1. **Importação e Registro de Sprites:** Copiar os sprites essenciais da pasta `E:\Pokemon Essentials v17.2 - Kanto by DefaKS\Graphics\Characters` (`phone001.png` para Oak, `NPC 01` para balconista, `trchar020` para Rocket/Bandido, civis, etc.) com layout padrão 32×48 por frame.
2. **Tipos de NPCs Suportados:**
   - **Diálogo (`dialogue`):** Fala com o jogador ao interagir (Espaço/E ou clique).
   - **Batalha (`battle` - Treinadores/Bandidos):** Linha de visão clássica (exclama "!", caminha até o jogador e inicia o combate) + interação manual. Time configurável e premiação em dinheiro.
   - **Loja (`shop` - Poké Mart):** Balconista com interface de compras (Pokébolas, Poções, etc.) e saldo em Poke-dollars.
   - **Professor Carvalho (`starter_oak`):** Localizado no laboratório (`pallet_oak_lab`), abre a interface especial de escolha de Pokémon inicial se o jogador ainda não tiver um.
3. **Interface de Escolha do Inicial (Seguindo vídeo de referência):**
   - Modal temático estilo FireRed / Emerald / Essentials:
   - 3 Pokébolas alinhadas em mesa/tapete verde.
   - Mãozinha/ponteiro animada com brilho/glow ao focar.
   - Bolha de destaque animada que sobe com o sprite do Pokémon (Bulbasaur #001, Charmander #004, Squirtle #007).
   - Caixa de diálogo com descrição e opções SIM / NÃO.
   - Ao confirmar: validação segura no backend, criação do Pokémon Lv.5 no banco de dados e notificação "[Jogador] obteve [Pokémon]!".
4. **Configuração no Editor de Mapas (`EditorScene.js` / `EditorUI.js`):**
   - Nova aba "NPCs" na sidebar do editor.
   - Ferramenta para posicionar NPCs no mapa com pré-visualização do sprite, orientação (Down, Left, Right, Up), tipo e propriedades (diálogo, itens da loja, equipe do treinador).
   - Persistência direta no JSON de cada mapa (`NPCs` objectgroup).

---

## 2. Fases de Execução

### Fase 1: Importação de Assets & Registro de Spritesheets
- Criar diretório `client/public/assets/characters/npcs/`.
- Copiar sprites curados da pasta Essentials:
  - `phone001.png` -> `npc_oak.png`
  - `NPC 01.png` -> `npc_clerk.png`
  - `NPC 02.png` -> `npc_nurse.png`
  - `NPC 03.png` -> `npc_scientist.png`
  - `trchar020.png` -> `npc_rocket_m.png`
  - `trchar021.png` -> `npc_rocket_f.png`
  - `trchar002.png` -> `npc_youngster.png`
  - `trchar003.png` -> `npc_lass.png`
  - `trchar004.png` -> `npc_bug_catcher.png`
  - `trchar008.png` -> `npc_hiker.png`
  - `NPC 04.png` -> `npc_fat_guy.png`
  - `NPC 05.png` -> `npc_girl.png`
  - `NPC 06.png` -> `npc_old_man.png`
  - `NPC 07.png` -> `npc_boy.png`
- Configurar carregamento no `BootScene.js` e gerar animações direcionais (`idle_down`, `idle_left`, `idle_right`, `idle_up`, `walk_down`, etc.).

### Fase 2: Entidade NPC no Cliente (`NPC.js`)
- Classe `NPC` estendendo `Phaser.GameObjects.Container`.
- Renderização de sombra, sprite animado, balão de exclamação "!" para detecção de batalha.
- Linha de visão (Line of Sight raycast em grade) para NPCs de batalha.
- Integração em `WorldScene.js`:
  - Leitura do layer `NPCs` do mapa atual.
  - Carregamento e renderização dos NPCs na sala.
  - Interação por tecla (Espaço, Enter, E) ou clique do mouse.
  - Despacho conforme `npcType` (`dialogue`, `shop`, `battle`, `starter_oak`).

### Fase 3: Interface de Seleção do Inicial (`StarterSelectionUI.js`)
- Implementar componente visual e estilização CSS de alta fidelidade:
  - Estágio com mesa verde e piso quadriculado.
  - 3 Pokébolas interativas (Bulbasaur, Charmander, Squirtle).
  - Ponteiro animado (white gloved hand) com navegação por teclado (Setas, A/D, Enter) e mouse.
  - Spotlight bubble flutuante com sprite do Pokémon.
  - Caixa de texto FireRed com confirmação SIM/NÃO.
- Comunicação de socket (`starter:choose`).

### Fase 4: Backend & Persistência do Inicial e Batalhas
- Socket handler `starter:choose`:
  - Verifica se o jogador já possui um inicial / Pokémon cadastrado.
  - Cria Pokémon nível 5 com golpes básicos no Prisma/SQLite.
  - Adiciona à party e define como buddy ativo inicial.
- Socket handler `npc:battle_start`:
  - Cria sessão de batalha com o treinador NPC via `BattleManager`.
  - Registra o NPC como derrotado pelo jogador na sessão / banco.
- Socket handler `shop:buy`:
  - Dedução segura de dinheiro e adição de itens ao inventário.

### Fase 5: Loja Poké Mart (`ShopUI.js`)
- Interface modal Gen 3 de compra de itens (Pokébolas, Poções, Antídotos, etc.).
- Exibição de dinheiro do jogador, preços, descrições e confirmação de compra.

### Fase 6: Integração no Editor de Mapas (`EditorUI.js` & `EditorScene.js`)
- Aba "NPCs" no painel lateral do editor.
- Lista de NPCs presentes no mapa com botões de adicionar, editar e excluir.
- Modal de configuração de NPC (nome, seleção de sprite com preview, direção, tipo, diálogos, itens de loja, equipe de batalha).
- Renderização visual e ferramenta de arrastar/posicionar NPCs na tela do editor.
- Serialização e salvamento automático no JSON do mapa.
- Adição inicial do Prof. Carvalho no `pallet_oak_lab.json`.

### Fase 7: Verificação & Testes
- Build do frontend via Vite.
- Teste de fluxo completo: falar com Oak, escolher inicial com interface animada, testar loja e treinador.
