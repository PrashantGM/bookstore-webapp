const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/auth');
const {
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  viewCartItems,
  getCartItemsCount,
  createPaymentIntent,
  webhookListener,
  getOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  testRoute,
} = require('../controllers/orders');

router.route('/order/stripe').post(authenticateUser, createPaymentIntent);
router.route('/order/testRoute').get(testRoute);
router.route('/order/stripe/webhook').post(
  express.raw({ type: 'application/json' }),
  // authenticateUser,
  webhookListener
);
router.route('/orders/all').get(getAllOrders);
router.route('/cart/count/:uid').get(getCartItemsCount);

router.route('/order/:userId').get(authenticateUser, getOrders);

router
  .route('/cart/:userId')
  .post(authenticateUser, addItemToCart)
  .get(authenticateUser, viewCartItems)
  .put(authenticateUser, updateCartItem)
  .delete(authenticateUser, deleteCartItem);

router
  .route('/admin/order/:id')
  .put(authenticateUser, authorizePermissions('ADMIN'), updateOrder)
  .delete(authenticateUser, authorizePermissions('ADMIN'), deleteOrder);

module.exports = router;
