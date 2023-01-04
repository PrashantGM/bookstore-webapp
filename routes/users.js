const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/auth');
const {
  registerUser,
  loginUser,
  getSingleUser,
  logout,
} = require('../controllers/users');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/:id').get(authenticateUser, getSingleUser);
router.route('/logout').get(logout);

module.exports = router;
