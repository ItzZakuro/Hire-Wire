const Fuse = require('fuse.js');

const jobs = [
    { title: 'Frontend Developer', company: 'Bright Web Solutions' },
    { title: 'UI Designer', company: 'Pixel Forge' },
    { title: 'Software Engineer', company: 'CodeNest' }
];

function getAllJobs(req, res) {
    res.json(jobs);
}

function searchJobs(req, res) {
    const query = req.query.q;

    if (!query) {
        return res.json(jobs);
    }

    const fuse = new Fuse(jobs, {
        keys: ['title', 'company'],
        threshold: 0.4
    });

    const results = fuse.search(query).map(result => result.item);
    res.json(results);
}

module.exports = {
    getAllJobs,
    searchJobs
};