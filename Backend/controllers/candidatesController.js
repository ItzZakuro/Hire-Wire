const path = require('path');

const candidates = [
    { name: 'John Doe', skills: 'JavaScript', experience: 2 },
    { name: 'Anna Smith', skills: 'UI Design', experience: 3 },
    { name: 'Mike Brown', skills: 'Python', experience: 1 }
];

function getAllCandidates(req, res) {
    res.json(candidates);
}

function uploadResume(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
        message: 'Resume uploaded successfully',
        filename: req.file.filename,
        path: `/api/candidates/resume/${req.file.filename}`
     });
}

function getResume(req, res) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../resumes', filename);

    res.sendFile(filePath);
}

module.exports = {
    getAllCandidates,
    uploadResume,
    getResume
};