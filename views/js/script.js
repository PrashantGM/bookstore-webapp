//this opens new form when add new book button is clicked
import { toast } from './toast.js';
import { loadNav } from './session.js';

onload();
async function onload() {
  try {
    const parsedUserData = await loadNav();

    if (parsedUserData) {
      const btnUsers = document.querySelector('#btn-users');
      const btnOrders = document.querySelector('#btn-orders');
      document.querySelector('#nav-dashboard').style.display = 'none';
      document.querySelector('#btn-books').className = 'active';

      btnUsers.className = 'before';
      btnOrders.className = 'before';

      btnUsers.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign('http://localhost:8000/user/all');
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

const BOOK_URL = 'http://localhost:8000/books/admin';

toast.initToast();
let message = sessionStorage.getItem('notification');
if (message) {
  toast.generateToast({
    message: message,
    background: 'green',
    color: 'white',
    length: '2000ms',
  });
}
sessionStorage.clear();
function openForm(actionType, id) {
  const form = document.getElementById('popupForm');
  form.style.display = 'block';
  const trueForm = document.querySelector('.formContainer');
  document.querySelector('#btn-add').style.display = 'none';
  document.querySelector('.admin-options').style.display = 'none';
  const imgBook = document.querySelector('input[name="image"]');
  imgBook.onchange = () => {
    let display = document.querySelector('#img-display');
    if (imgBook.files && imgBook.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        display.src = e.target.result;
      };
      reader.readAsDataURL(imgBook.files[0]);
    }
  };
  if (actionType === 'add') {
    trueForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = appendDataToForm(actionType);
      fetch(BOOK_URL, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            sessionStorage.setItem('notification', `${result.msg}`);
            closeForm();
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
  } else {
    fetch(`/books/admin/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
      .then((res) => res.json())
      .then((booksData) => {
        const {
          title,
          imageURI,
          genre,
          description,
          price,
          author,
          quantity,
          parsedDate,
        } = booksData.data;
        document.querySelector('#h3-newbook').textContent = 'Edit Book';
        document.querySelector('#btn-save').textContent = 'Update';
        document.querySelector('input[name="title"]').value = title;
        document.querySelector('#img-display').src = imageURI;
        if (imageURI.startsWith('https://')) {
          document.querySelector('#cloudinary').checked = true;
        }
        document.querySelector('input[name="genre"]').value = genre;
        document.querySelector('textarea[name="description"]').value =
          description;
        document.querySelector('input[name="price"]').value = price;
        document.querySelector('input[name="quantity"]').value = quantity;
        document.querySelector('input[name="author"]').value = author;
        document.querySelector('input[name="publication_date"]').value =
          parsedDate;
      })
      .catch(function (err) {
        console.log(err);
      });
    trueForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formUpdatedData = appendDataToForm();
      fetch(`/books/admin/${id}`, {
        method: 'PUT',
        body: formUpdatedData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            sessionStorage.setItem('notification', `${result.msg}`);
            closeForm();
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
  }
  document.getElementById('tb-books').style.display = 'none';
  document.getElementById('btn-add').style.display = 'none';
}

//closes the form after close button click
function closeForm() {
  document.getElementById('popupForm').style.display = 'none';
  document.getElementById('tb-books').style.display = 'block';
  document.getElementById('btn-add').style.display = 'block';
  window.location.reload();
}
export function closeIt() {
  closeForm();
}

document.querySelector('#btn-add').addEventListener('click', (e) => {
  openForm('add', '');
});

function appendDataToForm() {
  const formData = new FormData();
  formData.append('title', document.querySelector('input[name="title"]').value);

  const imgBook = document.querySelector('input[name="image"]');
  if (imgBook.files[0]) {
    formData.append('new-image', imgBook.files[0]);
  } else {
    formData.append('image', document.querySelector('#img-display').src);
  }

  const cloudCheck = document.querySelector('#cloudinary');
  if (cloudCheck.checked) {
    cloudCheck.value = 'cloudinary';
  }

  formData.append('cloud', cloudCheck.value);

  formData.append('genre', document.querySelector('input[name="genre"]').value);
  formData.append(
    'description',
    document.querySelector('textarea[name="description"]').value
  );
  formData.append('price', document.querySelector('input[name="price"]').value);
  formData.append(
    'quantity',
    document.querySelector('input[name="quantity"]').value
  );
  formData.append(
    'author',
    document.querySelector('input[name="author"]').value
  );
  formData.append(
    'publication_date',
    document.querySelector('input[name="publication_date"]').value
  );
  return formData;
}

//deletes corresponding book
const rowBook = document.querySelectorAll('#row-book');
rowBook.forEach((rowBook) => {
  const bookId = rowBook.getAttribute('data-bookId');
  rowBook.querySelector('#btn-update').addEventListener('click', (e) => {
    openForm('update', bookId);
  });
  rowBook.querySelector('#btn-delete').addEventListener('click', (e) => {
    e.preventDefault();
    fetch(`${BOOK_URL}/${bookId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          sessionStorage.setItem('notification', `${result.msg}`);
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

//poulate the modal form
let modalBtns = [...document.querySelectorAll('#btn-addBook')];
modalBtns.forEach(function (btn) {
  btn.onclick = function () {
    let modal = btn.getAttribute('data-modal');
    document.getElementById(modal).style.display = 'block';
  };
});

//closes the modal form
let closeBtns = [...document.querySelectorAll('.close')];
closeBtns.forEach(function (btn) {
  btn.onclick = function () {
    let modal = btn.closest('.modal');
    modal.style.display = 'none';
  };
});
