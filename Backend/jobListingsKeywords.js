var searchInput = document.getElementById('searchInput');
var jobGrid = document.getElementById('jobGrid');
var resultsCount = document.getElementById('resultsCount');

var locationFilter = document.getElementById('locationFilter');
var skillsFilter = document.getElementById('skillsFilter');
var educationFilter = document.getElementById('educationFilter');
var salaryFilter = document.getElementById('salaryFilter');
var workModeFilter = document.getElementById('workModeFilter');
var companyFilter = document.getElementById('companyFilter');
var assetsFilter = document.getElementById('assetsFilter');
var sectorFilter = document.getElementById('sectorFilter');
var clearFilters = document.getElementById('clearFilters');

function normaliseText(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getJobValue(job, fieldName) {
    if (!job || job[fieldName] === undefined || job[fieldName] === null) {
        return '';
    }

    return String(job[fieldName]);
}

function splitKeywords(searchTerm) {
    var text = normaliseText(searchTerm);
    var keywords = [];

    if (text === '') {
        return keywords;
    }

    var parts = text.split(' ');

    for (var i = 0; i < parts.length; i += 1) {
        if (parts[i] !== '' && keywords.indexOf(parts[i]) === -1) {
            keywords.push(parts[i]);
        }
    }

    return keywords;
}

function getSearchableText(job) {
    return normaliseText(
        getJobValue(job, 'jobTitle') + ' ' +
        getJobValue(job, 'jobDescription') + ' ' +
        getJobValue(job, 'jobLocation') + ' ' +
        getJobValue(job, 'educationLevel') + ' ' +
        getJobValue(job, 'requiredSkills') + ' ' +
        getJobValue(job, 'experience') + ' ' +
        getJobValue(job, 'salary') + ' ' +
        getJobValue(job, 'workMode') + ' ' +
        getJobValue(job, 'companyName') + ' ' +
        getJobValue(job, 'companyAssets') + ' ' +
        getJobValue(job, 'companyCeo') + ' ' +
        getJobValue(job, 'companyCEO') + ' ' +
        getJobValue(job, 'companySector')
    );
}

function jobMatchesKeywords(job, searchTerm) {
    var keywords = splitKeywords(searchTerm);
    var searchableText = getSearchableText(job);

    if (keywords.length === 0) {
        return true;
    }

    for (var i = 0; i < keywords.length; i += 1) {
        if (searchableText.indexOf(keywords[i]) === -1) {
            return false;
        }
    }

    return true;
}

function getKeywordScore(job, searchTerm) {
    var keywords = splitKeywords(searchTerm);
    var score = 0;

    var title = normaliseText(getJobValue(job, 'jobTitle'));
    var skills = normaliseText(getJobValue(job, 'requiredSkills'));
    var company = normaliseText(getJobValue(job, 'companyName'));
    var location = normaliseText(getJobValue(job, 'jobLocation'));
    var sector = normaliseText(getJobValue(job, 'companySector'));
    var description = normaliseText(getJobValue(job, 'jobDescription'));

    for (var i = 0; i < keywords.length; i += 1) {
        var keyword = keywords[i];

        if (title.indexOf(keyword) !== -1) {
            score += 10;
        }

        if (skills.indexOf(keyword) !== -1) {
            score += 8;
        }

        if (company.indexOf(keyword) !== -1) {
            score += 6;
        }

        if (location.indexOf(keyword) !== -1) {
            score += 4;
        }

        if (sector.indexOf(keyword) !== -1) {
            score += 3;
        }

        if (description.indexOf(keyword) !== -1) {
            score += 2;
        }
    }

    return score;
}

function selectedValue(selectElement) {
    if (!selectElement) {
        return 'all';
    }

    return selectElement.value || 'all';
}

function valueMatchesDropdown(jobValue, selectedValue) {
    return selectedValue === 'all' || String(jobValue || '') === selectedValue;
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

function jobMatchesFilters(job) {
    var selectedLocation = selectedValue(locationFilter);
    var selectedSkill = selectedValue(skillsFilter);
    var selectedEducation = selectedValue(educationFilter);
    var selectedSalary = selectedValue(salaryFilter);
    var selectedWorkMode = selectedValue(workModeFilter);
    var selectedCompany = selectedValue(companyFilter);
    var selectedAssets = selectedValue(assetsFilter);
    var selectedSector = selectedValue(sectorFilter);

    var matchesLocation = valueMatchesDropdown(getJobValue(job, 'jobLocation'), selectedLocation);
    var matchesSkill = selectedSkill === 'all' || getJobValue(job, 'requiredSkills').indexOf(selectedSkill) !== -1;
    var matchesEducation = valueMatchesDropdown(getJobValue(job, 'educationLevel'), selectedEducation);
    var matchesSalary = valueMatchesRange(getJobValue(job, 'salary'), selectedSalary);
    var matchesWorkMode = valueMatchesDropdown(getJobValue(job, 'workMode'), selectedWorkMode);
    var matchesCompany = valueMatchesDropdown(getJobValue(job, 'companyName'), selectedCompany);
    var matchesAssets = selectedAssets === 'all' || getAssetRange(getJobValue(job, 'companyAssets')) === selectedAssets;
    var matchesSector = valueMatchesDropdown(getJobValue(job, 'companySector'), selectedSector);

    return matchesLocation &&
           matchesSkill &&
           matchesEducation &&
           matchesSalary &&
           matchesWorkMode &&
           matchesCompany &&
           matchesAssets &&
           matchesSector;
}

function renderKeywordJobs(jobsToRender) {
    if (typeof renderJobs === 'function') {
        renderJobs(jobsToRender);
        return;
    }

    if (resultsCount) {
        resultsCount.textContent = jobsToRender.length + ' job listing(s) found';
    }

    if (jobGrid) {
        jobGrid.innerHTML = '';

        if (jobsToRender.length === 0) {
            jobGrid.innerHTML = '<p>No jobs found matching your keywords.</p>';
        }
    }
}

function filterJobsByKeywords() {
    var searchTerm = searchInput.value;
    var filteredJobs = jobsData.filter(function (job) {
        return jobMatchesKeywords(job, searchTerm) && jobMatchesFilters(job);
    });

    if (normaliseText(searchTerm) !== '') {
        filteredJobs.sort(function (firstJob, secondJob) {
            return getKeywordScore(secondJob, searchTerm) - getKeywordScore(firstJob, searchTerm);
        });
    }

    renderKeywordJobs(filteredJobs);
}

function addKeywordEvent(element, eventName) {
    if (element) {
        element.addEventListener(eventName, filterJobsByKeywords);
    }
}

if (searchInput && jobGrid && typeof jobsData !== 'undefined') {
    addKeywordEvent(searchInput, 'input');
    addKeywordEvent(locationFilter, 'change');
    addKeywordEvent(skillsFilter, 'change');
    addKeywordEvent(educationFilter, 'change');
    addKeywordEvent(salaryFilter, 'change');
    addKeywordEvent(workModeFilter, 'change');
    addKeywordEvent(companyFilter, 'change');
    addKeywordEvent(assetsFilter, 'change');
    addKeywordEvent(sectorFilter, 'change');
    addKeywordEvent(clearFilters, 'click');
}

window.jobMatchesKeywords = jobMatchesKeywords;
window.filterJobsByKeywords = filterJobsByKeywords;