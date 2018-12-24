window.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
  return 0;
};
