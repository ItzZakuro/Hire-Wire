const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}


// Backend/cmatch.js

let jobs = [];
let currentIndex = 0;
let likedCount = 0;
let passedCount = 0;

// Load jobs from the API on page load
async function loadJobs() {
    try {
        const response = await fetch('http://localhost:3000/api/jobListings');
        jobs = await response.json();
        if (jobs.length > 0) {
            showCard(jobs[currentIndex]);
        } else {
            document.getElementById('jobTitle').textContent = 'No jobs available';
        }
    } catch (err) {
        console.error('Failed to load jobs:', err);
    }
}

// Populate the swipe/match card with a job object
function showCard(job) {
    document.getElementById('jobTitle').textContent       = job.jobTitle;
    document.getElementById('companyName').textContent    = job.companyName;
    document.getElementById('companyAssets').textContent  = job.companyAssets;
    document.getElementById('noOfEmployees').textContent  = job.noOfEmployees;
    document.getElementById('companyCeo').textContent     = job.companyCeo;
    document.getElementById('companySector').textContent  = job.companySector;
    document.getElementById('jobLocation').textContent    = job.jobLocation;
    document.getElementById('jobType').textContent        = job.workMode;
    document.getElementById('educationLevel').textContent = job.educationLevel;
    document.getElementById('experience').textContent     = job.experience;

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
}

function nextCard() {
    currentIndex++;
    if (currentIndex < jobs.length) {
        showCard(jobs[currentIndex]);
    } else {
        document.getElementById('swipeCard').innerHTML = '<h2>No more jobs!</h2>';
    }
}

// Button handlers
document.getElementById('likeBtn').addEventListener('click', () => {
    document.getElementById('statusText').textContent = `You liked: ${jobs[currentIndex].jobTitle}`;
    likedCount++;
    document.getElementById('likedCount').textContent = likedCount;
    nextCard();
});

document.getElementById('passBtn').addEventListener('click', () => {
    document.getElementById('statusText').textContent = `You passed: ${jobs[currentIndex].jobTitle}`;
    passedCount++;
    document.getElementById('passedCount').textContent = passedCount;
    nextCard();
});


loadJobs();