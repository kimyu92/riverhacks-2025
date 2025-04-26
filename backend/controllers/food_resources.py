from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import FoodResource, User
from services.serp_api_integration import search_resources_service
from db import db
import math

food_bp = Blueprint("food", __name__)

# Helper for calculating distance between two geocoordinates (reused from shelters)


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


@food_bp.route("/food-resources-from-serp", methods=["GET"])
def get_food_resources_serp():
    """Get all food resources with optional filters and sorting by distance"""
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    # we'll need zipcode to call SERP API
    zipcode = request.args.get('zipcode')

    if not zipcode:
        return jsonify({"error": "zipcode parameter is required"}), 400

    try:
        food_resources = search_resources_service(
            zipcode=zipcode, resource_type="food")
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


@food_bp.route("/food-resources-by-users", methods=["GET"])
def get_food_resources_users():
    """Get all food resources with optional filters and sorting by distance"""
    # Get user location for distance sorting
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    # Get all food resources
    food_resources = FoodResource.query.all()

    # Calculate distances if location provided
    results = []
    for resource in food_resources:
        resource_data = resource.to_dict()

        # Parse food resource location (assuming format "lat,lon" in the location field)
        try:
            resource_lat, resource_lon = map(
                float, resource.location.split(','))
            if lat and lon:
                distance = calculate_distance(
                    lat, lon, resource_lat, resource_lon)
                resource_data['distance'] = round(distance, 2)
                resource_data['lat'] = resource_lat
                resource_data['lon'] = resource_lon
        except:
            resource_data['distance'] = None

        results.append(resource_data)

    # Sort by distance if location provided
    if lat and lon:
        results = sorted(results, key=lambda x: x.get(
            'distance', float('inf')))

    return jsonify(results), 200


@food_bp.route("/food-resources", methods=["POST"])
@jwt_required()
def create_food_resource():
    """Create a new food resource"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins and volunteers can create food resources
    if current_user.role not in ('admin', 'volunteer'):
        return jsonify({"message": "Not authorized to create food resources"}), 403

    data = request.get_json()

    # Create new food resource
    food_resource = FoodResource(
        name=data.get('name'),
        location=data.get('location'),
        organization_id=data.get(
            'organization_id', current_user.organization_id)
    )

    db.session.add(food_resource)
    db.session.commit()

    return jsonify(food_resource.to_dict()), 201


@food_bp.route("/food-resources/<int:resource_id>", methods=["GET"])
def get_food_resource(resource_id):
    """Get a specific food resource by ID"""
    food_resource = FoodResource.query.get_or_404(resource_id)
    return jsonify(food_resource.to_dict()), 200


@food_bp.route("/food-resources/<int:resource_id>", methods=["PUT"])
@jwt_required()
def update_food_resource(resource_id):
    """Update a food resource's information"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins and volunteers can update food resources
    if current_user.role not in ('admin', 'volunteer'):
        return jsonify({"message": "Not authorized to update food resources"}), 403

    food_resource = FoodResource.query.get_or_404(resource_id)
    data = request.get_json()

    # Update fields if provided
    if 'name' in data:
        food_resource.name = data['name']
    if 'location' in data:
        food_resource.location = data['location']

    db.session.commit()

    return jsonify(food_resource.to_dict()), 200


@food_bp.route("/food-resources/<int:resource_id>", methods=["DELETE"])
@jwt_required()
def delete_food_resource(resource_id):
    """Delete a food resource"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins can delete food resources
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to delete food resources"}), 403

    food_resource = FoodResource.query.get_or_404(resource_id)
    db.session.delete(food_resource)
    db.session.commit()

    return jsonify({"message": "Food resource deleted successfully"}), 200
