import fs from 'fs';

const filePath = 'client/src/battle/pokemonEntity.js';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add constructor properties for uppercut and counter
const initHook = 'this.twisterSpinTimer = 0;';
const newProps = `this.twisterSpinTimer = 0;
    this.uppercutTimer = 0;
    this.uppercutTotal = 0.55;
    this.uppercutPushX = 0;
    this.uppercutPushY = 0;
    this.isCounterActive = false;
    this.counterTimer = 0;
    this.isFlyingPress = false;`;
code = code.replace(initHook, newProps);

// 2. Add applyUppercutKnockup right after applyTwisterKnockup
const twisterKnockupMethod = `  applyTwisterKnockup(duration = 0.85) {
    if (this.isFainted) return;
    this.twisterSpinTimer = duration;
    this.twisterSpinTotal = duration;
    this.vx = 0;
    this.vy = 0;
    this.onLog(\`🌪️ <strong>\${this.data.name}</strong> foi arremessado no ar girando pelo ciclone!\`, 'dragon');
    this.onStateChange();
  }`;

const uppercutMethod = `  applyTwisterKnockup(duration = 0.85) {
    if (this.isFainted) return;
    this.twisterSpinTimer = duration;
    this.twisterSpinTotal = duration;
    this.vx = 0;
    this.vy = 0;
    this.onLog(\`🌪️ <strong>\${this.data.name}</strong> foi arremessado no ar girando pelo ciclone!\`, 'dragon');
    this.onStateChange();
  }

  // Sky Uppercut Knockup: Lança o alvo verticalmente ao ar com recuo horizontal
  applyUppercutKnockup(pushX = 0, pushY = 0, duration = 0.55) {
    if (this.isFainted) return;
    this.uppercutTimer = duration;
    this.uppercutTotal = duration;
    this.uppercutPushX = pushX;
    this.uppercutPushY = pushY;
    this.onLog(\`🥊 🚀 <strong>\${this.data.name}</strong> foi lançado aos ares pelo Sky Uppercut!\`, 'fighting');
    this.onStateChange();
  }`;
code = code.replace(twisterKnockupMethod, uppercutMethod);

// 3. Update update(dt) to handle uppercutTimer and counterTimer
const updateTwisterHook = `if (this.twisterSpinTimer > 0) {`;
const newUpdateTimers = `// Counter Posture timer
    if (this.counterTimer > 0) {
      this.counterTimer = Math.max(0, this.counterTimer - dt);
      if (this.counterTimer <= 0) {
        this.isCounterActive = false;
        this.isGuarding = false;
        this.perfectParryTimer = 0;
      }
    }

    // Sky Uppercut Knockup physics
    if (this.uppercutTimer > 0) {
      this.uppercutTimer = Math.max(0, this.uppercutTimer - dt);
      const prog = 1.0 - (this.uppercutTimer / (this.uppercutTotal || 0.55));
      this.jumpOffset = -Math.sin(prog * Math.PI) * 55;
      this.x += this.uppercutPushX * dt;
      this.y += this.uppercutPushY * dt;
      if (this.uppercutTimer <= 0) {
        this.jumpOffset = 0;
        this.uppercutTimer = 0;
        if (this.particleSystem) {
          this.particleSystem.spawnDust(this.x, this.y + 10, 4);
        }
      }
    }

    if (this.twisterSpinTimer > 0) {`;
code = code.replace(updateTwisterHook, newUpdateTimers);

// 4. Flying Press parabolic jump in fireMeleeDash
const feintCheckHook = `const isFeintAttack = skill.internalName === 'FEINTATTACK'`;
const flyingPressCheck = `const isFlyingPressSkill = skill.internalName === 'FLYINGPRESS' || skill.visual?.isFlyingPress || skill.combatBehavior?.isFlyingPress;
    if (isFlyingPressSkill) {
      spd = 1040;
      this.stateTimer = 0.45;
      this.totalDashTimer = 0.45;
      this.actionCooldown = 0.60;
      this.isFlyingPress = true;
    }

    const isFeintAttack = skill.internalName === 'FEINTATTACK'`;
code = code.replace(feintCheckHook, flyingPressCheck);

// 5. Update updateDashingStrike for Flying Press jump offset
const highJumpCalcHook = `if (isHighRiskJump) {
      const totalT = this.totalDashTimer || 0.40;
      const prog = Math.min(1.0, Math.max(0, 1.0 - (this.stateTimer / totalT)));
      this.jumpOffset = -Math.sin(prog * Math.PI) * 65;
    }`;

