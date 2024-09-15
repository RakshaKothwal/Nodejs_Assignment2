const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost/productapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');


app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
