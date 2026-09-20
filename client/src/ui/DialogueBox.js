/**
 * DialogueBox — Retro Pokémon FireRed / LeafGreen dialog box UI component.
 * Supports typewriter text animation, speaker title, and keyboard/mouse navigation.
 */
export default class DialogueBox {
  constructor() {
    this.container = null;
    this.titleEl = null;
    this.textEl = null;
    this.arrowEl = null;

    this.isOpen = false;
    this.isTyping = false;
    this.currentFullText = '';
    this.currentCharIndex = 0;
    this.typeSpeedMs = 24; // Classic GBA dialogue speed
    this.typeTimer = null;
    this.onCloseCallback = null;
    this.justClosed = false;

    this.initHTML();
    this.bindEvents();
  }

  initHTML() {
    let el = document.getElementById('fr-dialogue-box');
    if (!el) {
      el = document.createElement('div');
      el.id = 'fr-dialogue-box';
      el.className = 'fr-dialogue-box hidden';
      document.body.appendChild(el);
    }

    el.innerHTML = `
      <div class="fr-dialogue-frame">
        <div class="fr-dialogue-inner">
          <div class="fr-dialogue-title" id="fr-dialogue-title"></div>
          <div class="fr-dialogue-text" id="fr-dialogue-text"></div>
          <div class="fr-dialogue-arrow" id="fr-dialogue-arrow">▼</div>
        </div>
      </div>
    `;

    this.container = el;
    this.titleEl = el.querySelector('#fr-dialogue-title');
    this.textEl = el.querySelector('#fr-dialogue-text');
    this.arrowEl = el.querySelector('#fr-dialogue-arrow');
  }

  bindEvents() {
    // Click on dialog to advance / close
    this.container.addEventListener('click', (e) => {
      e.stopPropagation();
      this.advance();
    });

    // Keyboard listener for Space, E, Enter
    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in an input, textarea, or editable element
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
        return;
      }
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable)) {
        return;
      }

      if (!this.isOpen) return;

      const key = e.key.toLowerCase();
      if (key === ' ' || key === 'e' || key === 'enter') {
        e.preventDefault();
        e.stopPropagation();
        this.advance();
      }
    }, true);
  }

  /**
   * Show dialogue with title and message
   * @param {string} title - Header/Name (e.g. "PALLET TOWN")
   * @param {string} text - Body text (e.g. "Shades of your journey await!")
   * @param {Function} onClose - Optional callback when dialogue closes
   */
  show(title = '', text = '', onClose = null) {
    this.isOpen = true;
    this.onCloseCallback = onClose;
    this.currentFullText = text || '';
    this.currentCharIndex = 0;

    if (this.titleEl) {
      if (title && title.trim()) {
        this.titleEl.textContent = title.toUpperCase();
        this.titleEl.style.display = 'block';
      } else {
        this.titleEl.textContent = '';
        this.titleEl.style.display = 'none';
      }
    }

    if (this.textEl) {
      this.textEl.textContent = '';
    }

    if (this.arrowEl) {
      this.arrowEl.classList.remove('pulsing');
      this.arrowEl.style.visibility = 'hidden';
    }

    this.container.classList.remove('hidden');
    this.startTyping();
  }

  startTyping() {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }

    this.isTyping = true;
    this.currentCharIndex = 0;

    this.typeTimer = setInterval(() => {
      if (this.currentCharIndex < this.currentFullText.length) {
        this.currentCharIndex++;
        if (this.textEl) {
          this.textEl.textContent = this.currentFullText.substring(0, this.currentCharIndex);
        }
      } else {
        this.finishTyping();
      }
    }, this.typeSpeedMs);
  }

  finishTyping() {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
    this.isTyping = false;
    if (this.textEl) {
      this.textEl.textContent = this.currentFullText;
    }
    if (this.arrowEl) {
      this.arrowEl.style.visibility = 'visible';
      this.arrowEl.classList.add('pulsing');
    }
  }

  advance() {
    if (!this.isOpen) return;

    if (this.isTyping) {
      // If still typing, fast forward to complete message
      this.finishTyping();
    } else {
      // Finished typing, close dialogue
      this.close();
    }
  }

  close() {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
    this.isOpen = false;
    this.isTyping = false;
    this.container.classList.add('hidden');
    this.justClosed = true;
    setTimeout(() => {
      this.justClosed = false;
    }, 300);

    if (this.onCloseCallback) {
      const cb = this.onCloseCallback;
      this.onCloseCallback = null;
      cb();
    }
  }
}
