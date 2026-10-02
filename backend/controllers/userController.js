const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @route  GET /api/admin/users  (admin only)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/users/:id  (admin only)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/admin/users/:id  (admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete an admin account' });
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/dashboard  (admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find()
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

    res.json({ totalUsers, totalProducts, totalOrders, totalRevenue, pendingOrders, deliveredOrders });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUserById, deleteUser, getDashboardStats };
