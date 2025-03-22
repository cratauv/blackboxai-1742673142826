const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
} = require('../controllers/userController');
const { protect, admin, rateLimiter } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', rateLimiter, registerUser);
router.post('/login', rateLimiter, loginUser);

// Protected routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin routes
router.route('/')
    .get(protect, admin, getUsers);

router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;