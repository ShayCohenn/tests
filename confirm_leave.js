window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';  // This line is necessary for Chrome and Firefox
  });