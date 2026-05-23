const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js');

function loadJobs() {
    const csvPath = path.join(__dirname, '../../Database/jobListings.csv');

    const csvData = fs.readFileSync(csvPath, 'utf8');

    const lines = csvData.trim().split('\n');

    const headers = lines[0].split(',');

    const jobs = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');

        const job = {};

        for (let j = 0; j < headers.length; j++) {
            job[headers[j].trim()] = values[j]
                ? values[j].trim()
                : '';
        }

        jobs.push(job);
    }

    return jobs;
}

function getAllJobs(req, res) {
    const jobs = loadJobs();
    res.json(jobs);
}

function searchJobs(req, res) {
    const jobs = loadJobs();

    const query = req.query.q;

    if (!query) {
        return res.json(jobs);
    }

    const fuse = new Fuse(jobs, {
        keys: [
            'jobTitle',
            'companyName',
            'requiredSkills',
            'jobDescription'
        ],
        threshold: 0.4
    });

    const results = fuse.search(query).map(result => result.item);

    res.json(results);
}

module.exports = {
    getAllJobs,
    searchJobs
};