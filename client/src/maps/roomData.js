export const ROOMS_CONFIG = {
  pallet_town: {
    id: 'pallet_town',
    name: 'Pallet Town',
    tilemapKey: 'pallet_town',
    width: 1152,
    height: 640,
    defaultSpawn: { x: 560, y: 272 },
    portals: [
      {
        targetRoom: 'route_1',
        trigger: { x: 576, y: 0, width: 64, height: 32 },
        targetSpawn: { x: 608, y: 1230 },
        label: 'Route 1'
      }
    ]
  },
  route_1: {
    id: 'route_1',
    name: 'Route 1',
    tilemapKey: 'route_1',
    width: 1408,
    height: 1280,
    defaultSpawn: { x: 608, y: 1230 },
    portals: [
      {
        targetRoom: 'pallet_town',
        trigger: { x: 576, y: 1248, width: 64, height: 32 },
        targetSpawn: { x: 608, y: 48 },
        label: 'Pallet Town'
      },
      {
        targetRoom: 'viridian_city',
        trigger: { x: 512, y: 0, width: 128, height: 32 },
        targetSpawn: { x: 400, y: 540 },
        label: 'Viridian City'
      }
    ]
  }
};

