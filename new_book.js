const MY_SERVER = "http://127.0.0.1:5000";

const check_for_dupes = async () => {
  if (isNaN(ISBN.value)) {
    toast_error("ISBN is not valid");
    return false;
  }

  if (!release_date.checkValidity()) {
    console.log(birthdate_input.value);
    return false;
  }

  toast_success("New book added!");
  return true;
};

const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const isUnique = await check_for_dupes();

  if (isUnique) {
    const formData = new FormData(form);
    const url = form.getAttribute('action');

    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then(() => {
        form.reset(); // Reset the form data
      })
      .catch(error => {
        console.error(error);
        window.location.href = 'index.html';
      });
  }
});

// ------------------------- TOASTIFY----------------------

const toast_success = (message) => {
  Toastify({
    text: message,
    duration: 3000, // Duration in milliseconds
    close: true, // Show close button
    gravity: "bottom", // Position the toast at the top of the page
    position: "center", // Center the toast horizontally
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)", // Set the background color
    style: {
      color: "#000000"
    }
  }).showToast();
};

const toast_error = (message) => {
  Toastify({
    text: message,
    duration: 3000, // Duration in milliseconds
    close: true, // Show close button
    gravity: "bottom", // Position the toast at the top of the page
    position: "center", // Center the toast horizontally
    backgroundColor: "#ff3333b1", // Set the background color
    style: {
      color: "#000000", // Set the text color to white
      fontWeight: "bold"
    }
  }).showToast();
};
