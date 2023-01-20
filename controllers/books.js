const fs = require('fs').promises;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../middlewares/cloudinary');

const addBook = async (req, res, next) => {
  try {
    //validation to be done later
    const {
      title,
      cloud,
      genre,
      description,
      price,
      author,
      publication_date,
    } = req.body;

    let result = {};
    //checks if user selected save images to cloud option when adding books
    if (cloud === 'cloudinary') {
      result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `bookstore/books/${title}`,
        width: 400,
        height: 300,
        crop: 'fill',
      });

      await fs.unlink(req.file.path);
    } else {
      //removing extra file path when saving img to db
      result.secure_url = req.file.filename;
    }
    const genreTemp = genre.split(',');
    const genreArr = genreTemp.map((genre) => {
      const trimmedGenre = genre.trim();
      return trimmedGenre.charAt(0).toUpperCase() + trimmedGenre.slice(1);
    });
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

    res
      .status(201)
      .json({ success: true, msg: 'Successfully added!', data: book });
  } catch (error) {
    next();
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    if (res.msg) {
      res.render('./pages/login');
    }
    const book = await prisma.book.findMany({
      orderBy: {
        updated_at: 'desc',
      },
    });

    const bookWithParsedDate = book.map((b) => {
      const date = new Date(b.publication_date);
      let month = date.getUTCMonth() + 1;
      let day = date.getUTCDate();
      let year = date.getUTCFullYear();
      const newDate = year + '/' + month + '/' + day;
      let imageURI = b.image;
      if (!imageURI.startsWith('https')) {
        imageURI = 'http://localhost:8000/uploads/' + imageURI;
      }

      return {
        id: b.id,
        image: imageURI,
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
    next();
  }
};

const getBookById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const book = await prisma.book.findUnique({ where: { id } });
    const date = new Date(book.publication_date);
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();
    const parsedDate = year + '/' + month + '/' + day;
    let imageURI = book.image;

    if (!imageURI.startsWith('https')) {
      imageURI = 'http://localhost:8000/uploads/' + imageURI;
    }

    res.status(200).json({
      msg: 'Successfully fetched!',
      data: { ...book, parsedDate, imageURI },
    });
  } catch (error) {
    next();
  }
};

const updateBook = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const {
      title,
      genre,
      image,
      cloud,
      description,
      price,
      author,
      publication_date,
    } = req.body;
    let finalImage = '';

    if (typeof image === 'string') {
      if (image.startsWith('https://')) {
        finalImage = image;
      } else {
        finalImage = image.replace('http://localhost:8000/uploads/', '');
        console.log('locally saved finalimage', finalImage);
      }
    } else {
      finalImage = req.file.filename;
    }

    if (cloud === 'cloudinary') {
      result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `bookstore/books/${title}`,
        width: 400,
        height: 300,
        crop: 'fill',
      });
      await fs.unlink(req.file.path);
    }
    const genreTemp = genre.split(',');
    const genreArr = genreTemp.map((genre) => {
      const trimmedGenre = genre.trim();
      return trimmedGenre.charAt(0).toUpperCase() + trimmedGenre.slice(1);
    });
    const intPrice = Number(price);
    const parsedDate = new Date(publication_date);

    const book = await prisma.book.update({
      where: { id },
      data: {
        title,
        image: finalImage,
        genre: genreArr,
        description,
        price: intPrice,
        author,
        publication_date: parsedDate,
      },
    });
    res.status(200).json({ msg: 'Successfully updated!', data: book });
  } catch (error) {
    next();
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
    throw new Error('Error');
  }
};

const getBooksForUser = async (req, res, next) => {
  try {
    let genreD = [];
    const genreData = req.query.genre;
    let page = Number(req.query.page) || 1;
    if (genreData == '' || genreData == 'undefined') {
      const genreResult = await prisma.book.findMany({
        distinct: ['genre'],
        select: {
          genre: true,
        },
      });
      let genreTemp = [];
      for (g in genreResult) {
        genreTemp.push(...genreResult[g].genre);
      }
      genreD = genreTemp.filter((g, index) => genreTemp.indexOf(g) === index);
      console.log(genreD);
    } else {
      page = 1;
      const uppercasedGenre =
        genreData.charAt(0).toUpperCase() + genreData.slice(1);
      genreD.push(uppercasedGenre);
    }

    const limit = 6;
    const skipValue = (page - 1) * limit;
    const books = await prisma.book.findMany({
      skip: skipValue,
      take: limit,
      where: {
        genre: { hasSome: genreD },
      },
      orderBy: {
        title: 'asc',
      },
    });
    const parsedBooks = books.map((b) => {
      if (!b.image.startsWith('https')) {
        b.image = 'http://localhost:8000/uploads/' + b.image;
      }
      return { ...b };
    });

    res.status(200).json(parsedBooks);
  } catch (error) {
    // console.log(error);
    next();
  }
};

const getSingleBookForUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const book = await prisma.book.findUnique({ where: { id } });
    let imageURI = book.image;

    if (!imageURI.startsWith('https')) {
      imageURI = 'http://localhost:8000/uploads/' + imageURI;
    }

    res.render('./pages/book', { data: { ...book, imageURI } });
  } catch (error) {
    next();
  }
};

const getSimilarBooksForUser = async (req, res, next) => {
  try {
    const genre = req.query.genre;
    // const skip = Math.floor(Math.random() * 5 + 1);
    // console.log(skip);
    const genreD = genre.split(',');

    const books = await prisma.book.findMany({
      take: 5,
      where: {
        genre: { hasSome: genreD },
      },
    });

    const parsedBooks = books.map((b) => {
      if (!b.image.startsWith('https')) {
        b.image = 'http://localhost:8000/uploads/' + b.image;
      }
      return { ...b };
    });

    res.status(200).json({
      msg: 'Successfully fetched!',
      data: parsedBooks,
    });
  } catch (error) {
    next();
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBooksForUser,
  getSingleBookForUser,
  getSimilarBooksForUser,
};
