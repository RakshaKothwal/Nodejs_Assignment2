const express = require('express');
const router = express.Router();


const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};


router.get('/', isAuthenticated, (req, res) => {
  res.render('index');
});

module.exports = router;
