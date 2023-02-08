import { toast } from './toast.js';

const navDropdown = document.querySelector('#dropdown-profile');

navDropdown.style.display = 'none';

const loginForm = document.getElementById('form-login');
toast.initToast(loginForm);
let message = sessionStorage.getItem('notification');
if (message) {
  toast.generateToast({
    message: message,
    background: '#76B947',
    color: 'white',
    length: '2000ms',
  });
}
sessionStorage.clear();
document.querySelector('#btn-login').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const result = await login(email, password);
  if (result.success) {
    if (result.data.role === 'ADMIN') {
      sessionStorage.setItem(
        'notification',
        'Successfully Logged In As Admin!'
      );
      window.location.assign('http://localhost:8000/books/admin');
    } else {
      sessionStorage.setItem('notification', 'Successfully Logged In!');
      if ('referrer' in document) {
        if (
          document.referrer === 'http://localhost:8000/login' ||
          document.referrer === 'http://localhost:8000/user/register' ||
          document.referrer === ''
        ) {
          window.location.href = 'http://localhost:8000';
        } else {
          window.location.replace(document.referrer);
        }
      } else {
        window.location.href = 'http://localhost:8000';
      }
    }
  } else {
    console.log(result);
    toast.generateToast({
      message: result.msg,
      background: 'rgb(194 232 247)',
      color: 'red',
      length: '2000ms',
    });
  }
});

document.querySelector('#btn-reset').addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const email = document.querySelector('input[name="email"]').value;
    const response = await fetch('http://localhost:8000/user/sendLink', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (result.success) {
      toast.generateToast({
        message: result.msg,
        background: 'rgb(194 232 247)',
        color: 'green',
        length: '2000ms',
      });
    } else {
      toast.generateToast({
        message: result.msg,
        background: 'rgb(194 232 247)',
        color: 'red',
        length: '2000ms',
      });
    }
  } catch (error) {
    console.log(error);
  }
});

async function login(email, password) {
  try {
    const response = await fetch('http://localhost:8000/user/login', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}
