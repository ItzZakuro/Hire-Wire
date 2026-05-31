const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}

// shuffle function to randomise top n rows of data
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let candidates = [];
let currentIndex = 0;
let likedCount = 0;
let passedCount = 0;

async function loadCandidates() {
    try {
        const response = await fetch('http://localhost:3000/api/jobSeekers');
        candidates = await response.json();
        const isMember = localStorage.getItem('isMember') === 'true';
        candidates = isMember ? shuffle(candidates) : shuffle(candidates).slice(0, 10); // if not a member, show only top 10 random candidates
        
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

document.addEventListener('DOMContentLoaded', () => {
    loadCandidates();
});