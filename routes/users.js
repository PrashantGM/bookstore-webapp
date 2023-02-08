const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/auth');
const {
  registerUser,
  loginUser,
  getSingleUser,
  logout,
  checkLoggedIn,
  sendResetToken,
  resetPassword,
} = require('../controllers/users');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/stat').get(checkLoggedIn); //query to senior devs
router.route('/logout').post(logout);
router.route('/sendLink').post(sendResetToken);
router.route('/resetPassword').post(resetPassword);

module.exports = router;
