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
var filterToggle = document.getElementById('filterToggle');
var filterPanel = document.getElementById('filterPanel');
var clearFilters = document.getElementById('clearFilters');
var resultsCount = document.getElementById('resultsCount');

var locationFilter = document.getElementById('locationFilter');
var skillsFilter = document.getElementById('skillsFilter');
var educationFilter = document.getElementById('educationFilter');
var salaryFilter = document.getElementById('salaryFilter');
var workModeFilter = document.getElementById('workModeFilter');
var companyFilter = document.getElementById('companyFilter');
var assetsFilter = document.getElementById('assetsFilter');
var sectorFilter = document.getElementById('sectorFilter');

var allFilters = [
    locationFilter,
    skillsFilter,
    educationFilter,
    salaryFilter,
    workModeFilter,
    companyFilter,
    assetsFilter,
    sectorFilter
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

function getUniqueValues(fieldName) {
    var values = [];

    for (var i = 0; i < jobsData.length; i += 1) {
        var value = jobsData[i][fieldName];

        if (value && values.indexOf(value) === -1) {
            values.push(value);
        }
    }

    values.sort();
    return values;
}

function getUniqueSkills() {
    var skills = [];

    for (var i = 0; i < jobsData.length; i += 1) {
        var skillList = jobsData[i].requiredSkills.split(',');

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

function getAssetRange(assetText) {
    var assetNumber = Number(String(assetText).replace(/[^0-9.]/g, ''));

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

function addOptions(selectElement, values) {
    for (var i = 0; i < values.length; i += 1) {
        var option = document.createElement('option');
        option.value = values[i];
        option.textContent = values[i];
        selectElement.appendChild(option);
    }
}

function setupFilterOptions() {
    addOptions(locationFilter, getUniqueValues('jobLocation'));
    addOptions(skillsFilter, getUniqueSkills());
    addOptions(educationFilter, getUniqueValues('educationLevel'));
    addOptions(workModeFilter, getUniqueValues('workMode'));
    addOptions(companyFilter, getUniqueValues('companyName'));
    addOptions(sectorFilter, getUniqueValues('companySector'));

    var assetOptions = [
        { value: '0-5000', text: 'Below $5,000' },
        { value: '5000-10000', text: '$5,000 - $10,000' },
        { value: '10000-15000', text: '$10,000 - $15,000' },
        { value: '15000-999999999', text: 'Above $15,000' }
    ];

    for (var i = 0; i < assetOptions.length; i += 1) {
        var option = document.createElement('option');
        option.value = assetOptions[i].value;
        option.textContent = assetOptions[i].text;
        assetsFilter.appendChild(option);
    }
}

function valueMatchesDropdown(jobValue, selectedValue) {
    return selectedValue === 'all' || jobValue === selectedValue;
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

function renderJobs(jobsToRender) {
    jobGrid.innerHTML = '';
    resultsCount.textContent = jobsToRender.length + ' job listing(s) found';

    if (jobsToRender.length === 0) {
        jobGrid.innerHTML = '<p>No jobs found matching your criteria.</p>';
        return;
    }

    for (var i = 0; i < jobsToRender.length; i += 1) {
        var job = jobsToRender[i];
        var card = document.createElement('div');
        card.className = 'job-card';

        card.innerHTML = '' +
            '<h3>' + escapeHtml(job.jobTitle) + '</h3>' +
            '<div class="company">' + escapeHtml(job.companyName) + '</div>' +
            '<div class="tags">' +
                '<span class="tag">' + escapeHtml(job.jobLocation) + '</span>' +
                '<span class="tag">' + escapeHtml(job.workMode) + '</span>' +
                '<span class="tag">' + escapeHtml(job.educationLevel) + '</span>' +
                '<span class="tag">$' + Number(job.salary).toLocaleString() + '</span>' +
                '<span class="tag">' + escapeHtml(job.companySector) + '</span>' +
            '</div>' +
            '<p class="description">' + escapeHtml(job.jobDescription) + '</p>' +
            '<a href="#" class="apply-btn">Apply Now</a>';

        jobGrid.appendChild(card);
    }
}

function filterJobs() {
    var searchTerm = searchInput.value.toLowerCase();
    var selectedLocation = locationFilter.value;
    var selectedSkill = skillsFilter.value;
    var selectedEducation = educationFilter.value;
    var selectedSalary = salaryFilter.value;
    var selectedWorkMode = workModeFilter.value;
    var selectedCompany = companyFilter.value;
    var selectedAssets = assetsFilter.value;
    var selectedSector = sectorFilter.value;

    var filteredJobs = jobsData.filter(function (job) {
        var matchesSearch = job.jobTitle.toLowerCase().indexOf(searchTerm) !== -1 ||
                            job.companyName.toLowerCase().indexOf(searchTerm) !== -1 ||
                            job.requiredSkills.toLowerCase().indexOf(searchTerm) !== -1 ||
                            job.jobDescription.toLowerCase().indexOf(searchTerm) !== -1;

        var matchesLocation = valueMatchesDropdown(job.jobLocation, selectedLocation);
        var matchesSkill = selectedSkill === 'all' || job.requiredSkills.indexOf(selectedSkill) !== -1;
        var matchesEducation = valueMatchesDropdown(job.educationLevel, selectedEducation);
        var matchesSalary = valueMatchesRange(job.salary, selectedSalary);
        var matchesWorkMode = valueMatchesDropdown(job.workMode, selectedWorkMode);
        var matchesCompany = valueMatchesDropdown(job.companyName, selectedCompany);
        var matchesAssets = selectedAssets === 'all' || getAssetRange(job.companyAssets) === selectedAssets;
        var matchesSector = valueMatchesDropdown(job.companySector, selectedSector);

        return matchesSearch &&
               matchesLocation &&
               matchesSkill &&
               matchesEducation &&
               matchesSalary &&
               matchesWorkMode &&
               matchesCompany &&
               matchesAssets &&
               matchesSector;
    });

    renderJobs(filteredJobs);
}

async function performFuzzySearch(searchTerm) {
    const response = await fetch('/api/jobs/search?q=' + encodeURIComponent(searchTerm));

    return await response.json();
}

async function filterJobs() {
    var searchTerm = searchInput.value.trim();

    let filteredJobs = jobsData;

    if (searchTerm !== '') {
        filteredJobs = await performFuzzySearch(searchTerm);
    }

    renderJobs(filteredJobs);
}

function clearAllFilters() {
    searchInput.value = '';

    for (var i = 0; i < allFilters.length; i += 1) {
        allFilters[i].value = 'all';
    }

    filterJobs();
}

filterToggle.addEventListener('click', function () {
    filterPanel.classList.toggle('show');
});

searchInput.addEventListener('input', filterJobs);
clearFilters.addEventListener('click', clearAllFilters);

for (var i = 0; i < allFilters.length; i += 1) {
    allFilters[i].addEventListener('change', filterJobs);
}

fetch('/api/jobs')
    .then(function (response) {
        return response.json();
    })
    .then(function (jobs) {
        jobsData = jobs;
        setupFilterOptions();
        renderJobs(jobsData);
    })
    .catch(function () {
        jobGrid.innerHTML = '<p>Unable to load job listings.</p>';
    });

fetch('Database/jobListings.csv')
    .then(function (response) {
        return response.text();
    })
    .then(function (csvText) {
        jobsData = convertRowsToJobs(parseCsv(csvText));
        setupFilterOptions();
        renderJobs(jobsData);
    })
    .catch(function () {
        jobGrid.innerHTML = '<p>Unable to load job listings. Please run this website through a local server so the CSV file can be loaded.</p>';
    });