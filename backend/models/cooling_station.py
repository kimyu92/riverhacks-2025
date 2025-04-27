from db import db

class CoolingStation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'), nullable=True)

    # Additional fields for SERP API
    title = db.Column(db.String(255), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    place_id = db.Column(db.String(255), nullable=True, unique=True)
    rating = db.Column(db.Float, nullable=True)
    reviews = db.Column(db.Integer, nullable=True)
    directions = db.Column(db.String(255), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)

    def to_dict(self):
        result = {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'organization_id': self.organization_id
        }

        # Add SERP API fields if they exist
        if self.title:
            result['title'] = self.title
        if self.address:
            result['address'] = self.address
        if self.phone:
            result['phone'] = self.phone
        if self.website:
            result['website'] = self.website
        if self.description:
            result['description'] = self.description
        if self.place_id:
            result['place_id'] = self.place_id
        if self.rating:
            result['rating'] = self.rating
        if self.reviews:
            result['reviews'] = self.reviews
        if self.directions:
            result['directions'] = self.directions

        # Add GPS coordinates if they exist
        if self.latitude is not None and self.longitude is not None:
            result['gps_coordinates'] = {
                'latitude': self.latitude,
                'longitude': self.longitude
            }

        return result
