import fs from 'fs';
import { MOVES_BY_ID } from '../client/src/battle/movesDatabase.js';

const htmlPath = 'client/public/moves_catalog.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Update const moves = [...] (Filtering ONLY active combat compatible moves)
const movesArray = Object.values(MOVES_BY_ID).filter(m => m.activeCombatCompatible !== false);
console.log('Total moves to update in catalog (Active Combat):', movesArray.length);

const startTag = 'const moves = [';
const startIdx = html.indexOf(startTag);
if (startIdx === -1) {
  console.error('const moves = [ not found in moves_catalog.html!');
  process.exit(1);
}

const endTag = '];';
const endIdx = html.indexOf(endTag, startIdx);
if (endIdx === -1) {
  console.error('End of moves array not found in moves_catalog.html!');
  process.exit(1);
}

const newMovesJson = JSON.stringify(movesArray);
html = html.slice(0, startIdx + 'const moves = '.length) + newMovesJson + html.slice(endIdx + 1);
console.log('Successfully replaced moves array in moves_catalog.html!');

// Update badge and count in HTML
html = html.replace(/<span class="badge-total">[^<]*<\/span>/, `<span class="badge-total">${movesArray.length} Golpes Ativos</span>`);
html = html.replace(/<div class="stat-val" id="showingCount">[^<]*<\/div>/, `<div class="stat-val" id="showingCount">${movesArray.length}</div>`);


// 2. Enhance getImage to support file protocol & web root
const oldGetImage = `function getImage(file) {
      if (!file) return null;
      if (imageCache.has(file)) return imageCache.get(file);
      const img = new Image();
      img.src = '/assets/battle/animations/' + file;
      imageCache.set(file, img);
      return img;
    }`;

const newGetImage = `function getImage(file) {
      if (!file) return null;
      if (imageCache.has(file)) return imageCache.get(file);
      const img = new Image();
      if (file.startsWith('/') || file.startsWith('http')) {
        img.src = file;
      } else {
        const basePath = (typeof window !== 'undefined' && window.location.protocol === 'file:') ? 'assets/battle/animations/' : '/assets/battle/animations/';
        img.src = basePath + file;
      }
      imageCache.set(file, img);
      return img;
    }`;

if (html.includes(oldGetImage)) {
  html = html.replace(oldGetImage, newGetImage);
  console.log('Updated getImage function in moves_catalog.html!');
}

// 3. Update getTypePalette to support customColor (e.g. #7B1FA2 for Confuse Ray sinister beam)
const oldGetTypePalette = `function getTypePalette(type) {
      const c = getTypeColor(type);
      return {
        primary: c,
        glow: c + '88',
        inner: '#ffffff'
      };
    }`;

const newGetTypePalette = `function getTypePalette(type, customColor = null) {
      const c = customColor || getTypeColor(type);
      return {
        primary: c,
        glow: c + '88',
        inner: '#ffffff'
      };
    }`;

if (html.includes(oldGetTypePalette)) {
  html = html.replace(oldGetTypePalette, newGetTypePalette);
  console.log('Updated getTypePalette to support customColor!');
}

// 4. Update renderCombatBeam to accept customColor
const oldRenderCombatBeamHead = `function renderCombatBeam(ctx, startX, startY, targetX, targetY, progress, type, width = 34, spritesheetImg, spriteVisual) {
      ctx.save();
      const p = Math.max(0, Math.min(1, progress));
      const pal = getTypePalette(type);`;

const newRenderCombatBeamHead = `function renderCombatBeam(ctx, startX, startY, targetX, targetY, progress, type, width = 34, spritesheetImg, spriteVisual, customColor = null) {
      ctx.save();
      const p = Math.max(0, Math.min(1, progress));
      const pal = getTypePalette(type, customColor);`;

if (html.includes(oldRenderCombatBeamHead)) {
  html = html.replace(oldRenderCombatBeamHead, newRenderCombatBeamHead);
  console.log('Updated renderCombatBeam to support customColor!');
}

// 5. Update renderCombatLightning to skip procedural effects on noExtraVfx
const oldLightningCheck = `// 1. Procedural Lightning Bolt (only if not onlySprite)
      if (!onlySprite && (!spriteVisual || !spriteVisual.onlySprite)) {`;

