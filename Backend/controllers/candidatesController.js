const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../../Database/jobSeekers.csv');
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
    try {
        const fileContent = fs.readFileSync(csvPath, 'utf8');
        const lines = fileContent.trim().split('\n');
        const row = lines.slice(1).find(line => {
            const firstComma = line.indexOf(',');
            if (firstComma === -1) return false;
            return line.substring(0, firstComma).trim() === id.trim();
        });

        if (!row) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        const fields = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                fields.push(current.trim().replace(/^"|"$/g, ''));
                current = '';
            } else {
                current += char;
            }
        }
        fields.push(current.trim().replace(/^"|"$/g, ''));
        res.json({
            success: true,
            profile: {
                id: fields[0],
                firstName: fields[1],
                lastName: fields[2],
                email: fields[5],
                phone: fields[6],
                university: fields[7],
                major: fields[9],
                experience: fields[12],        
                preferredLocation: fields[13], 
                workingMode: fields[14],        
                skills: fields[15]             
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
function updateProfile(req, res) {
    const { id, name, email, phone, university, major, experience, skills, workingMode, preferredLocation } = req.body;

    const escapeCsv = (val) => {
        if (!val) return '""';
        let str = String(val).replace(/"/g, '""');
        return `"${str}"`;
    };

    try {
        let fileContent = fs.readFileSync(csvPath, 'utf8');
        let lines = fileContent.split('\n');
        
        const nameParts = name ? name.trim().split(' ') : ['Anonymous', ''];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';
        const updatedRow = `${id},${escapeCsv(firstName)},${escapeCsv(lastName)},"","",${escapeCsv(email)},${escapeCsv(phone)},${escapeCsv(university)},"",${escapeCsv(major)},"","3",${escapeCsv(experience)},${escapeCsv(preferredLocation)},${escapeCsv(workingMode)},${escapeCsv(skills)}`;
        
        let targetLineIndex = -1;
        for (let i = 1; i < lines.length; i++) {
            const firstComma = lines[i].indexOf(',');
            if (firstComma !== -1 && lines[i].substring(0, firstComma).trim() === String(id).trim()) {
                targetLineIndex = i;
                break;
            }
        }
        if (targetLineIndex !== -1) {
            lines[targetLineIndex] = updatedRow; 
            console.log(`Already updated [ID: ${id}] in CSV`);
        } else {
            lines.push(updatedRow); 
        }

        fs.writeFileSync(csvPath, lines.join('\n'), 'utf8');
        res.json({ success: true, message: 'Profile synchronized perfectly!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Database update error' });
    }
}

module.exports = {
    getAllCandidates,
    uploadResume,
    getResume,
    getProfileById,
    updateProfile 
};