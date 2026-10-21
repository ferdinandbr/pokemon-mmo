const fs = require('fs');

const dbPath = 'client/src/battle/movesDatabase.js';
let content = fs.readFileSync(dbPath, 'utf8');

const updates = {
  22: {
    visual: {
      file: "vfx/dark/night_daze_burst.png",
      cols: 4,
      rows: 4,
      startFrame: 0,
      endFrame: 15,
      fps: 22,
      key: "night_daze_burst",
      theme: "Impacto Noturno de Domo Abissal (Foul Play)",
      scale: 1.25,
      offsetY: -4,
      isNightDazeBurst: true
    }
  },
  25: {
    visual: {
      file: "vfx/dark/night_daze_burst.png",
      cols: 4,
      rows: 4,
      startFrame: 0,
      endFrame: 15,
      fps: 22,
      key: "night_daze_burst",
      theme: "Domo Noturno e Choque Carmesim (Dark Pulse)",
      scale: 1.35,
      offsetY: -4,
      isNightDaze: true
    }
  },
  27: {
    visual: {
      file: "vfx/custom/night_slash_cross.png",
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 24,
      key: "cortes_marciais",
      theme: "Corte Duplo Noturno em X (Night Slash)",
      scale: 1.35,
      isXScissor: true,
      isNightSlash: true
    }
  },
  29: {
    visual: {
      file: "vfx/custom/thief_swipe_dark.png",
      cols: 5,
      rows: 1,
      startFrame: 0,
      endFrame: 4,
      fps: 24,
      key: "cortes_marciais",
      theme: "Finta Evasiva e Bote Sombrio Inescapável (Feint Attack)",
      scale: 1.25,
      isFeint: true
    }
  },
  30: {
    visual: {
      file: "vfx/custom/snarl_soundwave.png",
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 20,
      key: "pulso_psiquico",
      theme: "Onda Sonora Noturna Circular (Snarl)",
      scale: 1.35,
      isSnarl: true
    }
  },
  31: {
    visual: {
      file: "vfx/dark/night_daze_burst.png",
      cols: 4,
      rows: 4,
      startFrame: 0,
      endFrame: 15,
      fps: 22,
      key: "night_daze_burst",
      theme: "Impacto Furtivo Abissal (Assurance)",
      scale: 1.15,
      offsetY: -4,
      isNightDazeBurst: true,
      burstVariation: "condensed"
    }
  },
  32: {
    visual: {
      file: "vfx/dark/night_daze_burst.png",
      cols: 4,
      rows: 4,
      startFrame: 0,
      endFrame: 15,
      fps: 22,
      key: "night_daze_burst",
      theme: "Retaliação Abissal Concentrada (Payback)",
      scale: 1.15,
      offsetY: -4,
      isNightDazeBurst: true,
      burstVariation: "condensed"
    }
  },
  34: {
    visual: {
      file: "vfx/custom/thief_swipe_dark.png",
      cols: 5,
      rows: 1,
      startFrame: 0,
      endFrame: 4,
      fps: 24,
      key: "cortes_marciais",
      theme: "Lábia e Golpe Rápido Noturno (Thief)",
      scale: 1.35
    }
  },
  39: {
    executionType: "buff",
    visual: {
      file: "vfx/dark/night_daze_burst.png",
      cols: 4,
      rows: 4,
      startFrame: 0,
      endFrame: 15,
      fps: 22,
      key: "night_daze_burst",
      theme: "Vórtice Abissal do Vazio (Dark Void)",
      scale: 1.45,
      offsetY: -4,
      target: "target",
      isNightDaze: true
    }
  },
  42: {
    visual: {
      file: "vfx/custom/question_marks_dark.png",
      cols: 8,
      rows: 1,
      startFrame: 0,
      endFrame: 7,
      fps: 18,
      key: "interrogacoes_sombrias",
      theme: "Elogio Desconcertante com Interrogações Noturnas (Flatter)",
      scale: 1.1,
      offsetY: -28,
      target: "target",
      isQuestionMarks: true
    }
  },
  43: {
    executionType: "buff",
    vfxFamily: "buff",
    combatBehavior: {
      isContact: false,
      critStage: 0,
      multiHit: null,
      drainPercent: 0,
      recoilPercent: 0,
      healPercent: 0,
      isBarrier: false,
      secondaryStatus: null,
      secondaryChance: 0,
      statChanges: [
        {
          stat: "atk",
          stages: 1,
          target: "self"
        },
        {
          stat: "accuracy",
          stages: 1,
          target: "self"
        }
      ]
    },
    visual: {
      file: "vfx/custom/night_slash_cross.png",
      cols: 6,
      rows: 1,
      startFrame: 0,
      endFrame: 5,
      fps: 24,
      key: "cortes_marciais",
      theme: "Afiação Dupla de Garras Sombrias (Hone Claws)",
      scale: 1.25,
      offsetY: -6,
      target: "self",
      isHoneClaws: true,
      isXScissor: true
    }
  },
  45: {
    visual: {
      file: "vfx/custom/question_marks_dark.png",
      cols: 8,
      rows: 1,
      startFrame: 0,
      endFrame: 7,
      fps: 18,
      key: "interrogacoes_sombrias",
      theme: "Maquinação Sinistra com Interrogações Sombrias (Nasty Plot)",
      scale: 1.1,
      offsetY: -28,
      target: "self",
      isQuestionMarks: true
    }
  },
  49: {
    visual: {
      file: "core/attack_physical_01.png",
      cols: 5,
      rows: 2,
      startFrame: 0,
      endFrame: 4,
      fps: 20,
      key: "provocacao_fisica",
      theme: "Provocação Agressiva (Taunt)",
      scale: 1.2,
      offsetY: -16,
      target: "target"
    }
  },
  575: {
    executionType: "buff",
    visual: {
      file: "vfx/dark/night_daze_burst.png",
      cols: 4,
      rows: 4,
      startFrame: 0,
      endFrame: 15,
      fps: 22,
      key: "night_daze_burst",
      theme: "Despedida Sombria com Domo Abissal (Parting Shot)",
      scale: 1.35,
      offsetY: -4,
      target: "target",
      isNightDaze: true
    }
  },
  621: {
    visual: {
      file: "vfx/custom/thief_swipe_dark.png",
      cols: 5,
      rows: 1,
      startFrame: 0,
      endFrame: 4,
      fps: 24,
      key: "furia_hiperespacial",
      theme: "Fúria Hiperespacial Multi-Golpes (Hyperspace Fury)",
      scale: 1.45,
      isHyperspaceFury: true
    }
  }
};

