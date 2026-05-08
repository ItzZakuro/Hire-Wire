const express = require('express');
const router = express.Router();

// test data for candidates
const candidates = [
    { name: 'John Doe', skills: 'JavaScript', experience: 2 },
    { name: 'Anna Smith', skills: 'UI Design', experience: 3 },
    { name: 'Mike Brown', skills: 'Python', experience: 1 }
];

// GET /api/candidates
router.get('/', (req, res) => {
    res.json(candidates);
});

module.exports = router;