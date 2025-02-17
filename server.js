import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('dist'));

const scoresFile = join(__dirname, 'scores.json');

// Initialize scores file if it doesn't exist
if (!fs.existsSync(scoresFile)) {
  fs.writeFileSync(scoresFile, JSON.stringify([]));
}

app.get('/api/scores', (req, res) => {
  const scores = JSON.parse(fs.readFileSync(scoresFile, 'utf8'));
  res.json(scores);
});

app.post('/api/scores', (req, res) => {
  const { name, score } = req.body;
  const scores = JSON.parse(fs.readFileSync(scoresFile, 'utf8'));
  scores.push({ name, score, timestamp: new Date().toISOString() });
  scores.sort((a, b) => b.score - a.score);
  fs.writeFileSync(scoresFile, JSON.stringify(scores));
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});