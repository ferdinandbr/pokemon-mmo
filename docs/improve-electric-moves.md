# Plano de Implementação: Melhoria Completa dos Golpes Elétricos

> **Slug da Tarefa**: `improve-electric-moves`  
> **Objetivo**: Implementar sprites dedicados, animações em pixel art e mecânicas específicas para os 17 golpes elétricos solicitados pelo usuário, com suporte a paleta dupla (Ciano/Azul Zekrom para Bolt Strike e Fusion Bolt; Amarelo/Dourado clássico para os demais).

---

## 1. Mapeamento das Mecânicas e Visuais por Golpe

| # | Golpe | Categoria | Mecânica & Visual Solicitado |
|---|---|---|---|
| 1 | **Bolt Strike** | Dash Físico | Sprite de carregamento azul/ciano no atacante durante o dash + sprite de raio/bolt massivo descendo no alvo ao colidir (Imagem 1). |
| 2 | **Thunder** | Especial | Sprite de carregamento dourado no atacante + projétil elétrico + impacto de bolt elétrico vertical (Imagem 2). |
| 3 | **Volt Tackle** | Dash Físico | Idêntico ao Bolt Strike, porém em amarelo/dourado clássico (carregamento elétrico no dash + impacto de bolt). |
| 4 | **Zap Cannon** | Projétil | Projétil concentrado de plasma elétrico + efeito de eletrocutado no alvo no impacto. |
| 5 | **Fusion Bolt** | Dash Aéreo | Mecânica idêntica a Dragon Ascent: investida inicial -> sobe ao céu inalvejável com eletricidade azul -> mergulho devastador de raio. |
| 6 | **Thunderbolt** | Feixe/Raio | Descarga elétrica contínua conectando atacante e defensor (Imagem 3) + efeito de eletrocutado no alvo. |
| 7 | **Wild Charge** | Dash Físico | Aura e faíscas de carregamento elétrico no player durante a investida. |
| 8 | **Discharge** | Especial Radial | Carregamento prévio no player seguido de descarga/saraivada radial de raios no oponente. |
| 9 | **Volt Switch** | Dash / Hit-and-Run | Efeito de impacto com soco elétrico idêntico a Thunder Punch + recuo ágil. |
| 10 | **Thunder Fang** | Mordida Física | Usar spritesheet `core/teeth.png` com tintura e partículas elétricas amarelas. |
| 11 | **Electroweb** | Projétil / Teia | Projétil elétrico disparado + overlay da teia `vfx/custom/spider_web.png` colorida em amarelo elétrico no alvo com desaceleração. |
| 12 | **Thunder Wave** | Status / Onda | Sprite de onda/pulsos concêntricos elétricos que atingem e paralisam o inimigo. |
| 13 | **Parabolic Charge** | Área no Chão | Ondas de choque elétricas circulares expansivas no chão (Imagem 4) + filamentos de drenagem de HP curando o usuário. |
| 14 | **Electric Terrain** | Terreno / Campo | Raios elétricos ramificados correndo pelo chão com decalques de solo energizado. |
| 15 | **Magnet Rise** | Buff / Carga | Aura ascendente de carregamento eletromagnético envolvendo o corpo do Pokémon. |
| 16 | **Thunder Shock** | Projétil | Faísca/disparo elétrico rápido + efeito de eletrocutado no alvo atingido. |
| 17 | **Electro Ball** | Projétil | Orbe de plasma elétrico veloz + efeito de eletrocutado no alvo atingido. |

---

## 2. Spritesheets Pixel Art Dedicados a Gerar

1. `electric_charge_yellow.png` & `electric_charge_blue.png` (64x64, 6 frames) — Esfera e anéis pulsantes de eletricidade ao redor do corpo.
2. `electric_bolt_impact_yellow.png` & `electric_bolt_impact_blue.png` (96x128, 6 frames) — Raio vertical fulminante descendo do céu com explosão e estilhaços elétricos.
3. `electrocuted_burst.png` (64x64, 6 frames) — Arco elétrico frenético vibrando sobre o Pokémon eletrocutado.
4. `electric_shockwave_rings.png` (128x128, 6 frames) — Anéis concêntricos elétricos no chão com rachaduras de relâmpago (Imagem 4).
5. `electric_wave.png` (64x64, 6 frames) — Onda transversal de pulso elétrico para Thunder Wave.
6. `electroweb.png` (80x80, 5 frames) — Teia de aranha amarela eletrificada com nós de alta voltagem.
7. `electric_terrain_decal.png` (160x160, 4 frames) — Fissuras energizadas de solo com raios rastejantes.

---

## 3. Arquivos a Modificar

1. `scripts/generate_electric_visual_sprites.js` (gerador com node-canvas).
2. `client/src/battle/movesDatabase.js` (atualização das configs visuais e comportamentos dos 17 golpes).
3. `client/src/battle/pixelArtVfx.js` (renderizadores de renderElectricCharge, renderElectricBolt, renderElectrocuted, etc.).
4. `client/src/battle/particleSystem.js` (spawners e updates de auras, choques no chão e overlays).
5. `client/src/battle/pokemonEntity.js` (suporte a `isFusionBolt`, dash auras elétricas e efeito de paralisia).
