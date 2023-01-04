'use strict';
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const booksRoute = require('./routes/books');
const usersRoute = require('./routes/users');

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
app.use(express.static('views'));
app.set('view engine', 'hbs');

//rendering hbs templates
app.get('/', (req, res) => {
  console.log(req.signedCookies);
  res.render('home');
});

app.get('/user/register', (req, res) => {
  res.render('register');
});

app.use('/books', booksRoute);
app.use('/user', usersRoute);

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
