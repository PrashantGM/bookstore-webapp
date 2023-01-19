import { toast } from './toast.js';

let page = 1;
let bookData = [];
let genre = '';
const container = document.querySelector('.container');
const section = document.querySelector('.section');

//gets books from server and loads on the page
async function getBooksFromServer(page, readingList, genre) {
  const btnProfile = document.querySelector('.btn-profile');
  const navDropdown = document.querySelector('#dropdown-profile');

  let parsedUserData = {};

  //first check if user is logged
  const isLoggedIn = await viewLoggedIn();
  try {
    //if user is logged in,
    if (isLoggedIn.success) {
      parsedUserData = JSON.parse(isLoggedIn.payload);
      //display name of user on nav menu
      btnProfile.textContent = parsedUserData.username;
      btnProfile.fontFamily = "Times New Roman', Times, serif";

      //adding user profile icon
      const userIcon = document.createElement('i');
      userIcon.className = 'fa fa-user-circle';
      btnProfile.appendChild(userIcon);

      //adding down icon
      const downIcon = document.createElement('i');
      downIcon.className = 'fa fa-caret-down';
      btnProfile.appendChild(downIcon);

      //do not display dashboard option on dropdown menu by default
      const navlinkDash = document.querySelector('#nav-dashboard');
      navlinkDash.style.display = 'none';

      //if logged in user is admin, show dashboard option
      if (parsedUserData.role === 'ADMIN') {
        navlinkDash.style.display = 'block';
      }
    } else {
      //if user isn't logged in, don't display dropdown menu. Displays login button by default.
      navDropdown.style.display = 'none';
      btnProfile.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'http://localhost:8000/user/login';
      });
    }
  } catch (error) {
    //catch and log exception error to console
    console.log(error);
  }
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
  bookData = result;
  //create and apply pagination controls below books displayed
  await pagination(true);

  //for each book in bookData array, display its data by creating corresponding elements
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
    pPrice.innerHTML = `Rs. ${book.price}`;
    divNovel.appendChild(pPrice);

    //when particular book card is clicked, open page for that book

    divNovel.addEventListener('click', (e) => {
      // e.preventDefault();
      window.location.assign(`http://localhost:8000/books/${book.id}`);
    });
  });
}

async function load(page, genre) {
  await getBooksFromServer(page, genre);
  viewLoggedIn();
}
load(page, '');

//function for displaying controls for pagination
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
  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.preventDefault();
      page -= 1;
      if (page < 1) {
        page = 1;
      }
      console.log(page);
      document.querySelectorAll('.div-novel').forEach((e) => e.remove());
      document.querySelector('.page-controls').remove();
      load(page);
    });
  }

  btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.div-novel').forEach((e) => e.remove());
      page += 1;
      console.log(page);
      document.querySelector('.page-controls').remove();
      load(page);
    });
  }
}

//function that checks with server if user is logged or not
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
//this function is invoked when user selects genre

export function getBooksByGenre(genre) {
  document.querySelectorAll('.div-novel').forEach((e) => e.remove());
  document.querySelector('.page-controls').remove();
  load(page, genre);
}

//logout functionality
export function logout() {
  fetch('http://localhost:8000/user/logout', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then(() => {
    window.location.replace('http://localhost:8000');
  });
}
