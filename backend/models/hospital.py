from db import db

class Hospital(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    wheelchair_accessible = db.Column(db.Boolean, default=True)
    has_emergency_room = db.Column(db.Boolean, default=True)
    accepts_uninsured = db.Column(db.Boolean, default=False)
    phone_number = db.Column(db.String(20), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'wheelchair_accessible': self.wheelchair_accessible,
            'has_emergency_room': self.has_emergency_room,
            'accepts_uninsured': self.accepts_uninsured,
            'phone_number': self.phone_number
        }
