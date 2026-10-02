// Run with: npm run seed
// Wipes existing Users/Products/Orders and inserts fresh demo data,
// including one admin account and a handful of sample products.

const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

dotenv.config();

const products = [
  { name: 'Wireless Bluetooth Headphones', description: 'Over-ear headphones with active noise cancellation and 30-hour battery life.', price: 2999, discountPrice: 2299, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', stock: 25, rating: 4.5 },
  { name: '4K Smart LED TV 43-inch', description: 'Ultra HD smart television with built-in streaming apps and voice remote.', price: 27999, discountPrice: 23999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500', stock: 12, rating: 4.3 },
  { name: 'Mechanical Gaming Keyboard', description: 'RGB backlit mechanical keyboard with blue switches, built for gaming and typing.', price: 3499, discountPrice: null, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', stock: 30, rating: 4.6 },
  { name: 'Smartphone 128GB', description: 'Full HD+ display, triple camera setup, all-day battery life.', price: 15999, discountPrice: 13999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', stock: 18, rating: 4.2 },
  { name: "Men's Slim Fit Casual Shirt", description: 'Breathable cotton-blend shirt available in multiple colors.', price: 899, discountPrice: 649, category: 'Fashion', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', stock: 60, rating: 4.1 },
  { name: "Women's Floral Summer Dress", description: 'Lightweight flowy dress, perfect for summer outings.', price: 1299, discountPrice: 999, category: 'Fashion', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', stock: 40, rating: 4.4 },
  { name: 'Denim Jacket Unisex', description: 'Classic washed denim jacket that pairs with anything.', price: 1999, discountPrice: null, category: 'Fashion', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', stock: 35, rating: 4.3 },
  { name: 'Running Shoes - Lightweight', description: 'Breathable mesh running shoes with cushioned sole for daily runs.', price: 2499, discountPrice: 1899, category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', stock: 45, rating: 4.5 },
  { name: 'Leather Formal Shoes', description: 'Genuine leather formal shoes for office and occasions.', price: 3299, discountPrice: 2799, category: 'Shoes', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500', stock: 22, rating: 4.2 },
  { name: 'Casual Canvas Sneakers', description: 'Everyday canvas sneakers with rubber sole, unisex design.', price: 1499, discountPrice: null, category: 'Shoes', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500', stock: 50, rating: 4.0 },
  { name: 'Vitamin C Face Serum', description: 'Brightening serum with hyaluronic acid for glowing skin.', price: 699, discountPrice: 549, category: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', stock: 70, rating: 4.6 },
  { name: 'Matte Lipstick Set (6 Shades)', description: 'Long-lasting, smudge-proof matte lipsticks in trending shades.', price: 899, discountPrice: 699, category: 'Beauty', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500', stock: 55, rating: 4.3 },
  { name: 'Non-Stick Cookware Set (5 Pcs)', description: 'Durable non-stick cookware set suitable for all stovetops.', price: 2799, discountPrice: 2299, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1584990347449-a0b5a3d2c8e1?w=500', stock: 20, rating: 4.4 },
  { name: 'Electric Kettle 1.5L', description: 'Fast-boiling stainless steel electric kettle with auto shut-off.', price: 999, discountPrice: 799, category: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1594213487950-2334213f77e4?w=500', stock: 40, rating: 4.1 },
  { name: 'Leather Wallet for Men', description: 'Slim genuine leather wallet with multiple card slots.', price: 799, discountPrice: 599, category: 'Accessories', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', stock: 65, rating: 4.3 },
  { name: 'Analog Wrist Watch', description: 'Minimalist analog watch with genuine leather strap.', price: 1599, discountPrice: 1299, category: 'Accessories', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500', stock: 33, rating: 4.5 },
  { name: 'Yoga Mat with Carry Strap', description: 'Non-slip 6mm thick yoga mat, ideal for home workouts.', price: 799, discountPrice: 599, category: 'Sports', image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500', stock: 48, rating: 4.4 },
  { name: 'Adjustable Dumbbell Set', description: 'Space-saving adjustable dumbbells for strength training at home.', price: 3999, discountPrice: 3299, category: 'Sports', image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=500', stock: 15, rating: 4.5 },
  { name: 'The Pragmatic Programmer', description: 'A must-read book for every software developer, covers practical coding wisdom.', price: 899, discountPrice: 699, category: 'Books', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', stock: 28, rating: 4.8 },
  { name: 'Atomic Habits', description: 'Bestselling book on building good habits and breaking bad ones.', price: 599, discountPrice: 449, category: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', stock: 50, rating: 4.9 }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Creating users...');
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const userPasswordHash = await bcrypt.hash('User@123', 10);

    await User.create({
      name: 'ShopEase Admin',
      email: 'admin@shopease.com',
      password: adminPasswordHash,
      phone: '9999999999',
      role: 'admin'
    });

    await User.create([
      {
        name: 'Riya Sharma',
        email: 'riya@example.com',
        password: userPasswordHash,
        phone: '9876543210',
        role: 'user',
        address: { street: '12 MG Road', city: 'Kolkata', state: 'West Bengal', pincode: '700001' }
      },
      {
        name: 'Arjun Verma',
        email: 'arjun@example.com',
        password: userPasswordHash,
        phone: '9123456780',
        role: 'user',
        address: { street: '45 Park Street', city: 'Kolkata', state: 'West Bengal', pincode: '700016' }
      }
    ]);

    console.log('Creating products...');
    await Product.insertMany(products);

    console.log('Seed complete!');
    console.log('----------------------------------------');
    console.log('Admin login  -> email: admin@shopease.com | password: Admin@123');
    console.log('User login   -> email: riya@example.com   | password: User@123');
    console.log('----------------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
