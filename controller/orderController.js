const orderList = require('../model/orders')
const path = require('path')

const getOrderDetail = (req, res) => {
  const orderIndex = req.params.orderIndex
  const order = orderList[orderIndex]
  if (!order) {
    res.sendFile(path.join(__dirname, '..', 'views', 'error.html'))
  } else {
    res.render('order', { order, orderIndex })
  }
  
}

const getOrderList = (req, res) => {
  res.render('orderList', { orderList })
}

module.exports = {
  getOrderDetail,
  getOrderList
}