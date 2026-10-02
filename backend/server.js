const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

// Core middleware
app.use(cors());
app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'ShopEase API is running' }));

// Optionally serve the frontend statically so the whole app can run from one port.
// (Not required if you serve the frontend separately with Live Server / another host.)
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// 404 + centralized error handling for API routes
app.use('/api', notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ShopEase server running on port ${PORT}`));
