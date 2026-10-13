export const NPC_SPRITES = [
  { key: 'npc_oak', name: 'Prof. Carvalho', file: 'npc_oak.png', defaultType: 'starter_oak' },
  { key: 'npc_clerk', name: 'Atendente do Mart', file: 'npc_clerk.png', defaultType: 'shop' },
  { key: 'npc_nurse', name: 'Enfermeira Joy', file: 'npc_nurse.png', defaultType: 'dialogue' },
  { key: 'npc_scientist', name: 'Cientista do Lab', file: 'npc_scientist.png', defaultType: 'dialogue' },
  { key: 'npc_rocket_m', name: 'Equipe Rocket (M)', file: 'npc_rocket_m.png', defaultType: 'battle' },
  { key: 'npc_rocket_f', name: 'Equipe Rocket (F)', file: 'npc_rocket_f.png', defaultType: 'battle' },
  { key: 'npc_youngster', name: 'Treinador Youngster', file: 'npc_youngster.png', defaultType: 'battle' },
  { key: 'npc_lass', name: 'Treinadora Lass', file: 'npc_lass.png', defaultType: 'battle' },
  { key: 'npc_bug_catcher', name: 'Treinador Bug Catcher', file: 'npc_bug_catcher.png', defaultType: 'battle' },
  { key: 'npc_hiker', name: 'Montanhista (Hiker)', file: 'npc_hiker.png', defaultType: 'battle' },
  { key: 'npc_fat_guy', name: 'Civil (Robusto)', file: 'npc_fat_guy.png', defaultType: 'dialogue' },
  { key: 'npc_girl', name: 'Civil (Garota)', file: 'npc_girl.png', defaultType: 'dialogue' },
  { key: 'npc_old_man', name: 'Civil (Idoso)', file: 'npc_old_man.png', defaultType: 'dialogue' },
  { key: 'npc_boy', name: 'Civil (Garoto)', file: 'npc_boy.png', defaultType: 'dialogue' }
];

export const NPC_TYPES = [
  { id: 'dialogue', label: 'Diálogo', icon: '💬', description: 'Fala com o jogador ao interagir' },
  { id: 'battle', label: 'Batalha (Treinador/Bandido)', icon: '⚔️', description: 'Inicia combate por linha de visão ou interação direta' },
  { id: 'shop', label: 'Loja (Poké Mart)', icon: '🛒', description: 'Abre catálogo de compras de itens' },
  { id: 'starter_oak', label: 'Prof. Carvalho (Inicial)', icon: '🎓', description: 'Oferece a escolha do Pokémon inicial no Laboratório' }
];

export const DEFAULT_MART_ITEMS = [
  { id: 'poke-ball', name: 'Poké Ball', price: 200, icon: '/assets/items/poke-ball.png', desc: 'Dispositivo esférico para captura de Pokémon selvagens.' },
  { id: 'potion', name: 'Poção', price: 300, icon: '/assets/items/potion.png', desc: 'Medicamento em spray que restaura 20 HP de um Pokémon.' },
  { id: 'antidote', name: 'Antídoto', price: 100, icon: '/assets/items/antidote.png', desc: 'Cura um Pokémon do status de Envenenamento.' },
  { id: 'paralyze-heal', name: 'Cura Paralisa', price: 200, icon: '/assets/items/paralyze-heal.png', desc: 'Cura um Pokémon do status de Paralisia.' },
  { id: 'escape-rope', name: 'Corda de Fuga', price: 550, icon: '/assets/items/escape-rope.png', desc: 'Permite escapar instantaneamente de cavernas e dungeons.' }
];
