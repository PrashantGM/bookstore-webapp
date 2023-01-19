const express = require('express');
const router = express.Router();

const {
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  viewCartItems,
} = require('../controllers/orders');

router
  .route('/:id')
  .post(addItemToCart)
  .get(viewCartItems)
  .put(updateCartItem)
  .delete(deleteCartItem);

module.exports = router;
