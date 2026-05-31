const express = require('express');
const router = express.Router();

const {
    getAllJobs,
    searchJobs,
    createJob 
} = require('../controllers/jobsController');

router.get('/', getAllJobs);
router.get('/search', searchJobs);

router.post('/create', createJob);

module.exports = router;