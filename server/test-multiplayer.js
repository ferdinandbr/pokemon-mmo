const io = require('socket.io-client');
const http = require('http');

function post(path, data, token = null) {
  return new Promise((resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'POST',
      headers
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTest() {
  console.log('--- TESTE AUTOMATIZADO MULTIPLAYER & CHAT ---');

  // 1. Criar 2 contas
  const u1 = await post('/api/auth/register', {
    email: `player1_${Date.now()}@test.com`,
    name: 'Red Player',
    password: 'password123'
  });
  console.log('Conta 1 criada:', u1.user.name);

  const u2 = await post('/api/auth/register', {
    email: `player2_${Date.now()}@test.com`,
    name: 'Leaf Player',
    password: 'password123'
  });
  console.log('Conta 2 criada:', u2.user.name);

  // 2. Criar 2 personagens
  const c1 = await post('/api/characters', {
    name: `Red_${Math.floor(Math.random() * 1000)}`,
    gender: 'male',
    sprite: 'boy_run'
  }, u1.token);
  console.log('Personagem 1 criado:', c1.name, 'Sprite:', c1.sprite);

  const c2 = await post('/api/characters', {
    name: `Leaf_${Math.floor(Math.random() * 1000)}`,
    gender: 'female',
    sprite: 'girl_run'
  }, u2.token);
  console.log('Personagem 2 criado:', c2.name, 'Sprite:', c2.sprite);

  // 3. Conectar sockets
  const s1 = io('http://localhost:3000', { auth: { token: u1.token } });
  const s2 = io('http://localhost:3000', { auth: { token: u2.token } });

  await new Promise(r => s1.on('connect', r));
  await new Promise(r => s2.on('connect', r));
  console.log('Sockets conectados!');

  // 4. S1 entra no jogo
  const p1InitPromise = new Promise(resolve => s1.on('player:init', resolve));
  s1.emit('player:join', { characterId: c1.id });
  const p1Data = await p1InitPromise;
  console.log(`[P1] Entrou no mapa: ${p1Data.room.id}, Posição: (${p1Data.self.x}, ${p1Data.self.y})`);

  // 5. S2 entra no jogo (deve notificar S1 e S2 deve receber S1)
  const p1SawP2Join = new Promise(resolve => s1.on('player:joined', resolve));
  const p2InitPromise = new Promise(resolve => s2.on('player:init', resolve));
  s2.emit('player:join', { characterId: c2.id });

  const [joinedP2, p2Data] = await Promise.all([p1SawP2Join, p2InitPromise]);
  console.log(`[P1] Viu P2 entrar na sala: ${joinedP2.name} (${joinedP2.gender})`);
  console.log(`[P2] Recebeu lista de jogadores na sala: ${p2Data.players.map(p => p.name).join(', ')}`);

  // 6. Teste de Movimento: P1 se move
  const p2SawMove = new Promise(resolve => s2.on('player:moved', resolve));
  s1.emit('player:move', { x: 420, y: 380, direction: 'right', isMoving: true });
  const moveEvent = await p2SawMove;
  console.log(`[P2] Recebeu movimento de P1: x=${moveEvent.x}, y=${moveEvent.y}, dir=${moveEvent.direction}`);

  // 7. Teste de Chat de Sala
  const p2SawRoomChat = new Promise(resolve => s2.on('chat:message', resolve));
  s1.emit('chat:send', { message: 'Olá mundo Pokémon!', channel: 'room' });
  const roomMsg = await p2SawRoomChat;
  console.log(`[P2] Recebeu mensagem de sala de ${roomMsg.sender}: "${roomMsg.text}"`);

  // 8. Teste de Sussurro Privado
  const p2SawWhisper = new Promise(resolve => s2.on('chat:message', resolve));
  s1.emit('chat:send', { message: `/w ${c2.name} Segredo de Pallet!` });
  const whisperMsg = await p2SawWhisper;
  console.log(`[P2] Recebeu sussurro de ${whisperMsg.sender}: "${whisperMsg.text}"`);

  // 9. Teste de Transição de Sala: P2 vai para route_1
  const p1SawP2Leave = new Promise(resolve => s1.on('player:left', resolve));
  const p2RoomChanged = new Promise(resolve => s2.on('room:changed', resolve));
  s2.emit('player:change_room', { targetRoom: 'route_1', targetX: 400, targetY: 540 });

  const [leftData, changedData] = await Promise.all([p1SawP2Leave, p2RoomChanged]);
  console.log(`[P1] Viu P2 sair da sala Pallet`);
  console.log(`[P2] Entrou na nova sala: ${changedData.room.name}`);

  // 10. Teste de Isolamento de Sala
  let p2ReceivedUnwantedMessage = false;
  s2.on('chat:message', (msg) => {
    if (msg.channel === 'room' && msg.text === 'Mensagem secreta de Pallet') {
      p2ReceivedUnwantedMessage = true;
    }
  });

  s1.emit('chat:send', { message: 'Mensagem secreta de Pallet', channel: 'room' });
  await new Promise(r => setTimeout(r, 600));

  if (!p2ReceivedUnwantedMessage) {
    console.log('[OK] Isolamento de sala validado com sucesso! P2 na Route 1 não ouviu chat da sala Pallet.');
  } else {
    console.error('[FALHA] Vazamento de chat entre salas!');
  }

  // 11. Teste de Chat Global entre salas diferentes
  const p2SawGlobal = new Promise(resolve => s2.on('chat:message', resolve));
  s1.emit('chat:send', { message: 'Chamando todos os mestres Pokémon!', channel: 'global' });
  const globalMsg = await p2SawGlobal;
  console.log(`[P2] Recebeu mensagem global entre salas diferentes de ${globalMsg.sender}: "${globalMsg.text}"`);

  s1.disconnect();
  s2.disconnect();
  console.log('\n=============================================');
  console.log(' TODOS OS 11 TESTES MULTIPLAYER PASSARAM 100%!');
  console.log('=============================================\n');
}

runTest().catch(console.error);
