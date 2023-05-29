from flask import Blueprint, request, jsonify
from models import Clients, db

clients = Blueprint('clients', __name__)

@clients.route('/new/json', methods=['POST'])
def add_clients1():
    data = request.get_json()
    client_data = data

    for client in client_data:
        name = client['name']
        email = client['email']
        phone_num = client['phone_num']
        address = client['address']
        birthDate = client['birthDate']
        status = client['status']

        client_obj = Clients(name, email, phone_num, address, birthDate, status)
        db.session.add(client_obj)
    db.session.commit()
    return 'success 2'


@clients.route('/new', methods=['POST'])
def add_clients2():
    name = request.form.get('name')
    email = request.form.get('email')
    phone_num = request.form.get('phone_num')
    address = request.form.get('address')
    birthDate = request.form.get('birthDate')
    status = 'Active'  # Default status for new clients

    client = Clients(name, email, phone_num, address, birthDate, status)
    db.session.add(client)
    db.session.commit()
    return 'success 2'


#------------------------------DISPLAY ALL CUSTOMERS------------------------------

@clients.route('/all')
def show_clients():
    clients_list = [client.to_dict() for client in Clients.query.all()]
    return jsonify(clients_list)

#------------------------------DISPLAY SPECIFIC CUSTOMER------------------------------

@clients.route('/<int:id>')
def show_clients_id(id):
    client = Clients.query.get(id)
    if client is None:return f'client with id:"{id}" not found'
    return jsonify(client.to_dict())

#------------------------------EDIT CLIENT INFO------------------------------

@clients.route('/<int:id>/edit', methods=['PUT'])
def edit_clients_info(id):
    client = Clients.query.get(id)
    if client is None:return f'client with id:"{id}" not found'
    if 'name' in request.json:
        client.name = request.json['name']
    if 'email' in request.json:
        client.email = request.json['email']
    if 'phone_num' in request.json:
        client.phone_num = request.json['phone_num']
    if 'address' in request.json:
        client.address = request.json['address']
    if 'status' in request.json:
        client.status = request.json['status']

    db.session.commit()
    
    return 'Client information updated successfully'
