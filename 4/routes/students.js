const express = require('express');
const router = express.Router();
const Student = require('../models/student');


const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

router.get('/', isAuthenticated, async (req, res) => {
  const students = await Student.find();
  res.render('students/index', { students });
});

router.get('/new', isAuthenticated, (req, res) => {
  res.render('students/new');
});


router.post('/', isAuthenticated, async (req, res) => {
    try {
      const { name, age, department } = req.body;
      const student = new Student({ name, age, department });
      await student.save();
      res.redirect('/students');
    } catch (err) {
      res.status(500).send('Error adding student');
    }
  });
  


router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).send('Student not found');
      }
      res.render('students/edit', { student });
    } catch (err) {
      res.status(500).send('Error fetching student');
    }
  });
  

router.post('/edit/:id', isAuthenticated, async (req, res) => {
    try {
      const { name, age, department } = req.body;
      await Student.findByIdAndUpdate(req.params.id, { name, age, department });
      res.redirect('/students');
    } catch (err) {
      res.status(500).send('Error updating student');
    }
  });
  


router.get('/delete/:id', isAuthenticated, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/students');
});

module.exports = router;
