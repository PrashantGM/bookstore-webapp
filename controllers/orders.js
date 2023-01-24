const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const asyncWrapper = require('../utils/async-wrapper');

const addItemToCart = asyncWrapper(async (req, res) => {
  const userId = req.params.id;
  const { quantity, totalAmount, bookId } = req.body;
  const nUserId = Number(userId);
  const nAmount = Number(totalAmount);
  const nQuantity = Number(quantity);
  const nBookId = Number(bookId);

  const existingCart = await prisma.cartItem.findMany({
    where: {
      user_id: nUserId,
      book_id: nBookId,
    },
  });
  if (existingCart[0]) {
    const newQuantity = existingCart[0].quantity + nQuantity;
    const newAmount = existingCart[0].total_amount + nAmount;
    await prisma.cartItem.updateMany({
      where: {
        user_id: nUserId,
        book_id: nBookId,
      },
      data: {
        quantity: newQuantity,
        total_amount: newAmount,
      },
    });
  } else {
    const response = await prisma.cartItem.create({
      data: {
        user_id: nUserId,
        book_id: nBookId,
        quantity: nQuantity,
        total_amount: nAmount,
      },
    });
    console.log('added', response);
  }
  res.status(201).json({ msg: 'Successfully Added to Cart' });
});

const updateCartItem = asyncWrapper(async (req, res) => {
  const userId = req.params.id;
  const { quantity, amount, bookID } = req.body;
  const nUserId = Number(userId);
  const nBookId = Number(bookID);
  console.log(req.body, userId);
  const result = await prisma.cartItem.updateMany({
    where: {
      user_id: nUserId,
      book_id: nBookId,
    },
    data: {
      quantity: quantity,
      total_amount: amount,
    },
  });
  res.status(201).json({ success: true, msg: 'Successfully updated' });
});

const deleteCartItem = asyncWrapper(async (req, res) => {
  const userId = req.params.id;
  const { bookID } = req.body;
  const nUserId = Number(userId);
  const nBookId = Number(bookID);

  const result = await prisma.cartItem.deleteMany({
    where: {
      user_id: nUserId,
      book_id: nBookId,
    },
  });
  res.status(201).json({ success: true, msg: 'Successfully deleted' });
});

const viewCartItems = asyncWrapper(async (req, res) => {
  const { id: userId } = req.params;
  const nUserId = Number(userId);
  console.log(userId);
  const cartItems = await prisma.user.findMany({
    where: {
      id: nUserId,
    },
    include: {
      cart: {
        include: {
          books: true,
        },
      },
    },
  });
  const books = cartItems[0].cart;
  const parsedBooks = books.map((b) => {
    if (!b.books.image.startsWith('https')) {
      b.books.image = 'http://localhost:8000/uploads/' + b.books.image;
    }
    return { ...b };
  });

  res.render('./pages/cart', { data: parsedBooks });
});

const getCartItemsCount = asyncWrapper(async (req, res) => {
  const { id: userId } = req.params;
  const nUserId = Number(userId);
  const cartItemsCount = await prisma.cartItem.count({
    where: {
      user_id: nUserId,
    },
  });

  res.status(200).json({ nbHits: cartItemsCount });
});

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

const createPaymentIntent = asyncWrapper(async (req, res) => {
  const { items } = req.body;
  console.log('anyting');
  console.log(req.body);
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = {
  addItemToCart,
  updateCartItem,
  viewCartItems,
  deleteCartItem,
  getCartItemsCount,
  createPaymentIntent,
};
