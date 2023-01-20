const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addItemToCart = async (req, res) => {
  try {
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
    }

    res.status(201).json({ msg: 'Successfully Added to Cart' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.params.id;
    const { quantity, amount, bookID } = req.body;
    const nUserId = Number(userId);
    const nBookId = Number(bookID);

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
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
};

const deleteCartItem = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
};

const viewCartItems = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const nUserId = Number(userId);
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
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getCartItemsCount = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const nUserId = Number(userId);
    const cartItemsCount = await prisma.cartItem.count({
      where: {
        user_id: nUserId,
      },
    });

    res.status(200).json({ nbHits: cartItemsCount });
  } catch (error) {
    next();
  }
};

module.exports = {
  addItemToCart,
  updateCartItem,
  viewCartItems,
  deleteCartItem,
  getCartItemsCount,
};
