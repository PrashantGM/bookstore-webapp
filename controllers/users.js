const bcrypt = require('bcryptjs');
const { attachCookiesToRes } = require('../middlewares/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('this was executed');
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const users = await prisma.user.findUnique({ where: { email } });
    console.log('users' + users);

    if (users) {
      throw new Error('This email already exists!');
    }
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: encryptedPassword,
      },
    });
    const tokenUser = { email: user.email, id: user.id, role: user.role };
    attachCookiesToRes({ res, user: tokenUser });
    res.status(201).json({ data: tokenUser });
  } catch (error) {
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json('Please provide email and password');
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json('Incorrect Credentials');
      // throw new Error('Incorrect Credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json('Incorrect Credentials');
      // throw new Error('Incorrect Credentials');
    }
    const tokenUser = {
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.role,
    };
    attachCookiesToRes({ res, user: tokenUser });
    res.status(200).json({ data: tokenUser });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getSingleUser = async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  res.status(200).json(user);
};

const checkLoggedIn = async (req, res) => {
  // console.log(req.signedCookies);
  const token = req.signedCookies.token;
  if (!token) {
    return res.status(401).json({ success: false, msg: 'You must login' });
  }
  var payload = Buffer.from(token.split('.')[1], 'base64').toString();
  console.log(payload);
  res.status(200).json({ success: true, payload });
};

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(Date.now()),
    // secure: process.env.NODE_ENV === 'production',
    // signed: true,
  });
  res.status(200).json({ msg: 'user logged out!' });
};

//adds books to user's reading list
const addBooksToReadingList = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = Number(req.params.id);
    const bookToUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        reading_list: { connect: [{ id }] },
      },
    });
    res.status(200).json(bookToUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

// sends books in user's reading list to front-end
const viewReadingList = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const readingList = await prisma.user.findMany({
      where: {
        id: userId,
      },
      include: { reading_list: true },
    });
    res.status(200).json(readingList);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getSingleUser,
  logout,
  addBooksToReadingList,
  viewReadingList,
  checkLoggedIn,
};
