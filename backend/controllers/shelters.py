from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Shelter, User
from services.serp_api_integration import search_resources_service
from db import db
import math

shelters_bp = Blueprint("shelters", __name__)

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
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * \
        math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance


@shelters_bp.route("/shelter-resources-from-serp", methods=["GET"])
def get_food_resources():
    """Get all shelter resources with optional filters and sorting by distance"""
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    # we'll need zipcode to call SERP API
    zipcode = request.args.get('zipcode')

    if not zipcode:
        return jsonify({"error": "zipcode parameter is required"}), 400

    try:
        food_resources = search_resources_service(
            zipcode=zipcode, resource_type="shelter")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    results = []

    for resource in food_resources:
        resource_data = resource

        # Parse GPS coordinates (assuming format: {"latitude": x, "longitude": y})
        gps = resource_data.get('gps_coordinates')
        if gps:
            resource_lat = gps.get('latitude')
            resource_lon = gps.get('longitude')

            if resource_lat is not None and resource_lon is not None:
                if lat and lon:
                    distance = calculate_distance(
                        lat, lon, resource_lat, resource_lon)
                    resource_data['distance'] = round(distance, 2)
                    resource_data['lat'] = resource_lat
                    resource_data['lon'] = resource_lon
                else:
                    resource_data['distance'] = None
            else:
                resource_data['distance'] = None
        else:
            resource_data['distance'] = None

        results.append(resource_data)

    if lat and lon:
        results = sorted(results, key=lambda x: x.get(
            'distance', float('inf')))

    return jsonify(results), 200


@shelters_bp.route("/shelters-by-users", methods=["GET"])
def get_shelters():
    """Get all shelters with optional accessibility filters"""
    # Parse filter parameters
    wheelchair = request.args.get('wheelchair', type=bool)
    visual = request.args.get('visual', type=bool)
    audio = request.args.get('audio', type=bool)

    # Get user location for distance sorting
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    # Base query
    query = Shelter.query

    # Apply accessibility filters
    if wheelchair:
        query = query.filter_by(wheelchair_accessible=True)
    if visual:
        query = query.filter_by(visual_accommodations=True)
    if audio:
        query = query.filter_by(audio_accommodations=True)

    # Get all filtered shelters
    shelters = query.all()

    # Calculate distances if location provided
    results = []
    for shelter in shelters:
        shelter_data = shelter.to_dict()

        # Parse shelter location (assuming format "lat,lon" in the location field)
        try:
            shelter_lat, shelter_lon = map(float, shelter.location.split(','))
            if lat and lon:
                distance = calculate_distance(
                    lat, lon, shelter_lat, shelter_lon)
                shelter_data['distance'] = round(distance, 2)
                shelter_data['lat'] = shelter_lat
                shelter_data['lon'] = shelter_lon
        except:
            shelter_data['distance'] = None

        results.append(shelter_data)

    # Sort by distance if location provided
    if lat and lon:
        results = sorted(results, key=lambda x: x.get(
            'distance', float('inf')))

    return jsonify(results), 200


@shelters_bp.route("/shelters", methods=["POST"])
@jwt_required()
def create_shelter():
    """Create a new shelter"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins and volunteers can create shelters
    if current_user.role not in ('admin', 'volunteer'):
        return jsonify({"message": "Not authorized to create shelters"}), 403

    data = request.get_json()

    # Create new shelter with accessibility information
    shelter = Shelter(
        name=data.get('name'),
        location=data.get('location'),
        wheelchair_accessible=data.get('wheelchair_accessible', False),
        visual_accommodations=data.get('visual_accommodations', False),
        audio_accommodations=data.get('audio_accommodations', False),
        organization_id=data.get(
            'organization_id', current_user.organization_id)
    )

    db.session.add(shelter)
    db.session.commit()

    return jsonify(shelter.to_dict()), 201


@shelters_bp.route("/shelters/<int:shelter_id>", methods=["GET"])
def get_shelter(shelter_id):
    """Get a specific shelter by ID"""
    shelter = Shelter.query.get_or_404(shelter_id)
    return jsonify(shelter.to_dict()), 200


@shelters_bp.route("/shelters/<int:shelter_id>", methods=["PUT"])
@jwt_required()
def update_shelter(shelter_id):
    """Update a shelter's information"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins and volunteers can update shelters
    if current_user.role not in ('admin', 'volunteer'):
        return jsonify({"message": "Not authorized to update shelters"}), 403

    shelter = Shelter.query.get_or_404(shelter_id)
    data = request.get_json()

    # Update fields if provided
    if 'name' in data:
        shelter.name = data['name']
    if 'location' in data:
        shelter.location = data['location']
    if 'wheelchair_accessible' in data:
        shelter.wheelchair_accessible = data['wheelchair_accessible']
    if 'visual_accommodations' in data:
        shelter.visual_accommodations = data['visual_accommodations']
    if 'audio_accommodations' in data:
        shelter.audio_accommodations = data['audio_accommodations']

    db.session.commit()

    return jsonify(shelter.to_dict()), 200


@shelters_bp.route("/shelters/<int:shelter_id>", methods=["DELETE"])
@jwt_required()
def delete_shelter(shelter_id):
    """Delete a shelter"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins can delete shelters
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to delete shelters"}), 403

    shelter = Shelter.query.get_or_404(shelter_id)
    db.session.delete(shelter)
    db.session.commit()

    return jsonify({"message": "Shelter deleted successfully"}), 200
