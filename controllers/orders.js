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
    console.log(typeof existingCart[0].quantity);
    console.log(existingCart);
    const newQuantity = existingCart[0].quantity + nQuantity;
    const newAmount = existingCart[0].total_amount + nAmount;

    if (existingCart) {
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
      await prisma.cartItem.create({
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

const viewCartItems = async (req, res) => {
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
    console.log(books);
    const parsedBooks = books.map((b) => {
      if (!b.books.image.startsWith('https')) {
        b.books.image = 'http://localhost:8000/uploads/' + b.books.image;
      }

      return { ...b };
    });
    console.log(parsedBooks);

    res.render('./pages/cart', { data: parsedBooks });
    // res.status(201).json({
    //   msg: 'Successfully fetched reading list',
    //   data: parsedBooks,
    // });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  addItemToCart,
  viewCartItems,
};
