const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    const user = new User({ username, password });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Error registering user');
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
    const user = await User.findOne({ username });
    if (user && await user.comparePassword(password)) {
      const token = user.generateAuthToken();
      res.json({ token });
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
