from db import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
  __tablename__ = 'app_user'  # Set custom table name to avoid conflict with PostgreSQL reserved name

  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=False)
  password_hash = db.Column(db.String(256), nullable=False)  # Increased from 128 to 256
  role = db.Column(db.String(20), default='user')  # 'user', 'admin', 'volunteer'
  organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'), nullable=True)

  def set_password(self, password):
    self.password_hash = generate_password_hash(password)

  def check_password(self, password):
    return check_password_hash(self.password_hash, password)

  def to_dict(self):
    return {'id': self.id, 'username': self.username, 'role': self.role, 'organization_id': self.organization_id}
