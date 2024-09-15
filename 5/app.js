const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = 'mongodb://0.0.0.0:27017/student'; 
const JWT_SECRET = 'your_jwt_secret'; 


mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/auth', authRoutes);
app.use('/students', studentRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
