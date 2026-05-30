import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        persona TEXT,
        personaImageUrl TEXT,
        clothing TEXT,
        tone TEXT,
        brandName TEXT,
        productName TEXT,
        description TEXT,
        productImageUrl TEXT,
        ctaLink TEXT,
        script TEXT,
        resultMediaUrl TEXT,
        status TEXT
      )
    `);
  }
});

export default db;