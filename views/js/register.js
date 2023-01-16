const navDropdown = document.querySelector('#dropdown-profile');
navDropdown.style.display = 'none';
const registerForm = document.getElementById('form-register');
const btnRegister = document.getElementById('btn-register');
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

registerForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.querySelector('input[name="username"]').value;
  const email = document.querySelector('input[name="email"]').value;
  registerForm.checkValidity();
  const data = { username, email, password };

  fetch('http://localhost:8000/user/register', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((res) => {
      window.location.replace('http://localhost:8000/user/login');
    })
    .catch((error) => {
      console.log(error);
    });
});
