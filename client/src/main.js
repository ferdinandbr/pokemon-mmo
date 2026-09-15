import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import WorldScene from './scenes/WorldScene';
import SocketClient from './network/SocketClient';
import AuthUI from './ui/AuthUI';
import CharacterUI from './ui/CharacterUI';
import ChatUI from './ui/ChatUI';
import MenuUI from './ui/MenuUI';

// Phaser Game Configuration
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 600,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, WorldScene]
};

const game = new Phaser.Game(config);

let currentUser = null;
let currentToken = null;
let currentCharacter = null;
let worldSceneInstance = null;

// Wait for Phaser scene to be available
game.events.once('ready', () => {
  worldSceneInstance = game.scene.getScene('WorldScene');
});

// Initialize UI Controllers
let authUI, charUI, chatUI, menuUI;

function initApp() {
  menuUI = new MenuUI(() => {
    // Switch character callback
    document.getElementById('hud').classList.add('hidden');
    SocketClient.disconnect();
    charUI.loadCharacters(currentUser, currentToken);
  });

  chatUI = new ChatUI(worldSceneInstance);

  charUI = new CharacterUI(
    async (character, token) => {
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
      } catch (e) {
        menuUI.setData(character);
      }

      // Show HUD
      document.getElementById('hud').classList.remove('hidden');

      // Connect Socket
      SocketClient.connect(token);
      SocketClient.on('connect', () => {
        SocketClient.joinGame(character.id);
      });
    },
    () => {
      // Logout Callback
      currentUser = null;
      currentToken = null;
      currentCharacter = null;
      document.getElementById('hud').classList.add('hidden');
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

  // Check existing session in localStorage
  authUI.checkExistingSession();
}

window.addEventListener('DOMContentLoaded', initApp);
