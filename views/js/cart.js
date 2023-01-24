import { toast } from './toast.js';

const cartContainer = document.querySelector('#cart-container');

let userId = 0;
let subTotal = 0;
let total = 0;

async function onload() {
  await loadNav();
  await loadPage();
}

onload();
async function loadPage() {
  const cartFinal = document.createElement('div');
  cartFinal.id = 'cart-final-container';
  cartContainer.appendChild(cartFinal);

  const cartSubTotal = document.createElement('p');
  cartSubTotal.id = 'cart-subtotal';
  cartSubTotal.innerHTML = `SubTotal:  Rs ${subTotal}`;

  cartFinal.appendChild(cartSubTotal);

  const cartDeliveryFee = document.createElement('p');
  cartDeliveryFee.id = 'cart-deliveryfee';
  let deliveryFee = Math.floor(Math.random() * 200 + 50);
  cartDeliveryFee.innerHTML = `Delivery:  Rs ${deliveryFee}`;

  cartFinal.appendChild(cartDeliveryFee);

  const cartTotal = document.createElement('p');
  cartTotal.id = 'cart-total';
  cartTotal.innerHTML = `Total:  Rs ${cartTotal}`;
  cartFinal.appendChild(cartTotal);

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
    cartTotal.style.display = 'none';
    cartDeliveryFee.style.display = 'none';
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
      total = subTotal + deliveryFee;
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

  // if(cartI)

  async function setcartSubTotal(money, op) {
    if (op === 'add') {
      subTotal = subTotal + money;
    } else {
      subTotal = subTotal - money;
    }
    total = subTotal + deliveryFee;
    console.log('total cost', total);
    cartSubTotal.innerHTML = `SubTotal:  Rs ${subTotal}`;
    cartTotal.innerHTML = `Total: Rs ${total}`;
  }
  cartSubTotal.innerHTML = `Subtotal:  Rs ${subTotal}`;
  cartTotal.innerHTML = `Total: Rs ${total}`;
}

async function loadNav() {
  const btnProfile = document.querySelector('.btn-profile');
  console.log('btnprofile', btnProfile);

  try {
    const isLoggedIn = await viewLoggedIn();
    let loggedIn = isLoggedIn.success;
    if (loggedIn) {
      let parsedUserData = JSON.parse(isLoggedIn.payload);
      userId = parsedUserData.id;
      console.log('userId', userId);
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
