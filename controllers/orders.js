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
    console.log(nBookId);
    console.log(req.body, req.params.id);
    const existingCart = await prisma.cartItem.findMany({
      where: {
        user_id: nUserId,
        book_id: nBookId,
      },
    });
    console.log('this ran');
    console.log(existingCart[0]);
    if (existingCart[0]) {
      console.log('wait this?');
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
      console.log('this was triggered');
      const response = await prisma.cartItem.create({
        data: {
          user_id: nUserId,
          book_id: nBookId,
          quantity: nQuantity,
          total_amount: nAmount,
        },
      });
      console.log(response);
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
    console.log(req.params.id);
    console.log(req.body);

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
    console.log(result);
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
    console.log(req.params.id);
    console.log(req.body);

    const result = await prisma.cartItem.deleteMany({
      where: {
        user_id: nUserId,
        book_id: nBookId,
      },
    });
    console.log(result);
    res.status(201).json({ success: true, msg: 'Successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, msg: error });
  }
};

const viewCartItems = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const nUserId = Number(userId);
    console.log(nUserId);
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

module.exports = {
  addItemToCart,
  updateCartItem,
  viewCartItems,
  deleteCartItem,
};
