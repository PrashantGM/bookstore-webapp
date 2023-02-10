//this opens new form when add new book button is clicked
import { toast } from './toast.js';
import { loadNav } from './session.js';

onload();
async function onload() {
  try {
    const parsedUserData = await loadNav();
    if (parsedUserData) {
      const btnBooks = document.querySelector('#btn-books');
      const btnOrders = document.querySelector('#btn-orders');
      btnBooks.className = 'before';
      btnOrders.className = 'before';

      document.querySelector('#nav-dashboard').style.display = 'none';
      document.querySelector('#btn-users').className = 'active';

      btnBooks.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign('http://localhost:8000/books/admin');
      });
      btnOrders.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign('http://localhost:8000/orders/all');
      });
    }
  } catch (error) {
    console.log(error);
  }
}

toast.initToast();

const rowUsers = document.querySelectorAll('#row-user');
console.log(rowUsers);
rowUsers.forEach((rowUser) => {
  const userId = rowUser.getAttribute('data-userId');
  rowUser.querySelector('#btn-delete').addEventListener('click', (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/user/${userId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          window.location.reload();
          toast.generateToast({
            message: result.msg,
            background: 'green',
            color: 'white',
            length: '2000ms',
          });
        } else {
          toast.generateToast({
            message: 'Something went wrong! Please try again',
            background: 'red',
            color: 'white',
            length: '2000ms',
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  });
});
