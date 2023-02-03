const bcrypt = require('bcryptjs');
const { attachCookiesToRes } = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { BadRequestError, UnauthenticatedError } = require('../errors/index');
const asyncWrapper = require('../utils/async-wrapper');

//adds new user to db when user registers
const registerUser = asyncWrapper(async (req, res) => {
  const isFirstAccount = (await prisma.user.count({})) === 0;
  const role = isFirstAccount ? 'ADMIN' : 'USER';
  console.info(role);
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const users = await prisma.user.findUnique({ where: { email } });

  if (users) {
    throw new BadRequestError('This email already exists!');
  }

  const encryptedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: encryptedPassword,
      role,
    },
  });
  const tokenUser = { email: user.email, id: user.id, role: user.role };
  attachCookiesToRes({ res, user: tokenUser });
  res
    .status(201)
    .json({ success: true, msg: 'Successfully registered', data: tokenUser });
});

const loginUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password.');
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new UnauthenticatedError('Incorrect Credentials!');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthenticatedError('Incorrect Credentials!');
  }
  const tokenUser = {
    username: user.username,
    email: user.email,
    id: user.id,
    role: user.role,
  };
  attachCookiesToRes({ res, user: tokenUser });
  res
    .status(200)
    .json({ success: true, msg: 'Successfully logged in.', data: tokenUser });
});

const getSingleUser = asyncWrapper(async (req, res, next) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  res.status(200).json(user);
});

const checkLoggedIn = asyncWrapper(async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    return res.status(401).json({ success: false, msg: 'You must login.' });
  }
  var payload = Buffer.from(token.split('.')[1], 'base64').toString();
  res.status(200).json({ success: true, payload });
});

const logout = asyncWrapper(async (req, res, next) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: 'Successfully logged out!' });
});

//adds books to user's reading list
const addBooksToReadingList = asyncWrapper(async (req, res, next) => {
  const { id } = req.body;
  const userId = Number(req.params.id);
  const readingList = await prisma.user.findMany({
    where: {
      id: userId,
      reading_list: {
        some: {
          id,
        },
      },
    },
  });
  if (typeof readingList[0] === 'object' && readingList[0] !== null) {
    throw new BadRequestError('Book already exists in Reading List!');
  }
  const bookToUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      reading_list: { connect: [{ id }] },
    },
  });
  res
    .status(200)
    .json({ success: true, bookToUser, msg: 'Added to Reading List' });
});

// sends books in user's reading list to front-end
const viewReadingList = asyncWrapper(async (req, res, next) => {
  const userId = Number(req.params.id);
  let page = Number(req.query.page) || 1;
  const limit = 6;
  const skipValue = (page - 1) * limit;
  const readingList = await prisma.user.findMany({
    where: {
      id: userId,
    },
    select: {
      reading_list: {
        skip: skipValue,
        take: limit,
        orderBy: {
          title: 'asc',
        },
      },
    },
  });
  const unparsedReads = readingList[0].reading_list;
  const reads = unparsedReads.map((b) => {
    if (!b.image.startsWith('https')) {
      b.image = 'http://localhost:8000/uploads/' + b.image;
    }
    return { ...b };
  });
  res.status(200).json({
    success: true,
    data: { reads, nbHits: reads.length },
  });
});

const deleteReadingList = asyncWrapper(async (req, res, next) => {
  const { bookId, userId } = req.body;
  const updatePost = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      reading_list: {
        disconnect: [{ id: bookId }],
      },
    },
    select: {
      reading_list: true,
    },
  });
  return res.status(200).json({ success: true, updatePost });
});

module.exports = {
  registerUser,
  loginUser,
  getSingleUser,
  logout,
  addBooksToReadingList,
  viewReadingList,
  checkLoggedIn,
  deleteReadingList,
};
