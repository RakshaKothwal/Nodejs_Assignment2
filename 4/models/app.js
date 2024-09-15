const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Student = require('./models/student');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://0.0.0.0:27017/student', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));


function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}


app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await user.comparePassword(password)) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});


app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.redirect('/login');
});


app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


app.get('/', isAuthenticated, (req, res) => {
  res.render('index');
});


app.get('/students', isAuthenticated, async (req, res) => {
  const students = await Student.find();
  res.render('students', { students });
});

app.get('/students/new', isAuthenticated, (req, res) => {
  res.render('students/new');
});

app.post('/students', isAuthenticated, async (req, res) => {
  const { name, age, department } = req.body;
  const student = new Student({ name, age, department });
  await student.save();
  res.redirect('/students');
});

app.get('/students/edit/:id', isAuthenticated, async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('students/edit', { student });
});

app.post('/students/edit/:id', isAuthenticated, async (req, res) => {
  const { name, age, department } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { name, age, department });
  res.redirect('/students');
});

app.get('/students/delete/:id', isAuthenticated, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/students');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
