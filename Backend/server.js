const express = require('express');
const app = express();

app.use(express.json());

const path = require('path');

const jobsRoutes = require('./routes/jobs');
app.use('/api/jobs', jobsRoutes);

// frontend files
app.use(express.static(path.join(__dirname, '../Code Files')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Code Files', 'main.html'));
});

app.get('/candidate', (req, res) => {
    res.sendFile(path.join(__dirname, '../Code Files', 'candidate.html'));
});

app.get('/employer', (req, res) => {
    res.sendFile(path.join(__dirname, '../Code Files', 'employer.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../Code Files', 'profile.html'));
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});