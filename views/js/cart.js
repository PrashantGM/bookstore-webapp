const cartItem = document.querySelector('.cart-item');
const carContainer = document.querySelector('#cart-container');

const cartPrice = document.querySelectorAll('#cart-price');
let total = 0;
cartPrice.forEach((item) => {
  total += Number(item.textContent);
});

const cartTotal = document.createElement('p');
cartTotal.id = 'cart-total';
cartTotal.innerHTML = `Total:  Rs ${total}`;

carContainer.appendChild(cartTotal);
