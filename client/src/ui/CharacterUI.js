export default class CharacterUI {
  constructor(onEnterGame, onLogout) {
    this.onEnterGame = onEnterGame;
    this.onLogout = onLogout;
    this.token = null;
    this.user = null;
    this.characters = [];
    this.selectedCharId = null;

    // Elements
    this.charScreen = document.getElementById('character-screen');
    this.charListCard = document.getElementById('char-list-card');
    this.charCreateCard = document.getElementById('char-create-card');
    this.charListContainer = document.getElementById('char-list-container');
    this.accountWelcomeText = document.getElementById('account-welcome-text');
    this.btnEnterWorld = document.getElementById('btn-enter-world');
    this.btnShowCreateChar = document.getElementById('btn-show-create-char');
    this.btnBackToCharList = document.getElementById('btn-back-to-char-list');
    this.btnLogout = document.getElementById('btn-logout');
    this.charSelectError = document.getElementById('char-select-error');
    this.charCreateError = document.getElementById('char-create-error');
    this.formCreateChar = document.getElementById('form-create-char');

    // Sprite options
    this.spriteBoyOption = document.getElementById('sprite-option-boy');
    this.spriteGirlOption = document.getElementById('sprite-option-girl');
    this.selectedGender = 'male';
    this.selectedSprite = 'boy_run';

    // Canvas previews
    this.canvasBoy = document.getElementById('preview-canvas-boy');
    this.canvasGirl = document.getElementById('preview-canvas-girl');
    this.previewFrame = 0;
    this.animInterval = null;

    this.bindEvents();
    this.startSpritePreviewAnimation();
  }

  bindEvents() {
    this.btnShowCreateChar.addEventListener('click', () => {
      this.charSelectError.innerText = '';
      this.charListCard.style.display = 'none';
      this.charCreateCard.style.display = 'block';
    });

    this.btnBackToCharList.addEventListener('click', () => {
      this.charCreateError.innerText = '';
      this.charCreateCard.style.display = 'none';
      this.charListCard.style.display = 'block';
    });

    this.btnLogout.addEventListener('click', () => {
      this.hide();
      this.onLogout();
    });

    this.spriteBoyOption.addEventListener('click', () => {
      this.selectedGender = 'male';
      this.selectedSprite = 'boy_run';
      this.spriteBoyOption.classList.add('selected');
      this.spriteGirlOption.classList.remove('selected');
    });

    this.spriteGirlOption.addEventListener('click', () => {
      this.selectedGender = 'female';
      this.selectedSprite = 'girl_run';
      this.spriteGirlOption.classList.add('selected');
      this.spriteBoyOption.classList.remove('selected');
    });

    this.formCreateChar.addEventListener('submit', (e) => this.handleCreateCharacter(e));
    this.btnEnterWorld.addEventListener('click', () => this.handleEnterWorld());
  }

  startSpritePreviewAnimation() {
    const imgBoy = new Image();
    imgBoy.src = '/assets/characters/boy_run.png';
    const imgGirl = new Image();
    imgGirl.src = '/assets/characters/girl_run.png';

    const ctxBoy = this.canvasBoy.getContext('2d');
    const ctxGirl = this.canvasGirl.getContext('2d');
    ctxBoy.imageSmoothingEnabled = false;
    ctxGirl.imageSmoothingEnabled = false;

    this.animInterval = setInterval(() => {
      this.previewFrame = (this.previewFrame + 1) % 4;

      if (imgBoy.complete && imgBoy.naturalWidth > 0) {
        ctxBoy.clearRect(0, 0, 32, 48);
        ctxBoy.drawImage(imgBoy, this.previewFrame * 32, 0, 32, 48, 0, 0, 32, 48);
      }

      if (imgGirl.complete && imgGirl.naturalWidth > 0) {
        ctxGirl.clearRect(0, 0, 32, 48);
        ctxGirl.drawImage(imgGirl, this.previewFrame * 32, 0, 32, 48, 0, 0, 32, 48);
      }
    }, 200);
  }

  async loadCharacters(user, token) {
    this.user = user;
    this.token = token;
    this.accountWelcomeText.innerText = `Olá, ${user.name}! Escolha ou crie seu personagem:`;

    this.charSelectError.innerText = '';
    this.charCreateError.innerText = '';

    try {
      const res = await fetch('/api/characters', {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (!res.ok) throw new Error('Falha ao obter personagens.');

      this.characters = await res.json();
      this.renderCharacterList();
      this.show();
    } catch (err) {
      this.charSelectError.innerText = err.message;
      this.show();
    }
  }

  renderCharacterList() {
    this.charListContainer.innerHTML = '';

    if (this.characters.length === 0) {
      this.charListContainer.innerHTML = `
        <div style="text-align: center; color: var(--fr-text-muted); padding: 20px 0; font-size: 13px;">
          Nenhum personagem criado ainda.<br>Clique no botão abaixo para começar sua jornada!
        </div>
      `;
      this.btnEnterWorld.style.display = 'none';
      return;
    }

    this.btnEnterWorld.style.display = 'block';

    this.characters.forEach((char, index) => {
      const card = document.createElement('div');
      card.className = `char-card-item ${index === 0 ? 'selected' : ''}`;
      card.dataset.id = char.id;

      if (index === 0) {
        this.selectedCharId = char.id;
      }

      const genderBadge = char.gender === 'female' ? '♀' : '♂';
      const genderColor = char.gender === 'female' ? '#ff80ab' : '#90caf9';
      const spritePath = `/assets/characters/${char.sprite}.png`;

      card.innerHTML = `
        <div class="char-card-avatar">
          <div style="width: 32px; height: 48px; background: url('${spritePath}') 0 0 no-repeat; background-size: 128px 192px; image-rendering: pixelated;"></div>
        </div>
        <div class="char-card-info">
          <h3>${char.name} <span style="color: ${genderColor}; font-size: 14px;">${genderBadge}</span></h3>
          <span>Mapa: ${char.roomId} | ₽ ${char.money.toLocaleString('pt-BR')}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.char-card-item').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedCharId = char.id;
      });

      this.charListContainer.appendChild(card);
    });
  }

  async handleCreateCharacter(e) {
    e.preventDefault();
    this.charCreateError.innerText = '';

    const name = document.getElementById('new-char-name').value;

    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          name,
          gender: this.selectedGender,
          sprite: this.selectedSprite
        })
      });

      const newChar = await res.json();
      if (!res.ok) {
        throw new Error(newChar.error || 'Erro ao criar personagem.');
      }

      // Refresh list and select new character
      this.characters.unshift(newChar);
      this.selectedCharId = newChar.id;
      this.charCreateCard.style.display = 'none';
      this.charListCard.style.display = 'block';
      this.renderCharacterList();

      // Enter world directly with new character!
      this.handleEnterWorld();
    } catch (err) {
      this.charCreateError.innerText = err.message;
    }
  }

  handleEnterWorld() {
    if (!this.selectedCharId) {
      this.charSelectError.innerText = 'Selecione ou crie um personagem primeiro!';
      return;
    }

    const char = this.characters.find(c => c.id === this.selectedCharId);
    if (!char) return;

    this.hide();
    this.onEnterGame(char, this.token);
  }

  show() {
    this.charScreen.classList.remove('hidden');
    this.charListCard.style.display = 'block';
    this.charCreateCard.style.display = 'none';
  }

  hide() {
    this.charScreen.classList.add('hidden');
  }
}
