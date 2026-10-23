const fs = require('fs');

const filePath = 'client/src/battle/particleSystem.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports if not present
const importToAdd = `  renderElectricChargeCombat,
  renderElectricBoltImpactCombat,
  renderElectrocutedCombat,
  renderParabolicRingsCombat,
  renderElectricWaveCombat,
  renderElectrowebCombat,
  renderElectricTerrainCombat,`;

if (!content.includes('renderElectricChargeCombat')) {
  content = content.replace('  renderBurningAuraCombat,', `  renderBurningAuraCombat,\n${importToAdd}`);
  console.log('Added imports to particleSystem.js');
}

// 2. Add ANIMATION_FILES
const filesToAdd = `  'vfx/custom/electric_charge_yellow.png',
  'vfx/custom/electric_charge_blue.png',
  'vfx/custom/electric_bolt_impact_yellow.png',
  'vfx/custom/electric_bolt_impact_blue.png',
  'vfx/custom/electrocuted_burst.png',
  'vfx/custom/electric_shockwave_rings.png',
  'vfx/custom/electric_wave.png',
  'vfx/custom/electroweb.png',
  'vfx/custom/electric_terrain_decal.png',`;

if (!content.includes('vfx/custom/electric_charge_yellow.png')) {
  content = content.replace("'vfx/earth/ground_stone_ring.png',", `'vfx/earth/ground_stone_ring.png',\n${filesToAdd}`);
  console.log('Added files to ANIMATION_FILES');
}

// 3. Add to constructor
const ctorProps = `    this.electricCharges = [];
    this.electricBolts = [];
    this.electrocutedOverlays = [];
    this.parabolicRings = [];
    this.electricWaves = [];
    this.electrowebs = [];
    this.electricTerrains = [];`;

if (!content.includes('this.electricCharges = [];')) {
  content = content.replace('this.burningAuras = [];', `this.burningAuras = [];\n${ctorProps}`);
  content = content.replace('this.burningAuras = [];\n  }', `this.burningAuras = [];\n${ctorProps}\n  }`);
  console.log('Added electric arrays to constructor and reset');
}

// 4. Add spawn methods
const spawnMethods = `
  // =========================================================================
  // ELECTRIC VISUAL ATTACK SPAWNERS
  // =========================================================================

  spawnElectricCharge(entity, duration = 0.85, isBlue = false) {
    this.electricCharges.push({
      entity,
      targetX: entity.x,
      targetY: entity.y,
      duration,
      time: 0,
      isBlue,
    });
  }

  spawnElectricBolt(targetX, targetY, duration = 0.55, isBlue = false, visual = null, onHit = null, target = null, skill = null) {
    this.electricBolts.push({
      targetX,
      targetY,
      duration,
      time: 0,
      isBlue,
      visual,
      onHit,
      target,
      skill,
      hasHit: false,
    });
  }

  spawnElectrocutedOverlay(target, duration = 0.60) {
    this.electrocutedOverlays.push({
      target,
      targetX: target.x,
      targetY: target.y,
      duration,
      time: 0,
    });
  }

  spawnParabolicRings(targetX, targetY, duration = 0.75, visual = null) {
    this.parabolicRings.push({
      targetX,
      targetY,
      duration,
      time: 0,
      visual,
    });
  }

  spawnElectricWave(startX, startY, targetX, targetY, duration = 0.65, visual = null, onHit = null, target = null, skill = null) {
    this.electricWaves.push({
      startX,
      startY,
      targetX,
      targetY,
      duration,
      time: 0,
      visual,
      onHit,
      target,
      skill,
      hasHit: false,
    });
  }

  spawnElectroweb(target, duration = 1.20, visual = null) {
    this.electrowebs.push({
      target,
      targetX: target.x,
      targetY: target.y,
      duration,
      time: 0,
      visual,
    });
  }

  spawnElectricTerrain(x, y, duration = 3.0, visual = null) {
    this.electricTerrains.push({
      x,
      y,
      duration,
      time: 0,
      visual,
    });
  }
`;

if (!content.includes('spawnElectricCharge(entity')) {
  const insertMarker = '  // Night Daze: Crimson / Dark shadowy dome shockwave burst';
  content = content.replace(insertMarker, `${spawnMethods}\n${insertMarker}`);
  console.log('Added electric spawn methods');
}

