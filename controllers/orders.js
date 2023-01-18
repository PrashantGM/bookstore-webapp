const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addItemToCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { quantity, totalAmount, bookId } = req.body;
    const nUserId = Number(userId);
    const nAmount = Number(totalAmount);
    const nQuantity = Number(quantity);
    const nBookID = Number(bookId);
    await prisma.user.update({
      where: {
        id: nUserId,
      },
      data: {
        cart: {
          create: [
            {
              quantity: nQuantity,
              total_amount: nAmount,
              books: {
                connect: {
                  id: nBookID,
                },
              },
            },
          ],
        },
      },
    });
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
    res.status(201).json({
      msg: 'Successfully fetched reading list',
      data: cartItems[0].cart,
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  addItemToCart,
  viewCartItems,
};
