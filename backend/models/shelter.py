from db import db

class Shelter(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(120), nullable=False)
  address = db.Column(db.String(255), nullable=False)
  wheelchair_accessible = db.Column(db.Boolean, default=False)
  visual_accommodations = db.Column(db.Boolean, default=False)
  audio_accommodations = db.Column(db.Boolean, default=False)
  organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'), nullable=False)

  # Additional fields to match SERP API format
  title = db.Column(db.String(120))
  phone = db.Column(db.String(20))
  website = db.Column(db.String(255))
  description = db.Column(db.Text)
  place_id = db.Column(db.String(100))
  rating = db.Column(db.Float)
  reviews = db.Column(db.Integer)
  directions = db.Column(db.String(255))
  latitude = db.Column(db.Float)
  longitude = db.Column(db.Float)

  def to_dict(self):
    return {
      'id': self.id,
      'name': self.name,
      'address': self.address,
      'wheelchair_accessible': self.wheelchair_accessible,
      'visual_accommodations': self.visual_accommodations,
      'audio_accommodations': self.audio_accommodations,
      'organization_id': self.organization_id,
      'title': self.title or self.name,
      'phone': self.phone,
      'website': self.website,
      'description': self.description,
      'place_id': self.place_id,
      'rating': self.rating,
      'reviews': self.reviews,
      'directions': self.directions,
      'gps_coordinates': {
        'latitude': self.latitude,
        'longitude': self.longitude
      } if self.latitude and self.longitude else None
    }
