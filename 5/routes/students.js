const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const jwt = require('jsonwebtoken');


const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (token) {
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};


router.get('/', authenticateJWT, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).send('Error fetching students');
  }
});


router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { name, age, department } = req.body;
    const student = new Student({ name, age, department });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).send('Error adding student');
  }
});


router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { name, age, department } = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, { name, age, department }, { new: true });
    if (!student) return res.status(404).send('Student not found');
    res.json(student);
  } catch (err) {
    res.status(500).send('Error updating student');
  }
});


router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Error deleting student');
  }
});

module.exports = router;
