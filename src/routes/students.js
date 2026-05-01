const express = require('express');
const { db }  = require('../db');
const auth    = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', (req, res) => {
  const { search, major, year } = req.query;
  let students = db.get('students').value();

  if (search) {
    const q = search.toLowerCase();
    students = students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.student_id.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.major_name || '').toLowerCase().includes(q)
    );
  }
  if (major) students = students.filter(s => s.major_name === major);
  if (year)  students = students.filter(s => s.year === year);

  students = [...students].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json({ students, count: students.length });
});

router.get('/:id', (req, res) => {
  const student = db.get('students').find({ id: parseInt(req.params.id) }).value();
  if (!student) return res.status(404).json({ error: 'Student not found.' });
  res.json(student);
});

router.post('/', (req, res) => {
  const { name, student_id, email, phone, major, year, gpa, bio } = req.body;

  if (!name || !student_id || !email || !major || !year || gpa === undefined)
    return res.status(400).json({ error: 'name, student_id, email, major, year and gpa are required.' });
  if (isNaN(gpa) || gpa < 0 || gpa > 4)
    return res.status(400).json({ error: 'GPA must be between 0.0 and 4.0.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Invalid email address.' });

  const dupEmail = db.get('students').find({ email: email.toLowerCase() }).value();
  if (dupEmail) return res.status(409).json({ error: 'A student with that email already exists.' });

  const dupId = db.get('students').find({ student_id: student_id.toUpperCase() }).value();
  if (dupId) return res.status(409).json({ error: 'A student with that student_id already exists.' });

  const majorExists = db.get('majors').find({ name: major }).value();
  if (!majorExists) return res.status(400).json({ error: `Major "${major}" not found.` });

  const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colours  = ['#6c63ff','#ff6584','#43d9a2','#ffd166','#54a0ff','#ef8c8c'];
  const colour   = colours[Math.floor(Math.random() * colours.length)];
  const nextId   = db.get('nextIds.students').value();

  const student = {
    id:         nextId,
    student_id: student_id.trim().toUpperCase(),
    name:       name.trim(),
    email:      email.trim().toLowerCase(),
    phone:      phone?.trim() || null,
    major_name: major,
    year,
    gpa:        parseFloat(gpa),
    bio:        bio?.trim() || null,
    avatar:     initials,
    color:      colour,
    created_at: new Date().toISOString(),
  };

  db.get('students').push(student).write();
  db.set('nextIds.students', nextId + 1).write();

  res.status(201).json({ message: 'Student added successfully.', student });
});

router.put('/:id', (req, res) => {
  const id      = parseInt(req.params.id);
  const student = db.get('students').find({ id }).value();
  if (!student) return res.status(404).json({ error: 'Student not found.' });

  const { name, email, phone, major, year, gpa, bio } = req.body;

  if (email && email !== student.email) {
    const dup = db.get('students').find({ email: email.toLowerCase() }).value();
    if (dup) return res.status(409).json({ error: 'That email is already used by another student.' });
  }

  const updated = {
    ...student,
    name:       name?.trim()       || student.name,
    email:      email?.toLowerCase() || student.email,
    phone:      phone?.trim()      || student.phone,
    major_name: major              || student.major_name,
    year:       year               || student.year,
    gpa:        gpa !== undefined  ? parseFloat(gpa) : student.gpa,
    bio:        bio?.trim()        || student.bio,
  };

  db.get('students').find({ id }).assign(updated).write();
  res.json({ message: 'Student updated.', student: updated });
});

router.delete('/:id', (req, res) => {
  const id      = parseInt(req.params.id);
  const student = db.get('students').find({ id }).value();
  if (!student) return res.status(404).json({ error: 'Student not found.' });

  db.get('students').remove({ id }).write();
  res.json({ message: `Student "${student.name}" deleted successfully.` });
});

module.exports = router;
