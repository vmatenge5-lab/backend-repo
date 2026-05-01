const low    = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path   = require('path');
const fs     = require('fs');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const adapter = new FileSync(path.join(dataDir, 'students.json'));
const db      = low(adapter);

const MAJORS = [
  'Computer Science', 'Information Systems', 'Software Engineering',
  'Cybersecurity', 'Data Science', 'Information Technology',
  'Electrical Engineering', 'Mathematics',
];

const SAMPLE_STUDENTS = [
  { id: 1, student_id: 'BU2021001', name: 'Amara Diallo',    email: 'amara.diallo@university.edu',  phone: '+267 71 234 567', major_name: 'Computer Science',     year: '3rd Year', gpa: 3.8, bio: 'Passionate about machine learning and NLP.', avatar: 'AD', color: '#6c63ff', created_at: new Date().toISOString() },
  { id: 2, student_id: 'BU2022045', name: 'Kgosi Morapedi',  email: 'kgosi.m@university.edu',        phone: '+267 72 345 678', major_name: 'Information Systems',  year: '2nd Year', gpa: 3.5, bio: 'Interested in enterprise systems and BI.',   avatar: 'KM', color: '#ff6584', created_at: new Date().toISOString() },
  { id: 3, student_id: 'BU2020112', name: 'Tebogo Sekgoma',  email: 'tebogo.s@university.edu',       phone: '+267 73 456 789', major_name: 'Software Engineering', year: '4th Year', gpa: 3.9, bio: 'Full-stack developer, loves open source.',   avatar: 'TS', color: '#43d9a2', created_at: new Date().toISOString() },
  { id: 4, student_id: 'BU2023007', name: 'Neo Gabarone',    email: 'neo.g@university.edu',          phone: '+267 74 567 890', major_name: 'Cybersecurity',        year: '1st Year', gpa: 3.2, bio: 'Aspiring ethical hacker, enjoys CTFs.',      avatar: 'NG', color: '#ffd166', created_at: new Date().toISOString() },
  { id: 5, student_id: 'BU2021089', name: 'Lesego Phiri',    email: 'lesego.p@university.edu',       phone: '+267 75 678 901', major_name: 'Data Science',         year: '3rd Year', gpa: 3.7, bio: 'Statistics enthusiast with Python skills.',  avatar: 'LP', color: '#ef8c8c', created_at: new Date().toISOString() },
  { id: 6, student_id: 'BU2022033', name: 'Onkabetse Tau',   email: 'onkabetse.t@university.edu',    phone: '+267 76 789 012', major_name: 'Computer Science',     year: '2nd Year', gpa: 3.4, bio: 'Game developer in training, loves Unity.',   avatar: 'OT', color: '#54a0ff', created_at: new Date().toISOString() },
];

function initDB() {
  db.defaults({
    users:    [],
    students: [],
    majors:   MAJORS.map((name, i) => ({ id: i + 1, name })),
    nextIds:  { users: 1, students: 7 },
  }).write();

  if (db.get('students').value().length === 0) {
    db.set('students', SAMPLE_STUDENTS).write();
  }

  console.log(' Database ready (students.json)');
  return db;
}

module.exports = { db, initDB };