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

function getCandidateName(candidate) {
    var firstName = candidate.firstName || candidate['First Name'] || '';
    var lastName = candidate.lastName || candidate['Last Name'] || '';
    return (firstName + ' ' + lastName).trim() || 'Unknown Candidate';
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
        var skillStr = candidatesData[i].skills || '';
        var skillList = skillStr.split(',');

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
    addOptions(educationFilter, getUniqueValues('educationLevel') || getUniqueValues('Education'));
    addOptions(workModeFilter, getUniqueValues('preferredWorkMode'));
    addOptions(studyCategoryFilter, getUniqueValues('Study_Category') || getUniqueValues('majorStudy'));
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
    var numberValue = Number(String(value || '0').replace(/[^0-9.]/g, ''));
    return numberValue >= minimum && numberValue < maximum;
}

function escapeHtml(value) {
    return String(value || '')
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

        var exp = candidate.yearsExperience || candidate.Experience || '0';
        var edu = candidate.educationLevel || candidate.Education || 'N/A';
        var category = candidate.Study_Category || candidate.majorStudy || 'General';
        var workExp = candidate.workExperience || 'No experience detailed.';

        card.innerHTML = '' +
            '<h3>' + escapeHtml(getCandidateName(candidate)) + '</h3>' +
            '<div class="skills">' + escapeHtml(candidate.skills || 'No skills listed') + '</div>' +
            '<div class="experience">' + escapeHtml(exp) + ' year(s) experience</div>' +
            '<div class="tags">' +
                '<span class="tag">' + escapeHtml(candidate.preferredLocation || 'Any') + '</span>' +
                '<span class="tag">' + escapeHtml(candidate.preferredWorkMode || 'Any') + '</span>' +
                '<span class="tag">' + escapeHtml(edu) + '</span>' +
                '<span class="tag">' + escapeHtml(category) + '</span>' +
            '</div>' +
            '<p class="location">' + escapeHtml(workExp) + '</p>' +
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
        var skills = (candidate.skills || '').toLowerCase();
        var workExp = (candidate.workExperience || '').toLowerCase();
        var studyCat = (candidate.Study_Category || candidate.majorStudy || '').toLowerCase();

        var matchesSearch = candidateName.indexOf(searchTerm) !== -1 ||
                            skills.indexOf(searchTerm) !== -1 ||
                            workExp.indexOf(searchTerm) !== -1 ||
                            studyCat.indexOf(searchTerm) !== -1;

        var matchesLocation = valueMatchesDropdown(candidate.preferredLocation, selectedLocation);
        var matchesSkill = selectedSkill === 'all' || skills.indexOf(selectedSkill.toLowerCase()) !== -1;
        var matchesEducation = valueMatchesDropdown(candidate.educationLevel || candidate.Education, selectedEducation);
        var matchesExperience = valueMatchesRange(candidate.yearsExperience || candidate.Experience, selectedExperience);
        var matchesWorkMode = valueMatchesDropdown(candidate.preferredWorkMode, selectedWorkMode);
        var matchesStudyCategory = valueMatchesDropdown(candidate.Study_Category || candidate.majorStudy, selectedStudyCategory);
        var matchesGender = valueMatchesDropdown(candidate.Sex, selectedGender);
        var matchesAge = valueMatchesRange(candidate.Age, selectedAge);

        return matchesSearch && matchesLocation && matchesSkill && matchesEducation &&
               matchesExperience && matchesWorkMode && matchesStudyCategory && matchesGender && matchesAge;
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

fetch('/api/candidates')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log('Candidates loaded successfully from SQLite');
        candidatesData = data;
        setupFilterOptions();
        renderCandidates(candidatesData);
    })
    .catch(function (err) {
        console.error('Fetch error:', err);
        candidateGrid.innerHTML = '<p>Unable to load candidate listings. Please ensure the server is running.</p>';
    });