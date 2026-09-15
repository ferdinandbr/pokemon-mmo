const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../database');
const { JWT_SECRET } = require('../middleware/auth');

async function register({ email, name, password }) {
  if (!email || !name || !password) {
    throw new Error('Todos os campos (email, nome, senha) são obrigatórios.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  if (password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (existingUser) {
    throw new Error('Este email já está cadastrado.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: trimmedName,
      password: passwordHash
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true
    }
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      characters: {
        select: {
          id: true,
          name: true,
          gender: true,
          sprite: true,
          roomId: true,
          x: true,
          y: true,
          direction: true,
          money: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('Email ou senha incorretos.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Email ou senha incorretos.');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      characters: user.characters
    },
    token
  };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      characters: true
    }
  });

  return user;
}

module.exports = {
  register,
  login,
  getProfile
};
