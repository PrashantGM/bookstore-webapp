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
    authorizePermissions('ADMIN'),
    upload.single('new-image'),
    addBook
  )
  .get(authenticateUser, authorizePermissions('ADMIN'), getAllBooks);
router
  .route('/admin/:id')
  .get(authenticateUser, authorizePermissions('ADMIN'), getBookById)
  .put(
    authenticateUser,
    authorizePermissions('ADMIN'),
    upload.single('new-image'),
    updateBook
  )
  .delete(authenticateUser, authorizePermissions('ADMIN'), deleteBook);
router.route('/').get(getBooksForUser);
router.route('/similar').get(getSimilarBooksForUser);
router.route('/:id').get(getSingleBookForUser);
module.exports = router;
