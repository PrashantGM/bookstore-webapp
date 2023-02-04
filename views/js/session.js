const btnProfile = document.querySelector('.btn-profile');
const navDropdown = document.querySelector('#dropdown-profile');

export async function loadNav() {
  const isLoggedIn = await viewLoggedIn();
  try {
    if (isLoggedIn.success) {
      let parsedUserData = JSON.parse(isLoggedIn.payload);
      console.log(parsedUserData);
      const cartItemsCount = await getCartItemsCount(parsedUserData.id);
      btnProfile.textContent = parsedUserData.username;
      btnProfile.fontFamily = "Times New Roman', Times, serif";

      const userIcon = document.createElement('i');
      userIcon.className = 'fa fa-user-circle';
      btnProfile.appendChild(userIcon);

      const downIcon = document.createElement('i');
      downIcon.className = 'fa fa-caret-down';
      btnProfile.appendChild(downIcon);

      const navCart = document.querySelector('#nav-cart');
      if (cartItemsCount != 0) {
        const cartCount = document.createElement('sup');
        cartCount.id = 'cart-count';
        cartCount.innerHTML = `${cartItemsCount}`;
        cartCount.style.color = 'white';
        cartCount.style.backgroundColor = 'blue';
        cartCount.style.borderRadius = '50%';
        cartCount.style.margin = '2px';
        cartCount.style.padding = '3px';
        cartCount.style.font = 'bold 16px Georgia, serif';
        btnProfile.appendChild(cartCount);

        const cartCountD = document.createElement('sup');
        cartCountD.id = 'cart-count';
        cartCountD.innerHTML = `${cartItemsCount}`;
        cartCountD.style.color = 'white';
        cartCountD.style.backgroundColor = 'blue';
        cartCountD.style.borderRadius = '50%';
        cartCountD.style.margin = '2px';
        cartCountD.style.padding = '3px';
        cartCountD.style.font = 'bold 16px Georgia, serif';
        navCart.appendChild(cartCountD);
      }

      const navlinkDash = document.querySelector('#nav-dashboard');
      navlinkDash.style.display = 'none';

      if (parsedUserData.role === 'ADMIN') {
        navlinkDash.style.display = 'block';
        navlinkDash.addEventListener('click', () => {
          window.location.assign('http://localhost:8000/books/admin');
        });
      }
      navCart.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign(
          `http://localhost:8000/cart/${parsedUserData.id}`
        );
      });
      document.querySelector('#nav-logout').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
      document.querySelector('#nav-orders').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign(
          `http://localhost:8000/order/${parsedUserData.id}`
        );
      });

      return parsedUserData;
    } else {
      navDropdown.style.display = 'none';
      btnProfile.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'http://localhost:8000/user/login';
      });
    }
  } catch (error) {
    // console.log(error);
  }
}
async function getCartItemsCount(userId) {
  try {
    const payload = await fetch(`http://localhost:8000/cart/count/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const response = await payload.json();
    return response.nbHits;
  } catch (error) {}
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
    // console.log(error);
  }
}
export function logout() {
  fetch('http://localhost:8000/user/logout', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then(() => {
    window.location.replace('http://localhost:8000');
  });
}
