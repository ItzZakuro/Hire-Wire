const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}


// Backend/cmatch.js

let candidates = [];
let currentIndex = 0;
let likedCount = 0;
let passedCount = 0;

// Load candidates from the API on page load
async function loadCandidates() {
    try {
        const response = await fetch('http://localhost:3000/api/jobSeekers');
        candidates = await response.json();
        if (candidates.length > 0) {
            showCard(candidates[currentIndex]);
        } else {
            document.getElementById('fullName').textContent = 'No employees available';
        }
    } catch (err) {
        console.error('Failed to load candidates:', err);
    }
}

// Populate the swipe/match card with a candidate object
function showCard(job) {
    document.getElementById('firstName').textContent         = job.firstName;
    document.getElementById('lastName').textContent          = job.lastName;
    
    const fullName = `${candidates.firstName} ${candidates.lastName}`;
    document.getElementById('fullName').textContent = fullName;
    
    document.getElementById('age').textContent               = job.age;
    document.getElementById('gender').textContent            = job.gender;
    document.getElementById('email').textContent             = job.email;
    document.getElementById('phone').textContent             = job.phone;
    document.getElementById('educationLevel').textContent    = job.educationLevel;
    document.getElementById('majorCode').textContent         = job.majorCode;
    document.getElementById('majorStudy').textContent        = job.majorStudy;
    document.getElementById('yearsExperience').textContent   = job.yearsExperience;
    document.getElementById('workExperience').textContent    = job.workExperience;
    document.getElementById('preferredLocation').textContent = job.preferredLocation;
    document.getElementById('preferredWorkMode').textContent = job.preferredWorkMode;
    document.getElementById('skills').textContent            = job.skills;

    /*
    // Add $ and , to SALARY
    const formattedSalary = '$' + Number(job.salary).toLocaleString();
    document.getElementById('salary').textContent = formattedSalary;

    // Only show first 4 SKILLS
    const allSkills = job.requiredSkills.split(',');
    const topSkills = allSkills.slice(0, 4).join(', ');
    document.getElementById('jobSkills').textContent = topSkills;

    // Show only first 2 sentences of DESCRIPTION
    const allSentences = job.jobDescription.split('.');
    const shortDesc = allSentences.slice(0, 2).join('.') + '.';
    document.getElementById('jobDescription').textContent = shortDesc;
    */
}

function nextCard() {
    currentIndex++;
    if (currentIndex < candidates.length) {
        showCard(jobs[currentIndex]);
    } else {
        document.getElementById('swipeCard').innerHTML = '<h2>No more candidates!</h2>';
    }
}

// Button handlers
document.getElementById('likeBtn').addEventListener('click', () => {
    document.getElementById('statusText').textContent = `You liked: ${candidates[currentIndex].fullName}`;
    likedCount++;
    document.getElementById('likedCount').textContent = likedCount;
    nextCard();
});

document.getElementById('passBtn').addEventListener('click', () => {
    document.getElementById('statusText').textContent = `You passed: ${candidates[currentIndex].fullName}`;
    passedCount++;
    document.getElementById('passedCount').textContent = passedCount;
    nextCard();
});


loadCandidates();