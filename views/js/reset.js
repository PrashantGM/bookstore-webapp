import { toast } from './toast.js';

const navDropdown = document.querySelector('#dropdown-profile');
navDropdown.style.display = 'none';
const resetForm = document.getElementById('form-reset');
const password = document.querySelector('input[name="password"]');
const confirmPassword = document.querySelector(
  'input[name="confirm-password"]'
);
confirmPassword.addEventListener('input', function () {
  if (password.value !== confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords doesn't match");
  } else {
    confirmPassword.setCustomValidity('');
  }
});

resetForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const password = confirmPassword.value;
  resetForm.checkValidity();
  let url = new URL(window.location.href);
  let email = url.searchParams.get('email');
  let token = url.searchParams.get('token');

  const data = { email, token, password };

  try {
    const response = await fetch('http://localhost:8000/user/resetPassword', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      sessionStorage.setItem('notification', result.msg);
      window.location.replace('http://localhost:8000/user/login');
    } else {
      toast.initToast();
      toast.generateToast({
        message: result.msg,
        background: 'rgb(194 232 247)',
        color: 'red',
        length: '2000ms',
      });
    }
  } catch (error) {
    // console.log(error);
  }
});
