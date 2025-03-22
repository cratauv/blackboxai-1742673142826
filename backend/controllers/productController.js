const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;

    // Build query based on filters
    const query = {};

    // Search functionality
    if (req.query.keyword) {
        query.$text = { $search: req.query.keyword };
    }

    // Category filter
    if (req.query.category) {
        query.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Status filter (active/inactive)
    if (req.query.status) {
        query.status = req.query.status;
    }

    // Count total products matching query
    const count = await Product.countDocuments(query);

    // Fetch products with pagination
    const products = await Product.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(req.query.sortBy ? { [req.query.sortBy]: req.query.order || -1 } : { createdAt: -1 });

    res.json({
        products,
        page,
        pages: Math.ceil(count / pageSize),
        total: count
    });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('vendor.id', 'name email')
        .populate('ratings.user', 'name');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        images,
        category,
        stock,
        specifications,
        shipping,
        tags
    } = req.body;

    const product = new Product({
        name,
        description,
        price,
        images,
        category,
        stock,
        specifications,
        shipping,
        tags,
        vendor: {
            name: req.user.name,
            id: req.user._id
        }
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        images,
        category,
        stock,
        specifications,
        shipping,
        tags,
        status,
        discounts
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.images = images || product.images;
        product.category = category || product.category;
        product.stock = stock !== undefined ? stock : product.stock;
        product.specifications = specifications || product.specifications;
        product.shipping = shipping || product.shipping;
        product.tags = tags || product.tags;
        product.status = status || product.status;
        product.discounts = discounts || product.discounts;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, review } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.ratings.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const newReview = {
            user: req.user._id,
            rating: Number(rating),
            review,
        };

        product.ratings.push(newReview);
        await product.updateAverageRating();

        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = async (req, res) => {
    const categories = await Product.distinct('category');
    res.json(categories);
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
const updateProductStock = async (req, res) => {
    const { stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.stock = stock;
        product.status = stock > 0 ? 'active' : 'out_of_stock';

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductCategories,
    updateProductStock
};