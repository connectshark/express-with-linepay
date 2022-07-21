const orderList = require('../model/orders')

const getOrderDetail = (req, res) => {
  const orderIndex = req.params.orderIndex
  const order = orderList[orderIndex]
  res.render('order', { order, orderIndex })
}

const getOrderList = (req, res) => {
  res.render('orderList', { orderList })
}

module.exports = {
  getOrderDetail,
  getOrderList
}