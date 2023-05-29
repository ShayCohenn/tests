// 1 → Creating the books list, book selection, search
// 2 → Creating the customers list, customer selection, search
// 3 → Handling the dates, cant pick a date from the past
// 4 → Validating the date according to the book type
// 5 → Defining the reset method
// 6 → Executing the loan

const MY_SERVER = "http://127.0.0.1:5000"
const max_days_type1 = 10
const max_days_type2 = 5
const max_days_type3 = 2
let max_days = 0
let book_ID_num = ""
let selected_book_ID = null;
let selected_customer_id = null;
let error_message = ""

// 1 --------------------------------------- BOOKS LIST ----------------------------------------
let books_list = []

const load_books = async () => {
    const books = await axios.get(MY_SERVER + "/books/all");
    books_list = books.data.map(book => {
        (book.book_type == "1") ? (max_days = max_days_type1) : // Calculate the max days for loan by type
            (book.book_type == "2") ? (max_days = max_days_type2) : (max_days = max_days_type3);
        const card = book_template.content.cloneNode(true).children[0]; // Cloning the card template
        card.children[0].innerHTML = book.name;
        card.children[1].innerHTML = `author: ${book.author}`;
        card.children[2].innerHTML = `category: ${book.category}`;
        card.children[3].innerHTML = `type: ${book.book_type}  (up to ${max_days} days)`;
        card.children[4].innerHTML = `ISBN: ${book.ISBN}`;
        card.children[5].innerHTML = `ID: ${book.id}`;
        if (book.status == "Available") { // Show only the Available books for loan
            book_options.append(card);
            return {
                name: book.name,
                author: book.author,
                category: book.category,
                book_type: book.book_type,
                ISBN: book.ISBN,
                id: book.id,
                element: card
            };
        } else {
            return null; // Return null for non-Available books to exclude them from books_list
        }
    });
    // Remove null entries from books_list
    books_list = books_list.filter(book => book !== null);
};
load_books();

//--------Selected item action--------
const update_book_name = (selectedLi) => {
    book_search.value = selectedLi.children[0].textContent; //Search bar value = selected book
    selected_book_ID = selectedLi.children[5].textContent.replace('ID: ', ''); //Saving the ID of the selected book
    books_list.forEach(book => { //Hiding all the books except the selected one
        const isVisible = (book.id == selected_book_ID);
        book.element.classList.toggle("hide", !isVisible);
    });
};
//---- Search books ---------
book_search.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    books_list.forEach(book => {
        const isVisible = book.name.toLowerCase().includes(value) ||
            book.author.toLowerCase().includes(value) ||
            book.category.toLowerCase().includes(value) ||
            book.book_type.toString().includes(value) ||
            book.ISBN.toString().includes(value)
        book.element.classList.toggle("hide", !isVisible); // Hide the books that don't match 
    })
});

// 2 ------------------------------------ CUSTOMER LIST ------------------------------------
let customers_list = []

const load_customers = async () => {
    const customers = await axios.get(MY_SERVER + "/clients/all");
    customers_list = customers.data.map(customer => {
        const card = customer_template.content.cloneNode(true).children[0]; // Cloning the card template
        card.children[0].innerHTML = customer.name;
        card.children[1].innerHTML = `email: ${customer.email}`;
        card.children[2].innerHTML = `phone number: ${customer.phone_num}`;
        card.children[3].innerHTML = `ID: ${customer.id}`;
        if (customer.status == "Active") { // Showing only the Active customers
            customer_options.append(card);
            return {
                name: customer.name,
                email: customer.email,
                phone_num: customer.phone_num,
                id: customer.id,
                element: card
            }
        }
        else
            return null; // Return null for non-Active customers to exclude them from custoemrs_list
    });
    // Remove null entries from books_list
    customers_list = customers_list.filter(customer => customer !== null);
}
load_customers()

//------------- Selected item action 
const update_customer_name = (selectedLi) => {
    customer_search.value = selectedLi.children[0].textContent; // Search bar value = selected customer
    selected_customer_id = selectedLi.children[3].textContent.replace('ID: ', ''); // Saving the ID of the selected customer
    customers_list.forEach(customer => { // Hiding all the customers except the selected one
        const isVisible = (customer.id == selected_customer_id);
        customer.element.classList.toggle("hide", !isVisible);
    });
};
//------- Search customers
customer_search.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    customers_list.forEach(customer => {
        const isVisible = customer.name.toLowerCase().includes(value) ||
            customer.email.toLowerCase().includes(value) ||
            customer.phone_num.toString().includes(value) ||
            customer.id.toString().includes(value)
        customer.element.classList.toggle("hide", !isVisible); // Hide the customers that don't match
    })
});

