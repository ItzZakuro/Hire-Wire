const candidates = [
    { name: 'John Doe', skills: 'JavaScript', experience: 2 },
    { name: 'Anna Smith', skills: 'UI Design', experience: 3 },
    { name: 'Mike Brown', skills: 'Python', experience: 1 }
];

function getAllCandidates(req, res) {
    res.json(candidates);
}

module.exports = {
    getAllCandidates
};