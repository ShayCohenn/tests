from flask import Blueprint, request, jsonify
from models import Books, db

books = Blueprint('books',__name__)

#------------------------------CREATE A NEW BOOK------------------------------

@books.route('/new/json', methods=['POST'])
def add_books():
    data = request.get_json()
    books_data = data 

    for book in books_data:
        category = book['category']
        name = book['name']
        author = book['author']
        release_date = book['release_date']
        ISBN = book['ISBN']
        book_type = book['book_type']
        status = book['status']

        book = Books(category, name, author, release_date, ISBN, book_type, status)
        db.session.add(book)

    db.session.commit()
    return 'success'

@books.route('/new', methods=['POST'])
def add_books2():
    category = request.form.get('category')
    name = request.form.get('book_name')
    author = request.form.get('author')
    release_date = request.form.get('release_date')
    ISBN = request.form.get('ISBN')
    book_type = request.form.get('book_type')
    status = 'Available'

    book = Books(category, name, author, release_date, ISBN, book_type, status)
    db.session.add(book)
    db.session.commit()
    return 'success 2'


#------------------------------DISPLAY ALL BOOKS------------------------------

@books.route('/all')
def show_books():
    books_list = [book.to_dict() for book in Books.query.all()]
    return jsonify(books_list)

#------------------------------DISPLAY A SPECIFIC BOOK------------------------------

@books.route('/<int:id>')
def show_book_id(id):
    book = Books.query.get(id)
    if book is None: return f'book with id:"{id}" not found'
    return jsonify(book.to_dict())

#------------------------------UPDATE TYPE AND STATUS------------------------------

@books.route('/<int:id>/edit', methods=['PUT'])
def edit_book(id):
    book = Books.query.get(id)
    if book is None: return f'book with id:"{id}" not found'
    if 'book_type' in request.json:
        book.book_type = request.json['book_type']
    if 'status' in request.json:
        book.status = request.json['status']
    db.session.commit()
    return 'book updated'