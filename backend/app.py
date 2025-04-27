import os
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from db import db
from controllers import register_blueprints
from datetime import timedelta
import logging

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Set up database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://hackuser:hackpass@db:5432/hacksafety')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# SSL certificate paths for JWT (inside Docker container)
CERT_PATH = os.getenv('JWT_SSL_CERT_PATH', '/app/ssl/nginx.crt')
KEY_PATH = os.getenv('JWT_SSL_KEY_PATH', '/app/ssl/nginx.key')

logger.info(f"Looking for SSL certificates at: {CERT_PATH} and {KEY_PATH}")

# For development environment, completely disable signature verification
# IMPORTANT: This should NEVER be done in production
if os.getenv('FLASK_ENV') == 'development' or os.getenv('FLASK_DEBUG') == 'True':
    # Disable JWT verification for development with self-signed certificates
    app.config['JWT_VERIFY'] = False  # Disable signature verification
    app.config['JWT_VERIFY_CLAIMS'] = False  # Disable claims verification
    app.config['JWT_VERIFY_EXPIRATION'] = False  # Disable expiration check for dev
    app.config['JWT_IDENTITY_CLAIM'] = 'sub'  # Default is 'sub'
    logger.warning("⚠️ SECURITY WARNING: JWT verification is DISABLED for development!")
else:
    # Production settings - always verify tokens
    app.config['JWT_VERIFY'] = True
    app.config['JWT_VERIFY_CLAIMS'] = True
    app.config['JWT_VERIFY_EXPIRATION'] = True
    logger.info("JWT verification enabled for production environment")

# Enable debug mode by default
app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'

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
