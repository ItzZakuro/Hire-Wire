const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

const dbPath = path.join(__dirname, '..', 'Database', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('Database connected successfully.');
  }
});
app.locals.db = db;

app.use(express.json());

// frontend files
app.use(express.static(path.join(__dirname, '..')));

const jobsRoutes = require('./routes/jobs');
app.use('/api/jobs', jobsRoutes);

const candidatesRoutes = require('./routes/candidates');
app.use('/api/candidates', candidatesRoutes);

app.post('/api/auth/login', require('./controllers/authController').login);

app.post('/api/auth/register', require('./controllers/authController').register);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'main.html'));
});

app.get('/candidate', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'candidate.html'));
});

app.get('/employer', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'employer.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'profile.html'));
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});