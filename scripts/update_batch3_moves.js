import fs from 'fs';

const dbPath = 'client/src/battle/movesDatabase.js';
let content = fs.readFileSync(dbPath, 'utf8');

function updateMove(id, nextId, updater) {
  const mTag = `"${id}": {`;
  const nextTag = `"${nextId}": {`;
  const start = content.indexOf(mTag);
  const end = content.indexOf(nextTag, start);
  if (start === -1 || end === -1) {
    console.error(`Could not find move ${id} or ${nextId}`);
    return;
  }
  let section = content.substring(start, end);
  section = updater(section);
  content = content.substring(0, start) + section + content.substring(end);
}

// 94 Sacred Sword -> isRedHorn
updateMove(94, 95, (s) => {
  return s.replace(
    '"scale": 0.5',
    '"scale": 0.5,\r\n      "isRedHorn": true,\r\n      "hornColor": "#EF4444"'
  );
});

// 95 Secret Sword -> isRedHorn
updateMove(95, 96, (s) => {
  return s.replace(
    '"scale": 0.5',
    '"scale": 0.5,\r\n      "isRedHorn": true,\r\n      "hornColor": "#EF4444"'
  );
});

// 96 Sky Uppercut -> isUppercut
updateMove(96, 97, (s) => {
  s = s.replace(
    '"multiHit": null,',
    '"multiHit": null,\r\n      "isUppercut": true,'
  );
  return s.replace(
    '"scale": 0.5',
    '"scale": 0.5,\r\n      "isUppercut": true'
  );
});

// 99 Drain Punch -> isDrainPunch, reversed
updateMove(99, 100, (s) => {
  s = s.replace(
    '"drainPercent": 0.5,',
    '"drainPercent": 0.5,\r\n      "isDrainPunch": true,'
  );
  return s.replace(
    '"scale": 0.5',
    '"scale": 0.5,\r\n      "reversed": true,\r\n      "isDrainPunch": true'
  );
});

// 112 Double Kick -> isDoubleKick, 2 impactos
updateMove(112, 113, (s) => {
  s = s.replace(
    '"multiHit": [2,2],',
    '"multiHit": [2,2],\r\n      "isDoubleKick": true,'
  );
  return s.replace(
    '"scale": 0.5',
    '"scale": 0.5,\r\n      "isDoubleKick": true,\r\n      "multiHit": 2'
  );
});

// 114 Triple Kick -> isTripleKick, 3 impactos
updateMove(114, 115, (s) => {
  s = s.replace(
    '"multiHit": [3,3],',
    '"multiHit": [3,3],\r\n      "isTripleKick": true,'
  );
  return s.replace(
    '"scale": 0.5',
    '"scale": 0.5,\r\n      "isTripleKick": true,\r\n      "multiHit": 3'
  );
});

// 115 Counter -> isCounter
updateMove(115, 116, (s) => {
  s = s.replace(
    '"executionType": "dash",',
    '"executionType": "buff",'
  );
  s = s.replace(
    '"isBarrier": false,',
    '"isBarrier": true,\r\n      "isCounter": true,'
  );
  return s.replace(
    '"scale": 0.5',
    '"scale": 0.5,\r\n      "isCounter": true'
  );
});

// 560 Flying Press -> isFlyingPress
updateMove(560, 561, (s) => {
  s = s.replace(
    '"multiHit": null,',
    '"multiHit": null,\r\n      "isFlyingPress": true,'
  );
  return s.replace(
    '"scale": 0.5',
    '"scale": 0.5,\r\n      "isFlyingPress": true'
  );
});

fs.writeFileSync(dbPath, content, 'utf8');
console.log('Successfully updated all 8 moves in movesDatabase.js!');
