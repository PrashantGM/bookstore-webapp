const navDropdown = document.querySelector('.dropdown-content');

navDropdown.style.display = 'none';

const btnLogin = document.querySelector('#btn-login');
const loginForm = document.getElementById('form-login');

const email = document.querySelector('input[name="email"]');
const password = document.querySelector('input[name="password"]');

btnLogin.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const result = await login(email, password);
  console.log(result);
  if (typeof result === 'string') {
    generateToast({
      message: result,
      background: 'rgb(194 232 247)',
      color: 'red',
      length: '2000ms',
    });
  } else {
    if (result.data.role === 'ADMIN') {
      window.location.replace('http://localhost:8000/books/admin');
    } else {
      window.location.replace('http://localhost:8000/');
    }
  }
});

async function login(email, password) {
  try {
    const response = await fetch('http://localhost:8000/user/login', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const result = response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

let toastContainer;

function generateToast({
  message,
  background = '#00214d',
  color = '#fffffe',
  length = '2000ms',
}) {
  toastContainer.insertAdjacentHTML(
    'beforeend',
    `<p class="toast" 
    style="background-color: ${background};
    color: ${color};
    animation-duration: ${length}">
    ${message}
  </p>`
  );
  const toast = toastContainer.lastElementChild;
  toast.addEventListener('animationend', () => toast.remove());
}

(function initToast() {
  loginForm.insertAdjacentHTML(
    'afterbegin',
    `<div class="toast-container"></div>
  <style>
  
.toast-container {
  position: absolute;
  left: 50%;
  bottom:10%;
  transform:translate(-50%);
  box-shadow: 10px 5px 5px lightblue;
}

.toast {
  font-size: 0.8rem;
  padding: 0.6em;
  background-color: orange;
  animation: toastIt 2000ms;
}

@keyframes toastIt {
  0%,
  100% {
    opacity: 0;
  }
  20%,80%{
    opacity: 1;
  }
}
  </style>
  `
  );
  toastContainer = document.querySelector('.toast-container');
})();
