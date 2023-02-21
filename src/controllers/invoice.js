const jwt = require('jsonwebtoken')
const Invoice = require('../models/invoice')
const User = require('../models/user')
const Product = require('../models/product')

exports.createInvoice = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1] // Get JWT token from Authorization header
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Decode JWT token
    const user = await User.findById(decoded.userId) // Find user by ID

    const { products } = req.body // Get products array from request body

    let totalCost = 0

    const invoiceProducts = await Promise.all(
      products.map(async (product) => {
        const productDoc = await Product.findById(product.productId) // Find product by ID
        if (!productDoc) {
          throw new Error(`Product with ID ${product.productId} not found`)
        }

        if (productDoc.productQuantity < product.quantity) {
          throw new Error(
            `Product with ID ${product.productId} does not have enough quantity`,
          )
        }

        const invoiceProduct = {
          productName: productDoc.productName,
          productQuantity: product.quantity,
          productPrice: productDoc.productPrice,
        }

        totalCost +=
          invoiceProduct.productQuantity * invoiceProduct.productPrice

        // Deduct product quantity from inventory
        productDoc.productQuantity -= product.quantity
        await productDoc.save()

        return invoiceProduct
      }),
    )

    const newInvoice = new Invoice({
      user: user._id,
      products: invoiceProducts,
      totalCost,
    })

    await newInvoice.save()
    res.status(201).json(newInvoice)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
    res.json(invoices)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' })
    }
    res.json(invoice)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

exports.deleteInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' })
    }
    await invoice.remove()
    res.json({ message: 'Invoice removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('user', '-password')
    res.status(200).json(invoices)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}
