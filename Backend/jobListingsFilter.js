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
        var rawSkills = jobsData[i].requiredSkills || jobsData[i].skills || '';
        if (!rawSkills) continue;
        
        var skillList = rawSkills.split(',');
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
    if (!assetText) return '0-5000'; 
    var assetNumber = Number(String(assetText).replace(/[^0-9.]/g, ''));
    if (assetNumber < 5000) return '0-5000';
    if (assetNumber < 10000) return '5000-10000';
    if (assetNumber < 15000) return '10000-15000';
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
    addOptions(locationFilter, getUniqueValues('location') || getUniqueValues('jobLocation'));
    addOptions(skillsFilter, getUniqueSkills());
    addOptions(educationFilter, getUniqueValues('education') || getUniqueValues('educationLevel'));
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
    if (selectedRange === 'all') return true;
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
        
        var title = job.jobTitle || 'Untitled Job';
        var company = job.companyName || 'Unknown Company';
        var loc = job.location || job.jobLocation || 'N/A';
        var mode = job.workMode || 'N/A';
        var edu = job.education || job.educationLevel || 'N/A';
        var sal = job.salary ? job.salary.replace(/[^0-9.]/g, '') : '0';
        var sector = job.companySector || '';
        var desc = job.jobDescription || '';

        card.innerHTML = '' +
            '<h3>' + escapeHtml(title) + '</h3>' +
            '<div class="company">' + escapeHtml(company) + '</div>' +
            '<div class="tags">' +
                '<span class="tag">' + escapeHtml(loc) + '</span>' +
                '<span class="tag">' + escapeHtml(mode) + '</span>' +
                '<span class="tag">' + escapeHtml(edu) + '</span>' +
                '<span class="tag">$' + Number(sal).toLocaleString() + '</span>' +
                (sector ? '<span class="tag">' + escapeHtml(sector) + '</span>' : '') +
            '</div>' +
            '<p class="description">' + escapeHtml(desc) + '</p>' +
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
        var title = (job.jobTitle || '').toLowerCase();
        var company = (job.companyName || '').toLowerCase();
        var reqSkills = (job.requiredSkills || job.skills || '').toLowerCase();
        var desc = (job.jobDescription || '').toLowerCase();
        
        var matchesSearch = title.indexOf(searchTerm) !== -1 ||
                            company.indexOf(searchTerm) !== -1 ||
                            reqSkills.indexOf(searchTerm) !== -1 ||
                            desc.indexOf(searchTerm) !== -1;

        var matchesLocation = valueMatchesDropdown(job.location || job.jobLocation, selectedLocation);
        var matchesSkill = selectedSkill === 'all' || reqSkills.indexOf(selectedSkill.toLowerCase()) !== -1;
        var matchesEducation = valueMatchesDropdown(job.education || job.educationLevel, selectedEducation);
        var matchesSalary = valueMatchesRange(job.salary, selectedSalary);
        var matchesWorkMode = valueMatchesDropdown(job.workMode, selectedWorkMode);
        var matchesCompany = valueMatchesDropdown(job.companyName, selectedCompany);
        var matchesAssets = selectedAssets === 'all' || getAssetRange(job.companyAssets) === selectedAssets;
        var matchesSector = valueMatchesDropdown(job.companySector, selectedSector);

        return matchesSearch && matchesLocation && matchesSkill && matchesEducation &&
               matchesSalary && matchesWorkMode && matchesCompany && matchesAssets && matchesSector;
    });

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
    .then(function (data) {
        jobsData = data;
        setupFilterOptions();
        renderJobs(jobsData);
    })
    .catch(function (err) {
        console.error("Fetch error:", err);
        jobGrid.innerHTML = '<p>Unable to load job listings from server.</p>';
    });
