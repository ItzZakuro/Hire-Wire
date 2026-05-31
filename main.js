/**
 * ============================================================================
 * HireWire Frontend Core Logic (main.js)
 * ============================================================================
 * This file contains all the core interactive JavaScript for the HireWire frontend.
 * It is organized into the following functional sections:
 *
 * 1. Navigation & UI: 
 * Handles the mobile menu toggle and responsive navigation link behaviors.
 * * 2. Contact Form (Homepage): 
 * Simulates a successful message submission and resets the form.
 * * 3. Dynamic User Profile (Profile Page): 
 * Injects a dynamic membership badge (e.g., Free/Premium) into the DOM based 
 * on the current user's mock status.
 * * 4. Standalone Resume Upload (Profile Page): 
 * Handles the standalone resume file input and upload button interactions.
 * * 5. Candidate Registration (Register Page): 
 * Intercepts the registration form submission, validates that a resume file 
 * is attached, packages the user input and files using FormData, and sends a 
 * POST request to the backend API (/api/register).
 * * 6. Real-time Profile Editing (Profile Page): 
 * Captures updated profile data, sends a JSON POST request to the backend 
 * API (/api/updateProfile), and performs a real-time DOM update to reflect 
 * the changes immediately on the screen upon success.
 * ============================================================================
 */

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

menuBtn.addEventListener('click', function () {
    navLinks.classList.toggle('show');
});

document.querySelectorAll('.navLinks a').forEach(function (link) {
    link.addEventListener('click', function () {
        navLinks.classList.remove('show');
    });
});

if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        formMessage.textContent = 'Thanks, ' + name + '. Your message has been sent.';
        contactForm.reset();
    });
}

// const currentUser = {
//     name: "Alex Carter",
//     membershipStatus: "Premium"
// };

// const phoneElement = document.getElementById('phone');
// if (phoneElement) { 
//     const membershipPara = document.createElement('p');
//     membershipPara.id = 'membership';
//     let badgeClass = currentUser.membershipStatus === "Premium" ? "badge-premium" : "badge-free";
//     membershipPara.innerHTML = `Membership: <span class="${badgeClass}">${currentUser.membershipStatus}</span>`;
//     phoneElement.insertAdjacentElement('afterend', membershipPara);
// }

const membershipText = document.getElementById('membership');
const membershipBtn = document.getElementById('membershipBtn');

function updateMembershipDisplay() {
    const isMember = localStorage.getItem('isMember') === 'true';

    if (membershipText) {
        membershipText.innerHTML = `<strong>Membership:</strong> ${isMember ? 'Member' : 'Non-member'}`;
    }

    if (membershipBtn) {
        membershipBtn.textContent = isMember ? 'Deactivate Membership' : 'Activate Membership';
    }
}

if (membershipBtn) {
    membershipBtn.addEventListener('click', function () {
        const isMember = localStorage.getItem('isMember') === 'true';
        localStorage.setItem('isMember', String(!isMember));
        updateMembershipDisplay();
    });

    updateMembershipDisplay();
}

const uploadBtn = document.getElementById('uploadBtn');
const profileResumeInput = document.getElementById('resumeInput');

if (uploadBtn && profileResumeInput) {
    uploadBtn.addEventListener('click', async function () {
        if (profileResumeInput.files.length === 0) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('resume', profileResumeInput.files[0]);

        try {
            uploadBtn.textContent = "Uploading...";

            const response = await fetch('/api/candidates/resume/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Resume uploaded successfully: ${result.filename}`);

                let resumeLink = document.getElementById('resumeLink');

                if (!resumeLink) {
                    resumeLink = document.createElement('a');
                    resumeLink.id = 'resumeLink';
                    resumeLink.textContent = 'View uploaded resume';
                    resumeLink.target = '_blank';
                    resumeLink.style.display = 'block';
                    resumeLink.style.marginTop = '15px';
                    uploadBtn.insertAdjacentElement('afterend', resumeLink);
                }

                resumeLink.href = result.path;
            } else {
                alert(result.error || "Resume upload failed.");
            }
        } catch (error) {
            console.error("Resume upload error:", error);
            alert("Connection failed. Please make sure the backend server is running.");
        } finally {
            uploadBtn.textContent = "Upload Resume";
        }
    });
}

const registerForm = document.getElementById('registerForm');
const regMessage = document.getElementById('regMessage');
const regResumeInput = document.getElementById('regResume'); 

if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (regResumeInput.files.length === 0) {
            regMessage.style.color = "red";
            regMessage.textContent = "Error: Please upload your resume before registering.";
            return;
        }

        const profileData = {
            name: document.getElementById('regName').value.trim(),
            email: document.getElementById('regEmail').value.trim()
        };

        localStorage.setItem('currentUserProfile', JSON.stringify(profileData));

        regMessage.style.color = "green";
        regMessage.textContent = "Profile created successfully! Redirecting...";

        setTimeout(function () {
            window.location.href = "profile.html";
        }, 1000);
    });
}

//Load saved profile data from localStorage and display it on the profile page
const savedProfile = JSON.parse(localStorage.getItem('currentUserProfile'));

if (savedProfile) {
    if (savedProfile.name && document.getElementById('name')) {
        document.getElementById('name').innerHTML = `<strong>Name:</strong> ${savedProfile.name}`;
    }

    if (savedProfile.email && document.getElementById('email')) {
        document.getElementById('email').innerHTML = `<strong>Email:</strong> ${savedProfile.email}`;
    }
}

