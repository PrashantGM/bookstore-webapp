'use strict';
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const hbs = require('hbs');

const stripe = require('stripe')(process.env.STRIPE_KEY);
const booksRoute = require('./routes/books');
const usersRoute = require('./routes/users');
const ordersRoute = require('./routes/orders');
// const CustomError = require('./errors/custom-error');
const {
  authenticateUser,
  authorizePermissions,
} = require('./middlewares/auth');
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
app.use('/order/stripe/webhook', express.raw({ type: '*/*' }));
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
const storeItems = new Map([
  [1, { priceInCents: 10000, name: 'Learn React Today' }],
  [2, { priceInCents: 20000, name: 'Learn CSS Today' }],
]);

app.get('/test', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'T-shirt' },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:8000`,
      cancel_url: `http://localhost:8000`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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
app.get('/notFound', (req, res) => {
  res.render('./pages/notFound');
});

app.get('/orders/checkout', (req, res) => {
  res.render('./pages/checkout');
});

app.get('/orders/checkout/success', (req, res) => {
  res.render('./pages/success');
});

// console.log('this ran');
// app.post(
//   '/order/stripe/webhook',
//   express.raw({ type: 'application/json' }),
//   (request, response) => {
//     let event = request.body;
//     console.log('listener triggered');
//     let endpointSecret =
//       'whsec_1cbc1cd63219a182467557d1faa8eab59fe98ed22b5d7b0fd96948de8e09ed98';
//     if (endpointSecret) {
//       const signature = request.headers['stripe-signature'];
//       try {
//         event = stripe.webhooks.constructEvent(
//           request.body,
//           signature,
//           endpointSecret
//         );
//       } catch (err) {
//         console.log(`⚠️  Webhook signature verification failed.`, err.message);
//         return response.sendStatus(400);
//       }
//     }

//     // Handle the event
//     switch (event.type) {
//       case 'checkout.session.completed':
//         const paymentIntent = event.data.object;
//         console.log(event.data);
//         console.log(event);
//         console.log(
//           `PaymentIntent for ${paymentIntent.amount} was successful!`
//         );
//         // Then define and call a method to handle the successful payment intent.
//         // handlePaymentIntentSucceeded(paymentIntent);
//         break;
//       case 'payment_method.attached':
//         const paymentMethod = event.data.object;
//         // Then define and call a method to handle the successful attachment of a PaymentMethod.
//         // handlePaymentMethodAttached(paymentMethod);
//         break;
//       default:
//         // Unexpected event type
//         console.log(`Unhandled event type ${event.type}.`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   }
// );

app.use('/user', usersRoute);
app.use('/books', booksRoute);
app.use('/order', ordersRoute);

app.use('*', notFound);
app.use(errorHandler);

// app.use((err, req, res, next) => {
//   console.log('this handler ran');
//   console.log(err.message);
//   // if (err instanceof CustomError) {
//   //   return res.status(err.statusCode).json({ msg: err.message });
//   // }
//   return res.status(500).json({ msg: 'Something went wrong! Try Again.' });
// });

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
