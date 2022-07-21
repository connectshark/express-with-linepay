const express = require('express')
const router = express.Router()
const orderHandler = require('../controller/orderController')

router
  .get('/', orderHandler.getOrderList)
  .get('/:orderIndex', orderHandler.getOrderDetail)

module.exports = router