const toast = (function () {
  let toastContainer;

  function initToast(location) {
    document.body.insertAdjacentHTML(
      'afterbegin',
      `<div class="toast-container"></div>
  <style>
  
.toast-container {
  position: fixed;
  top: 4rem;
  right: 1.5rem;
  box-shadow: 10px 5px 5px lightblue;
}

.toast {
  font-size: 1rem;
  padding: 0.8em;
  background-color: orange;
  animation: toastIt 3000ms cubic-bezier(0.785, 0.135, 0.15, 0.86) forwards;
}

@keyframes toastIt {
  0%,
  100% {
    transform:translateY(-150%);
    opacity: 0;
  }
  10%,90%{
    transform:translateY(0);
    opacity: 1;
  }
}
  </style>
  `
    );
    toastContainer = document.querySelector('.toast-container');
  }

  function generateToast({
    message,
    background = '#00214d',
    color = '#fffffe',
    length = '2000ms',
  }) {
    toastContainer.insertAdjacentHTML(
      'beforeend',
      `<p class="toast" 
    style="background-color: ${background};
    color: ${color};
    animation-duration: ${length}">
    ${message}
  </p>`
    );
    const toast = toastContainer.lastElementChild;
    toast.addEventListener('animationend', () => toast.remove());
  }
  return { initToast, generateToast };
})();

export { toast };
