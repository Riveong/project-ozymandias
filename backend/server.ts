import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Database setup
const db = new Database('database.sqlite');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS generations (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    prompt TEXT,
    imageUrl TEXT,
    videoUrl TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start a generation (Mock)
app.post('/api/generations', (req, res) => {
  const { prompt } = req.body;
  const id = Math.random().toString(36).substring(7);
  
  const stmt = db.prepare('INSERT INTO generations (id, status, prompt) VALUES (?, ?, ?)');
  stmt.run(id, 'pending', prompt);
  
  // Simulate API call to PixVerse taking time
  setTimeout(() => {
    const updateStmt = db.prepare("UPDATE generations SET status = 'completed', videoUrl = 'https://example.com/mock-video.mp4' WHERE id = ?");
    updateStmt.run(id);
  }, 5000);

  res.json({ id, status: 'pending' });
});

// Poll generation status
app.get('/api/generations/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('SELECT * FROM generations WHERE id = ?');
  const generation = stmt.get(id);
  
  if (!generation) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  res.json(generation);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});