const {
  LINEPAY_SITE,
  LINEPAY_CHANNEL_ID,
  LINEPAY_CHANNEL_SECRET,
  LINEPAY_VERSION,
  LINEPAY_RETURN_HOST,
  LINEPAY_RETURN_CONFIRM_URL,
  LINEPAY_RETURN_CANCEL_URL
} = process.env
const fetch = require('node-fetch')
const orderList = require('../model/orders')
const HamcSHA256 = require('crypto-js/hmac-sha256')
const Base64 = require('crypto-js/enc-base64')

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
      res.send('error')
    }
  } catch (error) {
    console.log(error)
  }
  
  res.end()
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
    console.log(error)
    res.end()
  }
}

const createNonce = () => parseInt(new Date().getTime() / 1000)

const createHeader = (uri, linePayBody, nonce) => {
  const string = `${LINEPAY_CHANNEL_SECRET}/${LINEPAY_VERSION}${uri}${JSON.stringify(linePayBody)}${nonce}`
  const signature = Base64.stringify(HamcSHA256(string, LINEPAY_CHANNEL_SECRET))
  return {
    'Content-Type': 'application/json',
    'X-LINE-ChannelId': LINEPAY_CHANNEL_ID,
    'X-LINE-Authorization-Nonce': nonce,
    'X-LINE-Authorization': signature
  }
}

module.exports = {
  createLinePayOrder,
  confirmOrder
}