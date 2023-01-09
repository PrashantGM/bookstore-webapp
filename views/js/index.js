onload();
const btnProfile = document.querySelector('.btn-profile');
console.log(btnProfile);
async function onload() {
  const btnProfile = document.querySelector('.btn-profile');
  const navDropdown = document.querySelector('.dropdown-content');
  console.log(navDropdown);
  // navDropdown.style.display = block;

  try {
    const userData = await viewLoggedIn();

    const parsedUserData = JSON.parse(userData);
    console.log(parsedUserData);
    console.log(parsedUserData.username);
    if (parsedUserData) {
      // const navItem = document.querySelector('.li-user');
      btnProfile.textContent = parsedUserData.username;
      const userIcon = document.createElement('i');
      userIcon.className = 'fa fa-user-circle';
      btnProfile.appendChild(userIcon);
      console.log(userIcon);
      console.log('here');

      console.log(parsedUserData.username);
      const downIcon = document.createElement('i');
      downIcon.className = 'fa fa-caret-down';
      btnProfile.appendChild(downIcon);

      const navlinkDash = document.querySelector('#nav-dashboard');
      navlinkDash.style.display = 'none';
    } else {
      btnProfile.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'http://localhost:8000/user/login';
      });
    }
  } catch (error) {
    // console.log(error);
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
    // console.log(error);
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
