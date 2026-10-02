const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { getUsers, getUserById, deleteUser, getDashboardStats } = require('../controllers/userController');

// Every route in this file requires a logged-in admin
router.use(authMiddleware, adminMiddleware);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

router.get('/dashboard', getDashboardStats);

module.exports = router;
