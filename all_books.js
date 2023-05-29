const MY_SERVER = "http://127.0.0.1:5000";
let result_found = 0;

// ------------------------ Update the status color -------------------------
const updateColors = () => {
  const status_columns = document.getElementsByClassName("stts");
  for (const column of status_columns) {
    if (column.textContent === "Available") {
      column.style.color = "green";
    } else if (column.textContent === "Unavailable") {
      column.style.color = "red";
    } else {
      column.style.color = "steelblue";
    }
  }
};

// -------------------------------- Load books function ------------------------------
const loadBooks = async () => {
  const all_books = await axios.get(MY_SERVER + "/books/all");
  // Iterate over each book entry
  for (const book of all_books.data) {
    result_found++;
    // Create a new row for the book
    const row = document.createElement("tr");
    // Populate the row with book data
    row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.category}</td>
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td>${book.release_date}</td>
        <td>${book.ISBN}</td>
        <td>${book.book_type}</td>
        <td class="stts">${book.status}</td>
        <td><button class="btn btn-primary">edit</button></td>`;
    // Add the row to the table body
    table_body.appendChild(row);
  }
  updateColors(); // Change the status color after loading the books
  res_found.textContent = `${result_found} results found`;
};

loadBooks();

// ----------------------------- Filter function -------------------------------
const filterBookTable = () => {
  const search_value = search.value.toLowerCase();
  // Array of all the search filter checkboxes
  const search_filter = Array.from(document.querySelectorAll('.top-row input:checked')).map(checkbox => checkbox.id);

  // Array of all the status filter checkboxes
  const status_filter = Array.from(document.querySelectorAll('.bottom-row input:checked')).map(checkbox => checkbox.id);
  const table_rows = document.querySelectorAll("#table_body tr");

  // Reset result_found
  result_found = 0;

  // Searching the table row by row
  table_rows.forEach((row) => {
    const columns = row.getElementsByTagName("td");
    let matchFound = false;
    let statusFound = true;

    const columns_array = Array.from(columns); // Turning the HTML collection to an array
    columns_array.forEach(column => {
      const column_value = column.textContent.toLowerCase();
      // If no checkbox was selected
      if (search_filter.length == 0 && column_value.includes(search_value)) {
        matchFound = true;
      }
      else if (search_filter.length > 0) { // If one or more checkboxes were selected
        // column_array[index] is the index of the column in the array, not checking index = 4 because no need to search release date
        if (((search_filter.includes("book_id") && columns_array[0].textContent === (search_value)) || search_value === "") ||
          (search_filter.includes("category") && columns_array[1].textContent.toLowerCase().includes(search_value)) ||
          (search_filter.includes("book_name") && columns_array[2].textContent.toLowerCase().includes(search_value)) ||
          (search_filter.includes("author") && columns_array[3].textContent.toLowerCase().includes(search_value)) ||
          (search_filter.includes("isbn") && columns_array[5].textContent.toLowerCase().startsWith(search_value)) ||
          (search_filter.includes("type") && columns_array[6].textContent.toLowerCase().includes(search_value))) {
          matchFound = true;
        }
      }
    });

    // Check the status filter if any checkbox is checked
    if (status_filter.length > 0) {
      const status_column = row.querySelector(".stts"); // Checking the status column
      if ((status_filter.includes("available_checkbox") && status_column && status_column.textContent === "Available") ||
        (status_filter.includes("on_loan_checkbox") && status_column && status_column.textContent === "on loan") ||
        (status_filter.includes("removed_checkbox") && status_column && status_column.textContent === "Removed")||
        (status_filter.includes("unavailable_checkbox") && status_column && status_column.textContent === "Unavailable")) {
        statusFound = true;
      } else {
        statusFound = false;
      }
    }

    // Show/hide the row based on the search result
    if (matchFound && statusFound) {
      row.style.display = "";
      result_found++;
    } else {
      row.style.display = "none";
    }
  });

  res_found.textContent = `${result_found} results found`;
  if(result_found === 0){
    no_res_found.textContent = "Didn't find anything :/"
  }
};

// Add event listener for search input
const search = document.getElementById("search");
search.addEventListener("input", filterBookTable);

// Add event listeners for status_filter_checkboxes
const status_filter_checkboxes = document.querySelectorAll('.filter-container input[type="checkbox"]');
status_filter_checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filterBookTable);
});
