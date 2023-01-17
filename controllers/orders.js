const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addItemToCart = async (req, res) => {
  const { quantity, totalAmount, userId } = req.body;
  const nUserId = Number(userId);
  const nAmount = Number(totalAmount);
  console.log(nAmount);
  const nQuantity = Number(quantity);
  const bookId = req.params.id;
  const nBookID = Number(bookId);
  console.log(nBookID);
  const cartItems = await prisma.user.update({
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
};

module.exports = {
  addItemToCart,
};
