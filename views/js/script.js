//this opens new form when add new book button is clicked
const BOOK_URL = 'http://localhost:8000/books';
function openForm() {
  const form = document.getElementById('popupForm');
  form.style.display = 'block';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.querySelector('input[name="title"]').value;
    const price = document.querySelector('input[name="price"]').value;
    const author = document.querySelector('input[name="author"]').value;
    const date = document.querySelector('input[name="publication_date"]').value;

    const data = { title, price, author, publication_date: date };
    fetch(BOOK_URL, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(function (res) {
        console.log(res);
      })
      .catch(function (err) {
        console.log(err);
      });
  });
  document.getElementById('tb-books').style.display = 'none';
  document.getElementById('btn-addBook').style.display = 'none';
}

//closes the form after close button click
function closeForm() {
  document.getElementById('popupForm').style.display = 'none';
  document.getElementById('tb-books').style.display = 'block';
  document.getElementById('btn-addBook').style.display = 'block';
  window.location.href = BOOK_URL;
}

//deletes corresponding book
function deleteBook(id) {
  // if (confirm('Are you sure to delete this book?')) {
  fetch(`${BOOK_URL}/${id}`, {
    method: 'DELETE',
  })
    .then(function (res) {
      window.location.href = BOOK_URL;
    })
    .catch(function (err) {
      console.log(err);
    });
  // } else {
  //   txt = 'Cancelled the operation';
  // }
}

window.onclick = function (event) {
  let modal = document.getElementById('modalAddBook');
  if (event.target == modal) {
    closeForm();
  }
};
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
window.onclick = function (event) {
  if (event.target.className === 'modal') {
    event.target.style.display = 'none';
  }
};
