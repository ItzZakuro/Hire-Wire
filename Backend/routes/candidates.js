const express = require('express');
const router = express.Router();

const {
    getAllCandidates
} = require('../controllers/candidatesController');

router.get('/', getAllCandidates);

module.exports = router;