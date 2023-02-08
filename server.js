'use strict';
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const SegfaultHandler = require('segfault-handler');
require('dotenv').config();
const hbs = require('hbs');
const rateLimiter = require('express-rate-limit');
const xss = require('xss-clean');

const templatesRoute = require('./routes/templates');
const booksRoute = require('./routes/books');
const usersRoute = require('./routes/users');
const ordersRoute = require('./routes/orders');

const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');

const PORT = process.env.PORT;
const HOST = '127.0.0.1'; //dev

const app = express();
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 50,
  })
);
app.use(xss());
app.use(
  cors({
    origin: `http://${HOST}:${PORT}`,
  })
);

SegfaultHandler.registerHandler('logs/crash.log');
winston.createLogger({
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

app.use('/order/stripe/webhook', express.raw({ type: '*/*' }));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials/');

app.use(templatesRoute);
app.use('/user', usersRoute);
app.use('/books', booksRoute);
app.use(ordersRoute);

app.use('*', notFound);
app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
