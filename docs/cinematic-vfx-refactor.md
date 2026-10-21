# Plano de Refatoração: Cinematic VFX para ParticleSystem & PixelArtVfx

## 1. Visão Geral e Arquitetura

O objetivo é transformar os efeitos visuais (VFX) da batalha de um estilo 100% pixelado rígido (quadradinhos opacos de 3-4px) em uma estética **Cinematográfica 2D Fluida**:
- Halo e brilho volumétrico suave através de gradientes radiais em camadas e blend aditivo (`lighter`).
- Movimentação fluida subpixel (remoção de `Math.round` restritivo nas posições de partículas e vetores).
- Preservação da nitidez e autenticidade dos sprites de Pokémon, cenários e UI em pixel art.
- Desempenho alto em Canvas 2D sem alocação abusiva de lixo (GC) no loop principal de 60 FPS.

## 2. Componentes e Arquivos Alvo

1. **`client/src/battle/particleSystem.js`**:
   - `spawnPixelBurst` / `burst` / `createExplosion`: Transição de cubos de 3px para partículas radiantes com halo, flash inicial de impacto, faíscas secundárias e rastro de luz.
   - `spawnFlame`: Núcleo quente branco com halo gradiente fogo (amarelo/laranja/vermelho), rotação orgânica e ascensão fluida.
   - `spawnWater`: Gotas fluidas e translúcidas com specular highlight e pequenas ondas de dispersão.
   - `spawnSparks`: Arcos finos e zaps luminosos com rastro rápido e emissão radial.
   - `spawnDust`: Nuvens suaves e volumétricas de poeira (com fade-out orgânico).
   - `areaRings` (Shockwaves): Substituição de pontilhado de 16 quadrados por ondas de choque anulares suaves com espessura interpolada e dissipação suave (`globalAlpha` + gradiente ou stroke suave com glow).
   - `render`: Suporte a `lighter` seletivo nos grupos de partículas brilhantes, restauração estrita de estado com `save()` / `restore()`.

2. **`client/src/battle/pixelArtVfx.js`**:
   - `renderPixelContinuousBeam`: Feixe de energia cilíndrico luminoso com núcleo branco quente, borda de energia oscilante e partículas espirais ao longo do feixe.
   - `renderPixelSlash` / `renderPixelCrossSlash`: Cortes luminosos em arcos dinâmicos elegantes com gradiente ao longo da lâmina e faíscas de corte.
   - `renderPixelPunch`: Flash de impacto de punho com ondas concêntricas de concussão e partículas de impacto.
   - `renderPixelBite`: Presas de energia estilizadas com fecho rápido e estilhaços pontiagudos.
   - `renderPixelFireBlast`: Símbolo de fogo fluido e flamejante com labaredas dinâmicas, explosão de calor e expansão volumétrica.
   - `renderPixelLightningBolt`: Relâmpago ramificado gerado proceduralmente com halo elétrico intenso e ponto de impacto energizado.
   - `renderPixelStoneEdge`: Pináculos rochosos com fraturas luminosas e poeira de detritos de terra.
   - `renderPixelFoliageBurst`, `renderPixelIceCrystals`, `renderPixelPoisonBurst`, `renderPixelShadowPulse`, `renderPixelPsychicRings`, `renderPixelStatArrows`, `renderPixelElementalBuffSpiral`.
   - Efeitos de status persistentes: `renderPixelBurnFlames` (fogo fluido), `renderPixelParalysisArcs` (mini arcos elétricos), `renderPixelIceBlock` (gelo translúcido lapidado), `renderPixelPoisonBubbles` (bolhas orgânicas translúcidas).

## 3. Preservação de Compatibilidade

- Assinaturas de métodos mantidas 100% idênticas:
  - `ParticleSystem.spawnPixelBurst(x, y, color, count, speed, life, size)`
  - `ParticleSystem.spawnFlame(x, y, count)`
  - `ParticleSystem.spawnWater(x, y, count)`
  - `ParticleSystem.spawnSparks(x, y, count)`
  - `ParticleSystem.spawnDust(x, y, count)`
  - `ParticleSystem.spawnShockwave(x, y, maxRadius, color, duration)`
  - `ParticleSystem.addBeam(...)`, `spawnSlash(...)`, `spawnPunch(...)`, etc.
- Spritesheets existentes mantidas funcionais com renderização nítida original e sobreposição cinematográfica aprimorada.
