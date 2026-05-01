
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { db }  = require('../db');
const auth    = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'username, email and password are required.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const existing = db.get('users').find({ email: email.toLowerCase() }).value();
  if (existing) return res.status(409).json({ error: 'That email is already in use.' });

  const existingUser = db.get('users').find({ username }).value();
  if (existingUser) return res.status(409).json({ error: 'That username is already in use.' });

  try {
    const hashed  = await bcrypt.hash(password, 10);
    const nextId  = db.get('nextIds.users').value();
    const newUser = { id: nextId, username: username.trim(), email: email.toLowerCase(), password: hashed, role: 'admin', created_at: new Date().toISOString() };

    db.get('users').push(newUser).write();
    db.set('nextIds.users', nextId + 1).write();

    const { password: _, ...safeUser } = newUser;
    const token = generateToken(safeUser);
    res.status(201).json({ message: 'Account created.', token, user: safeUser });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const user = db.get('users').find({ email: email.toLowerCase() }).value();
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)  return res.status(401).json({ error: 'Invalid email or password.' });

    const { password: _, ...safeUser } = user;
    const token = generateToken(safeUser);
    res.json({ message: 'Login successful.', token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'fallback_dev_secret',
    { expiresIn: '7d' }
  );
}

module.exports = router;