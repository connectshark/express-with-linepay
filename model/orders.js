const orders = {
  1: {
    amount: 3000,
    currency: 'TWD',
    orderId: 30,
    packages: [
      {
        id: 'coat_1',
        amount: 3000,
        products: [
          {
            name: '羽絨外套',
            quantity: 2,
            price: 1500
          }
        ]
      }
    ]
  },
  2: {
    amount: 500,
    currency: 'TWD',
    orderId: 31,
    packages: [
      {
        id: 'pen',
        amount: 500,
        products: [
          {
            name: '筆',
            quantity: 6,
            price: 50
          },
          {
            name: '剪刀',
            quantity: 2,
            price: 100
          }
        ]
      }
    ]
  },
}

module.exports = orders