const express = require('express');
const router = express.Router();

const {
    getAllJobs,
    searchJobs
} = require('../controllers/jobsController');

router.get('/', getAllJobs);
router.get('/search', searchJobs);

module.exports = router;