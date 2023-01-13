const bcrypt = require('bcryptjs');
const { attachCookiesToRes } = require('../middlewares/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//adds new user to db when user registers
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const users = await prisma.user.findUnique({ where: { email } });

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
      return res.status(401).json({ msg: 'Incorrect Credentials' });
      // throw new Error('Incorrect Credentials');
    }
    const tokenUser = {
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.role,
    };
    attachCookiesToRes({ res, user: tokenUser });
    res.status(200).json({ msg: 'Login Success!', data: tokenUser });
  } catch (error) {
    res.status(500).json('error');
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
  try {
    const token = req.signedCookies.token;
    if (!token) {
      return res.status(401).json({ success: false, msg: 'You must login' });
    }
    var payload = Buffer.from(token.split('.')[1], 'base64').toString();
    res.status(200).json({ success: true, payload });
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
};

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: 'user logged out!' });
};

//adds books to user's reading list
const addBooksToReadingList = async (req, res) => {
  try {
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
      return res
        .status(409)
        .json({ sucess: false, msg: 'Book already exists in Reading List!' });
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
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// sends books in user's reading list to front-end
const viewReadingList = async (req, res) => {
  try {
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
    console.log(reads);
    res.status(200).json({
      success: true,
      data: { reads, nbHits: reads.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
};

const deleteReadingList = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({ sucess: false, msg: error });
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
  deleteReadingList,
};
