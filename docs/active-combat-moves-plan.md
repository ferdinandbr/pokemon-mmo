# Plano de Implementação: Filtragem e Adaptação de Golpes para Combate Ativo (PokeMMO)

> **Slug da Tarefa**: `active-combat-moves-plan`  
> **Objetivo**: Triar todos os 621 golpes para o combate ativo em tempo real, marcar flag de compatibilidade, antecipar golpes ativos para o Nível 1 em espécies órfãs, atualizar a progressão de aprendizado e migrar os Pokémons existentes no banco.

---

## 1. Escopo e Decisões Alinhadas

1. **Golpes Desativados (~110-120 golpes)**:
   - Manipuladores de ordem de turno e fila (`Trick Room`, `Quash`, `After You`, `Pursuit`, etc.)
   - Suportes exclusivos de batalhas em duplas (`Helping Hand`, `Follow Me`, `Rage Powder`, `Ally Switch`, etc.)
   - Golpes dependentes de itens consumíveis de turno (`Fling`, `Natural Gift`, `Trick`, `Embargo`, etc.)
   - Manipuladores de habilidades passivas (`Skill Swap`, `Role Play`, `Worry Seed`, etc.)
   - Gimmicks nulos ou de cópia caótica (`Splash`, `Celebrate`, `Metronome`, `Assist`, `Copycat`, etc.)
   - Debuffs puramente numéricos invisíveis (`Tail Whip`, `Leer`, `Growl`, `Screech`, `Fake Tears`, etc.)

2. **Golpes de Status Preservados**:
   - Projéteis de teia com desaceleração física (`String Shot`, `Spider Web`, `Sticky Web`)
   - Efeitos de controle de grupo ativos (`Thunder Wave`, `Will-O-Wisp`, `Hypnosis`, `Sleep Powder`, `Confuse Ray`)
   - Escudos e barreiras ativas (`Protect`, `Detect`, `Barrier`, `Light Screen`, `Reflect`, `Harden`)
   - Aumentos de velocidade e mobilidade (`Agility`, `Rock Polish`, `Dragon Dance`, `Quiver Dance`)
   - Buffs de dano e postura (`Swords Dance`, `Nasty Plot`, `Calm Mind`, `Bulk Up`)
   - Curas ativas (`Recover`, `Roost`, `Synthesis`, `Soft-Boiled`)

3. **Garantia de Nível 1 para Espécies Órfãs**:
   - Espécies cujos golpes iniciais eram 100% de status desativados (ex: Cubone com Growl/Tail Whip, Magikarp com Splash) têm seu primeiro golpe de ataque ativo antecipado para o Nível 1 (ex: Cubone aprende `Bone Club` no Nível 1; Magikarp aprende `Tackle` no Nível 1).

4. **Migração do Banco de Dados**:
   - Pokémons já existentes no banco de dados com golpes desativados serão migrados via script dedicado, substituindo slots inativos pelos golpes compatíveis mais recentes para o seu nível.

---

## 2. Tarefas de Implementação

### Fase 1: Marcação de Compatibilidade no Catálogo de Golpes
- [ ] Criar lista canônica de golpes incompatíveis (`INCOMPATIBLE_MOVE_NAMES`).
- [ ] Atualizar `client/src/battle/movesDatabase.js` adicionando `activeCombatCompatible: false` para golpes incompatíveis e `true` para compatíveis.
- [ ] Atualizar `server/src/services/moves/MoveRegistry.js` para registrar a propriedade `activeCombatCompatible`.

### Fase 2: Lógica de Seleção e Aprendizado no Servidor
- [ ] Atualizar `MoveManager.selectMovesForInitialLevel` para filtrar apenas golpes compatíveis (`activeCombatCompatible !== false`).
- [ ] Se a espécie não possuir nenhum golpe no Nível 1, promover automaticamente o primeiro golpe ativo da espécie para o Nível 1.
- [ ] Atualizar `MoveManager.getLearnableMovesForLevel` para ignorar golpes incompatíveis na subida de nível.
- [ ] Atualizar `PokemonSpecies` (seed/atualização) para antecipar golpes ativos para o Nível 1 onde necessário.

### Fase 3: Script de Migração dos Pokémons Existentes
- [ ] Criar `server/scripts/migrate_active_combat_moves.js`.
- [ ] Iterar por todos os Pokémons no banco de dados.
- [ ] Detectar e substituir qualquer golpe inativo por golpe ativo equivalente para a espécie e nível.

### Fase 4: Proteção no Cliente de Batalha
- [ ] Atualizar `client/src/battle/pokemonData.js` para garantir que fallback de golpes e filtros de seleção só usem golpes com `activeCombatCompatible === true`.
- [ ] Atualizar `scripts/update_moves_catalog.js` se aplicável.

### Fase 5: Verificação e Validação
- [ ] Testar geração de movesets para todas as 151 espécies nos níveis 1, 5, 20, 50.
- [ ] Executar script de migração no banco de dados.
- [ ] Testar subida de nível e seleção de golpes em batalha.
