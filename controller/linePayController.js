const {
  LINEPAY_SITE,
  LINEPAY_CHANNEL_ID,
  LINEPAY_CHANNEL_SECRET,
  LINEPAY_VERSION,
  LINEPAY_RETURN_HOST,
  LINEPAY_RETURN_CONFIRM_URL,
  LINEPAY_RETURN_CANCEL_URL
} = process.env
const orderList = require('../model/orders')
const path = require('path')
const { createHmac } = require('crypto')

const orders = {}

const createLinePayOrder = async (req, res) => {
  const orderIndex = req.params.orderIndex
  const order = orderList[orderIndex]
  order['orderId'] = createNonce()
  orders[order.orderId] = order
  const linePayBody = {
    ...order,
    redirectUrls: {
      confirmUrl: LINEPAY_RETURN_HOST + LINEPAY_RETURN_CONFIRM_URL,
      cancelUrl: LINEPAY_RETURN_HOST + LINEPAY_RETURN_CANCEL_URL 
    }
  }

  const uri = '/payments/request'
  const nonce = createNonce()
  const headers = createHeader(uri, linePayBody, nonce)

  const apiUrl = LINEPAY_SITE + '/' + LINEPAY_VERSION + uri
  try {
    const linePayResponse = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(linePayBody),
      headers
    })
    const response = await linePayResponse.json()

    if (response.returnCode === '0000') {
      res.redirect(response.info.paymentUrl.web)
    } else {
      res.sendFile(path.join(__dirname, '..', 'views', 'error.html'))
    }
  } catch (error) {
    res.sendFile(path.join(__dirname, '..', 'views', 'error.html'))
  }
}

const confirmOrder = async ( req, res ) => {
  const orderId = req.query.orderId
  const transactionId = req.query.transactionId

  const order = orders[orderId]
  const linePayBody = {
    amount: order.amount,
    currency: order.currency
  }

  const uri = `/payments/${transactionId}/confirm`
  const nonce = createNonce()
  const headers = createHeader(uri, linePayBody, nonce)

  const apiUrl = LINEPAY_SITE + '/' + LINEPAY_VERSION + uri

  try {
    const linePayResponse = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(linePayBody),
      headers
    })
    const response = await linePayResponse.json()
    if (response.returnCode === '0000') {
      res.render('confirm', {
        orderId: response.info.orderId,
        transactionId: response.info.transactionId
      })
    }
    
  } catch (error) {
    res.sendFile(path.join(__dirname, '..', 'views', 'error.html'))
  }
}

const cancelOrder = ( req, res ) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'error.html'))
}

const createNonce = () => parseInt(new Date().getTime() / 1000)

const createHeader = (uri, linePayBody, nonce) => {
  const string = `${LINEPAY_CHANNEL_SECRET}/${LINEPAY_VERSION}${uri}${JSON.stringify(linePayBody)}${nonce}`
  const signature = createHmac('sha256', LINEPAY_CHANNEL_SECRET).update(string).digest('base64')
  return {
    'Content-Type': 'application/json',
    'X-LINE-ChannelId': LINEPAY_CHANNEL_ID,
    'X-LINE-Authorization-Nonce': nonce,
    'X-LINE-Authorization': signature
  }
}


module.exports = {
  createLinePayOrder,
  confirmOrder,
  cancelOrder
}