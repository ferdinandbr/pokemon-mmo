# Graph Report - PokeMMO  (2026-10-29)

## Corpus Check
- 476 files · ~2,085,993 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 46 file(s) not represented in the graph (top: .mid 33, (none) 5, .css 3)

## Summary
- 2670 nodes · 4652 edges · 103 communities (64 shown, 39 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 191 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `952c7e3b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- particleSystem.js
- EditorScene
- EditorUI
- pixelArtVfx.js
- BagUI
- PokemonStorageUI
- battleHandler.js
- PokemonEntity
- ParticleSystem
- database.js
- BattleHud
- generate_shiny_overworld.cjs
- BattleEngine
- BattleArena
- BattleWeather
- server.js
- 6. Especificação individual por move
- import_items.js
- download_sprites.cjs
- SFXManager
- movesDatabase.js
- PmdSprite
- FollowerPokemon
- NPC
- proceduralVfxBug.js
- pokemonProgressionService.js
- package.json
- generate_electric_visual_sprites.js
- bgmManager
- NodeGraphUI
- BattleManager.js
- renderCombatProjectile
- LocalPlayer
- 🔄 4. Fases de Execução Detalhadas
- WeatherManager
- 5. Biblioteca de famílias de VFX
- 🔍 Detalhamento por Tipo Elemental (com Sprites)
- authRoutes.js
- .create
- MoveRegistry.js
- ref_fs
- MoveLearnUI
- WorldService
- RoomManager
- MoveRegistry.js
- ShopUI
- main.js
- renderCombatProjectile
- WorldScene.js
- DayNightManager
- generate-pokemon-sprites.js
- reorganize_sprites.cjs
- Plano de Implementação: Melhoria Completa dos Golpes Elétricos
- generate_heal_pillars.js
- sync-tiled-maps.js
- 🗺️ Mapeamento de Peculiaridades de Movimentação e Animação no Combate Ativo
- pokemonEntity.js
- characterService.js
- server/package.json
- TallGrassManager
- AuthUI
- RemotePlayer
- DamageCalculator.js
- PokemonProgressionService
- FlowerAnimationManager
- ref_path
- soundManager
- battleHud.js
- DialogueBox
- database.js
- canvas
- MenuUI
- sync_essentials_items.js
- .update
- CharacterUI
- generate_ground_spritesheets.js
- measure_ground.js
- slice_ground_sprites.js
- generate_bug_visual_sprites.js
- sync_beam_vfx.mjs
- PokemonService
- scripts/set_admin.js
- EvolutionUI
- inventoryHandler.js
- ChatUI
- PvpManager
- PartyHUDUI
- generate_dark_visual_sprites.js
- Pokémon da Geração I — Altura e Peso
- pokemonEntity.js
- scripts
- Plano de Refatoração: Cinematic VFX para ParticleSystem & PixelArtVfx
- repack-tilesets.js
- EncounterService
- MoveEffectHandler
- build_kanto_perfect.js
- test_battle_arena_decals.js

## God Nodes (most connected - your core abstractions)
1. `6. Especificação individual por move` - 622 edges
2. `EditorScene` - 83 edges
3. `EditorUI` - 81 edges
4. `ParticleSystem` - 64 edges
5. `PokemonEntity` - 62 edges
6. `BattleEngine` - 49 edges
7. `WorldScene` - 47 edges
8. `BattleHud` - 34 edges
9. `BagUI` - 32 edges
10. `PokemonStorageUI` - 30 edges

## Surprising Connections (you probably didn't know these)
- `🧪 5. Critérios de Validação & Testes` --references--> `PokemonStorageUI`  [INFERRED]
  docs/evolution-items-friendship-plan.md → client/src/ui/PokemonStorageUI.js
- `2. Componentes e Arquivos Alvo` --references--> `renderPixelIceBlock()`  [INFERRED]
  docs/cinematic-vfx-refactor.md → client/src/battle/pixelArtVfx.js
- `2. Componentes e Arquivos Alvo` --references--> `renderPixelParalysisArcs()`  [INFERRED]
  docs/cinematic-vfx-refactor.md → client/src/battle/pixelArtVfx.js
- `2. Componentes e Arquivos Alvo` --references--> `renderPixelBurnFlames()`  [INFERRED]
  docs/cinematic-vfx-refactor.md → client/src/battle/pixelArtVfx.js
- `2. Componentes e Arquivos Alvo` --references--> `renderPixelPoisonBubbles()`  [INFERRED]
  docs/cinematic-vfx-refactor.md → client/src/battle/pixelArtVfx.js

## Import Cycles
- None detected.

## Communities (103 total, 39 thin omitted)

### Community 0 - "particleSystem.js"
Cohesion: 0.10
Nodes (37): ANIMATION_FILES, ELEMENT_VFX_FILTERS, MOVE_ANIM_CACHE, renderCombatEarth(), renderCombatLightning(), renderCombatPunch(), renderCombatSoundWave(), renderDazzleFlare() (+29 more)

### Community 2 - "EditorUI"
Cohesion: 0.08
Nodes (3): EditorUI, isImageReady(), normalizeTilesetImage()

### Community 3 - "pixelArtVfx.js"
Cohesion: 0.13
Nodes (23): BITE_FANGS_BOTTOM, BITE_FANGS_TOP, DARK_PULSE_FRAMES, DARK_WAVE_FRAMES, drawMistyFairyStar(), drawPinkPadlock(), ELECTRIC_SPARK_FRAMES, EMBER_FRAMES (+15 more)

### Community 6 - "battleHandler.js"
Cohesion: 0.18
Nodes (7): PlayerProgressionService, prisma, battleManager, playerProgressionService, pokemonService, prisma, roomManager

### Community 9 - "database.js"
Cohesion: 0.08
Nodes (15): prisma, evolutionManager, friendshipManager, itemEffectRegistry, playerProgressionService, prisma, prisma, prisma (+7 more)

### Community 10 - "BattleHud"
Cohesion: 0.10
Nodes (7): applyPortraitWithFallback(), BattleHud, getPmdPortraitUrl(), preloadPmdPortraits(), BattleUI, _claimBattleInstance(), _isActiveBattleInstance()

### Community 11 - "generate_shiny_overworld.cjs"
Cohesion: 0.05
Nodes (35): heights, PMD_DIR, result, ROOT, TABLE, ANIM_BACK_NORM, ANIM_BACK_SHINY, ANIM_FRONT_NORM (+27 more)

### Community 13 - "BattleArena"
Cohesion: 0.08
Nodes (4): BattleArena, DecalSystem, GROUND_DECAL_ALIASES, GROUND_DECAL_CONFIGS

### Community 15 - "server.js"
Cohesion: 0.07
Nodes (25): app, authRoutes, charRoutes, clientDistDir, cors, encounterRoutes, express, fs (+17 more)

### Community 16 - "6. Especificação individual por move"
Cohesion: 0.00
Nodes (622): #100 --- Vital Throw, #101 --- Circle Throw, #102 --- Force Palm, #103 --- Low Sweep, #104 --- Revenge, #105 --- Rolling Kick, #106 --- Wake-Up Slap, #107 --- Karate Chop (+614 more)

### Community 17 - "import_items.js"
Cohesion: 0.11
Nodes (16): @prisma/client, prisma, { PrismaClient }, calculatePrice(), downloadImage(), fs, ITEMS_DIR, main() (+8 more)

### Community 18 - "download_sprites.cjs"
Cohesion: 0.09
Nodes (20): baseDir, downloadFile(), fs, https, outNormalDir, outShinyDir, path, run() (+12 more)

### Community 20 - "movesDatabase.js"
Cohesion: 0.06
Nodes (29): INCOMPATIBLE_ACTIVE_COMBAT_MOVES, MOVES_BY_ID, MOVES_BY_INTERNAL, MOVES_BY_NAME, fs, { loadImage }, { MOVES_BY_ID }, path (+21 more)

### Community 21 - "PmdSprite"
Cohesion: 0.16
Nodes (8): ANIMATION_FALLBACKS, DIRECTION_NAME_TO_INDEX, METADATA_CACHE, PMD_DIRECTIONS, PmdSprite, SHEET_CACHE, SINGLE_ROW_ACTIONS, vectorToPmdDirection()

### Community 23 - "NPC"
Cohesion: 0.08
Nodes (12): NPC, 1. Visão Geral, 2. Fases de Execução, Fase 1: Importação de Assets & Registro de Spritesheets, Fase 2: Entidade NPC no Cliente (`NPC.js`), Fase 3: Interface de Seleção do Inicial (`StarterSelectionUI.js`), Fase 4: Backend & Persistência do Inicial e Batalhas, Fase 5: Loja Poké Mart (`ShopUI.js`) (+4 more)

### Community 24 - "proceduralVfxBug.js"
Cohesion: 0.12
Nodes (29): BUG_VFX_PALETTES, drawHexagon(), drawMandiblePincer(), renderAttackOrderProcedural(), renderBugBiteProcedural(), renderBugBuzzProcedural(), renderBugMoveProcedural(), renderDefendOrderProcedural() (+21 more)

### Community 27 - "pokemonProgressionService.js"
Cohesion: 0.09
Nodes (18): EvolutionManager, moveManager, moveRegistry, pokemonService, prisma, evolutionManager, friendshipManager, moveManager (+10 more)

### Community 28 - "package.json"
Cohesion: 0.11
Nodes (17): description, devDependencies, canvas, concurrently, sharp, sharp, name, scripts (+9 more)

### Community 29 - "generate_electric_visual_sprites.js"
Cohesion: 0.27
Nodes (13): { createCanvas, loadImage }, drawPixelLine(), fs, generateElectricBoltImpact(), generateElectricCharge(), generateElectricShockwaveRings(), generateElectricTerrain(), generateElectricWave() (+5 more)

### Community 30 - "bgmManager"
Cohesion: 0.07
Nodes (19): dependencies, phaser, socket.io-client, webaudio-tinysynth, description, devDependencies, vite, socket.io-client (+11 more)

### Community 33 - "BattleManager.js"
Cohesion: 0.12
Nodes (13): catchCalculator, damageCalculator, encounterService, friendshipManager, moveEffectHandler, moveManager, moveRegistry, playerProgressionService (+5 more)

### Community 34 - "renderCombatProjectile"
Cohesion: 0.32
Nodes (8): getTypeColor(), getTypePalette(), renderCombatBeam(), renderCombatBite(), renderCombatBuff(), renderCombatDash(), renderNightDazeCombat(), renderXScissorCombat()

### Community 36 - "🔄 4. Fases de Execução Detalhadas"
Cohesion: 0.12
Nodes (14): 🎯 1. Visão Geral e Novos Objetivos, 2.1 Alterações no Banco de Dados (Prisma Schema), 2.2 Serviços de Backend, 🏛️ 2. Arquitetura Técnica & Banco de Dados, 📋 3. Mapeamento de Pokémons por Amizade (Happiness), 🔄 4. Fases de Execução Detalhadas, 🧪 5. Critérios de Validação & Testes, Fase 1: Atualização do Banco & Progressão do Jogador (Treinador) (+6 more)

### Community 38 - "5. Biblioteca de famílias de VFX"
Cohesion: 0.07
Nodes (28): 1. Objetivo, 2. Regras globais obrigatórias, 3. Pipeline visual padrão, 4. Como escolher os recursos, 5. Biblioteca de famílias de VFX, 7. Contrato sugerido para cada definição de VFX, 8. Critérios de aceite, 9. Nota sobre precisão (+20 more)

### Community 39 - "🔍 Detalhamento por Tipo Elemental (com Sprites)"
Cohesion: 0.09
Nodes (22): 🔍 Detalhamento por Tipo Elemental (com Sprites), 🎨 Galeria Visual dos Spritesheets da Engine de Batalha, 📖 Relatório Completo: Todos os 621 Movimentos (Moves) e Seus Sprites, 📑 Tabela Completa de Todos os 621 Golpes com Sprite Associado, ⚡ Tipo: BUG (25 golpes), ⚡ Tipo: DARK (32 golpes), ⚡ Tipo: DRAGON (14 golpes), ⚡ Tipo: ELECTRIC (27 golpes) (+14 more)

### Community 40 - "authRoutes.js"
Cohesion: 0.09
Nodes (18): bcryptjs, jsonwebtoken, authenticateToken(), jwt, verifySocketToken(), { authenticateToken }, authService, express (+10 more)

### Community 42 - "MoveRegistry.js"
Cohesion: 0.10
Nodes (11): 1. Escopo e Decisões Alinhadas, 2. Tarefas de Implementação, Fase 1: Marcação de Compatibilidade no Catálogo de Golpes, Fase 2: Lógica de Seleção e Aprendizado no Servidor, Fase 3: Script de Migração dos Pokémons Existentes, Fase 4: Proteção no Cliente de Batalha, Fase 5: Verificação e Validação, Plano de Implementação: Filtragem e Adaptação de Golpes para Combate Ativo (PokeMMO) (+3 more)

### Community 43 - "ref_fs"
Cohesion: 0.06
Nodes (21): content, files, current, fs, lines, targets, content, fs (+13 more)

### Community 48 - "MoveRegistry.js"
Cohesion: 0.15
Nodes (14): { isActiveCombatMove, INCOMPATIBLE_ACTIVE_COMBAT_MOVES }, migratePokemonMoves(), moveManager, moveRegistry, prisma, INCOMPATIBLE_ACTIVE_COMBAT_MOVES, isActiveCombatMove(), LEARN_METHODS (+6 more)

### Community 51 - "main.js"
Cohesion: 0.24
Nodes (3): checkRoute(), initApp(), SocketClient

### Community 52 - "renderCombatProjectile"
Cohesion: 0.16
Nodes (14): renderAirCutterCombat(), renderBurningAuraCombat(), renderCombatProjectile(), renderCombatSlash(), renderDracoMeteorCombat(), renderDragonAscentCombat(), renderDragonRageCombat(), renderElectricBoltImpactCombat() (+6 more)

### Community 53 - "WorldScene.js"
Cohesion: 0.05
Nodes (25): spawnDustEffect(), spawnLandingDust(), PLAYER_VISUAL, COLLISION_META, COLLISION_TYPES, DEFAULT_MART_ITEMS, NPC_SPRITES, NPC_TYPES (+17 more)

### Community 55 - "generate-pokemon-sprites.js"
Cohesion: 0.22
Nodes (9): args, fs, generate(), getCell(), H_LINES, INPUT, OUTPUT_DIR, path (+1 more)

### Community 56 - "reorganize_sprites.cjs"
Cohesion: 0.18
Nodes (10): backDir, backNormalDir, backShinyDir, baseDir, frontNormalDir, frontShinyDir, fs, path (+2 more)

### Community 58 - "Plano de Implementação: Melhoria Completa dos Golpes Elétricos"
Cohesion: 0.40
Nodes (4): 1. Mapeamento das Mecânicas e Visuais por Golpe, 2. Spritesheets Pixel Art Dedicados a Gerar, 3. Arquivos a Modificar, Plano de Implementação: Melhoria Completa dos Golpes Elétricos

### Community 59 - "generate_heal_pillars.js"
Cohesion: 0.27
Nodes (9): BEAMS, CROSSES, drawCross(), drawSparkle(), generateSpritesheet(), ORIGINALS_DIR, PALETTES, renderPillarFrame() (+1 more)

### Community 60 - "sync-tiled-maps.js"
Cohesion: 0.27
Nodes (9): convertTmxToJson(), { createCanvas, loadImage }, fs, MAP_REGISTRY, MAPS_DEST_DIR, path, repackTilesetIfOversized(), run() (+1 more)

### Community 61 - "🗺️ Mapeamento de Peculiaridades de Movimentação e Animação no Combate Ativo"
Cohesion: 0.12
Nodes (15): 10. Auto-Recuo Físico por Colisão Brutal (*Self-Knockback Recoil*), 11. Escudos e Barreiras Direcionais Móveis (*Active Shields*), 12. Armadilhas e Vórtices de Aprisionamento (*Trapping Vortex & Ground Hazards*), 1. Dashes de Altíssima Velocidade (*Priority Gap-Closers*), 2. Fintas, Curvas Divergentes e Desaparecimento (*Blink / Feint*), 3. Desengate e Salto Tático (*Hit-and-Run / Disengage*), 4. Evasão Vertical e Subterrânea (*I-Frames / Semi-Invulnerabilidade*), 5. Giros Contínuos, Esferas e Vórtices (*Spinning & Rollout*) (+7 more)

### Community 62 - "pokemonEntity.js"
Cohesion: 0.29
Nodes (3): getMoveAnimImg(), getProjectileVisuals(), ProjectileSystem

### Community 63 - "characterService.js"
Cohesion: 0.08
Nodes (23): addCharacterMoney(), completeIntro(), createCharacter(), getCharacterDetails(), prisma, updateCharacterLocation(), WEATHER_DURATION_RANGES, WEATHER_TRANSITIONS (+15 more)

### Community 64 - "server/package.json"
Cohesion: 0.08
Nodes (25): cors, dotenv, nodemon, prisma, socket.io, dependencies, bcryptjs, cors (+17 more)

### Community 68 - "DamageCalculator.js"
Cohesion: 0.33
Nodes (4): DamageCalculator, { getEffectiveness }, EFFECTIVENESS, getEffectiveness()

### Community 71 - "ref_path"
Cohesion: 0.08
Nodes (15): getFiles(), list, files, fs, path, backupDir, { createCanvas, loadImage }, fs (+7 more)

### Community 72 - "soundManager"
Cohesion: 0.05
Nodes (31): AttackClashSystem, calculateClashForce(), CLASH_CONFIG, compareClashAttacks(), distToSegment(), getElementalClashModifiers(), lineSegmentsIntersection(), getPokemonTypes() (+23 more)

### Community 73 - "battleHud.js"
Cohesion: 0.21
Nodes (7): config, game, getItemCategoryLabel(), TYPE_ICONS, formatSpeciesId(), getPokemonAnimatedSprite(), getPokemonOverworldSprite()

### Community 75 - "database.js"
Cohesion: 0.11
Nodes (15): express, encounterService, express, prisma, router, DEFAULT_MAP_PATH, express, fs (+7 more)

### Community 76 - "canvas"
Cohesion: 0.07
Nodes (17): canvas, { createCanvas, loadImage }, { createCanvas, loadImage }, fs, MAPS_DIR, path, TILESETS_DIR, { createCanvas, loadImage } (+9 more)

### Community 80 - "sync_essentials_items.js"
Cohesion: 0.33
Nodes (6): DEST_DIR, fs, mapPocketToCategory(), path, prisma, syncItems()

### Community 84 - "generate_ground_spritesheets.js"
Cohesion: 0.33
Nodes (4): { createCanvas, loadImage }, fs, generateVisualizer(), path

### Community 85 - "measure_ground.js"
Cohesion: 0.33
Nodes (4): { createCanvas, loadImage }, fs, path, processSprites()

### Community 86 - "slice_ground_sprites.js"
Cohesion: 0.33
Nodes (4): { createCanvas, loadImage }, fs, path, sliceAndAnalyze()

### Community 89 - "generate_bug_visual_sprites.js"
Cohesion: 0.25
Nodes (9): { createCanvas }, fs, generatePixelMegahorn(), generatePixelPinMissile(), generatePixelStringShot(), OUT_DIR, path, setPixel() (+1 more)

### Community 90 - "sync_beam_vfx.mjs"
Cohesion: 0.14
Nodes (13): beamBlock, beamEnd, beamEndBeforeMarker, beamStart, html, lines, palBlock, palEnd (+5 more)

### Community 92 - "scripts/set_admin.js"
Cohesion: 0.29
Nodes (5): envPaths, fs, path, prisma, serverNodeModules

### Community 93 - "EvolutionUI"
Cohesion: 0.33
Nodes (3): EvolutionUI, findPartySpeciesId(), isBattleOpen()

### Community 94 - "inventoryHandler.js"
Cohesion: 0.12
Nodes (12): ROOM_DEFINITIONS, pokemonService, prisma, roomManager, battleManager, itemEffectRegistry, pokemonProgressionService, pokemonService (+4 more)

### Community 98 - "generate_dark_visual_sprites.js"
Cohesion: 0.24
Nodes (11): { createCanvas, loadImage }, ensureDir(), fs, generateNightSlashCross(), generateQuestionMarksDark(), generateSnarlSoundwave(), generateThiefSwipeDark(), main() (+3 more)

### Community 101 - "Pokémon da Geração I — Altura e Peso"
Cohesion: 0.33
Nodes (5): Como usar as medidas, Fontes, Pokémon da Geração I — Altura e Peso, Sugestão para redimensionamento, Tabela completa

### Community 102 - "pokemonEntity.js"
Cohesion: 0.20
Nodes (8): renderDefensiveBarrier(), renderDizzyStars(), renderPixelParalysisArcs(), renderPixelPoisonBubbles(), DEFAULT_ATTACK_ORIGINS, PMD_DIR_ANGLES, SPECIES_ATTACK_ORIGINS, SPECIES_SIZE

### Community 103 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, dev, prisma:generate, prisma:push, prisma:studio, seed, start

### Community 104 - "Plano de Refatoração: Cinematic VFX para ParticleSystem & PixelArtVfx"
Cohesion: 0.50
Nodes (3): 1. Visão Geral e Arquitetura, 3. Preservação de Compatibilidade, Plano de Refatoração: Cinematic VFX para ParticleSystem & PixelArtVfx

### Community 107 - "repack-tilesets.js"
Cohesion: 0.25
Nodes (6): backupDir, { createCanvas, loadImage }, fs, path, tilesetDir, toRepack

### Community 114 - "build_kanto_perfect.js"
Cohesion: 0.40
Nodes (3): { createCanvas, loadImage }, fs, path

### Community 115 - "test_battle_arena_decals.js"
Cohesion: 0.40
Nodes (3): { createCanvas, loadImage }, fs, path

## Knowledge Gaps
- **8 isolated node(s):** `socket.io-client`, `concurrently`, `sharp`, `dotenv`, `nodemon` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1356 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `EditorUI` connect `EditorUI` to `battleHud.js`, `main.js`, `WorldScene.js`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `socket.io-client`, `concurrently`, `sharp` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `particleSystem.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09743589743589744 - nodes in this community are weakly interconnected._
- **Why does `EditorScene` connect `EditorScene` to `battleHud.js`, `WorldScene.js`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `EditorScene` be split into smaller, more focused modules?**
  _Cohesion score 0.06022282445046673 - nodes in this community are weakly interconnected._
- **Why does `6. Especificação individual por move` connect `6. Especificação individual por move` to `5. Biblioteca de famílias de VFX`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `EditorUI` be split into smaller, more focused modules?**
  _Cohesion score 0.08148148148148149 - nodes in this community are weakly interconnected._