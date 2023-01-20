loadNav();
async function loadNav() {
  const btnProfile = document.querySelector('.btn-profile');
  console.log('btnprofile', btnProfile);

  try {
    const isLoggedIn = await viewLoggedIn();
    let loggedIn = isLoggedIn.success;
    if (loggedIn) {
      let parsedUserData = JSON.parse(isLoggedIn.payload);

      btnProfile.textContent = parsedUserData.username;
      const userIcon = document.createElement('i');
      userIcon.className = 'fa fa-user-circle';
      btnProfile.appendChild(userIcon);

      const downIcon = document.createElement('i');
      downIcon.className = 'fa fa-caret-down';
      btnProfile.appendChild(downIcon);

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
    return userData;
  } catch (error) {
    console.log(error);
  }
}
