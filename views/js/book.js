import { loadNav } from './session.js';
import { toast } from './toast.js';
let parsedUserData;
let bookId = 0;
let currentBookID = Number(
  document.querySelector('.book-details').getAttribute('data-bookId')
);
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
async function onload() {
  parsedUserData = await loadNav();
  await loadPage();
  await addtoCart();
}
onload();

async function loadPage() {
  const similarSection = document.querySelector('.others');
  let currentGenre = similarSection.getAttribute('data-genre');

  try {
    const response = await fetch(
      `http://localhost:8000/books/similar?genre=${currentGenre}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );
    const result = await response.json();
    const books = result.data;
    books.forEach((book) => {
      bookId = book.id;
      if (currentBookID == bookId) {
        return;
      }
      const bookOthers = document.createElement('div');
      bookOthers.className = 'book-others';
      similarSection.appendChild(bookOthers);

      const title = document.createElement('p');
      title.style.fontWeight = 'bold';
      title.style.height = '40px';
      title.style.textAlign = 'center';
      title.innerHTML = book.title;
      bookOthers.appendChild(title);

      const divImage = document.createElement('div');
      divImage.id = 'div-bookImage';
      divImage.style.marginTop = '10px';
      bookOthers.appendChild(divImage);
      const image = document.createElement('img');
      image.src = book.image;
      image.width = '90';
      image.height = '90';
      divImage.appendChild(image);

      const author = document.createElement('p');
      author.className = 'm-t-5';
      author.style.overflowWrap = 'break-word';
      author.innerHTML = `By ${book.author}`;
      bookOthers.appendChild(author);

      const genre = document.createElement('p');
      genre.style.fontStyle = 'italic';
      genre.style.height = '20px';
      genre.className = 'm-t-5';
      genre.style.overflowWrap = 'break-word';

      genre.innerHTML = book.genre;
      bookOthers.appendChild(genre);

      const price = document.createElement('p');
      price.style.fontWeight = 'bold';
      price.className = 'm-t-10';
      price.innerHTML = `$ ${book.price}`;
      bookOthers.appendChild(price);

      bookOthers.addEventListener('click', () => {
        window.location.assign(`http://localhost:8000/books/${book.id}`);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

async function addtoCart() {
  const totalPrice = document.querySelector('#price-total');
  let price = Number(totalPrice.getAttribute('data-price'));
  let totalAmount = price * 1;
  const inputQuantity = document.querySelector('input[name="quantity"]');
  let quantity = 1;
  inputQuantity.addEventListener('input', (e) => {
    e.preventDefault();
    quantity = Number(inputQuantity.value);
    totalAmount = price * quantity;
    totalPrice.innerHTML = `$ ${totalAmount}`;
  });

  const btnAddCart = document.querySelector('#btn-addCart');
  btnAddCart.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      if (parsedUserData) {
        const userId = parsedUserData.id;
        const response = await fetch(`http://localhost:8000/order/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            quantity,
            totalAmount,
            bookId: currentBookID,
          }),
        });
        const parsedResponse = await response.json();

        toast.generateToast({
          message: parsedResponse.msg,
          background: 'green',
          color: 'white',
          length: '2000ms',
        });
      } else {
        window.location.assign('http://localhost:8000/user/login');
      }
    } catch (error) {
      console.log(error);
    }
  });
}
