const express = require('express');
const router = express.Router();

const { addItemToCart, viewCartItems } = require('../controllers/orders');

router.route('/:id').post(addItemToCart).get(viewCartItems);

module.exports = router;
