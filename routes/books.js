const express = require('express');
const router = express.Router();
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require('../controllers/books');

router.route('/').post(addBook).get(getAllBooks);
router.route('/:id').get(getBookById).put(updateBook).delete(deleteBook);

module.exports = router;
