const fs = require('fs');
const path = require('path');
const usersDbPath = path.join(__dirname, '../db/users.json');
const seekersCsvPath = path.join(__dirname, '../../Database/jobSeekers.csv');
function login(req, res) {
    const { email, password } = req.body;

    try {
        const usersData = JSON.parse(fs.readFileSync(usersDbPath, 'utf8'));
        const user = usersData.users.find(u => u.email === email && u.password === password);

        if (user) {
            res.json({ success: true, message: '登录成功', user: user });
        } else {
            res.status(401).json({ success: false, message: '邮箱或密码错误' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
}
function register(req, res) {
    const { name, email, password } = req.body;

    try {
        const usersData = JSON.parse(fs.readFileSync(usersDbPath, 'utf8'));
        
        if (usersData.users.find(u => u.email === email)) {
            return res.status(400).json({ success: false, message: 'This email is already registered!' });
        }
        const fileContent = fs.readFileSync(seekersCsvPath, 'utf8');
        const lines = fileContent.trim().split('\n');
        let nextId = 1001; 
        if (lines.length > 1) {
            const lastLine = lines[lines.length - 1];
            const lastIdStr = lastLine.split(',')[0];
            const lastIdNum = parseInt(lastIdStr, 10);
            if (!isNaN(lastIdNum)) {
                nextId = lastIdNum + 1; 
            }
        }
        const newUser = {
            id: nextId.toString(), 
            email: email,
            password: password,
            name: name,
            isMember: false 
        };
        usersData.users.push(newUser);
        fs.writeFileSync(usersDbPath, JSON.stringify(usersData, null, 2), 'utf8');
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';
        const prefix = fileContent.endsWith('\n') ? '' : '\n';
        const emptyCsvRow = `${prefix}${nextId},"${firstName}","${lastName}","","",${email},"","","","","","","","","",""\n`;
        fs.appendFileSync(seekersCsvPath, emptyCsvRow, 'utf8');

        res.json({ success: true, message: 'Registration successful! Account and Profile created.' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
}

module.exports = { login, register };