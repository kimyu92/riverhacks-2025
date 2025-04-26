from db import db

class Shelter(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(120), nullable=False)
  location = db.Column(db.String(255), nullable=False)
  wheelchair_accessible = db.Column(db.Boolean, default=False)
  visual_accommodations = db.Column(db.Boolean, default=False)
  audio_accommodations = db.Column(db.Boolean, default=False)
  organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'), nullable=False)

  def to_dict(self):
    return {
      'id': self.id,
      'name': self.name,
      'location': self.location,
      'wheelchair_accessible': self.wheelchair_accessible,
      'visual_accommodations': self.visual_accommodations,
      'audio_accommodations': self.audio_accommodations,
      'organization_id': self.organization_id
    }
