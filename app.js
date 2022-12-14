const form = document.getElementById('book-form');
const deleteBook = document.querySelector('.delete');
const bookList = document.getElementById('book-list');

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    //Has no properties
    addBookToList(book) {
        const list = document.getElementById('book-list');
    
        const row = document.createElement('tr');
        //Insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
        list.appendChild(row);
    }

    clearFields() {
        document.getElementById('title').value = "";
        document.getElementById('author').value = "";
        document.getElementById('isbn').value = "";
    }

    showAlert(message, className) {
        //create a div
        const div = document.createElement('div');
        //Add classes
        div.className = `alert ${className}`
        //Add text
        div.appendChild(document.createTextNode(message));
        //Get parent
        const container = document.querySelector('.container');
    
        const form  = document.getElementById('book-form')
    
        //Insert alert
        container.insertBefore(div, form);
    
        //Timeout after 3 sec
        setTimeout(function() {
            document.querySelector('.alert').remove()
        }, 3000)
    }

    bookDelete(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }
    
    
}

//Local storage class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books;
    }
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {

            const ui = new UI();

            ui.addBookToList(book);
        })
    }
    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {

        const books = Store.getBooks();

        books.forEach(function(book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event Listeners
document.addEventListener('DOMContentLoaded', Store.displayBooks());
form.onsubmit = function(e) {
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

    const book = new Book(title, author, isbn);

    //Instanciate UI
    const ui = new UI();

    //Validate
    if (title === "" || author === "" || isbn === "") {
        //Eror alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        //Add book to list
        ui.addBookToList(book);

        //Add to LS
        Store.addBook(book);

        //Show success
        ui.showAlert('Book Added', 'success')

        //clear fileds
        ui.clearFields();
    }

    console.log(book);
    e.preventDefault();
}

//Add event listener for delete

bookList.addEventListener('click', function(e) {
    const ui = new UI();
    
    ui.bookDelete(e.target);

    //Delete from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show delete alert
    ui.showAlert('Book Removed!', 'success');
})

