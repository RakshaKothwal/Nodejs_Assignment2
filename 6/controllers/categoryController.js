const Category = require('../models/Category');

exports.index = async (req, res) => {
  const categories = await Category.find();
  res.render('categories/index', { categories });
};

exports.new = (req, res) => {
  res.render('categories/new');
};

exports.create = async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.redirect('/categories');
};

exports.edit = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render('categories/edit', { category });
};

exports.update = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/categories');
};

exports.delete = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect('/categories');
};
