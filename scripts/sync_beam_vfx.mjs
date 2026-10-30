import fs from 'fs';

const html = fs.readFileSync('client/public/moves_catalog.html', 'utf8');
const vfx = fs.readFileSync('client/src/battle/pixelArtVfx.js', 'utf8');

// 1. Extract TYPE_PALETTES and getTypePalette from moves_catalog.html
const palStart = html.indexOf('const TYPE_PALETTES = {');
const palEnd = html.indexOf('function getFamilyBadge', palStart);
if (palStart === -1 || palEnd === -1) {
  throw new Error('Could not find TYPE_PALETTES in moves_catalog.html');
}
let palBlock = html.substring(palStart, palEnd).trim();
palBlock = palBlock.replace('const TYPE_PALETTES', 'export const TYPE_PALETTES');
palBlock = palBlock.replace('function getTypePalette', 'export function getTypePalette');
// Ensure backward compatibility with `pal.inner`
palBlock = palBlock.replace('return basePal;', 'return { inner: basePal.core || "#FFFFFF", ...basePal };');
palBlock = palBlock.replace(/secondary:\s*customColor\s*};/, 'secondary: customColor,\n        inner: "#FFFFFF"\n      };');

// 2. Extract renderCombatBeam from moves_catalog.html
const beamStart = html.indexOf('function renderCombatBeam(');
if (beamStart === -1) {
  throw new Error('Could not find renderCombatBeam in moves_catalog.html');
}
const marker = 'function renderDracoMeteorCombat(';
const beamEndBeforeMarker = html.indexOf(marker, beamStart);
if (beamEndBeforeMarker === -1) {
  throw new Error('Could not find marker before renderDracoMeteorCombat');
}
const beamEnd = html.lastIndexOf('}', beamEndBeforeMarker);
let beamBlock = html.substring(beamStart, beamEnd + 1).trim();
beamBlock = 'export ' + beamBlock;

// Unindent 4 spaces
const lines = beamBlock.split(/\r?\n/).map(line => line.startsWith('    ') ? line.slice(4) : line);
beamBlock = lines.join('\n');

const replacement = palBlock + '\n\n/**\n * Continuous Elemental & Volumetric Laser Beams (Synchronized with Move Catalog)\n */\n' + beamBlock + '\n\n';

// 3. Find replacement range in pixelArtVfx.js
const vfxStart = vfx.indexOf('export function getTypePalette(type, customColor = null)');
const vfxBarrier = vfx.indexOf('export function renderDefensiveBarrier');
if (vfxStart === -1 || vfxBarrier === -1) {
  throw new Error('Could not find replacement boundaries in pixelArtVfx.js');
}
const vfxEnd = vfx.lastIndexOf('/**', vfxBarrier);

const newVfx = vfx.substring(0, vfxStart) + replacement + vfx.substring(vfxEnd);

fs.writeFileSync('client/src/battle/pixelArtVfx.js', newVfx, 'utf8');
console.log('Successfully synchronized TYPE_PALETTES and renderCombatBeam into client/src/battle/pixelArtVfx.js!');

