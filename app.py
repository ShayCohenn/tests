from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from flask import Flask
from flask_cors import CORS
from models import db, Loans
from books_BP import books
from clients_BP import clients
from loans_BP import loans



app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.sqlite3'
CORS(app)
db.init_app(app)  # Initialize SQLAlchemy with the Flask app
app.register_blueprint(books, url_prefix='/books')
app.register_blueprint(clients, url_prefix='/clients')
app.register_blueprint(loans, url_prefix='/loans')

# Create the scheduler
scheduler = BackgroundScheduler()
scheduler.start()

# Define a function to check loan status
def check_loan_status():
    with app.app_context():
        loans = Loans.query.all()
        current_date = datetime.now().date()

        for loan in loans:
            return_date = datetime.strptime(loan.return_date, "%Y-%m-%d").date()

            if current_date > return_date and loan.status != 'returned':
                loan.status = 'Late'

        db.session.commit()

# Schedule the job to run every 2 seconds
scheduler.add_job(check_loan_status, 'interval', seconds=2)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
