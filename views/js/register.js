const registerForm = document.getElementById('form-register');
registerForm.addEventListener('submit', (e) => {
  const username = document.querySelector('input[name="username"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const data = { username, email, password };
  console.log(data);

  fetch('http://localhost:8000/user/register', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
});
