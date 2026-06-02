const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js');
const db = require('../db/db');

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
            job[headers[j].trim()] = values[j] ? values[j].trim() : '';
        }
        jobs.push(job);
    }
    return jobs;
}

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


function createJob(req, res) {
    const { ownerId, jobTitle, companyName, jobDescription, education, skills, experience, workMode, location, salary } = req.body;

    const csvPath = path.join(__dirname, '../../Database/jobListings.csv');

    const escapeCsv = (val) => {
        if (!val) return '';
        let str = String(val).replace(/"/g, '""');
        if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
            return `"${str}"`;
        }
        return str;
    };

    try {
        const fileContent = fs.readFileSync(csvPath, 'utf8');
        const lines = fileContent.trim().split('\n');
        
        let nextId = 1001; 
        if (lines.length > 1) {
            const lastLine = lines[lines.length - 1];
            const lastIdStr = lastLine.split(',')[0];
            const lastIdNum = parseInt(lastIdStr, 10);
            
            if (!isNaN(lastIdNum)) {
                nextId = lastIdNum + 1;
            }
        }

        const prefix = fileContent.endsWith('\n') ? '' : '\n';

        const csvRow = `${prefix}${nextId},${escapeCsv(jobTitle)},${escapeCsv(jobDescription)},${escapeCsv(location)},${escapeCsv(education)},${escapeCsv(skills)},${escapeCsv(experience)},${escapeCsv(salary)},${escapeCsv(workMode)},${escapeCsv(companyName)},"","",${escapeCsv(ownerId)}\n`;
        fs.appendFileSync(csvPath, csvRow, 'utf8');
        console.log(`New job created with ID [${nextId}]: ${jobTitle}`);
        res.json({ success: true, message: 'Job successfully created and saved!' });
    } catch (err) {
        console.error('Failed to write job to CSV:', err);
        res.status(500).json({ success: false, error: 'Database write error' });
    }
}

module.exports = {
    getAllJobs,
    searchJobs,
    createJob 
};