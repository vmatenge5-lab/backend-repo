const jwt = require('jsonwebtoken');

const AUTH_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret';

module.exports = function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, AUTH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    req.user = decoded;
    next();
  });
};