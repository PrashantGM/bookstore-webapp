const express = require('express');
const router = express.Router();

const {
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  viewCartItems,
  getCartItemsCount,
  createPaymentIntent,
  webhookListener,
  getOrders,
  testRoute,
} = require('../controllers/orders');

router.route('order/stripe').post(createPaymentIntent);
router.route('order/testRoute').get(testRoute);
router
  .route('order/stripe/webhook')
  .post(express.raw({ type: 'application/json' }), webhookListener);
router.route('/cart/count/:id').get(getCartItemsCount);

router.route('/order/:id').get(getOrders);

router
  .route('/cart/:id')
  .post(addItemToCart)
  .get(viewCartItems)
  .put(updateCartItem)
  .delete(deleteCartItem);

module.exports = router;
