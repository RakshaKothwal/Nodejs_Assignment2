const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
 
  price: { type: Number, required: true },
  pictures: [{ type: String }],
});

module.exports = mongoose.model('Product', productSchema);
