
import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'aein_talk_super_secret_key';

// Database Setup
let pool;
async function initDB() {
  try {
    const dbOptions = process.env.DATABASE_URL ? {
      uri: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    } : {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'aein_talk_db'
    };

    pool = mysql.createPool(dbOptions);
    const conn = await pool.getConnection();
    console.log('✅ MySQL Connected Successfully');
    conn.release();

    // Tables Creation
    await pool.query(`CREATE TABLE IF NOT EXISTS users (id VARCHAR(255) PRIMARY KEY, username VARCHAR(255) UNIQUE, password VARCHAR(255), createdAt BIGINT)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS chats (id VARCHAR(255) PRIMARY KEY, userId VARCHAR(255), title VARCHAR(255), updatedAt BIGINT)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS messages (id VARCHAR(255) PRIMARY KEY, chatId VARCHAR(255), role ENUM('user', 'model'), content TEXT, timestamp BIGINT, FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE)`);
  } catch (err) {
    console.error('❌ DB Error:', err.message);
  }
}
initDB();

// API Endpoints
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (id, username, password, createdAt) VALUES (?, ?, ?, ?)', [Date.now().toString(), username, hashedPassword, Date.now()]);
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: 'User exists' }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: rows[0].id, username: rows[0].username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: rows[0].id, username: rows[0].username } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Unauthorized' }); }
};

app.get('/api/chats', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM chats WHERE userId = ? ORDER BY updatedAt DESC', [req.user.id]);
  res.json(rows);
});

app.get('/api/chats/:id/messages', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM messages WHERE chatId = ? ORDER BY timestamp ASC', [req.params.id]);
  res.json(rows);
});

app.post('/api/messages', auth, async (req, res) => {
  const { chatId, chatTitle, message } = req.body;
  const timestamp = Date.now();
  try {
    const [exists] = await pool.query('SELECT id FROM chats WHERE id = ?', [chatId]);
    if (!exists.length) await pool.query('INSERT INTO chats (id, userId, title, updatedAt) VALUES (?, ?, ?, ?)', [chatId, req.user.id, chatTitle || 'New Chat', timestamp]);
    else await pool.query('UPDATE chats SET updatedAt = ? WHERE id = ?', [timestamp, chatId]);

    await pool.query('INSERT INTO messages (id, chatId, role, content, timestamp) VALUES (?, ?, ?, ?, ?)', [Date.now().toString(), chatId, 'user', message, timestamp]);

    const [history] = await pool.query('SELECT role, content FROM messages WHERE chatId = ? ORDER BY timestamp ASC LIMIT 10', [chatId]);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.map(h => ({ role: h.role === 'model' ? 'model' : 'user', parts: [{ text: h.content }] })),
      config: { systemInstruction: "You are AEIN TALK, an advanced AI. Be helpful, concise, and smart." }
    });

    const aiMsg = result.text || "I'm thinking...";
    const aiId = (Date.now() + 1).toString();
    await pool.query('INSERT INTO messages (id, chatId, role, content, timestamp) VALUES (?, ?, ?, ?, ?)', [aiId, chatId, 'model', aiMsg, timestamp + 1]);

    res.json({ 
      userMessage: { id: Date.now().toString(), role: 'user', content: message, timestamp },
      aiMessage: { id: aiId, role: 'model', content: aiMsg, timestamp: timestamp + 1 }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/chats/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM chats WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// Serve frontend - Very Important for Beginner Deployment
app.use(express.static(__dirname)); 
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) res.sendFile(path.join(__dirname, 'index.html'));
});

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, '0.0.0.0', () => console.log(`🚀 AEIN TALK Live on port ${PORT}`));
const PORT = process.env.PORT || 7860;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
