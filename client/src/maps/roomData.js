export const ROOMS_CONFIG = {
  pallet_town: {
    id: 'pallet_town',
    name: 'Pallet Town',
    width: 2128,
    height: 5440,
    tilemap: 'kanto_world',
    tilesets: [
      { name: 'spz3zUx_small', imageKey: 'spz3zUx_small' }
    ],
    backgroundColor: '#70b860',
    theme: 'outdoor',
    defaultSpawn: { x: 1064, y: 3336 },
    portals: [
      {
        targetRoom: 'ash_house',
        trigger: { x: 1024, y: 3312, width: 16, height: 16 },
        targetSpawn: { x: 400, y: 480 },
        label: 'Casa do Red 🚪'
      },
      {
        targetRoom: 'rival_house',
        trigger: { x: 1168, y: 3312, width: 16, height: 16 },
        targetSpawn: { x: 400, y: 480 },
        label: 'Casa do Blue 🚪'
      },
      {
        targetRoom: 'oak_lab',
        trigger: { x: 1216, y: 3456, width: 16, height: 16 },
        targetSpawn: { x: 400, y: 480 },
        label: 'Lab. Pokémon 🚪'
      }
    ],
    obstacles: [
      // Ash House (Col 11..15, Row 3..7)
      { x: 352, y: 96, width: 160, height: 128 },
      { x: 352, y: 224, width: 32, height: 32 },
      { x: 416, y: 224, width: 96, height: 32 },
      // Rival House (Col 20..24, Row 3..7)
      { x: 640, y: 96, width: 160, height: 128 },
      { x: 640, y: 224, width: 32, height: 32 },
      { x: 704, y: 224, width: 96, height: 32 },
      // Oak Lab (Col 19..25, Row 9..13)
      { x: 608, y: 288, width: 224, height: 128 },
      { x: 608, y: 416, width: 96, height: 32 },
      { x: 736, y: 416, width: 96, height: 32 },
      // Borders & Trees
      { x: 0, y: 0, width: 576, height: 64 },
      { x: 640, y: 0, width: 512, height: 64 },
      { x: 0, y: 64, width: 64, height: 576 },
      { x: 1088, y: 64, width: 64, height: 576 },
      { x: 64, y: 576, width: 352, height: 64 },
      { x: 544, y: 576, width: 544, height: 64 },
      // Flower patch fence
      { x: 384, y: 352, width: 160, height: 16 }
    ],
    decorations: [],
    roads: []
  },

  route_1: {
    id: 'route_1',
    name: 'Route 1',
    width: 800,
    height: 600,
    backgroundColor: '#68ad58',
    theme: 'outdoor',
    portals: [
      {
        targetRoom: 'pallet_town',
        trigger: { x: 350, y: 570, width: 100, height: 30 },
        targetSpawn: { x: 608, y: 48 },
        label: 'PALLET TOWN ⬇'
      },
      {
        targetRoom: 'viridian_city',
        trigger: { x: 350, y: 0, width: 100, height: 30 },
        targetSpawn: { x: 400, y: 540 },
        label: 'VIRIDIAN CITY ⬆'
      }
    ],
    obstacles: [
      { x: 0, y: 0, width: 350, height: 32 },
      { x: 450, y: 0, width: 350, height: 32 },
      { x: 0, y: 0, width: 48, height: 600 },
      { x: 752, y: 0, width: 48, height: 600 },
      { x: 0, y: 568, width: 350, height: 32 },
      { x: 450, y: 568, width: 350, height: 32 },
      { x: 100, y: 200, width: 220, height: 24, type: 'ledge' },
      { x: 480, y: 340, width: 240, height: 24, type: 'ledge' }
    ],
    tallGrass: [
      { x: 100, y: 80, width: 200, height: 100 },
      { x: 500, y: 120, width: 200, height: 140 },
      { x: 120, y: 360, width: 200, height: 160 },
      { x: 500, y: 420, width: 200, height: 100 }
    ],
    roads: [
      { x: 360, y: 0, width: 80, height: 600 }
    ],
    decorations: [
      { type: 'sign', x: 320, y: 500, text: "Rota 1 - Pallet Town até Viridian City" }
    ]
  },

  viridian_city: {
    id: 'viridian_city',
    name: 'Viridian City',
    width: 800,
    height: 600,
    backgroundColor: '#72ba62',
    theme: 'outdoor',
    portals: [
      {
        targetRoom: 'route_1',
        trigger: { x: 350, y: 570, width: 100, height: 30 },
        targetSpawn: { x: 400, y: 50 },
        label: 'ROTA 1 ⬇'
      }
    ],
    obstacles: [
      { x: 0, y: 0, width: 800, height: 32 },
      { x: 0, y: 0, width: 32, height: 600 },
      { x: 768, y: 0, width: 32, height: 600 },
      { x: 0, y: 568, width: 350, height: 32 },
      { x: 450, y: 568, width: 350, height: 32 },
      { x: 140, y: 140, width: 180, height: 130, type: 'pokecenter', label: "Centro Pokémon" },
      { x: 480, y: 140, width: 160, height: 130, type: 'pokemart', label: "Poké Mart" },
      { x: 460, y: 350, width: 220, height: 140, type: 'gym', label: "Ginásio de Viridian" }
    ],
    roads: [
      { x: 360, y: 100, width: 80, height: 500 },
      { x: 100, y: 270, width: 600, height: 50 }
    ],
    decorations: [
      { type: 'sign', x: 320, y: 480, text: "Viridian City - A cidade eternamente verde!" }
    ]
  },

  // ─── INTERIORES ─────────────────────────────────────────────────────────────

  ash_house: {
    id: 'ash_house',
    name: 'Casa do Red',
    width: 800,
    height: 600,
    backgroundColor: '#c8a878',
    theme: 'indoor',
    portals: [
      {
        targetRoom: 'pallet_town',
        trigger: { x: 340, y: 545, width: 120, height: 55 },
        targetSpawn: { x: 400, y: 272 },
        label: 'SAÍDA 🚪'
      }
    ],
    obstacles: [
      // Walls
      { x: 0, y: 0, width: 800, height: 60 },
      { x: 0, y: 0, width: 60, height: 600 },
      { x: 740, y: 0, width: 60, height: 600 },
      // Bottom wall with door gap (340-460)
      { x: 0, y: 560, width: 340, height: 40 },
      { x: 460, y: 560, width: 340, height: 40 },
      // Furniture
      { x: 100, y: 80, width: 200, height: 64, type: 'bookshelf', label: 'Estante' },
      { x: 500, y: 80, width: 200, height: 64, type: 'bookshelf', label: 'Estante' },
      { x: 280, y: 200, width: 240, height: 80, type: 'lab_table', label: 'Cama do Red' },
      { x: 120, y: 380, width: 100, height: 120, type: 'computer', label: 'PC' }
    ],
    decorations: [
      { type: 'carpet', x: 250, y: 350, width: 300, height: 180 }
    ],
    roads: []
  },

  rival_house: {
    id: 'rival_house',
    name: 'Casa do Blue',
    width: 800,
    height: 600,
    backgroundColor: '#b8c8d8',
    theme: 'indoor',
    portals: [
      {
        targetRoom: 'pallet_town',
        trigger: { x: 340, y: 545, width: 120, height: 55 },
        targetSpawn: { x: 688, y: 272 },
        label: 'SAÍDA 🚪'
      }
    ],
    obstacles: [
      { x: 0, y: 0, width: 800, height: 60 },
      { x: 0, y: 0, width: 60, height: 600 },
      { x: 740, y: 0, width: 60, height: 600 },
      { x: 0, y: 560, width: 340, height: 40 },
      { x: 460, y: 560, width: 340, height: 40 },
      { x: 100, y: 80, width: 200, height: 64, type: 'bookshelf', label: 'Estante' },
      { x: 500, y: 80, width: 200, height: 64, type: 'bookshelf', label: 'Estante' },
      { x: 280, y: 200, width: 240, height: 80, type: 'lab_table', label: 'Cama do Blue' },
      { x: 580, y: 380, width: 100, height: 120, type: 'computer', label: 'PC' }
    ],
    decorations: [
      { type: 'carpet', x: 250, y: 350, width: 300, height: 180 }
    ],
    roads: []
  },

  oak_lab: {
    id: 'oak_lab',
    name: "Laboratório do Prof. Carvalho",
    width: 800,
    height: 600,
    backgroundColor: '#a88050',
    theme: 'indoor',
    portals: [
      {
        targetRoom: 'pallet_town',
        trigger: { x: 340, y: 545, width: 120, height: 55 },
        targetSpawn: { x: 720, y: 464 },
        label: 'SAÍDA 🚪'
      }
    ],
    obstacles: [
      // Walls
      { x: 0, y: 0, width: 800, height: 60 },
      { x: 0, y: 0, width: 60, height: 600 },
      { x: 740, y: 0, width: 60, height: 600 },
      { x: 0, y: 560, width: 340, height: 40 },
      { x: 460, y: 560, width: 340, height: 40 },
      // Bookshelves top
      { x: 120, y: 60, width: 240, height: 60, type: 'bookshelf', label: "Pesquisas Pokémon" },
      { x: 440, y: 60, width: 240, height: 60, type: 'bookshelf', label: "Pokédex Nacional" },
      // Research Table with Starter Pokeballs
      { x: 280, y: 220, width: 240, height: 80, type: 'lab_table', label: "Pokébolas Iniciais" },
      // Computers
      { x: 100, y: 340, width: 80, height: 120, type: 'computer', label: "Supercomputador" },
      { x: 620, y: 340, width: 80, height: 120, type: 'computer', label: "Analisador de Dados" }
    ],
    decorations: [
      { type: 'carpet', x: 300, y: 430, width: 200, height: 120 }
    ],
    roads: []
  }
};
