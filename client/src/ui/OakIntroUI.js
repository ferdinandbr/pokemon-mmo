import SocketClient from '../network/SocketClient';
import bgmManager from '../audio/BGMManager';

export default class OakIntroUI {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.screen = document.getElementById('oak-intro-screen');
    this.profSprite = document.getElementById('oak-sprite-prof');
    this.pkmnSprite = document.getElementById('oak-sprite-pkmn');
    this.trainerSprite = document.getElementById('oak-sprite-trainer');
    this.speakerTag = document.querySelector('.oak-dialog-speaker');
    this.dialogText = document.getElementById('oak-dialog-text');
    this.dialogArrow = document.getElementById('oak-dialog-arrow');
    this.skipBtn = document.getElementById('oak-btn-skip');
    this.stage = document.querySelector('.oak-intro-stage');

    this.currentStep = 0;
    this.isTyping = false;
    this.typewriterTimer = null;
    this.activeCharacter = null;
    this.currentFullText = '';

    this.bindEvents();
  }

  bindEvents() {
    if (this.stage) {
      this.stage.addEventListener('click', (e) => {
        if (e.target.id === 'oak-btn-skip') return;
        this.advanceDialog();
      });
    }

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finishIntro();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (this.screen && !this.screen.classList.contains('hidden')) {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.finishIntro();
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.advanceDialog();
        }
      }
    });
  }

  start(character) {
    this.activeCharacter = character;
    this.currentStep = 0;

    // Pick trainer sprite based on gender
    if (this.trainerSprite) {
      const isFemale = character?.gender === 'female' || character?.sprite === 'girl_run';
      this.trainerSprite.src = isFemale ? '/assets/intro/introGirl.png' : '/assets/intro/introBoy.png';
    }

    // Reset visual state
    this.screen.classList.remove('hidden');
    this.profSprite.classList.remove('hidden', 'fade-out');
    this.profSprite.classList.add('fade-in');
    this.pkmnSprite.classList.add('hidden');
    this.trainerSprite.classList.add('hidden');
    this.trainerSprite.classList.remove('shrink-down');
    this.dialogArrow.style.display = 'none';

    // Hide main in-game HUD during intro
    document.getElementById('hud')?.classList.add('hidden');
    document.getElementById('hud-quick-bar')?.classList.add('hidden');

    // Play Oak Intro BGM
    bgmManager.playForRoom('intro');

    this.displayStep(0);
  }

  getSteps() {
    const charName = this.activeCharacter?.name || 'Treinador';
    return [
      {
        speaker: 'PROF. CARVALHO',
        text: 'Olá! Muito prazer em conhecê-lo!',
        visual: 'oak'
      },
      {
        speaker: 'PROF. CARVALHO',
        text: 'Bem-vindo ao maravilhoso mundo dos Pokémon!',
        visual: 'oak'
      },
      {
        speaker: 'PROF. CARVALHO',
        text: 'Meu nome é Carvalho! Mas todos me chamam carinhosamente de Professor Pokémon.',
        visual: 'oak'
      },
      {
        speaker: 'PROF. CARVALHO',
        text: 'Este mundo é amplamente habitado por criaturas incríveis chamadas Pokémon!',
        visual: 'pokemon'
      },
      {
        speaker: 'PROF. CARVALHO',
        text: 'Para algumas pessoas, os Pokémon são animais de estimação. Outros os usam em batalhas grandiosas.',
        visual: 'pokemon'
      },
      {
        speaker: 'PROF. CARVALHO',
        text: 'Quanto a mim... Eu me dedico a estudá-los como profissão há muitos anos.',
        visual: 'pokemon'
      },
      {
        speaker: 'PROF. CARVALHO',
        text: 'Mas me diga uma coisa... Você é um novo treinador aqui, certo?',
        visual: 'trainer'
      },
      {
        speaker: 'PROF. CARVALHO',
        text: `Ah, sim! Então o seu nome é ${charName}! Um excelente nome para um grande treinador!`,
        visual: 'trainer'
      },
      {
        speaker: 'PROF. CARVALHO',
        text: `${charName}! O seu próprio destino lendário no mundo Pokémon está prestes a se desdobrar!`,
        visual: 'trainer'
      },
      {
        speaker: 'PROF. CARVALHO',
        text: 'Um mundo repleto de sonhos, amizades e aventuras inesquecíveis espera por você! Vamos lá!',
        visual: 'final'
      }
    ];
  }

  displayStep(index) {
    const steps = this.getSteps();
    if (index >= steps.length) {
      this.finishIntro();
      return;
    }

    const step = steps[index];
    this.speakerTag.innerText = step.speaker;
    this.updateVisual(step.visual);
    this.typewrite(step.text);
  }

  updateVisual(type) {
    if (type === 'oak') {
      this.profSprite.classList.remove('hidden', 'with-pkmn');
      this.pkmnSprite.classList.add('hidden');
      this.trainerSprite.classList.add('hidden');
    } else if (type === 'pokemon') {
      this.profSprite.classList.remove('hidden');
      this.profSprite.classList.add('with-pkmn');
      this.pkmnSprite.classList.remove('hidden');
      this.pkmnSprite.classList.add('bounce-in');
      this.trainerSprite.classList.add('hidden');
    } else if (type === 'trainer' || type === 'final') {
      // No jogo original, o treinador fica sozinho na plataforma durante a apresentação e transição final
      this.profSprite.classList.add('hidden');
      this.profSprite.classList.remove('with-pkmn');
      this.pkmnSprite.classList.add('hidden');
      this.trainerSprite.classList.remove('hidden');
      if (type === 'trainer') {
        this.trainerSprite.classList.add('fade-in');
      }
    }
  }

  typewrite(text) {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    this.isTyping = true;
    this.currentFullText = text;
    this.dialogText.textContent = '';
    this.dialogArrow.style.display = 'none';

    let i = 0;
    this.typewriterTimer = setInterval(() => {
      if (i < text.length) {
        i++;
        this.dialogText.textContent = text.slice(0, i);
      } else {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
        this.isTyping = false;
        this.dialogArrow.style.display = 'block';
      }
    }, 28);
  }

  advanceDialog() {
    // Ensure intro theme music is playing upon interaction
    if (!bgmManager.currentTrack || bgmManager.pendingTrack) {
      bgmManager.playForRoom('intro');
    }

    if (this.isTyping) {
      // Instant reveal with all spaces intact
      if (this.typewriterTimer) clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
      this.dialogText.textContent = this.currentFullText;
      this.isTyping = false;
      this.dialogArrow.style.display = 'block';
      return;
    }

    this.currentStep++;
    this.displayStep(this.currentStep);
  }

  finishIntro() {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    // Efeito de encolhimento clássico do treinador ao entrar no mundo
    if (this.trainerSprite && !this.trainerSprite.classList.contains('hidden')) {
      this.trainerSprite.classList.add('shrink-down');
    }

    // Flash white effect
    this.screen.classList.add('white-flash');

    // Notify server to save hasCompletedIntro in database
    SocketClient.emit('player:complete_intro');

    setTimeout(() => {
      this.screen.classList.add('hidden');
      this.screen.classList.remove('white-flash');

      // Unhide game HUD
      if (!document.body.classList.contains('editor-mode')) {
        document.getElementById('hud')?.classList.remove('hidden');
        document.getElementById('hud-quick-bar')?.classList.remove('hidden');
      }

      // Transition to Pallet Town region music
      bgmManager.playForRoom('pallet_town');

      if (typeof this.onComplete === 'function') {
        this.onComplete();
      }
    }, 600);
  }
}
