const {
  LINEPAY_CHANNEL_ID,
  LINEPAY_CHANNEL_SECRET,
  LINEPAY_VERSION,
  LINEPAY_RETURN_HOST,
  LINEPAY_RETURN_CONFIRM_URL,
  LINEPAY_RETURN_CANCEL_URL
} = process.env
const fetch = require('node-fetch')
const orderList = require('../model/orders')

const createLinePayOrder = (req, res) => {
  const orderId = req.params.orderId
}


module.exports = {
  createLinePayOrder
}