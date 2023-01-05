let page = 1;
let bookData = [];
const container = document.querySelector('.container');
async function getBooksFromServer(page) {
  // if ('URLSearchParams' in window) {
  //   var searchParams = new URLSearchParams(window.location.search);
  //   searchParams.set('page', page);
  //   var newRelativePathQuery =
  //     window.location.pathname + '?' + searchParams.toString();
  //   history.pushState(null, '', newRelativePathQuery);
  // }
  console.log(page);
  const books = await fetch(`http://localhost:8000/books?page=${page}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
  const result = await books.json();
  console.log(result);
  bookData = result;

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

    let pDesc = document.createElement('p');
    pDesc.className = 'el-novel p-desc';
    pDesc.innerHTML = book.description;
    divNovel.appendChild(pDesc);
  });
}

async function getBooksForUser(button) {
  if (button === 'next') {
    page += 1;

    // var elements = document.getElementsByClassName('.div-novel');
    // for (var i = 0, len = elements.length; i < len; i++) {
    //   elements[i].remove();
    // }
    document.querySelectorAll('.div-novel').forEach((e) => e.remove());

    getBooksFromServer(page);
  } else {
    page = -1;
    if (page < 1) {
      page = 1;
    }
    document.querySelectorAll('.div-novel').forEach((e) => e.remove());

    getBooksFromServer(page);
  }
}

getBooksFromServer(page);