const newLightningCheck = `// 1. Procedural Lightning Bolt (only if not onlySprite / noExtraVfx)
      const skipProcedural = onlySprite || (spriteVisual && (spriteVisual.onlySprite || spriteVisual.noExtraVfx));
      if (!skipProcedural) {`;

if (html.includes(oldLightningCheck)) {
  html = html.replace(oldLightningCheck, newLightningCheck);
  // Also ground flash
  html = html.replace(
    `      // Ground Flash\n      ctx.fillStyle = '#FFFFFF';`,
    `      // Ground Flash\n      if (!skipProcedural) {\n        ctx.fillStyle = '#FFFFFF';`
  );
  html = html.replace(
    `      ctx.fill();\n\n      ctx.restore();\n    }`,
    `      ctx.fill();\n      }\n\n      ctx.restore();\n    }`
  );
  console.log('Updated renderCombatLightning to respect noExtraVfx!');
}

// 6. Update renderCombatBuff to respect noExtraVfx
const oldHelixCode = `      // Ascending Double-Helix Particles
      for (let arm = 0; arm < 2; arm++) {
        const armOffset = arm * Math.PI;
        for (let p = 0; p < 5; p++) {
          const pFrac = (progress * 1.5 + p / 5) % 1.0;
          const rad = 17 * (1.1 - pFrac * 0.2);
          const ang = armOffset + pFrac * Math.PI * 3;
          const px = startX + Math.cos(ang) * rad;
          const py = startY + 11 - pFrac * 34;

          ctx.fillStyle = p % 2 === 0 ? pal.glow : pal.inner;
          ctx.globalAlpha = Math.sin(pFrac * Math.PI) * alpha * 0.85;
          ctx.beginPath();
          ctx.arc(px, py, 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }`;

const newHelixCode = `      // Ascending Double-Helix Particles (skipped if noExtraVfx is active)
      if (!spriteVisual || spriteVisual.noExtraVfx !== true) {
        for (let arm = 0; arm < 2; arm++) {
          const armOffset = arm * Math.PI;
          for (let p = 0; p < 5; p++) {
            const pFrac = (progress * 1.5 + p / 5) % 1.0;
            const rad = 17 * (1.1 - pFrac * 0.2);
            const ang = armOffset + pFrac * Math.PI * 3;
            const px = startX + Math.cos(ang) * rad;
            const py = startY + 11 - pFrac * 34;

            ctx.fillStyle = p % 2 === 0 ? pal.glow : pal.inner;
            ctx.globalAlpha = Math.sin(pFrac * Math.PI) * alpha * 0.85;
            ctx.beginPath();
            ctx.arc(px, py, 2.0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }`;

if (html.includes(oldHelixCode)) {
  html = html.replace(oldHelixCode, newHelixCode);
  console.log('Updated renderCombatBuff to respect noExtraVfx!');
}

// 7. Update renderMoveCombatScene:
// Pass move.color to renderCombatBeam and prioritize status/buff over offensive electric/slashes
const oldBeamCall = `} else if (move.executionType === 'beam') {
        renderCombatBeam(ctx, startX, startY - 8, targetX, targetY - 8, progress, move.type, width > 400 ? 42 : 30, spritesheetImg, move.visual);`;

const newBeamCall = `} else if (move.executionType === 'beam') {
        renderCombatBeam(ctx, startX, startY - 8, targetX, targetY - 8, progress, move.type, width > 400 ? 42 : 30, spritesheetImg, move.visual, move.color);`;

if (html.includes(oldBeamCall)) {
  html = html.replace(oldBeamCall, newBeamCall);
  console.log('Updated renderMoveCombatScene beam call with move.color!');
}

// Ensure Status / Buff check precedes offensive element family branches like Thunder / Earth / Slash
const oldBranchOrder = `      } else if (isDash) {
        // Physical dash rush: Volt Tackle, Bolt Strike, Blaze Kick, etc.
        renderCombatDash(ctx, startX, startY - 8, targetX, targetY - 8, progress, move, spritesheetImg, move.visual);
      } else if (move.vfxFamily === 'electric' || move.name.includes('Thunder') || move.name.includes('Bolt') || move.name.includes('Shock')) {`;

