const fs = require('fs');
const path = require('path');

function getAllCandidates(req, res) {
    const db = req.app.locals.db;
    db.all('SELECT * FROM jobSeekers', [], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json(rows);
    });
}

function getProfileById(req, res) {
    const { id } = req.params;
    const db = req.app.locals.db;

    db.get('SELECT * FROM jobSeekers WHERE "Index" = ?', [id], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        res.json({
            success: true,
            profile: {
                id: row.Index,
                firstName: row['First Name'],
                lastName: row['Last Name'],
                email: row.Email, 
                phone: row.Phone,
                university: row.Education, 
                major: row.Major_Study,
                experience: row.Experience,       
                workExperience: row.workExperience,
                preferredLocation: row.preferredLocation,
                workingMode: row.preferredWorkMode, 
                skills: row.skills
            }
        });
    });
}

function updateProfile(req, res) {
    const { id, name, email, phone, university, major, experience, workExperience, skills, workingMode, preferredLocation } = req.body;
    const db = req.app.locals.db;

    const nameParts = name ? name.trim().split(' ') : ['Anonymous', ''];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const sql = `UPDATE jobSeekers SET 
        "First Name" = ?, "Last Name" = ?, Email = ?, Phone = ?, 
        Education = ?, Major_Study = ?, Experience = ?, workExperience = ?,
        preferredLocation = ?, preferredWorkMode = ?, skills = ? 
        WHERE "Index" = ?`;

    const params = [firstName, lastName, email, phone, university, major, experience, workExperience, preferredLocation, workingMode, skills, id];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Update failed:', err.message);
            return res.status(500).json({ success: false, error: 'Database update error' });
        }
        res.json({ success: true, message: 'Profile synchronized perfectly to SQLite!' });
    });
}
function uploadResume(req, res) {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.json({ success: true, message: 'Resume uploaded successfully', filename: req.file.filename });
}

function getResume(req, res) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../resumes', filename); 
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ success: false, message: 'Resume not found' });
    }
}

module.exports = { getAllCandidates, uploadResume, getResume, getProfileById, updateProfile };