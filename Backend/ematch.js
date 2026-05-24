const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}

let candidates = [];
let currentIndex = 0;
let likedCount = 0;
let passedCount = 0;

async function loadCandidates() {
    try {
        const response = await fetch('http://localhost:3000/api/jobSeekers');
        candidates = await response.json();
        if (candidates.length > 0) {
            showCard(candidates[currentIndex]);
        } else {
            document.getElementById('candidateName').textContent = 'No candidates available';
        }
    } catch (err) {
        console.error('Failed to load candidates:', err);
    }
}

function showCard(candidate) {
    // Combine first and last name
    const fullName = `${candidate.firstName} ${candidate.lastName}`;
    document.getElementById('candidateName').textContent    = fullName;

    document.getElementById('candidateRole').textContent        = candidate.preferredWorkMode;
    document.getElementById('candidateEducation').textContent   = candidate.educationLevel;
    document.getElementById('candidateExperience').textContent  = candidate.yearsExperience;
    // document.getElementById('candidateSkills').textContent      = candidate.skills;
    
    // Only show first 4 skills
    const allSkills = candidate.skills.split(',');
    const topSkills = allSkills.slice(0, 4).join(', ');
    document.getElementById('candidateSkills').textContent = topSkills;

    document.getElementById('candidateDescription').textContent = candidate.workExperience;
}

function nextCard() {
    currentIndex++;
    if (currentIndex < candidates.length) {
        showCard(candidates[currentIndex]);
    } else {
        document.getElementById('swipeCard').innerHTML = '<h2>No more candidates!</h2>';
    }
}

document.getElementById('likeBtn').addEventListener('click', () => {
    const name = `${candidates[currentIndex].firstName} ${candidates[currentIndex].lastName}`;
    document.getElementById('statusText').textContent = `You liked: ${name}`;
    likedCount++;
    document.getElementById('likedCount').textContent = likedCount;
    nextCard();
});

document.getElementById('passBtn').addEventListener('click', () => {
    const name = `${candidates[currentIndex].firstName} ${candidates[currentIndex].lastName}`;
    document.getElementById('statusText').textContent = `You passed: ${name}`;
    passedCount++;
    document.getElementById('passedCount').textContent = passedCount;
    nextCard();
});

loadCandidates();