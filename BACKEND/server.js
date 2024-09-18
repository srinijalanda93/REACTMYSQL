const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const authRoutes = require('./auth');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Connecting the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Suga@1993',
  database: 'caps_christ_attendance',
});

// Use auth routes
app.use('/auth', authRoutes);

// Example route to query data from MySQL
app.get('/', (req, res) => {
  return res.json("from backend side");
});

// Fetching the data from the database
app.get('/coordinator', (req, res) => {
  const sql = 'SELECT * FROM coordinator';
  db.query(sql, (error, data) => {
    if (error) {
      return res.json(error);
    }
    return res.json(data);
  });
});

// Start the server
const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
