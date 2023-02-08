const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/auth');
const {
  registerUser,
  loginUser,
  logout,
  checkLoggedIn,
  sendResetToken,
  resetPassword,
  viewAllUsers,
  getSingleUser,
  deleteUser,
} = require('../controllers/users');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/stat').get(checkLoggedIn);
router.route('/logout').post(logout);
router.route('/sendLink').post(sendResetToken);
router.route('/resetPassword').post(resetPassword);
router
  .route('/all')
  .get(authenticateUser, authorizePermissions('ADMIN'), viewAllUsers);
router
  .route('/:userId')
  .get(authenticateUser, authorizePermissions('ADMIN'), getSingleUser)
  .delete(authenticateUser, authorizePermissions('ADMIN'), deleteUser);

module.exports = router;
