const loginForm = document.querySelector('.form--login');
// console.log({ email, password });

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    console.log(res);
    console.log(res.data.status);

    if (res.data.status === 'success') {
      document.cookie = `jwt=${res.data.token}`;
    }
  } catch (err) {
    console.log(err.response.data);
  }
};

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
  // console.log('OK');
});