//3 -------------------------------------- DATES -----------------------------------------

//--------------- Cant pick a date from the past ----------------
let loan_validation = false
document.addEventListener('DOMContentLoaded', () => {
    let year = new Date().getFullYear();
    let month = (new Date().getMonth() + 1).toString().padStart(2, '0');// Example (if month is may I get 4 this line turns it into "05")
    let day = new Date().getDate();

    let formattedDate = year + '-' + month + '-' + day;
    fromDate.value = formattedDate;

    fromDate.addEventListener('input', () => {
        let selectedDate = new Date(this.value);

        let minDate = new Date(year, month - 1, day); // Set the minimum selectable date to today

        if (selectedDate < minDate) {
            this.value = formattedDate; // Reset to the current date if an invalid date is selected
        }
    });
});

//4-------------------------------------- VALIDATE LOAN TYPE ------------------------------------------
toDate.addEventListener("input", () => {
    const from = new Date(fromDate.value)
    const to = new Date(toDate.value);

    const time_difference = Math.abs(to.getTime() - from.getTime());
    const days_difference = Math.ceil(time_difference / (1000 * 60 * 60 * 24));

    books_list.forEach(book => {
        if (selected_book_ID == book.id) {
            (book.book_type == 1 && days_difference <= max_days_type1) ||
                (book.book_type == 2 && days_difference <= max_days_type2) ||
                (book.book_type == 3 && days_difference <= max_days_type3) ?
                (loan_validation = true) : loan_validation = false   // if days difference is less than max days loan is valid else no
        }
    })
});

// ---------------------- Reset function -----------------------
const reset_page = () => {
    book_search.value = "";
    customer_search.value = "";
    fromDate.value = "";
    toDate.value = "";

    selected_book_ID = null;
    selected_customer_id = null;
    loan_validation = false;
    flexCheckDefault.checked = false

    load_books()
    load_customers()
}

// -------------------------------------- EXECUTE THE LOAN ----------------------------------------------
const exec_loan = async () => {
    const loanButton = document.getElementById("loan_btn");
    loanButton.disabled = true; // Disable the loan button to not allow spams
    if (!selected_book_ID) {
        console.error("No book selected")
        toast_error("Please select a Book!")
        loanButton.disabled = false; // Re-enable the button
    }
    else if (!selected_customer_id) {
        console.error("No customer selected")
        toast_error("Please select a Customer!")
        loanButton.disabled = false; // Re-enable the button
    }
    else {
        if (!loan_validation) {
            console.error("invalid date");
            toast_error("Invalid Date!")
            loanButton.disabled = false; // Re-enable the button
        }
        else if (!flexCheckDefault.checked) {
            console.error("not confirmed");
            toast_error("You didnt confirm the loan!")
            loanButton.disabled = false; // Re-enable the button
        }
        else {
            const bookId = parseInt(selected_book_ID);
            const customerId = parseInt(selected_customer_id);
            const loanDate = fromDate.value;
            const returnDate = toDate.value;

            const data = { // Creating the json to POST to the server
                book_id: bookId,
                customer_id: customerId,
                loan_date: loanDate,
                return_date: returnDate,
                status: "on time"
            };
            const book_status_change = { status: "on loan" }

            try {
                const post = await axios.post(MY_SERVER + "/loans/new", data);// POSTing the data to the server
                // Changing the status of the loaned book
                const book_status = await axios.put(`${MY_SERVER}/books/${bookId}/edit`, book_status_change)
                toast_success("Loan created successfuly!")
            } catch (error) {
                console.error(error);
                toast_error("Unexpected Error")
            } finally {
                setTimeout(() => {
                    loanButton.disabled = false; // Re-enable the button after a delay
                }, 3000);

                // ------ Reset the form fields
                reset_page()
            }
        }
    }
}

//------------------------------ DEFINING THE TOASTIFY ------------------------------

const toast_success = (message) => {
    Toastify({
        text: message,
        duration: 3000, // Duration in milliseconds
        close: true, // Show close button
        gravity: "top", // Position the toast at the top of the page
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
        gravity: "top", // Position the toast at the top of the page
        position: "center", // Center the toast horizontally
        backgroundColor: "#ff3333b1", // Set the background color
        style: {
            color: "#000000", // Set the text color to white
            fontWeight: "bold"
        }
    }).showToast();
};