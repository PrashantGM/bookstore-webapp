const express = require('express');
const router = express.Router();

const { addItemToCart } = require('../controllers/orders');

router.route('/:id').post(addItemToCart);

module.exports = router;
