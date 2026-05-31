
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}

let jobs = [];
let currentIndex = 0;
let likedCount = 0;
let passedCount = 0;
function calculateMatchScore(job, myProfile) {
    let score = 0;
    const jobLoc = (job.jobLocation || '').toLowerCase();
    const myLoc = (myProfile.location || '').toLowerCase();
    if (myLoc && jobLoc.includes(myLoc)) {
        score += 30;
    }
    const jobMode = (job.workMode || '').toLowerCase();
    const myMode = (myProfile.workMode || '').toLowerCase();
    if (myMode && jobMode.includes(myMode)) {
        score += 20;
    }
    const jobSkillsStr = (job.requiredSkills || '').toLowerCase();
    const mySkillsArr = (myProfile.skills || '').toLowerCase().split(',').map(s => s.trim()).filter(s => s);
    
    mySkillsArr.forEach(skill => {
        if (jobSkillsStr.includes(skill)) {
            score += 10;
        }
    });

    return score;
}

async function loadJobs() {
    try {
        const seekerRes = await fetch('../Database/jobSeekers.csv?t=' + new Date().getTime());
        const seekerCsv = await seekerRes.text();
        const seekerLines = seekerCsv.trim().split('\n').filter(line => line.length > 0);
        const lastSeeker = seekerLines[seekerLines.length - 1].split(',');

        const myProfile = {
            location: lastSeeker[13] ? lastSeeker[13].replace(/"/g, '') : '',
            workMode: lastSeeker[14] ? lastSeeker[14].replace(/"/g, '') : '',
            skills: lastSeeker[15] ? lastSeeker[15].replace(/"/g, '') : ''
        };

        const response = await fetch('http://localhost:3000/api/jobListings');
        let allJobs = await response.json();

        allJobs.forEach(job => {
            job.matchScore = calculateMatchScore(job, myProfile);
        });

        allJobs.sort((a, b) => b.matchScore - a.matchScore);
        const isMember = localStorage.getItem('isMember') === 'true';
        jobs = isMember ? allJobs : allJobs.slice(0, 10); 

        if (jobs.length > 0) {
            showCard(jobs[currentIndex]);
        } else {
            document.getElementById('jobTitle').textContent = 'No jobs available';
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        document.getElementById('jobTitle').textContent = 'Error loading jobs. Please ensure server is running.';
    }
}

function showCard(job) {
    document.getElementById('jobTitle').innerHTML = `${job.jobTitle} <span style="color:#a89676; font-size:0.7em;">(Match: ${job.matchScore || 0} pts)</span>`;
    document.getElementById('companyName').textContent = job.companyName || 'Unknown';
    document.getElementById('jobLocation').textContent = job.jobLocation || 'Unknown';
    document.getElementById('jobType').textContent = job.workMode || 'Unspecified';
    
    const formattedSalary = job.salary ? String(job.salary) : 'Unspecified';
    document.getElementById('salary').textContent = formattedSalary;

    const allSkills = (job.requiredSkills || '').split(',');
    const topSkills = allSkills.slice(0, 4).join(', ');
    document.getElementById('jobSkills').textContent = topSkills;
}

function nextCard() {
    currentIndex++;
    if (currentIndex < jobs.length) {
        showCard(jobs[currentIndex]);
    } else {
        const isMember = localStorage.getItem('isMember') === 'true';
        if (isMember) {
            document.getElementById('swipeCard').innerHTML = '<h2 style="margin-top:50px;">You have viewed all jobs!</h2>';
        } else {
            document.getElementById('swipeCard').innerHTML = '<h2 style="margin-top:50px; color:#a89676;">Daily Limit Reached</h2><p style="margin-top:20px;">You have seen your Top 10 matches.<br>Upgrade to <b>Membership</b> to view unlimited jobs!</p>';
        }
    }
}

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