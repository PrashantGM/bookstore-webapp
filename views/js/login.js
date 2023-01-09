const navDropdown = document.querySelector('.dropdown-content');

navDropdown.style.display = 'none';

const loginForm = document.getElementById('form-login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  console.log(email, password);
  fetch('http://localhost:8000/user/login', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then(({ data }) => {
      console.log(data.role);
      if (data.role === 'ADMIN') {
        window.location.replace('http://localhost:8000/books/admin');
      } else {
        window.location.replace('http://localhost:8000/');
      }
    });
});
