const fs = require('fs');

const filePath = 'client/src/battle/pokemonEntity.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. In fireMeleeDash: spawn electric charge if skill has hasElectricCharge
const chargeInDash = `    if (skill.visual?.hasElectricCharge) {
      this.particleSystem.spawnElectricCharge(this, 0.50, skill.visual?.chargeColor === '#38BDF8');
    }`;

if (!content.includes('spawnElectricCharge(this, 0.50')) {
  content = content.replace(
    'this.state = \'dashing_strike\';\n    this.currentDashingSkill = skill;',
    `this.state = 'dashing_strike';\n    this.currentDashingSkill = skill;\n${chargeInDash}`
  );
  console.log('Added electric charge to fireMeleeDash');
}

// 2. In updateDashingStrike: particle sparks during dash
const dashSparks = `    const isBoltStrike = sk && (sk.internalName === 'BOLTSTRIKE' || (sk.name && sk.name.toLowerCase().includes('bolt strike')) || sk.id === 64 || sk.visual?.isBoltStrike);
    const isVoltTackle = sk && (sk.internalName === 'VOLTTACKLE' || (sk.name && sk.name.toLowerCase().includes('volt tackle')) || sk.id === 66 || sk.visual?.isVoltTackle);
    const isFusionBolt = sk && (sk.internalName === 'FUSIONBOLT' || (sk.name && sk.name.toLowerCase().includes('fusion bolt')) || sk.id === 68 || sk.visual?.isFusionBolt);
    const isVoltSwitch = sk && (sk.internalName === 'VOLTSWITCH' || (sk.name && sk.name.toLowerCase().includes('volt switch')) || sk.id === 73 || sk.visual?.isVoltSwitch);
    const isThunderFang = sk && (sk.internalName === 'THUNDERFANG' || (sk.name && sk.name.toLowerCase().includes('thunder fang')) || sk.id === 75 || sk.visual?.isThunderFang);
    const hasElectricCharge = sk && (sk.visual?.hasElectricCharge || isBoltStrike || isVoltTackle || isFusionBolt || sk.internalName === 'WILDCHARGE');

    if (hasElectricCharge) {
      const isBlue = sk.visual?.chargeColor === '#38BDF8' || isBoltStrike || isFusionBolt;
      const chargeColor = isBlue ? '#38BDF8' : '#FACC15';
      this.particleSystem.spawnPixelBurst(this.x, this.y, chargeColor, 2, 50, 0.18, 2);
      this.particleSystem.spawnPixelBurst(this.x, this.y, '#FFFFFF', 1, 30, 0.15, 1.5);
    }`;

if (!content.includes('const isBoltStrike = sk')) {
  content = content.replace(
    'const isMegahornDash = sk && (sk.internalName === \'MEGAHORN\' || (sk.name && sk.name.toLowerCase().includes(\'megahorn\')));',
    `${dashSparks}\n    const isMegahornDash = sk && (sk.internalName === 'MEGAHORN' || (sk.name && sk.name.toLowerCase().includes('megahorn')));`
  );
  console.log('Added electric dash sparks to updateDashingStrike');
}

// 3. In updateDashingStrike hit detection: handle isFusionBolt, isBoltStrike, isVoltTackle, isVoltSwitch, isThunderFang
const electricHitBranches = `          if (isDragonAscent) {
            // Dragon Ascent: Dash acertou! Sobe ao céu inalvejável e dispara o mergulho de sopro verde com burning!
            this.executeDragonAscentSky(this.target, sk);
            return;
          } else if (isFusionBolt) {
            // Fusion Bolt: Dash acertou! Sobe ao céu inalvejável com raios azuis e desaba em relâmpago!
            this.executeFusionBoltSky(this.target, sk);
            return;
          } else if (isBoltStrike) {
            this.resolveSkillHit(this.target, sk);
            this.particleSystem.spawnElectricBolt(this.target.x, this.target.y, 0.55, true, sk.visual);
            this.particleSystem.spawnElectrocutedOverlay(this.target, 0.60);
            if (this.arena && this.arena.triggerScreenShake) this.arena.triggerScreenShake(16);
            if (this.arena && this.arena.addDecal) this.arena.addDecal(this.target.x, this.target.y, 'zap_burn', 36, 9.0);
            soundManager.playPhysicalStrike();
          } else if (isVoltTackle) {
            this.resolveSkillHit(this.target, sk);
            this.particleSystem.spawnElectricBolt(this.target.x, this.target.y, 0.55, false, sk.visual);
            this.particleSystem.spawnElectrocutedOverlay(this.target, 0.60);
            if (this.arena && this.arena.triggerScreenShake) this.arena.triggerScreenShake(16);
            if (this.arena && this.arena.addDecal) this.arena.addDecal(this.target.x, this.target.y, 'zap_burn', 36, 9.0);
            soundManager.playPhysicalStrike();
          } else if (isVoltSwitch) {
            this.resolveSkillHit(this.target, sk);
            this.particleSystem.spawnPunch(this.target.x, this.target.y, '#FACC15', 0.35);
            this.particleSystem.spawnPixelBurst(this.target.x, this.target.y, '#FACC15', 20, 160, 0.35, 3);
            soundManager.playPhysicalStrike();
            if (this.dashStartX !== 0 || this.dashStartY !== 0) {
              this.startRetreatAnimation(this.dashStartX, this.dashStartY, 0.35, true);
              this.onLog(\`🔄 <strong>\${this.data.name}</strong> executou <strong>Volt Switch</strong> e recuou do combate!\`, 'electric');
              return;
            }
          } else if (isThunderFang) {
            this.resolveSkillHit(this.target, sk);
            this.particleSystem.spawnBite(this.target.x, this.target.y - 10, 0.35, sk.visual);
            this.particleSystem.spawnPixelBurst(this.target.x, this.target.y - 10, '#FACC15', 24, 180, 0.40, 3.5);
            this.particleSystem.spawnElectrocutedOverlay(this.target, 0.60);
            soundManager.playPhysicalStrike();
          }`;

