from db import db

class Organization(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(120), unique=True, nullable=False)
  volunteers = db.relationship('User', backref='organization', lazy=True)
  shelters = db.relationship('Shelter', backref='organization', lazy=True)
  foods = db.relationship('FoodResource', backref='organization', lazy=True)

  def to_dict(self):
    return {
      'id': self.id,
      'name': self.name,
      'volunteers': [volunteer.to_dict() for volunteer in self.volunteers] if self.volunteers else []
    }
