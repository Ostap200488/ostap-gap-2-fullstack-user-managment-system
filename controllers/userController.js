
const bcrypt = require('bcrypt');

// In-memory user storage
const users = [
    { name: "Admin", email: "admin@example.com", password: "$2b$10$TjC44QzQ/eClJDi7ecX0He1oJ9/YnR8S7bJWOVHCU8wtU3aw2/eiW", role: "admin" }
];

const loadRegister = (req, res) => {
    res.render('register');
};

const insertUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: "user" // Default role
        };
        users.push(user);
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
        res.render('register', { error: 'Error registering user' });
    }
};

const loadLogin = (req, res) => {
    res.render('login');
};

const authenticateUser = async (req, res) => {
    try {
        const user = users.find(u => u.email === req.body.email);
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            return res.redirect('/dashboard');
        }
        res.render('login', { error: 'Invalid credentials' });
    } catch (error) {
        console.log(error.message);
        res.render('login', { error: 'Error logging in' });
    }
};

const loadDashboard = (req, res) => {
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            return res.render('adminDashboard', { users });
        }
        return res.render('userDashboard', { user: req.session.user });
    }
    res.redirect('/');
};

const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
};

module.exports = {
    loadRegister,
    insertUser,
    loadLogin,
    authenticateUser,
    loadDashboard,
    logoutUser
};
