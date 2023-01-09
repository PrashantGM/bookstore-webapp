let page = 1;
let bookData = [];
let userID = 1;

const container = document.querySelector('.container');
const section = document.querySelector('.section');
async function getBooksFromServer(page, readingList) {
  const btnProfile = document.querySelector('.btn-profile');
  const navDropdown = document.querySelector('.dropdown-content');

  // navDropdown.style.display = 'none';
  let parsedUserData = {};
  try {
    const userData = await viewLoggedIn();

    parsedUserData = JSON.parse(userData);
    console.log(parsedUserData);

    if (parsedUserData) {
      const navItem = document.querySelector('.li-user');
      btnProfile.textContent = parsedUserData.username;
      const userIcon = document.createElement('i');
      userIcon.className = 'fa fa-user-circle';
      btnProfile.appendChild(userIcon);
      console.log(parsedUserData.username);
      const downIcon = document.createElement('i');
      downIcon.className = 'fa fa-caret-down';
      btnProfile.appendChild(downIcon);

      const navlinkDash = document.querySelector('#nav-dashboard');
      navlinkDash.style.display = 'none';

      if (parsedUserData.role === 'ADMIN') {
        console.log('i ran here');
        navlinkDash.style.display = 'block';
      }
    }
  } catch (error) {
    // console.log(error);
  }

  if (!parsedUserData.username) {
    console.log('here');
    navDropdown.style.display = 'none';
    btnProfile.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'http://localhost:8000/user/login';
    });
  }

  if (!readingList) {
    const books = await fetch(`http://localhost:8000/books?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const result = await books.json();

    bookData = result;
  } else {
    const books = await fetch(`http://localhost:8000/user/reads/${userID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const result = await books.json();

    const readingLists = result[0].reading_list;
    bookData = readingLists;
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
    imgBook.src = book.image;
    imgBook.alt = 'img-book';
    divImg.appendChild(imgBook);

    let pAuthor = document.createElement('p');
    pAuthor.className = 'el-novel p-author';
    pAuthor.innerHTML = `By ${book.author}`;
    divNovel.appendChild(pAuthor);

    let divGR = document.createElement('div');
    divGR.id = 'div-gr';
    divNovel.appendChild(divGR);

    let pGenre = document.createElement('p');
    pGenre.className = 'el-novel p-genre';
    pGenre.innerHTML = book.genre;
    divGR.appendChild(pGenre);

    let imgRead = document.createElement('img');
    imgRead.title = 'Add to Reading List';
    // imgRead.onclick =
    //   'getCardDetails({ id: ${book.id}, title: ${book.title} })';
    imgRead.addEventListener('click', (e) => {
      // e.preventDefault();
      console.log('clicked');
      console.log(book);
      console.log(book.id);
      fetch(`http://localhost:8000/user/${1}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({ id: book.id, title: book.title }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    });
    imgRead.id = 'img-read';
    imgRead.src = '../imgs/book.png';
    imgRead.width = '30';
    divGR.appendChild(imgRead);

    let pPrice = document.createElement('p');
    pPrice.className = 'el-novel p-price';
    pPrice.innerHTML = `Rs. ${book.price}`;
    divNovel.appendChild(pPrice);

    // let pDesc = document.createElement('p');
    // pDesc.className = 'el-novel p-desc';
    // pDesc.innerHTML = book.description;
    // divNovel.appendChild(pDesc);
  });
}

async function load(page) {
  await getBooksFromServer(page, false);
  await pagination();
  viewLoggedIn();
  // await addReadingList();
}
load(page);
async function pagination() {
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
      document.querySelector('.page-controls').remove();
      load(page);
      // getBooksFromServer(page);
    });
  }
}

// async function addReadingList() {
//   document.getElementById('img-read').addEventListener('click', (e) => {
//     e.preventDefault();
//     console.log('clicked');
//     console.log(e);
//   });
// }
async function viewLoggedIn() {
  try {
    const payload = await fetch('http://localhost:8000/user/stat', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const userData = await payload.json();
    console.log(userData.payload);

    return userData.payload;
  } catch (error) {
    // console.log(error);
  }
}

function viewUserProfile() {
  const navUser = document.getElementById('li-user');
  // navUser.remov;
}

function viewReadingList() {
  document.querySelectorAll('.div-novel').forEach((e) => e.remove());

  document.querySelector('.page-controls').remove();
  getBooksFromServer(page, true);
}

function logout() {
  fetch('http://localhost:8000/user/logout', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then(() => {
    window.location.replace('http://localhost:8000');
  });
}
