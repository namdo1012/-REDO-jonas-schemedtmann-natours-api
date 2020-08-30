import axios from 'axios';
import { showAlert } from './alert';

export const logout = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    // Need to use reload, avoid web page reload from cache
    if (res.data.status === 'success') {
      document.cookie = `jwt=${res.data.token}`;
      location.assign('/');
    }
  } catch (err) {
    console.log('Err from Logout func: ', err.response);
  }
};
