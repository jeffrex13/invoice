const express = require('express')
const router = express.Router()
const invoiceController = require('../controllers/invoice')

// Create a new invoice
router.post('/invoice', invoiceController.createInvoice)

//Get all invoice
router.get('/invoice', invoiceController.getAllInvoices)

module.exports = router
