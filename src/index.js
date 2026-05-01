require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const { initDB } = require('./db');

const authRoute     = require('./routes/auth');
const studentsRoute = require('./routes/students');
const majorsRoute   = require('./routes/majors');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/auth',     authRoute);
app.use('/api/students', studentsRoute);
app.use('/api/majors',   majorsRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Student Directory API', version: '1.0.0' });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

initDB();
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});