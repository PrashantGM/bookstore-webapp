//this opens new form when add new book button is clicked
const BOOK_URL = 'http://localhost:8000/books/admin';
function openForm(actionType, id) {
  const form = document.getElementById('popupForm');
  form.style.display = 'block';
  const trueForm = document.querySelector('.formContainer');

  if (actionType === 'add') {
    trueForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append(
        'title',
        document.querySelector('input[name="title"]').value
      );
      formData.append(
        'image',
        document.querySelector('input[name="image"]').files[0]
      );
      const cloudCheck = document.querySelector('input[name="cloudinary"]');
      if (cloudCheck.ariaChecked) {
        cloudCheck.value = 'cloudinary';
      }
      formData.append('cloud', cloudCheck.value);

      formData.append(
        'genre',
        document.querySelector('input[name="genre"]').value
      );
      formData.append(
        'description',
        document.querySelector('textarea[name="description"]').value
      );
      formData.append(
        'price',
        document.querySelector('input[name="price"]').value
      );
      formData.append(
        'author',
        document.querySelector('input[name="author"]').value
      );
      formData.append(
        'publication_date',
        document.querySelector('input[name="publication_date"]').value
      );

      fetch(BOOK_URL, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          closeForm();
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
        const { title, image, genre, description, price, author, parsedDate } =
          booksData.data;
        document.querySelector('#h3-newbook').textContent = 'Edit Book';
        document.querySelector('#btn-save').textContent = 'Update';
        document.querySelector('input[name="title"]').value = title;
        document.querySelector('input[name="image"]').style.display = 'none';
        document.querySelector('#img-display').src = image;
        document.querySelector('input[name="genre"]').value = genre;
        document.querySelector('textarea[name="description"]').value =
          description;
        document.querySelector('input[name="price"]').value = price;
        document.querySelector('input[name="author"]').value = author;
        document.querySelector('input[name="publication_date"]').value =
          parsedDate;
      })
      .catch(function (err) {
        console.log(err);
      });
    trueForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const title = document.querySelector('input[name="title"]').value;
      const image = document.querySelector('#img-display').src;

      const genre = document.querySelector('input[name="genre"]').value;
      const description = document.querySelector(
        'textarea[name="description"]'
      ).value;
      const price = document.querySelector('input[name="price"]').value;
      const author = document.querySelector('input[name="author"]').value;
      const date = document.querySelector(
        'input[name="publication_date"]'
      ).value;
      const data = {
        title,
        image,
        genre,
        description,
        price,
        author,
        publication_date: date,
      };

      fetch(`/books/admin/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(data),
      })
        .then(function (res) {
          closeForm();
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  }
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
function addBook() {
  openForm('add', '');
}
//updates corresponding book
function updateBook(id) {
  openForm('update', id);
}

//deletes corresponding book
function deleteBook(id) {
  // if (confirm('Are you sure to delete this book?')) {
  fetch(`${BOOK_URL}/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      window.location.href = BOOK_URL;
    })
    .catch(function (err) {
      console.log(err);
    });
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

let toastContainer;

function generateToast({
  message,
  background = '#00214d',
  color = '#fffffe',
  length = '2000ms',
}) {
  toastContainer.insertAdjacentHTML(
    'beforeend',
    `<p class="toast" 
    style="background-color: ${background};
    color: ${color};
    animation-duration: ${length}">
    ${message}
  </p>`
  );
  const toast = toastContainer.lastElementChild;
  toast.addEventListener('animationend', () => toast.remove());
}
