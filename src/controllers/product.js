const Product = require('../models/product')

// Create new product
exports.createProduct = async (req, res) => {
	try {
		const { productName, productQuantity, productPrice } = req.body
		const newProduct = new Product({ productName, productQuantity, productPrice })
		await newProduct.save()
		console.log(newProduct)
		res.status(201).json(newProduct)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error' })
	}
}

// Get all products
exports.getAllProducts = async (req, res) => {
	try {
		const products = await Product.find()
		res.json(products)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error' })
	}
}

// Get single product by ID
exports.getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)
		if (!product) {
			return res.status(404).json({ error: 'Product not found' })
		}
		res.json(product)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error' })
	}
}

// Update product by ID
exports.updateProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)
		if (!product) {
			return res.status(404).json({ error: 'Product not found' })
		}
		product.productName = req.body.productName
		product.productQuantity = req.body.productQuantity
		product.productPrice = req.body.productPrice
		await product.save()
		res.json(product)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error' })
	}
}

// Delete product by ID
exports.deleteProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)
		if (!product) {
			return res.status(404).json({ error: 'Product not found' })
		}
		await product.remove()
		res.json({ message: 'Product removed' })
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Server error' })
	}
}
