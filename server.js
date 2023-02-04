'use strict';
const SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler('logs/crash.log');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const winston = require('winston');
require('dotenv').config();
const hbs = require('hbs');

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
  cors({
    origin: `http://${HOST}:${PORT}`,
  })
);
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/node-app.log',
      level: 'debug',
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});
logger.debug('debug');
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