if (!content.includes('else if (isFusionBolt) {')) {
  content = content.replace(
    `          if (isDragonAscent) {
            // Dragon Ascent: Dash acertou! Sobe ao céu inalvejável e dispara o mergulho de sopro verde com burning!
            this.executeDragonAscentSky(this.target, sk);
            return;
          }`,
    electricHitBranches
  );
  console.log('Added electric hit branches to updateDashingStrike');
}

// 4. Add executeFusionBoltSky method
const fusionBoltMethod = `
  // Fusion Bolt: Aerial Soar & Blue/Cyan Lightning Blast Dive with Electrocution
  executeFusionBoltSky(target, skill) {
    if (!target || target.isFainted) return;
    this.state = 'fusion_bolt_sky';
    this.dodgeTimer = 0.95; // Inalvejável durante toda a manobra aérea
    this.isUntargetable = true;
    this.vx = 0;
    this.vy = 0;
    this.jumpOffset = 0;

    this.onLog(\`⚡ <strong>\${this.data.name}</strong> ascendeu aos céus energizado com relâmpagos azuis de <strong>\${skill.name}</strong>!\`, 'electric');
    soundManager.playPhysicalStrike();
    this.particleSystem.spawnElectricCharge(this, 0.85, true);

    let elapsed = 0;
    const ascentInterval = setInterval(() => {
      elapsed += 0.03;
      if (this.isFainted) {
        clearInterval(ascentInterval);
        this.isUntargetable = false;
        return;
      }
      if (elapsed < 0.30) {
        // Subida aos céus
        this.jumpOffset = -Math.sin((elapsed / 0.30) * (Math.PI * 0.5)) * 140;
        if (Math.random() < 0.5) {
          this.particleSystem.spawnPixelBurst(this.x, this.y + this.jumpOffset + 20, '#38BDF8', 3, 50, 0.2, 2.5);
          this.particleSystem.spawnPixelBurst(this.x, this.y + this.jumpOffset + 20, '#FFFFFF', 1, 30, 0.15, 1.5);
        }
      } else if (elapsed >= 0.30 && elapsed < 0.50) {
        // Pausa no ápice inalvejável
        this.jumpOffset = -140;
      } else {
        clearInterval(ascentInterval);
        if (!target || target.isFainted) {
          this.jumpOffset = 0;
          this.isUntargetable = false;
          this.state = 'moving';
          return;
        }

        this.onLog(\`⚡ <strong>\${this.data.name}</strong> mergulhou dos céus em um relâmpago azul colossal!\`, 'electric');

        // Mergulho e colisão
        const hitCenter = typeof target.getHitCenter === 'function' ? target.getHitCenter() : { x: target.x, y: target.y - 32 };
        this.jumpOffset = 0;
        this.x = target.x - (this.x < target.x ? 32 : -32);
        this.y = target.y;
        this.isUntargetable = false;
        this.state = 'moving';
        this.recoilTimer = 0.22;
        this.vx = (this.x < target.x ? -1 : 1) * 160;
        this.vy = 0;

        this.resolveSkillHit(target, skill);
        this.particleSystem.spawnElectricBolt(hitCenter.x, hitCenter.y, 0.60, true, skill.visual);
        this.particleSystem.spawnElectrocutedOverlay(target, 0.60);
        this.particleSystem.spawnShockwave(hitCenter.x, hitCenter.y, 85, '#38BDF8', 0.45);
        this.particleSystem.spawnPixelBurst(hitCenter.x, hitCenter.y, '#7DD3FC', 36, 260, 0.5, 4.5);
        if (this.arena && this.arena.triggerScreenShake) this.arena.triggerScreenShake(18);
        if (this.arena && this.arena.addDecal) this.arena.addDecal(target.x, target.y, 'zap_burn', 40, 10.0);
        soundManager.playPhysicalStrike();
      }
    }, 30);
  }
`;

