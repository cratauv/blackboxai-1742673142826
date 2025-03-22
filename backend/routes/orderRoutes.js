const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getOrders,
    updateOrderPayment,
    updateOrderTracking
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Customer routes
router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getOrders);

router.route('/myorders')
    .get(protect, getMyOrders);

// Order management routes
router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

router.route('/:id/pay')
    .put(protect, updateOrderPayment);

router.route('/:id/tracking')
    .put(protect, admin, updateOrderTracking);

module.exports = router;