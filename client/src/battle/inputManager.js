// Input Manager for Real-Time Combat Controls (MOBA Click-to-Move + Action Hotkeys)
// Handles Action keys, Dedicated Dodge (Shift / F), and optional Arrow key fallback.
// WASD is completely decoupled from movement to liberate [W] for Move Slot 1 and [D] for Defense.

export class InputManager {
  constructor() {
    this.keys = new Set();
    this.onDodge = null;
    this.onPhysical = null;
    this.onSkill = null;
    this.onStanceToggle = null;

    // Arrow keys double-tap tracking
    this.keyTapTimes = new Map();
    this.pendingDodgeTimeout = null;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      this.keys.add(e.code);
      this.keys.add(e.key.toLowerCase());

      // Dedicated Dodge / Flash Key: Shift (ShiftLeft / ShiftRight) or 'F' (KeyF)
      if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyF' || e.key === 'Shift') && !e.repeat) {
        if (this.onDodge) {
          const moveVec = this.getMovementVector();
          this.onDodge(moveVec.dirX, moveVec.dirY);
        }
        return;
      }

      // Arrow keys double-tap fallback for dodge
      const isArrowKey = (
        e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight'
      );

      if (isArrowKey && !e.repeat) {
        const now = performance.now();
        const lastKeyTime = this.keyTapTimes.get(e.code) || 0;
        const keyDiff = now - lastKeyTime;
        this.keyTapTimes.set(e.code, now);

        const isDoubleTap = keyDiff >= 35 && keyDiff <= 350;

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
          if (this.onDodge && moveVec.isMoving) {
            this.onDodge(moveVec.dirX, moveVec.dirY);
          }
          this.keyTapTimes.clear();
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

  // Returns normalized movement direction (magnitude exactly 1.0 or 0.0)
  // WASD keys are EXCLUDED to prevent conflicting with combat action hotkeys [Q, W, E, R, D]
  getMovementVector() {
    let rawX = 0;
    let rawY = 0;

    // Arrow keys fallback only
    if (this.keys.has('ArrowUp')) {
      rawY -= 1;
    }
    if (this.keys.has('ArrowDown')) {
      rawY += 1;
    }
    if (this.keys.has('ArrowLeft')) {
      rawX -= 1;
    }
    if (this.keys.has('ArrowRight')) {
      rawX += 1;
    }

    if (rawX === 0 && rawY === 0) {
      return { dirX: 0, dirY: 0, isMoving: false };
    }

    const length = Math.hypot(rawX, rawY);
    return {
      dirX: rawX / length,
      dirY: rawY / length,
      isMoving: true,
    };
  }

  hasActiveMovementInput() {
    return (
      this.keys.has('ArrowUp') ||
      this.keys.has('ArrowDown') ||
      this.keys.has('ArrowLeft') ||
      this.keys.has('ArrowRight')
    );
  }

  destroy() {
    if (this.pendingDodgeTimeout) {
      clearTimeout(this.pendingDodgeTimeout);
      this.pendingDodgeTimeout = null;
    }
    this.keys.clear();
    this.keyTapTimes.clear();
    this.onDodge = null;
    this.onPhysical = null;
    this.onSkill = null;
    this.onStanceToggle = null;
  }
}
