const express = require('express')
const router = express.Router()
const linePayHandler = require('../controller/linePayController')

router
  .post('/create/:orderId', linePayHandler.createLinePayOrder)

module.exports = router