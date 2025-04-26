import os
from flask import Flask
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from db import db
from controllers import register_blueprints

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://hackuser:hackpass@db:5432/hacksafety')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Register all blueprints
register_blueprints(app)

# Create database tables if they don't exist
with app.app_context():
    db.create_all()
    print("Database tables created/updated.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
