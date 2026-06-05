const fs = require('fs');
const path = require('path');
const db = require('../db/db');

function getAllCandidates(req, res) {
    db.query('SELECT * FROM jobseekers', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
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

function getProfileById(req, res) {
    const { id } = req.params;

    db.query(
        'SELECT * FROM jobseekers WHERE jobSeekerID = ?',
        [id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Profile not found'
                });
            }

            const candidate = results[0];

            res.json({
                success: true,
                profile: {
                    id: candidate.jobSeekerID,
                    firstName: candidate.firstName,
                    lastName: candidate.lastName,
                    email: candidate.email,
                    phone: candidate.phone,
                    university: candidate.educationLevel,
                    major: candidate.majorStudy,
                    experience: candidate.yearsExperience,
                    preferredLocation: candidate.preferredLocation,
                    workingMode: candidate.preferredWorkMode,
                    skills: candidate.skills
                }
            });
        }
    );
}

function updateProfile(req, res) {
    const {
        id,
        name,
        email,
        phone,
        university,
        major,
        experience,
        skills,
        workingMode,
        preferredLocation
    } = req.body;

    const nameParts = name ? name.trim().split(' ') : ['Anonymous'];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const sql = `
        UPDATE jobseekers
        SET
            firstName = ?,
            lastName = ?,
            email = ?,
            phone = ?,
            educationLevel = ?,
            majorStudy = ?,
            yearsExperience = ?,
            skills = ?,
            preferredWorkMode = ?,
            preferredLocation = ?
        WHERE jobSeekerID = ?
    `;

    const values = [
        firstName,
        lastName,
        email || '',
        phone || '',
        university || '',
        major || '',
        Number(experience) || 0,
        skills || '',
        workingMode || '',
        preferredLocation || '',
        id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Failed to update profile:', err);
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully in MySQL!'
        });
    });
}

module.exports = {
    getAllCandidates,
    uploadResume,
    getResume,
    getProfileById,
    updateProfile 
};