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
  addBooksToReadingList,
  viewReadingList,
  checkLoggedIn,
  deleteReadingList,
} = require('../controllers/users');
// const { getAllBooks } = require('../controllers/books');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/stat').get(checkLoggedIn); //query to senior devs
router.route('/:id').get(getSingleUser).patch(addBooksToReadingList);
router.route('/reads/:id').get(viewReadingList);
router.route('/logout').post(logout);
router.route('/reads').delete(deleteReadingList);
// router
//   .route('/admin/books')
//   .get(authenticateUser, authorizePermissions, getAllBooks);

module.exports = router;
