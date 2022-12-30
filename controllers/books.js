const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addBook = async (req, res) => {
  try {
    //validation to be done later
    const { title, price, author, publication_date } = req.body;
    const intPrice = Number(price);
    const parsedDate = new Date(publication_date);
    const book = await prisma.book.create({
      data: { title, price: intPrice, author, publication_date: parsedDate },
    });

    res.status(201).json({ msg: 'Successfully added!', data: book });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const book = await prisma.book.findMany();
    res.render('index', { title: 'BookStore', data: book });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getBookById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const book = await prisma.book.findUnique({ where: { id } });
    res.status(200).json({ msg: 'Successfully fetched!', data: book });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updateBook = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const book = await prisma.book.update({
      where: { id },
      data: req.body,
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

module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook };
