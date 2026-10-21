const fs = require('fs');

const filePath = 'client/src/battle/movesDatabase.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. burst_of_ice.png: cols 1, rows 7, startFrame 0, endFrame 6
content = content.replace(
  /"file":\s*"vfx\/ice\/burst_of_ice\.png",\s*"cols":\s*8,\s*"rows":\s*1,\s*"startFrame":\s*0,\s*"endFrame":\s*7/g,
  '"file": "vfx/ice/burst_of_ice.png",\n      "cols": 1,\n      "rows": 7,\n      "startFrame": 0,\n      "endFrame": 6'
);

// 2. ball_of_ice.png: cols 1, rows 4, startFrame 0, endFrame 3
content = content.replace(
  /"file":\s*"vfx\/ice\/ball_of_ice\.png",\s*"cols":\s*8,\s*"rows":\s*1,\s*"startFrame":\s*0,\s*"endFrame":\s*7/g,
  '"file": "vfx/ice/ball_of_ice.png",\n      "cols": 1,\n      "rows": 4,\n      "startFrame": 0,\n      "endFrame": 3'
);

// 3. magic_mirror.png: cols 1, rows 5, startFrame 0, endFrame 4
content = content.replace(
  /"file":\s*"vfx\/magic\/magic_mirror\.png",\s*"cols":\s*8,\s*"rows":\s*1,\s*"startFrame":\s*0,\s*"endFrame":\s*7/g,
  '"file": "vfx/magic/magic_mirror.png",\n      "cols": 1,\n      "rows": 5,\n      "startFrame": 0,\n      "endFrame": 4'
);

// 4. acid_vfx_02_repeatable.png: cols 1, rows 6, startFrame 0, endFrame 5
content = content.replace(
  /"file":\s*"vfx\/acid\/acid_vfx_02_repeatable\.png",\s*"cols":\s*8,\s*"rows":\s*1,\s*"startFrame":\s*0,\s*"endFrame":\s*7/g,
  '"file": "vfx/acid/acid_vfx_02_repeatable.png",\n      "cols": 1,\n      "rows": 6,\n      "startFrame": 0,\n      "endFrame": 5'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched vertical spritesheets in movesDatabase.js!');
