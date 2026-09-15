const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function run() {
  console.log('Testing Health...');
  const health = await request({ hostname: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
  console.log('Health Response:', health);

  console.log('\nTesting Register...');
  const reg = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'trainer@pallet.com', name: 'Ash Ketchum', password: 'secretpassword123' });
  console.log('Register status:', reg.status, 'User:', reg.data?.user?.email);

  const token = reg.data.token;

  console.log('\nTesting Character Creation...');
  const char = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/characters',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, { name: 'RedTrainer', gender: 'male', sprite: 'boy_run' });
  console.log('Char created:', char.data?.name, 'Room:', char.data?.roomId, 'Spawn:', char.data?.x, char.data?.y);
  console.log('Inventory slots count:', char.data?.inventory?.length);
  console.log('Pokedex count:', char.data?.pokedex?.length);
  console.log('Pokemon party count:', char.data?.pokemon?.length);

  console.log('\nTesting Character List...');
  const charList = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/characters',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Characters found:', charList.data?.map(c => c.name));
  console.log('\nAPI test passed successfully!');
}

run().catch(console.error);
