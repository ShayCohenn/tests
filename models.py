from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Books(db.Model):
    id = db.Column('book_id', db.Integer, primary_key=True)
    category = db.Column(db.String(100))
    name = db.Column(db.String(100))
    author = db.Column(db.String(100))
    release_date = db.Column(db.String(100))
    ISBN = db.Column(db.Integer)
    book_type = db.Column(db.Integer)
    status = db.Column(db.String(100))

    def __init__(self,category, name, author, release_date, ISBN, book_type, status):
        self.category = category
        self.name = name
        self.author = author
        self.release_date = release_date
        self.ISBN = ISBN
        self.book_type = book_type
        self.status = status

    def to_dict(self):
        return {
            'id': self.id,
            'category':self.category,
            'name': self.name,
            'author': self.author,
            'release_date': self.release_date,
            'ISBN': self.ISBN,
            'book_type': self.book_type,
            'status': self.status
        }

class Clients(db.Model):
    id = db.Column('client_id', db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    phone_num = db.Column(db.String, unique=True)
    address = db.Column(db.String(100))
    birthDate = db.Column(db.String(100))
    status = db.Column(db.String(100))

    def __init__(self, name, email, phone_num, address, birthDate, status):
        self.name = name
        self.email = email
        self.phone_num = phone_num
        self.address = address
        self.birthDate = birthDate
        self.status = status

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,  
            'email': self.email,
            'phone_num':self.phone_num,
            'address': self.address,
            'birthDate': self.birthDate,
            'status':self.status
        }
       
class Loans(db.Model):
    id = db.Column('loan_id', db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'))
    book_id = db.Column(db.Integer, db.ForeignKey('books.book_id')) 
    loan_date = db.Column(db.String(100))
    return_date = db.Column(db.String(100))
    status = db.Column(db.String(100))

    client = db.relationship('Clients', foreign_keys=[client_id])
    book = db.relationship('Books', foreign_keys=[book_id])

    def __init__(self, client_id, book_id, loan_date, return_date, status):
        self.client_id = client_id
        self.book_id = book_id
        self.loan_date = loan_date
        self.return_date = return_date
        self.status = status

    def to_dict(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'book_id': self.book_id,
            'loan_date': self.loan_date,
            'return_date': self.return_date,
            'status': self.status
        }
