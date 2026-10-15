// Auto-generated Comprehensive Moves Database from PokeMMO (621 Moves)
// Enriched with VFX Families, Combat Behavior & Exact Move Spec from POKEMMO_ARENA_MOVE_VFX_SPEC.md

export const MOVES_BY_ID = {
  "1": {
    "id": 1,
    "internalName": "MEGAHORN",
    "name": "Megahorn",
    "type": "Bug",
    "category": "Physical",
    "power": 120,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "Using its tough and impressive horn, the user rams into the target with no letup.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "2": {
    "id": 2,
    "internalName": "ATTACKORDER",
    "name": "Attack Order",
    "type": "Bug",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user calls out its underlings to pummel the target. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "3": {
    "id": 3,
    "internalName": "BUGBUZZ",
    "name": "Bug Buzz",
    "type": "Bug",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user vibrates its wings to generate a damaging sound wave. It may also lower the target's Sp. Def stat.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "4": {
    "id": 4,
    "internalName": "XSCISSOR",
    "name": "X-Scissor",
    "type": "Bug",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user slashes at the foe by crossing its scythes or claws as if they were a pair of scissors.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "5": {
    "id": 5,
    "internalName": "SIGNALBEAM",
    "name": "Signal Beam",
    "type": "Bug",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user attacks with a sinister beam of light. It may also confuse the target.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe direcionado com núcleo branco e borda colorida do elemento, com partículas orbitais ou laterais.",
      "animation": "Carga opcional, emissão contínua ou disparo concentrado, seguida de explosão curta no ponto final.",
      "combat": "Definir largura, duração e regra de colisão ao longo do feixe; não aplicar dano por frame sem intervalo explícito.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "6": {
    "id": 6,
    "internalName": "UTURN",
    "name": "U-turn",
    "type": "Bug",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "After making its attack, the user rushes back to switch places with a party Pokémon in waiting.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rastro de movimento que atravessa ou contorna o alvo, com partículas na cor do tipo.",
      "animation": "Investida curta, impacto e saída do campo com afterimage; deixar a troca para depois da resolução do hit.",
      "combat": "Executar o efeito de troca após confirmar o acerto e respeitar as regras de troca do combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "7": {
    "id": 7,
    "internalName": "STEAMROLLER",
    "name": "Steamroller",
    "type": "Bug",
    "category": "Physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user crushes its foes by rolling over them. This attack may make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "8": {
    "id": 8,
    "internalName": "BUGBITE",
    "name": "Bug Bite",
    "type": "Bug",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "bite",
    "description": "The user bites the target. If the target is holding a Berry, the user eats it and gains its effect.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Duas mandíbulas ou presas pixeladas que se fecham ao redor do ponto de contato; usar sombra escura, dentes claros e flash breve.",
      "animation": "Abrir mandíbula durante a antecipação; fechar rapidamente no contato; recuar e remover o overlay sem cobrir o Pokémon por muito tempo.",
      "combat": "Exige proximidade. O acerto ocorre no instante do fechamento das mandíbulas; efeitos de flinch ou redução de defesa são tratados pela lógica de status, não pelo desenho.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "9": {
    "id": 9,
    "internalName": "SILVERWIND",
    "name": "Silver Wind",
    "type": "Bug",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The foe is attacked with powdery scales blown by wind. It may also raise all the user's stats.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "10": {
    "id": 10,
    "internalName": "STRUGGLEBUG",
    "name": "Struggle Bug",
    "type": "Bug",
    "category": "Special",
    "power": 30,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "While resisting, the user attacks the opposing Pokémon. The targets' Sp. Atk stat is reduced.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "11": {
    "id": 11,
    "internalName": "TWINEEDLE",
    "name": "Twineedle",
    "type": "Bug",
    "category": "Physical",
    "power": 25,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The foe is stabbed twice by a pair of stingers. It may also poison the target.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        2
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "12": {
    "id": 12,
    "internalName": "FURYCUTTER",
    "name": "Fury Cutter",
    "type": "Bug",
    "category": "Physical",
    "power": 20,
    "accuracy": 95,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The target is slashed with scythes or claws. Its power increases if it hits in succession.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "13": {
    "id": 13,
    "internalName": "LEECHLIFE",
    "name": "Leech Life",
    "type": "Bug",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user drains the target's blood. The user's HP is restored by half the damage taken by the target.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0.5,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "14": {
    "id": 14,
    "internalName": "PINMISSILE",
    "name": "Pin Missile",
    "type": "Bug",
    "category": "Physical",
    "power": 14,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "Sharp spikes are shot at the target in rapid succession. They hit two to five times in a row.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "15": {
    "id": 15,
    "internalName": "DEFENDORDER",
    "name": "Defend Order",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user calls out its underlings to shield its body, raising its Defense and Sp. Def stats.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "16": {
    "id": 16,
    "internalName": "HEALORDER",
    "name": "Heal Order",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user calls out its underlings to heal it. The user regains up to half of its max HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0.5,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Brilhos em partículas que sobem e pequenos símbolos luminosos em torno do Pokémon.",
      "animation": "Aura se expande, pulsa e desaparece; a barra de HP muda no frame de resolução da cura.",
      "combat": "Aplicar a quantidade de cura e os limites de HP pela lógica; o efeito visual não determina o valor restaurado.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "17": {
    "id": 17,
    "internalName": "QUIVERDANCE",
    "name": "Quiver Dance",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user performs a beautiful dance. It boosts the user's Sp. Atk, Sp. Def, and Speed stats.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "spAtk",
          "stages": 1,
          "target": "self"
        },
        {
          "stat": "spDef",
          "stages": 1,
          "target": "self"
        },
        {
          "stat": "speed",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "18": {
    "id": 18,
    "internalName": "RAGEPOWDER",
    "name": "Rage Powder",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 3,
    "vfxFamily": "foliage",
    "description": "The user scatters irritating powder to draw attention to itself. Opponents aim only at the user.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "19": {
    "id": 19,
    "internalName": "SPIDERWEB",
    "name": "Spider Web",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user ensnares the target with thin, gooey silk so it can't flee from battle.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "20": {
    "id": 20,
    "internalName": "STRINGSHOT",
    "name": "String Shot",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 95,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The foe is bound with silk blown from the user's mouth. This silk reduces the target's Speed.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "speed",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "21": {
    "id": 21,
    "internalName": "TAILGLOW",
    "name": "Tail Glow",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user stares at flashing lights to focus its mind, drastically raising its Sp. Atk stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "22": {
    "id": 22,
    "internalName": "FOULPLAY",
    "name": "Foul Play",
    "type": "Dark",
    "category": "Physical",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user turns the foe's power against it. It does more damage the higher the target's Attack stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "23": {
    "id": 23,
    "internalName": "NIGHTDAZE",
    "name": "Night Daze",
    "type": "Dark",
    "category": "Special",
    "power": 85,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user lets loose a pitch-black shock wave at its target. It may also lower the target's accuracy.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Onda / Pulso Noturno"
    }
  },
  "24": {
    "id": 24,
    "internalName": "CRUNCH",
    "name": "Crunch",
    "type": "Dark",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "bite",
    "description": "The user crunches up the target with sharp fangs. It may also lower the target's Defense stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Duas mandíbulas ou presas pixeladas que se fecham ao redor do ponto de contato; usar sombra escura, dentes claros e flash breve.",
      "animation": "Abrir mandíbula durante a antecipação; fechar rapidamente no contato; recuar e remover o overlay sem cobrir o Pokémon por muito tempo.",
      "combat": "Exige proximidade. O acerto ocorre no instante do fechamento das mandíbulas; efeitos de flinch ou redução de defesa são tratados pela lógica de status, não pelo desenho.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "teeth.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "mandibula_mordida",
      "theme": "Mandíbula de Presas Afiadas"
    }
  },
  "25": {
    "id": 25,
    "internalName": "DARKPULSE",
    "name": "Dark Pulse",
    "type": "Dark",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user releases a horrible aura imbued with dark thoughts. It may also make the target flinch.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Onda / Pulso Noturno"
    }
  },
  "26": {
    "id": 26,
    "internalName": "SUCKERPUNCH",
    "name": "Sucker Punch",
    "type": "Dark",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 5,
    "priority": 1,
    "vfxFamily": "shadow",
    "description": "This move enables the user to attack first. It fails if the target is not readying an attack, however.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "27": {
    "id": 27,
    "internalName": "NIGHTSLASH",
    "name": "Night Slash",
    "type": "Dark",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user slashes the target the instant an opportunity arises. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "28": {
    "id": 28,
    "internalName": "BITE",
    "name": "Bite",
    "type": "Dark",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "bite",
    "description": "The target is bitten with viciously sharp fangs. It may make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Duas mandíbulas ou presas pixeladas que se fecham ao redor do ponto de contato; usar sombra escura, dentes claros e flash breve.",
      "animation": "Abrir mandíbula durante a antecipação; fechar rapidamente no contato; recuar e remover o overlay sem cobrir o Pokémon por muito tempo.",
      "combat": "Exige proximidade. O acerto ocorre no instante do fechamento das mandíbulas; efeitos de flinch ou redução de defesa são tratados pela lógica de status, não pelo desenho.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "teeth.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "mandibula_mordida",
      "theme": "Mandíbula de Presas Afiadas"
    }
  },
  "29": {
    "id": 29,
    "internalName": "FEINTATTACK",
    "name": "Feint Attack",
    "type": "Dark",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user draws up to the foe disarmingly, then throws a sucker punch. It hits without fail.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "30": {
    "id": 30,
    "internalName": "SNARL",
    "name": "Snarl",
    "type": "Dark",
    "category": "Special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user yells as if it is ranting about something, making the target's Sp. Atk stat decrease.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3,
      "statChanges": [
        {
          "stat": "spAtk",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Onda / Pulso Noturno"
    }
  },
  "31": {
    "id": 31,
    "internalName": "ASSURANCE",
    "name": "Assurance",
    "type": "Dark",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "If the target has already taken some damage in the same turn, this attack's power is doubled.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "32": {
    "id": 32,
    "internalName": "PAYBACK",
    "name": "Payback",
    "type": "Dark",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "If the user moves after the target, this attack's power will be doubled.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "33": {
    "id": 33,
    "internalName": "PURSUIT",
    "name": "Pursuit",
    "type": "Dark",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "An attack move that inflicts double damage if used on a target that is switching out of battle.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "34": {
    "id": 34,
    "internalName": "THIEF",
    "name": "Thief",
    "type": "Dark",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user attacks and steals the foe's held item simultaneously. It can't steal if the user holds an item.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "35": {
    "id": 35,
    "internalName": "KNOCKOFF",
    "name": "Knock Off",
    "type": "Dark",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user slaps down the target's held item, preventing that item from being used in the battle.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "36": {
    "id": 36,
    "internalName": "BEATUP",
    "name": "Beat Up",
    "type": "Dark",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user gets all the party Pokémon to attack the foe. The more party Pokémon, the more damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "37": {
    "id": 37,
    "internalName": "FLING",
    "name": "Fling",
    "type": "Dark",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user flings its held item at the target to attack. Its power and effects depend on the item.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "38": {
    "id": 38,
    "internalName": "PUNISHMENT",
    "name": "Punishment",
    "type": "Dark",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "This attack's power increases the more the target has powered up with stat changes.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "39": {
    "id": 39,
    "internalName": "DARKVOID",
    "name": "Dark Void",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 80,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "Opposing Pokémon are dragged into a world of total darkness that makes them sleep.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "40": {
    "id": 40,
    "internalName": "EMBARGO",
    "name": "Embargo",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "It prevents the target from using its held item. Its Trainer is also prevented from using items on it.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "41": {
    "id": 41,
    "internalName": "FAKETEARS",
    "name": "Fake Tears",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user feigns crying to fluster the target, harshly lowering its Sp. Def stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "42": {
    "id": 42,
    "internalName": "FLATTER",
    "name": "Flatter",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "Flattery is used to confuse the target. However, it also raises the target's Sp. Atk stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3,
      "statChanges": [
        {
          "stat": "spAtk",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "43": {
    "id": 43,
    "internalName": "HONECLAWS",
    "name": "Hone Claws",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user sharpens its claws to boost its Attack stat and accuracy.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "44": {
    "id": 44,
    "internalName": "MEMENTO",
    "name": "Memento",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user faints when using this move. In return, it harshly lowers the target's Attack and Sp. Atk.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -2,
          "target": "self"
        },
        {
          "stat": "spAtk",
          "stages": -2,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "45": {
    "id": 45,
    "internalName": "NASTYPLOT",
    "name": "Nasty Plot",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user stimulates its brain by thinking bad thoughts. It sharply raises the user's Sp. Atk.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "spAtk",
          "stages": 2,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "46": {
    "id": 46,
    "internalName": "QUASH",
    "name": "Quash",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user suppresses the target and makes its move go last.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "47": {
    "id": 47,
    "internalName": "SNATCH",
    "name": "Snatch",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "vfxFamily": "heal",
    "description": "The user steals the effects of any healing or stat-changing move the foe attempts to use.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Partículas ascendentes, pequenos brilhos e anéis suaves em verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não em bloom contínuo.",
      "animation": "Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes e some. A barra de HP atualiza no momento definido pela lógica.",
      "combat": "Não usar hitbox ofensiva. Aplicar cura ou limpeza de status conforme a regra do move; a animação apenas comunica a mudança de estado.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "48": {
    "id": 48,
    "internalName": "SWITCHEROO",
    "name": "Switcheroo",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user trades held items with the target faster than the eye can follow.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "49": {
    "id": 49,
    "internalName": "TAUNT",
    "name": "Taunt",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The target is taunted into a rage that allows it to use only attack moves for three turns.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "50": {
    "id": 50,
    "internalName": "TORMENT",
    "name": "Torment",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user torments and enrages the foe, making it incapable of using the same move twice in a row.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": [
        2,
        2
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "51": {
    "id": 51,
    "internalName": "ROAROFTIME",
    "name": "Roar of Time",
    "type": "Dragon",
    "category": "Special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user blasts the target with power that distorts even time. The user must rest on the next turn.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "52": {
    "id": 52,
    "internalName": "DRACOMETEOR",
    "name": "Draco Meteor",
    "type": "Dragon",
    "category": "Special",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "Comets are summoned down from the sky. The attack's recoil harshly reduces the user's Sp. Atk stat.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "self"
        },
        {
          "stat": "spAtk",
          "stages": -1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "53": {
    "id": 53,
    "internalName": "OUTRAGE",
    "name": "Outrage",
    "type": "Dragon",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user rampages and attacks for two to three turns. It then becomes confused, however.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "54": {
    "id": 54,
    "internalName": "DRAGONRUSH",
    "name": "Dragon Rush",
    "type": "Dragon",
    "category": "Physical",
    "power": 100,
    "accuracy": 75,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user tackles the foe while exhibiting overwhelming menace. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "55": {
    "id": 55,
    "internalName": "SPACIALREND",
    "name": "Spacial Rend",
    "type": "Dragon",
    "category": "Special",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user tears the target along with the space around it. Critical hits land more easily.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "56": {
    "id": 56,
    "internalName": "DRAGONPULSE",
    "name": "Dragon Pulse",
    "type": "Dragon",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The target is attacked with a shock wave generated by the user's gaping mouth.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe direcionado com núcleo branco e borda colorida do elemento, com partículas orbitais ou laterais.",
      "animation": "Carga opcional, emissão contínua ou disparo concentrado, seguida de explosão curta no ponto final.",
      "combat": "Definir largura, duração e regra de colisão ao longo do feixe; não aplicar dano por frame sem intervalo explícito.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Onda / Pulso Noturno"
    }
  },
  "57": {
    "id": 57,
    "internalName": "DRAGONCLAW",
    "name": "Dragon Claw",
    "type": "Dragon",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user slashes the target with huge, sharp claws.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "58": {
    "id": 58,
    "internalName": "DRAGONTAIL",
    "name": "Dragon Tail",
    "type": "Dragon",
    "category": "Physical",
    "power": 60,
    "accuracy": 90,
    "pp": 10,
    "priority": -6,
    "vfxFamily": "beam",
    "description": "The user knocks away the target and drags out another Pokémon in its party. In the wild, the battle ends.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "59": {
    "id": 59,
    "internalName": "DRAGONBREATH",
    "name": "Dragon Breath",
    "type": "Dragon",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user exhales a mighty gust that inflicts damage. It may also leave the target with paralysis.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "60": {
    "id": 60,
    "internalName": "DUALCHOP",
    "name": "Dual Chop",
    "type": "Dragon",
    "category": "Physical",
    "power": 40,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The user attacks its target by hitting it with brutal strikes. The target is hit twice in a row.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        2
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Reutilizar o efeito principal do move em instâncias pequenas, alternando posição/ângulo e adicionando flashes discretos a cada acerto.",
      "animation": "Executar 2--5 impactos ou disparos com intervalo curto e consistente; cada hit tem seu próprio frame de contato e feedback.",
      "combat": "A quantidade de hits vem da regra do move. Evitar que uma única colisão gere todos os acertos; cada hit deve ter evento e aplicação de dano controlados.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "61": {
    "id": 61,
    "internalName": "TWISTER",
    "name": "Twister",
    "type": "Dragon",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user whips up a vicious tornado to tear at the opposing team. It may also make targets flinch.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "Wind1.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 8,
      "endFrame": 12,
      "fps": 24,
      "key": "vento_cortante",
      "theme": "Lâminas Cortantes de Vento"
    }
  },
  "62": {
    "id": 62,
    "internalName": "DRAGONRAGE",
    "name": "Dragon Rage",
    "type": "Dragon",
    "category": "Special",
    "power": 1,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "This attack hits the target with a shock wave of pure rage. This attack always inflicts 40 HP damage.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "63": {
    "id": 63,
    "internalName": "DRAGONDANCE",
    "name": "Dragon Dance",
    "type": "Dragon",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user vigorously performs a mystic, powerful dance that boosts its Attack and Speed stats.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": 1,
          "target": "self"
        },
        {
          "stat": "speed",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "64": {
    "id": 64,
    "internalName": "BOLTSTRIKE",
    "name": "Bolt Strike",
    "type": "Electric",
    "category": "Physical",
    "power": 130,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user charges at its foe, surrounding itself with lightning. It may also leave the target paralyzed.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague ou descarga elétrica com núcleo claro; faíscas amarelas se espalham no contato.",
      "animation": "Aparecimento em segmentos rápidos, breve flash e faíscas que desaparecem em poucos frames.",
      "combat": "Determinar se o raio vem do céu, percorre uma linha ou irradia do usuário. Paralisia é aplicada apenas após o teste de efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "65": {
    "id": 65,
    "internalName": "THUNDER",
    "name": "Thunder",
    "type": "Electric",
    "category": "Special",
    "power": 120,
    "accuracy": 70,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "A wicked thunderbolt is dropped on the foe to inflict damage. It may also leave the target paralyzed.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague ou descarga elétrica com núcleo claro; faíscas amarelas se espalham no contato.",
      "animation": "Aparecimento em segmentos rápidos, breve flash e faíscas que desaparecem em poucos frames.",
      "combat": "Determinar se o raio vem do céu, percorre uma linha ou irradia do usuário. Paralisia é aplicada apenas após o teste de efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "66": {
    "id": 66,
    "internalName": "VOLTTACKLE",
    "name": "Volt Tackle",
    "type": "Electric",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user electrifies itself, then charges at the foe. It causes considerable damage to the user as well.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "67": {
    "id": 67,
    "internalName": "ZAPCANNON",
    "name": "Zap Cannon",
    "type": "Electric",
    "category": "Special",
    "power": 120,
    "accuracy": 50,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user fires an electric blast like a cannon to inflict damage and cause paralysis.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague ou descarga elétrica com núcleo claro; faíscas amarelas se espalham no contato.",
      "animation": "Aparecimento em segmentos rápidos, breve flash e faíscas que desaparecem em poucos frames.",
      "combat": "Determinar se o raio vem do céu, percorre uma linha ou irradia do usuário. Paralisia é aplicada apenas após o teste de efeito secundário.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "68": {
    "id": 68,
    "internalName": "FUSIONBOLT",
    "name": "Fusion Bolt",
    "type": "Electric",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The user throws down a giant thunderbolt. It does more damage if influenced by an enormous flame.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Raio em zigue-zague ou descarga elétrica com núcleo claro; faíscas amarelas se espalham no contato.",
      "animation": "Aparecimento em segmentos rápidos, breve flash e faíscas que desaparecem em poucos frames.",
      "combat": "Determinar se o raio vem do céu, percorre uma linha ou irradia do usuário. Paralisia é aplicada apenas após o teste de efeito secundário.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "69": {
    "id": 69,
    "internalName": "THUNDERBOLT",
    "name": "Thunderbolt",
    "type": "Electric",
    "category": "Special",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "A strong electric blast is loosed at the target. It may also leave the target with paralysis.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague ou descarga elétrica com núcleo claro; faíscas amarelas se espalham no contato.",
      "animation": "Aparecimento em segmentos rápidos, breve flash e faíscas que desaparecem em poucos frames.",
      "combat": "Determinar se o raio vem do céu, percorre uma linha ou irradia do usuário. Paralisia é aplicada apenas após o teste de efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "70": {
    "id": 70,
    "internalName": "WILDCHARGE",
    "name": "Wild Charge",
    "type": "Electric",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user shrouds itself in electricity and smashes into its foe. It also damages the user a little.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "71": {
    "id": 71,
    "internalName": "DISCHARGE",
    "name": "Discharge",
    "type": "Electric",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "A flare of electricity is loosed to strike the area around the user. It may also cause paralysis.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague com segmentos angulares, núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no contato.",
      "animation": "Um ou vários segmentos aparecem em sequência rápida; o raio pisca em poucos frames; explosão de faíscas e flash breve no alvo.",
      "combat": "Pode ser raio descendente, projétil elétrico, aura de investida ou descarga radial. Paralisia é um efeito de gameplay separado do efeito luminoso.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "72": {
    "id": 72,
    "internalName": "THUNDERPUNCH",
    "name": "Thunder Punch",
    "type": "Electric",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "The target is punched with an electrified fist. It may also leave the target with paralysis.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague ou descarga elétrica com núcleo claro; faíscas amarelas se espalham no contato.",
      "animation": "Aparecimento em segmentos rápidos, breve flash e faíscas que desaparecem em poucos frames.",
      "combat": "Determinar se o raio vem do céu, percorre uma linha ou irradia do usuário. Paralisia é aplicada apenas após o teste de efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "73": {
    "id": 73,
    "internalName": "VOLTSWITCH",
    "name": "Volt Switch",
    "type": "Electric",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "After making its attack, the user rushes back to switch places with a party Pokémon in waiting.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rastro de movimento que atravessa ou contorna o alvo, com partículas na cor do tipo.",
      "animation": "Investida curta, impacto e saída do campo com afterimage; deixar a troca para depois da resolução do hit.",
      "combat": "Executar o efeito de troca após confirmar o acerto e respeitar as regras de troca do combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "74": {
    "id": 74,
    "internalName": "SPARK",
    "name": "Spark",
    "type": "Electric",
    "category": "Physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "The user throws an electrically charged tackle at the target. It may also leave the target with paralysis.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague com segmentos angulares, núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no contato.",
      "animation": "Um ou vários segmentos aparecem em sequência rápida; o raio pisca em poucos frames; explosão de faíscas e flash breve no alvo.",
      "combat": "Pode ser raio descendente, projétil elétrico, aura de investida ou descarga radial. Paralisia é um efeito de gameplay separado do efeito luminoso.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "75": {
    "id": 75,
    "internalName": "THUNDERFANG",
    "name": "Thunder Fang",
    "type": "Electric",
    "category": "Physical",
    "power": 65,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "bite",
    "description": "The user bites with electrified fangs. It may also make the target flinch or leave it with paralysis.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague ou descarga elétrica com núcleo claro; faíscas amarelas se espalham no contato.",
      "animation": "Aparecimento em segmentos rápidos, breve flash e faíscas que desaparecem em poucos frames.",
      "combat": "Determinar se o raio vem do céu, percorre uma linha ou irradia do usuário. Paralisia é aplicada apenas após o teste de efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "76": {
    "id": 76,
    "internalName": "SHOCKWAVE",
    "name": "Shock Wave",
    "type": "Electric",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user strikes the target with a quick jolt of electricity. This attack cannot be evaded.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "77": {
    "id": 77,
    "internalName": "ELECTROWEB",
    "name": "Electroweb",
    "type": "Electric",
    "category": "Special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "The user captures and attacks foes by using an electric net, which lowers their Speed stat.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "self"
        },
        {
          "stat": "speed",
          "stages": -1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Raio em zigue-zague com segmentos angulares, núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no contato.",
      "animation": "Um ou vários segmentos aparecem em sequência rápida; o raio pisca em poucos frames; explosão de faíscas e flash breve no alvo.",
      "combat": "Pode ser raio descendente, projétil elétrico, aura de investida ou descarga radial. Paralisia é um efeito de gameplay separado do efeito luminoso.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "78": {
    "id": 78,
    "internalName": "CHARGEBEAM",
    "name": "Charge Beam",
    "type": "Electric",
    "category": "Special",
    "power": 50,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user fires a concentrated bundle of electricity. It may also raise the user's Sp. Atk stat.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "79": {
    "id": 79,
    "internalName": "THUNDERSHOCK",
    "name": "Thunder Shock",
    "type": "Electric",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "A jolt of electricity is hurled at the foe to inflict damage. It may also leave the target with paralysis.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague ou descarga elétrica com núcleo claro; faíscas amarelas se espalham no contato.",
      "animation": "Aparecimento em segmentos rápidos, breve flash e faíscas que desaparecem em poucos frames.",
      "combat": "Determinar se o raio vem do céu, percorre uma linha ou irradia do usuário. Paralisia é aplicada apenas após o teste de efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "80": {
    "id": 80,
    "internalName": "ELECTROBALL",
    "name": "Electro Ball",
    "type": "Electric",
    "category": "Special",
    "power": 1,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "The user hurls an electric orb at the foe. It does more damage the faster the user is.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Raio em zigue-zague com segmentos angulares, núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no contato.",
      "animation": "Um ou vários segmentos aparecem em sequência rápida; o raio pisca em poucos frames; explosão de faíscas e flash breve no alvo.",
      "combat": "Pode ser raio descendente, projétil elétrico, aura de investida ou descarga radial. Paralisia é um efeito de gameplay separado do efeito luminoso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "81": {
    "id": 81,
    "internalName": "CHARGE",
    "name": "Charge",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user boosts the power of the Electric move it uses next. It also raises the user's Sp. Def stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "spDef",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "82": {
    "id": 82,
    "internalName": "MAGNETRISE",
    "name": "Magnet Rise",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "The user levitates using electrically generated magnetism for five turns.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Raio em zigue-zague com segmentos angulares, núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no contato.",
      "animation": "Um ou vários segmentos aparecem em sequência rápida; o raio pisca em poucos frames; explosão de faíscas e flash breve no alvo.",
      "combat": "Pode ser raio descendente, projétil elétrico, aura de investida ou descarga radial. Paralisia é um efeito de gameplay separado do efeito luminoso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "83": {
    "id": 83,
    "internalName": "THUNDERWAVE",
    "name": "Thunder Wave",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "A weak electric charge is launched at the target. It causes paralysis if it hits.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague ou descarga elétrica com núcleo claro; faíscas amarelas se espalham no contato.",
      "animation": "Aparecimento em segmentos rápidos, breve flash e faíscas que desaparecem em poucos frames.",
      "combat": "Determinar se o raio vem do céu, percorre uma linha ou irradia do usuário. Paralisia é aplicada apenas após o teste de efeito secundário.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "84": {
    "id": 84,
    "internalName": "FOCUSPUNCH",
    "name": "Focus Punch",
    "type": "Fighting",
    "category": "Physical",
    "power": 150,
    "accuracy": 100,
    "pp": 20,
    "priority": -3,
    "vfxFamily": "psychic",
    "description": "The user focuses its mind before launching a punch. It will fail if the user is hit before it is used.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "85": {
    "id": 85,
    "internalName": "HIGHJUMPKICK",
    "name": "High Jump Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 130,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is attacked with a knee kick from a jump. If it misses, the user is hurt instead.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "86": {
    "id": 86,
    "internalName": "CLOSECOMBAT",
    "name": "Close Combat",
    "type": "Fighting",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user fights the foe up close without guarding itself. It also cuts the user's Defense and Sp. Def.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "def",
          "stages": -1,
          "target": "self"
        },
        {
          "stat": "spDef",
          "stages": -1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "87": {
    "id": 87,
    "internalName": "FOCUSBLAST",
    "name": "Focus Blast",
    "type": "Fighting",
    "category": "Special",
    "power": 120,
    "accuracy": 70,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user heightens its mental focus and unleashes its power. It may also lower the target's Sp. Def.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "88": {
    "id": 88,
    "internalName": "SUPERPOWER",
    "name": "Superpower",
    "type": "Fighting",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user attacks the target with great power. However, it also lowers the user's Attack and Defense.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "def",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "89": {
    "id": 89,
    "internalName": "CROSSCHOP",
    "name": "Cross Chop",
    "type": "Fighting",
    "category": "Physical",
    "power": 100,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user delivers a double chop with its forearms crossed. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": [
        2,
        2
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "90": {
    "id": 90,
    "internalName": "DYNAMICPUNCH",
    "name": "Dynamic Punch",
    "type": "Fighting",
    "category": "Physical",
    "power": 100,
    "accuracy": 50,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user punches the target with full, concentrated power. It confuses the target if it hits.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "91": {
    "id": 91,
    "internalName": "HAMMERARM",
    "name": "Hammer Arm",
    "type": "Fighting",
    "category": "Physical",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user swings and hits with its strong and heavy fist. It lowers the user's Speed, however.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "speed",
          "stages": -1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "92": {
    "id": 92,
    "internalName": "JUMPKICK",
    "name": "Jump Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 100,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user jumps up high, then strikes with a kick. If the kick misses, the user hurts itself.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "93": {
    "id": 93,
    "internalName": "AURASPHERE",
    "name": "Aura Sphere",
    "type": "Fighting",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user looses a blast of aura power from deep within its body. This move is certain to hit.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "94": {
    "id": 94,
    "internalName": "SACREDSWORD",
    "name": "Sacred Sword",
    "type": "Fighting",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user attacks by slicing with its long horns. The target's stat changes don't affect the damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "95": {
    "id": 95,
    "internalName": "SECRETSWORD",
    "name": "Secret Sword",
    "type": "Fighting",
    "category": "Special",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user cuts with its long horn. The odd power contained in it does physical damage to the foe.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "96": {
    "id": 96,
    "internalName": "SKYUPPERCUT",
    "name": "Sky Uppercut",
    "type": "Fighting",
    "category": "Physical",
    "power": 85,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user attacks the target with an uppercut thrown skyward with force.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "97": {
    "id": 97,
    "internalName": "SUBMISSION",
    "name": "Submission",
    "type": "Fighting",
    "category": "Physical",
    "power": 80,
    "accuracy": 80,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user grabs the target and recklessly dives for the ground. It also hurts the user slightly.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "98": {
    "id": 98,
    "internalName": "BRICKBREAK",
    "name": "Brick Break",
    "type": "Fighting",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user attacks with a swift chop. It can also break any barrier such as Light Screen and Reflect.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "99": {
    "id": 99,
    "internalName": "DRAINPUNCH",
    "name": "Drain Punch",
    "type": "Fighting",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "An energy-draining punch. The user's HP is restored by half the damage taken by the target.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0.5,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "100": {
    "id": 100,
    "internalName": "VITALTHROW",
    "name": "Vital Throw",
    "type": "Fighting",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": -1,
    "vfxFamily": "impact",
    "description": "The user attacks last. In return, this throw move is guaranteed not to miss.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "101": {
    "id": 101,
    "internalName": "CIRCLETHROW",
    "name": "Circle Throw",
    "type": "Fighting",
    "category": "Physical",
    "power": 60,
    "accuracy": 90,
    "pp": 10,
    "priority": -6,
    "vfxFamily": "impact",
    "description": "The user throws the target and drags out another Pokémon in its party. In the wild, the battle ends.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "102": {
    "id": 102,
    "internalName": "FORCEPALM",
    "name": "Force Palm",
    "type": "Fighting",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The target is attacked with a shock wave. It may also leave the target with paralysis.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "103": {
    "id": 103,
    "internalName": "LOWSWEEP",
    "name": "Low Sweep",
    "type": "Fighting",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user attacks the target's legs swiftly, reducing the target's Speed stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "104": {
    "id": 104,
    "internalName": "REVENGE",
    "name": "Revenge",
    "type": "Fighting",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": -4,
    "vfxFamily": "impact",
    "description": "An attack move that inflicts double the damage if the user has been hurt by the foe in the same turn.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "105": {
    "id": 105,
    "internalName": "ROLLINGKICK",
    "name": "Rolling Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 60,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user lashes out with a quick, spinning kick. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "106": {
    "id": 106,
    "internalName": "WAKEUPSLAP",
    "name": "Wake-Up Slap",
    "type": "Fighting",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "This attack inflicts big damage on a sleeping target. It also wakes the target up, however.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "107": {
    "id": 107,
    "internalName": "KARATECHOP",
    "name": "Karate Chop",
    "type": "Fighting",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The target is attacked with a sharp chop. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "108": {
    "id": 108,
    "internalName": "MACHPUNCH",
    "name": "Mach Punch",
    "type": "Fighting",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "vfxFamily": "impact",
    "description": "The user throws a punch at blinding speed. It is certain to strike first.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "109": {
    "id": 109,
    "internalName": "ROCKSMASH",
    "name": "Rock Smash",
    "type": "Fighting",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user attacks with a punch that can shatter a rock. It may also lower the foe's Defense stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "110": {
    "id": 110,
    "internalName": "STORMTHROW",
    "name": "Storm Throw",
    "type": "Fighting",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user strikes the target with a fierce blow. This attack always results in a critical hit.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "111": {
    "id": 111,
    "internalName": "VACUUMWAVE",
    "name": "Vacuum Wave",
    "type": "Fighting",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "vfxFamily": "beam",
    "description": "The user whirls its fists to send a wave of pure vacuum at the target. This move always goes first.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 6,
      "endFrame": 10,
      "fps": 24,
      "key": "agua_tsunami",
      "theme": "Onda Torrencial / Tsunami"
    }
  },
  "112": {
    "id": 112,
    "internalName": "DOUBLEKICK",
    "name": "Double Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 30,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The target is quickly kicked twice in succession using both feet.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        2
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "113": {
    "id": 113,
    "internalName": "ARMTHRUST",
    "name": "Arm Thrust",
    "type": "Fighting",
    "category": "Physical",
    "power": 15,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The user looses a flurry of open-palmed arm thrusts that hit two to five times in a row.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "114": {
    "id": 114,
    "internalName": "TRIPLEKICK",
    "name": "Triple Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 10,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "A consecutive three-kick attack that becomes more powerful with each successive hit.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        3,
        3
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Reutilizar o efeito principal do move em instâncias pequenas, alternando posição/ângulo e adicionando flashes discretos a cada acerto.",
      "animation": "Executar 2--5 impactos ou disparos com intervalo curto e consistente; cada hit tem seu próprio frame de contato e feedback.",
      "combat": "A quantidade de hits vem da regra do move. Evitar que uma única colisão gere todos os acertos; cada hit deve ter evento e aplicação de dano controlados.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "115": {
    "id": 115,
    "internalName": "COUNTER",
    "name": "Counter",
    "type": "Fighting",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 20,
    "priority": -5,
    "vfxFamily": "impact",
    "description": "A retaliation move that counters any physical attack, inflicting double the damage taken.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "116": {
    "id": 116,
    "internalName": "FINALGAMBIT",
    "name": "Final Gambit",
    "type": "Fighting",
    "category": "Special",
    "power": 1,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "The user risks all to attack the foe. The user faints but does damage equal to its HP.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "117": {
    "id": 117,
    "internalName": "LOWKICK",
    "name": "Low Kick",
    "type": "Fighting",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "A powerful low kick that makes the foe fall over. It inflicts greater damage on heavier foes.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "118": {
    "id": 118,
    "internalName": "REVERSAL",
    "name": "Reversal",
    "type": "Fighting",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "An all-out attack that becomes more powerful the less HP the user has.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "119": {
    "id": 119,
    "internalName": "SEISMICTOSS",
    "name": "Seismic Toss",
    "type": "Fighting",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is thrown using the power of gravity. It inflicts damage equal to the user's level.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "120": {
    "id": 120,
    "internalName": "BULKUP",
    "name": "Bulk Up",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user tenses its muscles to bulk up its body, boosting both its Attack and Defense stats.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "121": {
    "id": 121,
    "internalName": "DETECT",
    "name": "Detect",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 4,
    "vfxFamily": "status",
    "description": "It enables the user to evade all attacks. Its chance of failing rises if it is used in succession.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Escudo de contorno pixelado, hexágonos ou espinhos ao redor do usuário; brilho forte apenas na ativação.",
      "animation": "Escudo aparece em 2--3 etapas, pisca quando bloqueia e desaparece ao fim da janela de proteção.",
      "combat": "Ativar a proteção em estado próprio com duração definida. Dano refletido só existe quando a regra do move o especificar.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "122": {
    "id": 122,
    "internalName": "QUICKGUARD",
    "name": "Quick Guard",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 3,
    "vfxFamily": "status",
    "description": "The user protects itself and its allies from priority moves. If may fail if used in succession.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Escudo de contorno pixelado, hexágonos ou espinhos ao redor do usuário; brilho forte apenas na ativação.",
      "animation": "Escudo aparece em 2--3 etapas, pisca quando bloqueia e desaparece ao fim da janela de proteção.",
      "combat": "Ativar a proteção em estado próprio com duração definida. Dano refletido só existe quando a regra do move o especificar.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "123": {
    "id": 123,
    "internalName": "VCREATE",
    "name": "V-create",
    "type": "Fire",
    "category": "Physical",
    "power": 180,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "With a fiery forehead, the user hurls itself at the foe. It lowers the user's Defense, Sp. Def, and Speed.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "def",
          "stages": -1,
          "target": "self"
        },
        {
          "stat": "spDef",
          "stages": -1,
          "target": "self"
        },
        {
          "stat": "speed",
          "stages": -1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "124": {
    "id": 124,
    "internalName": "BLASTBURN",
    "name": "Blast Burn",
    "type": "Fire",
    "category": "Special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The target is razed by a fiery explosion. The user must rest on the next turn, however.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "125": {
    "id": 125,
    "internalName": "ERUPTION",
    "name": "Eruption",
    "type": "Fire",
    "category": "Special",
    "power": 150,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user attacks in an explosive fury. The lower the user's HP, the less powerful this attack becomes.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "126": {
    "id": 126,
    "internalName": "OVERHEAT",
    "name": "Overheat",
    "type": "Fire",
    "category": "Special",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user attacks the target at full power. The attack's recoil sharply reduces the user's Sp. Atk stat.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "spAtk",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "127": {
    "id": 127,
    "internalName": "BLUEFLARE",
    "name": "Blue Flare",
    "type": "Fire",
    "category": "Special",
    "power": 130,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The user attacks by engulfing the foe in a beautiful, yet intense, blue flame. It may also burn the foe.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "128": {
    "id": 128,
    "internalName": "FIREBLAST",
    "name": "Fire Blast",
    "type": "Fire",
    "category": "Special",
    "power": 120,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The foe is attacked with an intense blast of all-consuming fire. It may also leave the target with a burn.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "129": {
    "id": 129,
    "internalName": "FLAREBLITZ",
    "name": "Flare Blitz",
    "type": "Fire",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user cloaks itself in fire and charges at the foe. The user also takes damage and may burn the target.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "130": {
    "id": 130,
    "internalName": "MAGMASTORM",
    "name": "Magma Storm",
    "type": "Fire",
    "category": "Special",
    "power": 120,
    "accuracy": 75,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The target becomes trapped within a maelstrom of fire that rages for four to five turns.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "131": {
    "id": 131,
    "internalName": "FUSIONFLARE",
    "name": "Fusion Flare",
    "type": "Fire",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The user brings down a giant flame. It does more damage if influenced by an enormous thunderbolt.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "132": {
    "id": 132,
    "internalName": "HEATWAVE",
    "name": "Heat Wave",
    "type": "Fire",
    "category": "Special",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user attacks by exhaling hot breath on the opposing team. It may also leave targets with a burn.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 6,
      "endFrame": 10,
      "fps": 24,
      "key": "agua_tsunami",
      "theme": "Onda Torrencial / Tsunami"
    }
  },
  "133": {
    "id": 133,
    "internalName": "INFERNO",
    "name": "Inferno",
    "type": "Fire",
    "category": "Special",
    "power": 100,
    "accuracy": 50,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user attacks by engulfing the target in an intense fire. It leaves the target with a burn.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "134": {
    "id": 134,
    "internalName": "SACREDFIRE",
    "name": "Sacred Fire",
    "type": "Fire",
    "category": "Physical",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The target is razed with a mystical fire of great intensity. It may also leave the target with a burn.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "135": {
    "id": 135,
    "internalName": "SEARINGSHOT",
    "name": "Searing Shot",
    "type": "Fire",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "An inferno of scarlet flames torches everything around the user. It may leave the foe with a burn.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "136": {
    "id": 136,
    "internalName": "FLAMETHROWER",
    "name": "Flamethrower",
    "type": "Fire",
    "category": "Special",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The target is scorched with an intense blast of fire. It may also leave the target with a burn.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe direcionado com núcleo branco e borda colorida do elemento, com partículas orbitais ou laterais.",
      "animation": "Carga opcional, emissão contínua ou disparo concentrado, seguida de explosão curta no ponto final.",
      "combat": "Definir largura, duração e regra de colisão ao longo do feixe; não aplicar dano por frame sem intervalo explícito.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "137": {
    "id": 137,
    "internalName": "BLAZEKICK",
    "name": "Blaze Kick",
    "type": "Fire",
    "category": "Physical",
    "power": 85,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The user launches a kick with a high critical-hit ratio. It may also leave the target with a burn.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "138": {
    "id": 138,
    "internalName": "FIERYDANCE",
    "name": "Fiery Dance",
    "type": "Fire",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "Cloaked in flames, the user dances and flaps its wings. It may also raise the user's Sp. Atk stat.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "139": {
    "id": 139,
    "internalName": "LAVAPLUME",
    "name": "Lava Plume",
    "type": "Fire",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "An inferno of scarlet flames torches everything around the user. It may leave targets with a burn.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "140": {
    "id": 140,
    "internalName": "FIREPUNCH",
    "name": "Fire Punch",
    "type": "Fire",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The target is punched with a fiery fist. It may leave the target with a burn.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "141": {
    "id": 141,
    "internalName": "FLAMEBURST",
    "name": "Flame Burst",
    "type": "Fire",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user attacks the foe with a bursting flame. It also damages Pokémon next to the target.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "142": {
    "id": 142,
    "internalName": "FIREFANG",
    "name": "Fire Fang",
    "type": "Fire",
    "category": "Physical",
    "power": 65,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "bite",
    "description": "The user bites with flame-cloaked fangs. It may also make the target flinch or leave it burned.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Duas mandíbulas ou presas pixeladas que se fecham ao redor do ponto de contato; usar sombra escura, dentes claros e flash breve.",
      "animation": "Abrir mandíbula durante a antecipação; fechar rapidamente no contato; recuar e remover o overlay sem cobrir o Pokémon por muito tempo.",
      "combat": "Exige proximidade. O acerto ocorre no instante do fechamento das mandíbulas; efeitos de flinch ou redução de defesa são tratados pela lógica de status, não pelo desenho.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "143": {
    "id": 143,
    "internalName": "FLAMEWHEEL",
    "name": "Flame Wheel",
    "type": "Fire",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user cloaks itself in fire and charges at the target. It may also leave the target with a burn.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "144": {
    "id": 144,
    "internalName": "FIREPLEDGE",
    "name": "Fire Pledge",
    "type": "Fire",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "A column of fire hits opposing Pokémon. When used with its Grass equivalent, it makes a sea of fire.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "145": {
    "id": 145,
    "internalName": "FLAMECHARGE",
    "name": "Flame Charge",
    "type": "Fire",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user cloaks itself with flame and attacks. Building up more power, it raises the user's Speed stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": 1,
          "target": "self"
        },
        {
          "stat": "speed",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "146": {
    "id": 146,
    "internalName": "EMBER",
    "name": "Ember",
    "type": "Fire",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The target is attacked with small flames. It may also leave the target with a burn.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "147": {
    "id": 147,
    "internalName": "FIRESPIN",
    "name": "Fire Spin",
    "type": "Fire",
    "category": "Special",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The target becomes trapped within a fierce vortex of fire that rages for four to five turns.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 5,
      "endFrame": 9,
      "fps": 24,
      "key": "fogo_vortice",
      "theme": "Vórtice de Chamas"
    }
  },
  "148": {
    "id": 148,
    "internalName": "INCINERATE",
    "name": "Incinerate",
    "type": "Fire",
    "category": "Special",
    "power": 30,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The user attacks the foe with fire. If the target is holding a Berry, it becomes burnt up and unusable.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "149": {
    "id": 149,
    "internalName": "HEATCRASH",
    "name": "Heat Crash",
    "type": "Fire",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The user slams the foe with its flaming body. The heavier the user is, the greater the damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "150": {
    "id": 150,
    "internalName": "SUNNYDAY",
    "name": "Sunny Day",
    "type": "Fire",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user intensifies the sun for five turns, powering up Fire-type moves.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Overlay de clima em toda a arena: chuva diagonal, calor ondulante, areia horizontal ou neve em flocos quadrados.",
      "animation": "Transição curta do clima atual para o novo; partículas contínuas de baixa densidade enquanto durar.",
      "combat": "Clima é um estado global com duração; não deve ser recriado individualmente por cada frame ou Pokémon.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "151": {
    "id": 151,
    "internalName": "WILLOWISP",
    "name": "Will-O-Wisp",
    "type": "Fire",
    "category": "Status",
    "power": 0,
    "accuracy": 75,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user shoots a sinister, bluish-white flame at the target to inflict a burn.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "152": {
    "id": 152,
    "internalName": "SKYATTACK",
    "name": "Sky Attack",
    "type": "Flying",
    "category": "Physical",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "A second-turn attack move where critical hits land more easily. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "153": {
    "id": 153,
    "internalName": "BRAVEBIRD",
    "name": "Brave Bird",
    "type": "Flying",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user tucks in its wings and charges from a low altitude. The user also takes serious damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "154": {
    "id": 154,
    "internalName": "HURRICANE",
    "name": "Hurricane",
    "type": "Flying",
    "category": "Special",
    "power": 120,
    "accuracy": 70,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user wraps its foe in a fierce wind that flies up into the sky. It may also confuse the foe.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "Wind1.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 8,
      "endFrame": 12,
      "fps": 24,
      "key": "vento_cortante",
      "theme": "Lâminas Cortantes de Vento"
    }
  },
  "155": {
    "id": 155,
    "internalName": "AEROBLAST",
    "name": "Aeroblast",
    "type": "Flying",
    "category": "Special",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "A vortex of air is shot at the target to inflict damage. Critical hits land more easily.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "156": {
    "id": 156,
    "internalName": "FLY",
    "name": "Fly",
    "type": "Flying",
    "category": "Physical",
    "power": 90,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user soars, then strikes on the second turn. It can also be used for flying to any familiar town.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "Wind1.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 8,
      "endFrame": 12,
      "fps": 24,
      "key": "vento_cortante",
      "theme": "Lâminas Cortantes de Vento"
    }
  },
  "157": {
    "id": 157,
    "internalName": "BOUNCE",
    "name": "Bounce",
    "type": "Flying",
    "category": "Physical",
    "power": 85,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user bounces up high, then drops on the foe on the second turn. It may also paralyze the foe.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "158": {
    "id": 158,
    "internalName": "DRILLPECK",
    "name": "Drill Peck",
    "type": "Flying",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "A corkscrewing attack with the sharp beak acting as a drill.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "159": {
    "id": 159,
    "internalName": "AIRSLASH",
    "name": "Air Slash",
    "type": "Flying",
    "category": "Special",
    "power": 75,
    "accuracy": 95,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user attacks with a blade of air that slices even the sky. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "160": {
    "id": 160,
    "internalName": "AERIALACE",
    "name": "Aerial Ace",
    "type": "Flying",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user confounds the foe with speed, then slashes. The attack lands without fail.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Wind1.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 8,
      "endFrame": 12,
      "fps": 24,
      "key": "vento_cortante",
      "theme": "Lâminas Cortantes de Vento"
    }
  },
  "161": {
    "id": 161,
    "internalName": "CHATTER",
    "name": "Chatter",
    "type": "Flying",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user attacks using a sound wave based on words it has learned. It may also confuse the target.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "162": {
    "id": 162,
    "internalName": "PLUCK",
    "name": "Pluck",
    "type": "Flying",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user pecks the target. If the target is holding a Berry, the user eats it and gains its effect.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "163": {
    "id": 163,
    "internalName": "SKYDROP",
    "name": "Sky Drop",
    "type": "Flying",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user takes the foe into the sky, then drops it on the next turn. The foe cannot attack while airborne.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "164": {
    "id": 164,
    "internalName": "WINGATTACK",
    "name": "Wing Attack",
    "type": "Flying",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is struck with large, imposing wings spread wide to inflict damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Wind1.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 8,
      "endFrame": 12,
      "fps": 24,
      "key": "vento_cortante",
      "theme": "Lâminas Cortantes de Vento"
    }
  },
  "165": {
    "id": 165,
    "internalName": "ACROBATICS",
    "name": "Acrobatics",
    "type": "Flying",
    "category": "Physical",
    "power": 55,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user nimbly strikes the foe. This attack does more damage if the user is not holding an item.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "166": {
    "id": 166,
    "internalName": "AIRCUTTER",
    "name": "Air Cutter",
    "type": "Flying",
    "category": "Special",
    "power": 55,
    "accuracy": 95,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user launches razor-like wind to slash the opposing team. Critical hits land more easily.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "167": {
    "id": 167,
    "internalName": "GUST",
    "name": "Gust",
    "type": "Flying",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "A gust of wind is whipped up by wings and launched at the target to inflict damage.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Wind1.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 8,
      "endFrame": 12,
      "fps": 24,
      "key": "vento_cortante",
      "theme": "Lâminas Cortantes de Vento"
    }
  },
  "168": {
    "id": 168,
    "internalName": "PECK",
    "name": "Peck",
    "type": "Flying",
    "category": "Physical",
    "power": 35,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is jabbed with a sharply pointed beak or horn.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "169": {
    "id": 169,
    "internalName": "DEFOG",
    "name": "Defog",
    "type": "Flying",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "A strong wind blows away the foe's obstacles such as Light Screen. It also lowers their evasion.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "170": {
    "id": 170,
    "internalName": "FEATHERDANCE",
    "name": "Feather Dance",
    "type": "Flying",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user covers the target's body with a mass of down that harshly lowers its Attack stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -2,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "171": {
    "id": 171,
    "internalName": "MIRRORMOVE",
    "name": "Mirror Move",
    "type": "Flying",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user counters the target by mimicking the target's last move.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "172": {
    "id": 172,
    "internalName": "ROOST",
    "name": "Roost",
    "type": "Flying",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user lands and rests its body. It restores the user's HP by up to half of its max HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Brilhos em partículas que sobem e pequenos símbolos luminosos em torno do Pokémon.",
      "animation": "Aura se expande, pulsa e desaparece; a barra de HP muda no frame de resolução da cura.",
      "combat": "Aplicar a quantidade de cura e os limites de HP pela lógica; o efeito visual não determina o valor restaurado.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "173": {
    "id": 173,
    "internalName": "TAILWIND",
    "name": "Tailwind",
    "type": "Flying",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user whips up a turbulent whirlwind that ups the Speed of all party Pokémon for four turns.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Wind1.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 8,
      "endFrame": 12,
      "fps": 24,
      "key": "vento_cortante",
      "theme": "Lâminas Cortantes de Vento"
    }
  },
  "174": {
    "id": 174,
    "internalName": "SHADOWFORCE",
    "name": "Shadow Force",
    "type": "Ghost",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user disappears, then strikes the foe on the second turn. It hits even if the foe protects itself.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "175": {
    "id": 175,
    "internalName": "SHADOWBALL",
    "name": "Shadow Ball",
    "type": "Ghost",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user hurls a shadowy blob at the target. It may also lower the target's Sp. Def stat.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "030-Explosion01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "espectral_fantasma",
      "theme": "Ectoplasma Espectral Sombrio"
    }
  },
  "176": {
    "id": 176,
    "internalName": "SHADOWCLAW",
    "name": "Shadow Claw",
    "type": "Ghost",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user slashes with a sharp claw made from shadows. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "177": {
    "id": 177,
    "internalName": "OMINOUSWIND",
    "name": "Ominous Wind",
    "type": "Ghost",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user blasts the target with a gust of repulsive wind. It may also raise all the user's stats at once.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "030-Explosion01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "espectral_fantasma",
      "theme": "Ectoplasma Espectral Sombrio"
    }
  },
  "178": {
    "id": 178,
    "internalName": "SHADOWPUNCH",
    "name": "Shadow Punch",
    "type": "Ghost",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user throws a punch from the shadows. The punch lands without fail.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "179": {
    "id": 179,
    "internalName": "HEX",
    "name": "Hex",
    "type": "Ghost",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "This relentless attack does massive damage to a target affected by status problems.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "030-Explosion01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "espectral_fantasma",
      "theme": "Ectoplasma Espectral Sombrio"
    }
  },
  "180": {
    "id": 180,
    "internalName": "SHADOWSNEAK",
    "name": "Shadow Sneak",
    "type": "Ghost",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "vfxFamily": "shadow",
    "description": "The user extends its shadow and attacks the target from behind. This move always goes first.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "181": {
    "id": 181,
    "internalName": "ASTONISH",
    "name": "Astonish",
    "type": "Ghost",
    "category": "Physical",
    "power": 30,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user attacks the target while shouting in a startling fashion. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "030-Explosion01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "espectral_fantasma",
      "theme": "Ectoplasma Espectral Sombrio"
    }
  },
  "182": {
    "id": 182,
    "internalName": "LICK",
    "name": "Lick",
    "type": "Ghost",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The target is licked with a long tongue, causing damage. It may also leave the target with paralysis.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "030-Explosion01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "espectral_fantasma",
      "theme": "Ectoplasma Espectral Sombrio"
    }
  },
  "183": {
    "id": 183,
    "internalName": "NIGHTSHADE",
    "name": "Night Shade",
    "type": "Ghost",
    "category": "Special",
    "power": 1,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user makes the foe see a frightening mirage. It inflicts damage matching the user's level.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "184": {
    "id": 184,
    "internalName": "CONFUSERAY",
    "name": "Confuse Ray",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The target is exposed to a sinister ray that triggers confusion.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "185": {
    "id": 185,
    "internalName": "CURSE",
    "name": "Curse",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "A move that works differently for the Ghost type than for all the other types.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "030-Explosion01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "espectral_fantasma",
      "theme": "Ectoplasma Espectral Sombrio"
    }
  },
  "186": {
    "id": 186,
    "internalName": "DESTINYBOND",
    "name": "Destiny Bond",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "status",
    "description": "When this move is used, if the user faints, the foe that landed the knockout hit also faints.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "187": {
    "id": 187,
    "internalName": "GRUDGE",
    "name": "Grudge",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "status",
    "description": "If the user faints, the user's grudge fully depletes the PP of the foe's move that knocked it out.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "188": {
    "id": 188,
    "internalName": "NIGHTMARE",
    "name": "Nightmare",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "A sleeping target sees a nightmare that inflicts some damage every turn.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "030-Explosion01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "espectral_fantasma",
      "theme": "Ectoplasma Espectral Sombrio"
    }
  },
  "189": {
    "id": 189,
    "internalName": "SPITE",
    "name": "Spite",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user unleashes its grudge on the move last used by the target by cutting 4 PP from it.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "190": {
    "id": 190,
    "internalName": "FRENZYPLANT",
    "name": "Frenzy Plant",
    "type": "Grass",
    "category": "Special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user slams the target with an enormous tree. The user can't move on the next turn.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "191": {
    "id": 191,
    "internalName": "LEAFSTORM",
    "name": "Leaf Storm",
    "type": "Grass",
    "category": "Special",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "A storm of sharp is whipped up. The attack's recoil harshly reduces the user's Sp. Atk stat.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "self"
        },
        {
          "stat": "spAtk",
          "stages": -1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "192": {
    "id": 192,
    "internalName": "PETALDANCE",
    "name": "Petal Dance",
    "type": "Grass",
    "category": "Special",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user attacks by scattering petals for two to three turns. The user then becomes confused.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "193": {
    "id": 193,
    "internalName": "POWERWHIP",
    "name": "Power Whip",
    "type": "Grass",
    "category": "Physical",
    "power": 120,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user violently whirls its vines or tentacles to harshly lash the target.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "194": {
    "id": 194,
    "internalName": "SEEDFLARE",
    "name": "Seed Flare",
    "type": "Grass",
    "category": "Special",
    "power": 120,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user generates a shock wave from within its body. It may harshly lower the target's Sp. Def.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "195": {
    "id": 195,
    "internalName": "SOLARBEAM",
    "name": "Solar Beam",
    "type": "Grass",
    "category": "Special",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "A two-turn attack. The user gathers light, then blasts a bundled beam on the second turn.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe direcionado com núcleo branco e borda colorida do elemento, com partículas orbitais ou laterais.",
      "animation": "Carga opcional, emissão contínua ou disparo concentrado, seguida de explosão curta no ponto final.",
      "combat": "Definir largura, duração e regra de colisão ao longo do feixe; não aplicar dano por frame sem intervalo explícito.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "196": {
    "id": 196,
    "internalName": "WOODHAMMER",
    "name": "Wood Hammer",
    "type": "Grass",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user slams its rugged body into the target to attack. The user also sustains serious damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "197": {
    "id": 197,
    "internalName": "LEAFBLADE",
    "name": "Leaf Blade",
    "type": "Grass",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user handles a sharp leaf like a sword and attacks by slashing. It has a high critical-hit ratio.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "198": {
    "id": 198,
    "internalName": "ENERGYBALL",
    "name": "Energy Ball",
    "type": "Grass",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The user draws power from nature and fires it at the target. It may also lower the target's Sp. Def.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "199": {
    "id": 199,
    "internalName": "SEEDBOMB",
    "name": "Seed Bomb",
    "type": "Grass",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The user slams a barrage of hard-shelled seeds down on the target from above.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Reutilizar o efeito principal do move em instâncias pequenas, alternando posição/ângulo e adicionando flashes discretos a cada acerto.",
      "animation": "Executar 2--5 impactos ou disparos com intervalo curto e consistente; cada hit tem seu próprio frame de contato e feedback.",
      "combat": "A quantidade de hits vem da regra do move. Evitar que uma única colisão gere todos os acertos; cada hit deve ter evento e aplicação de dano controlados.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "200": {
    "id": 200,
    "internalName": "GIGADRAIN",
    "name": "Giga Drain",
    "type": "Grass",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "A nutrient-draining attack. The user's HP is restored by half the damage taken by the target.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0.5,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "201": {
    "id": 201,
    "internalName": "HORNLEECH",
    "name": "Horn Leech",
    "type": "Grass",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user drains the foe's energy with its horns. The user's HP is restored by half the damage inflicted.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0.5,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "202": {
    "id": 202,
    "internalName": "LEAFTORNADO",
    "name": "Leaf Tornado",
    "type": "Grass",
    "category": "Special",
    "power": 65,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user attacks its foe by encircling it in sharp leaves. This attack may also lower the foe's accuracy.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 5,
      "endFrame": 9,
      "fps": 24,
      "key": "fogo_vortice",
      "theme": "Vórtice de Chamas"
    }
  },
  "203": {
    "id": 203,
    "internalName": "MAGICALLEAF",
    "name": "Magical Leaf",
    "type": "Grass",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user scatters curious leaves that chase the target. This attack will not miss.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "204": {
    "id": 204,
    "internalName": "NEEDLEARM",
    "name": "Needle Arm",
    "type": "Grass",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user attacks by wildly swinging its thorny arms. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "205": {
    "id": 205,
    "internalName": "RAZORLEAF",
    "name": "Razor Leaf",
    "type": "Grass",
    "category": "Physical",
    "power": 55,
    "accuracy": 95,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "Sharp-edged leaves are launched to slash at the opposing team. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "206": {
    "id": 206,
    "internalName": "GRASSPLEDGE",
    "name": "Grass Pledge",
    "type": "Grass",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "A column of grass hits the foes. When used with its water equivalent, it creates a vast swamp.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "207": {
    "id": 207,
    "internalName": "MEGADRAIN",
    "name": "Mega Drain",
    "type": "Grass",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "water",
    "description": "A nutrient-draining attack. The user's HP is restored by half the damage taken by the target.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0.5,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "208": {
    "id": 208,
    "internalName": "VINEWHIP",
    "name": "Vine Whip",
    "type": "Grass",
    "category": "Physical",
    "power": 35,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The target is struck with slender, whiplike vines to inflict damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "209": {
    "id": 209,
    "internalName": "BULLETSEED",
    "name": "Bullet Seed",
    "type": "Grass",
    "category": "Physical",
    "power": 25,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The user forcefully shoots seeds at the target. Two to five seeds are shot in rapid succession.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "210": {
    "id": 210,
    "internalName": "ABSORB",
    "name": "Absorb",
    "type": "Grass",
    "category": "Special",
    "power": 20,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "water",
    "description": "A nutrient-draining attack. The user's HP is restored by half the damage taken by the target.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0.5,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "211": {
    "id": 211,
    "internalName": "GRASSKNOT",
    "name": "Grass Knot",
    "type": "Grass",
    "category": "Special",
    "power": 1,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user snares the target with grass and trips it. The heavier the target, the greater the damage.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "212": {
    "id": 212,
    "internalName": "AROMATHERAPY",
    "name": "Aromatherapy",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user releases a soothing scent that heals all status problems affecting the user's party.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Partículas ascendentes, pequenos brilhos e anéis suaves em verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não em bloom contínuo.",
      "animation": "Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes e some. A barra de HP atualiza no momento definido pela lógica.",
      "combat": "Não usar hitbox ofensiva. Aplicar cura ou limpeza de status conforme a regra do move; a animação apenas comunica a mudança de estado.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "213": {
    "id": 213,
    "internalName": "COTTONGUARD",
    "name": "Cotton Guard",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user protects itself by wrapping its body in soft cotton, drastically raising its Defense stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "214": {
    "id": 214,
    "internalName": "COTTONSPORE",
    "name": "Cotton Spore",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user releases cotton-like spores that cling to the foe, harshly reducing its Speed stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "215": {
    "id": 215,
    "internalName": "GRASSWHISTLE",
    "name": "Grass Whistle",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 55,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user plays a pleasant melody that lulls the target into a deep sleep.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "216": {
    "id": 216,
    "internalName": "INGRAIN",
    "name": "Ingrain",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user lays roots that restore its HP on every turn. Because it is rooted, it can't switch out.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "217": {
    "id": 217,
    "internalName": "LEECHSEED",
    "name": "Leech Seed",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "A seed is planted on the target. It steals some HP from the target every turn.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "218": {
    "id": 218,
    "internalName": "SLEEPPOWDER",
    "name": "Sleep Powder",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 75,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user scatters a big cloud of sleep-inducing dust around the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "219": {
    "id": 219,
    "internalName": "SPORE",
    "name": "Spore",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user scatters bursts of spores that induce sleep.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "220": {
    "id": 220,
    "internalName": "STUNSPORE",
    "name": "Stun Spore",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 75,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user scatters a cloud of paralyzing powder. It may leave the target with paralysis.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "221": {
    "id": 221,
    "internalName": "SYNTHESIS",
    "name": "Synthesis",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user restores its own HP. The amount of HP regained varies with the weather.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Brilhos em partículas que sobem e pequenos símbolos luminosos em torno do Pokémon.",
      "animation": "Aura se expande, pulsa e desaparece; a barra de HP muda no frame de resolução da cura.",
      "combat": "Aplicar a quantidade de cura e os limites de HP pela lógica; o efeito visual não determina o valor restaurado.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "222": {
    "id": 222,
    "internalName": "WORRYSEED",
    "name": "Worry Seed",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "A seed that causes worry is planted on the foe. It prevents sleep by making its Ability Insomnia.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "223": {
    "id": 223,
    "internalName": "EARTHQUAKE",
    "name": "Earthquake",
    "type": "Ground",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user sets off an earthquake that strikes every Pokémon around it.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis de fissuras e poeira partem do usuário pelo chão; fragmentos pequenos saltam em pontos próximos.",
      "animation": "O chão avisa com rachaduras, seguido de 1--3 pulsos de tremor e poeira.",
      "combat": "Dano em área radial centrada no usuário. O tremor visual não deve deslocar a hitbox nem causar múltiplos hits acidentais.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "224": {
    "id": 224,
    "internalName": "EARTHPOWER",
    "name": "Earth Power",
    "type": "Ground",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user makes the ground under the foe erupt with power. It may also lower the target's Sp. Def.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "225": {
    "id": 225,
    "internalName": "DIG",
    "name": "Dig",
    "type": "Ground",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user burrows, then attacks on the second turn. It can also be used to exit dungeons.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "226": {
    "id": 226,
    "internalName": "DRILLRUN",
    "name": "Drill Run",
    "type": "Ground",
    "category": "Physical",
    "power": 80,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user crashes into its target while rotating its body like a drill. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "227": {
    "id": 227,
    "internalName": "BONECLUB",
    "name": "Bone Club",
    "type": "Ground",
    "category": "Physical",
    "power": 65,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user clubs the target with a bone. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "228": {
    "id": 228,
    "internalName": "MUDBOMB",
    "name": "Mud Bomb",
    "type": "Ground",
    "category": "Special",
    "power": 65,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user launches a hard-packed mud ball to attack. It may also lower the target's accuracy.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "229": {
    "id": 229,
    "internalName": "BULLDOZE",
    "name": "Bulldoze",
    "type": "Ground",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user strikes everything around it by stomping on the ground. It reduces hit Pokémon's Speed.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "speed",
          "stages": -1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Anéis de fissuras e poeira partem do usuário pelo chão; fragmentos pequenos saltam em pontos próximos.",
      "animation": "O chão avisa com rachaduras, seguido de 1--3 pulsos de tremor e poeira.",
      "combat": "Dano em área radial centrada no usuário. O tremor visual não deve deslocar a hitbox nem causar múltiplos hits acidentais.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "230": {
    "id": 230,
    "internalName": "MUDSHOT",
    "name": "Mud Shot",
    "type": "Ground",
    "category": "Special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user attacks by hurling a blob of mud at the target. It also reduces the target's Speed.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "speed",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "231": {
    "id": 231,
    "internalName": "BONEMERANG",
    "name": "Bonemerang",
    "type": "Ground",
    "category": "Physical",
    "power": 50,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The user throws the bone it holds. The bone loops to hit the target twice, coming and going.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": [
        2,
        2
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Reutilizar o efeito principal do move em instâncias pequenas, alternando posição/ângulo e adicionando flashes discretos a cada acerto.",
      "animation": "Executar 2--5 impactos ou disparos com intervalo curto e consistente; cada hit tem seu próprio frame de contato e feedback.",
      "combat": "A quantidade de hits vem da regra do move. Evitar que uma única colisão gere todos os acertos; cada hit deve ter evento e aplicação de dano controlados.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "232": {
    "id": 232,
    "internalName": "SANDTOMB",
    "name": "Sand Tomb",
    "type": "Ground",
    "category": "Physical",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user traps the target inside a harshly raging sandstorm for four to five turns.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "233": {
    "id": 233,
    "internalName": "BONERUSH",
    "name": "Bone Rush",
    "type": "Ground",
    "category": "Physical",
    "power": 25,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The user strikes the target with a hard bone two to five times in a row.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "234": {
    "id": 234,
    "internalName": "MUDSLAP",
    "name": "Mud-Slap",
    "type": "Ground",
    "category": "Special",
    "power": 20,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user hurls mud in the target's face to inflict damage and lower its accuracy.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "235": {
    "id": 235,
    "internalName": "FISSURE",
    "name": "Fissure",
    "type": "Ground",
    "category": "Physical",
    "power": 1,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user opens up a fissure in the ground and drops the foe in. The target instantly faints if it hits.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "236": {
    "id": 236,
    "internalName": "MAGNITUDE",
    "name": "Magnitude",
    "type": "Ground",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user looses a ground-shaking quake affecting everyone around the user. Its power varies.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis de fissuras e poeira partem do usuário pelo chão; fragmentos pequenos saltam em pontos próximos.",
      "animation": "O chão avisa com rachaduras, seguido de 1--3 pulsos de tremor e poeira.",
      "combat": "Dano em área radial centrada no usuário. O tremor visual não deve deslocar a hitbox nem causar múltiplos hits acidentais.",
      "rules": "Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "237": {
    "id": 237,
    "internalName": "MUDSPORT",
    "name": "Mud Sport",
    "type": "Ground",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user covers itself with mud. It weakens Electric-type moves while the user is in the battle.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "238": {
    "id": 238,
    "internalName": "SANDATTACK",
    "name": "Sand Attack",
    "type": "Ground",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "Sand is hurled in the target's face, reducing its accuracy.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "239": {
    "id": 239,
    "internalName": "SPIKES",
    "name": "Spikes",
    "type": "Ground",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user lays a trap of spikes at the foe's feet. The trap hurts foes that switch into battle.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "240": {
    "id": 240,
    "internalName": "FREEZESHOCK",
    "name": "Freeze Shock",
    "type": "Ice",
    "category": "Physical",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "ice",
    "description": "On the second turn, the user hits the foe with electrically charged ice. It may also paralyze the foe.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "241": {
    "id": 241,
    "internalName": "ICEBURN",
    "name": "Ice Burn",
    "type": "Ice",
    "category": "Special",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "On the second turn, an ultracold, freezing wind surrounds the foe. This may leave it with a burn.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "242": {
    "id": 242,
    "internalName": "BLIZZARD",
    "name": "Blizzard",
    "type": "Ice",
    "category": "Special",
    "power": 120,
    "accuracy": 70,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "ice",
    "description": "A howling blizzard is summoned to strike the opposing team. It may also freeze them solid.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "freeze",
      "secondaryChance": 0.1
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "243": {
    "id": 243,
    "internalName": "ICEBEAM",
    "name": "Ice Beam",
    "type": "Ice",
    "category": "Special",
    "power": 95,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The target is struck with an icy-cold beam of energy. It may also freeze the target solid.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "freeze",
      "secondaryChance": 0.1
    },
    "spec": {
      "vfx": "Feixe direcionado com núcleo branco e borda colorida do elemento, com partículas orbitais ou laterais.",
      "animation": "Carga opcional, emissão contínua ou disparo concentrado, seguida de explosão curta no ponto final.",
      "combat": "Definir largura, duração e regra de colisão ao longo do feixe; não aplicar dano por frame sem intervalo explícito.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "244": {
    "id": 244,
    "internalName": "ICICLECRASH",
    "name": "Icicle Crash",
    "type": "Ice",
    "category": "Physical",
    "power": 85,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ice",
    "description": "The user attacks by harshly dropping an icicle onto the foe. It may also make the target flinch.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "245": {
    "id": 245,
    "internalName": "ICEPUNCH",
    "name": "Ice Punch",
    "type": "Ice",
    "category": "Physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ice",
    "description": "The target is punched with an icy fist. It may also leave the target frozen.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "246": {
    "id": 246,
    "internalName": "AURORABEAM",
    "name": "Aurora Beam",
    "type": "Ice",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The target is hit with a rainbow-colored beam. This may also lower the target's Attack stat.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe direcionado com núcleo branco e borda colorida do elemento, com partículas orbitais ou laterais.",
      "animation": "Carga opcional, emissão contínua ou disparo concentrado, seguida de explosão curta no ponto final.",
      "combat": "Definir largura, duração e regra de colisão ao longo do feixe; não aplicar dano por frame sem intervalo explícito.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "247": {
    "id": 247,
    "internalName": "GLACIATE",
    "name": "Glaciate",
    "type": "Ice",
    "category": "Special",
    "power": 65,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ice",
    "description": "The user attacks by blowing freezing cold air at the foe. This attack reduces the targets' Speed stat.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "speed",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "248": {
    "id": 248,
    "internalName": "ICEFANG",
    "name": "Ice Fang",
    "type": "Ice",
    "category": "Physical",
    "power": 65,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "bite",
    "description": "The user bites with cold-infused fangs. It may also make the target flinch or leave it frozen.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Duas mandíbulas ou presas pixeladas que se fecham ao redor do ponto de contato; usar sombra escura, dentes claros e flash breve.",
      "animation": "Abrir mandíbula durante a antecipação; fechar rapidamente no contato; recuar e remover o overlay sem cobrir o Pokémon por muito tempo.",
      "combat": "Exige proximidade. O acerto ocorre no instante do fechamento das mandíbulas; efeitos de flinch ou redução de defesa são tratados pela lógica de status, não pelo desenho.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "249": {
    "id": 249,
    "internalName": "AVALANCHE",
    "name": "Avalanche",
    "type": "Ice",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": -4,
    "vfxFamily": "ice",
    "description": "An attack move that inflicts double the damage if the user has been hurt by the foe in the same turn.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "250": {
    "id": 250,
    "internalName": "ICYWIND",
    "name": "Icy Wind",
    "type": "Ice",
    "category": "Special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user attacks with a gust of chilled air. It also lowers the targets' Speed stat.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "speed",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "251": {
    "id": 251,
    "internalName": "FROSTBREATH",
    "name": "Frost Breath",
    "type": "Ice",
    "category": "Special",
    "power": 40,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user blows a cold breath on the target. This attack always results in a critical hit.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "252": {
    "id": 252,
    "internalName": "ICESHARD",
    "name": "Ice Shard",
    "type": "Ice",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "vfxFamily": "ice",
    "description": "The user flash freezes chunks of ice and hurls them at the target. This move always goes first.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "freeze",
      "secondaryChance": 0.1
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "253": {
    "id": 253,
    "internalName": "POWDERSNOW",
    "name": "Powder Snow",
    "type": "Ice",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user attacks with a chilling gust of powdery snow. It may also freeze the targets.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "freeze",
      "secondaryChance": 0.1
    },
    "spec": {
      "vfx": "Overlay de clima em toda a arena: chuva diagonal, calor ondulante, areia horizontal ou neve em flocos quadrados.",
      "animation": "Transição curta do clima atual para o novo; partículas contínuas de baixa densidade enquanto durar.",
      "combat": "Clima é um estado global com duração; não deve ser recriado individualmente por cada frame ou Pokémon.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "254": {
    "id": 254,
    "internalName": "ICEBALL",
    "name": "Ice Ball",
    "type": "Ice",
    "category": "Physical",
    "power": 30,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user continually rolls into the target over five turns. It becomes stronger each time it hits.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "255": {
    "id": 255,
    "internalName": "ICICLESPEAR",
    "name": "Icicle Spear",
    "type": "Ice",
    "category": "Physical",
    "power": 25,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The user launches sharp icicles at the target. It strikes two to five times in a row.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "256": {
    "id": 256,
    "internalName": "SHEERCOLD",
    "name": "Sheer Cold",
    "type": "Ice",
    "category": "Special",
    "power": 1,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The foe is attacked with a blast of absolute-zero cold. The target instantly faints if it hits.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "257": {
    "id": 257,
    "internalName": "HAIL",
    "name": "Hail",
    "type": "Ice",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user summons a hail storm lasting five turns. It damages all Pokémon except the Ice type.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Overlay de clima em toda a arena: chuva diagonal, calor ondulante, areia horizontal ou neve em flocos quadrados.",
      "animation": "Transição curta do clima atual para o novo; partículas contínuas de baixa densidade enquanto durar.",
      "combat": "Clima é um estado global com duração; não deve ser recriado individualmente por cada frame ou Pokémon.",
      "rules": "Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "258": {
    "id": 258,
    "internalName": "HAZE",
    "name": "Haze",
    "type": "Ice",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user creates a haze that eliminates every stat change among all the Pokémon engaged in battle.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "259": {
    "id": 259,
    "internalName": "MIST",
    "name": "Mist",
    "type": "Ice",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user cloaks its body with a white mist that prevents any of its stats from being cut for five turns.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "260": {
    "id": 260,
    "internalName": "EXPLOSION",
    "name": "Explosion",
    "type": "Normal",
    "category": "Physical",
    "power": 250,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user explodes to inflict damage on those around it. The user faints upon using this move.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Explosão em camadas com núcleo branco, anel externo, fragmentos e fumaça pixelada.",
      "animation": "Expansão rápida em etapas; shake no pico; dissipação de fumaça.",
      "combat": "Resolver área e autodestruição como efeitos de gameplay separados. O dano é aplicado uma vez por alvo elegível.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "030-Explosion01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "explosao_termica",
      "theme": "Explosão Massiva / Detonação"
    }
  },
  "261": {
    "id": 261,
    "internalName": "SELFDESTRUCT",
    "name": "Self-Destruct",
    "type": "Normal",
    "category": "Physical",
    "power": 200,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user blows up to inflict damage on all Pokémon in battle. The user faints upon using this move.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Explosão em camadas com núcleo branco, anel externo, fragmentos e fumaça pixelada.",
      "animation": "Expansão rápida em etapas; shake no pico; dissipação de fumaça.",
      "combat": "Resolver área e autodestruição como efeitos de gameplay separados. O dano é aplicado uma vez por alvo elegível.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "030-Explosion01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "explosao_termica",
      "theme": "Explosão Massiva / Detonação"
    }
  },
  "262": {
    "id": 262,
    "internalName": "GIGAIMPACT",
    "name": "Giga Impact",
    "type": "Normal",
    "category": "Physical",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user charges at the target using every bit of its power. The user must rest on the next turn.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "263": {
    "id": 263,
    "internalName": "HYPERBEAM",
    "name": "Hyper Beam",
    "type": "Normal",
    "category": "Special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The foe is attacked with a powerful beam. The user must rest on the next turn to regain its energy.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe direcionado com núcleo branco e borda colorida do elemento, com partículas orbitais ou laterais.",
      "animation": "Carga opcional, emissão contínua ou disparo concentrado, seguida de explosão curta no ponto final.",
      "combat": "Definir largura, duração e regra de colisão ao longo do feixe; não aplicar dano por frame sem intervalo explícito.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "264": {
    "id": 264,
    "internalName": "LASTRESORT",
    "name": "Last Resort",
    "type": "Normal",
    "category": "Physical",
    "power": 140,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "This move can be used only after the user has used all the other moves it knows in the battle.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "265": {
    "id": 265,
    "internalName": "DOUBLEEDGE",
    "name": "Double-Edge",
    "type": "Normal",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "A reckless, life-risking tackle. It also damages the user by a fairly large amount, however.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "266": {
    "id": 266,
    "internalName": "HEADCHARGE",
    "name": "Head Charge",
    "type": "Normal",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user charges its head into the foe, using its powerful guard hair. The user also takes damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "267": {
    "id": 267,
    "internalName": "MEGAKICK",
    "name": "Mega Kick",
    "type": "Normal",
    "category": "Physical",
    "power": 120,
    "accuracy": 75,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is attacked by a kick launched with muscle-packed power.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "268": {
    "id": 268,
    "internalName": "THRASH",
    "name": "Thrash",
    "type": "Normal",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user rampages and attacks for two to three turns. It then becomes confused, however.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "269": {
    "id": 269,
    "internalName": "EGGBOMB",
    "name": "Egg Bomb",
    "type": "Normal",
    "category": "Physical",
    "power": 100,
    "accuracy": 75,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "A large egg is hurled at the target with maximum force to inflict damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "270": {
    "id": 270,
    "internalName": "JUDGMENT",
    "name": "Judgment",
    "type": "Normal",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user releases countless shots of light. Its type varies with the kind of Plate the user is holding.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "271": {
    "id": 271,
    "internalName": "SKULLBASH",
    "name": "Skull Bash",
    "type": "Normal",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user tucks in its head to raise its Defense in the first turn, then rams the foe on the next turn.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "272": {
    "id": 272,
    "internalName": "HYPERVOICE",
    "name": "Hyper Voice",
    "type": "Normal",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ice",
    "description": "The user lets loose a horribly echoing shout with the power to inflict damage.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "273": {
    "id": 273,
    "internalName": "ROCKCLIMB",
    "name": "Rock Climb",
    "type": "Normal",
    "category": "Physical",
    "power": 90,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user attacks the target by smashing into it with incredible force. It may also confuse the target.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "274": {
    "id": 274,
    "internalName": "TAKEDOWN",
    "name": "Take Down",
    "type": "Normal",
    "category": "Physical",
    "power": 90,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "A reckless, full-body charge attack for slamming into the foe. It also damages the user a little.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "275": {
    "id": 275,
    "internalName": "UPROAR",
    "name": "Uproar",
    "type": "Normal",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "The user attacks in an uproar for three turns. Over that time, no one can fall asleep.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "276": {
    "id": 276,
    "internalName": "BODYSLAM",
    "name": "Body Slam",
    "type": "Normal",
    "category": "Physical",
    "power": 85,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user drops onto the target with its full body weight. It may leave the target with paralysis.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "277": {
    "id": 277,
    "internalName": "TECHNOBLAST",
    "name": "Techno Blast",
    "type": "Normal",
    "category": "Special",
    "power": 85,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user fires a beam of light at its target. The type changes depending on the Drive the user holds.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "278": {
    "id": 278,
    "internalName": "EXTREMESPEED",
    "name": "Extreme Speed",
    "type": "Normal",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 5,
    "priority": 2,
    "vfxFamily": "impact",
    "description": "The user charges the target at blinding speed. This attack always goes before any other move.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "279": {
    "id": 279,
    "internalName": "HYPERFANG",
    "name": "Hyper Fang",
    "type": "Normal",
    "category": "Physical",
    "power": 80,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "bite",
    "description": "The user bites hard on the target with its sharp front fangs. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Duas mandíbulas ou presas pixeladas que se fecham ao redor do ponto de contato; usar sombra escura, dentes claros e flash breve.",
      "animation": "Abrir mandíbula durante a antecipação; fechar rapidamente no contato; recuar e remover o overlay sem cobrir o Pokémon por muito tempo.",
      "combat": "Exige proximidade. O acerto ocorre no instante do fechamento das mandíbulas; efeitos de flinch ou redução de defesa são tratados pela lógica de status, não pelo desenho.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "teeth.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "mandibula_mordida",
      "theme": "Mandíbula de Presas Afiadas"
    }
  },
  "280": {
    "id": 280,
    "internalName": "MEGAPUNCH",
    "name": "Mega Punch",
    "type": "Normal",
    "category": "Physical",
    "power": 80,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is slugged by a punch thrown with muscle-packed power.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "281": {
    "id": 281,
    "internalName": "RAZORWIND",
    "name": "Razor Wind",
    "type": "Normal",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "A two-turn attack. Blades of wind hit the foe on the second turn. Critical hits land more easily.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "Wind1.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 8,
      "endFrame": 12,
      "fps": 24,
      "key": "vento_cortante",
      "theme": "Lâminas Cortantes de Vento"
    }
  },
  "282": {
    "id": 282,
    "internalName": "SLAM",
    "name": "Slam",
    "type": "Normal",
    "category": "Physical",
    "power": 80,
    "accuracy": 75,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The target is slammed with a long tail, vines, etc., to inflict damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "283": {
    "id": 283,
    "internalName": "STRENGTH",
    "name": "Strength",
    "type": "Normal",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The target is slugged with a punch thrown at maximum power. It can also be used to move heavy boulders.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "284": {
    "id": 284,
    "internalName": "TRIATTACK",
    "name": "Tri Attack",
    "type": "Normal",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user strikes with a simultaneous three-beam attack. May also paralyze, burn, or freeze the target.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "285": {
    "id": 285,
    "internalName": "CRUSHCLAW",
    "name": "Crush Claw",
    "type": "Normal",
    "category": "Physical",
    "power": 75,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user slashes the target with hard and sharp claws. It may also lower the target's Defense.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "286": {
    "id": 286,
    "internalName": "RELICSONG",
    "name": "Relic Song",
    "type": "Normal",
    "category": "Special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "An ancient song appeals to the hearts of those listening. It may also induce sleep.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "287": {
    "id": 287,
    "internalName": "CHIPAWAY",
    "name": "Chip Away",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "Seeking an opening, the user strikes continually. The foe's stat changes don't affect the damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "288": {
    "id": 288,
    "internalName": "DIZZYPUNCH",
    "name": "Dizzy Punch",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is hit with rhythmically launched punches that may also leave it confused.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "289": {
    "id": 289,
    "internalName": "FACADE",
    "name": "Facade",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "An attack move that doubles its power if the user is poisoned, burned, or has paralysis.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "290": {
    "id": 290,
    "internalName": "HEADBUTT",
    "name": "Headbutt",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user sticks out its head and attacks by charging into the foe. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "291": {
    "id": 291,
    "internalName": "RETALIATE",
    "name": "Retaliate",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "Gets revenge for a fainted ally. If an ally fainted in the last turn, this attack's damage increases.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "292": {
    "id": 292,
    "internalName": "SECRETPOWER",
    "name": "Secret Power",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user attacks with a secret power. Its added effects vary depending on the user's environment.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "293": {
    "id": 293,
    "internalName": "SLASH",
    "name": "Slash",
    "type": "Normal",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The target is attacked with a slash of claws or blades. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "294": {
    "id": 294,
    "internalName": "HORNATTACK",
    "name": "Horn Attack",
    "type": "Normal",
    "category": "Physical",
    "power": 65,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is jabbed with a sharply pointed horn to inflict damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "295": {
    "id": 295,
    "internalName": "STOMP",
    "name": "Stomp",
    "type": "Normal",
    "category": "Physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is stomped with a big foot. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "296": {
    "id": 296,
    "internalName": "COVET",
    "name": "Covet",
    "type": "Normal",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user endearingly approaches the target, then steals the target's held item.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "297": {
    "id": 297,
    "internalName": "ROUND",
    "name": "Round",
    "type": "Normal",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "The user attacks with a song. Others can join in the Round and make the attack do greater damage.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "298": {
    "id": 298,
    "internalName": "SMELLINGSALTS",
    "name": "Smelling Salts",
    "type": "Normal",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "This attack inflicts double damage on a paralyzed foe. It also cures the target's paralysis, however.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "299": {
    "id": 299,
    "internalName": "SWIFT",
    "name": "Swift",
    "type": "Normal",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "Star-shaped rays are shot at the opposing team. This attack never misses.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "300": {
    "id": 300,
    "internalName": "VICEGRIP",
    "name": "Vice Grip",
    "type": "Normal",
    "category": "Physical",
    "power": 55,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "ice",
    "description": "The target is gripped and squeezed from both sides to inflict damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "301": {
    "id": 301,
    "internalName": "CUT",
    "name": "Cut",
    "type": "Normal",
    "category": "Physical",
    "power": 50,
    "accuracy": 95,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The target is cut with a scythe or a claw. It can also be used to cut down thin trees.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "302": {
    "id": 302,
    "internalName": "STRUGGLE",
    "name": "Struggle",
    "type": "Normal",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "An attack that is used in desperation only if the user has no PP. It also hurts the user slightly.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "303": {
    "id": 303,
    "internalName": "TACKLE",
    "name": "Tackle",
    "type": "Normal",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "A physical attack in which the user charges and slams into the target with its whole body.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "304": {
    "id": 304,
    "internalName": "WEATHERBALL",
    "name": "Weather Ball",
    "type": "Normal",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "An attack move that varies in power and type depending on the weather.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Overlay de clima em toda a arena: chuva diagonal, calor ondulante, areia horizontal ou neve em flocos quadrados.",
      "animation": "Transição curta do clima atual para o novo; partículas contínuas de baixa densidade enquanto durar.",
      "combat": "Clima é um estado global com duração; não deve ser recriado individualmente por cada frame ou Pokémon.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "305": {
    "id": 305,
    "internalName": "ECHOEDVOICE",
    "name": "Echoed Voice",
    "type": "Normal",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ice",
    "description": "The user attacks the foe with an echoing voice. If this move is used every turn, it does greater damage.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "306": {
    "id": 306,
    "internalName": "FAKEOUT",
    "name": "Fake Out",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 10,
    "priority": 3,
    "vfxFamily": "impact",
    "description": "An attack that hits first and makes the target flinch. It only works the first turn the user is in battle.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "307": {
    "id": 307,
    "internalName": "FALSESWIPE",
    "name": "False Swipe",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "water",
    "description": "A restrained attack that prevents the target from fainting. The target is left with at least 1 HP.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "308": {
    "id": 308,
    "internalName": "PAYDAY",
    "name": "Pay Day",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "Numerous coins are hurled at the target to inflict damage. Money is earned after battle.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "309": {
    "id": 309,
    "internalName": "POUND",
    "name": "Pound",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is physically pounded with a long tail or a foreleg, etc.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "310": {
    "id": 310,
    "internalName": "QUICKATTACK",
    "name": "Quick Attack",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "vfxFamily": "impact",
    "description": "The user lunges at the target at a speed that makes it almost invisible. It is sure to strike first.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "311": {
    "id": 311,
    "internalName": "SCRATCH",
    "name": "Scratch",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "Hard, pointed, and sharp claws rake the target to inflict damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "312": {
    "id": 312,
    "internalName": "SNORE",
    "name": "Snore",
    "type": "Normal",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "An attack that can be used only if the user is asleep. The harsh noise may also make the target flinch.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "313": {
    "id": 313,
    "internalName": "DOUBLEHIT",
    "name": "Double Hit",
    "type": "Normal",
    "category": "Physical",
    "power": 35,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The user slams the target with a long tail, vines, or tentacle. The target is hit twice in a row.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        2
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Reutilizar o efeito principal do move em instâncias pequenas, alternando posição/ângulo e adicionando flashes discretos a cada acerto.",
      "animation": "Executar 2--5 impactos ou disparos com intervalo curto e consistente; cada hit tem seu próprio frame de contato e feedback.",
      "combat": "A quantidade de hits vem da regra do move. Evitar que uma única colisão gere todos os acertos; cada hit deve ter evento e aplicação de dano controlados.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "314": {
    "id": 314,
    "internalName": "FEINT",
    "name": "Feint",
    "type": "Normal",
    "category": "Physical",
    "power": 30,
    "accuracy": 100,
    "pp": 10,
    "priority": 2,
    "vfxFamily": "impact",
    "description": "An attack that hits a target using Protect or Detect. It also lifts the effects of those moves.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Noturno de Sombras"
    }
  },
  "315": {
    "id": 315,
    "internalName": "TAILSLAP",
    "name": "Tail Slap",
    "type": "Normal",
    "category": "Physical",
    "power": 25,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The user attacks by striking the target with its hard tail. It hits the Pokémon two to five times in a row.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Reutilizar o efeito principal do move em instâncias pequenas, alternando posição/ângulo e adicionando flashes discretos a cada acerto.",
      "animation": "Executar 2--5 impactos ou disparos com intervalo curto e consistente; cada hit tem seu próprio frame de contato e feedback.",
      "combat": "A quantidade de hits vem da regra do move. Evitar que uma única colisão gere todos os acertos; cada hit deve ter evento e aplicação de dano controlados.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "316": {
    "id": 316,
    "internalName": "RAGE",
    "name": "Rage",
    "type": "Normal",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "As long as this move is in use, the user's Attack rises each time the user is hit in battle.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "317": {
    "id": 317,
    "internalName": "RAPIDSPIN",
    "name": "Rapid Spin",
    "type": "Normal",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "A spin attack that can also eliminate such moves as Bind, Wrap, Leech Seed, and Spikes.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0.5,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 5,
      "endFrame": 9,
      "fps": 24,
      "key": "fogo_vortice",
      "theme": "Vórtice de Chamas"
    }
  },
  "318": {
    "id": 318,
    "internalName": "SPIKECANNON",
    "name": "Spike Cannon",
    "type": "Normal",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "Sharp spikes are shot at the target in rapid succession. They hit two to five times in a row.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Reutilizar o efeito principal do move em instâncias pequenas, alternando posição/ângulo e adicionando flashes discretos a cada acerto.",
      "animation": "Executar 2--5 impactos ou disparos com intervalo curto e consistente; cada hit tem seu próprio frame de contato e feedback.",
      "combat": "A quantidade de hits vem da regra do move. Evitar que uma única colisão gere todos os acertos; cada hit deve ter evento e aplicação de dano controlados.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "319": {
    "id": 319,
    "internalName": "COMETPUNCH",
    "name": "Comet Punch",
    "type": "Normal",
    "category": "Physical",
    "power": 18,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The target is hit with a flurry of punches that strike two to five times in a row.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "320": {
    "id": 320,
    "internalName": "FURYSWIPES",
    "name": "Fury Swipes",
    "type": "Normal",
    "category": "Physical",
    "power": 18,
    "accuracy": 80,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The target is raked with sharp claws or scythes for two to five times in quick succession.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "321": {
    "id": 321,
    "internalName": "BARRAGE",
    "name": "Barrage",
    "type": "Normal",
    "category": "Physical",
    "power": 15,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "Round objects are hurled at the target to strike two to five times in a row.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "322": {
    "id": 322,
    "internalName": "BIND",
    "name": "Bind",
    "type": "Normal",
    "category": "Physical",
    "power": 15,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "Things such as long bodies or tentacles are used to bind and squeeze the foe for four to five turns.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "323": {
    "id": 323,
    "internalName": "DOUBLESLAP",
    "name": "Double Slap",
    "type": "Normal",
    "category": "Physical",
    "power": 15,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The target is slapped repeatedly, back and forth, two to five times in a row.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "324": {
    "id": 324,
    "internalName": "FURYATTACK",
    "name": "Fury Attack",
    "type": "Normal",
    "category": "Physical",
    "power": 15,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The target is jabbed repeatedly with a horn or beak two to five times in a row.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Reutilizar o efeito principal do move em instâncias pequenas, alternando posição/ângulo e adicionando flashes discretos a cada acerto.",
      "animation": "Executar 2--5 impactos ou disparos com intervalo curto e consistente; cada hit tem seu próprio frame de contato e feedback.",
      "combat": "A quantidade de hits vem da regra do move. Evitar que uma única colisão gere todos os acertos; cada hit deve ter evento e aplicação de dano controlados.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "325": {
    "id": 325,
    "internalName": "WRAP",
    "name": "Wrap",
    "type": "Normal",
    "category": "Physical",
    "power": 15,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "A long body or vines are used to wrap and squeeze the target for four to five turns.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "326": {
    "id": 326,
    "internalName": "CONSTRICT",
    "name": "Constrict",
    "type": "Normal",
    "category": "Physical",
    "power": 10,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The foe is attacked with long, creeping tentacles or vines. It may also lower the target's Speed.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "327": {
    "id": 327,
    "internalName": "BIDE",
    "name": "Bide",
    "type": "Normal",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 10,
    "priority": 1,
    "vfxFamily": "impact",
    "description": "The user endures attacks for two turns, then strikes back to cause double the damage taken.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "328": {
    "id": 328,
    "internalName": "CRUSHGRIP",
    "name": "Crush Grip",
    "type": "Normal",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is crushed with great force. The attack is more powerful the more HP the target has left.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "329": {
    "id": 329,
    "internalName": "ENDEAVOR",
    "name": "Endeavor",
    "type": "Normal",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "An attack move that cuts down the target's HP to equal the user's HP.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "330": {
    "id": 330,
    "internalName": "FLAIL",
    "name": "Flail",
    "type": "Normal",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user flails about aimlessly to attack. It becomes more powerful the less HP the user has.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "331": {
    "id": 331,
    "internalName": "FRUSTRATION",
    "name": "Frustration",
    "type": "Normal",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "water",
    "description": "A full-power attack that grows more powerful the less the user likes its Trainer.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "332": {
    "id": 332,
    "internalName": "GUILLOTINE",
    "name": "Guillotine",
    "type": "Normal",
    "category": "Physical",
    "power": 1,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "A vicious, tearing attack with big pincers. The target will faint instantly if this attack hits.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "333": {
    "id": 333,
    "internalName": "HIDDENPOWER",
    "name": "Hidden Power",
    "type": "Normal",
    "category": "Special",
    "power": 1,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "A unique attack that varies in type and intensity depending on the Pokémon using it.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "334": {
    "id": 334,
    "internalName": "HORNDRILL",
    "name": "Horn Drill",
    "type": "Normal",
    "category": "Physical",
    "power": 1,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user stabs the foe with a horn that rotates like a drill. If it hits, the target faints instantly.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "335": {
    "id": 335,
    "internalName": "NATURALGIFT",
    "name": "Natural Gift",
    "type": "Normal",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user draws power to attack by using its held Berry. The Berry determines its type and power.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "336": {
    "id": 336,
    "internalName": "PRESENT",
    "name": "Present",
    "type": "Normal",
    "category": "Physical",
    "power": 1,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user attacks by giving the target a gift with a hidden trap. It restores HP sometimes, however.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Partículas ascendentes, pequenos brilhos e anéis suaves em verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não em bloom contínuo.",
      "animation": "Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes e some. A barra de HP atualiza no momento definido pela lógica.",
      "combat": "Não usar hitbox ofensiva. Aplicar cura ou limpeza de status conforme a regra do move; a animação apenas comunica a mudança de estado.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "337": {
    "id": 337,
    "internalName": "RETURN",
    "name": "Return",
    "type": "Normal",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "water",
    "description": "A full-power attack that grows more powerful the more the user likes its Trainer.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "338": {
    "id": 338,
    "internalName": "SONICBOOM",
    "name": "Sonic Boom",
    "type": "Normal",
    "category": "Special",
    "power": 1,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The target is hit with a destructive shock wave that always inflicts 20 HP damage.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "339": {
    "id": 339,
    "internalName": "SPITUP",
    "name": "Spit Up",
    "type": "Normal",
    "category": "Special",
    "power": 1,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "The power stored using the move Stockpile is released all at once in an attack.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "340": {
    "id": 340,
    "internalName": "SUPERFANG",
    "name": "Super Fang",
    "type": "Normal",
    "category": "Physical",
    "power": 1,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "bite",
    "description": "The user chomps hard on the target with its sharp front fangs. It cuts the target's HP to half.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Duas mandíbulas ou presas pixeladas que se fecham ao redor do ponto de contato; usar sombra escura, dentes claros e flash breve.",
      "animation": "Abrir mandíbula durante a antecipação; fechar rapidamente no contato; recuar e remover o overlay sem cobrir o Pokémon por muito tempo.",
      "combat": "Exige proximidade. O acerto ocorre no instante do fechamento das mandíbulas; efeitos de flinch ou redução de defesa são tratados pela lógica de status, não pelo desenho.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "teeth.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "mandibula_mordida",
      "theme": "Mandíbula de Presas Afiadas"
    }
  },
  "341": {
    "id": 341,
    "internalName": "TRUMPCARD",
    "name": "Trump Card",
    "type": "Normal",
    "category": "Special",
    "power": 1,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "The fewer PP this move has, the greater its attack power.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "342": {
    "id": 342,
    "internalName": "WRINGOUT",
    "name": "Wring Out",
    "type": "Normal",
    "category": "Special",
    "power": 1,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "The user powerfully wrings the foe. The more HP the foe has, the greater this attack's power.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "343": {
    "id": 343,
    "internalName": "ACUPRESSURE",
    "name": "Acupressure",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user applies pressure to stress points, sharply boosting one of its stats.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "344": {
    "id": 344,
    "internalName": "AFTERYOU",
    "name": "After You",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user helps the target and makes it use its move right after the user.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "345": {
    "id": 345,
    "internalName": "ASSIST",
    "name": "Assist",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user hurriedly and randomly uses a move among those known by other Pokémon in the party.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "346": {
    "id": 346,
    "internalName": "ATTRACT",
    "name": "Attract",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "If it is the opposite gender of the user, the target becomes infatuated and less likely to attack.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "347": {
    "id": 347,
    "internalName": "BATONPASS",
    "name": "Baton Pass",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user switches places with a party Pokémon in waiting, passing along any stat changes.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "348": {
    "id": 348,
    "internalName": "BELLYDRUM",
    "name": "Belly Drum",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user maximizes its Attack stat in exchange for HP equal to half its max HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "349": {
    "id": 349,
    "internalName": "BESTOW",
    "name": "Bestow",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user passes its held item to the target when the target isn't holding an item.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "350": {
    "id": 350,
    "internalName": "BLOCK",
    "name": "Block",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user blocks the target's way with arms spread wide to prevent escape.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "351": {
    "id": 351,
    "internalName": "CAMOUFLAGE",
    "name": "Camouflage",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user's type is changed depending on its environment, such as at water's edge, in grass, or in a cave.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "352": {
    "id": 352,
    "internalName": "CAPTIVATE",
    "name": "Captivate",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "If it is the opposite gender of the user, the target is charmed into harshly lowering its Sp. Atk stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "353": {
    "id": 353,
    "internalName": "CHARM",
    "name": "Charm",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user charmingly gazes at the foe, making it less wary. The target's Attack is harshly lowered.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "brilho_feerico",
      "theme": "Brilho Feérico Encantado"
    }
  },
  "354": {
    "id": 354,
    "internalName": "CONVERSION",
    "name": "Conversion",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user changes its type to become the same type as one of its moves.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "355": {
    "id": 355,
    "internalName": "CONVERSION2",
    "name": "Conversion 2",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user changes its type to make itself resistant to the type of the attack the opponent used last.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "356": {
    "id": 356,
    "internalName": "COPYCAT",
    "name": "Copycat",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user mimics the move used immediately before it. The move fails if no other move has been used yet.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "357": {
    "id": 357,
    "internalName": "DEFENSECURL",
    "name": "Defense Curl",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user curls up to conceal weak spots and raise its Defense stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "358": {
    "id": 358,
    "internalName": "DISABLE",
    "name": "Disable",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "For four turns, this move prevents the target from using the move it last used.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "359": {
    "id": 359,
    "internalName": "DOUBLETEAM",
    "name": "Double Team",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "By moving rapidly, the user makes illusory copies of itself to raise its evasiveness.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "360": {
    "id": 360,
    "internalName": "ENCORE",
    "name": "Encore",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user compels the target to keep using only the move it last used for three turns.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "361": {
    "id": 361,
    "internalName": "ENDURE",
    "name": "Endure",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 3,
    "vfxFamily": "multihit",
    "description": "The user endures any attack with at least 1 HP. Its chance of failing rises if it is used in succession.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Reutilizar o efeito principal do move em instâncias pequenas, alternando posição/ângulo e adicionando flashes discretos a cada acerto.",
      "animation": "Executar 2--5 impactos ou disparos com intervalo curto e consistente; cada hit tem seu próprio frame de contato e feedback.",
      "combat": "A quantidade de hits vem da regra do move. Evitar que uma única colisão gere todos os acertos; cada hit deve ter evento e aplicação de dano controlados.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "362": {
    "id": 362,
    "internalName": "ENTRAINMENT",
    "name": "Entrainment",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user dances to compel the target to mimic it, making the target's Ability the same as the user's.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "363": {
    "id": 363,
    "internalName": "FLASH",
    "name": "Flash",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user flashes a light that cuts the target's accuracy. It can also be used to illuminate caves.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "accuracy",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "364": {
    "id": 364,
    "internalName": "FOCUSENERGY",
    "name": "Focus Energy",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user takes a deep breath and focuses so that critical hits land more easily.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "365": {
    "id": 365,
    "internalName": "FOLLOWME",
    "name": "Follow Me",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 3,
    "vfxFamily": "status",
    "description": "The user draws attention to itself, making all targets take aim only at the user.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "366": {
    "id": 366,
    "internalName": "FORESIGHT",
    "name": "Foresight",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "Enables the user to hit a Ghost type with any kind of move. It also enables the user to hit an evasive foe.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "367": {
    "id": 367,
    "internalName": "GLARE",
    "name": "Glare",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 90,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user intimidates the target with the pattern on its belly to cause paralysis.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "368": {
    "id": 368,
    "internalName": "GROWL",
    "name": "Growl",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user growls in an endearing way, making the foe less wary. The foe's Attack stat is lowered.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "369": {
    "id": 369,
    "internalName": "GROWTH",
    "name": "Growth",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user's body grows all at once, raising the Atk and Sp. Atk stats.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "370": {
    "id": 370,
    "internalName": "HARDEN",
    "name": "Harden",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user stiffens all the muscles in its body to raise its Defense stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "371": {
    "id": 371,
    "internalName": "HEALBELL",
    "name": "Heal Bell",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user makes a soothing bell chime to heal the status problems of all the party Pokémon.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Partículas ascendentes, pequenos brilhos e anéis suaves em verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não em bloom contínuo.",
      "animation": "Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes e some. A barra de HP atualiza no momento definido pela lógica.",
      "combat": "Não usar hitbox ofensiva. Aplicar cura ou limpeza de status conforme a regra do move; a animação apenas comunica a mudança de estado.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "372": {
    "id": 372,
    "internalName": "HELPINGHAND",
    "name": "Helping Hand",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 5,
    "vfxFamily": "status",
    "description": "The user assists an ally by boosting the power of its attack.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "373": {
    "id": 373,
    "internalName": "HOWL",
    "name": "Howl",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user howls loudly to raise its spirit, boosting its Attack stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "374": {
    "id": 374,
    "internalName": "LEER",
    "name": "Leer",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user gains an intimidating leer with sharp eyes. The target's Defense stat is reduced.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "375": {
    "id": 375,
    "internalName": "LOCKON",
    "name": "Lock-On",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user takes sure aim at the target. It ensures the next attack does not fail to hit the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "376": {
    "id": 376,
    "internalName": "LOVELYKISS",
    "name": "Lovely Kiss",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 75,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "With a scary face, the user tries to force a kiss on the target. If it suceeds, the target falls asleep.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "377": {
    "id": 377,
    "internalName": "LUCKYCHANT",
    "name": "Lucky Chant",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user chants an incantation toward the sky, preventing the foe from landing critical hits.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "378": {
    "id": 378,
    "internalName": "MEFIRST",
    "name": "Me First",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user tries to cut ahead of the foe to steal and use the foe's intended move with greater power.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "379": {
    "id": 379,
    "internalName": "MEANLOOK",
    "name": "Mean Look",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user pins the target with a dark, arresting look. The target becomes unable to flee.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "380": {
    "id": 380,
    "internalName": "METRONOME",
    "name": "Metronome",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user waggles a finger and stimulates its brain into randomly using nearly any move.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "381": {
    "id": 381,
    "internalName": "MILKDRINK",
    "name": "Milk Drink",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user restores its own HP by up to half of its maximum HP. May also be used in the field to heal HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Brilhos em partículas que sobem e pequenos símbolos luminosos em torno do Pokémon.",
      "animation": "Aura se expande, pulsa e desaparece; a barra de HP muda no frame de resolução da cura.",
      "combat": "Aplicar a quantidade de cura e os limites de HP pela lógica; o efeito visual não determina o valor restaurado.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "382": {
    "id": 382,
    "internalName": "MIMIC",
    "name": "Mimic",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user copies the move last used by the foe. The move can be used until the user is switched out.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "383": {
    "id": 383,
    "internalName": "MINDREADER",
    "name": "Mind Reader",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user senses the foe's movements with its mind to ensure its next attack does not miss the foe.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "384": {
    "id": 384,
    "internalName": "MINIMIZE",
    "name": "Minimize",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user compresses its body to make itself look smaller, which sharply raises its evasiveness.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "385": {
    "id": 385,
    "internalName": "MOONLIGHT",
    "name": "Moonlight",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user restores its own HP. The amount of HP regained varies with the weather.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Brilhos em partículas que sobem e pequenos símbolos luminosos em torno do Pokémon.",
      "animation": "Aura se expande, pulsa e desaparece; a barra de HP muda no frame de resolução da cura.",
      "combat": "Aplicar a quantidade de cura e os limites de HP pela lógica; o efeito visual não determina o valor restaurado.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "386": {
    "id": 386,
    "internalName": "MORNINGSUN",
    "name": "Morning Sun",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user restores its own HP. The amount of HP regained varies with the weather.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Brilhos em partículas que sobem e pequenos símbolos luminosos em torno do Pokémon.",
      "animation": "Aura se expande, pulsa e desaparece; a barra de HP muda no frame de resolução da cura.",
      "combat": "Aplicar a quantidade de cura e os limites de HP pela lógica; o efeito visual não determina o valor restaurado.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "387": {
    "id": 387,
    "internalName": "NATUREPOWER",
    "name": "Nature Power",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "An attack that makes use of nature's power. Its effects vary depending on the user's environment.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "388": {
    "id": 388,
    "internalName": "ODORSLEUTH",
    "name": "Odor Sleuth",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "Enables the user to hit a Ghost type with any type of move. It also enables the user to hit an evasive foe.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "389": {
    "id": 389,
    "internalName": "PAINSPLIT",
    "name": "Pain Split",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user adds its HP to the target's HP, then equally shares the combined HP with the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "390": {
    "id": 390,
    "internalName": "PERISHSONG",
    "name": "Perish Song",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "status",
    "description": "Any Pokémon that hears this song faints in three turns, unless it switches out of battle.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "391": {
    "id": 391,
    "internalName": "PROTECT",
    "name": "Protect",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "vfxFamily": "status",
    "description": "It enables the user to evade all attacks. Its chance of failing rises if it is used in succession.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Escudo de contorno pixelado, hexágonos ou espinhos ao redor do usuário; brilho forte apenas na ativação.",
      "animation": "Escudo aparece em 2--3 etapas, pisca quando bloqueia e desaparece ao fim da janela de proteção.",
      "combat": "Ativar a proteção em estado próprio com duração definida. Dano refletido só existe quando a regra do move o especificar.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "392": {
    "id": 392,
    "internalName": "PSYCHUP",
    "name": "Psych Up",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user hypnotizes itself into copying any stat change made by the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "393": {
    "id": 393,
    "internalName": "RECOVER",
    "name": "Recover",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "Restoring its own cells, the user restores its own HP by half of its max HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Brilhos em partículas que sobem e pequenos símbolos luminosos em torno do Pokémon.",
      "animation": "Aura se expande, pulsa e desaparece; a barra de HP muda no frame de resolução da cura.",
      "combat": "Aplicar a quantidade de cura e os limites de HP pela lógica; o efeito visual não determina o valor restaurado.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "394": {
    "id": 394,
    "internalName": "RECYCLE",
    "name": "Recycle",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user recycles a held item that has been used in battle so it can be used again.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "395": {
    "id": 395,
    "internalName": "REFLECTTYPE",
    "name": "Reflect Type",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user reflects the target's type, making it the same type as the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "396": {
    "id": 396,
    "internalName": "REFRESH",
    "name": "Refresh",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user rests to cure itself of a poisoning, burn, or paralysis.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "397": {
    "id": 397,
    "internalName": "ROAR",
    "name": "Roar",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -6,
    "vfxFamily": "status",
    "description": "The target is scared off and replaced by another Pokémon in its party. In the wild, the battle ends.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "398": {
    "id": 398,
    "internalName": "SAFEGUARD",
    "name": "Safeguard",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user creates a protective field that prevents status problems for five turns.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "399": {
    "id": 399,
    "internalName": "SCARYFACE",
    "name": "Scary Face",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user frightens the target with a scary face to harshly reduce its Speed stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "400": {
    "id": 400,
    "internalName": "SCREECH",
    "name": "Screech",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 85,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "An earsplitting screech harshly reduces the target's Defense stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "def",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "401": {
    "id": 401,
    "internalName": "SHARPEN",
    "name": "Sharpen",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user reduces its polygon count to make itself more jagged, raising the Attack stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "402": {
    "id": 402,
    "internalName": "SHELLSMASH",
    "name": "Shell Smash",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user breaks its shell, lowering its defenses but sharply raising attacking and Speed stats.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "403": {
    "id": 403,
    "internalName": "SIMPLEBEAM",
    "name": "Simple Beam",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user's mysterious psychic wave changes the target's Ability to Simple.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "404": {
    "id": 404,
    "internalName": "SING",
    "name": "Sing",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 55,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ice",
    "description": "A soothing lullaby is sung in a calming voice that puts the target into a deep slumber.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "405": {
    "id": 405,
    "internalName": "SKETCH",
    "name": "Sketch",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "vfxFamily": "status",
    "description": "It enables the user to permanently learn the move last used by the foe. Once used, Sketch disappears.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "406": {
    "id": 406,
    "internalName": "SLACKOFF",
    "name": "Slack Off",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user slacks off, restoring its own HP by up to half of its maximum HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "407": {
    "id": 407,
    "internalName": "SLEEPTALK",
    "name": "Sleep Talk",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "While it is asleep, the user randomly uses one of the moves it knows.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "408": {
    "id": 408,
    "internalName": "SMOKESCREEN",
    "name": "Smokescreen",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user releases an obscuring cloud of smoke or ink. It reduces the target's accuracy.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "accuracy",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "409": {
    "id": 409,
    "internalName": "SOFTBOILED",
    "name": "Soft-Boiled",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user restores its own HP by up to half of its maximum HP. May also be used in the field to heal HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Brilhos em partículas que sobem e pequenos símbolos luminosos em torno do Pokémon.",
      "animation": "Aura se expande, pulsa e desaparece; a barra de HP muda no frame de resolução da cura.",
      "combat": "Aplicar a quantidade de cura e os limites de HP pela lógica; o efeito visual não determina o valor restaurado.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "410": {
    "id": 410,
    "internalName": "SPLASH",
    "name": "Splash",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user just flops and splashes around to no effect at all...",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "411": {
    "id": 411,
    "internalName": "STOCKPILE",
    "name": "Stockpile",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user charges up power and raises both its Defense and Sp. Def. The move can be used three times.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": [
        3,
        3
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "def",
          "stages": 1,
          "target": "self"
        },
        {
          "stat": "spDef",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "412": {
    "id": 412,
    "internalName": "SUBSTITUTE",
    "name": "Substitute",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user makes a copy of itself using some of its HP. The copy serves as the user's decoy.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "413": {
    "id": 413,
    "internalName": "SUPERSONIC",
    "name": "Supersonic",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 55,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user generates odd sound waves from its body. It may confuse the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "414": {
    "id": 414,
    "internalName": "SWAGGER",
    "name": "Swagger",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user enrages and confuses the target. However, it also sharply raises the target's Attack stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3,
      "statChanges": [
        {
          "stat": "atk",
          "stages": 2,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "415": {
    "id": 415,
    "internalName": "SWALLOW",
    "name": "Swallow",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The power stored using the move Stockpile is absorbed by the user to heal its HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Partículas ascendentes, pequenos brilhos e anéis suaves em verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não em bloom contínuo.",
      "animation": "Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes e some. A barra de HP atualiza no momento definido pela lógica.",
      "combat": "Não usar hitbox ofensiva. Aplicar cura ou limpeza de status conforme a regra do move; a animação apenas comunica a mudança de estado.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "416": {
    "id": 416,
    "internalName": "SWEETKISS",
    "name": "Sweet Kiss",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 75,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user kisses the target with a sweet, angelic cuteness that causes confusion.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "brilho_feerico",
      "theme": "Brilho Feérico Encantado"
    }
  },
  "417": {
    "id": 417,
    "internalName": "SWEETSCENT",
    "name": "Sweet Scent",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "A sweet scent that lowers the foe's evasiveness. It also lures wild Pokémon if used in grass, etc.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "brilho_feerico",
      "theme": "Brilho Feérico Encantado"
    }
  },
  "418": {
    "id": 418,
    "internalName": "SWORDSDANCE",
    "name": "Swords Dance",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "A frenetic dance to uplift the fighting spirit. It sharply raises the user's Attack stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": 2,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "419": {
    "id": 419,
    "internalName": "TAILWHIP",
    "name": "Tail Whip",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user wags its tail cutely, making opposing Pokémon less wary and lowering their Defense stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "420": {
    "id": 420,
    "internalName": "TEETERDANCE",
    "name": "Teeter Dance",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user performs a wobbly dance that confuses the Pokémon around it.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "421": {
    "id": 421,
    "internalName": "TICKLE",
    "name": "Tickle",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user tickles the target into laughing, reducing its Attack and Defense stats.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "422": {
    "id": 422,
    "internalName": "TRANSFORM",
    "name": "Transform",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user transforms into a copy of the target right down to having the same move set.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "423": {
    "id": 423,
    "internalName": "WHIRLWIND",
    "name": "Whirlwind",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -6,
    "vfxFamily": "beam",
    "description": "The foe is blown away, to be replaced by another Pokémon in its party. In the wild, the battle ends.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 5,
      "endFrame": 9,
      "fps": 24,
      "key": "fogo_vortice",
      "theme": "Vórtice de Chamas"
    }
  },
  "424": {
    "id": 424,
    "internalName": "WISH",
    "name": "Wish",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "One turn after this move is used, the target's HP is restored by half the user's maximum HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Brilhos em partículas que sobem e pequenos símbolos luminosos em torno do Pokémon.",
      "animation": "Aura se expande, pulsa e desaparece; a barra de HP muda no frame de resolução da cura.",
      "combat": "Aplicar a quantidade de cura e os limites de HP pela lógica; o efeito visual não determina o valor restaurado.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "425": {
    "id": 425,
    "internalName": "WORKUP",
    "name": "Work Up",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user is roused, and its Attack and Sp. Atk stats increase.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "426": {
    "id": 426,
    "internalName": "YAWN",
    "name": "Yawn",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user lets loose a huge yawn that lulls the target into falling asleep on the next turn.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "427": {
    "id": 427,
    "internalName": "GUNKSHOT",
    "name": "Gunk Shot",
    "type": "Poison",
    "category": "Physical",
    "power": 120,
    "accuracy": 70,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user shoots filthy garbage at the target to attack. It may also poison the target.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "428": {
    "id": 428,
    "internalName": "SLUDGEWAVE",
    "name": "Sludge Wave",
    "type": "Poison",
    "category": "Special",
    "power": 95,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "It swamps the area around the user with a giant sludge wave. It may also poison those hit.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "429": {
    "id": 429,
    "internalName": "SLUDGEBOMB",
    "name": "Sludge Bomb",
    "type": "Poison",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "Unsanitary sludge is hurled at the target. It may also poison the target.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "430": {
    "id": 430,
    "internalName": "POISONJAB",
    "name": "Poison Jab",
    "type": "Poison",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is stabbed with a tentacle or arm seeped with poison. It may also poison the target.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "431": {
    "id": 431,
    "internalName": "CROSSPOISON",
    "name": "Cross Poison",
    "type": "Poison",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "A slashing attack with a poisonous blade that may also poison the foe. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "432": {
    "id": 432,
    "internalName": "SLUDGE",
    "name": "Sludge",
    "type": "Poison",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "Unsanitary sludge is hurled at the target. It may also poison the target.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "433": {
    "id": 433,
    "internalName": "VENOSHOCK",
    "name": "Venoshock",
    "type": "Poison",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "The user drenches the foe in a special poisonous liquid. Its power doubles if the target is poisoned.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague com segmentos angulares, núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no contato.",
      "animation": "Um ou vários segmentos aparecem em sequência rápida; o raio pisca em poucos frames; explosão de faíscas e flash breve no alvo.",
      "combat": "Pode ser raio descendente, projétil elétrico, aura de investida ou descarga radial. Paralisia é um efeito de gameplay separado do efeito luminoso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "434": {
    "id": 434,
    "internalName": "CLEARSMOG",
    "name": "Clear Smog",
    "type": "Poison",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user attacks by throwing a clump of special mud. All status changes are returned to normal.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "435": {
    "id": 435,
    "internalName": "POISONFANG",
    "name": "Poison Fang",
    "type": "Poison",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "bite",
    "description": "The user bites the target with toxic fangs. It may also leave the target badly poisoned.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Duas mandíbulas ou presas pixeladas que se fecham ao redor do ponto de contato; usar sombra escura, dentes claros e flash breve.",
      "animation": "Abrir mandíbula durante a antecipação; fechar rapidamente no contato; recuar e remover o overlay sem cobrir o Pokémon por muito tempo.",
      "combat": "Exige proximidade. O acerto ocorre no instante do fechamento das mandíbulas; efeitos de flinch ou redução de defesa são tratados pela lógica de status, não pelo desenho.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "teeth.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "mandibula_mordida",
      "theme": "Mandíbula de Presas Afiadas"
    }
  },
  "436": {
    "id": 436,
    "internalName": "POISONTAIL",
    "name": "Poison Tail",
    "type": "Poison",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user hits the target with its tail. It may also poison the target. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "437": {
    "id": 437,
    "internalName": "ACID",
    "name": "Acid",
    "type": "Poison",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The foe is attacked with a spray of harsh acid. It may also lower the target's Sp. Def stat.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "438": {
    "id": 438,
    "internalName": "ACIDSPRAY",
    "name": "Acid Spray",
    "type": "Poison",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user spits fluid that works to melt the target. This harshly reduces the target's Sp. Def stat.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "spDef",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "439": {
    "id": 439,
    "internalName": "SMOG",
    "name": "Smog",
    "type": "Poison",
    "category": "Special",
    "power": 20,
    "accuracy": 70,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "The target is attacked with a discharge of filthy gases. It may also poison the target.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Raio em zigue-zague com segmentos angulares, núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no contato.",
      "animation": "Um ou vários segmentos aparecem em sequência rápida; o raio pisca em poucos frames; explosão de faíscas e flash breve no alvo.",
      "combat": "Pode ser raio descendente, projétil elétrico, aura de investida ou descarga radial. Paralisia é um efeito de gameplay separado do efeito luminoso.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "440": {
    "id": 440,
    "internalName": "POISONSTING",
    "name": "Poison Sting",
    "type": "Poison",
    "category": "Physical",
    "power": 15,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user stabs the target with a poisonous stinger. This may also poison the target.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "441": {
    "id": 441,
    "internalName": "ACIDARMOR",
    "name": "Acid Armor",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user alters its cellular structure to liquefy itself, sharply raising its Defense stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "442": {
    "id": 442,
    "internalName": "COIL",
    "name": "Coil",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user coils up and concentrates. This raises its Attack and Defense stats as well as its accuracy.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": 1,
          "target": "self"
        },
        {
          "stat": "def",
          "stages": 1,
          "target": "self"
        },
        {
          "stat": "accuracy",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "443": {
    "id": 443,
    "internalName": "GASTROACID",
    "name": "Gastro Acid",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user hurls up its stomach acids on the foe. The fluid negates the effect of the target's Ability.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "444": {
    "id": 444,
    "internalName": "POISONGAS",
    "name": "Poison Gas",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 80,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "A cloud of poison gas is sprayed in the face of opposing Pokémon. It may poison those hit.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "445": {
    "id": 445,
    "internalName": "POISONPOWDER",
    "name": "Poison Powder",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 75,
    "pp": 35,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user scatters a cloud of poisonous dust on the target. It may poison the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "446": {
    "id": 446,
    "internalName": "TOXIC",
    "name": "Toxic",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "A move that leaves the target badly poisoned. Its poison damage worsens every turn.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "447": {
    "id": 447,
    "internalName": "TOXICSPIKES",
    "name": "Toxic Spikes",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user lays a trap of poison spikes at the foe's feet. They poison foes that switch into battle.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "poison.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 10,
      "fps": 24,
      "key": "veneno_toxico",
      "theme": "Névoa Tóxica e Bolhas Ácidas"
    }
  },
  "448": {
    "id": 448,
    "internalName": "PSYCHOBOOST",
    "name": "Psycho Boost",
    "type": "Psychic",
    "category": "Special",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user attacks the target at full power. The attack's recoil harshly reduces the user's Sp. Atk stat.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "spAtk",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "449": {
    "id": 449,
    "internalName": "DREAMEATER",
    "name": "Dream Eater",
    "type": "Psychic",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user eats the dreams of a sleeping foe. It absorbs half the damage caused to heal the user's HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Partículas ascendentes, pequenos brilhos e anéis suaves em verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não em bloom contínuo.",
      "animation": "Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes e some. A barra de HP atualiza no momento definido pela lógica.",
      "combat": "Não usar hitbox ofensiva. Aplicar cura ou limpeza de status conforme a regra do move; a animação apenas comunica a mudança de estado.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "450": {
    "id": 450,
    "internalName": "FUTURESIGHT",
    "name": "Future Sight",
    "type": "Psychic",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "Two turns after this move is used, a hunk of psychic energy attacks the target.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "451": {
    "id": 451,
    "internalName": "PSYSTRIKE",
    "name": "Psystrike",
    "type": "Psychic",
    "category": "Special",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user materializes an odd psychic wave to attack the target. This attack does physical damage.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "452": {
    "id": 452,
    "internalName": "PSYCHIC",
    "name": "Psychic",
    "type": "Psychic",
    "category": "Special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The target is hit by a strong telekinetic force. It may also reduce the target's Sp. Def stat.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "453": {
    "id": 453,
    "internalName": "EXTRASENSORY",
    "name": "Extrasensory",
    "type": "Psychic",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user attacks with an odd, unseeable power. It may also make the target flinch.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "454": {
    "id": 454,
    "internalName": "PSYSHOCK",
    "name": "Psyshock",
    "type": "Psychic",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "The user materializes an odd psychic wave to attack the target. This attack does physical damage.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Raio em zigue-zague com segmentos angulares, núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no contato.",
      "animation": "Um ou vários segmentos aparecem em sequência rápida; o raio pisca em poucos frames; explosão de faíscas e flash breve no alvo.",
      "combat": "Pode ser raio descendente, projétil elétrico, aura de investida ou descarga radial. Paralisia é um efeito de gameplay separado do efeito luminoso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "455": {
    "id": 455,
    "internalName": "ZENHEADBUTT",
    "name": "Zen Headbutt",
    "type": "Psychic",
    "category": "Physical",
    "power": 80,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user focuses its willpower to its head and attacks the foe. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "456": {
    "id": 456,
    "internalName": "LUSTERPURGE",
    "name": "Luster Purge",
    "type": "Psychic",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user lets loose a damaging burst of light. It may also reduce the target's Sp. Def stat.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "457": {
    "id": 457,
    "internalName": "MISTBALL",
    "name": "Mist Ball",
    "type": "Psychic",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "A mistlike flurry of down envelops and damages the target. It may also lower the target's Sp. Atk.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "458": {
    "id": 458,
    "internalName": "PSYCHOCUT",
    "name": "Psycho Cut",
    "type": "Psychic",
    "category": "Physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user tears at the target with blades formed by psychic power. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "459": {
    "id": 459,
    "internalName": "SYNCHRONOISE",
    "name": "Synchronoise",
    "type": "Psychic",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "Using an odd shock wave, the user damages any Pokémon of the same type as the user.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "460": {
    "id": 460,
    "internalName": "PSYBEAM",
    "name": "Psybeam",
    "type": "Psychic",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The target is attacked with a peculiar ray. It may also cause confusion.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Feixe direcionado com núcleo branco e borda colorida do elemento, com partículas orbitais ou laterais.",
      "animation": "Carga opcional, emissão contínua ou disparo concentrado, seguida de explosão curta no ponto final.",
      "combat": "Definir largura, duração e regra de colisão ao longo do feixe; não aplicar dano por frame sem intervalo explícito.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "461": {
    "id": 461,
    "internalName": "HEARTSTAMP",
    "name": "Heart Stamp",
    "type": "Psychic",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user unleashes a vicious blow after its cute act makes the foe less wary. It may also cause flinching.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "462": {
    "id": 462,
    "internalName": "CONFUSION",
    "name": "Confusion",
    "type": "Psychic",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The target is hit by a weak telekinetic force. It may also leave the target confused.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "463": {
    "id": 463,
    "internalName": "MIRRORCOAT",
    "name": "Mirror Coat",
    "type": "Psychic",
    "category": "Special",
    "power": 1,
    "accuracy": 100,
    "pp": 20,
    "priority": -5,
    "vfxFamily": "psychic",
    "description": "A retaliation move that counters any special attack, inflicting double the damage taken.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "464": {
    "id": 464,
    "internalName": "PSYWAVE",
    "name": "Psywave",
    "type": "Psychic",
    "category": "Special",
    "power": 1,
    "accuracy": 80,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The target is attacked with an odd psychic wave. The attack varies in intensity.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "465": {
    "id": 465,
    "internalName": "STOREDPOWER",
    "name": "Stored Power",
    "type": "Psychic",
    "category": "Special",
    "power": 1,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user attacks with stored power. The more the user's stats are raised, the greater the damage.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "466": {
    "id": 466,
    "internalName": "AGILITY",
    "name": "Agility",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user relaxes and lightens its body to move faster. It sharply boosts the Speed stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "speed",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "467": {
    "id": 467,
    "internalName": "ALLYSWITCH",
    "name": "Ally Switch",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 1,
    "vfxFamily": "status",
    "description": "The user teleports using a strange power and switches its place with one of its allies.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "468": {
    "id": 468,
    "internalName": "AMNESIA",
    "name": "Amnesia",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user temporarily empties its mind to forget its concerns. It sharply raises the user's Sp. Def stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "spDef",
          "stages": 2,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "469": {
    "id": 469,
    "internalName": "BARRIER",
    "name": "Barrier",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user throws up a sturdy wall that sharply raises its Defense stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "def",
          "stages": 2,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "470": {
    "id": 470,
    "internalName": "CALMMIND",
    "name": "Calm Mind",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user quietly focuses its mind and calms its spirit to raise its Sp. Atk and Sp. Def stats.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "471": {
    "id": 471,
    "internalName": "COSMICPOWER",
    "name": "Cosmic Power",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user absorbs a mystical power from space to raise its Defense and Sp. Def stats.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "472": {
    "id": 472,
    "internalName": "GRAVITY",
    "name": "Gravity",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "status",
    "description": "Gravity is intensified for five turns, making moves involving flying unusable and negating Levitation.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "473": {
    "id": 473,
    "internalName": "GUARDSPLIT",
    "name": "Guard Split",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user employs its psychic power to average its Defense and Sp. Def stats with those of its target's.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "474": {
    "id": 474,
    "internalName": "GUARDSWAP",
    "name": "Guard Swap",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user employs its psychic power to switch changes to its Defense and Sp. Def with the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "475": {
    "id": 475,
    "internalName": "HEALBLOCK",
    "name": "Heal Block",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "For five turns, the foe is prevented from using any moves, Abilities, or held items that recover HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0.5,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Partículas ascendentes, pequenos brilhos e anéis suaves em verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não em bloom contínuo.",
      "animation": "Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes e some. A barra de HP atualiza no momento definido pela lógica.",
      "combat": "Não usar hitbox ofensiva. Aplicar cura ou limpeza de status conforme a regra do move; a animação apenas comunica a mudança de estado.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "476": {
    "id": 476,
    "internalName": "HEALPULSE",
    "name": "Heal Pulse",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user emits a healing pulse which restores the target's HP by up to half of its max HP.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Partículas ascendentes, pequenos brilhos e anéis suaves em verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não em bloom contínuo.",
      "animation": "Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes e some. A barra de HP atualiza no momento definido pela lógica.",
      "combat": "Não usar hitbox ofensiva. Aplicar cura ou limpeza de status conforme a regra do move; a animação apenas comunica a mudança de estado.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Onda / Pulso Noturno"
    }
  },
  "477": {
    "id": 477,
    "internalName": "HEALINGWISH",
    "name": "Healing Wish",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user faints. In return, the Pokémon taking its place will have its HP restored and status cured.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Brilhos em partículas que sobem e pequenos símbolos luminosos em torno do Pokémon.",
      "animation": "Aura se expande, pulsa e desaparece; a barra de HP muda no frame de resolução da cura.",
      "combat": "Aplicar a quantidade de cura e os limites de HP pela lógica; o efeito visual não determina o valor restaurado.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "478": {
    "id": 478,
    "internalName": "HEARTSWAP",
    "name": "Heart Swap",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user employs its psychic power to switch stat changes with the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "479": {
    "id": 479,
    "internalName": "HYPNOSIS",
    "name": "Hypnosis",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 60,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user employs hypnotic suggestion to make the target fall into a deep sleep.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "480": {
    "id": 480,
    "internalName": "IMPRISON",
    "name": "Imprison",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "If the foe knows any move also known by the user, the foe is prevented from using it.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "481": {
    "id": 481,
    "internalName": "KINESIS",
    "name": "Kinesis",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 80,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user distracts the target by bending a spoon. It lowers the target's accuracy.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "accuracy",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "482": {
    "id": 482,
    "internalName": "LIGHTSCREEN",
    "name": "Light Screen",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "A wondrous wall of light is put up to suppress damage from special attacks for five turns.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "483": {
    "id": 483,
    "internalName": "LUNARDANCE",
    "name": "Lunar Dance",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user faints. In return, the Pokémon taking its place will have its status and HP fully restored.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "484": {
    "id": 484,
    "internalName": "MAGICCOAT",
    "name": "Magic Coat",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 4,
    "vfxFamily": "status",
    "description": "A barrier reflects back to the target moves like Leech Seed and moves that damage status.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0.5,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "485": {
    "id": 485,
    "internalName": "MAGICROOM",
    "name": "Magic Room",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": -7,
    "vfxFamily": "status",
    "description": "The user creates a bizarre area in which Pokémon's held items lose their effects for five turns.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "486": {
    "id": 486,
    "internalName": "MEDITATE",
    "name": "Meditate",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user meditates to awaken the power deep within its body and raise its Attack stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "487": {
    "id": 487,
    "internalName": "MIRACLEEYE",
    "name": "Miracle Eye",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "Enables the user to hit a Dark type with any type of move. It also enables the user to hit an evasive foe.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "488": {
    "id": 488,
    "internalName": "POWERSPLIT",
    "name": "Power Split",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user employs its psychic power to average its Attack and Sp. Atk stats with those of the target's.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "489": {
    "id": 489,
    "internalName": "POWERSWAP",
    "name": "Power Swap",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user employs its psychic power to switch changes to its Attack and Sp. Atk with the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "490": {
    "id": 490,
    "internalName": "POWERTRICK",
    "name": "Power Trick",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user employs its psychic power to switch its Attack with its Defense stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "491": {
    "id": 491,
    "internalName": "PSYCHOSHIFT",
    "name": "Psycho Shift",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "Using its psychic power of suggestion, the user transfers its status problems to the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "492": {
    "id": 492,
    "internalName": "REFLECT",
    "name": "Reflect",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "A wondrous wall of light is put up to suppress damage from physical attacks for five turns.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "493": {
    "id": 493,
    "internalName": "REST",
    "name": "Rest",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user goes to sleep for two turns. It fully restores the user's HP and heals any status problem.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Partículas ascendentes, pequenos brilhos e anéis suaves em verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não em bloom contínuo.",
      "animation": "Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes e some. A barra de HP atualiza no momento definido pela lógica.",
      "combat": "Não usar hitbox ofensiva. Aplicar cura ou limpeza de status conforme a regra do move; a animação apenas comunica a mudança de estado.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "494": {
    "id": 494,
    "internalName": "ROLEPLAY",
    "name": "Role Play",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user mimics the target completely, copying the target's natural Ability.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "495": {
    "id": 495,
    "internalName": "SKILLSWAP",
    "name": "Skill Swap",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user employs its psychic power to exchange Abilities with the target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "496": {
    "id": 496,
    "internalName": "TELEKINESIS",
    "name": "Telekinesis",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user makes the target float with its psychic power. The target is easier to hit for three turns.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Pulso de Energia Psíquica"
    }
  },
  "497": {
    "id": 497,
    "internalName": "TELEPORT",
    "name": "Teleport",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "Use it to flee from any wild Pokémon. It can also warp to the last Pokémon Center visited.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "498": {
    "id": 498,
    "internalName": "TRICK",
    "name": "Trick",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user catches the target off guard and swaps its held item with its own.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "499": {
    "id": 499,
    "internalName": "TRICKROOM",
    "name": "Trick Room",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": -7,
    "vfxFamily": "status",
    "description": "The user creates a bizarre area in which slower Pokémon get to move first for five turns.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "500": {
    "id": 500,
    "internalName": "WONDERROOM",
    "name": "Wonder Room",
    "type": "Psychic",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": -7,
    "vfxFamily": "stat_change",
    "description": "The user creates a bizarre area in which Pokémon's Defense and Sp. Def stats are swapped for 5 turns.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "501": {
    "id": 501,
    "internalName": "HEADSMASH",
    "name": "Head Smash",
    "type": "Rock",
    "category": "Physical",
    "power": 150,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user attacks the foe with a hazardous, full-power headbutt. The user also takes terrible damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "502": {
    "id": 502,
    "internalName": "ROCKWRECKER",
    "name": "Rock Wrecker",
    "type": "Rock",
    "category": "Physical",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user launches a huge boulder at the target to attack. It must rest on the next turn, however.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "503": {
    "id": 503,
    "internalName": "STONEEDGE",
    "name": "Stone Edge",
    "type": "Rock",
    "category": "Physical",
    "power": 100,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user stabs the foe with sharpened stones from below. It has a high critical-hit ratio.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "504": {
    "id": 504,
    "internalName": "ROCKSLIDE",
    "name": "Rock Slide",
    "type": "Rock",
    "category": "Physical",
    "power": 75,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "Large boulders are hurled at the foes to inflict damage. It may also make the targets flinch.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "505": {
    "id": 505,
    "internalName": "POWERGEM",
    "name": "Power Gem",
    "type": "Rock",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user attacks with a ray of light that sparkles as if it were made of gemstones.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "506": {
    "id": 506,
    "internalName": "ANCIENTPOWER",
    "name": "Ancient Power",
    "type": "Rock",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user attacks with a prehistoric power. It may also raise all the user's stats at once.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "507": {
    "id": 507,
    "internalName": "ROCKTHROW",
    "name": "Rock Throw",
    "type": "Rock",
    "category": "Physical",
    "power": 50,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user picks up and throws a small rock at the target to attack.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "508": {
    "id": 508,
    "internalName": "ROCKTOMB",
    "name": "Rock Tomb",
    "type": "Rock",
    "category": "Physical",
    "power": 50,
    "accuracy": 80,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "Boulders are hurled at the target. It also lowers the target's Speed by preventing its movement.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "speed",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "509": {
    "id": 509,
    "internalName": "SMACKDOWN",
    "name": "Smack Down",
    "type": "Rock",
    "category": "Physical",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user throws a stone or projectile to attack. A flying Pokémon will fall to the ground when hit.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "510": {
    "id": 510,
    "internalName": "ROLLOUT",
    "name": "Rollout",
    "type": "Rock",
    "category": "Physical",
    "power": 30,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user continually rolls into the target over five turns. It becomes stronger each time it hits.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "511": {
    "id": 511,
    "internalName": "ROCKBLAST",
    "name": "Rock Blast",
    "type": "Rock",
    "category": "Physical",
    "power": 25,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "The user hurls hard rocks at the target. Two to five rocks are launched in quick succession.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Sequência de impactos/projéteis pequenos com flashes individuais e variação mínima de posição.",
      "animation": "Repetir o efeito de contato ou disparo com intervalo curto, exibindo cada acerto separadamente.",
      "combat": "Quantidade de acertos é definida pelo sistema de moves; cada instância de impacto aplica exatamente um hit.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "512": {
    "id": 512,
    "internalName": "ROCKPOLISH",
    "name": "Rock Polish",
    "type": "Rock",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user polishes its body to reduce drag. It can sharply raise the Speed stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "513": {
    "id": 513,
    "internalName": "SANDSTORM",
    "name": "Sandstorm",
    "type": "Rock",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "Summons a five-turn sandstorm to hurt all combatants except the Rock, Ground, and Steel types.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Overlay de clima em toda a arena: chuva diagonal, calor ondulante, areia horizontal ou neve em flocos quadrados.",
      "animation": "Transição curta do clima atual para o novo; partículas contínuas de baixa densidade enquanto durar.",
      "combat": "Clima é um estado global com duração; não deve ser recriado individualmente por cada frame ou Pokémon.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "514": {
    "id": 514,
    "internalName": "STEALTHROCK",
    "name": "Stealth Rock",
    "type": "Rock",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user lays a trap of levitating stones around the foe. The trap hurts foes that switch into battle.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "515": {
    "id": 515,
    "internalName": "WIDEGUARD",
    "name": "Wide Guard",
    "type": "Rock",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 3,
    "vfxFamily": "status",
    "description": "The user and its allies are protected from wide-ranging attacks for a turn. May fail if used in succession.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Escudo de contorno pixelado, hexágonos ou espinhos ao redor do usuário; brilho forte apenas na ativação.",
      "animation": "Escudo aparece em 2--3 etapas, pisca quando bloqueia e desaparece ao fim da janela de proteção.",
      "combat": "Ativar a proteção em estado próprio com duração definida. Dano refletido só existe quando a regra do move o especificar.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "516": {
    "id": 516,
    "internalName": "DOOMDESIRE",
    "name": "Doom Desire",
    "type": "Steel",
    "category": "Special",
    "power": 140,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "Two turns after this move is used, the user blasts the target with a concentrated bundle of light.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "517": {
    "id": 517,
    "internalName": "IRONTAIL",
    "name": "Iron Tail",
    "type": "Steel",
    "category": "Physical",
    "power": 100,
    "accuracy": 75,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is slammed with a steel-hard tail. It may also lower the target's Defense stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "518": {
    "id": 518,
    "internalName": "METEORMASH",
    "name": "Meteor Mash",
    "type": "Steel",
    "category": "Physical",
    "power": 100,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The target is hit with a hard punch fired like a meteor. It may also raise the user's Attack.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "519": {
    "id": 519,
    "internalName": "FLASHCANNON",
    "name": "Flash Cannon",
    "type": "Steel",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user gathers all its light energy and releases it at once. It may also lower the target's Sp. Def stat.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "520": {
    "id": 520,
    "internalName": "IRONHEAD",
    "name": "Iron Head",
    "type": "Steel",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The foe slams the target with its steel-hard head. It may also make the target flinch.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "521": {
    "id": 521,
    "internalName": "STEELWING",
    "name": "Steel Wing",
    "type": "Steel",
    "category": "Physical",
    "power": 70,
    "accuracy": 90,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The target is hit with wings of steel. It may also raise the user's Defense stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "522": {
    "id": 522,
    "internalName": "MIRRORSHOT",
    "name": "Mirror Shot",
    "type": "Steel",
    "category": "Special",
    "power": 65,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "The user looses a flash of energy from its polished body. It may also lower the target's accuracy.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "523": {
    "id": 523,
    "internalName": "MAGNETBOMB",
    "name": "Magnet Bomb",
    "type": "Steel",
    "category": "Physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user launches steel bombs that stick to the target. This attack will not miss.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "524": {
    "id": 524,
    "internalName": "GEARGRIND",
    "name": "Gear Grind",
    "type": "Steel",
    "category": "Physical",
    "power": 50,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user attacks by throwing two steel gears at its target.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "525": {
    "id": 525,
    "internalName": "METALCLAW",
    "name": "Metal Claw",
    "type": "Steel",
    "category": "Physical",
    "power": 50,
    "accuracy": 95,
    "pp": 35,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The target is raked with steel claws. It may also raise the user's Attack stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "526": {
    "id": 526,
    "internalName": "BULLETPUNCH",
    "name": "Bullet Punch",
    "type": "Steel",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "vfxFamily": "impact",
    "description": "The user strikes the target with tough punches as fast as bullets. This move always goes first.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "527": {
    "id": 527,
    "internalName": "GYROBALL",
    "name": "Gyro Ball",
    "type": "Steel",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user tackles the target with a high-speed spin. The slower the user, the greater the damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "528": {
    "id": 528,
    "internalName": "HEAVYSLAM",
    "name": "Heavy Slam",
    "type": "Steel",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user slams into the foe with its heavy body. The heavier the user, the greater the damage.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "529": {
    "id": 529,
    "internalName": "METALBURST",
    "name": "Metal Burst",
    "type": "Steel",
    "category": "Physical",
    "power": 1,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user retaliates with much greater power against the target that last inflicted damage on it.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "530": {
    "id": 530,
    "internalName": "AUTOTOMIZE",
    "name": "Autotomize",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user sheds part of its body to make itself lighter and sharply raise its Speed stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "531": {
    "id": 531,
    "internalName": "IRONDEFENSE",
    "name": "Iron Defense",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user hardens its body's surface like iron, sharply raising its Defense stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "532": {
    "id": 532,
    "internalName": "METALSOUND",
    "name": "Metal Sound",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 85,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "A horrible sound like scraping metal harshly reduces the target's Sp. Def stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "spDef",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "533": {
    "id": 533,
    "internalName": "SHIFTGEAR",
    "name": "Shift Gear",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user rotates its gears, raising its Attack and sharply raising its Speed.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "534": {
    "id": 534,
    "internalName": "HYDROCANNON",
    "name": "Hydro Cannon",
    "type": "Water",
    "category": "Special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The target is hit with a watery blast. The user must rest on the next turn, however.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Execução em etapas: representar preparação e liberação como estados separados, com possibilidade de interrupção se a regra permitir."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 6,
      "endFrame": 10,
      "fps": 24,
      "key": "agua_tsunami",
      "theme": "Onda Torrencial / Tsunami"
    }
  },
  "535": {
    "id": 535,
    "internalName": "WATERSPOUT",
    "name": "Water Spout",
    "type": "Water",
    "category": "Special",
    "power": 150,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user spouts water to damage the foe. The lower the user's HP, the less powerful it becomes.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 3,
      "fps": 24,
      "key": "agua_bolhas",
      "theme": "Esguicho e Bolhas de Água"
    }
  },
  "536": {
    "id": 536,
    "internalName": "HYDROPUMP",
    "name": "Hydro Pump",
    "type": "Water",
    "category": "Special",
    "power": 120,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The target is blasted by a huge volume of water launched under great pressure.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe direcionado com núcleo branco e borda colorida do elemento, com partículas orbitais ou laterais.",
      "animation": "Carga opcional, emissão contínua ou disparo concentrado, seguida de explosão curta no ponto final.",
      "combat": "Definir largura, duração e regra de colisão ao longo do feixe; não aplicar dano por frame sem intervalo explícito.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 6,
      "endFrame": 10,
      "fps": 24,
      "key": "agua_tsunami",
      "theme": "Onda Torrencial / Tsunami"
    }
  },
  "537": {
    "id": 537,
    "internalName": "MUDDYWATER",
    "name": "Muddy Water",
    "type": "Water",
    "category": "Special",
    "power": 95,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user attacks by shooting muddy water at the opposing team. It may also lower the target's accuracy.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "538": {
    "id": 538,
    "internalName": "SURF",
    "name": "Surf",
    "type": "Water",
    "category": "Special",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "It swamps the area around the user with a giant wave. It can also be used for crossing water.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 6,
      "endFrame": 10,
      "fps": 24,
      "key": "agua_tsunami",
      "theme": "Onda Torrencial / Tsunami"
    }
  },
  "539": {
    "id": 539,
    "internalName": "AQUATAIL",
    "name": "Aqua Tail",
    "type": "Water",
    "category": "Physical",
    "power": 90,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user attacks by swinging its tail as if it were a vicious wave in a raging storm.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 3,
      "fps": 24,
      "key": "agua_bolhas",
      "theme": "Esguicho e Bolhas de Água"
    }
  },
  "540": {
    "id": 540,
    "internalName": "CRABHAMMER",
    "name": "Crabhammer",
    "type": "Water",
    "category": "Physical",
    "power": 90,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The target is hammered with a large pincer. Critical hits land more easily.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 1,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "541": {
    "id": 541,
    "internalName": "DIVE",
    "name": "Dive",
    "type": "Water",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "Diving on the first turn, the user rises and hits on the next turn. It can be used to dive in the ocean.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 6,
      "endFrame": 10,
      "fps": 24,
      "key": "agua_tsunami",
      "theme": "Onda Torrencial / Tsunami"
    }
  },
  "542": {
    "id": 542,
    "internalName": "SCALD",
    "name": "Scald",
    "type": "Water",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The user shoots boiling hot water at its target. It may also leave the target with a burn.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "543": {
    "id": 543,
    "internalName": "WATERFALL",
    "name": "Waterfall",
    "type": "Water",
    "category": "Physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "The user charges at the target and may make it flinch. It can also be used to climb a waterfall.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "flinch",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Aura curta na cor do golpe, linhas de velocidade e afterimages pixelados. No impacto, adicionar burst e pequeno decalque coerente com o elemento.",
      "animation": "Antecipação de 60--120 ms; deslocamento rápido e legível; pose de impacto; recuperação curta. Não teletransportar: o deslocamento precisa respeitar colisões.",
      "combat": "Movimentar o usuário em direção definida e testar contato durante o percurso. Aplicar knockback ao alvo se indicado. Recuo/dano ao usuário somente quando a mecânica do move justificar.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 6,
      "endFrame": 10,
      "fps": 24,
      "key": "agua_tsunami",
      "theme": "Onda Torrencial / Tsunami"
    }
  },
  "544": {
    "id": 544,
    "internalName": "RAZORSHELL",
    "name": "Razor Shell",
    "type": "Water",
    "category": "Physical",
    "power": 75,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user cuts the foe with sharp shells. It may also lower the target's Defense stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "def",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "545": {
    "id": 545,
    "internalName": "BRINE",
    "name": "Brine",
    "type": "Water",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "If the target's HP is down to about half, this attack will hit with double the power.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "546": {
    "id": 546,
    "internalName": "BUBBLEBEAM",
    "name": "Bubble Beam",
    "type": "Water",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "A spray of bubbles is forcefully ejected at the target. It may also lower its Speed stat.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 3,
      "fps": 24,
      "key": "agua_bolhas",
      "theme": "Esguicho e Bolhas de Água"
    }
  },
  "547": {
    "id": 547,
    "internalName": "OCTAZOOKA",
    "name": "Octazooka",
    "type": "Water",
    "category": "Special",
    "power": 65,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user attacks by spraying ink in the foe's face or eyes. It may also lower the target's accuracy.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "548": {
    "id": 548,
    "internalName": "WATERPULSE",
    "name": "Water Pulse",
    "type": "Water",
    "category": "Special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user attacks the target with a pulsing blast of water. It may also confuse the target.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Onda / Pulso Noturno"
    }
  },
  "549": {
    "id": 549,
    "internalName": "WATERPLEDGE",
    "name": "Water Pledge",
    "type": "Water",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "A column of water strikes the target. When combined with its fire equivalent, it makes a rainbow.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 3,
      "fps": 24,
      "key": "agua_bolhas",
      "theme": "Esguicho e Bolhas de Água"
    }
  },
  "550": {
    "id": 550,
    "internalName": "AQUAJET",
    "name": "Aqua Jet",
    "type": "Water",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 1,
    "vfxFamily": "water",
    "description": "The user lunges at the target at a speed that makes it almost invisible. It is sure to strike first.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 6,
      "endFrame": 10,
      "fps": 24,
      "key": "agua_tsunami",
      "theme": "Onda Torrencial / Tsunami"
    }
  },
  "551": {
    "id": 551,
    "internalName": "WATERGUN",
    "name": "Water Gun",
    "type": "Water",
    "category": "Special",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The target is blasted with a forceful shot of water.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 3,
      "fps": 24,
      "key": "agua_bolhas",
      "theme": "Esguicho e Bolhas de Água"
    }
  },
  "552": {
    "id": 552,
    "internalName": "CLAMP",
    "name": "Clamp",
    "type": "Water",
    "category": "Physical",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The target is clamped and squeezed by the user's very thick and sturdy shell for four to five turns.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "553": {
    "id": 553,
    "internalName": "WHIRLPOOL",
    "name": "Whirlpool",
    "type": "Water",
    "category": "Special",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "water",
    "description": "Traps foes in a violent swirling whirlpool for four to five turns.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 5,
      "endFrame": 9,
      "fps": 24,
      "key": "fogo_vortice",
      "theme": "Vórtice de Chamas"
    }
  },
  "554": {
    "id": 554,
    "internalName": "BUBBLE",
    "name": "Bubble",
    "type": "Water",
    "category": "Special",
    "power": 20,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "A spray of countless bubbles is jetted at the opposing team. It may also lower the targets' Speed stats.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 3,
      "fps": 24,
      "key": "agua_bolhas",
      "theme": "Esguicho e Bolhas de Água"
    }
  },
  "555": {
    "id": 555,
    "internalName": "AQUARING",
    "name": "Aqua Ring",
    "type": "Water",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user envelops itself in a veil made of water. It regains some HP on every turn.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Partículas ascendentes, pequenos brilhos e anéis suaves em verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não em bloom contínuo.",
      "animation": "Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes e some. A barra de HP atualiza no momento definido pela lógica.",
      "combat": "Não usar hitbox ofensiva. Aplicar cura ou limpeza de status conforme a regra do move; a animação apenas comunica a mudança de estado.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 3,
      "fps": 24,
      "key": "agua_bolhas",
      "theme": "Esguicho e Bolhas de Água"
    }
  },
  "556": {
    "id": 556,
    "internalName": "RAINDANCE",
    "name": "Rain Dance",
    "type": "Water",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user summons a heavy rain that falls for five turns, powering up Water-type moves.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Overlay de clima em toda a arena: chuva diagonal, calor ondulante, areia horizontal ou neve em flocos quadrados.",
      "animation": "Transição curta do clima atual para o novo; partículas contínuas de baixa densidade enquanto durar.",
      "combat": "Clima é um estado global com duração; não deve ser recriado individualmente por cada frame ou Pokémon.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "557": {
    "id": 557,
    "internalName": "SOAK",
    "name": "Soak",
    "type": "Water",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user shoots a torrent of water at the target and changes the target's type to Water.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "558": {
    "id": 558,
    "internalName": "WATERSPORT",
    "name": "Water Sport",
    "type": "Water",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "fire",
    "description": "The user soaks itself with water. The move weakens Fire-type moves while the user is in the battle.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Chamas em blocos com paleta branco/amarelo/laranja/vermelho e contorno escuro; brasas pequenas sobem; o centro do impacto é mais claro que a borda.",
      "animation": "Chama irregular em 3--6 poses; projétil ou cone de fogo conforme o move; no impacto, burst de brasas e possível decalque scorch com duração limitada.",
      "combat": "Distinguir bola de fogo, sopro em cone, coluna vertical e aura de investida. Decalque é cosmético; queimadura só ocorre quando a regra do move confirmar o efeito secundário.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 3,
      "fps": 24,
      "key": "agua_bolhas",
      "theme": "Esguicho e Bolhas de Água"
    }
  },
  "559": {
    "id": 559,
    "internalName": "WITHDRAW",
    "name": "Withdraw",
    "type": "Water",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user withdraws its body into its hard shell, raising its Defense stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "560": {
    "id": 560,
    "internalName": "FLYINGPRESS",
    "name": "Flying Press",
    "type": "Fighting",
    "category": "Physical",
    "power": 80,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user dives down onto the target from the sky. This move is Fighting and Flying type simultaneously.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Wind1.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 8,
      "endFrame": 12,
      "fps": 24,
      "key": "vento_cortante",
      "theme": "Lâminas Cortantes de Vento"
    }
  },
  "561": {
    "id": 561,
    "internalName": "MATBLOCK",
    "name": "Mat Block",
    "type": "Fighting",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "Using a pulled-up mat as a shield, the user protects itself and its allies from damaging moves. This does not stop status moves.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "562": {
    "id": 562,
    "internalName": "BELCH",
    "name": "Belch",
    "type": "Poison",
    "category": "Special",
    "power": 120,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "The user lets out a damaging belch on the target. The user must eat a Berry to use this move.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "563": {
    "id": 563,
    "internalName": "ROTOTILLER",
    "name": "Rototiller",
    "type": "Ground",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "Tilling the soil, the user makes it easier for plants to grow. This raises the Attack and Sp. Atk stats of Grass-type Pokémon.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": 1,
          "target": "self"
        },
        {
          "stat": "spAtk",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "564": {
    "id": 564,
    "internalName": "STICKYWEB",
    "name": "Sticky Web",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user weaves a sticky net around the opposing team, which lowers their Speed stat upon switching into battle.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "speed",
          "stages": -1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "565": {
    "id": 565,
    "internalName": "FELLSTINGER",
    "name": "Fell Stinger",
    "type": "Bug",
    "category": "Physical",
    "power": 30,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "When the user knocks out a target with this move, the user's Attack stat rises sharply.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "566": {
    "id": 566,
    "internalName": "PHANTOMFORCE",
    "name": "Phantom Force",
    "type": "Ghost",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user vanishes somewhere, then strikes the target on the next turn. This move hits even if the target protects itself.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "030-Explosion01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "espectral_fantasma",
      "theme": "Ectoplasma Espectral Sombrio"
    }
  },
  "567": {
    "id": 567,
    "internalName": "TRICKORTREAT",
    "name": "Trick-or-Treat",
    "type": "Ghost",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user takes the target trick-or-treating. This adds Ghost type to the target's type.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "568": {
    "id": 568,
    "internalName": "NOBLEROAR",
    "name": "Noble Roar",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "Letting out a noble roar, the user intimidates the target and lowers its Attack and Sp. Atk stats.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "spAtk",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "569": {
    "id": 569,
    "internalName": "IONDELUGE",
    "name": "Ion Deluge",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 25,
    "priority": 1,
    "vfxFamily": "electric",
    "description": "The user disperses electrically charged particles, which changes Normal-type moves to Electric-type moves.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Raio em zigue-zague com segmentos angulares, núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no contato.",
      "animation": "Um ou vários segmentos aparecem em sequência rápida; o raio pisca em poucos frames; explosão de faíscas e flash breve no alvo.",
      "combat": "Pode ser raio descendente, projétil elétrico, aura de investida ou descarga radial. Paralisia é um efeito de gameplay separado do efeito luminoso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "570": {
    "id": 570,
    "internalName": "PARABOLICCHARGE",
    "name": "Parabolic Charge",
    "type": "Electric",
    "category": "Special",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "The user attacks everything around it. The user's HP is restored by half the damage taken by those hit.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0.5,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Raio em zigue-zague com segmentos angulares, núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no contato.",
      "animation": "Um ou vários segmentos aparecem em sequência rápida; o raio pisca em poucos frames; explosão de faíscas e flash breve no alvo.",
      "combat": "Pode ser raio descendente, projétil elétrico, aura de investida ou descarga radial. Paralisia é um efeito de gameplay separado do efeito luminoso.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "571": {
    "id": 571,
    "internalName": "FORESTSCURSE",
    "name": "Forest's Curse",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "shadow",
    "description": "The user puts a forest curse on the target. Afflicted targets are now Grass type as well.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "confusion",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Orbes escuros, fumaça pixelada, rasgos de sombra e contorno violeta/azul profundo. Manter alguns pixels claros para legibilidade sobre fundos escuros.",
      "animation": "Sombra se condensa; projétil ou onda avança; no impacto, a silhueta escurece por poucos frames e partículas se dissipam.",
      "combat": "Pode ser projétil, onda, corte ou maldição persistente. Efeitos de medo, confusão, sono e redução de atributos devem ser aplicados por regras de status.",
      "rules": "Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "030-Explosion01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "espectral_fantasma",
      "theme": "Ectoplasma Espectral Sombrio"
    }
  },
  "572": {
    "id": 572,
    "internalName": "PETALBLIZZARD",
    "name": "Petal Blizzard",
    "type": "Grass",
    "category": "Physical",
    "power": 90,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user stirs up a violent petal blizzard and attacks everything around it.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "573": {
    "id": 573,
    "internalName": "FREEZEDRY",
    "name": "Freeze-Dry",
    "type": "Ice",
    "category": "Special",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "ice",
    "description": "The user rapidly cools the target. This may also leave the target frozen. This move is super effective on Water types.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "574": {
    "id": 574,
    "internalName": "DISARMINGVOICE",
    "name": "Disarming Voice",
    "type": "Fairy",
    "category": "Special",
    "power": 15,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "ice",
    "description": "Letting out a charming cry, the user does emotional damage to opposing Pokémon. This attack never misses.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Cristais com pontas rígidas, flocos quadrados e paleta branco/ciano/azul. Evitar blur; usar brilhos pontuais e pequenos fragmentos.",
      "animation": "Congelamento visual rápido na origem ou no alvo; cristais surgem em 2--4 etapas; rajada de neve ou projétil; fragmentos se quebram no impacto.",
      "combat": "Feixe, projétil, tempestade ou cristal que cai conforme o move. Congelamento/slow só é aplicado se a lógica do golpe determinar sucesso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "575": {
    "id": 575,
    "internalName": "PARTINGSHOT",
    "name": "Parting Shot",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "dash",
    "description": "With a parting threat, the user lowers the target's Attack and Sp. Atk stats. Then it switches with a party Pokémon.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "spAtk",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Rastro de movimento que atravessa ou contorna o alvo, com partículas na cor do tipo.",
      "animation": "Investida curta, impacto e saída do campo com afterimage; deixar a troca para depois da resolução do hit.",
      "combat": "Executar o efeito de troca após confirmar o acerto e respeitar as regras de troca do combate.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "576": {
    "id": 576,
    "internalName": "TOPSYTURVY",
    "name": "Topsy-Turvy",
    "type": "Dark",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "All stat changes affecting the target turn topsy-turvy and become the opposite of what they were.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "577": {
    "id": 577,
    "internalName": "DRAININGKISS",
    "name": "Draining Kiss",
    "type": "Fairy",
    "category": "Special",
    "power": 10,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "water",
    "description": "The user steals the target's energy with a kiss. The user's HP is restored by over half of the damage taken by the target.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Gotículas quadradas em tons de azul/ciano/branco, bolhas com highlight e respingos angulares. Jatos usam faixa principal e partículas laterais.",
      "animation": "Disparo ou jato contínuo; gotículas se espalham no impacto e caem com gravidade simples; bolhas podem subir antes de estourar.",
      "combat": "Projetil, cone ou feixe de acordo com a descrição. Poça wet é opcional e cosmética; não deve alterar velocidade ou colisão sem regra explícita.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "brilho_feerico",
      "theme": "Brilho Feérico Encantado"
    }
  },
  "578": {
    "id": 578,
    "internalName": "CRAFTYSHIELD",
    "name": "Crafty Shield",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user protects itself and its allies from status moves with a mysterious power. This does not stop moves that do damage.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "579": {
    "id": 579,
    "internalName": "FLOWERSHIELD",
    "name": "Flower Shield",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user raises the Defense stat of all Grass-type Pokémon in battle with a mysterious power.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "def",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "580": {
    "id": 580,
    "internalName": "GRASSYTERRAIN",
    "name": "Grassy Terrain",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "heal",
    "description": "The user turns the ground under everyone's feet to grass for five turns. This restores the HP of Pokémon on the ground a little every turn.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Partículas ascendentes, pequenos brilhos e anéis suaves em verde, rosa ou dourado; pixels claros devem aparecer em pulsos e não em bloom contínuo.",
      "animation": "Aura cresce ao redor do usuário/alvo, pulsa 2--3 vezes e some. A barra de HP atualiza no momento definido pela lógica.",
      "combat": "Não usar hitbox ofensiva. Aplicar cura ou limpeza de status conforme a regra do move; a animação apenas comunica a mudança de estado.",
      "rules": "Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Folhas Cortantes e Chicote"
    }
  },
  "581": {
    "id": 581,
    "internalName": "MISTYTERRAIN",
    "name": "Misty Terrain",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user covers the ground under everyone's feet with mist for five turns. This protects Pokémon on the ground from status conditions.",
    "executionType": "area",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "brilho_feerico",
      "theme": "Brilho Feérico Encantado"
    }
  },
  "582": {
    "id": 582,
    "internalName": "ELECTRIFY",
    "name": "Electrify",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "electric",
    "description": "If the target is electrified before it uses a move during that turn, the target's move becomes Electric type.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Raio em zigue-zague com segmentos angulares, núcleo amarelo/branco e borda dourada; faíscas curtas se espalham no contato.",
      "animation": "Um ou vários segmentos aparecem em sequência rápida; o raio pisca em poucos frames; explosão de faíscas e flash breve no alvo.",
      "combat": "Pode ser raio descendente, projétil elétrico, aura de investida ou descarga radial. Paralisia é um efeito de gameplay separado do efeito luminoso.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "583": {
    "id": 583,
    "internalName": "PLAYROUGH",
    "name": "Play Rough",
    "type": "Fairy",
    "category": "Physical",
    "power": 90,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user plays rough with the target and attacks it. This may also lower the target's Attack stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "brilho_feerico",
      "theme": "Brilho Feérico Encantado"
    }
  },
  "584": {
    "id": 584,
    "internalName": "FAIRYWIND",
    "name": "Fairy Wind",
    "type": "Fairy",
    "category": "Special",
    "power": 30,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user stirs up a fairy wind and strikes the target with it.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "brilho_feerico",
      "theme": "Brilho Feérico Encantado"
    }
  },
  "585": {
    "id": 585,
    "internalName": "MOONBLAST",
    "name": "Moonblast",
    "type": "Fairy",
    "category": "Special",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "Borrowing the power of the moon, the user attacks the target. This may also lower the target's Sp. Atk stat.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "brilho_feerico",
      "theme": "Brilho Feérico Encantado"
    }
  },
  "586": {
    "id": 586,
    "internalName": "BOOMBURST",
    "name": "Boomburst",
    "type": "Normal",
    "category": "Special",
    "power": 140,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user attacks everything around it with the destructive power of a terrible, explosive sound.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "587": {
    "id": 587,
    "internalName": "FAIRYLOCK",
    "name": "Fairy Lock",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "By locking down the battlefield, the user keeps all Pokémon from fleeing during the next turn.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "brilho_feerico",
      "theme": "Brilho Feérico Encantado"
    }
  },
  "588": {
    "id": 588,
    "internalName": "KINGSSHIELD",
    "name": "King's Shield",
    "type": "Steel",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user takes a defensive stance while it protects itself from damage. It also harshly lowers the Attack stat of any attacker who makes direct contact.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -2,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Escudo de contorno pixelado, hexágonos ou espinhos ao redor do usuário; brilho forte apenas na ativação.",
      "animation": "Escudo aparece em 2--3 etapas, pisca quando bloqueia e desaparece ao fim da janela de proteção.",
      "combat": "Ativar a proteção em estado próprio com duração definida. Dano refletido só existe quando a regra do move o especificar.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "589": {
    "id": 589,
    "internalName": "PLAYNICE",
    "name": "Play Nice",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user and the target become friends, and the target loses its will to fight. This lowers the target's Attack stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "590": {
    "id": 590,
    "internalName": "CONFIDE",
    "name": "Confide",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user tells the target a secret, and the target loses its ability to concentrate. This lowers the target's Sp. Atk. stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "spAtk",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "591": {
    "id": 591,
    "internalName": "DIAMONDSTORM",
    "name": "Diamond Storm",
    "type": "Rock",
    "category": "Physical",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user whips up a storm of diamonds to damage opposing Pokémon. This may also raise the user’s Defense stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso. Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "592": {
    "id": 592,
    "internalName": "STEAMERUPTION",
    "name": "Steam Eruption",
    "type": "Water",
    "category": "Special",
    "power": 110,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "explosion",
    "description": "The user immerses the target in superheated steam. This may also leave the target with a burn.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Burst em camadas: núcleo branco/amarelo, anel externo colorido, fragmentos quadrados e fumaça em blocos. A forma deve ser irregular, não um gradiente circular liso.",
      "animation": "Antecipação legível; expansão em 2--4 passos; frame de brilho máximo curto; dissipação em fumaça/brasas. Screen shake apenas no pico.",
      "combat": "Definir raio e instante único de dano. Golpes de autodestruição devem resolver o nocaute do usuário pela regra de combate, não pela animação.",
      "rules": "Efeito secundário: executar somente quando o cálculo de chance do move confirmar sucesso."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "593": {
    "id": 593,
    "internalName": "HYPERSPACEHOLE",
    "name": "Hyperspace Hole",
    "type": "Psychic",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "Using a hyperspace hole, the user appears right next to the target and strikes. This also hits a target using Protect or Detect.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "594": {
    "id": 594,
    "internalName": "WATERSHURIKEN",
    "name": "Water Shuriken",
    "type": "Water",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 20,
    "priority": 1,
    "vfxFamily": "multihit",
    "description": "The user hits the target with throwing stars two to five times in a row. This move always goes first.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": [
        2,
        5
      ],
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Reutilizar o efeito principal do move em instâncias pequenas, alternando posição/ângulo e adicionando flashes discretos a cada acerto.",
      "animation": "Executar 2--5 impactos ou disparos com intervalo curto e consistente; cada hit tem seu próprio frame de contato e feedback.",
      "combat": "A quantidade de hits vem da regra do move. Evitar que uma única colisão gere todos os acertos; cada hit deve ter evento e aplicação de dano controlados.",
      "rules": "Múltiplos acertos: cada hit deve ter evento de colisão/dano próprio, respeitando a quantidade definida pela regra. Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "018-Water01.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 0,
      "endFrame": 3,
      "fps": 24,
      "key": "agua_bolhas",
      "theme": "Esguicho e Bolhas de Água"
    }
  },
  "595": {
    "id": 595,
    "internalName": "MYSTICALFIRE",
    "name": "Mystical Fire",
    "type": "Fire",
    "category": "Special",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user attacks by breathing a special, hot fire. This also lowers the target's Sp. Atk stat.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "spAtk",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Labareda de Fogo Incandescente"
    }
  },
  "596": {
    "id": 596,
    "internalName": "SPIKYSHIELD",
    "name": "Spiky Shield",
    "type": "Grass",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "In addition to protecting the user from attacks, this move also damages any attacker who makes direct contact.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Escudo de contorno pixelado, hexágonos ou espinhos ao redor do usuário; brilho forte apenas na ativação.",
      "animation": "Escudo aparece em 2--3 etapas, pisca quando bloqueia e desaparece ao fim da janela de proteção.",
      "combat": "Ativar a proteção em estado próprio com duração definida. Dano refletido só existe quando a regra do move o especificar.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "597": {
    "id": 597,
    "internalName": "AROMATICMIST",
    "name": "Aromatic Mist",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user raises the Sp. Def stat of an ally Pokémon with a mysterious aroma.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "spDef",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "598": {
    "id": 598,
    "internalName": "EERIEIMPULSE",
    "name": "Eerie Impulse",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user's body generates an eerie impulse. Exposing the target to it harshly lowers the target's Sp. Atk stat.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "spAtk",
          "stages": -2,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Onda / Pulso Noturno"
    }
  },
  "599": {
    "id": 599,
    "internalName": "VENOMDRENCH",
    "name": "Venom Drench",
    "type": "Poison",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "status",
    "description": "Opposing Pokémon are drenched in an odd poisonous liquid. This lowers the Attack, Sp. Atk, and Speed stats of a poisoned target.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "poison",
      "secondaryChance": 0.3,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "spAtk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "speed",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "600": {
    "id": 600,
    "internalName": "POWDER",
    "name": "Powder",
    "type": "Bug",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 1,
    "vfxFamily": "foliage",
    "description": "The user covers the target in a powder that explodes and damages the target if it uses a Fire-type move.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "601": {
    "id": 601,
    "internalName": "GEOMANCY",
    "name": "Geomancy",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user absorbs energy and sharply raises its Sp. Atk, Sp. Def, and Speed stats on the next turn.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "spAtk",
          "stages": 2,
          "target": "self"
        },
        {
          "stat": "spDef",
          "stages": 2,
          "target": "self"
        },
        {
          "stat": "speed",
          "stages": 2,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "602": {
    "id": 602,
    "internalName": "MAGNETICFLUX",
    "name": "Magnetic Flux",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "The user manipulates magnetic fields which raises the Defense and Sp. Def stats of ally Pokémon with the Plus or Minus Ability.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "def",
          "stages": 1,
          "target": "self"
        },
        {
          "stat": "spDef",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Corte Metálico de Aço"
    }
  },
  "603": {
    "id": 603,
    "internalName": "HAPPYHOUR",
    "name": "Happy Hour",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "vfxFamily": "status",
    "description": "Using Happy Hour doubles the amount of prize money received after battle.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "604": {
    "id": 604,
    "internalName": "ELECTRICTERRAIN",
    "name": "Electric Terrain",
    "type": "Electric",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user electrifies the ground under everyone's feet for five turns. Pokémon on the ground no longer fall asleep.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "sleep",
      "secondaryChance": 1
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Área/múltiplos alvos: calcular os alvos elegíveis pela área e regras do combate, sem duplicar dano."
    },
    "visual": {
      "file": "017-Thunder01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 5,
      "fps": 24,
      "key": "raio_eletrico",
      "theme": "Relâmpago / Descarga Elétrica"
    }
  },
  "605": {
    "id": 605,
    "internalName": "DAZZLINGGLEAM",
    "name": "Dazzling Gleam",
    "type": "Fairy",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "psychic",
    "description": "The user damages opposing Pokémon by emitting a powerful flash.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Anéis concêntricos, losangos e orbes com núcleo branco e aura magenta, violeta, rosa ou dourada, conforme o golpe. Partículas orbitais pequenas.",
      "animation": "Carga com pulsação de escala; liberação em onda, orbe ou explosão; distorção curta no alvo e desaparecimento por etapas.",
      "combat": "Definir explicitamente se o efeito persegue, viaja em linha, explode em área ou apenas envolve o usuário. Buffs e debuffs são resolvidos pela lógica de combate.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "brilho_feerico",
      "theme": "Brilho Feérico Encantado"
    }
  },
  "606": {
    "id": 606,
    "internalName": "CELEBRATE",
    "name": "Celebrate",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The Pokémon congratulates you on your special day!",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "607": {
    "id": 607,
    "internalName": "HOLDHANDS",
    "name": "Hold Hands",
    "type": "Normal",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "status",
    "description": "The user and an ally hold hands. This makes them very happy.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "608": {
    "id": 608,
    "internalName": "BABYDOLLEYES",
    "name": "Baby-Doll Eyes",
    "type": "Fairy",
    "category": "Status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "vfxFamily": "status",
    "description": "The user stares at the target with its baby-doll eyes, which lowers its Attack stat. This move always goes first.",
    "executionType": "buff",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Aura, ícones e símbolos simples associados ao efeito: estrelas para confusão, Zs para sono, anéis elétricos para paralisia, névoa para redução de atributos, brilho suave para cura.",
      "animation": "Aplicar uma pose curta no usuário; viajar até o alvo apenas se a descrição sugerir um projétil; mostrar feedback visual de aplicação e depois manter um overlay discreto quando o status for persistente.",
      "combat": "Priorizar a consequência descrita: cura, buff, debuff, aprisionamento, clima, proteção ou status. Não criar dano visual se o move não causa dano.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Prioridade: o VFX não altera ordem de execução; respeitar a prioridade definida na lógica."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "609": {
    "id": 609,
    "internalName": "NUZZLE",
    "name": "Nuzzle",
    "type": "Electric",
    "category": "Physical",
    "power": 20,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The user attacks by nuzzling its electrified cheeks against the target. This also leaves the target with paralysis.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": "paralysis",
      "secondaryChance": 0.3
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "610": {
    "id": 610,
    "internalName": "HOLDBACK",
    "name": "Hold Back",
    "type": "Normal",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "vfxFamily": "impact",
    "description": "The user holds back when it attacks and the target is left with at least 1 HP.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Flash de contato em forma de estrela angular, linhas radiais curtas e fragmentos claros/escuros. A forma deve combinar com a direção do golpe.",
      "animation": "Antecipação curta, deslocamento ou golpe de contato, frame de impacto de 1--3 quadros e recuperação. Um pequeno empurrão pode acompanhar o hit.",
      "combat": "Usar hitbox de contato ou alcance curto. Knockback e hitstun são parametrizados e não devem depender do número de partículas.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "611": {
    "id": 611,
    "internalName": "INFESTATION",
    "name": "Infestation",
    "type": "Bug",
    "category": "Special",
    "power": 20,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "foliage",
    "description": "The target is infested and attacked for four to five turns. The target can't flee during this time.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Folhas com silhueta serrilhada, sementes compactas, vinhas segmentadas ou nuvem de esporos em tons de verde e amarelo. A rotação deve ser discreta e quantizada.",
      "animation": "Folhas e sementes podem ser disparadas em leque ou sequência; vinhas crescem do chão/alvo; esporos dispersam lentamente e somem em fade por degraus de opacidade.",
      "combat": "Usar projétil para objetos lançados e volume/área para nuvens e vinhas. Aplicar efeitos secundários após a validação do acerto.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "grass.png",
      "cols": 5,
      "rows": 5,
      "startFrame": 5,
      "endFrame": 7,
      "fps": 24,
      "key": "folhas_vinha",
      "theme": "Rede de Seda / Esporos de Inseto"
    }
  },
  "612": {
    "id": 612,
    "internalName": "POWERUPPUNCH",
    "name": "Power-Up Punch",
    "type": "Fighting",
    "category": "Physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "Striking opponents over and over makes the user's fists harder. Hitting a target raises the Attack stat.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": 1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  },
  "613": {
    "id": 613,
    "internalName": "OBLIVIONWING",
    "name": "Oblivion Wing",
    "type": "Flying",
    "category": "Special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "projectile",
    "description": "The user absorbs its target's HP. The user's HP is restored by over half of the damage taken by the target.",
    "executionType": "projectile",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Criar um sprite de projétil pixelado com contorno escuro, volume de 2--4 tons e brilho especular pequeno. O projétil deve ser claramente separado do sprite do usuário.",
      "animation": "Antecipação curta (80--160 ms); spawn próximo à origem do atacante; deslocamento até o alvo com rotação alinhada à trajetória; impacto de 100--220 ms com burst de pixels.",
      "combat": "Colisão por hitbox simples durante o percurso. Ao acertar, consumir o projétil e emitir evento de impacto; ao exceder alcance ou tempo de vida, removê-lo sem causar dano.",
      "rules": "Cura: atualizar HP pela regra do move e comunicar o valor efetivamente restaurado."
    },
    "visual": {
      "file": "Wind1.png",
      "cols": 5,
      "rows": 3,
      "startFrame": 8,
      "endFrame": 12,
      "fps": 24,
      "key": "vento_cortante",
      "theme": "Lâminas Cortantes de Vento"
    }
  },
  "614": {
    "id": 614,
    "internalName": "THOUSANDARROWS",
    "name": "Thousand Arrows",
    "type": "Ground",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "This move also hits opposing Pokémon that are in the air. Those Pokémon are knocked down to the ground.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "615": {
    "id": 615,
    "internalName": "THOUSANDWAVES",
    "name": "Thousand Waves",
    "type": "Ground",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user attacks with a wave that crawls along the ground. Those hit can't flee from battle.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Persistência/controle: criar estado com duração e condição de remoção; não manter apenas uma animação repetindo."
    },
    "visual": {
      "file": "Earth1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "terremoto_pedra",
      "theme": "Tremor Sísmico e Rochas"
    }
  },
  "616": {
    "id": 616,
    "internalName": "LANDSWRATH",
    "name": "Land's Wrath",
    "type": "Ground",
    "category": "Physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "ground",
    "description": "The user gathers the energy of the land and focuses that power on opposing Pokémon to damage them.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Rachaduras, poeira, fragmentos e formas angulares que emergem do chão. Usar pixels duros, sombra projetada e variação de escala; evitar partículas circulares lisas.",
      "animation": "Aviso no chão por 120--250 ms; erupção em sequência ou simultânea; pico de impacto com tremor proporcional; fragmentos caem e desaparecem.",
      "combat": "Definir uma ou mais zonas de impacto no terreno. Aplicar dano apenas dentro das zonas no frame de ativação; persistência/armadilhas ficam separadas do dano inicial.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "617": {
    "id": 617,
    "internalName": "LIGHTOFRUIN",
    "name": "Light of Ruin",
    "type": "Fairy",
    "category": "Special",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "Drawing power from the Eternal Flower, the user fires a powerful beam of light. This also damages the user quite a lot.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0.25,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. Custo/recuo: resolver o dano ao usuário conforme a regra de combate, sem depender do VFX."
    },
    "visual": {
      "file": "003-Attack01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "impacto_fisico",
      "theme": "Impacto Físico (Estrela Branca)"
    }
  },
  "618": {
    "id": 618,
    "internalName": "ORIGINPULSE",
    "name": "Origin Pulse",
    "type": "Water",
    "category": "Special",
    "power": 110,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "beam",
    "description": "The user attacks opposing Pokémon with countless beams of light that glow a deep and brilliant blue.",
    "executionType": "beam",
    "combatBehavior": {
      "isContact": false,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Feixe ou fluxo direcionado com núcleo claro, borda colorida e pequenas partículas. Para ondas sonoras, usar anéis/linhas de distorção; para sopros, partículas em leque.",
      "animation": "Carregamento breve quando apropriado; emitir feixe por duração configurável ou disparar onda curta; animar brilho e largura em pulsos sem suavização bilinear.",
      "combat": "Pode ser instantâneo, contínuo ou em pulso, conforme a descrição. Verificar colisão ao longo do feixe/volume durante sua janela ativa e encerrar ao fim da duração.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "023-Burst01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 4,
      "endFrame": 7,
      "fps": 24,
      "key": "pulso_psiquico",
      "theme": "Onda / Pulso Noturno"
    }
  },
  "619": {
    "id": 619,
    "internalName": "PRECIPICEBLADES",
    "name": "Precipice Blades",
    "type": "Ground",
    "category": "Physical",
    "power": 120,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "vfxFamily": "slash",
    "description": "The user attacks opposing Pokémon by manifesting the power of the land in fearsome blades of stone.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0
    },
    "spec": {
      "vfx": "Arco ou risco angular de 2--4 pixels de espessura, com núcleo claro e borda na cor do tipo. Para cortes cruzados, desenhar dois arcos diagonais em sequência.",
      "animation": "Antecipação com recuo do corpo; golpe rápido em 80--140 ms; manter o risco por poucos frames e finalizar com pequeno flash no alvo.",
      "combat": "Ataque de curta distância orientado para o alvo/direção. Aplicar um único hit por janela de ataque, salvo quando a descrição indicar múltiplos golpes.",
      "rules": "Resolver acerto, dano e eventuais efeitos secundários na lógica de combate; VFX apenas apresenta o resultado."
    },
    "visual": {
      "file": "Ice1.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 8,
      "fps": 24,
      "key": "gelo_nevasca",
      "theme": "Nevasca e Estilhaços de Gelo"
    }
  },
  "620": {
    "id": 620,
    "internalName": "DRAGONASCENT",
    "name": "Dragon Ascent",
    "type": "Dragon",
    "category": "Physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "stat_change",
    "description": "After soaring upward, the user attacks its target by dropping out of the sky at high speeds, although it lowers its own Defense and Sp. Def in the process.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": false,
      "secondaryStatus": null,
      "secondaryChance": 0,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "def",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "spDef",
          "stages": -1,
          "target": "target"
        },
        {
          "stat": "speed",
          "stages": -1,
          "target": "target"
        }
      ]
    },
    "spec": {
      "vfx": "Setas, linhas ascendentes, símbolos e aura curta envolvendo o Pokémon. Diferenciar visualmente aumento, redução e proteção, mantendo consistência entre golpes.",
      "animation": "Efeito surge abaixo ou ao redor do Pokémon, sobe em 2--3 pulsos e termina com um flash pequeno; não deve esconder o sprite.",
      "combat": "Atualizar atributos pela lógica de combate e exibir o resultado confirmado. Não aumentar estatísticas apenas pela duração da animação.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada."
    },
    "visual": {
      "file": "015-Fire01.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 4,
      "fps": 24,
      "key": "fogo_labareda",
      "theme": "Sopro Dracônico Incandescente"
    }
  },
  "621": {
    "id": 621,
    "internalName": "HYPERSPACEFURY",
    "name": "Hyperspace Fury",
    "type": "Dark",
    "category": "Physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "vfxFamily": "multihit",
    "description": "Using its many arms, the user unleashes a barrage of attacks that ignore the effects of moves like Protect and Detect. This attack lowers the user's Defense.",
    "executionType": "dash",
    "combatBehavior": {
      "isContact": true,
      "critStage": 0,
      "multiHit": null,
      "drainPercent": 0,
      "recoilPercent": 0,
      "healPercent": 0,
      "isBarrier": true,
      "secondaryStatus": "burn",
      "secondaryChance": 0.3,
      "statChanges": [
        {
          "stat": "atk",
          "stages": -1,
          "target": "self"
        },
        {
          "stat": "def",
          "stages": -1,
          "target": "self"
        },
        {
          "stat": "speed",
          "stages": -1,
          "target": "self"
        }
      ]
    },
    "spec": {
      "vfx": "Reutilizar o efeito principal do move em instâncias pequenas, alternando posição/ângulo e adicionando flashes discretos a cada acerto.",
      "animation": "Executar 2--5 impactos ou disparos com intervalo curto e consistente; cada hit tem seu próprio frame de contato e feedback.",
      "combat": "A quantidade de hits vem da regra do move. Evitar que uma única colisão gere todos os acertos; cada hit deve ter evento e aplicação de dano controlados.",
      "rules": "Atributos: atualizar estágios/valores no sistema de combate; a animação deve refletir a mudança confirmada. ## 7. Contrato sugerido para cada definição de VFX Cada move deve apontar para uma definição declarativa, evitando `if/else` gigante pelo nome: ``` ts type VfxKind = | 'projectile' | 'slash' | 'bite' | 'beam' | 'dash' | 'terrain' | 'nature' | 'fire' | 'water' | 'ice' | 'electric' | 'psychic' | 'dark' | 'explosion' | 'multi' | 'status' | 'heal' | 'buff' | 'impact'; interface MoveVfxDefinition { moveId: number; kind: VfxKind; asset?: string; startFrame?: number; endFrame?: number; fps?: number; durationMs: number; projectile?: { speed: number; maxDistance: number; hitRadius: number }; area?: { radius: number; telegraphMs: number }; impact?: { particles: number; shake: number; decal?: 'scorch' | 'wet' | 'zap_burn' | 'crack' }; layers: Array<'anticipation' | 'execution' | 'impact' | 'residual' | 'status'>; } ``` ## 8. Critérios de aceite -   Cada move cadastrado tem família visual e sequência de animação definidas. -   Nenhum VFX aplica dano, cura ou status diretamente. -   Os moves multi-hit mostram cada hit separadamente. -   Moves de área exibem área/telegraph legível antes do dano quando necessário. -   Moves de status/cura/buff não recebem explosão ofensiva genérica por padrão. -   Os efeitos respeitam pixel art, `imageSmoothingEnabled = false`, limites de partículas e limpeza de cena. -   Em 60 FPS, vários efeitos simultâneos não criam crescimento ilimitado de objetos ou partículas. ## 9. Nota sobre precisão Este documento propõe direção visual e comportamento técnico para os moves, não afirma que todas as animações estão já implementadas nem que os spritesheets existentes representam fielmente cada golpe. Para fidelidade maior, validar cada entrada contra o asset real e ajustar os frames após inspeção visual."
    },
    "visual": {
      "file": "004-Attack02.png",
      "cols": 5,
      "rows": 2,
      "startFrame": 0,
      "endFrame": 6,
      "fps": 22,
      "key": "cortes_marciais",
      "theme": "Golpe Marcial / Garras e Punhos"
    }
  }
};

export const MOVES_BY_NAME = {};
export const MOVES_BY_INTERNAL = {};

for (const id in MOVES_BY_ID) {
  const move = MOVES_BY_ID[id];
  if (move.name) MOVES_BY_NAME[move.name.toLowerCase()] = move;
  if (move.internalName) MOVES_BY_INTERNAL[move.internalName.toUpperCase()] = move;
}

export function getMoveData(identifier) {
  if (!identifier) return null;
  if (typeof identifier === 'number') return MOVES_BY_ID[identifier] || null;
  if (typeof identifier === 'object') {
    const id = identifier.moveId || identifier.id;
    if (id && MOVES_BY_ID[id]) return MOVES_BY_ID[id];
    const name = identifier.name || identifier.internalName;
    if (name) return getMoveData(name);
    return null;
  }
  const str = String(identifier).trim();
  const num = parseInt(str, 10);
  if (!isNaN(num) && MOVES_BY_ID[num]) return MOVES_BY_ID[num];
  const byName = MOVES_BY_NAME[str.toLowerCase()];
  if (byName) return byName;
  const byInternal = MOVES_BY_INTERNAL[str.toUpperCase()];
  if (byInternal) return byInternal;
  return null;
}
