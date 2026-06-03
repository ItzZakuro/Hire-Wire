const fs = require('fs');
const path = require('path');
const usersDbPath = path.join(__dirname, '../db/users.json');

function login(req, res) {
    const { email, password } = req.body;
    try {
        const usersData = JSON.parse(fs.readFileSync(usersDbPath, 'utf8'));
        const user = usersData.users.find(u => u.email === email && u.password === password);
        if (user) {
            res.json({ success: true, message: 'Login successful', user: user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

function register(req, res) {
    const { name, email, password } = req.body;
    const db = req.app.locals.db; 

    try {
        const usersData = JSON.parse(fs.readFileSync(usersDbPath, 'utf8'));
        if (usersData.users.find(u => u.email === email)) {
            return res.status(400).json({ success: false, message: 'This email is already registered!' });
        }

        let nextId = 1001 + usersData.users.length; 
        const newUser = {
            id: nextId.toString(), 
            email: email, password: password, name: name, isMember: false 
        };

        usersData.users.push(newUser);
        fs.writeFileSync(usersDbPath, JSON.stringify(usersData, null, 2), 'utf8');

        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        const sql = `INSERT INTO jobSeekers ("Index", "First Name", "Last Name", Email) VALUES (?, ?, ?, ?)`;
        db.run(sql, [nextId.toString(), firstName, lastName, email], (err) => {
            if (err) {
                console.error('Failed to create SQLite profile:', err.message);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            res.json({ success: true, message: 'Registration successful! Account and Profile created.' });
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
}

module.exports = { login, register };