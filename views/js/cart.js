import { toast } from './toast.js';
import { loadNav, logout } from './session.js';
const cartContainer = document.querySelector('#cart-container');

let userId = 0;
let subTotal = 0;

async function onload() {
  const { id } = await loadNav();
  userId = id;
  await loadPage();
}

onload();
async function loadPage() {
  const cartFinal = document.createElement('div');
  cartFinal.id = 'cart-final-container';
  cartContainer.appendChild(cartFinal);

  const cartSubTotal = document.createElement('p');
  cartSubTotal.id = 'cart-subtotal';
  cartSubTotal.innerHTML = `Total:  $ ${subTotal}`;
  cartFinal.appendChild(cartSubTotal);

  const checkout = document.createElement('button');
  checkout.id = 'btn-checkout';
  checkout.innerHTML = 'Proceed to Checkout';
  cartFinal.appendChild(checkout);

  const noItemsMsg = document.createElement('h2');
  noItemsMsg.innerHTML = 'No items currently in the cart!';
  cartFinal.appendChild(noItemsMsg);
  noItemsMsg.style.display = 'none';

  const cartItems = document.querySelectorAll('.cart-item');
  function showNoItemsMessage() {
    cartSubTotal.style.display = 'none';
    checkout.style.display = 'none';
    noItemsMsg.className = 'm-20';
    cartFinal.style.alignItems = 'center';
    noItemsMsg.style.display = 'block';
  }
  if (cartItems.length < 1) {
    showNoItemsMessage();
  } else {
    cartItems.forEach((cartItem) => {
      const btnAdd = cartItem.querySelector('#btn-add');
      const btnSub = cartItem.querySelector('#btn-sub');

      const cartPrice = cartItem.querySelector('#cart-price');
      let price = Number(cartPrice.textContent);

      const cartQuantity = cartItem.querySelector('#cart-quantity');
      let quantity = Number(cartQuantity.textContent);

      const cartAmount = cartItem.querySelector('#cart-amount');
      let amount = Number(cartAmount.textContent);
      subTotal += amount;
      const bookId = cartItem.getAttribute('data-bookId');
      toast.initToast(cartItem);

      if (Number(quantity) === 1) {
        btnSub.disabled = true;
      }
      if (Number(quantity) === 5) {
        btnAdd.disabled = true;
      }
      btnSub.addEventListener('click', async (e) => {
        e.preventDefault();
        btnAdd.disabled = false;
        if (Number(quantity) > 1) {
          try {
            quantity = quantity - 1;
            amount = quantity * price;
            const response = await fetch(
              `http://localhost:8000/order/${userId}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify({ bookID: bookId, quantity, amount }),
              }
            );
            const result = await response.json();
            if (result.success) {
              cartQuantity.innerHTML = quantity;
              cartAmount.innerHTML = amount;
              await setcartSubTotal(price, 'sub');
            } else {
              toast.generateToast({
                message: 'Error Occurred!',
                background: '#eaf7fb',
                color: 'red',
                length: '2000ms',
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
        if (Number(quantity) === 1) {
          btnSub.disabled = true;
        }
      });

      btnAdd.addEventListener('click', async (e) => {
        e.preventDefault();
        btnSub.disabled = false;
        if (Number(quantity) < 6) {
          try {
            quantity = quantity + 1;
            amount = quantity * price;
            const response = await fetch(
              `http://localhost:8000/order/${userId}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify({ bookID: bookId, quantity, amount }),
              }
            );
            const result = await response.json();
            if (result.success) {
              cartQuantity.innerHTML = quantity;
              cartAmount.innerHTML = amount;
              await setcartSubTotal(price, 'add');
            } else {
              toast.generateToast({
                message: 'Error! Please try again',
                background: '#eaf7fb',
                color: 'red',
                length: '2000ms',
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
        if (Number(quantity) === 5) {
          btnAdd.disabled = true;
        }
      });
      const cartDelete = cartItem.nextElementSibling;
      cartDelete.addEventListener('click', async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:8000/order/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
          body: JSON.stringify({ bookID: bookId }),
        });
        const result = await response.json();
        if (result.success) {
          window.location.reload();
        } else {
          toast.generateToast({
            message: 'Error! Please try again',
            background: '#eaf7fb',
            color: 'red',
            length: '2000ms',
          });
        }
      });
    });
  }
  document
    .querySelector('#btn-checkout')
    .addEventListener('click', async (e) => {
      e.preventDefault();

      const response = await fetch('http://localhost:8000/order/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();

      if (result.success) {
        console.log('this ran');
        window.location.assign(result.data.url);
      } else {
        toast.generateToast({
          message: 'Error! Please try again',
          background: '#eaf7fb',
          color: 'red',
          length: '2000ms',
        });
      }
    });

  async function setcartSubTotal(money, op) {
    if (op === 'add') {
      subTotal = subTotal + money;
    } else {
      subTotal = subTotal - money;
    }
    cartSubTotal.innerHTML = `Total:  $ ${subTotal}`;
  }
  cartSubTotal.innerHTML = `Total:  $ ${subTotal}`;
}