if (!content.includes('executeFusionBoltSky(target, skill)')) {
  content = content.replace(
    '  // Dragon Ascent: Aerial Soar & Green Dragon Breath Dive with Collision Burning Aura',
    `${fusionBoltMethod}\n  // Dragon Ascent: Aerial Soar & Green Dragon Breath Dive with Collision Burning Aura`
  );
  console.log('Added executeFusionBoltSky method');
}

// 5. In fireSkill: handle isThunder, isDischarge, isParabolicCharge, isElectricTerrain, isMagnetRise, isThunderWave, isElectroweb
const electricFireSkills = `
    const isThunder = skill.visual?.isThunder || skill.internalName === 'THUNDER' || (skill.name && skill.name.toLowerCase() === 'thunder');
    if (isThunder) {
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      this.sprite.setAnimation('Charge', true);
      this.particleSystem.spawnElectricCharge(this, 0.40, false);
      this.particleSystem.spawnElectricBolt(
        targetPos.x, targetPos.y, 0.55, false, skill.visual,
        (t, s) => {
          this.resolveSkillHit(t, s);
          this.particleSystem.spawnElectrocutedOverlay(t, 0.60);
          if (this.arena?.triggerScreenShake) this.arena.triggerScreenShake(16);
          if (this.arena?.addDecal) this.arena.addDecal(t.x, t.y, 'zap_burn', 36, 9.0);
        },
        target, skill
      );
      this.onLog(\`⚡ <strong>\${this.data.name}</strong> descarregou um poderoso trovão dourado com <strong>\${skill.name}</strong>!\`, 'electric');
      return;
    }

    const isDischarge = skill.visual?.isDischarge || skill.internalName === 'DISCHARGE' || (skill.name && skill.name.toLowerCase().includes('discharge'));
    if (isDischarge) {
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      this.sprite.setAnimation('Charge', true);
      this.particleSystem.spawnElectricCharge(this, 0.35, false);
      this.particleSystem.spawnElectricWave(
        this.x, this.y, targetPos.x, targetPos.y, 0.50, skill.visual,
        (t, s) => {
          this.resolveSkillHit(t, s);
          this.particleSystem.spawnElectrocutedOverlay(t, 0.60);
          if (this.arena?.triggerScreenShake) this.arena.triggerScreenShake(12);
        },
        target, skill
      );
      this.onLog(\`⚡ <strong>\${this.data.name}</strong> liberou uma descarga elétrica devastadora com <strong>\${skill.name}</strong>!\`, 'electric');
      return;
    }

    const isParabolicCharge = skill.visual?.isParabolicCharge || skill.internalName === 'PARABOLICCHARGE' || (skill.name && skill.name.toLowerCase().includes('parabolic charge'));
    if (isParabolicCharge) {
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      this.sprite.setAnimation('Shoot', true);
      this.particleSystem.spawnParabolicRings(this.x, this.y, 0.75, skill.visual);
      this.resolveSkillHit(target, skill);
      const drainAmt = Math.max(1, Math.round(target.lastDamageReceived ? target.lastDamageReceived * 0.5 : 25));
      this.heal(drainAmt, \`+\${drainAmt} HP DRENADO!\`);
      this.particleSystem.spawnPixelBurst(this.x, this.y, '#84CC16', 16, 90, 0.4, 2.5);
      this.onLog(\`⚡ <strong>\${this.data.name}</strong> drenou energia vital com as ondas elétricas de <strong>\${skill.name}</strong>!\`, 'electric');
      return;
    }

    const isElectricTerrain = skill.visual?.isElectricTerrain || skill.internalName === 'ELECTRICTERRAIN' || (skill.name && skill.name.toLowerCase().includes('electric terrain'));
    if (isElectricTerrain) {
      this.sprite.setAnimation('Charge', true);
      this.particleSystem.spawnElectricTerrain(this.x, this.y, 4.0, skill.visual);
      this.particleSystem.spawnShockwave(this.x, this.y, 90, '#FACC15', 0.5);
      if (this.arena?.addDecal) this.arena.addDecal(this.x, this.y, 'zap_burn', 45, 10.0);
      if (this.arena?.triggerScreenShake) this.arena.triggerScreenShake(10);
      this.particleSystem.addFloatingText(this.x, this.y - 20, 'TERRENO ELÉTRICO!', 'electric', true);
      this.onLog(\`⚡ <strong>\${this.data.name}</strong> eletrificou o solo da arena com <strong>\${skill.name}</strong>!\`, 'electric');
      return;
    }

    const isMagnetRise = skill.visual?.isMagnetRise || skill.internalName === 'MAGNETRISE' || (skill.name && skill.name.toLowerCase().includes('magnet rise'));
    if (isMagnetRise) {
      this.sprite.setAnimation('Charge', true);
      this.particleSystem.spawnElectricCharge(this, 1.20, false);
      this.particleSystem.addFloatingText(this.x, this.y - 20, 'LEVITAÇÃO!', 'electric', true);
      this.onLog(\`🧲 <strong>\${this.data.name}</strong> usou levitação eletromagnética com <strong>\${skill.name}</strong>!\`, 'electric');
      return;
    }

    const isThunderWave = skill.visual?.isThunderWave || skill.internalName === 'THUNDERWAVE' || (skill.name && skill.name.toLowerCase().includes('thunder wave'));
    if (isThunderWave) {
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      this.sprite.setAnimation('Shoot', true);
      this.particleSystem.spawnElectricWave(
        this.x, this.y, targetPos.x, targetPos.y, 0.55, skill.visual,
        (t, s) => {
          if (t && !t.isGuarding) {
            t.applyStatus('paralysis');
            this.particleSystem.spawnElectrocutedOverlay(t, 0.80);
          }
        },
        target, skill
      );
      this.onLog(\`⚡ <strong>\${this.data.name}</strong> emitiu uma onda paralisante com <strong>\${skill.name}</strong>!\`, 'electric');
      return;
    }

    const isElectroweb = skill.visual?.isElectroweb || skill.internalName === 'ELECTROWEB' || (skill.name && skill.name.toLowerCase().includes('electroweb'));
    if (isElectroweb) {
      const origin = this.getAttackOrigin();
      this.sprite.faceTowards(target.x, target.y, this.x, this.y);
      this.sprite.setAnimation('Shoot', true);
      this.projectileSystem.spawn({
        sourceEntity: this,
        targetEntity: target,
        startX: origin.x,
        startY: origin.y,
        targetX: targetPos.x,
        targetY: targetPos.y,
        type: 'Electric',
        speed: 700,
        skillData: skill,
        onHit: (t, pObj) => {
          this.resolveSkillHit(t, skill);
          this.particleSystem.spawnElectroweb(t, 1.20, skill.visual);
          this.particleSystem.spawnElectrocutedOverlay(t, 0.60);
          t.modifyStatStage('speed', -1);
          this.particleSystem.addFloatingText(t.x, t.y - 28, 'PRESO NA TEIA ELÉTRICA!', 'electric', false);
          this.onLog(\`🕸️ <strong>\${t.data.name}</strong> foi preso na <strong>Electroweb</strong> e perdeu velocidade!\`, 'electric');
        }
      });
      return;
    }
`;

