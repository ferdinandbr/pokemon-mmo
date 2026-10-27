# Graph Report - PokeMMO  (2026-10-26)

## Corpus Check
- 470 files · ~2,049,160 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 46 file(s) not represented in the graph (top: .mid 33, (none) 5, .css 3)

## Summary
- 2585 nodes · 4482 edges · 103 communities (65 shown, 38 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 180 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b98c3a38`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- particleSystem.js
- EditorScene
- EditorUI
- pixelArtVfx.js
- pokemonData.js
- BattleHud
- WorldScene.js
- PokemonEntity
- ParticleSystem
- database.js
- BagUI
- generate_shiny_overworld.cjs
- BattleEngine
- BattleArena
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
- Plano de Refatoração: Cinematic VFX para ParticleSystem & PixelArtVfx
- mapRoutes.js
- pokemonService.js
- package.json
- generate_electric_visual_sprites.js
- client/package.json
- StarterSelectionUI
- AuthUI
- BattleManager.js
- OakIntroUI
- LocalPlayer
- ProjectileSystem
- WeatherManager
- 5. Biblioteca de famílias de VFX
- 🔍 Detalhamento por Tipo Elemental (com Sprites)
- repack-tilesets.js
- RoomManager
- MoveRegistry.js
- ref_fs
- MoveLearnUI
- EncounterService
- WorldService
- database.js
- 🔄 4. Fases de Execução Detalhadas
- check_target_moves.js
- soundManager
- initApp
- attackClashSystem.js
- main.js
- DayNightManager
- generate-pokemon-sprites.js
- reorganize_sprites.cjs
- battleHandler.js
- Plano de Implementação: Melhoria Completa dos Golpes Elétricos
- generate_heal_pillars.js
- sync-tiled-maps.js
- 🗺️ Mapeamento de Peculiaridades de Movimentação e Animação no Combate Ativo
- pokemonEntity.js
- characterService.js
- server/package.json
- renderCombatProjectile
- authService.js
- EvolutionUI
- DamageCalculator.js
- PokemonProgressionService
- FlowerAnimationManager
- TallGrassManager
- scripts/set_admin.js
- .destroy
- ChatUI
- PokemonService
- canvas
- DialogueBox
- playerHandler.js
- sync_essentials_items.js
- MoveEffectHandler
- .update
- CharacterUI
- generate_ground_spritesheets.js
- measure_ground.js
- slice_ground_sprites.js
- ShopUI
- MenuUI
- generate_bug_visual_sprites.js
- ref_path
- RemotePlayer
- seed_pokemon_pbs.js
- test_battle_arena_decals.js
- scripts
- PvpManager
- extrude-all-tilesets.js
- generate_dark_visual_sprites.js
- getTypePalette
- Pokémon da Geração I — Altura e Peso
- PvpChallengeModalUI

## God Nodes (most connected - your core abstractions)
1. `6. Especificação individual por move` - 622 edges
2. `EditorScene` - 83 edges
3. `EditorUI` - 81 edges
4. `ParticleSystem` - 62 edges
5. `PokemonEntity` - 55 edges
6. `WorldScene` - 47 edges
7. `BattleEngine` - 43 edges
8. `BagUI` - 32 edges
9. `BattleHud` - 31 edges
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

## Communities (103 total, 38 thin omitted)

### Community 0 - "particleSystem.js"
Cohesion: 0.10
Nodes (37): ANIMATION_FILES, ELEMENT_VFX_FILTERS, MOVE_ANIM_CACHE, renderCombatEarth(), renderCombatLightning(), renderCombatPunch(), renderCombatSoundWave(), renderDazzleFlare() (+29 more)

### Community 2 - "EditorUI"
Cohesion: 0.08
Nodes (3): EditorUI, isImageReady(), normalizeTilesetImage()

### Community 3 - "pixelArtVfx.js"
Cohesion: 0.11
Nodes (26): BITE_FANGS_BOTTOM, BITE_FANGS_TOP, BODY_MATRIX, DARK_PULSE_FRAMES, DARK_WAVE_FRAMES, drawMistyFairyStar(), drawPinkPadlock(), ELECTRIC_SPARK_FRAMES (+18 more)

### Community 4 - "pokemonData.js"
Cohesion: 0.22
Nodes (11): adaptPokemonForBattle(), calculateCombatDamage(), calculateDodgeCooldown(), calculateMoveCooldown(), calculateMovementSpeed(), calculatePokemonStats(), DEFAULT_SPECIES_MOVES, getMoveSound() (+3 more)

### Community 5 - "BattleHud"
Cohesion: 0.07
Nodes (13): bgmManager, REGION_BGM_MAP, applyPortraitWithFallback(), BattleHud, getPmdPortraitUrl(), getPokemonTypes(), preloadPmdPortraits(), GEN1_SPECIES (+5 more)

### Community 6 - "WorldScene.js"
Cohesion: 0.06
Nodes (23): spawnDustEffect(), spawnLandingDust(), PLAYER_VISUAL, COLLISION_META, COLLISION_TYPES, DEFAULT_MART_ITEMS, NPC_SPRITES, NPC_TYPES (+15 more)

### Community 9 - "database.js"
Cohesion: 0.07
Nodes (22): evolutionManager, friendshipManager, itemEffectRegistry, playerProgressionService, prisma, EvolutionManager, moveManager, moveRegistry (+14 more)

### Community 10 - "BagUI"
Cohesion: 0.07
Nodes (9): BagUI, getItemCategoryLabel(), getItemIcon(), PartyHUDUI, PokemonStorageUI, TYPE_ICONS, formatSpeciesId(), getPokemonAnimatedSprite() (+1 more)

### Community 11 - "generate_shiny_overworld.cjs"
Cohesion: 0.05
Nodes (35): heights, PMD_DIR, result, ROOT, TABLE, ANIM_BACK_NORM, ANIM_BACK_SHINY, ANIM_FRONT_NORM (+27 more)

### Community 13 - "BattleArena"
Cohesion: 0.10
Nodes (4): BattleArena, DecalSystem, GROUND_DECAL_ALIASES, GROUND_DECAL_CONFIGS

### Community 15 - "server.js"
Cohesion: 0.05
Nodes (43): express, jsonwebtoken, app, authRoutes, charRoutes, clientDistDir, cors, encounterRoutes (+35 more)

### Community 16 - "6. Especificação individual por move"
Cohesion: 0.00
Nodes (622): #100 --- Vital Throw, #101 --- Circle Throw, #102 --- Force Palm, #103 --- Low Sweep, #104 --- Revenge, #105 --- Rolling Kick, #106 --- Wake-Up Slap, #107 --- Karate Chop (+614 more)

### Community 17 - "import_items.js"
Cohesion: 0.27
Nodes (9): calculatePrice(), downloadImage(), fs, ITEMS_DIR, main(), mapCategory(), path, prisma (+1 more)

### Community 18 - "download_sprites.cjs"
Cohesion: 0.09
Nodes (20): baseDir, downloadFile(), fs, https, outNormalDir, outShinyDir, path, run() (+12 more)

### Community 20 - "movesDatabase.js"
Cohesion: 0.08
Nodes (22): getMoveData(), INCOMPATIBLE_ACTIVE_COMBAT_MOVES, isActiveCombatMove(), MOVES_BY_ID, MOVES_BY_NAME, fs, { loadImage }, { MOVES_BY_ID } (+14 more)

### Community 21 - "PmdSprite"
Cohesion: 0.16
Nodes (8): ANIMATION_FALLBACKS, DIRECTION_NAME_TO_INDEX, METADATA_CACHE, OverworldSprite, PMD_DIRECTIONS, PmdSprite, SHEET_CACHE, vectorToPmdDirection()

### Community 23 - "NPC"
Cohesion: 0.08
Nodes (12): NPC, 1. Visão Geral, 2. Fases de Execução, Fase 1: Importação de Assets & Registro de Spritesheets, Fase 2: Entidade NPC no Cliente (`NPC.js`), Fase 3: Interface de Seleção do Inicial (`StarterSelectionUI.js`), Fase 4: Backend & Persistência do Inicial e Batalhas, Fase 5: Loja Poké Mart (`ShopUI.js`) (+4 more)

### Community 25 - "Plano de Refatoração: Cinematic VFX para ParticleSystem & PixelArtVfx"
Cohesion: 0.50
Nodes (3): 1. Visão Geral e Arquitetura, 3. Preservação de Compatibilidade, Plano de Refatoração: Cinematic VFX para ParticleSystem & PixelArtVfx

### Community 26 - "mapRoutes.js"
Cohesion: 0.22
Nodes (7): DEFAULT_MAP_PATH, express, fs, MAPS_DIR, path, router, TILESETS_DIR

### Community 27 - "pokemonService.js"
Cohesion: 0.08
Nodes (18): ROOM_DEFINITIONS, pokemonService, prisma, roomManager, moveManager, moveRegistry, prisma, characterService (+10 more)

### Community 28 - "package.json"
Cohesion: 0.11
Nodes (17): description, devDependencies, canvas, concurrently, sharp, sharp, name, scripts (+9 more)

### Community 29 - "generate_electric_visual_sprites.js"
Cohesion: 0.27
Nodes (13): { createCanvas, loadImage }, drawPixelLine(), fs, generateElectricBoltImpact(), generateElectricCharge(), generateElectricShockwaveRings(), generateElectricTerrain(), generateElectricWave() (+5 more)

### Community 30 - "client/package.json"
Cohesion: 0.11
Nodes (16): dependencies, phaser, socket.io-client, webaudio-tinysynth, description, devDependencies, vite, socket.io-client (+8 more)

### Community 33 - "BattleManager.js"
Cohesion: 0.10
Nodes (16): catchCalculator, damageCalculator, encounterService, friendshipManager, moveEffectHandler, moveManager, moveRegistry, playerProgressionService (+8 more)

### Community 36 - "ProjectileSystem"
Cohesion: 0.25
Nodes (4): getMoveAnimImg(), renderPixelMatrix(), getProjectileVisuals(), ProjectileSystem

### Community 38 - "5. Biblioteca de famílias de VFX"
Cohesion: 0.07
Nodes (28): 1. Objetivo, 2. Regras globais obrigatórias, 3. Pipeline visual padrão, 4. Como escolher os recursos, 5. Biblioteca de famílias de VFX, 7. Contrato sugerido para cada definição de VFX, 8. Critérios de aceite, 9. Nota sobre precisão (+20 more)

### Community 39 - "🔍 Detalhamento por Tipo Elemental (com Sprites)"
Cohesion: 0.09
Nodes (22): 🔍 Detalhamento por Tipo Elemental (com Sprites), 🎨 Galeria Visual dos Spritesheets da Engine de Batalha, 📖 Relatório Completo: Todos os 621 Movimentos (Moves) e Seus Sprites, 📑 Tabela Completa de Todos os 621 Golpes com Sprite Associado, ⚡ Tipo: BUG (25 golpes), ⚡ Tipo: DARK (32 golpes), ⚡ Tipo: DRAGON (14 golpes), ⚡ Tipo: ELECTRIC (27 golpes) (+14 more)

### Community 40 - "repack-tilesets.js"
Cohesion: 0.25
Nodes (6): backupDir, { createCanvas, loadImage }, fs, path, tilesetDir, toRepack

### Community 42 - "MoveRegistry.js"
Cohesion: 0.06
Nodes (25): 1. Escopo e Decisões Alinhadas, 2. Tarefas de Implementação, Fase 1: Marcação de Compatibilidade no Catálogo de Golpes, Fase 2: Lógica de Seleção e Aprendizado no Servidor, Fase 3: Script de Migração dos Pokémons Existentes, Fase 4: Proteção no Cliente de Batalha, Fase 5: Verificação e Validação, Plano de Implementação: Filtragem e Adaptação de Golpes para Combate Ativo (PokeMMO) (+17 more)

### Community 43 - "ref_fs"
Cohesion: 0.07
Nodes (19): content, files, current, fs, lines, targets, content, fs (+11 more)

### Community 47 - "database.js"
Cohesion: 0.14
Nodes (7): @prisma/client, prisma, { PrismaClient }, prisma, prisma, prisma, { PrismaClient }

### Community 48 - "🔄 4. Fases de Execução Detalhadas"
Cohesion: 0.12
Nodes (14): 🎯 1. Visão Geral e Novos Objetivos, 2.1 Alterações no Banco de Dados (Prisma Schema), 2.2 Serviços de Backend, 🏛️ 2. Arquitetura Técnica & Banco de Dados, 📋 3. Mapeamento de Pokémons por Amizade (Happiness), 🔄 4. Fases de Execução Detalhadas, 🧪 5. Critérios de Validação & Testes, Fase 1: Atualização do Banco & Progressão do Jogador (Treinador) (+6 more)

### Community 49 - "check_target_moves.js"
Cohesion: 0.17
Nodes (9): MOVES_BY_INTERNAL, fs, { loadImage }, { MOVES_BY_INTERNAL }, path, { getProjectileVisuals }, { MOVES_BY_INTERNAL }, targetMoves (+1 more)

### Community 51 - "initApp"
Cohesion: 0.24
Nodes (3): checkRoute(), initApp(), SocketClient

### Community 52 - "attackClashSystem.js"
Cohesion: 0.25
Nodes (8): AttackClashSystem, calculateClashForce(), CLASH_CONFIG, compareClashAttacks(), distToSegment(), getElementalClashModifiers(), lineSegmentsIntersection(), getTypeMultiplier()

### Community 55 - "generate-pokemon-sprites.js"
Cohesion: 0.22
Nodes (9): args, fs, generate(), getCell(), H_LINES, INPUT, OUTPUT_DIR, path (+1 more)

### Community 56 - "reorganize_sprites.cjs"
Cohesion: 0.18
Nodes (10): backDir, backNormalDir, backShinyDir, baseDir, frontNormalDir, frontShinyDir, fs, path (+2 more)

### Community 57 - "battleHandler.js"
Cohesion: 0.18
Nodes (7): PlayerProgressionService, prisma, battleManager, playerProgressionService, pokemonService, prisma, roomManager

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
Cohesion: 0.19
Nodes (8): renderDefensiveBarrier(), renderDizzyStars(), renderPixelParalysisArcs(), renderPixelPoisonBubbles(), DEFAULT_ATTACK_ORIGINS, PMD_DIR_ANGLES, SPECIES_ATTACK_ORIGINS, SPECIES_SIZE

### Community 63 - "characterService.js"
Cohesion: 0.12
Nodes (10): createCharacter(), getCharacterDetails(), prisma, battleManager, itemEffectRegistry, pokemonProgressionService, pokemonService, prisma (+2 more)

### Community 64 - "server/package.json"
Cohesion: 0.08
Nodes (25): cors, dotenv, nodemon, prisma, socket.io, dependencies, bcryptjs, cors (+17 more)

### Community 65 - "renderCombatProjectile"
Cohesion: 0.16
Nodes (14): renderAirCutterCombat(), renderBurningAuraCombat(), renderCombatProjectile(), renderCombatSlash(), renderDracoMeteorCombat(), renderDragonAscentCombat(), renderDragonRageCombat(), renderElectricBoltImpactCombat() (+6 more)

### Community 66 - "authService.js"
Cohesion: 0.20
Nodes (5): bcryptjs, bcrypt, jwt, { JWT_SECRET }, prisma

### Community 67 - "EvolutionUI"
Cohesion: 0.29
Nodes (3): EvolutionUI, findPartySpeciesId(), isBattleOpen()

### Community 68 - "DamageCalculator.js"
Cohesion: 0.33
Nodes (4): DamageCalculator, { getEffectiveness }, EFFECTIVENESS, getEffectiveness()

### Community 72 - "scripts/set_admin.js"
Cohesion: 0.29
Nodes (5): envPaths, fs, path, prisma, serverNodeModules

### Community 76 - "canvas"
Cohesion: 0.08
Nodes (14): canvas, { createCanvas, loadImage }, { createCanvas, loadImage }, fs, MAPS_DIR, path, TILESETS_DIR, { createCanvas, loadImage } (+6 more)

### Community 79 - "playerHandler.js"
Cohesion: 0.17
Nodes (9): WEATHER_DURATION_RANGES, WEATHER_TRANSITIONS, WEATHER_TYPES, battleManager, characterService, pokemonService, prisma, roomManager (+1 more)

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

### Community 90 - "ref_path"
Cohesion: 0.08
Nodes (14): getFiles(), list, { createCanvas, loadImage }, fs, path, files, fs, path (+6 more)

### Community 92 - "seed_pokemon_pbs.js"
Cohesion: 0.33
Nodes (4): fs, path, prisma, { PrismaClient }

### Community 93 - "test_battle_arena_decals.js"
Cohesion: 0.40
Nodes (3): { createCanvas, loadImage }, fs, path

### Community 95 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, dev, prisma:generate, prisma:push, prisma:studio, seed, start

### Community 97 - "extrude-all-tilesets.js"
Cohesion: 0.22
Nodes (7): backupDir, { createCanvas, loadImage }, fs, mapsDir, path, tilesetDir, tilesetList

### Community 98 - "generate_dark_visual_sprites.js"
Cohesion: 0.24
Nodes (11): { createCanvas, loadImage }, ensureDir(), fs, generateNightSlashCross(), generateQuestionMarksDark(), generateSnarlSoundwave(), generateThiefSwipeDark(), main() (+3 more)

### Community 99 - "getTypePalette"
Cohesion: 0.32
Nodes (8): getTypeColor(), getTypePalette(), renderCombatBeam(), renderCombatBite(), renderCombatBuff(), renderCombatDash(), renderNightDazeCombat(), renderXScissorCombat()

### Community 101 - "Pokémon da Geração I — Altura e Peso"
Cohesion: 0.33
Nodes (5): Como usar as medidas, Fontes, Pokémon da Geração I — Altura e Peso, Sugestão para redimensionamento, Tabela completa

## Knowledge Gaps
- **8 isolated node(s):** `socket.io-client`, `concurrently`, `sharp`, `dotenv`, `nodemon` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1336 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **38 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `EditorUI` connect `EditorUI` to `initApp`, `main.js`, `WorldScene.js`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `socket.io-client`, `concurrently`, `sharp` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `particleSystem.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10121457489878542 - nodes in this community are weakly interconnected._
- **Why does `6. Especificação individual por move` connect `6. Especificação individual por move` to `5. Biblioteca de famílias de VFX`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `EditorScene` be split into smaller, more focused modules?**
  _Cohesion score 0.06022282445046673 - nodes in this community are weakly interconnected._
- **Why does `EditorScene` connect `EditorScene` to `main.js`, `WorldScene.js`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `EditorUI` be split into smaller, more focused modules?**
  _Cohesion score 0.08148148148148149 - nodes in this community are weakly interconnected._