import { toast } from './toast.js';

const navDropdown = document.querySelector('#dropdown-profile');

navDropdown.style.display = 'none';

const btnLogin = document.querySelector('#btn-login');
const loginForm = document.getElementById('form-login');

btnLogin.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const result = await login(email, password);
  toast.initToast(loginForm);
  if (!result.success) {
    toast.generateToast({
      message: result.msg,
      background: 'rgb(194 232 247)',
      color: 'red',
      length: '2000ms',
    });
  } else {
    toast.generateToast({
      message: result.msg,
      background: 'rgb(194 232 247)',
      color: 'green',
      length: '1000ms',
    });

    if (result.data.role === 'ADMIN') {
      window.location.assign('http://localhost:8000/books/admin');
    } else {
      window.history.go(-1);
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