for (const [idStr, patch] of Object.entries(updates)) {
  const id = Number(idStr);
  const targetPrefix = '  "' + id + '": {';
  const startIdx = content.indexOf(targetPrefix);
  if (startIdx === -1) {
    console.error('Could not find move', id);
    continue;
  }

  // Find end of move object
  let depth = 0;
  let endIdx = -1;
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }

  if (endIdx === -1) {
    console.error('Could not find end of move', id);
    continue;
  }

  const rawMoveStr = content.slice(startIdx + targetPrefix.length - 1, endIdx);
  const moveObj = JSON.parse(rawMoveStr);

  if (patch.executionType) moveObj.executionType = patch.executionType;
  if (patch.vfxFamily) moveObj.vfxFamily = patch.vfxFamily;
  if (patch.combatBehavior) Object.assign(moveObj.combatBehavior, patch.combatBehavior);
  if (patch.visual) moveObj.visual = patch.visual;

  const formattedJson = JSON.stringify(moveObj, null, 4)
    .split('\n')
    .map((line, idx) => (idx === 0 ? line : '  ' + line))
    .join('\n');

  content = content.slice(0, startIdx + targetPrefix.length - 1) + formattedJson + content.slice(endIdx);
  console.log(`Updated move #${id} (${moveObj.name})`);
}

fs.writeFileSync(dbPath, content, 'utf8');
console.log('✓ Successfully updated all 15 Dark-type moves in client/src/battle/movesDatabase.js');
