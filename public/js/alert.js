export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const alertDiv = `<div class="alert alert--${type}">${msg}</div>`;
  console.log(document.querySelector('body'));
  console.log(alertDiv);
  document.querySelector('body').insertAdjacentHTML('afterbegin', alertDiv);
  window.setTimeout(hideAlert, 3000);
};
