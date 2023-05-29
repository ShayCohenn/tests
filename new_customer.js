const MY_SERVER = "http://127.0.0.1:5000";
let existing_user = [];

const check_for_dupes = async () => {
  const existing_clients = await axios.get(MY_SERVER + "/clients/all");
  existing_user = existing_clients.data.map(client => {
    return { email: client.email, phone_num: client.phone_num };
  });
  const targetEmail = email_input.value;
  const targetPhoneNum = phone_num_input.value;

  const emailExists = existing_user.some(client => client.email && client.email.includes(targetEmail));
  const phoneNumExists = existing_user.some(client => client.phone_num && client.phone_num.includes(targetPhoneNum));

  if (emailExists) {
    toast_error("Email already exists");
    return false;
  }

  if (phoneNumExists) {
    toast_error("Phone number already exists");
    return false;
  }

  if (isNaN(phone_num_input.value)) {
    console.log(phone_num_input.value);
    toast_error("Phone number is not valid");
    return false;
  }

  if (!birthdate_input.checkValidity()) {
    console.log(birthdate_input.value);
    return false;
  }

  toast_success("New customer added!");
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
