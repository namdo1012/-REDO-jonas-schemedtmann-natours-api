import '@babel/polyfill';
import { login } from './login';
import { logout } from './logout';

const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    console.log('Logging out');
    logout();
  });
}