const editProfileForm = document.getElementById('editProfileForm');

/*if (editProfileForm) {
    editProfileForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.textContent;
        const originalBg = saveBtn.style.background;

        const profileData = {
            name: document.getElementById('newName').value.trim(),
            email: document.getElementById('newEmail').value.trim(),
            phone: document.getElementById('newPhone').value.trim(),
            university: document.getElementById('newUni').value.trim(),
            major: document.getElementById('newMajor').value.trim(),
            educationDetail: document.getElementById('newEducationDetail').value.trim(),
            experience: document.getElementById('newExperience').value.trim(),
            skills: document.getElementById('newSkills').value.trim(),
            skillsDetail: document.getElementById('newSkillsDetail').value.trim()
        };

        saveBtn.textContent = "Saving...";
        saveBtn.style.background = "#888"; 

        try {
            const response = await fetch('http://localhost:3000/api/updateProfile', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(profileData) 
            });

            if (response.ok) {
                if (profileData.name) document.getElementById('name').innerHTML = `<strong>Name:</strong> ${profileData.name}`;
                if (profileData.email) document.getElementById('email').innerHTML = `<strong>Email:</strong> ${profileData.email}`;
                if (profileData.phone) document.getElementById('phone').innerHTML = `<strong>Phone:</strong> ${profileData.phone}`;
                
                if (profileData.university) document.getElementById('university').textContent = profileData.university;
                if (profileData.major) document.getElementById('major').textContent = profileData.major;
                if (profileData.educationDetail) document.getElementById('educationDetail').textContent = profileData.educationDetail;
                
                if (profileData.experience) document.getElementById('experience').textContent = profileData.experience;
                
                if (profileData.skills) document.getElementById('skills').textContent = profileData.skills;
                if (profileData.skillsDetail) document.getElementById('skillsDetail').textContent = profileData.skillsDetail;

                saveBtn.textContent = "Saved Successfully! ✓";
                saveBtn.style.background = "#2e7d32"; 
                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.style.background = originalBg; 
                    editProfileForm.reset(); 
                }, 1500);

            } else {
                saveBtn.textContent = "Server Error ✖";
                saveBtn.style.background = "#d32f2f"; 
                setTimeout(() => { saveBtn.textContent = originalText; saveBtn.style.background = originalBg; }, 2000);
            }

        } catch (error) {
            saveBtn.textContent = "Connection Failed ✖";
            saveBtn.style.background = "#d32f2f";
            console.error("Fetch error:", error);
            setTimeout(() => { saveBtn.textContent = originalText; saveBtn.style.background = originalBg; }, 2000);
        }
    });
}*/
if (editProfileForm) {
    editProfileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.textContent;
        const originalBg = saveBtn.style.background;

        const profileData = {
            name: document.getElementById('newName').value.trim(),
            email: document.getElementById('newEmail').value.trim(),
            phone: document.getElementById('newPhone').value.trim(),
            university: document.getElementById('newUni').value.trim(),
            major: document.getElementById('newMajor').value.trim(),
            educationDetail: document.getElementById('newEducationDetail').value.trim(),
            experience: document.getElementById('newExperience').value.trim(),
            skills: document.getElementById('newSkills').value.trim(),
            skillsDetail: document.getElementById('newSkillsDetail').value.trim(),
            // Added new fields from the requirement
            workingMode: document.getElementById('newWorkingMode').value.trim(),
            preferredLocation: document.getElementById('newPreferredLocation').value.trim()
        };

        const allFieldsEmpty =
            !profileData.name && !profileData.email && !profileData.phone &&
            !profileData.university && !profileData.major && !profileData.educationDetail &&
            !profileData.experience && !profileData.skills && !profileData.skillsDetail &&
            !profileData.workingMode && !profileData.preferredLocation;

        if (allFieldsEmpty) {
            saveBtn.textContent = "There is nothing to save ✖";
            saveBtn.style.background = "#d32f2f";
            setTimeout(() => { saveBtn.textContent = originalText; saveBtn.style.background = originalBg; }, 2000);
            return;
        }

        saveBtn.textContent = "Saving...";
        saveBtn.style.background = "#888";

        if (profileData.name) document.getElementById('name').innerHTML = `<strong>Name:</strong> ${profileData.name}`;
        if (profileData.email) document.getElementById('email').innerHTML = `<strong>Email:</strong> ${profileData.email}`;
        if (profileData.phone) document.getElementById('phone').innerHTML = `<strong>Phone:</strong> ${profileData.phone}`;
                
        if (profileData.university) document.getElementById('university').textContent = profileData.university;
        if (profileData.major) document.getElementById('major').textContent = profileData.major;
        if (profileData.educationDetail) document.getElementById('educationDetail').textContent = profileData.educationDetail;
                
        if (profileData.experience) document.getElementById('experience').textContent = profileData.experience;
                
        if (profileData.skills) document.getElementById('skills').textContent = profileData.skills;
        if (profileData.skillsDetail) document.getElementById('skillsDetail').textContent = profileData.skillsDetail;
        if (profileData.workingMode) document.getElementById('workingMode').textContent = profileData.workingMode;
        if (profileData.preferredLocation) document.getElementById('preferredLocation').textContent = profileData.preferredLocation;

        saveBtn.textContent = "Saved Successfully! ✓";
        saveBtn.style.background = "#2e7d32"; 
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = originalBg; 
            editProfileForm.reset(); 
        }, 1500);
    });
}