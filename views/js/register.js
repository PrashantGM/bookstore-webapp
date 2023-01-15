const navDropdown = document.querySelector('#dropdown-profile');
navDropdown.style.display = 'none';
const registerForm = document.getElementById('form-register');
const btnRegister = document.getElementById('btn-register');
btnRegister.addEventListener('click', (e) => {
  e.preventDefault();

  const username = document.querySelector('input[name="username"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const data = { username, email, password };

  fetch('http://localhost:8000/user/register', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.log(error);
    });
});
