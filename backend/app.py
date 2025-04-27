import os
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from db import db
from controllers import register_blueprints
from datetime import timedelta

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://hackuser:hackpass@db:5432/hacksafety')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')
# Set token to expire after 24 hours
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
# Enable debug mode by default
app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# JWT error handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print(f"Expired token: {jwt_payload}")
    return jsonify({"message": "The token has expired", "error": "token_expired"}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print(f"Invalid token error: {error}")
    return jsonify({"message": "Signature verification failed", "error": "invalid_token"}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    print(f"Missing token error: {error}")
    return jsonify({"message": "Request does not contain an access token", "error": "authorization_required"}), 401

@jwt.needs_fresh_token_loader
def token_not_fresh_callback(jwt_header, jwt_payload):
    return jsonify({"message": "The token is not fresh", "error": "fresh_token_required"}), 401

CORS(
  app,
  supports_credentials=True,
  origins=["https://localhost", "http://localhost", "http://localhost:3000", "https://localhost:443"],
  allow_headers=["Content-Type", "Authorization"],
  methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# Register all blueprints
register_blueprints(app)

# Create database tables if they don't exist
with app.app_context():
  db.create_all()
  print("Database tables created/updated.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=app.config['DEBUG'])