if (!content.includes('const isThunder = skill.visual?.isThunder')) {
  content = content.replace(
    'const isDracoMeteor = skill.visual?.isDracoMeteor',
    `${electricFireSkills}\n    const isDracoMeteor = skill.visual?.isDracoMeteor`
  );
  console.log('Added electric moves to fireSkill');
}

// 6. In resolveSkillHit: track lastDamageReceived and trigger electrocuted effect
const lastDmgTrack = `    target.takeDamage(finalDmg, isCrit, isBlocked, skill.type.toLowerCase(), isSuperEffective, isNotVeryEffective);
    target.lastDamageReceived = finalDmg;`;

content = content.replace(
  'target.takeDamage(finalDmg, isCrit, isBlocked, skill.type.toLowerCase(), isSuperEffective, isNotVeryEffective);',
  lastDmgTrack
);

const electrocutedDispatch = `    if (skill.visual?.applyElectrocuted || sInternal === 'ZAPCANNON' || sInternal === 'ELECTROBALL' || sInternal === 'THUNDERSHOCK' || sInternal === 'THUNDERBOLT') {
      this.particleSystem.spawnElectrocutedOverlay(target, 0.60);
    }`;

if (!content.includes('sInternal === \'ZAPCANNON\'')) {
  content = content.replace(
    'const isThunderFang = sName === \'Thunder Fang\' || sInternal === \'THUNDERFANG\';',
    `${electrocutedDispatch}\n    const isThunderFang = sName === 'Thunder Fang' || sInternal === 'THUNDERFANG';`
  );
  console.log('Added electrocuted dispatch to resolveSkillHit');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched pokemonEntity.js with electric combat behaviors!');
