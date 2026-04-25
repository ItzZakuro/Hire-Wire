const express = require('express');
const Fuse = require('fuse.js')
const app = express();
const path = require('path');

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

app.get('/api/jobs', (req, res) => {
    const jobs = [
        { title: 'Frontend Developer', company: 'Bright Web Solutions' },
        { title: 'UI Designer', company: 'Pixel Forge' },
        { title: 'Software Engineer', company: 'CodeNest' }
    ];

    res.json(jobs);
});

app.get('/api/jobs/search', (req, res) => {
    const jobs = [
        { title: 'Frontend Developer', company: 'Bright Web Solutions' },
        { title: 'UI Designer', company: 'Pixel Forge' },
        { title: 'Software Engineer', company: 'CodeNest' }
    ];

    const query = req.query.q;

    const fuse = new Fuse(jobs, {
        keys: ['title', 'company'],
        threshold: 0.4
    });

    const results = fuse.search(query).map(result => result.item);

    res.json(results);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});