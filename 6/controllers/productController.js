const Product = require('../models/Product');
const Category = require('../models/Category');
const upload = require('../middlewares/upload');


exports.index = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    const categories = await Category.find();
    res.render('products/index', { products, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.new = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('products/new', { categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error rendering form');
  }
};


exports.create = [
  upload.array('pictures', 5), 
  async (req, res) => {
    try {
      const pictures = req.files.map(file => `/uploads/${file.filename}`); 
      const product = new Product({
        ...req.body,
        pictures,
      });
      await product.save();
      res.redirect('/products');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error saving product');
    }
  },
];


exports.edit = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    const categories = await Category.find();
    res.render('products/edit', { product, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error rendering form');
  }
};

const fs = require('fs');
const path = require('path');

exports.update = [
  upload.array('pictures', 5), 
  async (req, res) => {
    try {
    
      let pictures = [];
      if (req.body.existingPictures) {
        pictures = req.body.existingPictures.split(',');
      }

     
      if (req.body.removePictures) {
        const picturesToRemove = Array.isArray(req.body.removePictures)
          ? req.body.removePictures
          : [req.body.removePictures];
        
       
        picturesToRemove.forEach(pic => {
          const filePath = path.join(__dirname, '..', 'uploads', path.basename(pic));
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });

      
        pictures = pictures.filter(picture => !picturesToRemove.includes(picture));
      }

      const newPictures = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
      pictures = [...pictures, ...newPictures];


      await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        pictures,
      });

      res.redirect('/products');
    } catch (error) {
      console.error('Error updating product', error);
      res.status(500).send('Error updating product');
    }
  }
];



exports.delete = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting product');
  }
};
