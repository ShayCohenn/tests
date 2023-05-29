from flask import Blueprint, request, jsonify
from models import Loans, db

loans = Blueprint('loans', __name__)

#------------------------------CREATE A NEW LOAN------------------------------

@loans.route('/new', methods=['POST'])
def add_loan():
    data = request.get_json()
    customer_id = data['customer_id']
    book_id = data['book_id']
    loan_date = data['loan_date']
    return_date = data['return_date']
    status = data['status']

    loan = Loans(customer_id, book_id, loan_date, return_date, status)
    db.session.add(loan)
    db.session.commit()
    return 'success 3'

#------------------------------DISPLAY ALL LOANS------------------------------

@loans.route('/all')
def show_loans():
    loans_list = [loan.to_dict() for loan in Loans.query.all()]
    return jsonify(loans_list)

#------------------------------DISPLAY A SPECIFIC LOAN------------------------------

@loans.route('/<int:id>')
def show_loan_id(id):
    loan = Loans.query.get(id)
    if loan is None: return f'loan with id:"{id}" not found'
    return jsonify(loan.to_dict())

#------------------------------RETURN A LOAN------------------------------

@loans.route('/<int:id>/return', methods=['PUT'])
def return_loan(id):
    loan = Loans.query.get(id)
    if loan is None: return f'loan with id:"{id}" not found'
    loan.status = 'returned'
    db.session.commit()
    return 'status changed'

#------------------------------ GET ALL LOANS FOR A SPECIFIC CLIENT ------------------------------

@loans.route('/client/<int:client_id>')
def client_loan(client_id):
    loans = Loans.query.filter_by(client_id=client_id).all()
    return jsonify([loan.to_dict() for loan in loans])