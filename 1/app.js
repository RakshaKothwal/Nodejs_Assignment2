const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const User = require('./models/user');
const fs = require('fs');
const app = express();
const port = 3000;

mongoose.connect('mongodb://0.0.0.0:27017/userdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.set('view engine', 'ejs');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
   
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDFs are allowed'));
  }
});

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', upload.array('files', 5), async (req, res) => {
  const { username, password } = req.body;
  const files = req.files.map(file => file.originalname); 

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const user = new User({ username, password, files });
    await user.save();
    res.redirect('/files');
  } catch (err) {
    res.status(400).send('Error creating user: ' + err.message);
  }
});



app.get('/files', async (req, res) => {
  const users = await User.find();
  const allFiles = users.flatMap(user => user.files);
  res.render('files', { files: allFiles });
});


app.get('/files/download/:filename', (req, res) => {
  const file = path.join(__dirname, 'uploads', req.params.filename);
  res.download(file);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
