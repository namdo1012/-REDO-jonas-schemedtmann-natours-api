import axios from 'axios';
import { showAlert } from './alert';

export const updateSetting = async (name, email, photo) => {
  console.log({ name, email, photo });
  try {
    const res = await axios({
      method: 'patch',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
      headers: {
        Authorization: `Bearer ${document.cookie.replace('jwt=', '')}`,
        'Content-Type': 'multipart/form-data',
      },
      data: {
        name,
        email,
        photo,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data update successfully!');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
