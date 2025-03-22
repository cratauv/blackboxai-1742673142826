// Error handling middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: Object.values(err.errors).map(error => ({
                field: error.path,
                message: error.message
            }))
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            message: 'Duplicate Field Error',
            error: `${field} already exists`
        });
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: 'Invalid ID',
            error: `Invalid ${err.path}: ${err.value}`
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token',
            error: 'Please authenticate'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expired',
            error: 'Please authenticate again'
        });
    }

    // Default error response
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
        error: err.errors || err.error || 'An error occurred'
    });
};

// Not Found middleware
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = {
    errorHandler,
    notFound
};