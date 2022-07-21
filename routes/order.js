const express = require('express')
const router = express.Router()
const orderHandler = require('../controller/orderController')

router.get('/:orderId', orderHandler.getOrderDetail)

module.exports = router