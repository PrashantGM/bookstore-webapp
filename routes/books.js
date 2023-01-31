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
  getSingleBookForUser,
  getSimilarBooksForUser,
} = require('../controllers/books');

router
  .route('/admin')
  .post(
    authenticateUser,
    authorizePermissions('admin'),
    upload.single('image'),
    addBook
  )
  .get(authenticateUser, authorizePermissions('admin'), getAllBooks);
router
  .route('/admin/:id')
  .get(authenticateUser, authorizePermissions('admin'), getBookById)
  .put(
    authenticateUser,
    authorizePermissions('admin'),
    upload.single('image'),
    updateBook
  )
  .delete(authenticateUser, authorizePermissions('admin'), deleteBook);
router.route('/').get(getBooksForUser);
router.route('/similar').get(getSimilarBooksForUser);
router.route('/:id').get(getSingleBookForUser);
module.exports = router;
