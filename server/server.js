require('dotenv').config();
const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const prisma = require('./src/database');
const authRoutes = require('./src/routes/authRoutes');
const charRoutes = require('./src/routes/charRoutes');
const { verifySocketToken } = require('./src/middleware/auth');
const setupPlayerHandlers = require('./src/sockets/playerHandler');
const setupChatHandlers = require('./src/sockets/chatHandler');
const setupInventoryHandlers = require('./src/sockets/inventoryHandler');
const setupPokemonHandlers = require('./src/sockets/pokemonHandler');

const mapRoutes = require('./src/routes/mapRoutes');

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/characters', charRoutes);
app.use('/api/admin/map', mapRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve frontend SPA build in production (Dokploy / Docker)
const publicDir = path.resolve(__dirname, 'public');
const clientDistDir = path.resolve(__dirname, '../client/dist');
const staticDir = fs.existsSync(publicDir) ? publicDir : (fs.existsSync(clientDistDir) ? clientDistDir : null);

if (staticDir) {
  app.use(express.static(staticDir, { maxAge: '7d' }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(staticDir, 'index.html'));
  });
}

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) {
    return next(new Error('Autenticação necessária'));
  }

  const decoded = verifySocketToken(token);
  if (!decoded) {
    return next(new Error('Token inválido'));
  }

  socket.user = decoded;
  next();
});

const worldService = require('./src/services/worldService');

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log(`[Socket] Conexão estabelecida: ${socket.id} (Usuário ID: ${socket.user.userId})`);

  setupPlayerHandlers(io, socket);
  setupChatHandlers(io, socket);
  setupInventoryHandlers(io, socket);
  setupPokemonHandlers(io, socket);

  socket.on('error', (err) => {
    console.error(`[Socket Error] ${socket.id}:`, err);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(` Pokémon Fire Red MMO Server rodando na porta ${PORT}`);
  console.log(` PostgreSQL + Prisma ORM conectado`);
  console.log(`===========================================`);

  // Start authoritative Day/Night and Weather service
  worldService.init(io);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});
