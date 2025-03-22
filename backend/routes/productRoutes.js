const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductCategories,
    updateProductStock
} = require('../controllers/productController');
const { protect, admin, optionalAuth } = require('../middlewares/authMiddleware');

// Public routes with optional auth for personalized results
router.route('/')
    .get(optionalAuth, getProducts)
    .post(protect, admin, createProduct);

router.get('/categories', getProductCategories);

// Product detail routes
router.route('/:id')
    .get(optionalAuth, getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

// Review routes
router.route('/:id/reviews')
    .post(protect, createProductReview);

// Stock management routes
router.route('/:id/stock')
    .put(protect, admin, updateProductStock);

module.exports = router;