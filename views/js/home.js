import { toast } from './toast.js';
import { loadNav, logout } from './session.js';

let page = 1;
let bookData = [];
let accumCount = 0;
let parsedUserData = {};
const container = document.querySelector('.container');
const section = document.querySelector('.section');
toast.initToast();
let message = sessionStorage.getItem('notification');
if (message) {
  toast.generateToast({
    message: message,
    background: '#76B947',
    color: 'white',
    length: '2000ms',
  });
}
sessionStorage.clear();
async function getBooksFromServer(page, genre) {
  parsedUserData = await loadNav();
  const books = await fetch(
    `http://localhost:8000/books?genre=${genre}&page=${page}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    }
  );
  const result = await books.json();

  bookData = result.data;

  const totalCount = result.totalCount;
  const currentCount = result.nbHits;
  accumCount = accumCount + currentCount;

  await pagination(true);

  if (totalCount <= accumCount) {
    //only tested for pagination two page worth of books
    document.querySelector('#btn-next').disabled = true;
  }

  if (page == 1) {
    document.querySelector('#btn-previous').disabled = true;
  }

  bookData.forEach((book) => {
    const divNovel = document.createElement('div');
    divNovel.className = 'div-novel';
    container.appendChild(divNovel);

    let hTitle = document.createElement('h1');
    hTitle.className = 'el-novel';
    hTitle.id = 'h1-title';
    hTitle.innerHTML = book.title;
    divNovel.appendChild(hTitle);

    let divImg = document.createElement('div');
    divImg.id = 'div-img';
    divNovel.appendChild(divImg);

    let imgBook = document.createElement('img');
    imgBook.id = 'img-book';
    imgBook.width = '20';
    imgBook.height = '240';
    imgBook.src = book.image;
    imgBook.alt = 'img-book';
    divImg.appendChild(imgBook);

    let pAuthor = document.createElement('p');
    pAuthor.className = 'el-novel p-author';
    pAuthor.innerHTML = `By ${book.author}`;
    divNovel.appendChild(pAuthor);

    let pGenre = document.createElement('p');
    pGenre.className = 'el-novel p-genre';
    pGenre.innerHTML = book.genre;
    divNovel.appendChild(pGenre);

    let pPrice = document.createElement('p');
    pPrice.className = 'el-novel p-price';
    pPrice.innerHTML = `$ ${book.price}`;
    divNovel.appendChild(pPrice);

    divNovel.addEventListener('click', (e) => {
      window.location.assign(`http://localhost:8000/books/${book.id}`);
    });
  });
}

async function load(page, genre) {
  await getBooksFromServer(page, genre);
}
load(page, '');

export async function pagination() {
  let divControls = document.createElement('div');
  divControls.className = 'page-controls';

  let btnPrev = document.createElement('button');
  btnPrev.id = 'btn-previous';
  let imgPrev = document.createElement('img');
  imgPrev.src = '../imgs/less-than.png';
  imgPrev.width = '25';
  imgPrev.alt = 'icon-prev';

  let btnNext = document.createElement('button');
  btnNext.id = 'btn-next';
  let imgNext = document.createElement('img');
  imgNext.src = '../imgs/greater-than.png';
  imgNext.width = '25';
  imgNext.alt = 'icon-next';

  btnPrev.appendChild(imgPrev);
  btnNext.appendChild(imgNext);
  divControls.appendChild(btnPrev);
  divControls.appendChild(btnNext);
  section.appendChild(divControls);

  btnPrev = document.getElementById('btn-previous');
  btnNext = document.getElementById('btn-next');

  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.preventDefault();
      btnNext.disabled = false;
      accumCount = 0;
      console.log('btnNext', btnNext);
      page -= 1;
      if (page < 1) {
        page = 1;
      }
      document.querySelectorAll('.div-novel').forEach((e) => e.remove());
      document.querySelector('.page-controls').remove();
      load(page);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      btnPrev.disabled = false;
      document.querySelectorAll('.div-novel').forEach((e) => e.remove());
      page += 1;
      document.querySelector('.page-controls').remove();
      load(page);
    });
  }
}

export function viewCartItems() {
  window.location.assign(`http://localhost:8000/order/${parsedUserData.id}`);
}

export function getBooksByGenre(genre) {
  document.querySelectorAll('.div-novel').forEach((e) => e.remove());
  document.querySelector('.page-controls').remove();
  load(page, genre);
}
