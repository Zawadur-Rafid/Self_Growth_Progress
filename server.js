require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// API Routes
app.get('/api/skills', (req, res) => {
  db.query('SELECT * FROM skills ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/skills', (req, res) => {
  const { id, name, category, targetDate, progress, notes, status } = req.body;
  const sql = 'INSERT INTO skills (id, name, category, target_date, progress, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [id, name, category, targetDate, progress, notes, status], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Skill created' });
  });
});

app.put('/api/skills/:id', (req, res) => {
  const { status, progress, completedAt } = req.body;
  const sql = 'UPDATE skills SET status = ?, progress = ?, completed_at = ? WHERE id = ?';
  db.query(sql, [status, progress, completedAt, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Skill updated' });
  });
});

app.delete('/api/skills/:id', (req, res) => {
  db.query('DELETE FROM skills WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Skill deleted' });
  });
});

// Send index.html for any request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
