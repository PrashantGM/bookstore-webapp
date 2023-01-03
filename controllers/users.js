const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  try {
    console.log('bruh');
    console.log(req.body);
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const role = 'USER';
    console.log(encryptedPassword);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: encryptedPassword,
        bookId: 1,
      },
    });
    console.log(user);
    res.status(201).json({ msg: 'Successfully registered' });
  } catch (error) {
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error('Incorrect Credentials');
    }
    console.log(user);
    const isMatch = await bcrypt.compare(user.password, password);
    if (!isMatch) {
      throw new Error('Incorrect Credentials');
    }
    res.status(200).json('Login success');
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { registerUser, loginUser };
