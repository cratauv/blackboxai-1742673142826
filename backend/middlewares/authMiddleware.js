const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT token
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401);
            throw new Error('Not authorized, no token provided');
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Add user to request object (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('User not found');
            }

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } catch (error) {
        next(error);
    }
};

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as admin');
    }
};

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Optional auth middleware - doesn't require authentication but will process token if present
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
            } catch (error) {
                // Invalid token - but we'll continue without user
                req.user = null;
            }
        } else {
            req.user = null;
        }

        next();
    } catch (error) {
        next(error);
    }
};

// Rate limiting middleware (basic implementation)
const rateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
};

const rateLimiter = (req, res, next) => {
    // Implementation would typically use Redis or similar for production
    // This is a basic example
    if (!global.requestCounts) {
        global.requestCounts = new Map();
    }

    const ip = req.ip;
    const current = Date.now();
    const requestData = global.requestCounts.get(ip) || { count: 0, firstRequest: current };

    if (current - requestData.firstRequest > rateLimit.windowMs) {
        // Reset if window has passed
        requestData.count = 1;
        requestData.firstRequest = current;
    } else if (requestData.count >= rateLimit.max) {
        res.status(429).json({
            message: 'Too many requests, please try again later.'
        });
        return;
    } else {
        requestData.count++;
    }

    global.requestCounts.set(ip, requestData);
    next();
};

module.exports = {
    protect,
    admin,
    generateToken,
    optionalAuth,
    rateLimiter
};