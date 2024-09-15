const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    store: new FileStore({}),
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } 
}));


app.post('/login', (req, res) => {
    const { username, password } = req.body;

  
    if (username === 'user' && password === 'pass') {
        req.session.loggedIn = true;
        req.session.username = username;
        res.send(`Welcome ${username}, you are logged in!`);
    } else {
        res.send('Invalid credentials');
    }
});


app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out');
        }
        res.send('You have logged out');
    });
});


app.get('/dashboard', (req, res) => {
    if (req.session.loggedIn) {
        res.send(`Hello ${req.session.username}, welcome to your dashboard.`);
    } else {
        res.send('You must be logged in to view this page.');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
