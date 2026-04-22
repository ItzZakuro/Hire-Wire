/*=====================================================

Author: Ciara Slater
Date: 12/04/2026


Database Name: HireWireDB
No. Of Rows: 1000


Table Name #1: jobSeekers (this is for employee data)
Columns:
	jobSeekerID		int,
    firstName		varchar(100),
    lastName		varchar(100),
	age				int,
    gender			varchar(20),
    email			varchar(200),
    phone			bigint,
    educationLevel	varchar(100),
    majorCode		int,
    majorStudy		varchar(1000),
    studyCategory	varchar(1000),
    experience		int


Table Name #2: (this is for job/employer data)

=====================================================*/

/*
-- uncomment the queries you want to run --
*/


-- /* select all rows of data from the jobSeekers table */
-- SELECT * FROM jobSeekers;


-- /* project instructions say the candidate profile should contain the following columns */
-- SELECT
--     CONCAT(firstName, ' ', lastName) AS fullName,
-- 	CONCAT(email, ', ', phone) AS contactInfo,
--     educationLevel AS education,
--     studyCategory AS majorFieldOfStudy,
--     experience AS yearsOfExperience
-- FROM jobSeekers
-- LIMIT 10
-- ;


-- /* see the different types of education */
-- SELECT educationLevel
-- FROM jobSeekers
-- GROUP BY educationLevel
-- ; -- results: Bachelors, Masters, High School, PHD


-- /* see the different types of major names */
-- SELECT majorStudy
-- FROM jobSeekers
-- GROUP BY majorStudy
-- ; -- results: 173 different majors


-- /* see the different types of study categories */
-- SELECT studyCategory
-- FROM jobSeekers
-- GROUP BY studyCategory
-- ; -- results: 16 different study categories