const newBranchOrder = `      } else if (isDash) {
        // Physical dash rush: Volt Tackle, Bolt Strike, Blaze Kick, etc.
        renderCombatDash(ctx, startX, startY - 8, targetX, targetY - 8, progress, move, spritesheetImg, move.visual);
      } else if (move.executionType === 'buff' || move.category === 'Status') {
        const isTargetFoe = move.visual?.target === 'target' || move.visual?.target === 'foe' || move.visual?.target === 'opponent';
        const buffX = isTargetFoe ? targetX : startX;
        const buffY = (isTargetFoe ? targetY : startY) - 8;
        renderCombatBuff(ctx, buffX, buffY, progress, move.type, spritesheetImg, move.visual);
      } else if (move.vfxFamily === 'electric' || move.name.includes('Thunder') || move.name.includes('Bolt') || move.name.includes('Shock')) {`;

if (html.includes(oldBranchOrder)) {
  html = html.replace(oldBranchOrder, newBranchOrder);
  // Remove the old buff branch further down if duplicated
  const duplicateBuff = `      } else if (move.executionType === 'buff' || move.category === 'Status') {
        const isTargetFoe = move.visual?.target === 'target' || move.visual?.target === 'foe' || move.visual?.target === 'opponent';
        const buffX = isTargetFoe ? targetX : startX;
        const buffY = (isTargetFoe ? targetY : startY) - 8;
        renderCombatBuff(ctx, buffX, buffY, progress, move.type, spritesheetImg, move.visual);`;
  
  // Find second occurrence if any
  const firstPos = html.indexOf(duplicateBuff);
  if (firstPos !== -1) {
    const secondPos = html.indexOf(duplicateBuff, firstPos + duplicateBuff.length);
    if (secondPos !== -1) {
      html = html.slice(0, secondPos) + html.slice(secondPos + duplicateBuff.length);
      console.log('Deduplicated status/buff branch in renderMoveCombatScene!');
    }
  }
  console.log('Prioritized status/buff moves before offensive element checks!');
}

// 8. Update renderCombatBuff sprite drawing to support spriteVisual.opacity, filter, and tight framing for shield_bubble
const oldBuffDraw1 = `        const sScale = spriteVisual.scale || 0.55;
        const dw = fw * sScale * 1.35;
        const dh = fh * sScale * 1.35;
        const offY = spriteVisual.offsetY || 0; // grass.png lowered to ground level

        ctx.globalAlpha = alpha * 0.85;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(spritesheetImg, sx, sy, fw, fh, startX - dw / 2, startY - dh / 2 + offY, dw, dh);`;

const oldBuffDraw2 = `        const isShieldBubble = spriteVisual.file && spriteVisual.file.includes('shield_bubble');
        const sScale = spriteVisual.scale || 0.55;
        const scaleMultiplier = isShieldBubble ? 1.0 : 1.35;
        const dw = fw * sScale * scaleMultiplier;
        const dh = fh * sScale * scaleMultiplier;
        const offY = spriteVisual.offsetY || 0;

        const baseOpacity = typeof spriteVisual.opacity === 'number' ? spriteVisual.opacity : 0.85;
        ctx.globalAlpha = alpha * baseOpacity;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(spritesheetImg, sx, sy, fw, fh, startX - dw / 2, startY - dh / 2 + offY, dw, dh);`;

const newBuffDraw = `        const isShieldBubble = spriteVisual.file && spriteVisual.file.includes('shield_bubble');
        const sScale = spriteVisual.scale || 0.55;
        const scaleMultiplier = isShieldBubble ? 1.0 : 1.35;
        const dw = fw * sScale * scaleMultiplier;
        const dh = fh * sScale * scaleMultiplier;
        const offY = spriteVisual.offsetY || 0;

        const baseOpacity = typeof spriteVisual.opacity === 'number' ? spriteVisual.opacity : 0.85;
        ctx.globalAlpha = alpha * baseOpacity;
        ctx.imageSmoothingEnabled = false;
        if (spriteVisual.filter) {
          ctx.filter = spriteVisual.filter;
        }
        ctx.drawImage(spritesheetImg, sx, sy, fw, fh, startX - dw / 2, startY - dh / 2 + offY, dw, dh);
        if (spriteVisual.filter) {
          ctx.filter = 'none';
        }`;

