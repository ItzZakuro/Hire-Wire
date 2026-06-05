const fs = require('fs');
const path = require('path');
const usersDbPath = path.join(__dirname, '../db/users.json');
const db = require('../db/db');

function login(req, res) {
    const { email, password } = req.body;

    try {
        const usersData = JSON.parse(fs.readFileSync(usersDbPath, 'utf8'));
        const user = usersData.users.find(u => u.email === email && u.password === password);

        if (user) {
            res.json({ success: true, message: 'Login successful', user: user });
        } else {
            res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

function register(req, res) {
    const { name, email, password } = req.body;

    try {
        const usersData = JSON.parse(fs.readFileSync(usersDbPath, 'utf8'));

        if (usersData.users.find(u => u.email === email)) {
            return res.status(400).json({
                success: false,
                message: 'This email is already registered!'
            });
        }

        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        const getNextIdSql = 'SELECT IFNULL(MAX(jobSeekerID), 0) + 1 AS nextId FROM jobseekers';

        db.query(getNextIdSql, (idErr, idResults) => {
            if (idErr) {
                console.error('Failed to generate user ID:', idErr);
                return res.status(500).json({
                    success: false,
                    message: 'Server error during registration.'
                });
            }

            const nextId = idResults[0].nextId;

            const newUser = {
                id: nextId.toString(),
                email: email,
                password: password,
                name: name,
                isMember: false
            };

            usersData.users.push(newUser);
            fs.writeFileSync(usersDbPath, JSON.stringify(usersData, null, 2), 'utf8');

            const insertSql = `
                INSERT INTO jobseekers (
                    jobSeekerID,
                    firstName,
                    lastName,
                    age,
                    gender,
                    email,
                    phone,
                    educationLevel,
                    majorCode,
                    majorStudy,
                    studyCategory,
                    yearsExperience,
                    workExperience,
                    preferredLocation,
                    preferredWorkMode,
                    skills
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                nextId,
                firstName,
                lastName,
                null,
                '',
                email,
                '',
                '',
                null,
                '',
                '',
                0,
                '',
                '',
                '',
                ''
            ];

            db.query(insertSql, values, (insertErr) => {
                if (insertErr) {
                    console.error('Failed to create profile in MySQL:', insertErr);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to create profile in database.'
                    });
                }

                res.json({
                    success: true,
                    message: 'Registration successful! Account and profile created.',
                    user: newUser
                });
            });
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration.'
        });
    }
}

module.exports = { login, register };