//this opens new form when add new book button is clicked
const BOOK_URL = 'http://localhost:8000/books/admin';
function openForm(actionType, id) {
  const form = document.getElementById('popupForm');
  form.style.display = 'block';
  const trueForm = document.querySelector('.formContainer');
  document.querySelector('#btn-add').style.display = 'none';
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

      const formData = new FormData();
      formData.append(
        'title',
        document.querySelector('input[name="title"]').value
      );

      formData.append('image', imgBook.files[0]);

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
        .then(() => {
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
        const {
          title,
          imageURI,
          genre,
          description,
          price,
          author,
          parsedDate,
        } = booksData.data;
        document.querySelector('#h3-newbook').textContent = 'Edit Book';
        document.querySelector('#btn-save').textContent = 'Update';
        document.querySelector('input[name="title"]').value = title;
        document.querySelector('#img-display').src = imageURI;
        document.querySelector('input[name="genre"]').value = genre;
        document.querySelector('textarea[name="description"]').value =
          description;
        document.querySelector('input[name="price"]').value = price;
        document.querySelector('input[name="author"]').value = author;
        document.querySelector('input[name="publication_date"]').value =
          parsedDate;
        console.log('ran');
      })
      .catch(function (err) {
        console.log(err);
      });
    trueForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formUpdatedData = new FormData();
      formUpdatedData.append(
        'title',
        document.querySelector('input[name="title"]').value
      );

      if (imgBook.files[0]) {
        formUpdatedData.append('image', imgBook.files[0]);
      } else {
        formUpdatedData.append(
          'image',
          document.querySelector('#img-display').src
        );
      }

      const cloudCheck = document.querySelector('input[name="cloudinary"]');
      if (cloudCheck.ariaChecked) {
        cloudCheck.value = 'cloudinary';
      }
      formUpdatedData.append('cloud', cloudCheck.value);

      formUpdatedData.append(
        'genre',
        document.querySelector('input[name="genre"]').value
      );
      formUpdatedData.append(
        'description',
        document.querySelector('textarea[name="description"]').value
      );
      formUpdatedData.append(
        'price',
        document.querySelector('input[name="price"]').value
      );
      formUpdatedData.append(
        'author',
        document.querySelector('input[name="author"]').value
      );
      formUpdatedData.append(
        'publication_date',
        document.querySelector('input[name="publication_date"]').value
      );

      fetch(`/books/admin/${id}`, {
        method: 'PUT',
        body: formUpdatedData,
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
  document.getElementById('btn-add').style.display = 'none';
}

//closes the form after close button click
function closeForm() {
  document.getElementById('popupForm').style.display = 'none';
  document.getElementById('tb-books').style.display = 'block';
  document.getElementById('btn-add').style.display = 'block';
  window.location.reload();
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

// window.onclick = function (event) {
//   let modal = document.getElementById('modalAddBook');
//   if (event.target == modal) {
//     closeForm();
//   }
// };
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
// window.onclick = function (event) {
//   if (event.target.className === 'modal') {
//     event.target.style.display = 'none';
//   }
// };

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
