

-- Drop tables in reverse order (for clean resets during dev)
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS majors   CASCADE;
DROP TABLE IF EXISTS users    CASCADE;

-- ── Users (authentication) ────────────────────────────────
CREATE TABLE users (
  id          SERIAL        PRIMARY KEY,
  username    VARCHAR(50)   UNIQUE NOT NULL,
  email       VARCHAR(100)  UNIQUE NOT NULL,
  password    VARCHAR(255)  NOT NULL,            -- bcrypt hash
  role        VARCHAR(20)   NOT NULL DEFAULT 'admin',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Majors (lookup / relationship table) ─────────────────
CREATE TABLE majors (
  id    SERIAL       PRIMARY KEY,
  name  VARCHAR(100) UNIQUE NOT NULL
);

-- ── Students ──────────────────────────────────────────────
CREATE TABLE students (
  id          SERIAL        PRIMARY KEY,
  student_id  VARCHAR(20)   UNIQUE NOT NULL,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(100)  UNIQUE NOT NULL,
  phone       VARCHAR(30),
  major_id    INTEGER       REFERENCES majors(id) ON DELETE SET NULL,
  year        VARCHAR(20),
  gpa         NUMERIC(3,2)  CHECK (gpa >= 0 AND gpa <= 4),
  bio         TEXT,
  avatar      VARCHAR(10),
  color       VARCHAR(20),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Indexes (faster search queries) ──────────────────────
CREATE INDEX idx_students_name       ON students (LOWER(name));
CREATE INDEX idx_students_email      ON students (LOWER(email));
CREATE INDEX idx_students_student_id ON students (student_id);
CREATE INDEX idx_students_major_id   ON students (major_id);
CREATE INDEX idx_students_year       ON students (year);

-- ── Seed Majors ───────────────────────────────────────────
INSERT INTO majors (name) VALUES
  ('Computer Science'),
  ('Information Systems'),
  ('Software Engineering'),
  ('Cybersecurity'),
  ('Data Science'),
  ('Information Technology'),
  ('Electrical Engineering'),
  ('Mathematics')
ON CONFLICT (name) DO NOTHING;

-- ── Seed Sample Students (optional, for testing) ──────────
-- Run this block if you want demo data in your database.
-- First add a dummy major reference, then insert students.

INSERT INTO students
  (student_id, name, email, phone, major_id, year, gpa, bio, avatar, color)
VALUES
  ('BU2021001', 'Amara Diallo',    'amara.diallo@university.edu',  '+267 71 234 567',
   (SELECT id FROM majors WHERE name='Computer Science'),
   '3rd Year', 3.8, 'Passionate about machine learning and NLP.', 'AD', '#6c63ff'),

  ('BU2022045', 'Kgosi Morapedi', 'kgosi.m@university.edu',       '+267 72 345 678',
   (SELECT id FROM majors WHERE name='Information Systems'),
   '2nd Year', 3.5, 'Interested in enterprise systems and BI.',   'KM', '#ff6584'),

  ('BU2020112', 'Tebogo Sekgoma', 'tebogo.s@university.edu',      '+267 73 456 789',
   (SELECT id FROM majors WHERE name='Software Engineering'),
   '4th Year', 3.9, 'Full-stack developer, loves open source.',   'TS', '#43d9a2'),

  ('BU2023007', 'Neo Gabarone',   'neo.g@university.edu',         '+267 74 567 890',
   (SELECT id FROM majors WHERE name='Cybersecurity'),
   '1st Year', 3.2, 'Aspiring ethical hacker, enjoys CTFs.',      'NG', '#ffd166'),

  ('BU2021089', 'Lesego Phiri',   'lesego.p@university.edu',      '+267 75 678 901',
   (SELECT id FROM majors WHERE name='Data Science'),
   '3rd Year', 3.7, 'Statistics enthusiast with Python skills.',   'LP', '#ef8c8c'),

  ('BU2022033', 'Onkabetse Tau',  'onkabetse.t@university.edu',   '+267 76 789 012',
   (SELECT id FROM majors WHERE name='Computer Science'),
   '2nd Year', 3.4, 'Game developer in training, loves Unity.',    'OT', '#54a0ff')
ON CONFLICT (student_id) DO NOTHING;

-- ── Useful views (optional, for reports) ─────────────────
CREATE OR REPLACE VIEW student_summary AS
  SELECT
    s.id,
    s.student_id,
    s.name,
    s.email,
    s.year,
    s.gpa,
    m.name AS major,
    s.created_at
  FROM students s
  LEFT JOIN majors m ON s.major_id = m.id
  ORDER BY s.created_at DESC;
