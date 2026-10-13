import SocketClient from '../network/SocketClient';

export const STARTERS_DATA = [
  {
    id: 1,
    name: 'Bulbasaur',
    types: 'Planta / Veneno',
    desc: 'Você escolhe Bulbasaur, o Pokémon tipo Planta/Veneno?',
    sprite: '/assets/pokemon/animated/front/normal/001.gif',
    themeColor: '#4ade80'
  },
  {
    id: 4,
    name: 'Charmander',
    types: 'Fogo',
    desc: 'Você escolhe Charmander, o Pokémon tipo Fogo?',
    sprite: '/assets/pokemon/animated/front/normal/004.gif',
    themeColor: '#fb923c'
  },
  {
    id: 7,
    name: 'Squirtle',
    types: 'Água',
    desc: 'Você escolhe Squirtle, o Pokémon tipo Água?',
    sprite: '/assets/pokemon/animated/front/normal/007.gif',
    themeColor: '#38bdf8'
  }
];

export default class StarterSelectionUI {
  constructor(worldScene) {
    this.worldScene = worldScene;
    this.isOpen = false;
    this.selectedIndex = 1; // 0 = Bulbasaur, 1 = Charmander, 2 = Squirtle
    this.isInspecting = false;
    this.confirmIndex = 0; // 0 = SIM, 1 = NÃO
    this.activeOakNpc = null;

    this.container = null;
    this._createDOM();
    this._bindEvents();
  }

  _createDOM() {
    let el = document.getElementById('starter-selection-modal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'starter-selection-modal';
      el.className = 'starter-modal hidden';
      el.innerHTML = `
        <div class="starter-backdrop"></div>
        <div class="starter-screen">
          <!-- Cenário superior do Laboratório -->
          <div class="starter-scene-viewport">
            <div class="starter-wall-pattern"></div>
            <div class="starter-table-mat"></div>

            <!-- As 3 Pokébolas alinhadas na mesa -->
            <div class="starter-balls-container">
              ${STARTERS_DATA.map((s, idx) => `
                <div class="starter-ball-slot" data-index="${idx}">
                  <!-- Bolha de Spotlight com Pokémon animado -->
                  <div class="starter-spotlight-bubble" id="spotlight-bubble-${idx}">
                    <img src="${s.sprite}" alt="${s.name}" class="starter-pokemon-sprite" />
                  </div>

                  <!-- Mãozinha / Cursor apontando para a bola -->
                  <div class="starter-hand-cursor" id="hand-cursor-${idx}">
                    <svg viewBox="0 0 24 24" width="38" height="38" fill="#ffffff" stroke="#1e293b" stroke-width="2">
                      <path d="M12 2a2 2 0 0 0-2 2v8h-1V9a2 2 0 1 0-4 0v9a6 6 0 0 0 6 6h4a6 6 0 0 0 6-6V9a2 2 0 1 0-4 0v3h-1V4a2 2 0 0 0-2-2z" transform="rotate(180 12 12)"/>
                    </svg>
                  </div>

                  <!-- Pokébola com anel de luz -->
                  <div class="starter-ball-ring" id="ball-ring-${idx}"></div>
                  <img src="/assets/battle/ball_00.png" alt="Pokéball" class="starter-pokeball-img" />
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Caixa de diálogo inferior estilo FireRed / Emerald -->
          <div class="starter-bottom-panel">
            <div class="starter-textbox">
              <span id="starter-dialog-text">Escolha um Pokémon.</span>
            </div>

            <!-- Caixa de confirmação SIM / NÃO -->
            <div id="starter-confirm-box" class="starter-confirm-box hidden">
              <button type="button" class="starter-confirm-btn active" id="starter-btn-yes">SIM</button>
              <button type="button" class="starter-confirm-btn" id="starter-btn-no">NÃO</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(el);
    }
    this.container = el;
    this.dialogText = document.getElementById('starter-dialog-text');
    this.confirmBox = document.getElementById('starter-confirm-box');
    this.btnYes = document.getElementById('starter-btn-yes');
    this.btnNo = document.getElementById('starter-btn-no');
  }

