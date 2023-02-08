const express = require('express');
const router = express.Router();

router.get('/user/register', (req, res) => {
  res.render('./pages/register');
});
router.get('/user/login', (req, res) => {
  res.render('./pages/login');
});
router.get('/notFound', (req, res) => {
  res.render('./pages/notFound');
});

router.get('/orders/checkout/success', (req, res) => {
  res.render('./pages/success');
});

router.get('/user/reset-password', (req, res) => {
  res.render('./pages/reset');
});
router.get('/', (req, res) => {
  res.render('./pages/home');
});

module.exports = router;
