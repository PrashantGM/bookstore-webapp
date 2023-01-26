const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const asyncWrapper = require('../utils/async-wrapper');
const { BadRequestError, UnauthorizedError } = require('../errors/index');

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
      order_id: null,
    },
  });

  if (existingCart[0]) {
    const newQuantity = existingCart[0].quantity + nQuantity;
    const newAmount = existingCart[0].total_amount + nAmount;
    await prisma.cartItem.updateMany({
      where: {
        user_id: nUserId,
        book_id: nBookId,
        order_id: null,
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
      order_id: null,
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
        where: {
          order_id: null,
        },
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
  const cartItemsCount = await prisma.cartItem.findMany({
    where: {
      user_id: nUserId,
      order_id: null,
    },
  });

  res.status(200).json({ cartItemsCount, nbHits: cartItemsCount.length });
});

const createPaymentIntent = asyncWrapper(async (req, res) => {
  const { userId } = req.body;
  const nUserId = Number(userId);

  const cartItems = await prisma.cartItem.findMany({
    where: {
      user_id: nUserId,
      order_id: null,
    },
    include: {
      books: true,
    },
  });
  const users = await prisma.user.findUnique({
    where: {
      id: nUserId,
    },
  });

  let customerId;
  const checkCustomer = await stripe.customers.list({
    email: users.email,
  });
  if (checkCustomer.data.length > 0) {
    customerId = checkCustomer.data[0].id;
  } else {
    const customer = await stripe.customers.create({
      name: users.username,
      email: users.email,
    });
    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer: customerId,
    shipping_address_collection: {
      allowed_countries: ['AU', 'US', 'CA'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: 'usd' },
          display_name: 'Free shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      },
    ],
    line_items: cartItems.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.books.title,
          },
          unit_amount: item.books.price * 100,
        },
        quantity: item.quantity,
      };
    }),
    success_url: `http://localhost:8000/orders/checkout/success`,
    cancel_url: `http://localhost:8000/order/${nUserId}`,
  });

  const order = await prisma.order.create({
    data: {
      delivery_charge: session.shipping_cost.amount_total,
      total: session.amount_total / 100,
      status: 'PENDING',
    },
  });

  const updatedCart = await prisma.cartItem.updateMany({
    where: {
      AND: [
        {
          user_id: userId,
        },
        {
          order_id: null,
        },
      ],
    },
    data: {
      order_id: order.id,
    },
  });
  if (updatedCart.count == 0) {
    throw new BadRequestError('Something went wrong! Please try again');
  }

  res.status(200).json({ success: true, data: { url: session.url } });
});
const testRoute = async (req, res) => {
  //for testing
  res.json({ order });
};

const webhookListener = asyncWrapper(async (req, res) => {
  let event = req.body;
  let endpointSecret =
    'whsec_1cbc1cd63219a182467557d1faa8eab59fe98ed22b5d7b0fd96948de8e09ed98';
  if (endpointSecret) {
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }
  switch (event.type) {
    case 'checkout.session.completed':
      const { payment_intent, customer_details } = event.data.object;
      const { email, address } = customer_details;
      const deliveryAddress = Object.values(address).join(',');

      const users = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          cart: {
            include: {
              order: true,
            },
            orderBy: {
              updated_at: 'desc',
            },
          },
        },
      });

      const order = await prisma.order.updateMany({
        where: {
          AND: [
            {
              id: users.cart[0].order.id,
            },
            {
              status: 'PENDING',
            },
          ],
        },
        data: {
          delivery_address: deliveryAddress,
          status: 'PAID',
          payment_intent_id: payment_intent,
        },
      });
      if (order.count > 0) {
        console.log('Placed complete order successfuly to database');
      }
      break;
    case 'customer.created':
      console.log('customer created');
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
  res.send();
});

module.exports = {
  addItemToCart,
  updateCartItem,
  viewCartItems,
  deleteCartItem,
  getCartItemsCount,
  createPaymentIntent,
  webhookListener,
  testRoute,
};
