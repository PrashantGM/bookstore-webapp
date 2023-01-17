const similarSection = document.querySelector('.others');
let currentGenre = similarSection.getAttribute('data-genre');

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
      console.log(book.title);
      console.log('book');
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
    });
  })
  .catch((error) => {
    console.log(error);
  });
