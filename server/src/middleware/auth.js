const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pokemmo_ultra_secure_jwt_token_key_fire_red_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    req.user = user;
    next();
  });
}

function verifySocketToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  authenticateToken,
  verifySocketToken,
  JWT_SECRET
};
