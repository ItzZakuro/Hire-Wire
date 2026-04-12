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

contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    formMessage.textContent = 'Thanks, ' + name + '. Your message has been sent.';
    contactForm.reset();
});