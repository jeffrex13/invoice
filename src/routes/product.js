const express = require('express')
const router = express.Router()
const productController = require('../controllers/product')

// Create a new product
router.post('/product', productController.createProduct)

// Get all products
router.get('/product', productController.getAllProducts)

// Get a single product by ID
router.get('/product/:id', productController.getProductById)

// Update a product by ID
router.put('/product/:id', productController.updateProductById)

// Delete a product by ID
router.delete('/product/:id', productController.deleteProductById)

module.exports = router