const flyingPressJumpOffset = `if (isHighRiskJump) {
      const totalT = this.totalDashTimer || 0.40;
      const prog = Math.min(1.0, Math.max(0, 1.0 - (this.stateTimer / totalT)));
      this.jumpOffset = -Math.sin(prog * Math.PI) * 65;
    } else if (this.isFlyingPress) {
      const totalT = this.totalDashTimer || 0.45;
      const prog = Math.min(1.0, Math.max(0, 1.0 - (this.stateTimer / totalT)));
      this.jumpOffset = -Math.sin(prog * Math.PI) * 65;
    }`;
code = code.replace(highJumpCalcHook, flyingPressJumpOffset);

// 6. Multi-hit handling (Double Kick, Triple Kick) and Drain Punch retreat in updateDashingStrike
const resolveSkillHitHook = `} else if (isFeintAttackHit) {
            // Feint Attack: Golpe surpresa direto após a finta
            this.resolveSkillHit(this.target, sk);
            this.particleSystem.addFloatingText(this.target.x, this.target.y - 28, 'FEINT ATTACK!', 'dark', false);
          } else {
            this.resolveSkillHit(this.target, sk);
          }`;

const multiHitAndDrainResolve = `} else if (isFeintAttackHit) {
            // Feint Attack: Golpe surpresa direto após a finta
            this.resolveSkillHit(this.target, sk);
            this.particleSystem.addFloatingText(this.target.x, this.target.y - 28, 'FEINT ATTACK!', 'dark', false);
          } else {
            const isDoubleKick = sk && (sk.internalName === 'DOUBLEKICK' || sk.visual?.isDoubleKick);
            const isTripleKick = sk && (sk.internalName === 'TRIPLEKICK' || sk.visual?.isTripleKick);
            if (isDoubleKick) {
              this.resolveSkillHit(this.target, sk, 2);
              setTimeout(() => {
                if (this.target && !this.target.isFainted) {
                  this.resolveSkillHit(this.target, sk, 2);
                }
              }, 110);
            } else if (isTripleKick) {
              this.resolveSkillHit(this.target, sk, 3);
              setTimeout(() => {
                if (this.target && !this.target.isFainted) {
                  this.resolveSkillHit(this.target, sk, 3);
                }
              }, 90);
              setTimeout(() => {
                if (this.target && !this.target.isFainted) {
                  this.resolveSkillHit(this.target, sk, 3);
                }
              }, 180);
            } else {
              this.resolveSkillHit(this.target, sk);
            }
          }`;
code = code.replace(resolveSkillHitHook, multiHitAndDrainResolve);

// 7. Drain Punch retreat hook
const retreatHook = `// Caso especial U-turn: aplicar ataque e recuar em alta velocidade para trás com afterimages`;
const drainPunchRetreat = `// Drain Punch: após o golpe, recua de volta à posição original de lançamento
        const isDrainPunch = sk && (sk.internalName === 'DRAINPUNCH' || sk.visual?.isDrainPunch || sk.combatBehavior?.isDrainPunch);
        if (isDrainPunch && (this.dashStartX !== 0 || this.dashStartY !== 0)) {
          this.jumpOffset = 0;
          this.isFlyingPress = false;
          this.startRetreatAnimation(this.dashStartX, this.dashStartY, 0.35, false);
          return;
        }

        // Caso especial U-turn: aplicar ataque e recuar em alta velocidade para trás com afterimages`;
code = code.replace(retreatHook, drainPunchRetreat);

// 8. Whiff reset for isFlyingPress
const whiffHook = `this.jumpOffset = 0;
      this.state = 'moving';`;
code = code.replace(whiffHook, `this.jumpOffset = 0;
      this.isFlyingPress = false;
      this.state = 'moving';`);

// 9. Sky Uppercut trigger in resolveSkillHit
const uppercutTriggerHook = `if (isCrossChopSkill) {
      this.particleSystem.spawnCrossChop(hitCenter.x, hitCenter.y, typeColor, 0.35);
    }`;
const uppercutTrigger = `if (isCrossChopSkill) {
      this.particleSystem.spawnCrossChop(hitCenter.x, hitCenter.y, typeColor, 0.35);
    }
    if ((sInternal === 'SKYUPPERCUT' || sName.includes('Sky Uppercut') || skill.visual?.isUppercut) && target && typeof target.applyUppercutKnockup === 'function') {
      const pushDirX = target.x >= this.x ? 1 : -1;
      target.applyUppercutKnockup(pushDirX * 120, 0, 0.55);
    }`;
code = code.replace(uppercutTriggerHook, uppercutTrigger);

// 10. Counter Parry in resolveSkillHit
const parryCheckHook = `if (target.isGuarding) {
      if (target.perfectParryTimer > 0) {`;

