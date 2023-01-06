const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/auth');
const {
  registerUser,
  loginUser,
  getSingleUser,
  logout,
  addBooksToReadingList,
} = require('../controllers/users');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router
  .route('/:id')
  .get(authenticateUser, getSingleUser)
  .patch(addBooksToReadingList);
router.route('/logout').get(logout);

module.exports = router;
