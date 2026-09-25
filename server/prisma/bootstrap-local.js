const path = require('path');
const bcrypt = require('bcryptjs');
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(path.join(__dirname, 'dev.db'));
db.exec(`
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS Character (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, name TEXT NOT NULL UNIQUE, gender TEXT NOT NULL DEFAULT 'male', sprite TEXT NOT NULL DEFAULT 'boy_run', roomId TEXT NOT NULL DEFAULT 'pallet_town', x REAL NOT NULL DEFAULT 320, y REAL NOT NULL DEFAULT 320, direction TEXT NOT NULL DEFAULT 'down', money INTEGER NOT NULL DEFAULT 5000, bagCapacity INTEGER NOT NULL DEFAULT 24, equipment TEXT DEFAULT '{}', hasCompletedIntro INTEGER NOT NULL DEFAULT 0, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL, FOREIGN KEY(userId) REFERENCES User(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS Item (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, category TEXT NOT NULL, description TEXT NOT NULL, price INTEGER NOT NULL DEFAULT 100, sprite TEXT);
CREATE TABLE IF NOT EXISTS InventorySlot (id INTEGER PRIMARY KEY AUTOINCREMENT, characterId INTEGER NOT NULL, itemId INTEGER NOT NULL, quantity INTEGER NOT NULL DEFAULT 1, slotIndex INTEGER NOT NULL, FOREIGN KEY(characterId) REFERENCES Character(id) ON DELETE CASCADE, FOREIGN KEY(itemId) REFERENCES Item(id), UNIQUE(characterId, slotIndex));
CREATE TABLE IF NOT EXISTS PokedexEntry (id INTEGER PRIMARY KEY AUTOINCREMENT, characterId INTEGER NOT NULL, pokemonNumber INTEGER NOT NULL, pokemonName TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'seen', caughtAt DATETIME, FOREIGN KEY(characterId) REFERENCES Character(id) ON DELETE CASCADE, UNIQUE(characterId, pokemonNumber));
CREATE TABLE IF NOT EXISTS PokemonSpecies (id INTEGER PRIMARY KEY, name TEXT NOT NULL, internalName TEXT NOT NULL, type1 TEXT NOT NULL, type2 TEXT, baseHp INTEGER NOT NULL, baseAttack INTEGER NOT NULL, baseDefense INTEGER NOT NULL, baseSpAtk INTEGER NOT NULL, baseSpDef INTEGER NOT NULL, baseSpeed INTEGER NOT NULL, genderRate TEXT NOT NULL DEFAULT 'Genderless', growthRate TEXT NOT NULL DEFAULT 'MediumFast', baseExp INTEGER NOT NULL DEFAULT 64, evolutions TEXT NOT NULL DEFAULT '[]', moves TEXT NOT NULL DEFAULT '[]');
CREATE TABLE IF NOT EXISTS MoveData (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, internalName TEXT NOT NULL UNIQUE, type TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'Physical', power INTEGER NOT NULL DEFAULT 0, accuracy INTEGER NOT NULL DEFAULT 100, pp INTEGER NOT NULL DEFAULT 35, description TEXT DEFAULT '');
CREATE TABLE IF NOT EXISTS Pokemon (id INTEGER PRIMARY KEY AUTOINCREMENT, characterId INTEGER NOT NULL, speciesId INTEGER NOT NULL, nickname TEXT, level INTEGER NOT NULL DEFAULT 5, exp INTEGER NOT NULL DEFAULT 0, gender TEXT NOT NULL DEFAULT 'M', isShiny INTEGER NOT NULL DEFAULT 0, currentHp INTEGER NOT NULL DEFAULT 20, maxHp INTEGER NOT NULL DEFAULT 20, ivHp INTEGER NOT NULL DEFAULT 15, ivAtk INTEGER NOT NULL DEFAULT 15, ivDef INTEGER NOT NULL DEFAULT 15, ivSpAtk INTEGER NOT NULL DEFAULT 15, ivSpDef INTEGER NOT NULL DEFAULT 15, ivSpeed INTEGER NOT NULL DEFAULT 15, evHp INTEGER NOT NULL DEFAULT 0, evAtk INTEGER NOT NULL DEFAULT 0, evDef INTEGER NOT NULL DEFAULT 0, evSpAtk INTEGER NOT NULL DEFAULT 0, evSpDef INTEGER NOT NULL DEFAULT 0, evSpeed INTEGER NOT NULL DEFAULT 0, stats TEXT NOT NULL DEFAULT '{}', moves TEXT NOT NULL DEFAULT '[]', location TEXT NOT NULL DEFAULT 'party', partySlot INTEGER DEFAULT 0, boxNumber INTEGER NOT NULL DEFAULT 1, boxSlot INTEGER NOT NULL DEFAULT 0, isBuddy INTEGER NOT NULL DEFAULT 0, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(characterId) REFERENCES Character(id) ON DELETE CASCADE, FOREIGN KEY(speciesId) REFERENCES PokemonSpecies(id));
INSERT INTO PokemonSpecies (id, name, internalName, type1, type2, baseHp, baseAttack, baseDefense, baseSpAtk, baseSpDef, baseSpeed, genderRate, growthRate, baseExp, evolutions, moves)
VALUES (25, 'Pikachu', 'PIKACHU', 'ELECTRIC', NULL, 35, 55, 40, 50, 50, 90, 'Female50Percent', 'MediumFast', 112, '[]', '[{"level":1,"moveInternalName":"THUNDERSHOCK"},{"level":1,"moveInternalName":"GROWL"}]')
ON CONFLICT(id) DO UPDATE SET name=excluded.name, internalName=excluded.internalName, type1=excluded.type1, baseHp=excluded.baseHp, baseAttack=excluded.baseAttack, baseDefense=excluded.baseDefense, baseSpAtk=excluded.baseSpAtk, baseSpDef=excluded.baseSpDef, baseSpeed=excluded.baseSpeed, moves=excluded.moves;
`);

const password = bcrypt.hashSync('123456', 10);
db.prepare(`
  INSERT INTO User (email, name, password, role)
  VALUES (?, ?, ?, 'admin')
  ON CONFLICT(email) DO UPDATE SET password = excluded.password, role = 'admin'
`).run('admin@admin', 'Administrador', password);

const user = db.prepare('SELECT id, email, name, role FROM User WHERE email = ?').get('admin@admin');
console.log(JSON.stringify(user));
db.close();
