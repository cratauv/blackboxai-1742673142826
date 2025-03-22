const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: 'Product image'
        }
    }],
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    vendor: {
        name: {
            type: String,
            required: [true, 'Vendor name is required']
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    specifications: [{
        name: String,
        value: String
    }],
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        review: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    shipping: {
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        },
        shippingCost: Number
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'out_of_stock'],
        default: 'active'
    },
    tags: [{
        type: String,
        trim: true
    }],
    discounts: {
        percentage: {
            type: Number,
            min: 0,
            max: 100
        },
        validUntil: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
    if (this.discounts && this.discounts.percentage && this.discounts.validUntil > Date.now()) {
        return this.price * (1 - this.discounts.percentage / 100);
    }
    return this.price;
});

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });

// Update average rating when a new rating is added
productSchema.methods.updateAverageRating = function() {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
    } else {
        const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
        this.averageRating = sum / this.ratings.length;
    }
    return this.save();
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;