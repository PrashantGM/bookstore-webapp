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
  testRoute,
} = require('../controllers/orders');

router.route('/stripe').post(createPaymentIntent);
router.route('/testRoute').get(testRoute);
router
  .route('/stripe/webhook')
  .post(express.raw({ type: 'application/json' }), webhookListener);
router.route('/count/:id').get(getCartItemsCount);
router
  .route('/:id')
  .post(addItemToCart)
  .get(viewCartItems)
  .put(updateCartItem)
  .delete(deleteCartItem);

module.exports = router;
