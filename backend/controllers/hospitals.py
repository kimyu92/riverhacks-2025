from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Hospital, User
from db import db
import math

hospitals_bp = Blueprint("hospitals", __name__)

# Helper for calculating distance between two geocoordinates
def calculate_distance(lat1, lon1, lat2, lon2):
    # Earth radius in kilometers
    R = 6371.0

    # Convert degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    # Difference in coordinates
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    # Haversine formula
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance

@hospitals_bp.route("/hospitals", methods=["GET"])
def get_hospitals():
    """Get all hospitals with optional filters and sorting by distance"""
    # Parse filter parameters
    er_only = request.args.get('er_only', type=bool)
    wheelchair = request.args.get('wheelchair', type=bool)
    uninsured = request.args.get('uninsured', type=bool)

    # Get user location for distance sorting
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    # Base query
    query = Hospital.query

    # Apply filters
    if er_only:
        query = query.filter_by(has_emergency_room=True)
    if wheelchair:
        query = query.filter_by(wheelchair_accessible=True)
    if uninsured:
        query = query.filter_by(accepts_uninsured=True)

    # Get all filtered hospitals
    hospitals = query.all()

    # Calculate distances if location provided
    results = []
    for hospital in hospitals:
        hospital_data = hospital.to_dict()

        # Parse hospital location (assuming format "lat,lon" in the location field)
        try:
            hospital_lat, hospital_lon = map(float, hospital.location.split(','))
            if lat and lon:
                distance = calculate_distance(lat, lon, hospital_lat, hospital_lon)
                hospital_data['distance'] = round(distance, 2)
                hospital_data['lat'] = hospital_lat
                hospital_data['lon'] = hospital_lon
        except:
            hospital_data['distance'] = None

        results.append(hospital_data)

    # Sort by distance if location provided
    if lat and lon:
        results = sorted(results, key=lambda x: x.get('distance', float('inf')))

    return jsonify(results), 200

@hospitals_bp.route("/hospitals", methods=["POST"])
@jwt_required()
def create_hospital():
    """Create a new hospital"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins can add hospitals
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to create hospitals"}), 403

    data = request.get_json()

    # Create new hospital with accessibility information
    hospital = Hospital(
        name=data.get('name'),
        location=data.get('location'),
        wheelchair_accessible=data.get('wheelchair_accessible', True),
        has_emergency_room=data.get('has_emergency_room', True),
        accepts_uninsured=data.get('accepts_uninsured', False),
        phone_number=data.get('phone_number')
    )

    db.session.add(hospital)
    db.session.commit()

    return jsonify(hospital.to_dict()), 201

@hospitals_bp.route("/hospitals/<int:hospital_id>", methods=["GET"])
def get_hospital(hospital_id):
    """Get a specific hospital by ID"""
    hospital = Hospital.query.get_or_404(hospital_id)
    return jsonify(hospital.to_dict()), 200

@hospitals_bp.route("/hospitals/<int:hospital_id>", methods=["PUT"])
@jwt_required()
def update_hospital(hospital_id):
    """Update a hospital's information"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins can update hospitals
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to update hospitals"}), 403

    hospital = Hospital.query.get_or_404(hospital_id)
    data = request.get_json()

    # Update fields if provided
    if 'name' in data:
        hospital.name = data['name']
    if 'location' in data:
        hospital.location = data['location']
    if 'wheelchair_accessible' in data:
        hospital.wheelchair_accessible = data['wheelchair_accessible']
    if 'has_emergency_room' in data:
        hospital.has_emergency_room = data['has_emergency_room']
    if 'accepts_uninsured' in data:
        hospital.accepts_uninsured = data['accepts_uninsured']
    if 'phone_number' in data:
        hospital.phone_number = data['phone_number']

    db.session.commit()

    return jsonify(hospital.to_dict()), 200

@hospitals_bp.route("/hospitals/<int:hospital_id>", methods=["DELETE"])
@jwt_required()
def delete_hospital(hospital_id):
    """Delete a hospital"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins can delete hospitals
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to delete hospitals"}), 403

    hospital = Hospital.query.get_or_404(hospital_id)
    db.session.delete(hospital)
    db.session.commit()

    return jsonify({"message": "Hospital deleted successfully"}), 200
