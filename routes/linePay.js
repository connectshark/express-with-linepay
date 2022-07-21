const express = require('express')
const router = express.Router()
const linePayHandler = require('../controller/linePayController')

router
  .post('/create/:orderIndex', linePayHandler.createLinePayOrder)
  .get('/confirm', linePayHandler.confirmOrder)
  .get('/cancel', linePayHandler.cancelOrder)

module.exports = router