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

router.route('/admin').post(upload.single('image'), addBook).get(getAllBooks);
router
  .route('/admin/:id')
  .get(authenticateUser, authorizePermissions('ADMIN'), getBookById)
  .put(
    authenticateUser,
    authorizePermissions('ADMIN'),
    upload.single('image'),
    updateBook
  )
  .delete(authenticateUser, authorizePermissions('ADMIN'), deleteBook);
router.route('/').get(getBooksForUser);
router.route('/similar').get(getSimilarBooksForUser);
router.route('/:id').get(getSingleBookForUser);
module.exports = router;
