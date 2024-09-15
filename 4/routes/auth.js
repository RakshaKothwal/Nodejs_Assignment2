const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/login', (req, res) => {
  res.render('login');
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await user.comparePassword(password)) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.redirect('/auth/login');
  }
});


router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.redirect('/auth/login');
});


router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
