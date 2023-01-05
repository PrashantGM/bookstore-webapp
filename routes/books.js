const express = require('express');
const upload = require('../middlewares/multer');
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/auth');
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksForUser,
} = require('../controllers/books');

router
  .route('/admin')
  .post(authenticateUser, authorizePermissions, upload.single('image'), addBook)
  .get(authenticateUser, authorizePermissions, getAllBooks);
router
  .route('/admin/:id')
  .get(authenticateUser, authorizePermissions, getBookById)
  .put(authenticateUser, authorizePermissions, updateBook)
  .delete(authenticateUser, authorizePermissions, deleteBook);
router.route('/').get(getBooksForUser);
module.exports = router;
