const fs = require('fs').promises;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../services/cloudinary');
const asyncWrapper = require('../utils/async-wrapper');
const { cacheData } = require('../services/prisma-redis');

prisma.$use(cacheData);

const addBook = asyncWrapper(async (req, res) => {
  const { title, cloud, genre, description, price, author, publication_date } =
    req.body;
  let result = {};

  if (cloud === 'cloudinary') {
    result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `bookstore/books/${title}`,
      width: 400,
      height: 300,
      crop: 'fill',
    });

    await fs.unlink(req.file.path);
  } else {
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
    .json({ success: true, msg: 'Successfully Added!', data: book });
});

const getAllBooks = asyncWrapper(async (req, res) => {
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
});

const getBookById = asyncWrapper(async (req, res) => {
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
});

const updateBook = asyncWrapper(async (req, res) => {
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
  res
    .status(200)
    .json({ success: true, msg: 'Successfully Updated!', data: book });
});

const deleteBook = asyncWrapper(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.book.delete({
    where: { id },
  });
  res.status(200).json({ success: true, msg: 'Successfully Deleted!' });
});

const getBooksForUser = asyncWrapper(async (req, res) => {
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
  } else {
    page = 1;
    const uppercasedGenre =
      genreData.charAt(0).toUpperCase() + genreData.slice(1);
    genreD.push(uppercasedGenre);
  }
  const limit = 6;
  const skipValue = (page - 1) * limit;
  const totalCount = await prisma.book.count({
    where: {
      genre: { hasSome: genreD },
    },
  });
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

  const data = {
    parsedBooks,
    nbHits: parsedBooks.length,
    totalCount,
  };
  res.status(200).json({ data });
});

const getSingleBookForUser = asyncWrapper(async (req, res) => {
  const id = Number(req.params.id);
  const book = await prisma.book.findUnique({ where: { id } });
  let imageURI = book.image;

  if (!imageURI.startsWith('https')) {
    imageURI = 'http://localhost:8000/uploads/' + imageURI;
  }

  res.render('./pages/book', { data: { ...book, imageURI } });
});

const getSimilarBooksForUser = asyncWrapper(async (req, res) => {
  const genre = req.query.genre;
  // const skip = Math.floor(Math.random() * 5 + 1);
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
});

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
