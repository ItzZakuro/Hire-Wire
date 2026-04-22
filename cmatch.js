const menuBtn = document.getElementById('menuBtn');
        const navLinks = document.getElementById('navLinks');
        menuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('show');
        });
        const jobs = [
            {
                title: 'Frontend Developer',
                company: 'Bright Web Solutions',
                location: 'Sydney',
                type: 'Full-time',
                skills: 'HTML, CSS, JavaScript',
                description: 'Entry-level web development role for candidates with strong frontend fundamentals.',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80'
            },
            {
                title: 'UI Designer',
                company: 'Pixel Forge',
                location: 'Melbourne',
                type: 'Part-time',
                skills: 'Figma, Wireframing, Prototyping',
                description: 'Creative role focused on building clean and user-friendly digital interfaces.',
                image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80'
            },
            {
                title: 'Junior Software Engineer',
                company: 'CodeNest',
                location: 'Brisbane',
                type: 'Graduate',
                skills: 'Java, SQL, Problem Solving',
                description: 'Great opportunity for graduates looking to grow in a supportive development team.',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'
            },
            {
                title: 'Support Analyst',
                company: 'TechBridge',
                location: 'Perth',
                type: 'Full-time',
                skills: 'Communication, Troubleshooting, Customer Support',
                description: 'Help clients solve technical issues and maintain strong service experiences.',
                image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
            }
        ];
        let currentIndex = 0;
        let likedJobs = 0;
        let passedJobs = 0;
        const jobImage = document.getElementById('jobImage');
        const jobTitle = document.getElementById('jobTitle');
        const companyName = document.getElementById('companyName');
        const jobLocation = document.getElementById('jobLocation');
        const jobType = document.getElementById('jobType');
        const jobSkills = document.getElementById('jobSkills');
        const jobDescription = document.getElementById('jobDescription');
        const statusText = document.getElementById('statusText');
        const likedCount = document.getElementById('likedCount');
        const passedCount = document.getElementById('passedCount');
        const likeBtn = document.getElementById('likeBtn');
        const passBtn = document.getElementById('passBtn');
        const swipeCard = document.getElementById('swipeCard');
        function showJob() {
            if (currentIndex >= jobs.length) {
                swipeCard.innerHTML = '<h2>No more job cards</h2><p>You have reviewed all available matches.</p>';
                statusText.textContent = 'Finished reviewing job matches.';
                return;
            }
            const job = jobs[currentIndex];
            jobImage.src = job.image;
            jobTitle.textContent = job.title;
            companyName.textContent = job.company;
            jobLocation.textContent = job.location;
            jobType.textContent = job.type;
            jobSkills.textContent = job.skills;
            jobDescription.textContent = job.description;
        }
        function likeJob() {
            if (currentIndex < jobs.length) {
                statusText.textContent = 'You liked ' + jobs[currentIndex].title + ' at ' + jobs[currentIndex].company + '.';
                likedJobs++;
                likedCount.textContent = likedJobs;
                currentIndex++;
                showJob();
            }
        }
        function passJob() {
            if (currentIndex < jobs.length) {
                statusText.textContent = 'You passed on ' + jobs[currentIndex].title + ' at ' + jobs[currentIndex].company + '.';
                passedJobs++;
                passedCount.textContent = passedJobs;
                currentIndex++;
                showJob();
            }
        }
        likeBtn.addEventListener('click', likeJob);
        passBtn.addEventListener('click', passJob);
        showJob();