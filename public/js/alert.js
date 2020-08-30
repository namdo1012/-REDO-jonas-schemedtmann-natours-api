// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  const alertDiv = document.createElement('div');
  alertDiv.innerHTML = `${msg}`;
  document.querySelector('body').insertAdjacentElement(alertDiv);
};
