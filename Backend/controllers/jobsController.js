const Fuse = require('fuse.js');
const db = require('../db/db');

function getAllJobs(req, res) {
    db.query('SELECT * FROM jobListings', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
}

function searchJobs(req, res) {
    const query = req.query.q;

    db.query('SELECT * FROM jobListings', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }

        if (!query) {
            return res.json(results);
        }

        const fuse = new Fuse(results, {
            keys: [
                'jobTitle',
                'companyName',
                'requiredSkills',
                'jobDescription'
            ],
            threshold: 0.4
        });

        const filteredResults = fuse.search(query).map(result => result.item);

        res.json(filteredResults);
    });
}


function createJob(req, res) {
    const {
        ownerId,
        jobTitle,
        companyName,
        jobDescription,
        education,
        skills,
        experience,
        workMode,
        location,
        salary,
        companyAssets,
        noOfEmployees,
        companyCeo,
        companySector
    } = req.body;

    const sql = `
        INSERT INTO jobListings (
            jobID,
            jobTitle,
            jobDescription,
            jobLocation,
            educationLevel,
            requiredSkills,
            experience,
            salary,
            workMode,
            companyName,
            companyAssets,
            noOfEmployees,
            companyCeo,
            companySector,
            ownerId
        )
        VALUES (
            (SELECT IFNULL(MAX(j.jobID), 0) + 1 FROM jobListings j),
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    `;

    const values = [
        jobTitle || '',
        jobDescription || '',
        location || '',
        education || '',
        skills || '',
        Number(experience) || 0,
        Number(salary) || 0,
        workMode || '',
        companyName || '',
        companyAssets || 'Not provided',
        Number(noOfEmployees) || 0,
        companyCeo || 'Not provided',
        companySector || 'General',
        Number(ownerId) || 0
    ];

    db.query(sql, values, (err) => {
        if (err) {
            console.error('Failed to create job:', err);
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            message: 'Job successfully created and saved to MySQL!'
        });
    });
}

module.exports = {
    getAllJobs,
    searchJobs,
    createJob 
};