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
        const currentUserId = localStorage.getItem('currentUserId');
        const isMember = localStorage.getItem('isMember') === 'true';
        
        // 前端通过 API 拿数据，完美享受后端 SQLite 升级的红利！
        const jobsResponse = await fetch('/api/jobs'); 
        const allJobs = await jobsResponse.json();
        const myJobs = allJobs.filter(job => String(job.ownerId) === String(currentUserId));
        
        const candidatesResponse = await fetch('/api/candidates'); 
        let allCandidates = await candidatesResponse.json();

        if (!Array.isArray(allCandidates)) {
            allCandidates = allCandidates.data || allCandidates.candidates || [];
        }
        
        if (myJobs.length > 0 && allCandidates.length > 0) {
            const latestJob = myJobs[myJobs.length - 1]; 
            // 完美兼容：数据库里的 requiredSkills 字段
            const requiredSkills = (latestJob.requiredSkills || latestJob.skills || '').toLowerCase();
            const reqSkillArray = requiredSkills.split(',').map(s => s.trim()).filter(s => s !== '');

            allCandidates.forEach(candidate => {
                let matchScore = 0;
                // 兼容求职者数据库里的技能字段
                const candidateSkills = (candidate.skills || candidate.requiredSkills || '').toLowerCase();
                reqSkillArray.forEach(skill => {
                    if (candidateSkills.includes(skill)) {
                        matchScore += 10; 
                    }
                });
                candidate.matchScore = matchScore; 
            });
            allCandidates.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        } else {
            allCandidates = allCandidates.sort(() => Math.random() - 0.5);
        }
        
        candidates = isMember ? allCandidates : allCandidates.slice(0, 10);
        if (candidates.length > 0) {
            showCard(candidates[currentIndex]);
        } else {
            showEmptyState();
        }
    } catch (err) {
        console.error('Failed to load candidates:', err);
        const nameNode = document.getElementById('candidateName');
        if (nameNode) nameNode.textContent = 'Error loading candidates. Please check backend.';
    }
}

function showCard(candidate) {
    if (!candidate) return;
    const fullName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim();
    
    document.getElementById('candidateName').textContent = fullName || 'Unknown Candidate';
    document.getElementById('candidateRole').textContent = candidate.preferredWorkMode || 'N/A';
    document.getElementById('candidateEducation').textContent = candidate.educationLevel || 'N/A';
    document.getElementById('candidateExperience').textContent = candidate.yearsExperience || 'N/A';
    
    // 兼容前端展示字段
    const rawSkills = candidate.skills || candidate.requiredSkills || '';
    const allSkills = rawSkills.split(',').filter(s => s.trim() !== '');
    const topSkills = allSkills.slice(0, 4).join(', ');
    document.getElementById('candidateSkills').textContent = topSkills || 'No skills listed';
    document.getElementById('candidateDescription').textContent = candidate.workExperience || candidate.jobDescription || 'No experience detailed.';
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
            swipeCard.innerHTML = '<h2 style="text-align:center; padding: 40px 0; color: #504e4a;">No more candidates!</h2>';
        }
    }
}

const likeBtn = document.getElementById('likeBtn');
if (likeBtn) {
    likeBtn.addEventListener('click', () => {
        if (currentIndex >= candidates.length) return;
        const name = `${candidates[currentIndex].firstName || ''} ${candidates[currentIndex].lastName || ''}`.trim();
        
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
        const name = `${candidates[currentIndex].firstName || ''} ${candidates[currentIndex].lastName || ''}`.trim();
        
        const statusText = document.getElementById('statusText');
        if (statusText) statusText.textContent = `You passed: ${name}`;
        
        passedCount++;
        const passedCountNode = document.getElementById('passedCount');
        if (passedCountNode) passedCountNode.textContent = passedCount;
        
        nextCard();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCandidates();
});