const toast = (function () {
  let toastContainer;

  function initToast(location) {
    console.log(location);
    location.insertAdjacentHTML(
      'afterbegin',
      `<div class="toast-container"></div>
  <style>
  
.toast-container {
  position: absolute;
  left: 50%;
  bottom:50%;
  transform:translate(-50%);
  box-shadow: 10px 5px 5px lightblue;
}

.toast {
  font-size: 0.8rem;
  padding: 0.6em;
  background-color: orange;
  animation: toastIt 2000ms;
}

@keyframes toastIt {
  0%,
  100% {
    opacity: 0;
  }
  20%,80%{
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
