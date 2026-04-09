const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const editProfileForm = document.getElementById('editProfileForm');
const displayName = document.getElementById('name');
const displayEmail = document.getElementById('email');
const displayPhone = document.getElementById('phone');
const displayUni = document.getElementById('university');
const displayMajor = document.getElementById('major');
const displayEducationDetail = document.getElementById('educationDetail');
const displayExperience = document.getElementById('experience');
const displaySkills = document.getElementById('skills');
const displaySkillsDetail = document.getElementById('skillsDetail');
const newName = document.getElementById('newName');
const newEmail = document.getElementById('newEmail');
const newPhone = document.getElementById('newPhone');
const newUni = document.getElementById('newUni');
const newMajor = document.getElementById('newMajor');
const newEducationDetail = document.getElementById('newEducationDetail');
const newExperience = document.getElementById('newExperience');
const newSkills = document.getElementById('newSkills');
const newSkillsDetail = document.getElementById('newSkillsDetail');


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

// Pre-fill the form with profile info to avoid typing everything
newName.value = displayName.innerText.replace("Name: ", "").trim();
newEmail.value = displayEmail.innerText.replace("Email: ", "").trim();
newPhone.value = displayPhone.innerText.replace("Phone: ", "").trim();
newUni.value = displayUni.innerText.replace("", "").trim();
newMajor.value = displayMajor.innerText.replace("", "").trim();
newEducationDetail.value = displayEducationDetail.innerText.replace("", "").trim();
newExperience.value = displayExperience.innerText.replace("", "").trim();
newSkills.value = displaySkills.innerText.replace("", "").trim();
newSkillsDetail.value = displaySkillsDetail.innerText.replace("", "").trim();

if (editProfileForm) {
    editProfileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // If the input field not empty, update only the field that needs to be changed
        if (newName.value.trim() !== "") {
            document.getElementById('name').innerText = "Name: " +newName.value.trim();
        }
        if (newEmail.value.trim() !== "") {
            document.getElementById('email').innerText = "Email: " + newEmail.value.trim();
        }
        if (newPhone.value.trim() !== "") {
            document.getElementById('phone').innerText = "Phone: " + newPhone.value.trim();
        }
        if (newUni.value.trim() !== "") {
            document.getElementById('university').innerText = newUni.value.trim();
        }
        if (newMajor.value.trim() !== "") {
            document.getElementById('major').innerText = newMajor.value.trim();
        }
        if (newEducationDetail.value.trim() !== "") {
            document.getElementById('educationDetail').innerText = newEducationDetail.value.trim();
        }
        if (newExperience.value.trim() !== "") {
            document.getElementById('experience').innerText = newExperience.value.trim();
        }
        if (newSkills.value.trim() !== "") {
            document.getElementById('skills').innerText = newSkills.value.trim();
        }
        if (newSkillsDetail.value.trim() !== "") {
            document.getElementById('skillsDetail').innerText = newSkillsDetail.value.trim();
        }
        alert('Profile updated successfully!');
    });
}