import axios from 'axios';
import { showAlert } from './alert';

export const updatePassword = async (
  currentPassword,
  newPassword,
  newPasswordConfirm
) => {
  try {
    const res = await axios({
      method: 'patch',
      url: 'http://127.0.0.1:3000/api/v1/users/updatePassword',
      headers: {
        Authorization: `Bearer ${document.cookie.replace('jwt=', '')}`,
      },
      data: {
        currentPassword,
        newPassword,
        newPasswordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password update successfully');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
