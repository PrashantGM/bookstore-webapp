import { loadNav } from './session.js';

async function onLoad() {
  try {
    let parsedUserData = await loadNav();
    if (parsedUserData) {
      const btnProfile = document.querySelector('.btn-profile');
      btnProfile.textContent = parsedUserData.username;
      const userIcon = document.createElement('i');
      userIcon.className = 'fa fa-user-circle';
      btnProfile.appendChild(userIcon);

      const downIcon = document.createElement('i');
      downIcon.className = 'fa fa-caret-down';
      btnProfile.appendChild(downIcon);

      document.querySelector('#nav-dashboard').style.display = 'none';
    }
  } catch (error) {
    console.log(error);
  }
}

onLoad();
