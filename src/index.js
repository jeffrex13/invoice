const cors = require('cors')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userController = require('./routes/user')
const productController = require('./routes/product')
const invoiceController = require('./routes/invoice')
require('dotenv').config({ path: '.env.development' })
const mongoose = require('mongoose')

mongoose
  .connect('mongodb://127.0.0.1/invoice', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(bodyParser({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use('/app/', userController)
app.use('/app/', productController)
app.use('/app/', invoiceController)

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
