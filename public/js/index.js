import '@babel/polyfill';
import { login } from './login';
import { logout } from './logout';
import { updateSetting } from './updateSetting';
import { updatePassword } from './updatePassword';

const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    // console.log('Logging out');
    logout();
  });
}

if (userDataForm) {
  console.log('There is userdataform');
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateSetting(name, email);
  });
}

if (userPasswordForm) {
  console.log('There is userpasswordform');
  userPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm = document.getElementById('password-confirm')
      .value;

    updatePassword(currentPassword, newPassword, newPasswordConfirm);
    // console.log({ currentPassword, newPassword, newPasswordConfirm });
  });
}
