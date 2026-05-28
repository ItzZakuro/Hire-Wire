var searchInput = document.getElementById('searchInput');
var resultsCount = document.getElementById('resultsCount');
var jobGrid = document.getElementById('jobGrid');
var candidateGrid = document.getElementById('candidateGrid');
var clearFilters = document.getElementById('clearFilters');
var locationFilter = document.getElementById('locationFilter');
var skillsFilter = document.getElementById('skillsFilter');
var educationFilter = document.getElementById('educationFilter');
var salaryFilter = document.getElementById('salaryFilter');
var workModeFilter = document.getElementById('workModeFilter');
var companyFilter = document.getElementById('companyFilter');
var assetsFilter = document.getElementById('assetsFilter');
var sectorFilter = document.getElementById('sectorFilter');
var experienceFilter = document.getElementById('experienceFilter');
var studyCategoryFilter = document.getElementById('studyCategoryFilter');
var genderFilter = document.getElementById('genderFilter');
var ageFilter = document.getElementById('ageFilter');

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function normaliseText(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getValue(item, fieldName) {
    if (!item || item[fieldName] === undefined || item[fieldName] === null) {
        return '';
    }
    return String(item[fieldName]);
}

function selectedValue(selectElement) {
    if (!selectElement) {
        return 'all';
    }
    return selectElement.value || 'all';
}

function valueMatchesDropdown(itemValue, selected) {
    return selected === 'all' || String(itemValue || '') === selected;
}

function valueMatchesRange(value, selectedRange) {
    if (selectedRange === 'all') {
        return true;
    }
    var parts = selectedRange.split('-');
    var minimum = Number(parts[0]);
    var maximum = Number(parts[1]);
    var numberValue = Number(String(value || '').replace(/[^0-9.]/g, ''));
    return numberValue >= minimum && numberValue < maximum;
}

function getAssetRange(assetText) {
    var assetNumber = Number(String(assetText || '').replace(/[^0-9.]/g, ''));
    if (assetNumber < 5000) {
        return '0-5000';
    }
    if (assetNumber < 10000) {
        return '5000-10000';
    }
    if (assetNumber < 15000) {
        return '10000-15000';
    }
    return '15000-999999999';
}

function splitSearchTerms(searchTerm) {
    var text = normaliseText(searchTerm);
    if (text === '') {
        return [];
    }
    return text.split(' ');
}

function editDistance(firstText, secondText) {
    var firstLength = firstText.length;
    var secondLength = secondText.length;
    var previousRow = [];
    var currentRow = [];
    var i;
    var j;
    var insertCost;
    var deleteCost;
    var replaceCost;
    for (j = 0; j <= secondLength; j += 1) {
        previousRow[j] = j;
    }
    for (i = 1; i <= firstLength; i += 1) {
        currentRow = [i];
        for (j = 1; j <= secondLength; j += 1) {
            insertCost = currentRow[j - 1] + 1;
            deleteCost = previousRow[j] + 1;
            replaceCost = previousRow[j - 1];
            if (firstText[i - 1] !== secondText[j - 1]) {
                replaceCost += 1;
            }
            currentRow[j] = Math.min(insertCost, deleteCost, replaceCost);
        }
        previousRow = currentRow;
    }
    return previousRow[secondLength];
}

function allowedDistance(term) {
    if (term.length <= 2) {
        return 0;
    }
    if (term.length <= 4) {
        return 1;
    }
    if (term.length <= 7) {
        return 2;
    }
    return 3;
}

function fuzzyTermMatchesText(term, text) {
    var normalText = normaliseText(text);
    var words;
    var maximumDistance;
    var i;
    var word;
    if (term === '') {
        return true;
    }
    if (normalText.indexOf(term) !== -1) {
        return true;
    }
    words = normalText.split(' ');
    maximumDistance = allowedDistance(term);
    for (i = 0; i < words.length; i += 1) {
        word = words[i];
        if (word !== '' && Math.abs(word.length - term.length) <= maximumDistance) {
            if (editDistance(term, word) <= maximumDistance) {
                return true;
            }
        }
    }
    return false;
}

function getFuzzyScore(searchTerm, fieldGroups) {
    var terms = splitSearchTerms(searchTerm);
    var score = 0;
    var i;
    var j;
    var term;
    var fieldText;
    var normalFieldText;
    if (terms.length === 0) {
        return 1;
    }
    for (i = 0; i < terms.length; i += 1) {
        term = terms[i];
        var termMatched = false;
        for (j = 0; j < fieldGroups.length; j += 1) {
            fieldText = fieldGroups[j].text;
            normalFieldText = normaliseText(fieldText);
            if (fuzzyTermMatchesText(term, normalFieldText)) {
                termMatched = true;
                if (normalFieldText.indexOf(term) !== -1) {
                    score += fieldGroups[j].weight * 2;
                }
                else {
                    score += fieldGroups[j].weight;
                }
            }
        }
        if (!termMatched) {
            return 0;
        }
    }
    return score;
}

function getCandidateName(candidate) {
    return (getValue(candidate, 'First Name') + ' ' + getValue(candidate, 'Last Name')).trim();
}

function getJobFields(job) {
    return [
        { text: getValue(job, 'jobTitle'), weight: 10 },
        { text: getValue(job, 'requiredSkills'), weight: 8 },
        { text: getValue(job, 'companyName'), weight: 6 },
        { text: getValue(job, 'jobLocation'), weight: 4 },
        { text: getValue(job, 'workMode'), weight: 4 },
        { text: getValue(job, 'educationLevel'), weight: 3 },
        { text: getValue(job, 'companySector'), weight: 3 },
        { text: getValue(job, 'jobDescription'), weight: 2 },
        { text: getValue(job, 'experience'), weight: 2 },
        { text: getValue(job, 'salary'), weight: 1 },
        { text: getValue(job, 'companyAssets'), weight: 1 },
        { text: getValue(job, 'companyCeo') + ' ' + getValue(job, 'companyCEO'), weight: 1 }
    ];
}

function getCandidateFields(candidate) {
    return [
        { text: getCandidateName(candidate), weight: 10 },
        { text: getValue(candidate, 'skills'), weight: 8 },
        { text: getValue(candidate, 'workExperience'), weight: 6 },
        { text: getValue(candidate, 'Study_Category'), weight: 5 },
        { text: getValue(candidate, 'preferredLocation'), weight: 4 },
        { text: getValue(candidate, 'preferredWorkMode'), weight: 4 },
        { text: getValue(candidate, 'Education'), weight: 3 },
        { text: getValue(candidate, 'Experience'), weight: 2 },
        { text: getValue(candidate, 'Sex'), weight: 1 },
        { text: getValue(candidate, 'Age'), weight: 1 }
    ];
}

function jobMatchesFilters(job) {
    var selectedLocation = selectedValue(locationFilter);
    var selectedSkill = selectedValue(skillsFilter);
    var selectedEducation = selectedValue(educationFilter);
    var selectedSalary = selectedValue(salaryFilter);
    var selectedWorkMode = selectedValue(workModeFilter);
    var selectedCompany = selectedValue(companyFilter);
    var selectedAssets = selectedValue(assetsFilter);
    var selectedSector = selectedValue(sectorFilter);
    return valueMatchesDropdown(getValue(job, 'jobLocation'), selectedLocation) &&
        (selectedSkill === 'all' || getValue(job, 'requiredSkills').indexOf(selectedSkill) !== -1) &&
        valueMatchesDropdown(getValue(job, 'educationLevel'), selectedEducation) &&
        valueMatchesRange(getValue(job, 'salary'), selectedSalary) &&
        valueMatchesDropdown(getValue(job, 'workMode'), selectedWorkMode) &&
        valueMatchesDropdown(getValue(job, 'companyName'), selectedCompany) &&
        (selectedAssets === 'all' || getAssetRange(getValue(job, 'companyAssets')) === selectedAssets) &&
        valueMatchesDropdown(getValue(job, 'companySector'), selectedSector);
}

function candidateMatchesFilters(candidate) {
    var selectedLocation = selectedValue(locationFilter);
    var selectedSkill = selectedValue(skillsFilter);
    var selectedEducation = selectedValue(educationFilter);
    var selectedExperience = selectedValue(experienceFilter);
    var selectedWorkMode = selectedValue(workModeFilter);
    var selectedStudyCategory = selectedValue(studyCategoryFilter);
    var selectedGender = selectedValue(genderFilter);
    var selectedAge = selectedValue(ageFilter);
    return valueMatchesDropdown(getValue(candidate, 'preferredLocation'), selectedLocation) &&
        (selectedSkill === 'all' || getValue(candidate, 'skills').indexOf(selectedSkill) !== -1) &&
        valueMatchesDropdown(getValue(candidate, 'Education'), selectedEducation) &&
        valueMatchesRange(getValue(candidate, 'Experience'), selectedExperience) &&
        valueMatchesDropdown(getValue(candidate, 'preferredWorkMode'), selectedWorkMode) &&
        valueMatchesDropdown(getValue(candidate, 'Study_Category'), selectedStudyCategory) &&
        valueMatchesDropdown(getValue(candidate, 'Sex'), selectedGender) &&
        valueMatchesRange(getValue(candidate, 'Age'), selectedAge);
}

function renderJobCards(jobsToRender) {
    var i;
    var job;
    var card;
    var salaryNumber;
    if (!jobGrid) {
        return;
    }
    jobGrid.innerHTML = '';
    if (resultsCount) {
        resultsCount.textContent = jobsToRender.length + ' job listing(s) found';
    }
    if (jobsToRender.length === 0) {
        jobGrid.innerHTML = '<p>No jobs found matching your criteria.</p>';
        return;
    }
    for (i = 0; i < jobsToRender.length; i += 1) {
        job = jobsToRender[i];
        card = document.createElement('div');
        card.className = 'job-card';
        salaryNumber = Number(getValue(job, 'salary'));
        card.innerHTML = '' +
            '<h3>' + escapeHtml(getValue(job, 'jobTitle')) + '</h3>' +
            '<div class="company">' + escapeHtml(getValue(job, 'companyName')) + '</div>' +
            '<div class="tags">' +
                '<span class="tag">' + escapeHtml(getValue(job, 'jobLocation')) + '</span>' +
                '<span class="tag">' + escapeHtml(getValue(job, 'workMode')) + '</span>' +
                '<span class="tag">' + escapeHtml(getValue(job, 'educationLevel')) + '</span>' +
                '<span class="tag">$' + (isNaN(salaryNumber) ? escapeHtml(getValue(job, 'salary')) : salaryNumber.toLocaleString()) + '</span>' +
                '<span class="tag">' + escapeHtml(getValue(job, 'companySector')) + '</span>' +
            '</div>' +
            '<p class="description">' + escapeHtml(getValue(job, 'jobDescription')) + '</p>' +
            '<a href="#" class="apply-btn">Apply Now</a>';
        jobGrid.appendChild(card);
    }
}

function renderCandidateCards(candidatesToRender) {
    var i;
    var candidate;
    var card;
    if (!candidateGrid) {
        return;
    }
    candidateGrid.innerHTML = '';
    if (resultsCount) {
        resultsCount.textContent = candidatesToRender.length + ' candidate listing(s) found';
    }
    if (candidatesToRender.length === 0) {
        candidateGrid.innerHTML = '<p>No candidates found matching your criteria.</p>';
        return;
    }
    for (i = 0; i < candidatesToRender.length; i += 1) {
        candidate = candidatesToRender[i];
        card = document.createElement('div');
        card.className = 'candidate-card';
        card.innerHTML = '' +
            '<h3>' + escapeHtml(getCandidateName(candidate)) + '</h3>' +
            '<div class="skills">' + escapeHtml(getValue(candidate, 'skills')) + '</div>' +
            '<div class="experience">' + escapeHtml(getValue(candidate, 'Experience')) + ' year(s) experience</div>' +
            '<div class="tags">' +
                '<span class="tag">' + escapeHtml(getValue(candidate, 'preferredLocation')) + '</span>' +
                '<span class="tag">' + escapeHtml(getValue(candidate, 'preferredWorkMode')) + '</span>' +
                '<span class="tag">' + escapeHtml(getValue(candidate, 'Education')) + '</span>' +
                '<span class="tag">' + escapeHtml(getValue(candidate, 'Study_Category')) + '</span>' +
            '</div>' +
            '<p class="location">' + escapeHtml(getValue(candidate, 'workExperience')) + '</p>' +
            '<a href="#" class="select-btn">Select Candidate</a>';
        candidateGrid.appendChild(card);
    }
}

function filterByFuzzy(items, searchTerm, getFields, matchesFilters) {
    var results = [];
    var i;
    var item;
    var score;
    for (i = 0; i < items.length; i += 1) {
        item = items[i];
        if (matchesFilters(item)) {
            score = getFuzzyScore(searchTerm, getFields(item));
            if (score > 0) {
                results.push({ item: item, score: score });
            }
        }
    }
    if (normaliseText(searchTerm) !== '') {
        results.sort(function (firstResult, secondResult) {
            return secondResult.score - firstResult.score;
        });
    }
    return results.map(function (result) {
        return result.item;
    });
}

function applyJobFuzzySearch() {
    var sourceJobs = window.jobsData || [];
    var searchTerm = searchInput ? searchInput.value : '';
    var filteredJobs = filterByFuzzy(sourceJobs, searchTerm, getJobFields, jobMatchesFilters);
    renderJobCards(filteredJobs);
}

function applyCandidateFuzzySearch() {
    var sourceCandidates = window.candidatesData || [];
    var searchTerm = searchInput ? searchInput.value : '';
    var filteredCandidates = filterByFuzzy(sourceCandidates, searchTerm, getCandidateFields, candidateMatchesFilters);
    renderCandidateCards(filteredCandidates);
}

function addFuzzyEvent(element, eventName, handler) {
    if (element) {
        element.addEventListener(eventName, function () {
            window.setTimeout(handler, 0);
        });
    }
}

if (jobGrid) {
    window.renderJobs = function () {
        applyJobFuzzySearch();
    };
    window.filterJobs = applyJobFuzzySearch;
    window.filterJobsByKeywords = applyJobFuzzySearch;
    addFuzzyEvent(searchInput, 'input', applyJobFuzzySearch);
    addFuzzyEvent(locationFilter, 'change', applyJobFuzzySearch);
    addFuzzyEvent(skillsFilter, 'change', applyJobFuzzySearch);
    addFuzzyEvent(educationFilter, 'change', applyJobFuzzySearch);
    addFuzzyEvent(salaryFilter, 'change', applyJobFuzzySearch);
    addFuzzyEvent(workModeFilter, 'change', applyJobFuzzySearch);
    addFuzzyEvent(companyFilter, 'change', applyJobFuzzySearch);
    addFuzzyEvent(assetsFilter, 'change', applyJobFuzzySearch);
    addFuzzyEvent(sectorFilter, 'change', applyJobFuzzySearch);
    addFuzzyEvent(clearFilters, 'click', applyJobFuzzySearch);
}

if (candidateGrid) {
    window.renderCandidates = function () {
        applyCandidateFuzzySearch();
    };
    window.filterCandidates = applyCandidateFuzzySearch;
    addFuzzyEvent(searchInput, 'input', applyCandidateFuzzySearch);
    addFuzzyEvent(locationFilter, 'change', applyCandidateFuzzySearch);
    addFuzzyEvent(skillsFilter, 'change', applyCandidateFuzzySearch);
    addFuzzyEvent(educationFilter, 'change', applyCandidateFuzzySearch);
    addFuzzyEvent(experienceFilter, 'change', applyCandidateFuzzySearch);
    addFuzzyEvent(workModeFilter, 'change', applyCandidateFuzzySearch);
    addFuzzyEvent(studyCategoryFilter, 'change', applyCandidateFuzzySearch);
    addFuzzyEvent(genderFilter, 'change', applyCandidateFuzzySearch);
    addFuzzyEvent(ageFilter, 'change', applyCandidateFuzzySearch);
    addFuzzyEvent(clearFilters, 'click', applyCandidateFuzzySearch);
}