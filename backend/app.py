import os
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from db import db
from controllers import register_blueprints
from datetime import timedelta
import logging
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable debug mode by default
app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'

# Set up database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://hackuser:hackpass@db:5432/hacksafety')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_ALGORITHM'] = os.getenv('JWT_ALGORITHM', 'RS256')

# Load RSA keys for JWT (use self-signed cert for RS256)
CERT_PATH = os.getenv('JWT_SSL_CERT_PATH', '/app/ssl/nginx.crt')
KEY_PATH = os.getenv('JWT_SSL_KEY_PATH', '/app/ssl/nginx.key')
with open(KEY_PATH, 'rb') as key_file:
  app.config['JWT_PRIVATE_KEY'] = key_file.read()
with open(CERT_PATH, 'rb') as cert_file:
  cert_data = cert_file.read()
  try:
    cert = x509.load_pem_x509_certificate(cert_data, default_backend())
    app.config['JWT_PUBLIC_KEY'] = cert.public_key().public_bytes(
      encoding=serialization.Encoding.PEM,
      format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
  except Exception:
    # Fallback: assume file is already a PEM encoded public key
    app.config['JWT_PUBLIC_KEY'] = cert_data

logger.info(f"Using JWT algorithm: {app.config['JWT_ALGORITHM']}")

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# JWT error handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    logger.info(f"Expired token: {jwt_payload}")
    return jsonify({"message": "The token has expired", "error": "token_expired"}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    logger.error(f"Invalid token error: {error}")
    return jsonify({"message": "Signature verification failed", "error": "invalid_token"}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    logger.warning(f"Missing token error: {error}")
    return jsonify({"message": "Request does not contain an access token", "error": "authorization_required"}), 401

@jwt.needs_fresh_token_loader
def token_not_fresh_callback(jwt_header, jwt_payload):
    return jsonify({"message": "The token is not fresh", "error": "fresh_token_required"}), 401

# Configure CORS
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
  logger.info("Database tables created/updated.")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=app.config['DEBUG'])
