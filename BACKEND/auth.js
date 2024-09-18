const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const router = express.Router();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Suga@1993',
  database: 'caps_christ_attendance'
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check for volunteer
  db.query('SELECT * FROM volunteer WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ id: user.volunteer_id, role: 'volunteer' }, 'your_jwt_secret', { expiresIn: '1h' });
        return res.json({ token });
      }
    }

    // Check for team leader
    db.query('SELECT * FROM team_leader WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length > 0) {
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const token = jwt.sign({ id: user.team_leader_id, role: 'team_leader' }, 'your_jwt_secret', { expiresIn: '1h' });
          return res.json({ token });
        }
      }

      // Check for mentor
      db.query('SELECT * FROM mentor WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
          const user = results[0];
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            const token = jwt.sign({ id: user.mentor_id, role: 'mentor' }, 'your_jwt_secret', { expiresIn: '1h' });
            return res.json({ token });
          }
        }

        // If no user is found
        res.status(401).json('Invalid credentials');
      });
    });
  });
});

// Middleware to check authentication and role
function authMiddleware(requiredRole) {
  return (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json('Access denied');
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) return res.status(401).json('Invalid token');
      if (decoded.role !== requiredRole) return res.status(403).json('Forbidden');
      req.user = decoded;
      next();
    });
  };
}

// Get user profile
router.get('/profile', authMiddleware('volunteer'), (req, res) => {
  const { id } = req.user;
  db.query('SELECT * FROM volunteer WHERE volunteer_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// CRUD operations for attendance
router.post('/attendance', authMiddleware('volunteer'), (req, res) => {
  const { date, status } = req.body;
  const { id } = req.user;
  db.query('INSERT INTO attendance (date, status, volunteer_id) VALUES (?, ?, ?)', [date, status, id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).json('Attendance added');
  });
});

// Get attendance
router.get('/attendance', authMiddleware('volunteer'), (req, res) => {
  const { id } = req.user;
  db.query('SELECT * FROM attendance WHERE volunteer_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// CRUD operations for mentors and team leaders
router.post('/mentor/attendance', authMiddleware('mentor'), (req, res) => {
  const { volunteer_id, date, status } = req.body;
  db.query('INSERT INTO attendance (date, status, volunteer_id) VALUES (?, ?, ?)', [date, status, volunteer_id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).json('Attendance added');
  });
});

router.delete('/mentor/volunteer/:id', authMiddleware('mentor'), (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM volunteer WHERE volunteer_id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json('Volunteer removed');
  });
});

// Admin routes (if needed)
// Example route for admin to get all volunteers
router.get('/admin/volunteers', authMiddleware('admin'), (req, res) => {
  db.query('SELECT * FROM volunteer', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
