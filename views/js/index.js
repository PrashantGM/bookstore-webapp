onload();
const btnProfile = document.querySelector('.btn-profile');
async function onload() {
  const btnProfile = document.querySelector('.btn-profile');
  console.log('btnprofile', btnProfile);
  try {
    const userData = await viewLoggedIn();
    const parsedUserData = JSON.parse(userData);

    if (parsedUserData) {
      document.querySelector('.li-home').style.display = 'none';
      document.querySelector('.li-genre').style.display = 'none';
      document.querySelector('.li-about').style.display = 'none';

      btnProfile.textContent = parsedUserData.username;
      const userIcon = document.createElement('i');
      userIcon.className = 'fa fa-user-circle';
      btnProfile.appendChild(userIcon);

      const downIcon = document.createElement('i');
      downIcon.className = 'fa fa-caret-down';
      btnProfile.appendChild(downIcon);

      document.querySelector('#nav-cart').style.display = 'none';
      document.querySelector('#nav-dashboard').style.display = 'none';
    } else {
      btnProfile.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'http://localhost:8000/user/login';
      });
    }
  } catch (error) {
    console.log(error);
  }
}
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
    console.log(error);
  }
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
