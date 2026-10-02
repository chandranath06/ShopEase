const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Fashion', 'Shoes', 'Beauty', 'Home & Kitchen', 'Accessories', 'Sports', 'Books']
    },
    image: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 4 }
  },
  { timestamps: true }
);

// Text index so $text search works across name, description and category
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
