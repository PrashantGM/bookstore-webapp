const bcrypt = require('bcryptjs');
const { attachCookiesToRes } = require('../middlewares/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
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
        bookId: 1,
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
    console.log('ey');
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
    const tokenUser = { email: user.email, id: user.id, role: user.role };
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

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: 'user logged out!' });
};

module.exports = { registerUser, loginUser, getSingleUser, logout };
