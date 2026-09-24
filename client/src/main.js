import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import WorldScene from './scenes/WorldScene';
import EditorScene from './scenes/EditorScene';
import SocketClient from './network/SocketClient';
import AuthUI from './ui/AuthUI';
import CharacterUI from './ui/CharacterUI';
import ChatUI from './ui/ChatUI';
import MenuUI from './ui/MenuUI';
import EditorUI from './ui/EditorUI';
import BagUI from './ui/BagUI';
import PokemonStorageUI from './ui/PokemonStorageUI';

// Phaser Game Configuration
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 540,
  pixelArt: true,
  roundPixels: true,
  render: {
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    antialiasGL: false,
    powerPreference: 'high-performance'
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
      fixedStep: true,
      fps: 60
    }
  },
  fps: {
    target: 60,
    min: 30,
    forceSetTimeOut: false
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, WorldScene, EditorScene]
};

const game = new Phaser.Game(config);

let currentUser = null;
let currentToken = null;
let currentCharacter = null;
let worldSceneInstance = null;
let editorSceneInstance = null;
let editorUI = null;

// Wait for Phaser scene to be available
game.events.once('ready', () => {
  worldSceneInstance = game.scene.getScene('WorldScene');
  editorSceneInstance = game.scene.getScene('EditorScene');

  checkRoute();
});

// Initialize UI Controllers
let authUI, charUI, chatUI, menuUI, bagUI, pokemonStorageUI;

function checkRoute() {
  const isEditorRoute = window.location.hash.startsWith('#editor') || window.location.pathname.startsWith('/editor');

  if (isEditorRoute) {
    // Add editor-mode class to body to force hide in-game HUD & chat completely
    document.body.classList.add('editor-mode');

    // Remove any inline styles set by game mode centering
    const wrapper = document.getElementById('game-wrapper');
    if (wrapper) {
      wrapper.style.position = '';
      wrapper.style.top = '';
      wrapper.style.left = '';
      wrapper.style.width = '';
      wrapper.style.height = '';
    }

    // Hide all game UI overlays
    document.getElementById('auth-screen')?.classList.add('hidden');
    document.getElementById('character-screen')?.classList.add('hidden');
    document.getElementById('hud')?.classList.add('hidden');
    document.getElementById('hud-quick-bar')?.classList.add('hidden');

    // Pause world scene and start editor scene
    game.scene.stop('WorldScene');
    game.scene.start('EditorScene');

    if (!editorUI) {
      editorUI = new EditorUI(editorSceneInstance);
    }
    editorUI.show();

    // Check if a specific map was requested in URL
    const hashPart = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
    const params = new URLSearchParams(hashPart || window.location.search);
    const targetMap = params.get('map');
    if (targetMap && targetMap !== 'pallet_town') {
      setTimeout(() => {
        editorSceneInstance?.loadMapByName(targetMap);
      }, 200);
    }
  } else {
    document.body.classList.remove('editor-mode');
  }
}

function initApp() {
  menuUI = new MenuUI(() => {
    // Switch character callback
    document.getElementById('hud')?.classList.add('hidden');
    document.getElementById('hud-quick-bar')?.classList.add('hidden');
    SocketClient.disconnect();
    charUI.loadCharacters(currentUser, currentToken);
  });

  chatUI = new ChatUI(worldSceneInstance);
  bagUI = new BagUI(worldSceneInstance);
  pokemonStorageUI = new PokemonStorageUI(worldSceneInstance);
  bagUI.pokemonStorageUI = pokemonStorageUI;

  // Hook hud-btn-pokemon directly to PokemonStorageUI toggle
  const hudPkmnBtn = document.getElementById('hud-btn-pokemon');
  if (hudPkmnBtn) {
    hudPkmnBtn.onclick = (e) => {
      e.stopPropagation();
      pokemonStorageUI.toggle();
    };
  }

  // Hook menu-btn-pokemon to open PokemonStorageUI and close menu
  const menuPkmnBtn = document.getElementById('menu-btn-pokemon');
  if (menuPkmnBtn) {
    menuPkmnBtn.onclick = (e) => {
      e.stopPropagation();
      menuUI.hide();
      pokemonStorageUI.open();
    };
  }

  // Hook hud-btn-bag directly to BagUI toggle
  const hudBagBtn = document.getElementById('hud-btn-bag');
  if (hudBagBtn) {
    hudBagBtn.onclick = (e) => {
      e.stopPropagation();
      bagUI.toggle();
    };
  }

  // Hook menu-btn-bag to open BagUI and close menu
  const menuBagBtn = document.getElementById('menu-btn-bag');
  if (menuBagBtn) {
    menuBagBtn.onclick = (e) => {
      e.stopPropagation();
      menuUI.hide();
      bagUI.open();
    };
  }

  charUI = new CharacterUI(
    async (character, token) => {
      // If we are in editor mode, don't show game HUD
      if (document.body.classList.contains('editor-mode')) return;

      // Enter Game Callback
      currentCharacter = character;
      currentToken = token;

      // Fetch full character data (with inventory, pokedex, etc.)
      try {
        const res = await fetch(`/api/characters/${character.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const fullData = await res.json();
        menuUI.setData(fullData);
        bagUI.setData(fullData);
      } catch (e) {
        menuUI.setData(character);
        bagUI.setData(character);
      }

      // Show HUD only if not in editor mode
      if (!document.body.classList.contains('editor-mode')) {
        document.getElementById('hud')?.classList.remove('hidden');
        document.getElementById('hud-quick-bar')?.classList.remove('hidden');
      }

      // Connect Socket
      SocketClient.connect(token);
      SocketClient.on('connect', () => {
        SocketClient.joinGame(character.id);
        SocketClient.emit('pokemon:get_data');
      });
    },
    () => {
      // Logout Callback
      currentUser = null;
      currentToken = null;
      currentCharacter = null;
      document.getElementById('hud')?.classList.add('hidden');
      document.getElementById('hud-quick-bar')?.classList.add('hidden');
      SocketClient.disconnect();
      authUI.logout();
    }
  );

  authUI = new AuthUI((user, token) => {
    // Auth Success Callback
    currentUser = user;
    currentToken = token;
    charUI.loadCharacters(user, token);
  });

  // Fullscreen Toggle Button in HUD
  const fsBtn = document.getElementById('hud-fullscreen-btn');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Check existing session in localStorage unless in editor mode
  if (window.location.hash !== '#editor' && !window.location.pathname.startsWith('/editor')) {
    authUI.checkExistingSession();
  }

  // Listen to hash changes for smooth route switching
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#editor') {
      checkRoute();
    } else {
      document.body.classList.remove('editor-mode');
      window.location.reload();
    }
  });
}

function alignGameWrapper() {
  const wrapper = document.getElementById('game-wrapper');
  if (!wrapper) return;
  wrapper.style.position = '';
  wrapper.style.top = '';
  wrapper.style.left = '';
  wrapper.style.width = '';
  wrapper.style.height = '';
  if (game && game.scale) {
    game.scale.refresh();
  }
}

window.addEventListener('resize', alignGameWrapper);
window.addEventListener('DOMContentLoaded', () => {
  alignGameWrapper();
  initApp();
});