const orderList = require('../model/orders')

const getOrderDetail = (req, res) => {
  const orderId = req.params.orderId
  const order = orderList[orderId]
  res.render('order', { order })
}
module.exports = {
  getOrderDetail
}