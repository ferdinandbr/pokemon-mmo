# Graph Report - PokeMMO  (2026-10-21)

## Corpus Check
- 456 files · ~2,002,829 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 46 file(s) not represented in the graph (top: .mid 33, (none) 5, .css 3)

## Summary
- 2459 nodes · 4240 edges · 99 communities (63 shown, 36 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 173 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `365516e3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- particleSystem.js
- EditorScene
- EditorUI
- EditorUI.js
- soundManager
- MoveRegistry.js
- PokemonEntity
- ParticleSystem
- pokemonProgressionService.js
- BagUI
- generate_shiny_overworld.cjs
- BattleEngine
- BattleArena
- authService.js
- server.js
- 6. Especificação individual por move
- import_items.js
- download_sprites.cjs
- SFXManager
- movesDatabase.js
- PmdSprite
- FollowerPokemon
- NPC
- WorldScene
- PokemonStorageUI
- mapRoutes.js
- pokemonProgressionService.js
- package.json
- scripts/set_admin.js
- client/package.json
- EvolutionUI
- AuthUI
- BattleManager.js
- attackClashSystem.js
- LocalPlayer
- main.js
- WeatherManager
- 5. Biblioteca de famílias de VFX
- 🔍 Detalhamento por Tipo Elemental (com Sprites)
- StarterSelectionUI
- RoomManager
- MoveManager
- ref_fs
- MoveLearnUI
- roomManager.js
- WorldService
- battleEngine.js
- audit_move_visuals.js
- pixelArtVfx.js
- WorldScene.js
- battleHud.js
- PokemonService
- initApp
- DayNightManager
- generate-pokemon-sprites.js
- reorganize_sprites.cjs
- OakIntroUI
- extrude-tileset.js
- generate_heal_pillars.js
- sync-tiled-maps.js
- 🗺️ Mapeamento de Peculiaridades de Movimentação e Animação no Combate Ativo
- pokemonEntity.js
- characterService.js
- server/package.json
- PartyHUDUI
- PvpManager
- mapRoutes.js
- DamageCalculator.js
- PokemonProgressionService
- FlowerAnimationManager
- TallGrassManager
- Plano de Refatoração: Cinematic VFX para ParticleSystem & PixelArtVfx
- repack-tilesets.js
- test_battle_arena_decals.js
- EncounterService
- extrude-all-tilesets.js
- DialogueBox
- canvas
- sync_essentials_items.js
- MoveEffectHandler
- WaterAnimationManager
- CharacterUI
- generate_ground_spritesheets.js
- measure_ground.js
- slice_ground_sprites.js
- getTypePalette
- MenuUI
- generate_bug_visual_sprites.js
- ref_path
- RemotePlayer
- scripts
- AttackClashSystem
- ChatUI
- PlayerContextMenuUI
- ProjectileSystem
- PvpChallengeModalUI
- generate_dark_visual_sprites.js
- test_evolution_items_player.js

## God Nodes (most connected - your core abstractions)
1. `6. Especificação individual por move` - 622 edges
2. `EditorScene` - 83 edges
3. `EditorUI` - 81 edges
4. `PokemonEntity` - 49 edges
5. `WorldScene` - 47 edges
6. `ParticleSystem` - 43 edges
7. `BattleEngine` - 40 edges
8. `BagUI` - 32 edges
9. `PokemonStorageUI` - 30 edges
10. `BattleHud` - 28 edges

## Surprising Connections (you probably didn't know these)
- `2. Componentes e Arquivos Alvo` --references--> `renderPixelIceBlock()`  [INFERRED]
  docs/cinematic-vfx-refactor.md → client/src/battle/pixelArtVfx.js
- `2. Componentes e Arquivos Alvo` --references--> `renderPixelParalysisArcs()`  [INFERRED]
  docs/cinematic-vfx-refactor.md → client/src/battle/pixelArtVfx.js
- `2. Componentes e Arquivos Alvo` --references--> `renderPixelBurnFlames()`  [INFERRED]
  docs/cinematic-vfx-refactor.md → client/src/battle/pixelArtVfx.js
- `2. Componentes e Arquivos Alvo` --references--> `renderPixelPoisonBubbles()`  [INFERRED]
  docs/cinematic-vfx-refactor.md → client/src/battle/pixelArtVfx.js
- `2. Componentes e Arquivos Alvo` --references--> `renderPixelContinuousBeam()`  [INFERRED]
  docs/cinematic-vfx-refactor.md → client/src/battle/pixelArtVfx.js

## Import Cycles
- None detected.

## Communities (99 total, 36 thin omitted)

### Community 0 - "particleSystem.js"
Cohesion: 0.11
Nodes (29): ANIMATION_FILES, ELEMENT_VFX_FILTERS, MOVE_ANIM_CACHE, renderAirCutterCombat(), renderCombatEarth(), renderCombatLightning(), renderCombatPunch(), renderCombatSlash() (+21 more)

### Community 2 - "EditorUI"
Cohesion: 0.08
Nodes (3): EditorUI, isImageReady(), normalizeTilesetImage()

### Community 3 - "EditorUI.js"
Cohesion: 0.08
Nodes (9): DEFAULT_MART_ITEMS, NPC_SPRITES, NPC_TYPES, ROOMS_CONFIG, PRESET_TILESETS, BootScene, KANTO_POKEMON_LIST, NodeGraphUI (+1 more)

### Community 5 - "MoveRegistry.js"
Cohesion: 0.15
Nodes (14): { isActiveCombatMove, INCOMPATIBLE_ACTIVE_COMBAT_MOVES }, migratePokemonMoves(), moveManager, moveRegistry, prisma, INCOMPATIBLE_ACTIVE_COMBAT_MOVES, isActiveCombatMove(), LEARN_METHODS (+6 more)

### Community 9 - "pokemonProgressionService.js"
Cohesion: 0.08
Nodes (19): FriendshipManager, prisma, evolutionManager, friendshipManager, pokemonProgressionService, prisma, evolutionManager, friendshipManager (+11 more)

### Community 10 - "BagUI"
Cohesion: 0.08
Nodes (5): BattleHud, BagUI, getItemIcon(), BattleUI, _claimBattleInstance()

### Community 11 - "generate_shiny_overworld.cjs"
Cohesion: 0.08
Nodes (26): ANIM_BACK_NORM, ANIM_BACK_SHINY, ANIM_FRONT_NORM, ANIM_FRONT_SHINY, BASE_DIR, deltaE(), fs, lab2rgb() (+18 more)

### Community 13 - "BattleArena"
Cohesion: 0.10
Nodes (4): BattleArena, DecalSystem, GROUND_DECAL_ALIASES, GROUND_DECAL_CONFIGS

### Community 14 - "authService.js"
Cohesion: 0.09
Nodes (18): bcryptjs, jsonwebtoken, authenticateToken(), jwt, verifySocketToken(), { authenticateToken }, authService, express (+10 more)

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
Cohesion: 0.08
Nodes (23): getMoveData(), INCOMPATIBLE_ACTIVE_COMBAT_MOVES, isActiveCombatMove(), MOVES_BY_ID, MOVES_BY_INTERNAL, MOVES_BY_NAME, fs, { loadImage } (+15 more)

### Community 21 - "PmdSprite"
Cohesion: 0.16
Nodes (8): ANIMATION_FALLBACKS, DIRECTION_NAME_TO_INDEX, METADATA_CACHE, OverworldSprite, PMD_DIRECTIONS, PmdSprite, SHEET_CACHE, vectorToPmdDirection()

### Community 23 - "NPC"
Cohesion: 0.08
Nodes (12): NPC, 1. Visão Geral, 2. Fases de Execução, Fase 1: Importação de Assets & Registro de Spritesheets, Fase 2: Entidade NPC no Cliente (`NPC.js`), Fase 3: Interface de Seleção do Inicial (`StarterSelectionUI.js`), Fase 4: Backend & Persistência do Inicial e Batalhas, Fase 5: Loja Poké Mart (`ShopUI.js`) (+4 more)

### Community 25 - "PokemonStorageUI"
Cohesion: 0.09
Nodes (15): PokemonStorageUI, 🎯 1. Visão Geral e Novos Objetivos, 2.1 Alterações no Banco de Dados (Prisma Schema), 2.2 Serviços de Backend, 🏛️ 2. Arquitetura Técnica & Banco de Dados, 📋 3. Mapeamento de Pokémons por Amizade (Happiness), 🔄 4. Fases de Execução Detalhadas, 🧪 5. Critérios de Validação & Testes (+7 more)

### Community 26 - "mapRoutes.js"
Cohesion: 0.22
Nodes (7): DEFAULT_MAP_PATH, express, fs, MAPS_DIR, path, router, TILESETS_DIR

### Community 27 - "pokemonProgressionService.js"
Cohesion: 0.12
Nodes (12): EvolutionManager, moveManager, moveRegistry, pokemonService, prisma, moveManager, moveRegistry, prisma (+4 more)

### Community 28 - "package.json"
Cohesion: 0.11
Nodes (17): description, devDependencies, canvas, concurrently, sharp, sharp, name, scripts (+9 more)

### Community 29 - "scripts/set_admin.js"
Cohesion: 0.29
Nodes (5): envPaths, fs, path, prisma, serverNodeModules

### Community 30 - "client/package.json"
Cohesion: 0.11
Nodes (16): dependencies, phaser, socket.io-client, webaudio-tinysynth, description, devDependencies, vite, socket.io-client (+8 more)

### Community 31 - "EvolutionUI"
Cohesion: 0.33
Nodes (3): EvolutionUI, findPartySpeciesId(), isBattleOpen()

### Community 33 - "BattleManager.js"
Cohesion: 0.12
Nodes (13): catchCalculator, damageCalculator, encounterService, friendshipManager, moveEffectHandler, moveManager, moveRegistry, playerProgressionService (+5 more)

### Community 34 - "attackClashSystem.js"
Cohesion: 0.18
Nodes (13): adaptPokemonForBattle(), calculateCombatDamage(), calculateDodgeCooldown(), calculateMoveCooldown(), calculateMovementSpeed(), calculatePokemonStats(), DEFAULT_SPECIES_MOVES, GEN1_SPECIES (+5 more)

### Community 36 - "main.js"
Cohesion: 0.12
Nodes (5): bgmManager, REGION_BGM_MAP, config, game, _isActiveBattleInstance()

### Community 38 - "5. Biblioteca de famílias de VFX"
Cohesion: 0.07
Nodes (28): 1. Objetivo, 2. Regras globais obrigatórias, 3. Pipeline visual padrão, 4. Como escolher os recursos, 5. Biblioteca de famílias de VFX, 7. Contrato sugerido para cada definição de VFX, 8. Critérios de aceite, 9. Nota sobre precisão (+20 more)

### Community 39 - "🔍 Detalhamento por Tipo Elemental (com Sprites)"
Cohesion: 0.09
Nodes (22): 🔍 Detalhamento por Tipo Elemental (com Sprites), 🎨 Galeria Visual dos Spritesheets da Engine de Batalha, 📖 Relatório Completo: Todos os 621 Movimentos (Moves) e Seus Sprites, 📑 Tabela Completa de Todos os 621 Golpes com Sprite Associado, ⚡ Tipo: BUG (25 golpes), ⚡ Tipo: DARK (32 golpes), ⚡ Tipo: DRAGON (14 golpes), ⚡ Tipo: ELECTRIC (27 golpes) (+14 more)

### Community 42 - "MoveManager"
Cohesion: 0.10
Nodes (11): 1. Escopo e Decisões Alinhadas, 2. Tarefas de Implementação, Fase 1: Marcação de Compatibilidade no Catálogo de Golpes, Fase 2: Lógica de Seleção e Aprendizado no Servidor, Fase 3: Script de Migração dos Pokémons Existentes, Fase 4: Proteção no Cliente de Batalha, Fase 5: Verificação e Validação, Plano de Implementação: Filtragem e Adaptação de Golpes para Combate Ativo (PokeMMO) (+3 more)

### Community 43 - "ref_fs"
Cohesion: 0.11
Nodes (12): content, files, files, fs, path, content, fs, { createCanvas, loadImage } (+4 more)

### Community 45 - "roomManager.js"
Cohesion: 0.12
Nodes (11): ROOM_DEFINITIONS, pokemonService, prisma, roomManager, battleManager, playerProgressionService, pokemonService, prisma (+3 more)

### Community 48 - "audit_move_visuals.js"
Cohesion: 0.33
Nodes (4): fs, { loadImage }, { MOVES_BY_ID }, path

### Community 49 - "pixelArtVfx.js"
Cohesion: 0.12
Nodes (28): BITE_FANGS_BOTTOM, BITE_FANGS_TOP, DARK_PULSE_FRAMES, DARK_WAVE_FRAMES, ELECTRIC_SPARK_FRAMES, EMBER_FRAMES, FIRE_BLAST_KANJI, FOCUS_BLAST_FRAMES (+20 more)

### Community 50 - "WorldScene.js"
Cohesion: 0.14
Nodes (14): spawnDustEffect(), spawnLandingDust(), PLAYER_VISUAL, COLLISION_META, COLLISION_TYPES, COLLISION_LAYERS, LAYER_DEPTHS, COLLISION_LAYERS (+6 more)

### Community 51 - "battleHud.js"
Cohesion: 0.31
Nodes (6): TYPE_COLORS, getItemCategoryLabel(), TYPE_ICONS, formatSpeciesId(), getPokemonAnimatedSprite(), getPokemonOverworldSprite()

### Community 53 - "initApp"
Cohesion: 0.21
Nodes (3): checkRoute(), initApp(), SocketClient

### Community 55 - "generate-pokemon-sprites.js"
Cohesion: 0.22
Nodes (9): args, fs, generate(), getCell(), H_LINES, INPUT, OUTPUT_DIR, path (+1 more)

### Community 56 - "reorganize_sprites.cjs"
Cohesion: 0.18
Nodes (10): backDir, backNormalDir, backShinyDir, baseDir, frontNormalDir, frontShinyDir, fs, path (+2 more)

### Community 58 - "extrude-tileset.js"
Cohesion: 0.40
Nodes (3): { createCanvas, loadImage }, fs, path

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
Cohesion: 0.23
Nodes (8): getMoveAnimImg(), renderDefensiveBarrier(), renderDizzyStars(), renderPixelParalysisArcs(), renderPixelPoisonBubbles(), DEFAULT_ATTACK_ORIGINS, PMD_DIR_ANGLES, SPECIES_ATTACK_ORIGINS

### Community 63 - "characterService.js"
Cohesion: 0.07
Nodes (17): createCharacter(), getCharacterDetails(), prisma, WEATHER_DURATION_RANGES, WEATHER_TRANSITIONS, WEATHER_TYPES, characterService, pokemonService (+9 more)

### Community 64 - "server/package.json"
Cohesion: 0.08
Nodes (25): cors, dotenv, nodemon, prisma, socket.io, dependencies, bcryptjs, cors (+17 more)

### Community 67 - "mapRoutes.js"
Cohesion: 0.11
Nodes (12): express, prisma, prisma, prisma, { PrismaClient }, encounterService, express, prisma (+4 more)

### Community 68 - "DamageCalculator.js"
Cohesion: 0.33
Nodes (4): DamageCalculator, { getEffectiveness }, EFFECTIVENESS, getEffectiveness()

### Community 72 - "Plano de Refatoração: Cinematic VFX para ParticleSystem & PixelArtVfx"
Cohesion: 0.50
Nodes (3): 1. Visão Geral e Arquitetura, 3. Preservação de Compatibilidade, Plano de Refatoração: Cinematic VFX para ParticleSystem & PixelArtVfx

### Community 73 - "repack-tilesets.js"
Cohesion: 0.25
Nodes (6): backupDir, { createCanvas, loadImage }, fs, path, tilesetDir, toRepack

### Community 74 - "test_battle_arena_decals.js"
Cohesion: 0.40
Nodes (3): { createCanvas, loadImage }, fs, path

### Community 76 - "extrude-all-tilesets.js"
Cohesion: 0.22
Nodes (7): backupDir, { createCanvas, loadImage }, fs, mapsDir, path, tilesetDir, tilesetList

### Community 78 - "canvas"
Cohesion: 0.10
Nodes (12): canvas, { createCanvas, loadImage }, { createCanvas, loadImage }, fs, path, { createCanvas, loadImage }, fs, MAPS_DIR (+4 more)

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

### Community 87 - "getTypePalette"
Cohesion: 0.32
Nodes (8): getTypeColor(), getTypePalette(), renderCombatBeam(), renderCombatBite(), renderCombatBuff(), renderCombatDash(), renderNightDazeCombat(), renderXScissorCombat()

### Community 89 - "generate_bug_visual_sprites.js"
Cohesion: 0.25
Nodes (9): { createCanvas }, fs, generatePixelMegahorn(), generatePixelPinMissile(), generatePixelStringShot(), OUT_DIR, path, setPixel() (+1 more)

### Community 90 - "ref_path"
Cohesion: 0.12
Nodes (8): getFiles(), list, { createCanvas, loadImage }, fs, path, { createCanvas, loadImage }, fs, path

### Community 92 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, dev, prisma:generate, prisma:push, prisma:studio, seed, start

### Community 93 - "AttackClashSystem"
Cohesion: 0.25
Nodes (8): AttackClashSystem, calculateClashForce(), CLASH_CONFIG, compareClashAttacks(), distToSegment(), getElementalClashModifiers(), lineSegmentsIntersection(), getTypeMultiplier()

### Community 98 - "generate_dark_visual_sprites.js"
Cohesion: 0.24
Nodes (11): { createCanvas, loadImage }, ensureDir(), fs, generateNightSlashCross(), generateQuestionMarksDark(), generateSnarlSoundwave(), generateThiefSwipeDark(), main() (+3 more)

### Community 102 - "test_evolution_items_player.js"
Cohesion: 0.18
Nodes (7): evolutionManager, friendshipManager, itemEffectRegistry, playerProgressionService, prisma, PlayerProgressionService, prisma

## Knowledge Gaps
- **8 isolated node(s):** `socket.io-client`, `concurrently`, `sharp`, `dotenv`, `nodemon` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1271 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `EditorUI` connect `EditorUI` to `EditorUI.js`, `main.js`, `initApp`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `socket.io-client`, `concurrently`, `sharp` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `particleSystem.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1140819964349376 - nodes in this community are weakly interconnected._
- **Why does `6. Especificação individual por move` connect `6. Especificação individual por move` to `5. Biblioteca de famílias de VFX`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `EditorScene` be split into smaller, more focused modules?**
  _Cohesion score 0.06022282445046673 - nodes in this community are weakly interconnected._
- **Why does `PokemonStorageUI` connect `PokemonStorageUI` to `BagUI`, `battleHud.js`, `main.js`, `initApp`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `EditorUI` be split into smaller, more focused modules?**
  _Cohesion score 0.08009635651912074 - nodes in this community are weakly interconnected._