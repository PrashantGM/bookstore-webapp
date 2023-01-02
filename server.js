'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const booksRoute = require('./routes/books');
const PORT = process.env.PORT;
const HOST = '127.0.0.1'; //dev

const app = express();
app.use(
  cors({
    origin: `http://${HOST}:${PORT}`,
  })
);
app.use(express.json());

app.use(express.static('views'));
app.set('view engine', 'hbs');

app.use('/books', booksRoute);

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