const counterParryCheck = `if (target.isGuarding) {
      // Counter: se estiver na postura de Counter, reflete o golpe com contra-ataque massivo (2x dano)
      if (target.isCounterActive && (skill.combatBehavior?.isContact !== false || isContactMove)) {
        isPerfectParry = true;
        isBlocked = true;
        const counterDmg = Math.max(20, finalDmg * 2);
        finalDmg = 0; // mitigação total no receptor de counter
        target.isCounterActive = false;
        target.counterTimer = 0;
        target.perfectParryTimer = 0;
        target.isGuarding = false;

        const tCenter = typeof target.getHitCenter === 'function' ? target.getHitCenter() : { x: target.x, y: target.y - 28 };
        target.particleSystem.spawnShockwave(tCenter.x, tCenter.y, 85, '#EF4444', 0.45);
        target.particleSystem.spawnPixelBurst(tCenter.x, tCenter.y, '#FFFFFF', 30, 200, 0.5, 4.5);
        target.particleSystem.addFloatingText(target.x, target.y - 22, '💥 CONTRA-ATAQUE (2X)!', 'crit', true);
        soundManager.play('/assets/audio/se/anim/Crash.ogg', 1.0);
        target.onLog?.(\`🥋 💥 <strong>\${target.data.name}</strong> ativou <strong>Counter</strong> e devolveu o golpe em dobro (\${counterDmg} dano)!\`, 'fighting');

        // Revide imediato contra o atacante
        setTimeout(() => {
          if (!this.isFainted) {
            this.takeDamage(counterDmg, true, false, 'fighting');
            if (this.particleSystem && typeof this.particleSystem.spawnMoveSpriteAnim === 'function') {
              this.particleSystem.spawnMoveSpriteAnim(this.x, this.y - 12, {
                file: 'core/attack_physical_01.png',
                cols: 5,
                rows: 2,
                startFrame: 0,
                endFrame: 4,
                fps: 24,
                scale: 0.65
              });
            }
          }
        }, 80);
      } else if (target.perfectParryTimer > 0) {`;
code = code.replace(parryCheckHook, counterParryCheck);

// 11. Counter activation in fireSkill (status/buff branch)
const counterBuffHook = `const noExtraVfx = skill.visual?.noExtraVfx === true ||`;
const counterBuffActivation = `if (skill.internalName === 'COUNTER' || cb.isCounter || skill.visual?.isCounter) {
        this.isCounterActive = true;
        this.counterTimer = 1.10;
        this.isGuarding = true;
        this.perfectParryTimer = 1.10;
        this.particleSystem.spawnShockwave(this.x, this.y, 60, '#EF4444', 0.45);
        this.particleSystem.addFloatingText(this.x, this.y - 28, 'POSTURA DE CONTRA-ATAQUE!', 'fighting', true);
        this.onLog(\`🥋 🛡️ <strong>\${this.data.name}</strong> assumiu postura de <strong>Counter</strong>, pronto para rebater golpes físicos!\`, 'fighting');
        return;
      }

      const noExtraVfx = skill.visual?.noExtraVfx === true ||`;
code = code.replace(counterBuffHook, counterBuffActivation);

// 12. Sacred Sword & Secret Sword Red Horn during dash
const megahornCheckHook = `const isMegahornDashActive = this.state === 'dashing_strike' && this.currentDashingSkill &&
      (this.currentDashingSkill.internalName === 'MEGAHORN' || (this.currentDashingSkill.name && this.currentDashingSkill.name.toLowerCase().includes('megahorn')));`;

const swordAndMegahornCheck = `const isMegahornDashActive = this.state === 'dashing_strike' && this.currentDashingSkill &&
      (this.currentDashingSkill.internalName === 'MEGAHORN' || (this.currentDashingSkill.name && this.currentDashingSkill.name.toLowerCase().includes('megahorn')));
    const isSwordDashActive = this.state === 'dashing_strike' && this.currentDashingSkill &&
      (this.currentDashingSkill.internalName === 'SACREDSWORD' || this.currentDashingSkill.internalName === 'SECRETSWORD' || this.currentDashingSkill.visual?.isRedHorn);`;
code = code.replace(megahornCheckHook, swordAndMegahornCheck);

const drillRenderHook = `if (isMegahornDashActive) {`;
const swordDrillRender = `if (isMegahornDashActive || isSwordDashActive) {`;
code = code.replace(drillRenderHook, swordDrillRender);

const filterHook = `ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.globalCompositeOperation = 'source-over';`;

const swordFilterHook = `ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.globalCompositeOperation = 'source-over';
        if (isSwordDashActive) {
          ctx.filter = 'sepia(1) saturate(14) hue-rotate(320deg) brightness(1.25)';
        }`;
code = code.replace(filterHook, swordFilterHook);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated client/src/battle/pokemonEntity.js!');
