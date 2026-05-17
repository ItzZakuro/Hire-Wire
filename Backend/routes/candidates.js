const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../resumes'));
    },

    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

const {
    getAllCandidates,
    uploadResume,
    getResume
} = require('../controllers/candidatesController');

router.get('/', getAllCandidates);

router.post('/resume/upload', upload.single('resume'), uploadResume);

router.get('/resume/:filename', getResume);

module.exports = router;