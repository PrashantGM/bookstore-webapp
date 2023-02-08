const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { attachCookiesToRes } = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} = require('../errors/index');
const asyncWrapper = require('../utils/async-wrapper');
const { sendResetEmail } = require('../utils/send-mail');

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

const sendResetToken = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError('Please enter your email!');
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  console.log(user);
  if (!user) {
    throw new BadRequestError("User doesn't exist!");
  }
  let resetToken = crypto.randomBytes(32).toString('hex');
  const salt = await bcrypt.genSalt(10);
  const hashedToken = await bcrypt.hash(resetToken, salt);

  const updateUser = await prisma.user.update({
    where: {
      email,
    },
    data: {
      reset_token: hashedToken,
      reset_at: new Date(),
    },
  });
  const sendLink = await sendResetEmail(email, resetToken);
  if (sendLink) {
    res.status(200).json({
      success: true,
      msg: 'Reset link has been sent to your email. Please check your inbox!',
    });
  }

  // res.status(200).json({})
});

const resetPassword = asyncWrapper(async (req, res) => {
  const { email, token, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  const isMatch = bcrypt.compare(token, user.reset_token);
  if (!isMatch) {
    throw new UnauthorizedError('Error Occurred!');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const updatePassword = await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
    },
  });
  if (!updatePassword) {
    throw new Error('Internal Server Error');
  }
  res
    .status(200)
    .json({ success: true, msg: 'Password changed successfully!' });
});

module.exports = {
  registerUser,
  loginUser,
  getSingleUser,
  logout,
  checkLoggedIn,
  sendResetToken,
  resetPassword,
};
