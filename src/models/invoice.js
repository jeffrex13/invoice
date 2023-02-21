const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	products: [
		{
			productName: { type: String, required: true },
			productQuantity: { type: Number, required: true },
			productPrice: { type: Number, required: true }
		}
	],
	totalCost: { type: Number, required: true }
})

const Invoice = mongoose.model('Invoice', invoiceSchema)

module.exports = Invoice
