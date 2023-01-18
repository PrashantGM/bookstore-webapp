import { toast } from './toast.js';

const navDropdown = document.querySelector('#dropdown-profile');
navDropdown.style.display = 'none';
const registerForm = document.getElementById('form-register');
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

registerForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.querySelector('input[name="username"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const password = confirmPassword.value;
  registerForm.checkValidity();
  const data = { username, email, password };

  try {
    const response = await fetch('http://localhost:8000/user/register', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      toast.initToast(registerForm);
      toast.generateToast({
        message: result.msg,
        background: 'rgb(194 232 247)',
        color: 'green',
        length: '2000ms',
      });
      setTimeout(() => {
        window.location.replace('http://localhost:8000/user/login');
      }, 1000);
    } else {
      toast.initToast(registerForm);
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
