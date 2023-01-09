'use strict';
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const hbs = require('hbs');

const booksRoute = require('./routes/books');
const usersRoute = require('./routes/users');
const {
  authenticateUser,
  authorizePermissions,
} = require('./middlewares/auth');
const PORT = process.env.PORT;
const HOST = '127.0.0.1'; //dev

const app = express();
app.use(
  cors({
    origin: `http://${HOST}:${PORT}`,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
// app.use(express.static('views'));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials/');
//rendering hbs templates
app.get('/', (req, res) => {
  res.render('./pages/home');
});

app.get('/landing', (req, res) => {
  console.log(req.signedCookies);
  res.render('./pages/landing');
});
app.get('/user/register', (req, res) => {
  res.render('./pages/register');
});
app.get('/user/login', (req, res) => {
  res.render('./pages/login');
});

app.use('/user', usersRoute);
app.use('/books', booksRoute);

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
