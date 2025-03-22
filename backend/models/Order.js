const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity cannot be less than 1']
        },
        price: {
            type: Number,
            required: true
        },
        // Store product details at time of purchase
        productDetails: {
            name: String,
            image: String
        }
    }],
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    paymentInfo: {
        method: {
            type: String,
            required: true,
            enum: ['credit_card', 'debit_card', 'paypal']
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        },
        transactionId: String
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    trackingInfo: {
        carrier: String,
        trackingNumber: String,
        estimatedDelivery: Date
    },
    subtotal: {
        type: Number,
        required: true
    },
    shippingCost: {
        type: Number,
        required: true,
        default: 0
    },
    tax: {
        type: Number,
        required: true,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    notes: String,
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        },
        date: {
            type: Date,
            default: Date.now
        },
        note: String
    }]
}, {
    timestamps: true
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
    this.totalAmount = this.subtotal + this.shippingCost + this.tax;
    next();
});

// Add status change to history
orderSchema.methods.addStatusHistory = function(status, note = '') {
    this.statusHistory.push({
        status,
        note,
        date: new Date()
    });
    this.orderStatus = status;
    return this.save();
};

// Virtual for order number (for customer reference)
orderSchema.virtual('orderNumber').get(function() {
    return `ORD-${this._id.toString().slice(-6).toUpperCase()}`;
});

// Index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;