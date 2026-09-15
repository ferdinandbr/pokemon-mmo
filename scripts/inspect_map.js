const fs = require('fs');
const map = JSON.parse(fs.readFileSync('client/public/assets/maps/pallet_town.json', 'utf8'));
console.log('Map size:', map.width + 'x' + map.height, 'tiles,', map.tilewidth + 'x' + map.tileheight + 'px each');
console.log('Total pixels:', (map.width * map.tilewidth) + 'x' + (map.height * map.tileheight));
console.log('\nTilesets:');
map.tilesets.forEach(ts => console.log(' - ' + ts.name + ' | image: ' + ts.image + ' | firstgid: ' + ts.firstgid));
console.log('\nLayers:');
map.layers.forEach(l => {
  if (l.type === 'tilelayer') {
    const nonZero = (l.data || []).filter(v => v !== 0).length;
    console.log('[tile] ' + l.name + ' - ' + nonZero + ' non-empty tiles');
  } else {
    console.log('[object] ' + l.name + ' - ' + (l.objects || []).length + ' objects');
  }
});
