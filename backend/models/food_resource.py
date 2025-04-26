from db import db

class FoodResource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'), nullable=False)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'location': self.location, 'organization_id': self.organization_id}
