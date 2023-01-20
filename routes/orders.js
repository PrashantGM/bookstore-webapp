const express = require('express');
const router = express.Router();

const {
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  viewCartItems,
  getCartItemsCount,
} = require('../controllers/orders');

router.route('/count/:id').get(getCartItemsCount);
router
  .route('/:id')
  .post(addItemToCart)
  .get(viewCartItems)
  .put(updateCartItem)
  .delete(deleteCartItem);

module.exports = router;
