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

  //check if readingList paramater has been passed when clicked reading list
  if (!readingList) {
    // display all books or books per genre depending on value passed
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
  } else {
    //reading list has been clicked so fetch reading list for user
    try {
      const books = await fetch(
        `http://localhost:8000/user/reads/${parsedUserData.id}?page=${page}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        }
      );
      const result = await books.json();
      const readingLists = result.data.reads;
      bookData = readingLists;
      //create and apply pagination controls below books displayed
      await pagination(true);
    } catch (error) {
      console.log(error);
    }
  }
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
    imgBook.height = '200';
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

    //if reading has not been clicked
    if (!readingList) {
      //display add to reading list - image button
      let imgRead = document.createElement('img');
      imgRead.title = 'Add to Reading List';
      imgRead.addEventListener('click', async (e) => {
        e.preventDefault();

        //if user isn't logged in, redirect user to login page
        if (!isLoggedIn.success) {
          window.location.href = 'http://localhost:8000/user/login';
        }
        // fetch user's reading list from server
        try {
          const response = await fetch(
            `http://localhost:8000/user/${parsedUserData.id}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'PATCH',
              body: JSON.stringify({ id: book.id, title: book.title }),
            }
          );
          const result = await response.json();
          //initializing toast container
          toast.initToast(container);

          //upon successfully addition of reading list to user's profile
          if (result.success === true) {
            //display success toast message
            console.log('on success');
            toast.generateToast({
              message: `${book.title} added to Reading List`,
              background: '#eaf7fb',
              color: 'green',
              length: '2000ms',
            });
          } else {
            //display failure toast message
            console.log('on failure before toast');
            toast.generateToast({
              message: result.msg,
              background: '#eaf7fb',
              color: 'red',
              length: '2000ms',
            });
          }
        } catch (error) {
          console.log(error);
        }
      });
      imgRead.id = 'img-read';
      imgRead.src = '../imgs/book.png';
      imgRead.width = '30';
      divGR.appendChild(imgRead);
    }

    let pPrice = document.createElement('p');
    pPrice.className = 'el-novel p-price';
    pPrice.innerHTML = `Rs. ${book.price}`;
    divNovel.appendChild(pPrice);
  });
}

async function load(page, readingList, genre) {
  await getBooksFromServer(page, readingList, genre);
  if (!readingList) {
    await pagination();
  }
  viewLoggedIn();
}
load(page, false, '');

//function for displaying controls for pagination
export async function pagination(readingList) {
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
      console.log(page, readingList);
      document.querySelectorAll('.div-novel').forEach((e) => e.remove());
      document.querySelector('.page-controls').remove();
      load(page, readingList);
    });
  }

  btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.div-novel').forEach((e) => e.remove());
      page += 1;
      console.log(page, readingList);
      document.querySelector('.page-controls').remove();
      load(page, readingList);
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
  load(page, false, genre);
}

//this function is invoked when user clicks reading list
export function viewReadingList() {
  document.querySelectorAll('.div-novel').forEach((e) => e.remove());

  document.querySelector('.page-controls').remove();
  getBooksFromServer(page, true);
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
