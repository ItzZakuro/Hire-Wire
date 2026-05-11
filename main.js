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
const currentUser = {
    name: "Alex Carter",
    membershipStatus: "Premium"
};
const phoneElement = document.getElementById('phone');
if (phoneElement) { 
    const membershipPara = document.createElement('p');
    membershipPara.id = 'membership';
    let badgeClass = currentUser.membershipStatus === "Premium" ? "badge-premium" : "badge-free";
    membershipPara.innerHTML = `Membership: <span class="${badgeClass}">${currentUser.membershipStatus}</span>`;
    phoneElement.insertAdjacentElement('afterend', membershipPara);
}
const uploadBtn = document.getElementById('uploadBtn');
const resumeInput = document.getElementById('resumeInput');
if (uploadBtn && resumeInput) { 
    uploadBtn.addEventListener('click', function() {
        if (resumeInput.files.length > 0) {
            const fileName = resumeInput.files[0].name;
            alert(`Success! Your resume "${fileName}" has been uploaded.`); 
        } else {
            alert("Please select a file first."); 
        }
    });
}