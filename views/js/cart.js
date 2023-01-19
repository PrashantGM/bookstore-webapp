import { toast } from './toast.js';

const cartItem = document.querySelector('.cart-item');
const userId = cartItem.getAttribute('data-userId');
const cartContainer = document.querySelector('#cart-container');

let total = 0;

const cartFinal = document.createElement('div');
cartFinal.id = 'cart-final-container';
cartContainer.appendChild(cartFinal);

const cartTotal = document.createElement('p');
cartTotal.id = 'cart-total';
cartTotal.innerHTML = `Total:  Rs ${total}`;

cartFinal.appendChild(cartTotal);

const checkout = document.createElement('button');
checkout.id = 'btn-checkout';
checkout.innerHTML = 'Proceed to Checkout';
cartFinal.appendChild(checkout);

const cartItems = document.querySelectorAll('.cart-item');
cartItems.forEach((cartItem) => {
  const btnAdd = cartItem.querySelector('#btn-add');
  console.log('after all');
  console.log(btnAdd);
  const btnSub = cartItem.querySelector('#btn-sub');

  const cartPrice = cartItem.querySelector('#cart-price');
  let price = Number(cartPrice.textContent);

  const cartQuantity = cartItem.querySelector('#cart-quantity');
  let quantity = Number(cartQuantity.textContent);

  const cartAmount = cartItem.querySelector('#cart-amount');
  let amount = Number(cartAmount.textContent);
  total += amount;
  const bookId = cartItem.getAttribute('data-bookId');
  toast.initToast(cartItem);
  btnSub.addEventListener('click', async (e) => {
    e.preventDefault();

    if (Number(quantity) > 1) {
      try {
        quantity = quantity - 1;
        amount = quantity * price;

        const response = await fetch(`http://localhost:8000/order/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify({ bookID: bookId, quantity, amount }),
        });
        const result = await response.json();
        if (result.success) {
          toast.generateToast({
            message: 'Reduced',
            background: '#eaf7fb',
            color: 'green',
            length: '2000ms',
          });
          cartQuantity.innerHTML = quantity;
          cartAmount.innerHTML = amount;
          await setCartTotal(price, 'sub');
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
    } else {
      toast.generateToast({
        message: 'Quantity needs to be at least 1!',
        background: '#eaf7fb',
        color: 'red',
        length: '2000ms',
      });
    }
  });
  btnAdd.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
      quantity = quantity + 1;
      amount = quantity * price;
      const response = await fetch(`http://localhost:8000/order/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ bookID: bookId, quantity, amount }),
      });
      const result = await response.json();
      if (result.success) {
        toast.generateToast({
          message: 'Added',
          background: '#eaf7fb',
          color: 'green',
          length: '2000ms',
        });
        cartQuantity.innerHTML = quantity;
        cartAmount.innerHTML = amount;
        await setCartTotal(price, 'add');
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
      toast.generateToast({
        message: 'Removed item from cart',
        background: '#eaf7fb',
        color: 'green',
        length: '2000ms',
      });
      cartQuantity.innerHTML = quantity;
      cartAmount.innerHTML = amount;
      await setCartTotal(amount, 'delete');
      cartItem.remove();
      cartDelete.remove();
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
async function setCartTotal(money, op) {
  if (op === 'add') {
    total = total + money;
    console.log('total', total);
    cartTotal.innerHTML = `Total:  Rs ${total}`;
  } else {
    total = total - money;
    console.log('total', total);
    cartTotal.innerHTML = `Total:  Rs ${total}`;
  }
}
cartTotal.innerHTML = `Total:  Rs ${total}`;

loadNav();
async function loadNav() {
  const btnProfile = document.querySelector('.btn-profile');
  console.log('btnprofile', btnProfile);

  try {
    const isLoggedIn = await viewLoggedIn();
    let loggedIn = isLoggedIn.success;
    if (loggedIn) {
      let parsedUserData = JSON.parse(isLoggedIn.payload);

      btnProfile.textContent = parsedUserData.username;
      const userIcon = document.createElement('i');
      userIcon.className = 'fa fa-user-circle';
      btnProfile.appendChild(userIcon);

      const downIcon = document.createElement('i');
      downIcon.className = 'fa fa-caret-down';
      btnProfile.appendChild(downIcon);

      document.querySelector('#nav-dashboard').style.display = 'none';
    } else {
      btnProfile.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'http://localhost:8000/user/login';
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function viewLoggedIn() {
  try {
    const payload = await fetch('http://localhost:8000/user/stat', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const userData = await payload.json();
    return userData;
  } catch (error) {
    console.log(error);
  }
}