// 5. Add to update()
const updateLogic = `
    // 25. Update Electric Charges
    for (let i = this.electricCharges.length - 1; i >= 0; i--) {
      const ec = this.electricCharges[i];
      ec.time += dt;
      if (ec.entity && !ec.entity.isFainted) {
        ec.targetX = ec.entity.x;
        ec.targetY = ec.entity.y;
      }
      if (ec.time >= ec.duration) {
        this.electricCharges.splice(i, 1);
      }
    }

    // 26. Update Electric Bolts
    for (let i = this.electricBolts.length - 1; i >= 0; i--) {
      const eb = this.electricBolts[i];
      eb.time += dt;
      const prog = eb.time / eb.duration;
      if (!eb.hasHit && prog >= 0.25) {
        eb.hasHit = true;
        if (eb.onHit && eb.target && !eb.target.isFainted) {
          eb.onHit(eb.target, eb.skill);
        }
        this.spawnShockwave(eb.targetX, eb.targetY, 70, eb.isBlue ? '#38BDF8' : '#FACC15', 0.4);
        this.spawnPixelBurst(eb.targetX, eb.targetY, eb.isBlue ? '#BAE6FD' : '#FEF08A', 28, 200, 0.45, 3.5);
      }
      if (eb.time >= eb.duration) {
        this.electricBolts.splice(i, 1);
      }
    }

    // 27. Update Electrocuted Overlays
    for (let i = this.electrocutedOverlays.length - 1; i >= 0; i--) {
      const eo = this.electrocutedOverlays[i];
      eo.time += dt;
      if (eo.target && !eo.target.isFainted) {
        eo.targetX = eo.target.x;
        eo.targetY = eo.target.y;
      }
      if (eo.time >= eo.duration) {
        this.electrocutedOverlays.splice(i, 1);
      }
    }

    // 28. Update Parabolic Rings
    for (let i = this.parabolicRings.length - 1; i >= 0; i--) {
      const pr = this.parabolicRings[i];
      pr.time += dt;
      if (pr.time >= pr.duration) {
        this.parabolicRings.splice(i, 1);
      }
    }

    // 29. Update Electric Waves
    for (let i = this.electricWaves.length - 1; i >= 0; i--) {
      const ew = this.electricWaves[i];
      ew.time += dt;
      const prog = ew.time / ew.duration;
      if (!ew.hasHit && prog >= 0.50) {
        ew.hasHit = true;
        if (ew.onHit && ew.target && !ew.target.isFainted) {
          ew.onHit(ew.target, ew.skill);
        }
      }
      if (ew.time >= ew.duration) {
        this.electricWaves.splice(i, 1);
      }
    }

    // 30. Update Electrowebs
    for (let i = this.electrowebs.length - 1; i >= 0; i--) {
      const ew = this.electrowebs[i];
      ew.time += dt;
      if (ew.target && !ew.target.isFainted) {
        ew.targetX = ew.target.x;
        ew.targetY = ew.target.y;
      }
      if (ew.time >= ew.duration) {
        this.electrowebs.splice(i, 1);
      }
    }

    // 31. Update Electric Terrains
    for (let i = this.electricTerrains.length - 1; i >= 0; i--) {
      const et = this.electricTerrains[i];
      et.time += dt;
      if (et.time >= et.duration) {
        this.electricTerrains.splice(i, 1);
      }
    }
`;

if (!content.includes('// 25. Update Electric Charges')) {
  const updateMarker = '    // 21. Update Air Cutters';
  content = content.replace(updateMarker, `${updateLogic}\n${updateMarker}`);
  console.log('Added electric update logic');
}

// 6. Add to render()
const renderLogic = `
    // 4.11. Electric Terrains (floor level)
    for (let i = 0; i < this.electricTerrains.length; i++) {
      const et = this.electricTerrains[i];
      const img = getMoveAnimImg('vfx/custom/electric_terrain_decal.png');
      renderElectricTerrainCombat(ctx, et.x, et.y, Math.min(1.0, et.time / et.duration), img, et.visual);
    }

    // 4.12. Parabolic Rings (floor level)
    for (let i = 0; i < this.parabolicRings.length; i++) {
      const pr = this.parabolicRings[i];
      const img = getMoveAnimImg('vfx/custom/electric_shockwave_rings.png');
      renderParabolicRingsCombat(ctx, pr.targetX, pr.targetY, Math.min(1.0, pr.time / pr.duration), img, pr.visual);
    }

    // 4.13. Electric Waves
    for (let i = 0; i < this.electricWaves.length; i++) {
      const ew = this.electricWaves[i];
      const img = getMoveAnimImg('vfx/custom/electric_wave.png');
      renderElectricWaveCombat(ctx, ew.targetX, ew.targetY, Math.min(1.0, ew.time / ew.duration), img, ew.visual);
    }

    // 4.14. Electric Charges
    for (let i = 0; i < this.electricCharges.length; i++) {
      const ec = this.electricCharges[i];
      const file = ec.isBlue ? 'vfx/custom/electric_charge_blue.png' : 'vfx/custom/electric_charge_yellow.png';
      const img = getMoveAnimImg(file);
      renderElectricChargeCombat(ctx, ec.targetX, ec.targetY, Math.min(1.0, ec.time / ec.duration), img, null, ec.isBlue);
    }

    // 4.15. Electrowebs
    for (let i = 0; i < this.electrowebs.length; i++) {
      const ew = this.electrowebs[i];
      const img = getMoveAnimImg('vfx/custom/electroweb.png');
      renderElectrowebCombat(ctx, ew.targetX, ew.targetY, Math.min(1.0, ew.time / ew.duration), img, ew.visual);
    }

    // 4.16. Electrocuted Overlays
    for (let i = 0; i < this.electrocutedOverlays.length; i++) {
      const eo = this.electrocutedOverlays[i];
      const img = getMoveAnimImg('vfx/custom/electrocuted_burst.png');
      renderElectrocutedCombat(ctx, eo.targetX, eo.targetY, Math.min(1.0, eo.time / eo.duration), img);
    }

    // 4.17. Electric Bolts
    for (let i = 0; i < this.electricBolts.length; i++) {
      const eb = this.electricBolts[i];
      const file = eb.isBlue ? 'vfx/custom/electric_bolt_impact_blue.png' : 'vfx/custom/electric_bolt_impact_yellow.png';
      const img = getMoveAnimImg(file);
      renderElectricBoltImpactCombat(ctx, eb.targetX, eb.targetY, Math.min(1.0, eb.time / eb.duration), img, eb.visual, eb.isBlue);
    }
`;

if (!content.includes('// 4.11. Electric Terrains')) {
  const renderMarker = '    // 5. High-Performance Batched Particle Rendering';
  content = content.replace(renderMarker, `${renderLogic}\n${renderMarker}`);
  console.log('Added electric render logic');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched particleSystem.js with electric VFX system!');
