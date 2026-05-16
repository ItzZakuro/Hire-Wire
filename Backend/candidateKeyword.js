const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}

var candidatesData = [];

var candidateGrid = document.getElementById('candidateGrid');
var searchInput = document.getElementById('searchInput');
var categoryFilter = document.getElementById('categoryFilter'); // might need change this part

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

function convertRowsToCandidates(rows) {
    var headers = rows[0];
    var candidates = [];

    for (var i = 1; i < rows.length; i += 1) {
        var row = rows[i];
        var candidate = {};

        for (var j = 0; j < headers.length; j += 1) {
            candidate[headers[j]] = row[j] || '';
        }

        candidates.push(candidate);
    }

    return candidates;
}

/*function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#039;');
}*/

function renderCandidates(candidatesToRender) {
    candidateGrid.innerHTML = ''; 

    if (candidatesToRender.length === 0) {
        candidateGrid.innerHTML = '<p>No candidates found matching your criteria.</p>';
        return;
    }

    candidatesToRender.forEach(candidate => {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.innerHTML = `
            <h3>${candidate.name}</h3>
            <div class="skills">${candidate.skills.split(' ').join(', ')}</div>
            <div class="experience">${candidate.experience}</div>
            <div class="location">${candidate.location}</div>
            <a href="#" class="select-btn">Select Candidate</a>
        `;
        candidateGrid.appendChild(card);
    });
}
/*function renderCandidates(candidatesToRender) {
    candidateGrid.innerHTML = '';

    if (candidatesToRender.length === 0) {
        candidateGrid.innerHTML = '<p>No candidates found matching your criteria.</p>';
        return;
    }

    for (var i = 0; i < candidatesToRender.length; i += 1) {
        var candidate = candidatesToRender[i];
        var card = document.createElement('div');
        card.className = 'candidate-card';

        card.innerHTML = '' +
            '<h3>' + escapeHtml(candidate.name) + '</h3>' +
            '<p>' + escapeHtml(candidate.skills) + '</p>' +
            '<div class="company">' + escapeHtml(candidate.workExperience) + '</div>' +
            '<a href="#" class="select-btn">Select Candidate</a>';
            
        candidateGrid.appendChild(card);
    }
}*/
function filterCandidates() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredCandidates = candidatesData.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm) ||
                              candidate.skills.toLowerCase().includes(searchTerm) ||
                              //candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm))
                              candidate.experience.toLowerCase().includes(searchTerm);
                
        const matchesCategory = selectedCategory === 'all' || candidate.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderCandidates(filteredCandidates);
}
/*function searchCandidates() {
    var searchTerm = searchInput.value.toLowerCase();
    var searchResults = candidatesData.filter(function(candidate) {
        return candidate.name.toLowerCase().includes(searchTerm) ||
               candidate.skills.toLowerCase().includes(searchTerm) ||
               candidate.workExperience.toLowerCase().includes(searchTerm);
    });
    renderJobs(searchResults);
}*/
searchInput.addEventListener('input', filterCandidates);
categoryFilter.addEventListener('change', filterCandidates);

fetch('Database/jobSeekers.csv')
    .then(function (response) {
        return response.text();
    })
    .then(function (csvText) {
        candidatesData = convertRowsToCandidates(parseCsv(csvText));
        renderCandidates(candidatesData);
    })
    .catch(function () {
        candidateGrid.innerHTML = '<p>Unable to load job seekers. Please run this website through a local server so the CSV file can be loaded.</p>';
    });