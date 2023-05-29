/*
1 → Update the status text color according to the status
2 → Load customers method
3 → Filter table method - filters and searchbar logic
4 → Add eventListeners to the input fields and load the customers
*/

const MY_SERVER = "http://127.0.0.1:5000";
result_found = 0

// 1 --------------------------------- STATUS COLOR UPDATE --------------------------------------

const updateColors = () => {
    const rows = document.querySelectorAll("#table_body tr");
    for (const row of rows) {
        const statusColumn = row.querySelector(".stts");
        if (statusColumn.textContent === "Active") {
            row.classList.remove("disabled-customer");
            statusColumn.style.color = "green";
        } else {
            row.classList.add("disabled-customer");
        }
    }
};

// 2 --------------------------------- LOAD CUSTOMERS -----------------------------------------

const loadCustomers = async () => {
    const allCustomers = await axios.get(MY_SERVER + "/clients/all");
    const customerData = allCustomers.data;

    const tableBody = document.getElementById("table_body");
    tableBody.innerHTML = ""; // Clear the table body before populating

    // Iterate over each customer entry
    for (const customer of customerData) {
        result_found++

        // Create a new row for the customer
        const row = document.createElement("tr");

        // Populate the row with customer data
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone_num}</td>
            <td>${customer.address}</td>
            <td>${customer.birthDate}</td>
            <td class="stts">${customer.status}</td>
            <td><button class="btn btn-primary">edit</button></td>`;

        // Add the row to the table body
        tableBody.appendChild(row);
    }
    res_found.textContent = `${result_found} results found`
    updateColors();
};

// 3 -------------------------------------- FILTER TABLE METHOD --------------------------------------

const filterCustomerTable = () => {
    const searchValue = search.value.toLowerCase();
    // Array of all the search filter checkboxes
    const searchFilter = Array.from(document.querySelectorAll('.top-row input:checked')).map(checkbox => checkbox.id);

    // Array of all the status filter checkboxes
    const statusFilter = Array.from(document.querySelectorAll('.bottom-row input:checked')).map(checkbox => checkbox.id);
    const tableRows = document.querySelectorAll("#table_body tr");

    // Reset result_found
    result_found = 0;

    // Searching the table row by row
    tableRows.forEach((row) => {
        const columns = row.getElementsByTagName("td");
        let matchFound = false;
        let statusFound = true;

        const columnsArray = Array.from(columns); // Turning the HTML collection into an array
        columnsArray.forEach((column) => {
            const columnValue = column.textContent.toLowerCase();
            // If no checkbox was selected
            if (searchFilter.length === 0 && columnValue.includes(searchValue)) {
                matchFound = true;
            } else if (searchFilter.length > 0) { // If one or more checkboxes were selected
                if ((searchFilter.includes("customer_id") && columnsArray[0].textContent === (searchValue)) || searchValue == "") {
                    matchFound = true;
                } else if (searchFilter.includes("customer_name") && columnsArray[1].textContent.toLowerCase().includes(searchValue)) {
                    matchFound = true;
                } else if (searchFilter.includes("email") && columnsArray[2].textContent.toLowerCase().includes(searchValue)) {
                    matchFound = true;
                } else if (searchFilter.includes("phone_num") && columnsArray[3].textContent.toLowerCase().includes(searchValue)) {
                    matchFound = true;
                }
                else if (searchFilter.includes("address") && columnsArray[4].textContent.toLowerCase().includes(searchValue)) {
                    matchFound = true;
                }
            }
        });

        // Check the status filter if any checkbox is checked
        if (statusFilter.length > 0) {
            const statusColumn = row.querySelector(".stts"); // Checking the status column
            if (statusFilter.includes("active_checkbox") && statusColumn && statusColumn.textContent === "Active") {
                statusFound = true;
            } else if (statusFilter.includes("inactive_checkbox") && statusColumn && statusColumn.textContent === "Inactive") {
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
};

// 4 --------------------------- Add event listeners to the search input and filter checkboxes ---------------------

document.getElementById("search").addEventListener("input", filterCustomerTable);

const filterCheckboxes = document.querySelectorAll('.top-row input[type="checkbox"], .bottom-row input[type="checkbox"]');
filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterCustomerTable);
});
loadCustomers(); // Load the custoemrs