# HireWire – Job Matching and Recruitment Platform

## Project Overview

HireWire is a web-based recruitment platform designed to connect job seekers and employers through an intuitive job matching system. The platform allows candidates to create profiles, upload resumes, browse job opportunities, and receive personalized job recommendations. Employers can create and manage job listings, view potential candidates, and interact with the recruitment process.

The project was developed as part of a university software development course and demonstrates the integration of frontend, backend, database management, and user authentication features.

---

## Features

### User Authentication
- User registration and login
- Session management using Local Storage
- User account creation linked to candidate profiles

### Candidate Profiles
- View and edit personal profile information
- Store education, experience, skills, preferred location, and work mode
- Resume upload functionality
- Membership status management

### Job Management
- Create new job listings
- Store job information in MySQL
- View all available jobs
- View jobs created by the current user
- Search job listings

### Candidate Listings
- Display candidate information
- Search and filter candidates
- Candidate profile retrieval from database

### Matching System
- Job matching based on:
  - Skills
  - Preferred location
  - Preferred work mode
- Match score calculation
- Membership-based access control

### Membership System
- Standard and Premium membership modes
- Premium users can access unlimited job recommendations
- Membership status persisted during active sessions

---

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Additional Libraries
- Multer (Resume Upload)
- Fuse.js (Search Functionality)

---

## Database Structure

### jobseekers
Stores candidate information:

- jobSeekerID
- firstName
- lastName
- age
- gender
- email
- phone
- educationLevel
- majorCode
- majorStudy
- studyCategory
- yearsExperience
- workExperience
- preferredLocation
- preferredWorkMode
- skills

### joblistings
Stores job postings:

- jobID
- jobTitle
- jobDescription
- jobLocation
- educationLevel
- requiredSkills
- experience
- salary
- workMode
- companyName
- companyAssets
- noOfEmployees
- companyCeo
- companySector
- ownerId

---

## Major Improvements

During development the system was migrated from CSV-based storage to a fully MySQL-backed solution.

This included:

- Candidate profile migration
- Job listing migration
- Search functionality updates
- Registration and profile creation updates
- Job ownership tracking using ownerId
- Database integration across frontend and backend components

---

## Installation (dont in git bash)

### 1. Clone the repository

bash git clone <https://github.com/ItzZakuro/Hire-Wire> 

### 2. Move to backend folder

cd Backend 

### 3. Install dependencies

npm install 

### 4. Start the Backend Server

node server.js 

### 5. Start the Backend Server

View the website through http://localhost:3000
OR 
Ctrl + Left Click if viewing in VS Code

### 6. Environment Variables

For ease of marking, we removed our .env file from gitignore. This makes the marking process much simpler (although it does permit security issues). 

This is something we are aware of. Viewing the github history of the main branch will show that this change was made as the very end of the project for MARKING PURPOSES ONLY.

---

## Running the Application

1. Start the backend server
2. Open the frontend in the browser
3. Register a new account
4. Complete your profile
5. Upload a resume
6. Browse or create job listings
7. Use the matching system

---

## Future Improvements

- Password hashing and security enhancements
- Advanced recommendation algorithms
- Employer dashboards
- Resume parsing
- Real-time notifications
- Cloud deployment

---

## License

This project was developed for educational purposes.