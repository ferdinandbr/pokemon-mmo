/**
 * Spawns a lightweight dust puff behind the player's feet when walking/running.
 * Depth is kept below the player (95) and far below Overhead (1000) so it never leaks onto roofs.
 */
export function spawnDustEffect(scene, x, y, direction, toggle = false) {
  if (!scene || !scene.add || !scene.tweens) return;

  const footX = x;
  const footY = y + 19;
  let spawnX = footX;
  let spawnY = footY;
  let driftX = 0;
  let driftY = 0;

  switch (direction) {
    case 'down':
      spawnX += toggle ? -5 : 5;
      spawnY -= 3;
      driftY = -4;
      driftX = toggle ? -2 : 2;
      break;
    case 'up':
      spawnX += toggle ? -5 : 5;
      spawnY += 2;
      driftY = 4;
      driftX = toggle ? -2 : 2;
      break;
    case 'left':
      spawnX += 6;
      spawnY += toggle ? -2 : 2;
      driftX = 5;
      driftY = -2;
      break;
    case 'right':
      spawnX -= 6;
      spawnY += toggle ? -2 : 2;
      driftX = -5;
      driftY = -2;
      break;
    default:
      spawnY -= 2;
      driftY = -3;
      break;
  }

  // Primary dust puff using pre-rendered 'dust_puff' texture
  const p1 = scene.add.image(spawnX, spawnY, 'dust_puff');
  p1.setDepth(95);
  p1.setScale(0.85);
  p1.setAlpha(0.8);

  scene.tweens.add({
    targets: p1,
    x: spawnX + driftX,
    y: spawnY + driftY,
    scale: 1.35,
    alpha: 0,
    duration: 260,
    ease: 'Sine.easeOut',
    onComplete: () => {
      if (p1 && p1.active) p1.destroy();
    }
  });

  // Secondary micro puff
  const p2 = scene.add.image(spawnX + (toggle ? 3 : -3), spawnY + 1, 'dust_puff');
  p2.setDepth(95);
  p2.setScale(0.55);
  p2.setAlpha(0.65);

  scene.tweens.add({
    targets: p2,
    x: spawnX + driftX * 0.7 + (toggle ? 3 : -3),
    y: spawnY + driftY * 0.7,
    scale: 0.9,
    alpha: 0,
    duration: 210,
    ease: 'Sine.easeOut',
    onComplete: () => {
      if (p2 && p2.active) p2.destroy();
    }
  });
}

/**
 * Spawns an energetic burst of dust puffs on both sides of the player's feet upon landing from a jump.
 */
export function spawnLandingDust(scene, x, y) {
  if (!scene || !scene.add || !scene.tweens) return;

  const footX = x;
  const footY = y + 19;

  // Left puff
  const leftDust = scene.add.image(footX - 4, footY - 1, 'dust_puff');
  leftDust.setDepth(95);
  leftDust.setScale(0.9);
  leftDust.setAlpha(0.9);

  scene.tweens.add({
    targets: leftDust,
    x: footX - 14,
    y: footY - 4,
    scale: 1.5,
    alpha: 0,
    duration: 320,
    ease: 'Sine.easeOut',
    onComplete: () => {
      if (leftDust && leftDust.active) leftDust.destroy();
    }
  });

  // Right puff
  const rightDust = scene.add.image(footX + 4, footY - 1, 'dust_puff');
  rightDust.setDepth(95);
  rightDust.setScale(0.9);
  rightDust.setAlpha(0.9);

  scene.tweens.add({
    targets: rightDust,
    x: footX + 14,
    y: footY - 4,
    scale: 1.5,
    alpha: 0,
    duration: 320,
    ease: 'Sine.easeOut',
    onComplete: () => {
      if (rightDust && rightDust.active) rightDust.destroy();
    }
  });

  // Center micro puff
  const centerDust = scene.add.image(footX, footY + 1, 'dust_puff');
  centerDust.setDepth(95);
  centerDust.setScale(0.7);
  centerDust.setAlpha(0.75);

  scene.tweens.add({
    targets: centerDust,
    y: footY - 3,
    scale: 1.2,
    alpha: 0,
    duration: 250,
    ease: 'Sine.easeOut',
    onComplete: () => {
      if (centerDust && centerDust.active) centerDust.destroy();
    }
  });
}
