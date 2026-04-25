const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}

const candidates = [
    {
        name: 'Alex Carter',
        role: 'Frontend Developer',
        education: 'University of Technology Sydney',
        experience: '1 year internship, 3 years working',
        skills: 'HTML, CSS, JavaScript, React',
        description: 'I love creating interactive websites and applications.',
        image: 'img1.jpg' 
    },
    {
        name: 'Priya Singh',
        role: 'HR Coordinator',
        education: 'University of Melbourne',
        experience: '2 years working',
        skills: 'Recruitment, Employee Relations, Onboarding',
        description: 'Passionate about finding the right talent and building strong teams.',
        image: 'img2.jpg'
    },
    {
        name: 'Daniel Lee',
        role: 'Software Engineer',
        education: 'UNSW',
        experience: '5 years working',
        skills: 'Java, Python, AWS, Docker',
        description: 'Experienced in building scalable backend services.',
        image: 'img3.jpg'
    },
    {
        name: 'Sarah Chen',
        role: 'UI Designer',
        education: 'RMIT University',
        experience: 'Graduate',
        skills: 'Figma, Adobe XD, User Research',
        description: 'Creative designer focused on intuitive user experiences.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80' 
    }
];

let currentIndex = 0;
let likedCandidates = 0;
let passedCandidates = 0;

const candidateImage = document.getElementById('candidateImage');
const candidateName = document.getElementById('candidateName');
const candidateRole = document.getElementById('candidateRole');
const candidateEducation = document.getElementById('candidateEducation');
const candidateExperience = document.getElementById('candidateExperience');
const candidateSkills = document.getElementById('candidateSkills');
const candidateDescription = document.getElementById('candidateDescription');
const statusText = document.getElementById('statusText');
const likedCount = document.getElementById('likedCount');
const passedCount = document.getElementById('passedCount');
const likeBtn = document.getElementById('likeBtn');
const passBtn = document.getElementById('passBtn');
const swipeCard = document.getElementById('swipeCard');

function showCandidate() {
    if (currentIndex >= candidates.length) {
        swipeCard.innerHTML = '<h2>No more candidates</h2><p>You have reviewed all available matches.</p>';
        statusText.textContent = 'Finished reviewing candidates.';
        return;
    }

    const candidate = candidates[currentIndex];
    candidateImage.src = candidate.image;
    candidateName.textContent = candidate.name;
    candidateRole.textContent = candidate.role;
    candidateEducation.textContent = candidate.education;
    candidateExperience.textContent = candidate.experience;
    candidateSkills.textContent = candidate.skills;
    candidateDescription.textContent = candidate.description;
}

function likeCandidate() {
    if (currentIndex < candidates.length) {
        statusText.textContent = 'You liked ' + candidates[currentIndex].name + ' for the ' + candidates[currentIndex].role + ' role.';
        likedCandidates++;
        likedCount.textContent = likedCandidates;
        currentIndex++;
        showCandidate();
    }
}

function passCandidate() {
    if (currentIndex < candidates.length) {
        statusText.textContent = 'You passed on ' + candidates[currentIndex].name + '.';
        passedCandidates++;
        passedCount.textContent = passedCandidates;
        currentIndex++;
        showCandidate();
    }
}

if (likeBtn && passBtn) {
    likeBtn.addEventListener('click', likeCandidate);
    passBtn.addEventListener('click', passCandidate);
}

showCandidate();