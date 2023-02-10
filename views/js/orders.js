//this opens new form when add new book button is clicked
import { toast } from './toast.js';
import { loadNav } from './session.js';

onload();
async function onload() {
  try {
    const parsedUserData = await loadNav();
    if (parsedUserData) {
      const btnBooks = document.querySelector('#btn-books');
      const btnUsers = document.querySelector('#btn-users');
      btnBooks.className = 'before';
      btnUsers.className = 'before';

      document.querySelector('#nav-dashboard').style.display = 'none';
      document.querySelector('#btn-orders').className = 'active';

      btnBooks.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign('http://localhost:8000/books/admin');
      });
      btnUsers.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign('http://localhost:8000/user/all');
      });
    }
  } catch (error) {
    console.log(error);
  }
}

toast.initToast();

const rowOrders = document.querySelectorAll('#row-order');
rowOrders.forEach((rowOrder) => {
  const orderId = rowOrder.getAttribute('data-orderId');
  rowOrder.querySelector('#btn-update').addEventListener('click', (e) => {
    e.preventDefault();

    const id = rowOrder.getAttribute('data-orderId');
    const address = rowOrder.getAttribute('data-address');
    const date = rowOrder.getAttribute('data-date');
    const status = rowOrder.getAttribute('data-status');

    const addressInput = document.querySelector('input[name="address"]');
    addressInput.value = address;
    const dateInput = document.querySelector('input[name="delivery_date"]');
    dateInput.value = date;
    const selectStatus = document.querySelector('select[name="status"]');
    if (document.querySelector('#optD')) {
      document.querySelector('#optD').remove();
    }
    const optionD = document.createElement('option');
    optionD.selected = true;
    optionD.id = 'optD';
    optionD.innerHTML = status;
    selectStatus.appendChild(optionD);
    optionD.value = status;

    let allStatus = ['PAID', 'CANCELED', 'FAILED', 'DELIVERED', 'PENDING'];
    for (let i = 0; i < allStatus.length; i++) {
      const currentStatus = document.querySelector(`#opt${allStatus[i]}`);
      if (status === allStatus[i]) {
        if (currentStatus) {
          currentStatus.remove();
        }
        continue;
      }
      if (currentStatus) {
        continue;
      }
      let option = document.createElement('option');
      option.value = allStatus[i];
      option.id = `opt${allStatus[i]}`;
      option.innerHTML = allStatus[i];
      selectStatus.appendChild(option);
    }

    const modal = document.querySelector('#modal');
    modal.showModal();

    document.querySelector('#btn-save').addEventListener('click', async (e) => {
      e.preventDefault();
      const deliveryDate = dateInput.value;
      const deliveryAddress = addressInput.value;
      const status = selectStatus.value;
      console.log(status);
      const response = await fetch(`http://localhost:8000/admin/order/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ deliveryAddress, deliveryDate, status }),
      });
      const result = await response.json();
      if (result.success) {
        modal.close();
        window.location.reload();
        toast.generateToast({
          message: result.msg,
          background: 'green',
          color: 'white',
          length: '3000ms',
        });
      } else {
        toast.generateToast({
          message: result.msg,
          background: 'red',
          color: 'white',
          length: '2000ms',
        });
      }
    });
    document.querySelector('#btn-cancel').addEventListener('click', (e) => {
      e.preventDefault();
      modal.close();
    });
  });
  rowOrder.querySelector('#btn-delete').addEventListener('click', (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/admin/order/${orderId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          toast.generateToast({
            message: result.msg,
            background: 'green',
            color: 'white',
            length: '2000ms',
          });
          window.location.reload();
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
