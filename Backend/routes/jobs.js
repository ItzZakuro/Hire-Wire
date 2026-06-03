const express = require('express');
const router = express.Router();

const {
    getAllJobs,
    searchJobs,
    createJob,
    getJobsByOwner,
    deleteJob,
    updateJob
} = require('../controllers/jobsController');

router.get('/', getAllJobs);
router.get('/search', searchJobs);
router.get('/owner/:ownerId', getJobsByOwner);

router.post('/create', createJob);
router.delete('/delete/:id', deleteJob);
router.post('/update/:id', updateJob);

module.exports = router;