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
    const bookWithParsedDate = book.map((b) => {
      const date = new Date(b.publication_date);
      let month = date.getUTCMonth() + 1;
      let day = date.getUTCDate();
      let year = date.getUTCFullYear();
      const newDate = year + '/' + month + '/' + day;
      return {
        id: b.id,
        title: b.title,
        price: b.price,
        author: b.author,
        publication_date: newDate,
      };
    });

    res.render('index', { title: 'BookStore', data: bookWithParsedDate });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getBookById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const book = await prisma.book.findUnique({ where: { id } });
    console.log(book);
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
    const { title, price, author, publication_date } = req.body;
    const intPrice = Number(price);
    const parsedDate = new Date(publication_date);
    const book = await prisma.book.update({
      where: { id },
      data: { title, price: intPrice, author, publication_date },
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
