var menuBtn = document.getElementById('menuBtn');
var navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('show');
    });
}

var candidatesData = [];
var candidateGrid = document.getElementById('candidateGrid');
var searchInput = document.getElementById('searchInput');
var filterToggle = document.getElementById('filterToggle');
var filterPanel = document.getElementById('filterPanel');
var clearFilters = document.getElementById('clearFilters');
var resultsCount = document.getElementById('resultsCount');

var locationFilter = document.getElementById('locationFilter');
var skillsFilter = document.getElementById('skillsFilter');
var educationFilter = document.getElementById('educationFilter');
var experienceFilter = document.getElementById('experienceFilter');
var workModeFilter = document.getElementById('workModeFilter');
var studyCategoryFilter = document.getElementById('studyCategoryFilter');
var genderFilter = document.getElementById('genderFilter');
var ageFilter = document.getElementById('ageFilter');

var allFilters = [
    locationFilter,
    skillsFilter,
    educationFilter,
    experienceFilter,
    workModeFilter,
    studyCategoryFilter,
    genderFilter,
    ageFilter
];

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

function getCandidateName(candidate) {
    return (candidate['First Name'] + ' ' + candidate['Last Name']).trim();
}

function getUniqueValues(fieldName) {
    var values = [];

    for (var i = 0; i < candidatesData.length; i += 1) {
        var value = candidatesData[i][fieldName];

        if (value && values.indexOf(value) === -1) {
            values.push(value);
        }
    }

    values.sort();
    return values;
}

function getUniqueSkills() {
    var skills = [];

    for (var i = 0; i < candidatesData.length; i += 1) {
        var skillList = candidatesData[i].skills.split(',');

        for (var j = 0; j < skillList.length; j += 1) {
            var skill = skillList[j].trim();

            if (skill !== '' && skills.indexOf(skill) === -1) {
                skills.push(skill);
            }
        }
    }

    skills.sort();
    return skills;
}

function addOptions(selectElement, values) {
    for (var i = 0; i < values.length; i += 1) {
        var option = document.createElement('option');
        option.value = values[i];
        option.textContent = values[i];
        selectElement.appendChild(option);
    }
}

function setupFilterOptions() {
    addOptions(locationFilter, getUniqueValues('preferredLocation'));
    addOptions(skillsFilter, getUniqueSkills());
    addOptions(educationFilter, getUniqueValues('Education'));
    addOptions(workModeFilter, getUniqueValues('preferredWorkMode'));
    addOptions(studyCategoryFilter, getUniqueValues('Study_Category'));
    addOptions(genderFilter, getUniqueValues('Sex'));
}

function valueMatchesDropdown(candidateValue, selectedValue) {
    return selectedValue === 'all' || candidateValue === selectedValue;
}

function valueMatchesRange(value, selectedRange) {
    if (selectedRange === 'all') {
        return true;
    }

    var parts = selectedRange.split('-');
    var minimum = Number(parts[0]);
    var maximum = Number(parts[1]);
    var numberValue = Number(String(value).replace(/[^0-9.]/g, ''));

    return numberValue >= minimum && numberValue < maximum;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderCandidates(candidatesToRender) {
    candidateGrid.innerHTML = '';
    resultsCount.textContent = candidatesToRender.length + ' candidate listing(s) found';

    if (candidatesToRender.length === 0) {
        candidateGrid.innerHTML = '<p>No candidates found matching your criteria.</p>';
        return;
    }

    for (var i = 0; i < candidatesToRender.length; i += 1) {
        var candidate = candidatesToRender[i];
        var card = document.createElement('div');
        card.className = 'candidate-card';

        card.innerHTML = '' +
            '<h3>' + escapeHtml(getCandidateName(candidate)) + '</h3>' +
            '<div class="skills">' + escapeHtml(candidate.skills) + '</div>' +
            '<div class="experience">' + escapeHtml(candidate.Experience) + ' year(s) experience</div>' +
            '<div class="tags">' +
                '<span class="tag">' + escapeHtml(candidate.preferredLocation) + '</span>' +
                '<span class="tag">' + escapeHtml(candidate.preferredWorkMode) + '</span>' +
                '<span class="tag">' + escapeHtml(candidate.Education) + '</span>' +
                '<span class="tag">' + escapeHtml(candidate.Study_Category) + '</span>' +
            '</div>' +
            '<p class="location">' + escapeHtml(candidate.workExperience) + '</p>' +
            '<a href="#" class="select-btn">Select Candidate</a>';

        candidateGrid.appendChild(card);
    }
}

function filterCandidates() {
    var searchTerm = searchInput.value.toLowerCase();
    var selectedLocation = locationFilter.value;
    var selectedSkill = skillsFilter.value;
    var selectedEducation = educationFilter.value;
    var selectedExperience = experienceFilter.value;
    var selectedWorkMode = workModeFilter.value;
    var selectedStudyCategory = studyCategoryFilter.value;
    var selectedGender = genderFilter.value;
    var selectedAge = ageFilter.value;

    var filteredCandidates = candidatesData.filter(function (candidate) {
        var candidateName = getCandidateName(candidate).toLowerCase();
        var matchesSearch = candidateName.indexOf(searchTerm) !== -1 ||
                            candidate.skills.toLowerCase().indexOf(searchTerm) !== -1 ||
                            candidate.workExperience.toLowerCase().indexOf(searchTerm) !== -1 ||
                            candidate.Study_Category.toLowerCase().indexOf(searchTerm) !== -1;

        var matchesLocation = valueMatchesDropdown(candidate.preferredLocation, selectedLocation);
        var matchesSkill = selectedSkill === 'all' || candidate.skills.indexOf(selectedSkill) !== -1;
        var matchesEducation = valueMatchesDropdown(candidate.Education, selectedEducation);
        var matchesExperience = valueMatchesRange(candidate.Experience, selectedExperience);
        var matchesWorkMode = valueMatchesDropdown(candidate.preferredWorkMode, selectedWorkMode);
        var matchesStudyCategory = valueMatchesDropdown(candidate.Study_Category, selectedStudyCategory);
        var matchesGender = valueMatchesDropdown(candidate.Sex, selectedGender);
        var matchesAge = valueMatchesRange(candidate.Age, selectedAge);

        return matchesSearch &&
               matchesLocation &&
               matchesSkill &&
               matchesEducation &&
               matchesExperience &&
               matchesWorkMode &&
               matchesStudyCategory &&
               matchesGender &&
               matchesAge;
    });

    renderCandidates(filteredCandidates);
}

function clearAllFilters() {
    searchInput.value = '';

    for (var i = 0; i < allFilters.length; i += 1) {
        allFilters[i].value = 'all';
    }

    filterCandidates();
}

filterToggle.addEventListener('click', function () {
    filterPanel.classList.toggle('show');
});

searchInput.addEventListener('input', filterCandidates);
clearFilters.addEventListener('click', clearAllFilters);

for (var i = 0; i < allFilters.length; i += 1) {
    allFilters[i].addEventListener('change', filterCandidates);
}

fetch('Database/jobSeekers.csv')
    .then(function (response) {
        return response.text();
    })
    .then(function (csvText) {
        candidatesData = convertRowsToCandidates(parseCsv(csvText));
        setupFilterOptions();
        renderCandidates(candidatesData);
    })
    .catch(function () {
        candidateGrid.innerHTML = '<p>Unable to load candidate listings. Please run this website through a local server so the CSV file can be loaded.</p>';
    });