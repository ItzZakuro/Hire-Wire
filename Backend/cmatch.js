const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}


// Backend/cmatch.js

let jobs = [];         // will hold all jobs from DB
let currentIndex = 0;
let likedCount = 0;
let passedCount = 0;

// ── Load jobs from the API on page load ─────────────
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

// ── Populate the swipe card with a job object ────────
function showCard(job) {
    document.getElementById('jobTitle').textContent       = job.jobTitle;
    document.getElementById('companyName').textContent    = job.companyName;
    document.getElementById('jobLocation').textContent    = job.jobLocation;
    document.getElementById('jobType').textContent        = job.workMode;
    // Add $ and , to salary
    const formattedSalary = '$' + Number(job.salary).toLocaleString();
    document.getElementById('salary').textContent = formattedSalary;
    // Only show first 4 skills
    const allSkills = job.requiredSkills.split(',');
    const topSkills = allSkills.slice(0, 4).join(', ');
    document.getElementById('jobSkills').textContent = topSkills;
    // Show only first 2 sentences of description
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

// ── Button handlers ──────────────────────────────────
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


// ── Start ────────────────────────────────────────────
loadJobs();


/*
let jobs = [];
let currentIndex = 0;
let likedJobs = 0;
let passedJobs = 0;

const jobTitle = document.getElementById('jobTitle');
const companyName = document.getElementById('companyName');
const jobLocation = document.getElementById('jobLocation');
const jobType = document.getElementById('jobType');
const jobSkills = document.getElementById('jobSkills');
const jobDescription = document.getElementById('jobDescription');
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

function makeJobFromCsvRow(row) {
    return {
        title: row.jobTitle || 'Untitled Job',
        company: row.companyName || 'Unknown Company',
        location: row.jobLocation || 'Location not listed',
        type: row.workMode || 'Work mode not listed',
        skills: row.requiredSkills || 'Skills not listed',
        description: shortenText(row.jobDescription, 420),
    };
}

function loadJobs() {
    statusText.textContent = 'Loading job matches...';

    fetch('Database/jobListings.csv')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Could not load jobListings.csv');
            }
            return response.text();
        })
        .then(function (csvText) {
            const rows = parseCsv(csvText);
            const csvJobs = rowsToObjects(rows);

            jobs = csvJobs.map(makeJobFromCsvRow);
            currentIndex = 0;
            likedJobs = 0;
            passedJobs = 0;
            likedCount.textContent = likedJobs;
            passedCount.textContent = passedJobs;

            statusText.textContent = 'No action taken yet.';
            showJob();
        })
        .catch(function (error) {
            swipeCard.innerHTML = '<h2>Unable to load jobs</h2><p>Please check that Database/jobListings.csv exists and that the website is being run through a local server.</p>';
            statusText.textContent = error.message;
        });
}

function showJob() {
    if (currentIndex >= jobs.length) {
        swipeCard.innerHTML = '<h2>No more job cards</h2><p>You have reviewed all available matches.</p>';
        statusText.textContent = 'Finished reviewing job matches.';
        return;
    }

    const job = jobs[currentIndex];
    jobTitle.textContent = job.title;
    companyName.textContent = job.company;
    jobLocation.textContent = job.location;
    jobType.textContent = job.type;
    jobSkills.textContent = job.skills;
    jobDescription.textContent = job.description;
}

function likeJob() {
    if (currentIndex < jobs.length) {
        statusText.textContent = 'You liked ' + jobs[currentIndex].title + ' at ' + jobs[currentIndex].company + '.';
        likedJobs += 1;
        likedCount.textContent = likedJobs;
        currentIndex += 1;
        showJob();
    }
}

function passJob() {
    if (currentIndex < jobs.length) {
        statusText.textContent = 'You passed on ' + jobs[currentIndex].title + ' at ' + jobs[currentIndex].company + '.';
        passedJobs += 1;
        passedCount.textContent = passedJobs;
        currentIndex += 1;
        showJob();
    }
}

if (likeBtn && passBtn) {
    likeBtn.addEventListener('click', likeJob);
    passBtn.addEventListener('click', passJob);
}

loadJobs();
*/