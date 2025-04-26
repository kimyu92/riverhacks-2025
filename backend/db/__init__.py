from flask_sqlalchemy import SQLAlchemy

# Initialize the SQLAlchemy db instance
db = SQLAlchemy()

# Import seed function to make it accessible via db module
from .seed import seed_database
