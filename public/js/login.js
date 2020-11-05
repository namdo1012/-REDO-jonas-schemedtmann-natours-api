import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    // console.log(res);

    if (res.data.status === 'success') {
      document.cookie = `jwt=${res.data.token}`;

      showAlert('success', 'You are now logged in!');

      // REDIRECT to overview page after 1.5s
      window.setTimeout(() => {
        window.location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log('Login function: ', err);
    showAlert('error', 'Error logging in! Try again.');
  }
};
