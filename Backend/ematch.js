const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}

let allCandidatesRaw = []; 
let candidates = [];      
let currentIndex = 0;
let likedCount = 0;
let passedCount = 0;

async function initEMatch() {
    try {
        const currentUserId = localStorage.getItem('currentUserId') || '1001';
        const jobSelect = document.getElementById('jobSelect');
        const [jobsRes, candidatesRes] = await Promise.all([
            fetch(`/api/jobs/owner/${currentUserId}`),
            fetch('/api/candidates')
        ]);

        const myJobs = await jobsRes.json();
        let allCandidates = await candidatesRes.json();

        if (!Array.isArray(allCandidates)) {
            allCandidates = allCandidates.data || allCandidates.candidates || [];
        }
        allCandidatesRaw = allCandidates; 

        if (jobSelect) {
            jobSelect.innerHTML = ''; 
            if (myJobs.length === 0) {
                jobSelect.innerHTML = '<option value="">You haven\'t posted any jobs yet</option>';
                candidates = allCandidatesRaw.sort(() => Math.random() - 0.5);
                triggerCardRender();
                return;
            }

            myJobs.forEach((job, index) => {
                const option = document.createElement('option');
                option.value = job.jobID; 
                option.textContent = `${job.jobTitle} (${job.companyName || 'My Company'})`;
                if (index === myJobs.length - 1) option.selected = true;
                jobSelect.appendChild(option);
            });

            jobSelect.addEventListener('change', (e) => {
                const selectedJobId = e.target.value;
                const activeJob = myJobs.find(j => String(j.jobID) === String(selectedJobId));
                runMatchingAlgorithm(activeJob);
            });

            const defaultJob = myJobs[myJobs.length - 1];
            runMatchingAlgorithm(defaultJob);
        }

    } catch (err) {
        console.error('Failed to initialize ematch page:', err);
        const nameNode = document.getElementById('candidateName');
        if (nameNode) nameNode.textContent = 'Error loading data. Please check backend.';
    }
}

function runMatchingAlgorithm(selectedJob) {
    if (!selectedJob || allCandidatesRaw.length === 0) return;

    const requiredSkills = (selectedJob.requiredSkills || selectedJob.skills || '').toLowerCase();
    const reqSkillArray = requiredSkills.split(',').map(s => s.trim()).filter(s => s !== '');
    allCandidatesRaw.forEach(candidate => {
        let matchScore = 0;
        const candidateSkills = (candidate.skills || '').toLowerCase();
        
        reqSkillArray.forEach(skill => {
            if (candidateSkills.includes(skill)) {
                matchScore += 10; 
            }
        });
        candidate.matchScore = matchScore; 
    });

    allCandidatesRaw.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    const isMember = localStorage.getItem('isMember') === 'true';
    candidates = isMember ? allCandidatesRaw : allCandidatesRaw.slice(0, 10);

    currentIndex = 0;
    triggerCardRender();
}

function triggerCardRender() {
    const swipeCard = document.getElementById('swipeCard');
    if (swipeCard && swipeCard.innerHTML.includes('No more')) {
        window.location.reload(); 
        return;
    }

    if (candidates.length > 0) {
        showCard(candidates[currentIndex]);
    } else {
        showEmptyState();
    }
}

function showCard(candidate) {
    if (!candidate) return;
    const fName = candidate.firstName || candidate['First Name'] || '';
    const lName = candidate.lastName || candidate['Last Name'] || '';
    const fullName = `${fName} ${lName}`.trim();
    const scoreTag = candidate.matchScore > 0 ? ` <span style="color:#a89676; font-size:0.7em;">(Match: ${candidate.matchScore} pts)</span>` : ' <span style="color:#999; font-size:0.7em;">(No Skill Match)</span>';

    document.getElementById('candidateName').innerHTML = (fullName || 'Unknown Candidate') + scoreTag;
    document.getElementById('candidateRole').textContent = candidate.preferredWorkMode || 'N/A';
    document.getElementById('candidateEducation').textContent = candidate.educationLevel || candidate.Education || 'N/A';
    document.getElementById('candidateExperience').textContent = (candidate.yearsExperience || candidate.Experience || '0') + ' yrs';
    
    const rawSkills = candidate.skills || '';
    const allSkills = rawSkills.split(',').filter(s => s.trim() !== '');
    const topSkills = allSkills.slice(0, 4).join(', ');
    document.getElementById('candidateSkills').textContent = topSkills || 'No skills listed';
    document.getElementById('candidateDescription').textContent = candidate.workExperience || 'No experience detailed.';
}

function showEmptyState() {
    document.getElementById('candidateName').textContent = 'No candidates available';
    document.getElementById('candidateRole').textContent = '';
    document.getElementById('candidateEducation').textContent = '';
    document.getElementById('candidateExperience').textContent = '';
    document.getElementById('candidateSkills').textContent = '';
    document.getElementById('candidateDescription').textContent = '';
}

function nextCard() {
    currentIndex++;
    if (currentIndex < candidates.length) {
        showCard(candidates[currentIndex]);
    } else {
        const swipeCard = document.getElementById('swipeCard');
        if (swipeCard) {
            swipeCard.innerHTML = '<h2 style="text-align:center; padding: 40px 0; color: #504e4a;">No more candidates for this job!</h2>';
        }
    }
}

const likeBtn = document.getElementById('likeBtn');
if (likeBtn) {
    likeBtn.addEventListener('click', () => {
        if (currentIndex >= candidates.length) return;
        const fName = candidates[currentIndex].firstName || candidates[currentIndex]['First Name'] || '';
        const lName = candidates[currentIndex].lastName || candidates[currentIndex]['Last Name'] || '';
        const name = `${fName} ${lName}`.trim();
        
        const statusText = document.getElementById('statusText');
        if (statusText) statusText.textContent = `You liked: ${name}`;
        
        likedCount++;
        const likedCountNode = document.getElementById('likedCount');
        if (likedCountNode) likedCountNode.textContent = likedCount;
        
        nextCard();
    });
}

const passBtn = document.getElementById('passBtn');
if (passBtn) {
    passBtn.addEventListener('click', () => {
        if (currentIndex >= candidates.length) return;
        const fName = candidates[currentIndex].firstName || candidates[currentIndex]['First Name'] || '';
        const lName = candidates[currentIndex].lastName || candidates[currentIndex]['Last Name'] || '';
        const name = `${fName} ${lName}`.trim();
        
        const statusText = document.getElementById('statusText');
        if (statusText) statusText.textContent = `You passed: ${name}`;
        
        passedCount++;
        const passedCountNode = document.getElementById('passedCount');
        if (passedCountNode) passedCountNode.textContent = passedCount;
        
        nextCard();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initEMatch();
});