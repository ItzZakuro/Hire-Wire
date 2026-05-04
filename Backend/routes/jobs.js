const express = require('express');
const router = express.Router();
const Fuse = require('fuse.js');

const jobs = [
    { title: 'Frontend Developer', company: 'Bright Web Solutions' },
    { title: 'UI Designer', company: 'Pixel Forge' },
    { title: 'Software Engineer', company: 'CodeNest' }
];

router.get('/', (req, res) => {
    res.json(jobs);
});

router.get('/search', (req, res) => {
    const query = req.query.q;

    const fuse = new Fuse(jobs, {
        keys: ['title', 'company'],
        threshold: 0.4
    });

    const results = fuse.search(query).map(result => result.item);

    res.json(results);
});

module.exports = router;