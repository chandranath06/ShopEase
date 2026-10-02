const Product = require('../models/Product');

// @route  GET /api/products
// Supports: ?search=&category=&minPrice=&maxPrice=&sort=&page=&limit=
const getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 }; // Newest first (default)
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter)
    ]);

    res.json({
      products,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      totalProducts: total
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.json({ product, relatedProducts });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/products/category/:category
const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/products  (admin only)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, category, image, stock, rating } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: 'Name, description, price, category and image are required' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice: discountPrice || null,
      category,
      image,
      stock: stock || 0,
      rating: rating || 4
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/products/:id  (admin only)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const fields = ['name', 'description', 'price', 'discountPrice', 'category', 'image', 'stock', 'rating'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/products/:id  (admin only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
};