  _bindEvents() {
    // Cliques diretos nas Pokébolas
    const slots = this.container.querySelectorAll('.starter-ball-slot');
    slots.forEach(slot => {
      slot.addEventListener('click', (e) => {
        const idx = Number(slot.dataset.index);
        if (this.selectedIndex === idx && !this.isInspecting) {
          this.inspectCurrent();
        } else {
          this.selectBall(idx);
        }
      });
    });

    if (this.btnYes) {
      this.btnYes.addEventListener('click', () => this.confirmChoice());
    }
    if (this.btnNo) {
      this.btnNo.addEventListener('click', () => this.cancelInspection());
    }

    // Teclado (Setas, Espaço, Enter, Esc)
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      const k = e.key.toLowerCase();

      if (this.isInspecting) {
        if (k === 'arrowup' || k === 'w' || k === 'arrowleft' || k === 'a') {
          e.preventDefault();
          this.setConfirmOption(0); // SIM
        } else if (k === 'arrowdown' || k === 's' || k === 'arrowright' || k === 'd') {
          e.preventDefault();
          this.setConfirmOption(1); // NÃO
        } else if (k === 'enter' || k === ' ') {
          e.preventDefault();
          if (this.confirmIndex === 0) {
            this.confirmChoice();
          } else {
            this.cancelInspection();
          }
        } else if (k === 'escape' || k === 'backspace') {
          e.preventDefault();
          this.cancelInspection();
        }
        return;
      }

      // Navegação entre Pokébolas
      if (k === 'arrowleft' || k === 'a') {
        e.preventDefault();
        this.selectBall(Math.max(0, this.selectedIndex - 1));
      } else if (k === 'arrowright' || k === 'd') {
        e.preventDefault();
        this.selectBall(Math.min(STARTERS_DATA.length - 1, this.selectedIndex + 1));
      } else if (k === 'enter' || k === ' ' || k === 'e') {
        e.preventDefault();
        this.inspectCurrent();
      } else if (k === 'escape') {
        e.preventDefault();
        this.close();
      }
    });
  }

  open(oakNpc = null) {
    this.activeOakNpc = oakNpc;
    this.isOpen = true;
    this.selectedIndex = 1; // Começa centralizado no Charmander
    this.isInspecting = false;
    this.confirmIndex = 0;

    this.container.classList.remove('hidden');
    this.updateVisuals();
  }

  close() {
    this.isOpen = false;
    this.isInspecting = false;
    this.container.classList.add('hidden');
  }

  selectBall(index) {
    this.selectedIndex = index;
    this.updateVisuals();
  }

  updateVisuals() {
    // Atualiza cursores e anéis
    STARTERS_DATA.forEach((_, idx) => {
      const cursor = document.getElementById(`hand-cursor-${idx}`);
      const ring = document.getElementById(`ball-ring-${idx}`);
      const bubble = document.getElementById(`spotlight-bubble-${idx}`);

      const isCurrent = (idx === this.selectedIndex);
      if (cursor) cursor.style.display = isCurrent ? 'block' : 'none';
      if (ring) ring.classList.toggle('active', isCurrent);

      if (bubble) {
        if (isCurrent && this.isInspecting) {
          bubble.classList.add('visible');
        } else {
          bubble.classList.remove('visible');
        }
      }
    });

    if (this.isInspecting) {
      const current = STARTERS_DATA[this.selectedIndex];
      if (this.dialogText) {
        this.dialogText.innerText = current.desc;
      }
      if (this.confirmBox) {
        this.confirmBox.classList.remove('hidden');
      }
      this.setConfirmOption(this.confirmIndex);
    } else {
      if (this.dialogText) {
        this.dialogText.innerText = 'Escolha um Pokémon.';
      }
      if (this.confirmBox) {
        this.confirmBox.classList.add('hidden');
      }
    }
  }

  inspectCurrent() {
    this.isInspecting = true;
    this.confirmIndex = 0;
    this.updateVisuals();
  }

  cancelInspection() {
    this.isInspecting = false;
    this.updateVisuals();
  }

  setConfirmOption(idx) {
    this.confirmIndex = idx;
    if (this.btnYes) this.btnYes.classList.toggle('active', idx === 0);
    if (this.btnNo) this.btnNo.classList.toggle('active', idx === 1);
  }

  confirmChoice() {
    const chosen = STARTERS_DATA[this.selectedIndex];
    if (!chosen) return;

    this.close();

    // Solicita ao servidor a concessão do inicial
    SocketClient.emit('starter:choose', { speciesId: chosen.id }, (response) => {
      if (response && response.success) {
        if (this.worldScene) {
          this.worldScene.hasChosenStarter = true;
          if (this.worldScene.partyHUDUI) {
            this.worldScene.partyHUDUI.setParty([response.pokemon], response.pokemon);
          }
        }

        // Notificação e fala do Professor Carvalho
        const pokeName = response.pokemon?.species?.name || chosen.name;
        const msg = `Você recebeu ${pokeName} do Prof. Carvalho!`;

        if (this.worldScene?.dialogueBox) {
          this.worldScene.dialogueBox.show('Prof. Carvalho', [
            `Excelente escolha! ${pokeName} é um parceiro muito leal.`,
            msg,
            'Cuide bem dele em sua jornada pelo mundo Pokémon!'
          ]);
        }

        // Toca efeito sonoro de conquista/fanfarra se disponível
        this.worldScene?.sound?.play?.('fanfare', { volume: 0.8 });

        // Atualiza a HUD da equipe e follower
        if (this.worldScene?.checkLocalBuddyState && response.pokemon) {
          this.worldScene.checkLocalBuddyState(response.pokemon, [response.pokemon]);
        }
      } else {
        const errorMsg = response?.message || 'Não foi possível escolher este inicial.';
        if (this.worldScene?.dialogueBox) {
          this.worldScene.dialogueBox.show('Prof. Carvalho', [errorMsg]);
        }
      }
    });
  }
}
