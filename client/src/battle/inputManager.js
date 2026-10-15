// Input Manager for 8-Direction Real-Time Combat Controls
// Handles WASD, Arrow keys, Dodge (Shift/Space), Attacks & Skills

export class InputManager {
  constructor() {
    this.keys = new Set();
    this.onDodge = null;
    this.onPhysical = null;
    this.onSkill = null;
    this.onStanceToggle = null;

    // Double-tap directional tracking
    this.keyTapTimes = new Map();
    this.pendingDodgeTimeout = null;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;

      this.keys.add(e.code);
      this.keys.add(e.key.toLowerCase());

      // Double-Tap 8-Directional Dodge Detection (W, A, S, D & Arrows, including diagonal chords)
      const isMovementKey = (
        e.code === 'KeyW' || e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'KeyD' ||
        e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight'
      );

      if (isMovementKey && !e.repeat) {
        const now = performance.now();
        const lastKeyTime = this.keyTapTimes.get(e.code) || 0;
        const keyDiff = now - lastKeyTime;
        this.keyTapTimes.set(e.code, now);

        const isDoubleTap = keyDiff >= 35 && keyDiff <= 350;

        // If a pending dodge chord was waiting for its diagonal partner key to land
        if (this.pendingDodgeTimeout) {
          clearTimeout(this.pendingDodgeTimeout);
          this.pendingDodgeTimeout = null;
          const moveVec = this.getMovementVector();
          if (this.onDodge && moveVec.isMoving) {
            this.onDodge(moveVec.dirX, moveVec.dirY);
          }
          this.keyTapTimes.clear();
          return;
        }

        if (isDoubleTap) {
          const moveVec = this.getMovementVector();

          // Check if diagonal is ALREADY formed (both vertical and horizontal keys active)
          const hasVertical = this.keys.has('KeyW') || this.keys.has('KeyS') || this.keys.has('ArrowUp') || this.keys.has('ArrowDown');
          const hasHorizontal = this.keys.has('KeyA') || this.keys.has('KeyD') || this.keys.has('ArrowLeft') || this.keys.has('ArrowRight');

          if (hasVertical && hasHorizontal && moveVec.isMoving) {
            // Instant diagonal dodge!
            if (this.onDodge) {
              this.onDodge(moveVec.dirX, moveVec.dirY);
            }
            this.keyTapTimes.clear();
            return;
          }

          // Single movement key landed: brief 32ms chord window to capture near-simultaneous diagonal key
          this.pendingDodgeTimeout = setTimeout(() => {
            this.pendingDodgeTimeout = null;
            const finalVec = this.getMovementVector();
            if (this.onDodge && finalVec.isMoving) {
              this.onDodge(finalVec.dirX, finalVec.dirY);
            }
            this.keyTapTimes.clear();
          }, 32);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      this.keys.delete(e.key.toLowerCase());
    });

    // Reset keys if window loses focus
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.keyTapTimes.clear();
      if (this.pendingDodgeTimeout) {
        clearTimeout(this.pendingDodgeTimeout);
        this.pendingDodgeTimeout = null;
      }
    });
  }

  // Returns normalized movement direction in 8 directions (magnitude exactly 1.0 or 0.0)
  getMovementVector() {
    let rawX = 0;
    let rawY = 0;

    // Vertical axis
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp') || this.keys.has('w')) {
      rawY -= 1;
    }
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown') || this.keys.has('s')) {
      rawY += 1;
    }

    // Horizontal axis
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft') || this.keys.has('a')) {
      rawX -= 1;
    }
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight') || this.keys.has('d')) {
      rawX += 1;
    }

    if (rawX === 0 && rawY === 0) {
      return { dirX: 0, dirY: 0, isMoving: false };
    }

    // Strict diagonal normalization: avoids the 1.414x speed glitch
    const length = Math.hypot(rawX, rawY);
    return {
      dirX: rawX / length,
      dirY: rawY / length,
      isMoving: true,
    };
  }

  hasActiveMovementInput() {
    return (
      this.keys.has('KeyW') ||
      this.keys.has('KeyA') ||
      this.keys.has('KeyS') ||
      this.keys.has('KeyD') ||
      this.keys.has('ArrowUp') ||
      this.keys.has('ArrowDown') ||
      this.keys.has('ArrowLeft') ||
      this.keys.has('ArrowRight') ||
      this.keys.has('w') ||
      this.keys.has('a') ||
      this.keys.has('s') ||
      this.keys.has('d')
    );
  }

  destroy() {
    if (this.pendingDodgeTimeout) {
      clearTimeout(this.pendingDodgeTimeout);
      this.pendingDodgeTimeout = null;
    }
    this.keys.clear();
  }
}
