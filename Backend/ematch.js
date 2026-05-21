const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}

let candidates = [];
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

function parseCsv(csvText) {
    const rows = [];
    let currentRow = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < csvText.length; i += 1) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"' && insideQuotes && nextChar === '"') {
            currentValue += '"';
            i += 1;
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentValue.trim());
            currentValue = '';
        } else if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i += 1;
            }

            currentRow.push(currentValue.trim());
            if (currentRow.some(function (value) { return value !== ''; })) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentValue = '';
        } else {
            currentValue += char;
        }
    }

    currentRow.push(currentValue.trim());
    if (currentRow.some(function (value) { return value !== ''; })) {
        rows.push(currentRow);
    }

    return rows;
}

function rowsToObjects(rows) {
    const headers = rows[0];
    const objects = [];

    for (let i = 1; i < rows.length; i += 1) {
        const row = rows[i];
        const object = {};

        for (let j = 0; j < headers.length; j += 1) {
            object[headers[j]] = row[j] || '';
        }

        objects.push(object);
    }

    return objects;
}

function shortenText(text, maxLength) {
    if (!text) {
        return 'No description available.';
    }

    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + '...';
}

function makeCandidateFromCsvRow(row, index) {
    const fullName = (row['First Name'] + ' ' + row['Last Name']).trim();

    return {
        name: fullName || 'Unnamed Candidate',
        role: row.workExperience || row.Major_Study || 'Role not listed',
        education: row.Education || 'Education not listed',
        experience: row.Experience ? row.Experience + ' years experience' : 'Experience not listed',
        skills: row.skills || 'Skills not listed',
        description: shortenText('Preferred location: ' + (row.preferredLocation || 'Not listed') + '. Preferred work mode: ' + (row.preferredWorkMode || 'Not listed') + '.', 420)
    };
}

function loadCandidates() {
    statusText.textContent = 'Loading candidate matches...';

    fetch('Database/jobSeekers.csv')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Could not load jobSeekers.csv');
            }
            return response.text();
        })
        .then(function (csvText) {
            const rows = parseCsv(csvText);
            const csvCandidates = rowsToObjects(rows);

            candidates = csvCandidates.map(makeCandidateFromCsvRow);
            currentIndex = 0;
            likedCandidates = 0;
            passedCandidates = 0;
            likedCount.textContent = likedCandidates;
            passedCount.textContent = passedCandidates;

            statusText.textContent = 'No action taken yet.';
            showCandidate();
        })
        .catch(function (error) {
            swipeCard.innerHTML = '<h2>Unable to load candidates</h2><p>Please check that Database/jobSeekers.csv exists and that the website is being run through a local server.</p>';
            statusText.textContent = error.message;
        });
}

function showCandidate() {
    if (currentIndex >= candidates.length) {
        swipeCard.innerHTML = '<h2>No more candidates</h2><p>You have reviewed all available matches.</p>';
        statusText.textContent = 'Finished reviewing candidates.';
        return;
    }

    const candidate = candidates[currentIndex];
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

loadCandidates();