if (html.includes(oldBuffDraw2)) {
  html = html.replace(oldBuffDraw2, newBuffDraw);
  console.log('Updated renderCombatBuff with filter & opacity support!');
} else if (html.includes(oldBuffDraw1)) {
  html = html.replace(oldBuffDraw1, newBuffDraw);
  console.log('Updated renderCombatBuff with filter & opacity support!');
}

// 9. Update renderSpritesheetFrame to support visual.filter
const oldFrameDraw = `      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, sx, sy, fw, fh, dx, dy, dw, dh);`;

const newFrameDraw = `      ctx.imageSmoothingEnabled = false;
      if (visual && visual.filter) {
        ctx.filter = visual.filter;
      }
      ctx.drawImage(img, sx, sy, fw, fh, dx, dy, dw, dh);
      if (visual && visual.filter) {
        ctx.filter = 'none';
      }`;

if (html.includes(oldFrameDraw)) {
  html = html.replace(oldFrameDraw, newFrameDraw);
  console.log('Updated renderSpritesheetFrame with filter support!');
}

// 10. Update renderCombatBuff in moves_catalog.html to support Hail multi-shards & heart bursts
const oldBuffMultiShardSearch = `        ctx.drawImage(spritesheetImg, sx, sy, fw, fh, startX - dw / 2, startY - dh / 2 + offY, dw, dh);
        if (spriteVisual.filter) {
          ctx.filter = 'none';
        }`;

const newBuffMultiShardReplace = `        if (spriteVisual.isHail) {
          const shards = [
            { dx: 0, startY: -75, dropY: 82, pOffset: 0.0, sc: 0.95 },
            { dx: -18, startY: -85, dropY: 90, pOffset: 0.18, sc: 0.8 },
            { dx: 16, startY: -95, dropY: 96, pOffset: 0.36, sc: 0.85 },
            { dx: -8, startY: -70, dropY: 78, pOffset: 0.54, sc: 0.75 },
            { dx: 12, startY: -80, dropY: 88, pOffset: 0.72, sc: 0.8 }
          ];
          for (const sh of shards) {
            const shProg = (progress + sh.pOffset) % 1.0;
            const shFrame = spriteVisual.startFrame + Math.floor(shProg * totalFrames) % totalFrames;
            const shsx = (shFrame % cols) * fw;
            const shsy = Math.floor(shFrame / cols) * fh;
            const shdw = dw * sh.sc;
            const shdh = dh * sh.sc;
            const currentDropY = sh.startY + shProg * sh.dropY;
            ctx.drawImage(spritesheetImg, shsx, shsy, fw, fh, startX + sh.dx - shdw / 2, startY + currentDropY - shdh / 2 + offY, shdw, shdh);
          }
        } else {
          ctx.drawImage(spritesheetImg, sx, sy, fw, fh, startX - dw / 2, startY - dh / 2 + offY, dw, dh);
        }

        // Charm / Attract / Captivate / Lovely Kiss: Render heart particles
        if (spriteVisual.hearts) {
          const heartImg = getImage('vfx/custom/heart_burst.png');
          if (heartImg && heartImg.complete && heartImg.naturalWidth > 0) {
            const hCols = 8;
            const hRows = 1;
            const hfw = heartImg.naturalWidth / hCols;
            const hfh = heartImg.naturalHeight / hRows;
            const hFrame = Math.floor(progress * 8) % 8;
            const hsx = hFrame * hfw;
            const hsy = 0;
            const hdw = hfw * 0.95;
            const hdh = hfh * 0.95;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.drawImage(heartImg, hsx, hsy, hfw, hfh, startX - hdw / 2, startY - 12 - hdh / 2 + offY, hdw, hdh);
            ctx.restore();
          }
        }

        if (spriteVisual.filter) {
          ctx.filter = 'none';
        }`;

if (html.includes(oldBuffMultiShardSearch)) {
  html = html.replace(oldBuffMultiShardSearch, newBuffMultiShardReplace);
  console.log('Updated renderCombatBuff with Hail multi-shards & hearts in moves_catalog.html!');
}

