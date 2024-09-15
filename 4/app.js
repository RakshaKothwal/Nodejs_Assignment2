const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;


mongoose.connect('mongodb://0.0.0.0:27017/student', { useNewUrlParser: true, useUnifiedTopology: true });


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));


app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/students', require('./routes/students'));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
