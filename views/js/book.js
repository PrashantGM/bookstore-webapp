import { toast } from './toast.js';

const similarSection = document.querySelector('.others');
let currentGenre = similarSection.getAttribute('data-genre');
let bookId = 0;
fetch(`http://localhost:8000/books/similar?genre=${currentGenre}`, {
  headers: {
    'Content-Type': 'application/json',
  },
  method: 'GET',
})
  .then((res) => res.json())
  .then((result) => {
    const books = result.data;
    books.forEach((book) => {
      bookId = book.id;
      const bookOthers = document.createElement('div');
      bookOthers.className = 'book-others';
      similarSection.appendChild(bookOthers);

      const title = document.createElement('p');
      title.style.fontWeight = 'bold';
      title.innerHTML = book.title;
      bookOthers.appendChild(title);

      const image = document.createElement('img');
      image.src = book.image;
      image.width = '80';
      image.height = '80';
      bookOthers.appendChild(image);

      const author = document.createElement('p');
      author.className = 'm-t-5';
      author.style.overflowWrap = 'break-word';
      author.innerHTML = `By ${book.author}`;
      bookOthers.appendChild(author);

      const genre = document.createElement('p');
      genre.style.fontStyle = 'italic';
      genre.className = 'm-t-5';
      genre.style.overflowWrap = 'break-word';

      genre.innerHTML = book.genre;
      bookOthers.appendChild(genre);

      const price = document.createElement('p');
      price.style.fontWeight = 'bold';
      price.className = 'm-t-5';
      price.innerHTML = `Rs. ${book.price}`;
      bookOthers.appendChild(price);

      bookOthers.addEventListener('click', () => {
        window.location.assign(`http://localhost:8000/books/${book.id}`);
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });

const totalPrice = document.querySelector('#price-total');
let price = Number(totalPrice.getAttribute('data-price'));
let totalAmount = price * 1;
const inputQuantity = document.querySelector('input[name="quantity"]');
let quantity = Number(inputQuantity.value);

inputQuantity.addEventListener('input', (e) => {
  e.preventDefault();
  totalAmount = price * quantity;
  console.log('het');
  console.log(totalAmount);
  totalPrice.innerHTML = `Rs ${totalAmount}`;
});

const btnAddCart = document.querySelector('#btn-addCart');
btnAddCart.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log(totalAmount);
  const isLoggedIn = await viewLoggedIn();
  if (isLoggedIn.success) {
    const parsedUserData = JSON.parse(isLoggedIn.payload);
    const userId = parsedUserData.id;
    const response = await fetch(`http://localhost:8000/order/${bookId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ quantity, totalAmount, userId }),
    });
    const parsedResponse = await response.json();
    console.log(parsedResponse);
    const bookSection = document.querySelector('.book-section');
    toast.initToast(bookSection);
    toast.generateToast({
      message: parsedResponse.msg,
      background: '#eaf7fb',
      color: 'green',
      length: '2000ms',
    });
  } else {
    window.location.replace('http://localhost:8000/user/login');
  }
});

async function viewLoggedIn() {
  try {
    const payload = await fetch('http://localhost:8000/user/stat', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const userData = await payload.json();
    return userData;
  } catch (error) {
    console.log(error);
  }
}
