var menuBtn = document.getElementById('menuBtn');
var navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}

var jobsData = [];

var jobGrid = document.getElementById('jobGrid');
var searchInput = document.getElementById('searchInput');

function parseCsv(csvText) {
    var rows = [];
    var row = [];
    var currentValue = '';
    var insideQuotes = false;

    for (var i = 0; i < csvText.length; i += 1) {
        var character = csvText[i];
        var nextCharacter = csvText[i + 1];

        if (character === '"' && insideQuotes && nextCharacter === '"') {
            currentValue += '"';
            i += 1;
        } else if (character === '"') {
            insideQuotes = !insideQuotes;
        } else if (character === ',' && !insideQuotes) {
            row.push(currentValue);
            currentValue = '';
        } else if ((character === '\n' || character === '\r') && !insideQuotes) {
            if (character === '\r' && nextCharacter === '\n') {
                i += 1;
            }
            row.push(currentValue);
            if (row.length > 1 || row[0] !== '') {
                rows.push(row);
            }
            row = [];
            currentValue = '';
        } else {
            currentValue += character;
        }
    }

    if (currentValue !== '' || row.length > 0) {
        row.push(currentValue);
        rows.push(row);
    }

    return rows;
}

function convertRowsToJobs(rows) {
    var headers = rows[0];
    var jobs = [];

    for (var i = 1; i < rows.length; i += 1) {
        var row = rows[i];
        var job = {};

        for (var j = 0; j < headers.length; j += 1) {
            job[headers[j]] = row[j] || '';
        }

        jobs.push(job);
    }

    return jobs;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderJobs(jobsToRender) {
    jobGrid.innerHTML = '';

    if (jobsToRender.length === 0) {
        jobGrid.innerHTML = '<p>No jobs, skills or company found matching your criteria.</p>';
        return;
    }

    for (var i = 0; i < jobsToRender.length; i += 1) {
        var job = jobsToRender[i];
        var card = document.createElement('div');
        card.className = 'job-card';

        card.innerHTML = '' +
            '<h3>' + escapeHtml(job.jobTitle) + '</h3>' +
            '<p>' + escapeHtml(job.requiredSkills) + '</p>' +
            '<div class="company">' + escapeHtml(job.companyName) + '</div>';
            
        jobGrid.appendChild(card);
    }
}

function searchJobs() {
    var searchTerm = searchInput.value.toLowerCase();
    var searchResults = jobsData.filter(function(job) {
        return job.jobTitle.toLowerCase().includes(searchTerm) ||
               job.requiredSkills.toLowerCase().includes(searchTerm) ||
               job.companyName.toLowerCase().includes(searchTerm);
    });
    renderJobs(searchResults);
}

searchInput.addEventListener('input', searchJobs);

fetch('Database/jobListings.csv')
    .then(function (response) {
        return response.text();
    })
    .then(function (csvText) {
        jobsData = convertRowsToJobs(parseCsv(csvText));
        renderJobs(jobsData);
    })
    .catch(function () {
        jobGrid.innerHTML = '<p>Unable to load job listings. Please run this website through a local server so the CSV file can be loaded.</p>';
    });