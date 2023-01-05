const fs = require('fs').promises;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../middlewares/cloudinary');

const addBook = async (req, res) => {
  try {
    //validation to be done later
    const { title, genre, description, price, author, publication_date } =
      req.body;
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `bookstore/books/${title}`,
      width: 400,
      height: 300,
      crop: 'fill',
    });
    const genreArr = genre.split(',');
    const intPrice = Number(price);
    const parsedDate = new Date(publication_date);
    const book = await prisma.book.create({
      data: {
        title: title,
        genre: genreArr,
        description: description,
        image: result.secure_url,
        price: intPrice,
        author: author,
        publication_date: parsedDate,
      },
    });
    await fs.unlink(req.file.path);
    res.status(201).json({ msg: 'Successfully added!', data: book });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const book = await prisma.book.findMany({
      where: {
        genre: { hasSome: ['Action', 'Sci-fi', 'Supernatural'] },
      },
    });
    const bookWithParsedDate = book.map((b) => {
      const date = new Date(b.publication_date);
      let month = date.getUTCMonth() + 1;
      let day = date.getUTCDate();
      let year = date.getUTCFullYear();
      const newDate = year + '/' + month + '/' + day;
      return {
        id: b.id,
        image: b.image,
        genre: b.genre,
        title: b.title,
        description: b.description,
        price: b.price,
        author: b.author,
        publication_date: newDate,
      };
    });

    res.render('./admin/index', {
      title: 'BookStore',
      data: bookWithParsedDate,
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getBookById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const book = await prisma.book.findUnique({ where: { id } });
    const date = new Date(book.publication_date);
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();
    const parsedDate = year + '/' + month + '/' + day;
    res
      .status(200)
      .json({ msg: 'Successfully fetched!', data: { ...book, parsedDate } });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updateBook = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      title,
      image,
      genre,
      description,
      price,
      author,
      publication_date,
    } = req.body;
    const genreArr = genre.split(',');
    const intPrice = Number(price);
    const parsedDate = new Date(publication_date);
    const book = await prisma.book.update({
      where: { id },
      data: {
        title,
        image,
        genre: genreArr,
        description,
        price: intPrice,
        author,
        publication_date: parsedDate,
      },
    });
    res.status(200).json({ msg: 'Successfully updated!', data: book });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteBook = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.book.delete({
      where: { id },
    });
    res.status(200).json({ msg: 'Successfully deleted!' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getBooksForUser = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    console.log(page);
    const limit = 3;
    const skipValue = (page - 1) * limit;

    const books = await prisma.book.findMany({
      skip: skipValue,
      take: limit,
      select: {
        title: true,
        image: true,
        genre: true,
        description: true,
        author: true,
        price: true,
      },

      orderBy: {
        title: 'asc',
      },
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksForUser,
};
