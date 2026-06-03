const Fuse = require('fuse.js');

function getAllJobs(req, res) {
    const db = req.app.locals.db;
    db.all('SELECT * FROM jobListings', [], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(rows);
    });
}

function searchJobs(req, res) {
    const db = req.app.locals.db;
    const query = req.query.q;

    db.all('SELECT * FROM jobListings', [], (err, jobs) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
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
    });
}

function createJob(req, res) {
    const db = req.app.locals.db;
    const { ownerId, jobTitle, companyName, jobDescription, education, skills, experience, workMode, location, salary } = req.body;
    db.all('SELECT * FROM jobListings', [], (err, rows) => {
        if (err) {
            console.error('Failed to read database:', err.message);
            return res.status(500).json({ success: false, error: 'Database read error' });
        }

        let nextId = 1001; 
        if (rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            const keys = Object.keys(lastRow);
            const lastIdNum = parseInt(lastRow[keys[0]], 10);
            
            if (!isNaN(lastIdNum)) {
                nextId = lastIdNum + 1;
            }
        }

        const sql = `INSERT INTO jobListings VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [
            nextId, 
            jobTitle || '', 
            jobDescription || '', 
            location || '', 
            education || '', 
            skills || '', 
            experience || '', 
            salary || '', 
            workMode || '', 
            companyName || '', 
            "", 
            "", 
            ownerId || ''
        ];

        db.run(sql, params, function(err) {
            if (err) {
                console.error('Failed to write job to DB:', err.message);
                return res.status(500).json({ success: false, error: 'Database write error' });
            }
            console.log(`New job created in Database with ID [${nextId}]: ${jobTitle}`);
            res.json({ success: true, message: 'Job successfully created and saved!' });
        });
    });
}
function getJobsByOwner(req, res) {
    const db = req.app.locals.db;
    const { ownerId } = req.params;

    db.all('SELECT * FROM jobListings WHERE ownerId = ?', [ownerId], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(rows);
    });
}

function deleteJob(req, res) {
    const { id } = req.params;
    const db = req.app.locals.db;

    db.run('DELETE FROM jobListings WHERE jobID = ?', [id], function(err) {
        if (err) {
            console.error('Failed to delete job:', err.message);
            return res.status(500).json({ success: false, error: 'Database delete error' });
        }
        res.json({ success: true, message: 'Job successfully removed!' });
    });
}
function updateJob(req, res) {
    const { id } = req.params;
    const {
        jobTitle, jobDescription, location, education, skills,
        experience, salary, workMode, companyName, companySector
    } = req.body;
    
    const db = req.app.locals.db;

    const sql = `
        UPDATE jobListings 
        SET jobTitle = ?, jobDescription = ?, jobLocation = ?, educationLevel = ?, 
            requiredSkills = ?, experience = ?, salary = ?, workMode = ?, 
            companyName = ?, companySector = ?
        WHERE jobID = ?
    `;

    const params = [
        jobTitle, jobDescription, location, education, 
        skills, experience, salary, workMode, 
        companyName, companySector, id
    ];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Failed to update job:', err.message);
            return res.status(500).json({ success: false, error: 'Database update error' });
        }
        res.json({ success: true, message: 'Job successfully updated!' });
    });
}
module.exports = {
    getAllJobs,
    searchJobs,
    createJob,
    getJobsByOwner,
    deleteJob,
    updateJob
};