const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    const {
        items,
        shippingAddress,
        paymentInfo,
        shippingCost,
        tax
    } = req.body;

    if (!items || items.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Calculate prices and verify stock
    const orderItems = await Promise.all(items.map(async (item) => {
        const product = await Product.findById(item.product);
        
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.product}`);
        }

        if (product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        return {
            product: item.product,
            quantity: item.quantity,
            price: product.discountedPrice,
            productDetails: {
                name: product.name,
                image: product.images[0]?.url
            }
        };
    }));

    // Calculate subtotal
    const subtotal = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    // Create order
    const order = new Order({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentInfo,
        subtotal,
        shippingCost,
        tax,
        totalAmount: subtotal + shippingCost + tax
    });

    // Save order and update product stock
    const createdOrder = await order.save();

    // Update product stock and user's order history
    await Promise.all([
        ...orderItems.map(item =>
            Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            })
        ),
        User.findByIdAndUpdate(req.user._id, {
            $push: { orderHistory: createdOrder._id }
        })
    ]);

    res.status(201).json(createdOrder);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.product', 'name images');

    if (order && (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin')) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
        await order.addStatusHistory(status, note);
        
        // If order is cancelled, restore product stock
        if (status === 'cancelled') {
            await Promise.all(
                order.items.map(item =>
                    Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: item.quantity }
                    })
                )
            );
        }

        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const count = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
        .populate('items.product', 'name images')
        .sort('-createdAt')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        orders,
        page,
        pages: Math.ceil(count / pageSize),
        total: count
    });
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const pageSize = 20;
    const page = Number(req.query.page) || 1;

    // Build query based on filters
    const query = {};

    if (req.query.status) {
        query.orderStatus = req.query.status;
    }

    if (req.query.startDate && req.query.endDate) {
        query.createdAt = {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
        };
    }

    const count = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .populate('user', 'id name email')
        .populate('items.product', 'name')
        .sort('-createdAt')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    // Calculate total revenue
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.json({
        orders,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
        totalRevenue
    });
};

// @desc    Update order payment status
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderPayment = async (req, res) => {
    const { transactionId, status } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
        order.paymentInfo.status = status;
        order.paymentInfo.transactionId = transactionId;
        
        if (status === 'completed') {
            order.orderStatus = 'processing';
            await order.addStatusHistory('processing', 'Payment completed');
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Update tracking information
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
const updateOrderTracking = async (req, res) => {
    const { carrier, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
        order.trackingInfo = {
            carrier,
            trackingNumber,
            estimatedDelivery: new Date(estimatedDelivery)
        };

        if (order.orderStatus === 'processing') {
            order.orderStatus = 'shipped';
            await order.addStatusHistory('shipped', `Shipped via ${carrier}`);
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

module.exports = {
    createOrder,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getOrders,
    updateOrderPayment,
    updateOrderTracking
};