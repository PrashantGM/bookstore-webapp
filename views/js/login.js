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
  if (result.success) {
    if (result.data.role === 'ADMIN') {
      sessionStorage.setItem(
        'notification',
        'Successfully Logged In As Admin!'
      );
      window.location.assign('http://localhost:8000/books/admin');
    } else {
      sessionStorage.setItem('notification', 'Successfully Logged In!');
      window.history.go(-1);
    }
  } else {
    toast.generateToast({
      message: result.msg,
      background: 'rgb(194 232 247)',
      color: 'red',
      length: '2000ms',
    });
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
