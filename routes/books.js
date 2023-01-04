const express = require('express');
const upload = require('../middlewares/multer');
const router = express.Router();

const { authenticateUser } = require('../middlewares/auth');
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require('../controllers/books');

router.route('/').post(upload.single('image'), addBook).get(getAllBooks);
router
  .route('/:id')
  .get(getBookById)
  .put(authenticateUser, updateBook)
  .delete(deleteBook);

module.exports = router;
