/*=====================================================

Author: Ciara Slater
Date: 12/04/2026


Database Name: HireWireDB


Table Name #1: jobseekers (this is for employee/candidate data)
No. Of Rows: 1000
Columns:
	jobSeekerID			int,
    firstName			varchar(300),
    lastName			varchar(300),
	age					int,
    gender				varchar(300),
    email				varchar(1000),
    phone				varchar(1000),
    educationLevel		varchar(1000),
    majorCode			int,
    majorStudy			varchar(1000),
    studyCategory		varchar(1000),
    yearsExperience		int,
    workExperience		varchar(1000),
    preferredLocation	varchar(300),
    preferredWorkMode	varchar(300),
    skills				varchar(6000)


Table Name #2: joblistings (this is for job/employer data)
No. Of Rows: 1000
Columns:
	jobID				int,
    jobTitle			text,
    jobDescription		longtext,
	jobLocation			text,
    educationLevel		text,
    requiredSkills		longtext,
    experience			int,
    salary				decimal(10,2),
    workMode			varchar(50), 
    companyName			varchar(100),
    companyAssets		text,
    noOfEmployees		int,
    companyCeo			varchar(100),
    companySector		varchar(100)

=====================================================*/

/*
-- uncomment the queries you want to run --
*/


-- /* select all rows of data from the jobseekers table */
-- SELECT * FROM jobseekers;


-- /* project instructions say the candidate profile should contain the following columns */
-- SELECT
--     CONCAT(firstName, ' ', lastName) AS fullName,
-- 	CONCAT(email, ', ', phone) AS contactInfo,
--     educationLevel AS education,
--     studyCategory AS majorFieldOfStudy,
--     experience AS yearsOfExperience
-- FROM jobseekers
-- LIMIT 10
-- ;


-- /* see the different types of education */
-- SELECT educationLevel
-- FROM jobseekers
-- GROUP BY educationLevel
-- ; -- results: Bachelors, Masters, High School, PHD


-- /* see the different types of major names */
-- SELECT majorStudy
-- FROM jobseekers
-- GROUP BY majorStudy
-- ; -- results: 173 different majors


-- /* see the different types of study categories */
-- SELECT studyCategory
-- FROM jobseekers
-- GROUP BY studyCategory
-- ; -- results: 16 different study categories

CREATE DATABASE hirewire;

USE hirewire;

-- jobseekers table
CREATE TABLE jobseekers (
    jobSeekerID INT PRIMARY KEY,
    firstName VARCHAR(300),
    lastName VARCHAR(300),
    age INT,
    gender VARCHAR(300),
    email VARCHAR(1000),
    phone VARCHAR(1000),
    educationLevel VARCHAR(1000),
    majorCode INT,
    majorStudy VARCHAR(1000),
    studyCategory VARCHAR(1000),
    yearsExperience INT,
    workExperience VARCHAR(1000),
    preferredLocation VARCHAR(300),
    preferredWorkMode VARCHAR(300),
    skills VARCHAR(6000)
);

-- joblistings table
CREATE TABLE joblistings (
    jobID INT PRIMARY KEY,
    jobTitle VARCHAR(1000),
    jobDescription TEXT,
    jobLocation VARCHAR(300),
    educationLevel VARCHAR(1000),
    requiredSkills VARCHAR(6000),
    experience INT,
    salary INT,
    workMode VARCHAR(300),
    companyName VARCHAR(1000),
    companyAssets VARCHAR(1000),
    noOfEmployees INT,
    companyCeo VARCHAR(1000),
    companySector VARCHAR(1000),
    ownerId INT
);