// 11. Update renderMoveCombatScene in moves_catalog.html for Double Team clone & Growth/Minimize scaling
const oldBattlerDraw = `      const atkScale = width > 400 ? 1.2 : 0.9;
      drawCombatBattler(ctx, startX, startY, true, '#38bdf8', 0, progress * 10, atkScale);`;

const newBattlerDraw = `      let atkScale = width > 400 ? 1.2 : 0.9;
      if (move.visual?.isGrowth) {
        atkScale *= 1.0 + progress * 0.35;
      } else if (move.visual?.isMinimize) {
        atkScale *= Math.max(0.6, 1.0 - progress * 0.35);
      }

      // Double Team clone battler rendering beside the user
      if (move.visual?.isDoubleTeam) {
        const cloneAlpha = Math.sin(progress * Math.PI) * 0.6;
        ctx.save();
        ctx.globalAlpha = cloneAlpha;
        drawCombatBattler(ctx, startX + 24, startY + 4, true, '#38bdf8', 0, progress * 10, atkScale);
        ctx.restore();
      }

      drawCombatBattler(ctx, startX, startY, true, '#38bdf8', 0, progress * 10, atkScale);`;

if (html.includes(oldBattlerDraw)) {
  html = html.replace(oldBattlerDraw, newBattlerDraw);
  console.log('Updated renderMoveCombatScene with Double Team clone & Growth/Minimize battler scaling!');
}

// 12. Update renderCombatBeam in moves_catalog.html to overlay Fire Thrower spritesheet when isFireThrower is true
const oldBeamWaveSection = `      // Energy Wave Helices
      const waveCount = 4;
      ctx.strokeStyle = pal.inner;
      ctx.lineWidth = 1.6;
      ctx.globalAlpha = alpha * 0.75;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        for (let x = 0; x <= curDist; x += 10) {
          const s = Math.sin((x / 20) - (p * 22) + (w * Math.PI * 0.5));
          const y = s * (beamW * 0.38);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.restore();`;

const newBeamWaveSection = `      // Energy Wave Helices
      const waveCount = 4;
      ctx.strokeStyle = pal.inner;
      ctx.lineWidth = 1.6;
      ctx.globalAlpha = alpha * 0.75;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        for (let x = 0; x <= curDist; x += 10) {
          const s = Math.sin((x / 20) - (p * 22) + (w * Math.PI * 0.5));
          const y = s * (beamW * 0.38);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Fire Thrower Animated Flame Stream Overlay
      if (spriteVisual && (spriteVisual.isFireThrower || (spriteVisual.file && spriteVisual.file.includes('Fire thrower')))) {
        const ftImg = getImage('vfx/Fire thrower/fire_thrower_2.png');
        if (ftImg && ftImg.complete && ftImg.naturalWidth > 0 && curDist > 20) {
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          const totalFrames = 61;
          const cols = 8;
          const rows = 8;
          const fw = ftImg.naturalWidth / cols;
          const fh = ftImg.naturalHeight / rows;

          const flameCount = 5;
          ctx.globalAlpha = alpha * 0.95;

          for (let f = 0; f < flameCount; f++) {
            const fT = (p * 2.5 + f / flameCount) % 1.0;
            const fx = curDist * fT;
            const currentFrame = Math.floor((p * 45 + f * 12) % totalFrames);
            const col = currentFrame % cols;
            const row = Math.floor(currentFrame / cols);
            const sx = col * fw;
            const sy = row * fh;

            const fScale = (0.65 + fT * 0.75) * 0.95;
            const dw = fw * fScale;
            const dh = fh * fScale;

            ctx.drawImage(
              ftImg,
              sx, sy, fw, fh,
              fx - dw * 0.4, -dh / 2, dw, dh
            );
          }
          ctx.restore();
        }
      }

      ctx.restore();`;

if (html.includes(oldBeamWaveSection)) {
  html = html.replace(oldBeamWaveSection, newBeamWaveSection);
  console.log('Updated renderCombatBeam with Fire Thrower stream overlay!');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated client/public/moves_catalog.html!');


