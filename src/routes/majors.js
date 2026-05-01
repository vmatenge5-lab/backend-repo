const express = require('express');
const { db }  = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const majors = db.get('majors').sortBy('name').value();
  res.json(majors);
});

module.exports = router;